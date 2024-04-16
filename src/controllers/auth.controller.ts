import bcrypt from "bcrypt";
import type { loginRequestType } from "@/schemas/user.schema";
import type { FastifyRequest, FastifyReply } from "fastify";
import * as userService from "@/services/user.service";

// eslint-disable-next-line @typescript-eslint/naming-convention
export async function authenticate(request: FastifyRequest<{ Body: loginRequestType }>, reply: FastifyReply) {
  const { username, password } = request.body;

  const user = await userService.getUserByUsername(username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    reply.status(401).send({
      message: "Invalid username or password",
    });
    return;
  }

  const { password: _, ...rest } = user;
  const token = await reply.jwtSign(rest);

  reply
    .setCookie("token", token, {
      httpOnly: true,
    })
    .send({
      message: "Login successful",
      token,
    });
}

export async function getAuthUserData(request: FastifyRequest, reply: FastifyReply) {
  const user = await userService.getUserByID(request.user.id);

  reply.send({
    message: "Fetched user data successfully",
    data: user,
  });
}
