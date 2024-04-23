import * as uploadController from "@/controllers/upload.controller";
import type { FastifyInstance } from "fastify";

const uploadRoutes = async (fastify: FastifyInstance) => {
  fastify.post("/temp/image", { preHandler: [fastify.authenticate] }, uploadController.storeTemporaryImage);
};

export default uploadRoutes;
