import { createSubscriber } from "../db/queries/subscribers.js";
import { BadRequestError } from "../api/errors.js";
import { isValidUrl } from "../utils/isValidUrl.js";

export async function createSubscribers(
  pipelineId: string,
  subscribers: string[],
) {
  for (const sub of subscribers) {
    if (!isValidUrl(sub)) throw new BadRequestError("Invalid subscriber URL");

    try {
      const subscriber = await createSubscriber({
        pipelineId: pipelineId,
        url: sub,
      });
      if (!subscriber) {
        throw new Error("Could not create subscriber");
      }
    } catch (err: any) {
      if (err.code === "23505") {
        throw new BadRequestError("Duplicate subscriber");
      }

      throw new Error("Database error", { cause: err });
    }
  }
}
