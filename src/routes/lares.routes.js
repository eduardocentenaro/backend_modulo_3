import { Router } from "express";
import { asyncHandler } from "../middlewares/global/asyncHandler.js";
import { AppDataSource } from "../config/database_postgres.js";
import { BAD_REQUEST_STATUS, CREATED_STATUS, OK_STATUS } from "../constants/server.js";
import { LarAdotivoEntity } from "../entidades/LarAdotivo.js";
import { TIPOS_LAR_VALIDOS } from "../constants/tipoLar.js";
import { ROLES } from "../constants/roles.js";
import { autorizarHandler } from "../middlewares/auth/autorizarHandler.js";
import { verifyIdExistsHandler } from "../middlewares/verifyIdExistsHandler.js";

const laresRoutes = new Router();
const larAdotivoRepository = AppDataSource.getRepository(LarAdotivoEntity);

laresRoutes.post(
  "/lares-adotivos",
  autorizarHandler(ROLES.ADMIN, ROLES.FUNCIONARIO),
  asyncHandler(async (request, response) => {
    const dados = request.body;

    if (!dados.nome || typeof dados.nome !== "string") {
      response.status(BAD_REQUEST_STATUS).send({ error: "nome é obrigatório" });
      return;
    }

    if (!dados.cep || !/^\d{5}-\d{3}$/.test(dados.cep)) {
      response.status(BAD_REQUEST_STATUS).send({ error: "cep é obrigatório e deve estar no formato xxxxx-xxx" });
      return;
    }

    if (!dados.estado) {
      response.status(BAD_REQUEST_STATUS).send({ error: "estado é obrigatório" });
      return;
    }

    if (!dados.cidade) {
      response.status(BAD_REQUEST_STATUS).send({ error: "cidade é obrigatório" });
      return;
    }

    if (!dados.bairro) {
      response.status(BAD_REQUEST_STATUS).send({ error: "bairro é obrigatório" });
      return;
    }

    if (!dados.rua) {
      response.status(BAD_REQUEST_STATUS).send({ error: "rua é obrigatório" });
      return;
    }

    if (typeof dados.possui_telas_protecao !== "boolean") {
      response.status(BAD_REQUEST_STATUS).send({
        error: "possui_telas_protecao é obrigatório e deve ser true ou false",
      });
      return;
    }

    if (!dados.tipo || !TIPOS_LAR_VALIDOS.includes(dados.tipo)) {
      response.status(BAD_REQUEST_STATUS).send({
        error: `tipo é obrigatório e deve ser um dos valores: ${TIPOS_LAR_VALIDOS.join(", ")}`,
      });
      return;
    }

    if (!dados.telefone || !/^\(\d{2}\) \d{5}-\d{4}$/.test(dados.telefone)) {
      response.status(BAD_REQUEST_STATUS).send({
        error: "telefone é obrigatório e deve estar no formato (85) 99999-9999",
      });
      return;
    }

    const novoLar = await larAdotivoRepository.save({
      nome: dados.nome,
      cep: dados.cep,
      estado: dados.estado,
      cidade: dados.cidade,
      bairro: dados.bairro,
      rua: dados.rua,
      possui_telas_protecao: dados.possui_telas_protecao,
      tipo: dados.tipo,
      telefone: dados.telefone,
    });

    response.status(CREATED_STATUS).send(novoLar);
  }),
);

laresRoutes.get(
  "/lares-adotivos",
  autorizarHandler(ROLES.ADMIN, ROLES.FUNCIONARIO),
  asyncHandler(async (request, response) => {
    const { estado, tipo } = request.query;

    const where = {};

    if (estado) {
      where.estado = estado;
    }

    if (tipo) {
      where.tipo = tipo;
    }

    const lares = await larAdotivoRepository.find({
      where,
      order: {
        criado_em: "ASC",
      },
    });

    response.status(OK_STATUS).send(lares);
  }),
);

laresRoutes.get(
  "/lares-adotivos/:id",
  autorizarHandler(ROLES.ADMIN, ROLES.FUNCIONARIO),
  verifyIdExistsHandler(LarAdotivoEntity, "Lar adotivo"),
  asyncHandler(async (request, response) => {
    response.status(OK_STATUS).send(request.resgistro);
  }),
);

export default laresRoutes;
