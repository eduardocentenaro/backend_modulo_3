import { UNAUTHORIZED_STATUS } from "../../constants/server.js";
import jwt from "jsonwebtoken";

export function validateJwtHandler(request, response, next) {
  const header = request.headers.authorization; // pega o token do cabecalho da requisicao

  // verificar se token não chegou (undefined)
  if (!header) {
    response.status(UNAUTHORIZED_STATUS).send({ error: "token ausente" });
  }

  const token = header.split(" ")[1]; // obtem a parte util do token

  // verificar se o token é valido
  try {
    const conteudoDoToken = jwt.verify(token, process.env.JWT_SECRET);

    // colocando dentro da requisicao o perfil do usuario extraido do token
    request.usuario = {
      id: conteudoDoToken.id,
      role: conteudoDoToken.role,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      response.status(UNAUTHORIZED_STATUS).send({ error: "token expirado" });
      return;
    }

    if (error.name === "JsonWebTokenError") {
      response.status(UNAUTHORIZED_STATUS).send({ error: "token inválido" });
      return;
    }

    if (error.name === "NotBeforeError") {
      response
        .status(UNAUTHORIZED_STATUS)
        .send({ error: "token ainda não ativo" });
      return;
    }

    response
      .status(UNAUTHORIZED_STATUS)
      .send({ error: "falha na validação do token" });
  }
}
