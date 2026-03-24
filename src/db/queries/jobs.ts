import { JobStatus } from "../../enums/jobStatus.js";
import { db } from "../index.js";
import { Job, jobs, NewJob } from "../schema.js";
import { eq, asc } from "drizzle-orm";

export async function createJob(job: NewJob): Promise<Job | undefined> {
  const [result] = await db.insert(jobs).values(job).returning();
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

export async function updateJobStatus(
  id: string,
  status: JobStatus.PROCESSING | JobStatus.COMPLETED | JobStatus.FAILED,
  processedAt?: Date,
  result?: Record<string, unknown>,
): Promise<Job | undefined> {
  const [res] = await db
    .update(jobs)
    .set({
      status: status,
      ...(processedAt !== undefined && { processedAt }), // ???
      ...(result !== undefined && { result }), // ???
    })
    .where(eq(jobs.id, id))
    .returning();
  return res;
}

export async function getJob(): Promise<Job | undefined> {
  const [result] = await db
    .select()
    .from(jobs)
    .where(eq(jobs.status, JobStatus.PENDING))
    .orderBy(asc(jobs.createdAt)) // Sort by newest first
    .limit(1);
  return result;
}
