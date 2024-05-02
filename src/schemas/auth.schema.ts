import type SchemaToRequestTypes from ".";

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

export type LoginSchema = SchemaToRequestTypes<typeof loginSchema>;
export type AccessBranchSchema = SchemaToRequestTypes<typeof accessBranchSchema>;