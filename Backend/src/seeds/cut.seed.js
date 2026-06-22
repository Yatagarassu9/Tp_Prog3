import { Cut } from "../models/relations.js";

// este seed carga los cortes iniciales en la base de datos
// solo se ejecuta si la tabla de cortes esta vacia, para no duplicar datos
export const seedCuts = async () => {
  const cuts = await Cut.findAll();

  // si ya hay cortes en la db no hacemos nada
  if (cuts.length === 0) {
    await Cut.bulkCreate([
      {
        name: "Corte + Barba",
        price: 15000,
      },
      {
        name: "Corte",
        price: 10000,
      },
      {
        name: "Barba",
        price: 7500,
      },
    ]);
  }
};

export default seedCuts;
