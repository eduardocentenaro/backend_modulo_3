import "dotenv/config";
import { DataSource } from "typeorm";
import { UsuarioEntity } from "../entidades/Usuario.js";

const dbPort = Number(process.env.DB_PORT);
const loggingEnabled = process.env.DB_LOGGING === "true";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: dbPort,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: loggingEnabled,
  entities: [UsuarioEntity],
});
