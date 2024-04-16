import { ShortenedUrlModel } from "@/schemas";
import msgpack from "msgpack-lite";

const ENCODING_TYPE = "base64";

export function serialize(payload: ShortenedUrlModel): string {
  const val = msgpack.encode(payload);
  return val.toString(ENCODING_TYPE);
}
export function deserialize(payload: string): ShortenedUrlModel {
  const buff = Buffer.from(payload, ENCODING_TYPE);
  return msgpack.decode(buff);
}
