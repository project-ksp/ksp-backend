import { Logger } from "@/utils";
import { initDb } from "..";

const seeders = {
  User: import("./user.seeder"),
};

async function seed() {
  await initDb();
  for (const [name, seeder] of Object.entries(seeders)) {
    try {
      (await seeder).default();
      Logger.info("SEED", `${name} seeder has been executed successfully`);
    } catch (error) {
      Logger.error("SEED", `${name} seeder has been failed to execute.`);
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
