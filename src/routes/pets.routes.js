import { Router } from "express";
import { asyncHandler } from "../middlewares/global/asyncHandler.js";
import { AppDataSource } from "../config/database_postgres.js";
import { BAD_REQUEST_STATUS, CREATED_STATUS, OK_STATUS } from "../constants/server.js";
import { PetEntity } from "../entidades/Pet.js";
import { PORTES_VALIDOS } from "../constants/porte.js";
import { SEXOS_VALIDOS } from "../constants/sexo.js";
import { ROLES } from "../constants/roles.js";
import { autorizarHandler } from "../middlewares/auth/autorizarHandler.js";

const petsRoutes = new Router();
const petRepository = AppDataSource.getRepository(PetEntity);

petsRoutes.post(
  "/pets",
  autorizarHandler(ROLES.ADMIN, ROLES.FUNCIONARIO),
  asyncHandler(async (request, response) => {
    const dados = request.body;
      // validação feita com ia
    if (!dados.nome) {
      response.status(BAD_REQUEST_STATUS).send({ error: "nome é obrigatório" });
      return;
    }

    if (!dados.tipo_id) {
      response.status(BAD_REQUEST_STATUS).send({ error: "tipo_id é obrigatório" });
      return;
    }

    if (!dados.raca_id) {
      response.status(BAD_REQUEST_STATUS).send({ error: "raca_id é obrigatório" });
      return;
    }

    if (!dados.cor_id) {
      response.status(BAD_REQUEST_STATUS).send({ error: "cor_id é obrigatório" });
      return;
    }

    if (!dados.porte || !PORTES_VALIDOS.includes(dados.porte)) {
      response.status(BAD_REQUEST_STATUS).send({ error: "porte é obrigatório e deve ser P, M ou G" });
      return;
    }

    if (dados.sexo && !SEXOS_VALIDOS.includes(dados.sexo)) {
      response.status(BAD_REQUEST_STATUS).send({ error: "sexo deve ser M ou F" });
      return;
    }

    if (dados.foto_url && typeof dados.foto_url !== "string") {
      response.status(BAD_REQUEST_STATUS).send({ error: "foto_url deve ser uma string" });
      return;
    }

    if (dados.historia && typeof dados.historia !== "string") {
      response.status(BAD_REQUEST_STATUS).send({ error: "historia deve ser uma string" });
      return;
    }

    if (dados.comportamento && typeof dados.comportamento !== "string") {
      response.status(BAD_REQUEST_STATUS).send({ error: "comportamento deve ser uma string" });
      return;
    }

    if (dados.observacoes_extras && typeof dados.observacoes_extras !== "string") {
      response.status(BAD_REQUEST_STATUS).send({ error: "observacoes_extras deve ser uma string" });
      return;
    }

    if (dados.idade_meses && !Number.isInteger(dados.idade_meses)) {
      response.status(BAD_REQUEST_STATUS).send({ error: "idade_meses deve ser um número inteiro" });
      return;
    }

    const novoPet = await petRepository.save({
      nome: dados.nome,
      tipo: { id: dados.tipo_id },
      raca: { id: dados.raca_id },
      cor: { id: dados.cor_id },
      porte: dados.porte,
      sexo: dados.sexo,
      foto_url: dados.foto_url,
      historia: dados.historia,
      comportamento: dados.comportamento,
      observacoes_extras: dados.observacoes_extras,
      idade_meses: dados.idade_meses,
    });

    response.status(CREATED_STATUS).send(novoPet);
  }),
);

petsRoutes.get(
  "/pets",
  autorizarHandler(ROLES.ADMIN, ROLES.FUNCIONARIO),
  asyncHandler(async (request, response) => {
    const pets = await petRepository.find({
      relations: {
        tipo: true,
        raca: true,
        cor: true,
      },
    });

    response.status(OK_STATUS).send(pets);
  }),
);

export default petsRoutes;
