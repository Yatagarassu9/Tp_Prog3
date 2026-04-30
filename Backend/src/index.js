import express from "express";
import morgan from "morgan";
import sequelize from "./db.js";
//importacioon de yerbamate
import clientsRoutes from "./routes/clients.routes.js";
import barbersRoutes from "./routes/barbers.routes.js";
import servicesRoutes from "./routes/services.routes.js";
import appointmentsRoutes from "./routes/appointments.routes.js";

const app = express();
app.use(morgan("dev"));
app.use(express.json());
//rutardas
app.use("/clients", clientsRoutes);
app.use("/barbers", barbersRoutes);
app.use("/services", servicesRoutes);
app.use("/appointments", appointmentsRoutes);

// test
app.get("/", (req, res) => {
  res.send("api como se dice de manera villera andando");
});

//levantar server
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`server andando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();