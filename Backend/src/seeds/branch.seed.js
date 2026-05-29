export const seedBranches = async () => {
  const branches = await Branch.findAll();

  if (branaches.length === 0) {
    await Branch.bulkCreate([
      { name: "Sucursal Centro", adress: "Av. Corrientes 123" },
      { name: "Sucursal Arroyito", adress: "Av. Genova " },
    ]);
  }
};
