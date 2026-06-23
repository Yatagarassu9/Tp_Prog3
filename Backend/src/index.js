// este es el archivo principal del servidor, aca arranca todo
// importamos las variables de entorno del .env (puerto, credenciales de db, etc)
import "dotenv/config";
import express from "express";
import morgan from "morgan"; // este nos muestra en consola cada request que llega, util para debuggear
import sequelize from "./db.js"; // la conexion a la base de datos
import authRoutes from "./routes/auth.routes.js";
import "./models/relations.js"; // importamos las relaciones entre modelos para que sequelize las registre
import cors from "cors"; // necesario para que el front (en otro puerto) pueda hablar con el back

// routes
import userRoutes from "./routes/user.routes.js";
import appointmentsRoutes from "./routes/appointments.routes.js";
import cutRoutes from "./routes/cut.routes.js";
import barberRoutes from "./routes/barber.routes.js";
import branchRoutes from "./routes/branch.routes.js";

const app = express();

app.use(morgan("dev")); // muestra los logs de cada peticion en la consola
app.use(cors()); // habilitamos cors para todas las origenes (en produccion habria que restringirlo)
app.use(express.json()); // para poder leer el body de los requests en formato json

// aca registramos cada grupo de rutas con su prefijo
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/appointments", appointmentsRoutes);
app.use("/cuts", cutRoutes);
app.use("/barbers", barberRoutes);
app.use("/branches", branchRoutes);

// ruta de prueba para verificar que el servidor esta andando
app.get("/", (req, res) => {
  res.send("api andando como se viene diciendo");
});

const PORT = process.env.PORT || 3000;

// funcion asincrona que sincroniza la db y luego levanta el servidor
// sequelize.sync() crea las tablas si no existen (sin borrar datos)
const start = async () => {
  await sequelize.sync();

  app.listen(PORT, () => {
    console.log(`Server en http://localhost:${PORT}`);
  });
};

start().catch((err) => {
  console.error("Error al iniciar el servidor:", err);
  process.exit(1); // si falla al arrancar cortamos el proceso con codigo de error
});
