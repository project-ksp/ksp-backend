import type SchemaToRequestTypes from ".";

export const updateBranchPublishSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "number", minimum: 1 },
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
