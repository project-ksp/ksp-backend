import type SchemaToRequestTypes from ".";

export const indexMemberSchema = {
  querystring: {
    type: "object",
    properties: {
      page: { type: "number" },
    },
  } as const,
};

export type IndexMemberSchema = SchemaToRequestTypes<typeof indexMemberSchema>;
