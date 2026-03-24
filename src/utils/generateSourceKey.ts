import { randomBytes } from "crypto";

export function generateSourceKey(): string {
  return randomBytes(16).toString("hex");
}
