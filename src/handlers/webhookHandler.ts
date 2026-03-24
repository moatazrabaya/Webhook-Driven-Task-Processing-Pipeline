import type { Request, Response } from "express";

import { BadRequestError } from "../api/errors.js";
import { respondWithJSON } from "../api/json.js";
import { createJobFromWebhook } from "../services/jobService.js";

export async function handlerWebhook(req: Request, res: Response) {
  const { sourceKey } = req.params;

  if (typeof sourceKey !== "string" || sourceKey.trim() === "") {
    throw new BadRequestError("Invalid source key");
  }

  const payload = req.body as Record<string, unknown>;

  if (!payload || Object.keys(payload).length === 0) {
    throw new BadRequestError("Payload cannot be empty");
  }

  const job = await createJobFromWebhook(sourceKey, payload);

  respondWithJSON(res, 202, {
    message: "Webhook received",
    job: {
      id: job.id,
      status: job.status,
    },
  });
}
