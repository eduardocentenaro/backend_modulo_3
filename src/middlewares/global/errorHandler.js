import { INTERNAL_SERVER_ERROR } from "../constants/server.js";

export function errorHandler(error, request, response, next) {
  console.error(error);
  response
    .status(error.status || INTERNAL_SERVER_ERROR)
    .send({ error: error.message || "Erro interno no servidor" });
}
