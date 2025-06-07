const env = {
  API_URL: `${process.env.API_URL}`,
  DEFAULT_TOKEN: `${process.env.DEFAULT_TOKEN}`,
  GOOGLE_CLIENT_ID: `${process.env.GOOGLE_CLIENT_ID}`,
  GOOGLE_CLIENT_SECRET: `${process.env.GOOGLE_CLIENT_SECRET}`,
  AUTH_LIMIT: Number.parseInt(process.env.AUTH_LIMIT ?? "0"),
  AUTH_SECRET: `${process.env.AUTH_SECRET}`,
};

export default env;

export type EnvType = typeof env;
