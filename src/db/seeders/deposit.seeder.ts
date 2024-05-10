import { db } from "..";
import depositFactory from "../factories/deposit.factory";
import { deposits } from "../schemas/deposits.schema";

export default async function seed() {
  const members = await db.query.members.findMany();
  const depositsData = (await Promise.all(Array.from({ length: members.length }, depositFactory))).map(
    (deposit, index) => ({ ...deposit, memberId: members[index]!.id }),
  );

  await db.insert(deposits).values(depositsData);
}

export async function clear() {
  await db.delete(deposits);
}
