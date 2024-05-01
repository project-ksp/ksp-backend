import type SchemaToRequestTypes from ".";

export const updatePublishSchema = {
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

export type UpdatePublishSchema = SchemaToRequestTypes<typeof updatePublishSchema>;
