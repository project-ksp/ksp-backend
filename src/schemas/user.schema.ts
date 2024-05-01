import SchemaToRequestTypes from ".";

export const createUserSchema = {
  body: {
    type: "object",
    properties: {},
  } as const,
};

export type CreateUserSchema = SchemaToRequestTypes<typeof createUserSchema>;
