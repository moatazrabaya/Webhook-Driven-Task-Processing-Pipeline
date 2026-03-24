import { NewPipeline } from "../db/schema.js";
import { createPipeline, getAllPipelines } from "../db/queries/pipelines.js";
import { BadRequestError } from "../api/errors.js";
import { createSubscribers } from "../services/subscriberService.js";

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
