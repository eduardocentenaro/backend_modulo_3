import { response, Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { AppDataSource } from "../config/database_postgres.js";
import { UsuarioEntity } from "../entidades/Usuario.js";
import { BAD_REQUEST_STATUS, NO_CONTENT_STATUS } from "../constants/server.js";
import bcrypt from "bcrypt";

const usersRoutes = new Router();
const userRepository = AppDataSource.getRepository(UsuarioEntity);

usersRoutes.put(
  "/usuarios/me/senha",
  asyncHandler(async (request, response) => {
    const novaSenha = request.body.senha;
    const idUsuario = request.usuario.id;

    if (!novaSenha) {
      response
        .status(BAD_REQUEST_STATUS)
        .send({ error: "A senha é obrigatorio" });
    }

    const novaSenhaHash = await bcrypt.hash(
      novaSenha,
      Number(process.env.BCRYPT_SALT_ROUNDS || 12),
    );

    await userRepository.update(idUsuario, { senha: novaSenhaHash });

    response.status(NO_CONTENT_STATUS).send();
  }),
);

export default usersRoutes;
