export type ExtractConfig = {
  fields: string[];
};

export function extractProcessor(
  payload: Record<string, unknown>,
  config: ExtractConfig,
) {
  if (!config.fields || config.fields.length === 0) {
    return {};
  }

  const result: Record<string, unknown> = {};

  for (const field of config.fields) {
    if (payload[field] !== undefined) {
      result[field] = payload[field];
    }
  }

  return result;
}

export function validateExtractConfig(config: any): boolean {
  return (
    !!config &&
    Array.isArray(config.fields) &&
    config.fields.every((f: any) => typeof f === "string")
  );
}
