import { statusEnum } from "@/db/schemas";
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

export const updateStatusLoanSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "number" },
    },
  } as const,
  body: {
    type: "object",
    required: ["status"],
    properties: {
      status: { type: "string", enum: statusEnum.enumValues },
    },
  } as const,
};

export type VerifyLoanSchema = SchemaToRequestTypes<typeof verifyLoanSchema>;
export type UpdateStatusLoanSchema = SchemaToRequestTypes<typeof updateStatusLoanSchema>;
