import type { Request, Response } from "express";

import { BadRequestError } from "../api/errors.js";
import { respondWithJSON } from "../api/json.js";
import { getAllJobs, getJob } from "../services/jobService.js";

export async function handlerJobGet(req: Request, res: Response){
    const { jobId } = req.params;
    if (typeof jobId !== "string" || jobId.trim() === "") {
        throw new BadRequestError("Invalid job ID");
    }
    const job = await getJob(jobId);
    respondWithJSON(res, 200, job);
}

export async function handlerJobsRetrieve(req: Request, res: Response){
    const jobs = await getAllJobs();
    respondWithJSON(res, 200, jobs);
}
