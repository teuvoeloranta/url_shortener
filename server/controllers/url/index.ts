import { serialize, deserialize } from "../../utils/serialization";
import { processEnv } from "../../env";
import { RedisClient } from "../../singletons/redis";
import { CreateUrlBody } from "../../schemas/url.schema";
import { HttpException } from "../../utils/httpException";
import { RedisClientType } from "redis";
import { ShortenedUrlModel } from "@/schemas";
const SHORTENED_URLS = "shortened_urls";
const { FRONTEND_URL } = processEnv;

function shortenedUrl(slug: string): string {
  return `${FRONTEND_URL}/${slug}`;
}

type ShortenedUrlResponse = ShortenedUrlModel & {
  shortened: string;
};

class slugGenerator {
  static CHARSET =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  public redis: RedisClientType = null;
  constructor(redis: RedisClientType) {
    this.redis = redis;
  }
  generateSlug(length: number): string {
    let slug = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(
        Math.random() * slugGenerator.CHARSET.length
      );
      slug += slugGenerator.CHARSET[randomIndex];
    }
    return slug;
  }

  async isSlugUnique(slug: string): Promise<boolean> {
    const exists = await this.redis.HEXISTS(SHORTENED_URLS, slug);
    return !exists;
  }
  async generateUniqueSlug(length: number): Promise<string> {
    let slug = this.generateSlug(length);
    while (!(await this.isSlugUnique(slug))) {
      slug = this.generateSlug(length);
    }
    return slug;
  }
}

export class UrlController {
  public redis: RedisClientType = null;
  public slugGenerator: slugGenerator = null;
  constructor() {
    this.redis = RedisClient.getInstance().client;
    this.slugGenerator = new slugGenerator(this.redis);
  }
  async add(url: CreateUrlBody) {
    const slug = await this.slugGenerator.generateUniqueSlug(6);
    const parsed = CreateUrlBody.parse(url);
    const object = {
      ...parsed,
      visit_rate: 0,
      slug,
    };
    try {
      await this.redis.HSET(
        SHORTENED_URLS,
        slug,
        serialize(object as ShortenedUrlModel)
      );
      return {
        url: shortenedUrl(slug),
      };
    } catch (e) {
      throw e;
    }
  }

  async update(slug: string, body: { newSlug: string }) {
    try {
      const { newSlug } = body;
      const res = await this.redis.HGET(SHORTENED_URLS, slug);
      if (!res) throw new HttpException(404, "Not found");
      const isUnique = await this.slugGenerator.isSlugUnique(newSlug);
      if (isUnique) {
        const updated = {
          ...deserialize(res),
          slug: newSlug,
        };
        await this.redis.HDEL(SHORTENED_URLS, slug);
        await this.redis.HSET(SHORTENED_URLS, newSlug, serialize(updated));
        return updated;
      } else {
        throw new HttpException(409, "Slug already exists");
      }
    } catch (e) {
      throw e;
    }
  }

  async delete(slug: string) {
    try {
      await this.redis.HDEL(SHORTENED_URLS, slug);
      return "deleted";
    } catch (e) {
      throw e;
    }
  }

  async get(slug: string): Promise<ShortenedUrlResponse> {
    const res = await this.redis.HGET(SHORTENED_URLS, slug);
    if (!res) throw new HttpException(404, "Not found");
    const deserialized = deserialize(res);
    const updated = {
      ...deserialized,
      visit_rate: deserialized.visit_rate + 1,
    };
    await this.redis.HSET(SHORTENED_URLS, slug, serialize(updated));
    return {
      ...updated,
      shortened: shortenedUrl(updated.slug),
    };
  }

  async getUrlsByUserId(userId: string): Promise<ShortenedUrlResponse[]> {
    const all = await this.redis.HGETALL(SHORTENED_URLS);
    const allMapped = Object.values(all).map((buffer: string) =>
      deserialize(buffer)
    );
    return allMapped
      .map((url) => {
        return {
          ...url,
          shortened: shortenedUrl(url.slug),
        };
      })
      .filter((url) => url.userId == userId);
  }
}
