import "./loadenv";
import { z } from "zod";
const ProcessEnv = z.object({
  PORT: z.string(),
  REDIS_URL: z.string(),
  FRONTEND_URL: z.string(),
});

function parseProcessEnv() {
  try {
    return ProcessEnv.parse(process.env);
  } catch (err) {
    console.error(
      "Config Error: Some of the environment variables are not valid, check below for more info."
    );
    console.log(err);
    throw err;
  }
}

export const processEnv = parseProcessEnv();
