import type SchemaToRequestTypes from ".";

export const showLeaderSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "number" },
    },
  } as const,
};

export const updateLeaderSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "number" },
    },
  } as const,
};

export type ShowLeaderSchema = SchemaToRequestTypes<typeof showLeaderSchema>;
export type UpdateLeaderSchema = SchemaToRequestTypes<typeof updateLeaderSchema>;
