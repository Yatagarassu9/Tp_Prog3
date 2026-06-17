import { User } from "../models/relations.js";
import bcrypt from "bcryptjs";

export const seedBarbers = async () => {
  const barber = await User.findAll({
    where: {
      role: "barber",
    },
  });

  const hashColo = await bcrypt.hash("carcaraña", 10);
  const hashGera = await bcrypt.hash("geraformosa", 10);
  const hashSeba = await bcrypt.hash("gaga123", 10);
  const hashFabri = await bcrypt.hash("fabricentral", 10);
  const hashRafa = await bcrypt.hash("rafa2006", 10);
  const hashLongel = await bcrypt.hash("ellongel", 10);

  if (barber.length === 0) {
    await User.bulkCreate([
      {
        name: "Colo Auzmendi",
        email: "colobarber@gmail.com",
        phone: "341487964",
        imageUrl: "/images/colo.jpg",
        branchId: 3,
        yearsOfExperience: "1",
        password: hashColo,
        role: "barber",
      },
      {
        name: "Gerardo Baldus",
        email: "gerabarber@gmail.com",
        phone: "3410152943",
        imageUrl: "/images/gera.jpg",
        branchId: 1,
        yearsOfExperience: "4",
        password: hashGera,
        role: "barber",
      },
      {
        name: "Sebastián Benedetti",
        email: "sebabarber@gmail.com",
        phone: "3413714176",
        imageUrl: "/images/seba.jpg",
        branchId: 2,
        yearsOfExperience: "6",
        password: hashSeba,
        role: "barber",
      },
      {
        name: "Fabrizio Columba",
        email: "fabriarber@gmail.com",
        phone: "3413462791",
        imageUrl: "/images/fabri.jpg",
        branchId: 2,
        yearsOfExperience: "3",
        password: hashFabri,
        role: "barber",
      },
      {
        name: "Rafael Cruz",
        email: "rafabarber@gmail.com",
        phone: "3414678129",
        imageUrl: "/images/rafa.jpg",
        branchId: 3,
        yearsOfExperience: "1",
        password: hashRafa,
        role: "barber",
      },
      {
        name: "Leonel Longo",
        email: "longelbarber@gmail.com",
        phone: "3419672364",
        imageUrl: "/images/longel.jpg",
        branchId: 1,
        yearsOfExperience: "2",
        password: hashLongel,
        role: "barber",
      },
    ]);
  }
};

export default seedBarbers;
