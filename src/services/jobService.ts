import { BadRequestError, NotFoundError } from "../api/errors.js";
import { createJob, getJobById, getJobs } from "../db/queries/jobs.js";
import { getPipelineByKey } from "../db/queries/pipelines.js";

export async function createJobFromWebhook(
  sourceKey: string,
  payload: Record<string, unknown>,
) {
  const pipeline = await getPipelineByKey(sourceKey);

  if (!pipeline) {
    throw new NotFoundError("Pipeline not found");
  }

  console.log("Webhook received for pipeline: ", sourceKey);

  try {
    const job = await createJob({
      pipelineId: pipeline.id,
      payload: payload,
    });

    if (!job) {
      throw new Error("Could not create job");
    }
    return job;
  } catch (err: any) {
    if (err.code === "23505") {
      throw new BadRequestError("Duplicate job");
    }

    throw new Error("Database error");
  }
}

export async function getJob(jobId: string) {
  const job = await getJobById(jobId);
  if (!job) {
    throw new NotFoundError("Job not found");
  }
  return job;
}

export async function getAllJobs() {
  const jobs = await getJobs();
  if (jobs.length === 0) {
    console.log("No jobs found in the database.");
  }
  return jobs;
}
