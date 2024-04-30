import { FromSchema } from "json-schema-to-ts";

export const updatePublishSchema = {
  query: {
    type: "object",
    properties: {
      id: { type: "number" },
    },
  } as const,
  body: {
    type: "object",
    required: ["publish"],
    properties: {
      publishAmount: { type: "number" },
    },
  } as const,
};

export type UpdatePublishSchema = {
  query: FromSchema<typeof updatePublishSchema.query>;
  body: FromSchema<typeof updatePublishSchema.body>;
};
