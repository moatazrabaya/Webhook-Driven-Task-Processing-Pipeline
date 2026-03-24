import { Subscriber } from "../db/schema.js";
import { createDeliveryAttempt } from "../db/queries/deliveryAttempts.js";
import { getSubscribersByPipeline } from "../db/queries/subscribers.js";
import { BadRequestError } from "../api/errors.js";
import { DeliveryStatus } from "../enums/deliveryStatus.js";
import { sleep } from "../utils/sleep.js";

export type JobDeliveryData = {
  jobId: string;
  pipelineId: string;
  result: Record<string, unknown>;
};

export async function deliverToSubscribers(job: JobDeliveryData) {
  const subscribers = await getSubscribersByPipeline(job.pipelineId);

  console.log(
    `[Delivery] Job ${job.jobId} → ${subscribers.length} subscribers`,
  );

  for (const subscriber of subscribers) {
    const delivered = await retryDelivery(job, subscriber);
    if (!delivered) {
      console.log(
        `The result didn't deliver to the subscriber ${subscriber.id}`,
      );
    }
  }
}

async function retryDelivery(job: JobDeliveryData, subscriber: Subscriber) {
  const deliverAttempts = 3;
  let attempt = 1;

  for (; attempt <= deliverAttempts; attempt++) {
    const response = await tryFetch(job, subscriber);

    const status =
      !response || !response.ok
        ? DeliveryStatus.FAILED
        : DeliveryStatus.SUCCESS;

    const responseText = !response ? "Network error" : await response.text();

    try {
      await createDeliveryAttempt({
        jobId: job.jobId,
        subscriberUrl: subscriber.url,
        status: status,
        attemptNumber: attempt,
        response: responseText,
      });

      if (status === DeliveryStatus.SUCCESS) {
        console.log(
          `   ** The result deliverd to the subscriber ${subscriber.id}`,
        );
        break;
      } else {
        await sleep(10000); // wait 10 seconds before the next delivery attempt
      }
    } catch (err: any) {
      if (err.code === "23505") {
        throw new BadRequestError("Duplicate delivery attempt");
      }

      throw new Error("Database error", { cause: err });
    }
  }

  return attempt <= deliverAttempts;
}

async function tryFetch(job: JobDeliveryData, subscriber: Subscriber) {
  try {
    const response = await fetch(subscriber.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobId: job.jobId,
        pipelineId: job.pipelineId,
        result: job.result,
      }),
    });
    return response;
  } catch{
    return null;
  }
}
