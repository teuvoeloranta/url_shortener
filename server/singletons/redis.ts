import { processEnv } from "../env";
const { REDIS_URL } = processEnv;
import assert from "assert";
import { URL } from "url";
import { RedisClientType, createClient as createRedisClient } from "redis";

export class RedisClient {
  private static instance: RedisClient | null = null;
  public client: RedisClientType | null = null;
  private initialized: boolean = false;
  private redisUrl = REDIS_URL;
  private constructor() {}

  public static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
      RedisClient.instance.initialize();
    }
    return RedisClient.instance;
  }

  private initialize() {
    if (!this.initialized) {
      this.client = this.getRedisClient();
      this.client.connect();
      this.initialized = true;
    }
  }

  private getRedisClient(): RedisClientType {
    const parsedUrl = new URL(this.redisUrl);
    assert(
      !parsedUrl.pathname,
      `Url parsed out to having a path ${parsedUrl} - check the URL since it's not supposed to have one`
    );

    const config = {
      url: this.redisUrl,
      tls:
        parsedUrl.port === "6380"
          ? { servername: parsedUrl.hostname }
          : undefined,
    };

    return createRedisClient(config);
   
  }
}
