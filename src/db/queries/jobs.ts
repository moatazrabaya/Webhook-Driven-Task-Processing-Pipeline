import { db } from "../index.js";
import { Job, jobs, NewJob } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createJob(job: NewJob): Promise<Job | undefined> {
  const [result] = await db
    .insert(jobs)
    .values(job)
    .returning();
  return result;
}

export async function getJobById(id: string): Promise<Job | undefined> {
  const [result] = await db.select().from(jobs).where(eq(jobs.id, id));
  return result;
}

export async function getJobs(): Promise<Job[]> {
  const result = await db.select().from(jobs);
  return result;
}
