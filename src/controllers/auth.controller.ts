import type { AccessBranchSchema, LoginSchema } from "@/schemas/auth.schema";
import type { FastifyRequest, FastifyReply } from "fastify";
import * as userService from "@/services/user.service";
import * as ownerService from "@/services/owner.service";

export async function authenticate(request: FastifyRequest<LoginSchema>, reply: FastifyReply) {
  const { username, password } = request.body;

  try {
    const user = await userService.authenticate(username, password);
    const token = await reply.jwtSign(user);
    reply
      .setCookie("token", token, {
        httpOnly: true,
      })
      .send({
        message: "Login successful",
        token,
      });
  } catch (error) {
    if (error instanceof Error) {
      reply.code(401).send({
        message: error.message,
      });
    } else {
      reply.code(500).send({
        message: "An error occurred while authenticating user",
      });
    }
  }
}

export async function getAuthUserData(request: FastifyRequest, reply: FastifyReply) {
  const user = await userService.getUserByID(request.user.id);

  reply.send({
    message: "Fetched user data successfully",
    data: user,
  });
}

export async function overview(_request: FastifyRequest, reply: FastifyReply) {
  reply.send({
    message: "Fetched system overview successfully",
    data: await ownerService.getSystemOverview(),
  });
}

export async function authenticateAsBranchHead(request: FastifyRequest<AccessBranchSchema>, reply: FastifyReply) {
  const { branchId } = request.body;
  const user = await userService.getAllUsers({ role: "branch_head", branchId });

  if (!user[0]) {
    return reply.status(400).send({
      message: "Branch account not found.",
    });
  }

  const { username, password } = user[0];
  reply.send({
    message: "Fetched user token successfully",
    data: { username, password },
  });
}
