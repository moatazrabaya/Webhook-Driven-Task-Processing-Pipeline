import express from "express";
import {
  handlerPipelineGet,
  handlerPipelinesCreate,
  handlerPipelinesRetrieve,
} from "../handlers/pipeline.js";

const router = express.Router();

router.post("/", (req, res, next) => {
  Promise.resolve(handlerPipelinesCreate(req, res)).catch(next);
});

router.get("/", (req, res, next) => {
  Promise.resolve(handlerPipelinesRetrieve(req, res)).catch(next);
});

router.get("/:pipelineId", (req, res, next) => {
  Promise.resolve(handlerPipelineGet(req, res)).catch(next);
});

export default router;
