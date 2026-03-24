import { db } from "../index.js";
import { DeliveryAttempt, deliveryAttempts, NewDeliveryAttempt } from "../schema.js";

export async function createDeliveryAttempt(attempt: NewDeliveryAttempt): Promise<DeliveryAttempt | undefined> {
  const [result] = await db
    .insert(deliveryAttempts)
    .values(attempt)
    .returning();
  return result;
}
