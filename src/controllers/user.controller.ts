import bcrypt from "bcrypt";
import type { loginRequestType } from "@/schemas/user.schema";
import type { FastifyReply } from "fastify/types/reply";
import type { FastifyRequest } from "fastify/types/request";

// eslint-disable-next-line @typescript-eslint/naming-convention
export async function authenticate(request: FastifyRequest<{ Body: loginRequestType }>, reply: FastifyReply) {
  const { username, password } = request.body;

  const user = await request.db.query.users.findFirst({
    where: (users, { eq }) => eq(users.username, username),
  });

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
  const { id } = (await request.jwtVerify()) satisfies { id: number };

  const user = await request.db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, id),
  });
  if (!user) {
    reply.status(401).send({
      message: "Invalid user ID",
    });
    return;
  }

  const { password, ...rest } = user;

  reply.send({
    message: "Successfully authenticated",
    data: rest,
  });
}
