import { DataSource } from "typeorm";

import { UsuarioEntity } from "../entidades/Usuario.js";
import { TipoEntity } from "../entidades/Tipo.js";
import { RacaEntity } from "../entidades/Raca.js";
import { CorEntity } from "../entidades/Cor.js";
import { PetEntity } from "../entidades/Pet.js";
import { LarAdotivoEntity } from "../entidades/LarAdotivo.js";
import { AdocaoEntity } from "../entidades/Adocao.js";
import { AdocaoHistoricoEntity } from "../entidades/AdocaoHistorico.js";

const dbPort = Number(process.env.DB_PORT || 5432);
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
  entities: [
    UsuarioEntity,
    TipoEntity,
    RacaEntity,
    CorEntity,
    PetEntity,
    LarAdotivoEntity,
    AdocaoEntity,
    AdocaoHistoricoEntity,
  ],
});
