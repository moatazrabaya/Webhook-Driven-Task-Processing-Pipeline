import { db } from "../index.js";
import { Job, jobs, NewJob } from "../schema.js";

export async function createJob(job: NewJob): Promise<Job | undefined> {
  const [result] = await db
    .insert(jobs)
    .values(job)
    .returning();
  return result;
}
