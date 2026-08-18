import { Router } from "express";
import { asyncHandler } from "../middlewares/global/asyncHandler.js";
import { AppDataSource } from "../config/database_postgres.js";
import { BAD_REQUEST_STATUS, CREATED_STATUS } from "../constants/server.js";
import { AdocaoEntity } from "../entidades/Adocao.js";
import { AdocaoHistoricoEntity } from "../entidades/AdocaoHistorico.js";
import { STATUS_ADOCAO_VALIDOS } from "../constants/statusAdocao.js";
import { ROLES } from "../constants/roles.js";
import { autorizarHandler } from "../middlewares/auth/autorizarHandler.js";
import { verifyIdExistsHandler } from "../middlewares/verifyIdExistsHandler.js";

const adocoesRoutes = new Router();
const adocaoHistoricoRepository = AppDataSource.getRepository(AdocaoHistoricoEntity);

adocoesRoutes.put(
  "/adocoes/status",
  autorizarHandler(ROLES.ADMIN),
  (request, response, next) => {
    request.params.id = request.body.adocao_id;
    next();
  },
  verifyIdExistsHandler(AdocaoEntity, "Adoção"),
  asyncHandler(async (request, response) => {
    const adocao = request.resgistro;
    const dados = request.body;

    if (!dados.status || !STATUS_ADOCAO_VALIDOS.includes(dados.status)) {
      response.status(BAD_REQUEST_STATUS).send({
        error: `status é obrigatório e deve ser um dos valores: ${STATUS_ADOCAO_VALIDOS.join(", ")}`,
      });
      return;
    }

    if (!dados.observacao) {
      response.status(BAD_REQUEST_STATUS).send({ error: "observacao é obrigatório" });
      return;
    }

    const novoHistorico = await adocaoHistoricoRepository.save({
      adocao,
      status: dados.status,
      observacao: dados.observacao,
    });

    response.status(CREATED_STATUS).send(novoHistorico);
  }),
);

export default adocoesRoutes;
