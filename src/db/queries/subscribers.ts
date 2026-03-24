import { db } from "../index.js";
import { NewSubscriber, Subscriber, subscribers } from "../schema.js";

export async function createSubscriber(subscriber: NewSubscriber): Promise<Subscriber | undefined> {
  const [result] = await db
    .insert(subscribers)
    .values(subscriber)
    .returning();
  return result;
}
