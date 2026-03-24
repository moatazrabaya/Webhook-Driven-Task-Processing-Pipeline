export type TemplateConfig = {
  template: string;
};

export function formatterProcessor(
  payload: Record<string, unknown>,
  config: TemplateConfig,
) {
  const result = config.template.replace(/{{(.*?)}}/g, (_, key) => {
    const value = payload[key.trim()];
    return value === undefined || value === null ? "" : String(value);
  });

  return result.trim();
}

export function validateTemplateConfig(config: any) {
  return !!config && typeof config.template === "string";
}
