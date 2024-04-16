import { z } from "zod";

const loginRequestSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type loginRequestType = z.infer<typeof loginRequestSchema>;
