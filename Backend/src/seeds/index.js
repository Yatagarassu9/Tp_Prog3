import { seedBranches } from "./branch.seed.js";
import { seedBarbers } from "./barber.seed.js";
// import { seedCuts } from "./cut.seed.js";

export const seed = async () => {
  await seedBranches();
  await seedBarbers();
  // await seedCuts();
};
