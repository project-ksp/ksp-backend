import ownerSeeder from "./owner.seeder";
import tellerSeeder from "./teller.seeder";
import headSeeder from "./head.seeder";

export default async function seed() {
  await ownerSeeder();
  await tellerSeeder();
  await headSeeder();
}
