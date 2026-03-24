import { describe, it, expect } from "vitest";
import { isValidUrl } from "../utils/isValidUrl.js";

describe("isValidUrl", () => {
  it("should return true for valid absolute URLs", () => {
    expect(isValidUrl("https://google.com")).toBe(true);
    expect(isValidUrl("http://localhost:3000")).toBe(true);
    expect(isValidUrl("https://sub.domain.org/path?query=1#hash")).toBe(true);
  });

  it("should return true for valid specialized protocols", () => {
    expect(isValidUrl("mailto:test@example.com")).toBe(true);
    expect(isValidUrl("ftp://files.server.com")).toBe(true);
  });

  it("should return false for empty strings or plain text", () => {
    expect(isValidUrl("")).toBe(false);
    expect(isValidUrl("not-a-url")).toBe(false);
    expect(isValidUrl("google.com")).toBe(false); // Fails because it lacks a protocol (http/https)
  });

  it("should return false for malformed URLs", () => {
    expect(isValidUrl("https//missing-colon.com")).toBe(false);
    expect(isValidUrl("http://[invalid-ip]")).toBe(false);
  });

  it("should return false for relative paths", () => {
    expect(isValidUrl("/api/v1/users")).toBe(false);
    expect(isValidUrl("./index.html")).toBe(false);
  });
});
