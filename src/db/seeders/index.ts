import { Logger } from "@/utils";
import { initDb } from "..";

async function seed() {
  const seeders = {
    branch: await import("./branch.seeder"),
    // Remove for Prod 
    branchHead: await import("./branchHead.seeder"),
    user: await import("./user.seeder"),
    // Remove for Prod leader: await import("./leader.seeder"),
    // member: await import("./member.seeder"),
    // teller: await import("./teller.seeder"),
    // deposit: await import("./deposit.seeder"),
    // loan: await import("./loan.seeder"),
    // deleteRequest: await import("./deleteRequest.seeder"),
  };
  const deleteOrder: Array<keyof typeof seeders> = [
    // "deleteRequest",
    // "loan",
    // "deposit",
    // "teller",
    // "member",
    // "leader",
    "user",
    "branchHead",
    "branch",
  ];

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

  if (process.argv.includes("--clear")) {
    return;
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
