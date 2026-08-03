import "dotenv/config";

import express from "express";
import cors from "cors";

import { PORT_SERVER } from "./constants/server.js";
import { AppDataSource } from "./config/database_postgres.js";

import { captureLog } from "./middlewares/global/captureLog.js";
import { errorHandler } from "./middlewares/global/errorHandler.js";
import { validateJwtHandler } from "./middlewares/auth/validateJwtHandler.js";

import authRoutes from "./routes/auth.routes.js";
import publicRoutes from "./routes/public.routes.js";

const app = express();
app.use(express.json()); // habilita o servidor para reconhecer formato JSON
app.use(cors());

app.use(captureLog); // aplicando o middleware de forma global no inicio de cada rota

app.use(publicRoutes);

app.use(validateJwtHandler); // aplicar o token em todas as rotas abaixo
app.use(authRoutes);

app.use(errorHandler); // aplicando o middleware de forma global no fim de cada rota

try {
  await AppDataSource.initialize();
  app.listen(PORT_SERVER, () => {
    console.log("Servidor rodando");
  });
} catch (error) {
  console.log("Erro ao conectar com o banco de dados", error);
}
