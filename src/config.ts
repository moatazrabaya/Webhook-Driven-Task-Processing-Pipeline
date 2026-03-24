
type Config = {
  api: APIConfig;
  db: DBConfig;
};

type APIConfig = {
  port: number;
};

type DBConfig = {
  url: string;
};

process.loadEnvFile();

export function envOrThrow(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

export const config: Config = {
  api: {
    port: Number(envOrThrow("PORT")),
  },
  db: {
    url: envOrThrow("DB_URL"),
  },
};
