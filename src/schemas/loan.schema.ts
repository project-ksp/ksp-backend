import type SchemaToRequestTypes from ".";

export const verifyLoanSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "number" },
    },
  } as const,
};

export type VerifyLoanSchema = SchemaToRequestTypes<typeof verifyLoanSchema>;
