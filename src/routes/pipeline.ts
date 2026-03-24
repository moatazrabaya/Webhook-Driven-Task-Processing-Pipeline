import express from "express";
import { handlerPipelinesCreate } from "../handlers/pipeline.js";

const router = express.Router();

router.post("/", (req, res, next) => {
  Promise.resolve(handlerPipelinesCreate(req, res)).catch(next);
});

export default router;
