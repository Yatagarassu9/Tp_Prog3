import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
//boca yo t amo
  dialect: "sqlite",
  storage: "./database.sqlite",
  logging: false
});

export default sequelize;