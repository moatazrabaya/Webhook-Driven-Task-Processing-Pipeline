import { getJob } from "../db/queries/jobs.js";
import { sleep } from "../utils/sleep.js";
import { processJob } from "../services/jobProcessingService.js";

async function runWorker() {
  while (true) {
    try {
      const job = await getJob();

      if (!job) {
        await sleep(2000);
        continue;
      }

      await processJob(job);
    } catch (err) {
      console.error("[Worker] Unexpected error:", err);
      await sleep(2000);
    }
  }
}

runWorker();
