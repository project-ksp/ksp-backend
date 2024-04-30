import type { FromSchema } from "json-schema-to-ts";

export const loginSchema = {
  body: {
    type: "object",
    required: ["username", "password"],
    properties: {
      username: { type: "string" },
      password: { type: "string" },
    },
  } as const,
};

export const accessBranchSchema = {
  body: {
    type: "object",
    required: ["branchId"],
    properties: {
      branchId: { type: "number" },
    },
  } as const,
};

export type loginBodySchema = FromSchema<typeof loginSchema.body>;
export type accessBranchBodySchema = FromSchema<typeof accessBranchSchema.body>;
