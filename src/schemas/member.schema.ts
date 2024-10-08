import { statusEnum } from "@/db/schemas";
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

export const createDepositMemberSchema = {
  body: {
    type: "object",
    required: ["member", "deposit"],
    properties: {
      member: { type: "object" },
      deposit: { type: "object" },
    },
  } as const,
};

export const createLoanMemberSchema = {
  body: {
    type: "object",
    required: ["member", "loan"],
    properties: {
      member: { type: "object" },
      loan: { type: "object" },
      mandatoryDeposit: { type: "number" },
    },
  } as const,
};

export const addLoanMemberSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string" },
    },
  } as const,
  body: {
    type: "object",
    required: ["loan", "mandatoryDeposit"],
    properties: {
      loan: { type: "object" },
      mandatoryDeposit: { type: "number" },
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
  body: {
    type: "object",
    required: ["member", "deposit", "loans"],
    properties: {
      member: { type: "object" },
      deposit: { type: "object" },
      loans: { type: "array", items: { type: "object" } },
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
      status: { type: "string", enum: statusEnum.enumValues },
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

export const calculateDepositMemberSchema = {
  body: {
    type: "object",
    required: ["loan"],
    properties: {
      loan: { type: "number" },
      mandatoryDeposit: { type: "number" },
    },
  } as const,
};

export const calculateDepositExistingMemberSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string" },
    },
  } as const,
  body: {
    type: "object",
    required: ["loan"],
    properties: {
      loan: { type: "number" },
      mandatoryDeposit: { type: "number" },
    },
  } as const,
};

export const memberIdParamSchema = {
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
export type CreateDepositMemberSchema = SchemaToRequestTypes<typeof createDepositMemberSchema>;
export type CreateLoanMemberSchema = SchemaToRequestTypes<typeof createLoanMemberSchema>;
export type AddLoanMemberSchema = SchemaToRequestTypes<typeof addLoanMemberSchema>;
export type UpdateMemberSchema = SchemaToRequestTypes<typeof updateMemberSchema>;
export type UpdateStatusMemberSchema = SchemaToRequestTypes<typeof updateStatusMemberSchema>;
export type VerifyMemberSchema = SchemaToRequestTypes<typeof verifyMemberSchema>;
export type CalculateDepositMemberSchema = SchemaToRequestTypes<typeof calculateDepositMemberSchema>;
export type CalculateDepositExistingMemberSchema = SchemaToRequestTypes<typeof calculateDepositExistingMemberSchema>;
export type MemberIdParamSchema = SchemaToRequestTypes<typeof memberIdParamSchema>;
