import { memberStatusEnum } from "@/db/schemas";
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

export const showMemberSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string" },
    },
  } as const,
};

export const createMemberSchema = {
  body: {
    type: "object",
    required: ["member", "deposit"],
    properties: {
      member: { type: "object" },
      deposit: { type: "object" },
      monthlyDeposits: { type: "array" },
      monthlyLoans: { type: "array" },
    },
  } as const,
};

export const updateMemberSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string" },
    },
  } as const,
};

export const updateStatusMemberSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string" },
    },
  } as const,
  body: {
    type: "object",
    required: ["status"],
    properties: {
      status: { type: "string", enum: memberStatusEnum.enumValues },
    },
  } as const,
};

export const verifyMemberSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string" },
    },
  } as const,
};

export type IndexMemberSchema = SchemaToRequestTypes<typeof indexMemberSchema>;
export type SearchMemberSchema = SchemaToRequestTypes<typeof searchMemberSchema>;
export type ShowMemberSchema = SchemaToRequestTypes<typeof showMemberSchema>;
export type CreateMemberSchema = SchemaToRequestTypes<typeof createMemberSchema>;
export type UpdateMemberSchema = SchemaToRequestTypes<typeof updateMemberSchema>;
export type UpdateStatusMemberSchema = SchemaToRequestTypes<typeof updateStatusMemberSchema>;
export type VerifyMemberSchema = SchemaToRequestTypes<typeof verifyMemberSchema>;
