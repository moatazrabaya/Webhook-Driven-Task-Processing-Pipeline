import express from "express";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";

import pipelineRoutes from "./routes/pipeline.js";
import webhookRoutes from "./routes/webhooks.js";
import jobRoutes from "./routes/jobs.js";

import { errorMiddleWare } from "./api/middleware.js";
import { config } from "./config.js";

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();

app.use(express.json());

app.use("/pipelines", pipelineRoutes);
app.use("/webhooks", webhookRoutes);
app.use("/jobs", jobRoutes);

app.use(errorMiddleWare);

app.listen(config.api.port, () => {
  console.log(`Server is running at http://localhost:${config.api.port}`);
});
