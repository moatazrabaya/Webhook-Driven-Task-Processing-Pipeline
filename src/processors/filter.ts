export type FilterConfig = {
  field: string;
  operator: ">" | "<" | "=" | ">=" | "<=";
  value: number;
};

export function filterProcessor(
  payload: Record<string, unknown>,
  config: FilterConfig,
) {
  const fieldValue = payload[config.field];

  // “Falsy ≠ missing” --> Missing means:undefined OR null --> Everything else is valid data.
  if (fieldValue === undefined || fieldValue === null) {
    return null;
  }

  const numericValue = Number(fieldValue);

  if (isNaN(numericValue)) {
    return null;
  }

  let filter: boolean;

  switch (config.operator) {
    case ">":
      filter = numericValue > config.value;
      break;

    case "<":
      filter = numericValue < config.value;
      break;

    case "=":
      filter = numericValue === config.value;
      break;

    case ">=":
      filter = numericValue >= config.value;
      break;

    case "<=":
      filter = numericValue <= config.value;
      break;

    default:
      filter = false;
  }

  return filter === true ? payload : null;
}

export function validateFilterConfig(config: any) {
  return (
    !!config &&
    typeof config.field === "string" &&
    [">", "<", "=", ">=", "<="].includes(config.operator) &&
    typeof config.value === "number"
  );
}
