import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { AppDataSource } from "../config/database_postgres.js";

import { UsuarioEntity } from "../entidades/Usuario.js";

import { BAD_REQUEST_STATUS, OK_STATUS } from "../constants/server.js";

const publicRoutes = new Router();

const usuarioRepository = AppDataSource.getRepository(UsuarioEntity);

publicRoutes.post("/auth/login", async (request, response) => {
  // 1 - Pegar o body e armezanar na variavel dados
  const dados = request.body;

  // 2 valida se o email ou senha são vazios
  if (!dados.email || !dados.senha) {
    response
      .status(BAD_REQUEST_STATUS)
      .send({ error: "email e senha são obrigatórios" });
    return;
  }

  // 3 - busca um usuário pelo email no banco
  const usuario = await usuarioRepository.findOneBy({ email: dados.email });

  // 4 - Se o usuário com base no email não foi encontrado, lança um erro
  if (!usuario) {
    response.status(BAD_REQUEST_STATUS).send({
      error: "Credenciais incorretas",
    });
    return;
  }

  // 5 - comparar se o hash da senha do usuario encontrado equivale a hash da senha recebida no body
  const senhaCorreta = await bcrypt.compare(dados.senha, usuario.senha);

  if (senhaCorreta) {
    const tokenUsuario = jwt.sign(
      { id: usuario.id, role: usuario.role },
      process.env.JWT_SECRET || "senai2026",
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "24h",
      },
    );

    response.status(OK_STATUS).send({
      nome: usuario.nome,
      role: usuario.role,
      token: tokenUsuario,
    });
  } else {
    response.status(BAD_REQUEST_STATUS).send({
      error: "Credenciais incorretas",
    });
  }

  // implementação da lógica de checagem do usuário
});

export default publicRoutes;
