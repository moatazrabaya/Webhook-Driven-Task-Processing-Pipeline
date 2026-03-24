import { db } from "../index.js";
import { NewPipeline, Pipeline, pipelines } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createPipeline(
  pipeline: NewPipeline,
): Promise<Pipeline | undefined> {
  const [result] = await db.insert(pipelines).values(pipeline).returning();
  return result;
}

export async function getPipelineByKey(
  key: string,
): Promise<Pipeline | undefined> {
  const [result] = await db
    .select()
    .from(pipelines)
    .where(eq(pipelines.sourceKey, key));
  return result;
}

export async function getAllPipelines(): Promise<Pipeline[]> {
  const result = await db.select().from(pipelines);
  return result;
}

export async function getPipelineById(
  id: string,
): Promise<Pipeline | undefined> {
  const [result] = await db
    .select()
    .from(pipelines)
    .where(eq(pipelines.id, id));
  return result;
}
