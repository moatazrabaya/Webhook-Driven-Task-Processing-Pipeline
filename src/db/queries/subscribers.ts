import { db } from "../index.js";
import { NewSubscriber, Subscriber, subscribers } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createSubscriber(
  subscriber: NewSubscriber,
): Promise<Subscriber | undefined> {
  const [result] = await db.insert(subscribers).values(subscriber).returning();
  return result;
}

export async function getSubscribersByPipeline(
  pipelineId: string,
): Promise<Subscriber[]> {
  const result = await db
    .select()
    .from(subscribers)
    .where(eq(subscribers.pipelineId, pipelineId));
  return result;
}
