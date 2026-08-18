import { FORBIDDEN_STATUS } from "../../constants/server.js";

// funcao de alta ordem
export const autorizarHandler =
  (...rolesPermitidas) =>
  (request, response, next) => {
    console.log(rolesPermitidas);
    if (!request.usuario || !rolesPermitidas.includes(request.usuario.role)) {
      return response
        .status(FORBIDDEN_STATUS)
        .send({ error: "Você não tem permissão para acessar este recurso" });
    }

    next();
  };
