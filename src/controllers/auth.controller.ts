import type { loginRequestType } from "@/schemas/user.schema";
import type { FastifyRequest, FastifyReply } from "fastify";
import * as userService from "@/services/user.service";

// eslint-disable-next-line @typescript-eslint/naming-convention
export async function authenticate(request: FastifyRequest<{ Body: loginRequestType }>, reply: FastifyReply) {
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
