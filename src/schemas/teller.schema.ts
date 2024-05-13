import type SchemaToRequestTypes from ".";

export const showTellerSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "number" },
    },
  } as const,
};

export const updateTellerSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "number" },
    },
  } as const,
};

export type ShowTellerSchema = SchemaToRequestTypes<typeof showTellerSchema>;
export type UpdateTellerSchema = SchemaToRequestTypes<typeof updateTellerSchema>;
