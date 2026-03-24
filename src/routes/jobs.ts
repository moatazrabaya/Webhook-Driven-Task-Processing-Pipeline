import express from "express";
import { handlerJobGet } from "../handlers/jobs.js";

const router = express.Router();

router.get("/:jobId", (req, res, next) => {
  Promise.resolve(handlerJobGet(req, res)).catch(next);
});

export default router;
