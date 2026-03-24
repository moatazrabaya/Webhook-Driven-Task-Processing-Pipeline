import express from "express";
import {
  handlerJobDeliveryAttempts,
  handlerJobGet,
  handlerJobsRetrieve,
} from "../handlers/jobHandler.js";

const router = express.Router();

router.get("/:jobId", (req, res, next) => {
  Promise.resolve(handlerJobGet(req, res)).catch(next);
});

router.get("/", (req, res, next) => {
  Promise.resolve(handlerJobsRetrieve(req, res)).catch(next);
});

router.get("/:jobId/attempts", (req, res, next) => {
  Promise.resolve(handlerJobDeliveryAttempts(req, res)).catch(next);
});

export default router;
