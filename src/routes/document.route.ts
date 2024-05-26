import * as documentController from "@/controllers/document.controller";
import type { FastifyInstance } from "fastify";
const DocumentRoutes = async (fastify: FastifyInstance) => {
  fastify.get(
    "/blanko-pinjaman",
    {
      preHandler: [fastify.authenticate],
    },
    documentController.getBlankoPinjaman,
  );
  fastify.get(
    "/blanko-simpanan",
    {
      preHandler: [fastify.authenticate],
    },
    documentController.getBlankoSimpanan,
  );
  fastify.get(
    "/registration-form",
    {
      preHandler: [fastify.authenticate],
    },
    documentController.getEmptyForm,
  );
};

export default DocumentRoutes;
