import { insertBranchSchema } from "@/db/schemas";
import type SchemaToRequestTypes from ".";

export const createBranchSchema = {
  body: insertBranchSchema,
};

export const updateBranchPublishSchema = {
  querystring: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "number" },
    },
  } as const,
  body: {
    type: "object",
    required: ["publishAmount"],
    properties: {
      publishAmount: { type: "number" },
    },
  } as const,
};

export type UpdatePublishSchema = SchemaToRequestTypes<typeof updateBranchPublishSchema>;