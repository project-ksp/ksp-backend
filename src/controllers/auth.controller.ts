import type { loginBodySchema } from "@/schemas/auth.schema";
import type { FastifyRequest, FastifyReply } from "fastify";
import * as userService from "@/services/user.service";
import { z } from "zod";
import { fromError } from "zod-validation-error";

// eslint-disable-next-line @typescript-eslint/naming-convention
export async function authenticate(request: FastifyRequest<{ Body: loginBodySchema }>, reply: FastifyReply) {
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

export async function authenticateAsBranchHead(request: FastifyRequest, reply: FastifyReply) {
  const validator = z.object({
    branchId: z.number(),
  });

  const validated = validator.safeParse(request.body);
  if (!validated.success) {
    return reply.status(400).send({
      message: fromError(validated.error).toString(),
    });
  }

  const user = await userService.getAllUsers({ role: "branch_head", branchId: validated.data.branchId });
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
