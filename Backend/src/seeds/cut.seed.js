import { Cut } from "../models/relations.js";

export const seedCuts = async () => {
  const cuts = await Cut.findAll();

  if (cuts.length === 0) {
    await Cut.bulkCreate([
      {
        name: "Corte + Barba",
        price: $15000,    
      },
      {
        name: "Corte",
        price: $10000,    
      },
      {
        name: "Barba",
        price: $7500,    
      },
    ]);
  }
};

export default seedCuts;
