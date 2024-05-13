import { statusEnum } from "@/db/schemas";
import type SchemaToRequestTypes from ".";

export const createDeleteRequestSchema = {
  body: {
    type: "object",
    required: ["memberId", "reason", "proofUrl"],
    properties: {
      memberId: { type: "string" },
      reason: { type: "string" },
      proofUrl: { type: "string" },
    },
  } as const,
};

export const showDeleteRequestSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "number" },
    },
  } as const,
};

export const updateStatusDeleteRequestSchema = {
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

export const removeDeleteRequestSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "number" },
    },
  } as const,
};

export type CreateDeleteRequestSchema = SchemaToRequestTypes<typeof createDeleteRequestSchema>;
export type ShowDeleteRequestSchema = SchemaToRequestTypes<typeof showDeleteRequestSchema>;
export type UpdateStatusDeleteRequestSchema = SchemaToRequestTypes<typeof updateStatusDeleteRequestSchema>;
export type RemoveDeleteRequestSchema = SchemaToRequestTypes<typeof removeDeleteRequestSchema>;
