import type SchemaToRequestTypes from ".";

export const createMonthlyLoanSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string" },
    },
  } as const,
};
export type CreateMonthlyLoanSchema = SchemaToRequestTypes<typeof createMonthlyLoanSchema>;
