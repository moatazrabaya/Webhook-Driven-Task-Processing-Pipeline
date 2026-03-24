import express from "express";
import {
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

export default router;
