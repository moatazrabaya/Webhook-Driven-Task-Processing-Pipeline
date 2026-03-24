import type { Request, Response } from "express";

import { NewPipeline, Pipeline } from "../db/schema.js";
import { BadRequestError } from "../api/errors.js";
import { respondWithJSON } from "../api/json.js";
import { generateSourceKey } from "../utils/generateSourceKey.js";
import { isActionType } from "../utils/checkActionType.js";
import {
  createPipelineWithSubscribers,
  getPipelines,
} from "../services/pipelineService.js";

export async function handlerPipelinesCreate(req: Request, res: Response) {
  type parameters = {
    name: string;
    action_type: string;
    config?: Record<string, any>;
    subscribers: string[];
  };

  const params: parameters = req.body;

  if (
    !params.name ||
    !params.action_type ||
    !Array.isArray(params.subscribers) ||
    params.subscribers.length === 0
  ) {
    throw new BadRequestError("Missing required fields");
  }

  if (!isActionType(params.action_type)) {
    throw new BadRequestError("Invalid action type");
  }

  const sourceKey = generateSourceKey();

  const pipeline = await createPipelineWithSubscribers(
    {
      name: params.name,
      sourceKey: sourceKey,
      actionType: params.action_type,
      config: params.config,
    } satisfies NewPipeline,
    params.subscribers,
  );

  respondWithJSON(res, 201, {
    id: pipeline.id,
    name: pipeline.name,
    sourceKey: pipeline.sourceKey,
    actionType: pipeline.actionType,
    config: pipeline.config ?? {},
    createdAt: pipeline.createdAt,
  } satisfies Pipeline);
}

export async function handlerPipelinesRetrieve(req: Request, res: Response) {
  const pipelines = await getPipelines();
  respondWithJSON(res, 200, pipelines);
}
