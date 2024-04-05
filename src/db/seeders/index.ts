import { Logger } from "@/utils";
import { initDb } from "..";

async function seed() {
  const seeders = {
    user: await import("./user.seeder"),
  };

  await initDb();
  for (const [name, seeder] of Object.entries(seeders)) {
    try {
      seeder.default();
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
