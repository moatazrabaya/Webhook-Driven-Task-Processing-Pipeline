import { NewPipeline } from "../db/schema.js";
import {
  createPipeline,
  deletePipelineById,
  getAllPipelines,
  getPipelineById,
  updatePipelineById,
} from "../db/queries/pipelines.js";
import { BadRequestError, NotFoundError } from "../api/errors.js";
import { createSubscribers } from "../services/subscriberService.js";
import { ActionType } from "../enums/actionType.js";

export type UpdatePipeline = {
  name?: string;
  actionType?: ActionType;
  config?: Record<string, unknown>;
};

export async function createPipelineWithSubscribers(
  pipeline: NewPipeline,
  subscribers: string[],
) {
  try {
    const createdPipeline = await createPipeline(pipeline);

    if (!createdPipeline) {
      throw new Error("Could not create pipeline");
    }

    await createSubscribers(createdPipeline.id, subscribers);

    return createdPipeline;
  } catch (err: any) {
    // PostgreSQL Error Code --> For duplicate key: error.code === "23505"
    if (err.code === "23505") {
      throw new BadRequestError("Duplicate pipeline");
    }
    throw err;
  }
}

export async function getPipelines() {
  const pipelines = await getAllPipelines();
  if (pipelines.length === 0) {
    console.log("No pipelines found in the database.");
  }
  return pipelines;
}

export async function getPipeline(pipelineId: string) {
  const pipeline = await getPipelineById(pipelineId);

  if (!pipeline) {
    throw new NotFoundError("Pipeline not found");
  }
  return pipeline;
}

export async function updatePipeline(
  pipelineId: string,
  updateData: UpdatePipeline,
) {
  const updated = await updatePipelineById(pipelineId, updateData);
  if (!updated) {
    throw new NotFoundError("Pipeline not found");
  }
  return updated;
}

export async function deletePipeline(pipelineId: string) {
  const deleted = await deletePipelineById(pipelineId);
  if (!deleted) {
    throw new Error(`Failed to delete pipeline with pipelineId: ${pipelineId}`);
  }
}
