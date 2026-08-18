// src/middlewares/carregarEntidade.js
import { NOT_FOUND_STATUS } from "../constants/server.js";
import { AppDataSource } from "../config/database_postgres.js";

export const verifyIdExistsHandler =
  (entity, nomeAmigavel) => async (request, response, next) => {
    const id = Number(request.params.id);

    const registro = await AppDataSource.getRepository(entity).findOneBy({
      id,
    });

    if (!registro) {
      return response
        .status(NOT_FOUND_STATUS)
        .send({ error: `${nomeAmigavel} não encontrado(a)` });
    }

    request.resgistro = registro;

    next();
  };
