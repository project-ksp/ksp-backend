import type SchemaToRequestTypes from ".";

export const indexMemberSchema = {
  querystring: {
    type: "object",
    properties: {
      page: { type: "number" },
    },
  } as const,
};

export const searchMemberSchema = {
  querystring: {
    type: "object",
    required: ["query"],
    properties: {
      query: { type: "string" },
    },
  } as const,
};

export type IndexMemberSchema = SchemaToRequestTypes<typeof indexMemberSchema>;
export type SearchMemberSchema = SchemaToRequestTypes<typeof searchMemberSchema>;
