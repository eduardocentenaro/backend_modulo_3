import { INTERNAL_SERVER_STATUS } from "../../constants/server.js";

export function errorHandler(error, request, response, next) {
  console.error(error);
  response
    .status(error.status || INTERNAL_SERVER_STATUS)
    .send({ error: error.message || "Erro interno no servidor" });
}
