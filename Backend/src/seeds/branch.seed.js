import { Branch } from "../models/relations.js";

export const seedBranches = async () => {
  const branches = await Branch.findAll();

  if (branches.length === 0) {
    await Branch.bulkCreate([
      {
        name: "Sucursal Centro",
        adress: "Zeballos 1376",
        phone: "341467896",
        imageUrl: "/images/Barberia Sucursal Centro.jpg",
      },
      {
        name: "Sucursal Arroyito",
        adress: "Av. Genova 795",
        phone: "3417610795",
        imageUrl: "/images/Barberia Sucursal Arroyito.jpg",
      },
      {
        name: "Funes - Fisherton",
        adress: "Av. Eva Perón 7867",
        phone: "34137681252",
        imageUrl: "/images/Barberia Sucursal Funes-Fisherton.jpg",
      },
    ]);
  }
};

export default seedBranches;
