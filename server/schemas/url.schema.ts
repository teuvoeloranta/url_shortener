import { z } from "zod";

export const CreateUrlBody = z.object({
  url: z.string()
  .min(1, "Required")
  .url("Invalid url - Correct example is http://example.com"),
  userId: z.string().min(1)
});

export type CreateUrlBody = z.infer<typeof CreateUrlBody>;
