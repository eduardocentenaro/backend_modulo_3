import { Router } from "express";

import bcrypt from "bcrypt"; // lib gerar hash da senha
import jwt from "jsonwebtoken"; // lib que vai gerar o token do usuario

import { AppDataSource } from "../config/database_postgres.js";
import { UsuarioEntity } from "../entidades/Usuario.js";

import { CREATED_STATUS, CONFLICT_STATUS } from "../constants/server.js";
import { ROLES } from "../constants/roles.js";

import { autorizarHandler } from "../middlewares/auth/autorizarHandler.js";

const authRoutes = new Router();

const usuarioRepository = AppDataSource.getRepository(UsuarioEntity);

authRoutes.post(
  "/auth/usuarios",
  autorizarHandler(ROLES.ADMIN),
  async (request, response) => {
    const dados = request.body;

    const usuarioEncontrado = await usuarioRepository.existsBy({
      email: dados.email,
    });

    if (usuarioEncontrado) {
      response.status(CONFLICT_STATUS).send({ error: "O email já existe" });
    } else {
      const senhaHash = await bcrypt.hash(dados.senha, 12);

      // criar um novo objeto apartir do body com senha alterada
      const dadosUsuario = {
        nome: dados.nome,
        email: dados.email,
        senha: senhaHash,
        role: dados.role,
      };

      await usuarioRepository.save(dadosUsuario);

      response
        .status(CREATED_STATUS)
        .send({ nome: dados.nome, role: dados.role });
    }
  },
);

export default authRoutes;
