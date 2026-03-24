import { db } from "../index.js";
import { NewPipeline, Pipeline, pipelines } from "../schema.js";

export async function createPipeline(
  pipeline: NewPipeline,
): Promise<Pipeline | undefined> {
  const [result] = await db.insert(pipelines).values(pipeline).returning();
  return result;
}
