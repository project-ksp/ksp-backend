import { Logger } from "@/utils";
import { initDb } from "..";

async function seed() {
  const seeders = {
    branchHead: await import("./branchHead.seeder"),
    branch: await import("./branch.seeder"),
    user: await import("./user.seeder"),
    member: await import("./member.seeder"),
  };
  const deleteOrder: Array<keyof typeof seeders> = ["member", "user", "branch", "branchHead"];

  await initDb();
  for (const name of deleteOrder) {
    try {
      await seeders[name].clear();
      Logger.info("SEED", `Cleared data for seeder ${name}`);
    } catch (error) {
      Logger.error("SEED", `Failed to clear data for seeder ${name}`);
      throw error;
    }
  }

  for (const [name, seeder] of Object.entries(seeders)) {
    try {
      await seeder.default();
      Logger.info("SEED", `Seeder ${name} has been executed successfully`);
    } catch (error) {
      Logger.error("SEED", `Seeder ${name} has been failed to execute.`);
      throw error;
    }
  }
}

seed()
  .then(() => {
    Logger.info("SEED", "✅ All seeders have been executed successfully");
    process.exit(0);
  })
  .catch((error) => {
    Logger.error("SEED", `❌ Seeders have been failed to execute. Error message:\n${error}`);
    process.exit(1);
  });
