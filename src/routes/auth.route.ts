import { getAuthUserData, authenticate } from "@/controllers/user.controller";
import type { FastifyInstance } from "fastify";

const authRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/me", getAuthUserData);
  fastify.post("/login", authenticate);
};

export default authRoutes;
