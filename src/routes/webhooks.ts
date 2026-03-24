import express from "express";
import { handlerWebhook } from "../handlers/webhookHandler.js";

const router = express.Router()

router.post("/:sourceKey", (req, res, next) => {
  Promise.resolve(handlerWebhook(req, res)).catch(next);

});

export default router
