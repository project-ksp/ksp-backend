import * as uploadService from "@/services/upload.service";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function storeTemporaryImage(request: FastifyRequest, reply: FastifyReply) {
  const file = await request.file();
  if (!file) {
    reply.code(400).send({
      message: "No file uploaded",
    });
    return;
  }

  if (!file.mimetype.startsWith("image/")) {
    reply.code(400).send({
      message: "Invalid file type",
    });
    return;
  }

  try {
    const name = await uploadService.storeTemporary(file);
    reply.send({
      message: "File uploaded successfully",
      data: name,
    });
  } catch (error) {
    reply.code(400).send({
      message: error instanceof Error ? error.message : "Failed to upload file",
    });
  }
}
