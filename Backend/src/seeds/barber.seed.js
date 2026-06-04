import { User } from "../models/relations.js";

export const seedBarbers = async () => {
  const barber = await User.findAll({
    where: {
      role: "barber",
    },
  });

  if (barber.length === 0) {
    await User.bulkCreate([
      {
        name: "Colo Auzmendi",
        email: "colobarber@gmail.com",
        phone: "341487964",
        imageUrl: "/images/colo.jpg",
        branchId: 3,
        yearsOfExperience: "1",
        password: "sin-password",
        role: "barber",
      },
      {
        name: "Gerardo Baldus",
        email: "gerabarber@gmail.com",
        phone: "3410152943",
        imageUrl: "/images/gera.jpg",
        branchId: 1,
        yearsOfExperience: "4",
        password: "sin-password",
        role: "barber",
      },
      {
        name: "Sebastián Benedetti",
        email: "sebabarber@gmail.com",
        phone: "3413714176",
        imageUrl: "/images/seba.jpg",
        branchId: 2,
        yearsOfExperience: "6",
        password: "sin-password",
        role: "barber",
      },
      {
        name: "Fabrizio Columba",
        email: "fabriarber@gmail.com",
        phone: "3413462791",
        imageUrl: "/images/fabri.jpg",
        branchId: 2,
        yearsOfExperience: "3",
        password: "sin-password",
        role: "barber",
      },
      {
        name: "Rafael Cruz",
        email: "rafabarber@gmail.com",
        phone: "3414678129",
        imageUrl: "/images/rafa.jpg",
        branchId: 3,
        yearsOfExperience: "1",
        password: "sin-password",
        role: "barber",
      },
      {
        name: "Leonel Longo",
        email: "longelbarber@gmail.com",
        phone: "3419672364",
        imageUrl: "/images/longel.jpg",
        branchId: 1,
        yearsOfExperience: "2",
        password: "sin-password",
        role: "barber",
      },
    ]);
  }
};

export default seedBarbers;
