import "dotenv/config";
import express from "express";
import morgan from "morgan";
import sequelize from "./db.js";
import authRoutes from "./routes/auth.routes.js";
import "./models/relations.js";
import cors from "cors";

// seeds de base de datos provisoria
import { seed } from "./seeds/index.js";

// routes
import userRoutes from "./routes/user.routes.js";
import appointmentsRoutes from "./routes/appointments.routes.js";
import cutRoutes from "./routes/cut.routes.js";
import barberRoutes from "./routes/barber.routes.js";
import branchRoutes from "./routes/branch.routes.js";
const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);

// rutardas
app.use("/users", userRoutes);
app.use("/appointments", appointmentsRoutes);
app.use("/cuts", cutRoutes);
app.use("/barbers", barberRoutes);
app.use("/branches", branchRoutes);

app.get("/", (req, res) => {
  res.send("api andando como se viene diciendo");
});

const PORT = 3000;

// antes estaba await.sequelize.sync({ alter: true});
// ahora pongo force: true para que elimine la data base cadavez que iniciamos el sv
// porque sino tira problemas el database.sqlite

const start = async () => {
  await sequelize.sync({ force: true });
  await seed();
  app.listen(PORT, () => {
    console.log(`Server en http://localhost:${PORT}`);
  });
};

start();
