import type { Job, Pipeline } from "../db/schema.js";
import { getPipelineById } from "../db/queries/pipelines.js";
import { updateJobStatus } from "../db/queries/jobs.js";
import { deliverToSubscribers } from "./deliveryService.js";
import { JobStatus } from "../enums/jobStatus.js";
import { ActionType } from "../enums/actionType.js";
import {
  filterProcessor,
  validateFilterConfig,
  type FilterConfig,
} from "../processors/filter.js";
import {
  extractProcessor,
  validateExtractConfig,
  type ExtractConfig,
} from "../processors/extract.js";
import {
  formatterProcessor,
  validateTemplateConfig,
  type TemplateConfig,
} from "../processors/transform.js";

export async function processJob(job: Job) {
  const pipeline = await getPipelineById(job.pipelineId);

  if (!pipeline) {
    await failJob(job.id, "Pipeline not found");
    return;
  }

  await updateJobStatus(job.id, JobStatus.PROCESSING);
  console.log(
    `[Worker] Processing job ${job.id} with action ${pipeline.actionType}`,
  );

  switch (pipeline.actionType as ActionType) {
    case ActionType.FILTER:
      await processFilterJob(job, pipeline);
      return;

    case ActionType.EXTRACT:
      await processExtractJob(job, pipeline);
      return;

    case ActionType.TRANSFORM:
      await processTransformJob(job, pipeline);
      return;

    default:
      await failJob(job.id, "Unknown action type");
  }
}

async function processFilterJob(job: Job, pipeline: Pipeline) {
  if (!pipeline.config || !validateFilterConfig(pipeline.config)) {
    await failJob(job.id, "Invalid filter config");
    return;
  }

  const payload = job.payload as Record<string, unknown>;

  if (!payload || typeof payload.amount !== "number") {
    await failJob(job.id, "Invalid payload");
    return;
  }

  const result = filterProcessor(payload, pipeline.config as FilterConfig);

  if (!result) {
    await updateJobStatus(job.id, JobStatus.COMPLETED, new Date(), {
      skipped: true,
    });
    console.log(`[Worker] Job ${job.id} skipped (FILTER condition not met)`);
    return;
  }

  await completeAndDeliver(job.id, pipeline.id, result);
}

async function processExtractJob(job: Job, pipeline: Pipeline) {
  if (!pipeline.config || !validateExtractConfig(pipeline.config)) {
    await failJob(job.id, "Invalid extract config");
    return;
  }

  const payload = job.payload as Record<string, unknown>;

  if (!payload) {
    await failJob(job.id, "Invalid payload");
    return;
  }

  const result = extractProcessor(payload, pipeline.config as ExtractConfig);

  await completeAndDeliver(job.id, pipeline.id, result);
}

async function processTransformJob(job: Job, pipeline: Pipeline) {
  if (!pipeline.config || !validateTemplateConfig(pipeline.config)) {
    await failJob(job.id, "Invalid transform config");
    return;
  }

  const payload = job.payload as Record<string, unknown>;

  if (!payload) {
    await failJob(job.id, "Invalid payload");
    return;
  }

  const config = pipeline.config as TemplateConfig;

  if (config.template.trim().length === 0) {
    await failJob(job.id, "Invalid transform config");
    return;
  }

  const result = formatterProcessor(payload, config);

  await completeAndDeliver(job.id, pipeline.id, { result });
}

async function completeAndDeliver(
  jobId: string,
  pipelineId: string,
  result: Record<string, unknown>,
) {
  const updatedJob = await updateJobStatus(
    jobId,
    JobStatus.COMPLETED,
    new Date(),
    result,
  );

  if (!updatedJob || !updatedJob.result) {
    await failJob(jobId, "Job result missing after update");
    return;
  }

  await deliverToSubscribers({
    jobId: updatedJob.id,
    pipelineId,
    result: updatedJob.result,
  });
}

async function failJob(jobId: string, message: string) {
  await updateJobStatus(jobId, JobStatus.FAILED, new Date(), {
    error: message,
  });
}
