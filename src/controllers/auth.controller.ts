import bcrypt from "bcrypt";
import type { loginRequestType } from "@/schemas/user.schema";
import type { FastifyReply } from "fastify/types/reply";
import type { FastifyRequest } from "fastify/types/request";
import type { InferSelectModel } from "drizzle-orm";
import type { branchHeads, owners, tellers } from "@/db/schemas";

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
  const { id, role } = request.user;

  let userData: InferSelectModel<typeof owners | typeof tellers | typeof branchHeads> | undefined;
  if (role === "owner") {
    userData = await request.db.query.owners.findFirst({
      where: (owners, { eq }) => eq(owners.userId, id),
    });
  } else if (role === "teller") {
    userData = await request.db.query.tellers.findFirst({
      where: (tellers, { eq }) => eq(tellers.userId, id),
    });
  } else if (role === "branch_head") {
    userData = await request.db.query.branchHeads.findFirst({
      where: (branchHeads, { eq }) => eq(branchHeads.userId, id),
    });
  } else {
    reply.status(401).send({
      message: "Invalid role",
    });
    return;
  }

  if (!userData) {
    reply.status(401).send({
      message: "Invalid user ID",
    });
    return;
  }

  reply.send({
    message: "Fetched user data successfully",
    data: userData,
  });
}
