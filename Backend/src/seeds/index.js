import "dotenv/config";
import sequelize from "../db.js";
import "../models/relations.js";
import { seedBranches } from "./branch.seed.js";
import { seedBarbers } from "./barber.seed.js";

export const seed = async () => {
  await seedBranches();
  await seedBarbers();
  await seedCuts();
};

await sequelize.sync();
await seed();
await sequelize.close();
console.log("Seed completado");