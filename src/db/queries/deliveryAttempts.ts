import { db } from "../index.js";
import {
  DeliveryAttempt,
  deliveryAttempts,
  NewDeliveryAttempt,
} from "../schema.js";
import { eq } from "drizzle-orm";

export async function createDeliveryAttempt(
  attempt: NewDeliveryAttempt,
): Promise<DeliveryAttempt | undefined> {
  const [result] = await db
    .insert(deliveryAttempts)
    .values(attempt)
    .returning();
  return result;
}

export async function getJobDeliveryAttempts(
  jobId: string,
): Promise<DeliveryAttempt[]> {
  const result = await db
    .select()
    .from(deliveryAttempts)
    .where(eq(deliveryAttempts.jobId, jobId));
  return result;
}
