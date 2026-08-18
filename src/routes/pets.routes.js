import { Router } from "express";
import { asyncHandler } from "../middlewares/global/asyncHandler.js";
import { AppDataSource } from "../config/database_postgres.js";
import { IsNull } from "typeorm";
import {
  BAD_REQUEST_STATUS,
  CREATED_STATUS,
  OK_STATUS,
  NO_CONTENT_STATUS,
  NOT_FOUND_STATUS,
  CONFLICT_STATUS,
} from "../constants/server.js";
import { PetEntity } from "../entidades/Pet.js";
import { AdocaoEntity } from "../entidades/Adocao.js";
import { AdocaoHistoricoEntity } from "../entidades/AdocaoHistorico.js";
import { LarAdotivoEntity } from "../entidades/LarAdotivo.js";
import { PORTES_VALIDOS } from "../constants/porte.js";
import { SEXOS_VALIDOS } from "../constants/sexo.js";
import { ROLES } from "../constants/roles.js";
import { STATUS_ADOCAO } from "../constants/statusAdocao.js";
import { autorizarHandler } from "../middlewares/auth/autorizarHandler.js";
import { verifyIdExistsHandler } from "../middlewares/verifyIdExistsHandler.js";

const petsRoutes = new Router();
const petRepository = AppDataSource.getRepository(PetEntity);
const adocaoRepository = AppDataSource.getRepository(AdocaoEntity);
const adocaoHistoricoRepository = AppDataSource.getRepository(AdocaoHistoricoEntity);

petsRoutes.post(
  "/pets",
  autorizarHandler(ROLES.ADMIN, ROLES.FUNCIONARIO),
  asyncHandler(async (request, response) => {
    const dados = request.body;
      // validação feita com ia
    if (!dados.nome) {
      response.status(BAD_REQUEST_STATUS).send({ error: "nome é obrigatório" });
      return;
    }

    if (!dados.tipo_id) {
      response.status(BAD_REQUEST_STATUS).send({ error: "tipo_id é obrigatório" });
      return;
    }

    if (!dados.raca_id) {
      response.status(BAD_REQUEST_STATUS).send({ error: "raca_id é obrigatório" });
      return;
    }

    if (!dados.cor_id) {
      response.status(BAD_REQUEST_STATUS).send({ error: "cor_id é obrigatório" });
      return;
    }

    if (!dados.porte || !PORTES_VALIDOS.includes(dados.porte)) {
      response.status(BAD_REQUEST_STATUS).send({ error: "porte é obrigatório e deve ser P, M ou G" });
      return;
    }

    if (dados.sexo && !SEXOS_VALIDOS.includes(dados.sexo)) {
      response.status(BAD_REQUEST_STATUS).send({ error: "sexo deve ser M ou F" });
      return;
    }

    if (dados.foto_url && typeof dados.foto_url !== "string") {
      response.status(BAD_REQUEST_STATUS).send({ error: "foto_url deve ser uma string" });
      return;
    }

    if (dados.historia && typeof dados.historia !== "string") {
      response.status(BAD_REQUEST_STATUS).send({ error: "historia deve ser uma string" });
      return;
    }

    if (dados.comportamento && typeof dados.comportamento !== "string") {
      response.status(BAD_REQUEST_STATUS).send({ error: "comportamento deve ser uma string" });
      return;
    }

    if (dados.observacoes_extras && typeof dados.observacoes_extras !== "string") {
      response.status(BAD_REQUEST_STATUS).send({ error: "observacoes_extras deve ser uma string" });
      return;
    }

    if (dados.idade_meses && !Number.isInteger(dados.idade_meses)) {
      response.status(BAD_REQUEST_STATUS).send({ error: "idade_meses deve ser um número inteiro" });
      return;
    }

    const novoPet = await petRepository.save({
      nome: dados.nome,
      tipo: { id: dados.tipo_id },
      raca: { id: dados.raca_id },
      cor: { id: dados.cor_id },
      porte: dados.porte,
      sexo: dados.sexo,
      foto_url: dados.foto_url,
      historia: dados.historia,
      comportamento: dados.comportamento,
      observacoes_extras: dados.observacoes_extras,
      idade_meses: dados.idade_meses,
    });

    response.status(CREATED_STATUS).send(novoPet);
  }),
);

petsRoutes.get(
  "/pets",
  autorizarHandler(ROLES.ADMIN, ROLES.FUNCIONARIO),
  asyncHandler(async (request, response) => {
    const pets = await petRepository.find({
      where: { deletado_em: IsNull() },
      relations: {
        tipo: true,
        raca: true,
        cor: true,
      },
    });

    for (const pet of pets) {
      const adocoesDoPet = await adocaoRepository.find({
        where: { pet: { id: pet.id } },
        relations: { historico: true, larAdotivo: true },
      });

      pet.lar_adotivo = null;

      for (const adocao of adocoesDoPet) {
        const historicoOrdenado = [...adocao.historico].sort(
          (a, b) => new Date(b.criado_em) - new Date(a.criado_em),
        );
        const ultimoStatus = historicoOrdenado[0]?.status;

        if (ultimoStatus === STATUS_ADOCAO.FINALIZADO) {
          pet.lar_adotivo = adocao.larAdotivo;
        }
      }
    }

    response.status(OK_STATUS).send(pets);
  }),
);

petsRoutes.get(
  "/pets/:id",
  autorizarHandler(ROLES.ADMIN, ROLES.FUNCIONARIO),
  verifyIdExistsHandler(PetEntity, "Pet"),
  asyncHandler(async (request, response) => {
    if (request.resgistro.deletado_em) {
      response.status(NOT_FOUND_STATUS).send({ error: "Pet não encontrado(a)" });
      return;
    }

    response.status(OK_STATUS).send(request.resgistro);
  }),
);

petsRoutes.put(
  "/pets/:id",
  autorizarHandler(ROLES.ADMIN, ROLES.FUNCIONARIO),
  verifyIdExistsHandler(PetEntity, "Pet"),
  asyncHandler(async (request, response) => {
    if (request.resgistro.deletado_em) {
      response.status(NOT_FOUND_STATUS).send({ error: "Pet não encontrado(a)" });
      return;
    }

    const dados = request.body;

    if (dados.nome !== undefined && !dados.nome) {
      response.status(BAD_REQUEST_STATUS).send({ error: "nome não pode ser vazio" });
      return;
    }

    if (dados.tipo_id !== undefined && !dados.tipo_id) {
      response.status(BAD_REQUEST_STATUS).send({ error: "tipo_id não pode ser vazio" });
      return;
    }

    if (dados.raca_id !== undefined && !dados.raca_id) {
      response.status(BAD_REQUEST_STATUS).send({ error: "raca_id não pode ser vazio" });
      return;
    }

    if (dados.cor_id !== undefined && !dados.cor_id) {
      response.status(BAD_REQUEST_STATUS).send({ error: "cor_id não pode ser vazio" });
      return;
    }

    if (dados.porte !== undefined && !PORTES_VALIDOS.includes(dados.porte)) {
      response.status(BAD_REQUEST_STATUS).send({ error: "porte deve ser P, M ou G" });
      return;
    }

    if (dados.sexo && !SEXOS_VALIDOS.includes(dados.sexo)) {
      response.status(BAD_REQUEST_STATUS).send({ error: "sexo deve ser M ou F" });
      return;
    }

    if (dados.foto_url && typeof dados.foto_url !== "string") {
      response.status(BAD_REQUEST_STATUS).send({ error: "foto_url deve ser uma string" });
      return;
    }

    if (dados.historia && typeof dados.historia !== "string") {
      response.status(BAD_REQUEST_STATUS).send({ error: "historia deve ser uma string" });
      return;
    }

    if (dados.comportamento && typeof dados.comportamento !== "string") {
      response.status(BAD_REQUEST_STATUS).send({ error: "comportamento deve ser uma string" });
      return;
    }

    if (dados.observacoes_extras && typeof dados.observacoes_extras !== "string") {
      response.status(BAD_REQUEST_STATUS).send({ error: "observacoes_extras deve ser uma string" });
      return;
    }

    if (dados.idade_meses && !Number.isInteger(dados.idade_meses)) {
      response.status(BAD_REQUEST_STATUS).send({ error: "idade_meses deve ser um número inteiro" });
      return;
    }

    const petAtualizado = {
      id: request.resgistro.id,
    };

    if (dados.nome !== undefined) petAtualizado.nome = dados.nome;
    if (dados.tipo_id !== undefined) petAtualizado.tipo = { id: dados.tipo_id };
    if (dados.raca_id !== undefined) petAtualizado.raca = { id: dados.raca_id };
    if (dados.cor_id !== undefined) petAtualizado.cor = { id: dados.cor_id };
    if (dados.porte !== undefined) petAtualizado.porte = dados.porte;
    if (dados.sexo !== undefined) petAtualizado.sexo = dados.sexo;
    if (dados.foto_url !== undefined) petAtualizado.foto_url = dados.foto_url;
    if (dados.historia !== undefined) petAtualizado.historia = dados.historia;
    if (dados.comportamento !== undefined) petAtualizado.comportamento = dados.comportamento;
    if (dados.observacoes_extras !== undefined) petAtualizado.observacoes_extras = dados.observacoes_extras;
    if (dados.idade_meses !== undefined) petAtualizado.idade_meses = dados.idade_meses;

    const petSalvo = await petRepository.save(petAtualizado);

    response.status(OK_STATUS).send(petSalvo);
  }),
);

petsRoutes.delete(
  "/pets/:id",
  autorizarHandler(ROLES.ADMIN),
  verifyIdExistsHandler(PetEntity, "Pet"),
  asyncHandler(async (request, response) => {
    if (request.resgistro.deletado_em) {
      response.status(NOT_FOUND_STATUS).send({ error: "Pet não encontrado(a)" });
      return;
    }

    const adocaoDoPet = await adocaoRepository.findOneBy({
      pet: { id: request.resgistro.id },
    });

    if (adocaoDoPet) {
      response
        .status(CONFLICT_STATUS)
        .send({ error: "pet está vinculado a uma adoção e não pode ser deletado" });
      return;
    }

    await petRepository.update(request.resgistro.id, { deletado_em: new Date() });

    response.status(NO_CONTENT_STATUS).send();
  }),
);

petsRoutes.post(
  "/pets/adotar",
  autorizarHandler(ROLES.ADMIN),
  (request, response, next) => {
    request.params.id = request.body.pet_id;
    next();
  },
  verifyIdExistsHandler(PetEntity, "Pet"),
  (request, response, next) => {
    request.petParaAdocao = request.resgistro;
    request.params.id = request.body.lar_adotivo_id;
    next();
  },
  verifyIdExistsHandler(LarAdotivoEntity, "Lar adotivo"),
  asyncHandler(async (request, response) => {
    const pet = request.petParaAdocao;
    const lar = request.resgistro;
    const dados = request.body;

    if (pet.deletado_em) {
      response.status(NOT_FOUND_STATUS).send({ error: "Pet não encontrado(a)" });
      return;
    }

    if (!dados.observacoes) {
      response.status(BAD_REQUEST_STATUS).send({ error: "observacoes é obrigatório" });
      return;
    }

    const statusBloqueados = [
      STATUS_ADOCAO.ANALISE,
      STATUS_ADOCAO.CONCLUIDO,
      STATUS_ADOCAO.FINALIZADO,
    ];

    const adocoesDoPet = await adocaoRepository.find({
      where: { pet: { id: pet.id } },
      relations: { historico: true },
    });

    for (const adocao of adocoesDoPet) {
      const historicoOrdenado = [...adocao.historico].sort(
        (a, b) => new Date(b.criado_em) - new Date(a.criado_em),
      );
      const ultimoStatus = historicoOrdenado[0]?.status;

      if (statusBloqueados.includes(ultimoStatus)) {
        response.status(CONFLICT_STATUS).send({
          error: "este pet já está vinculado a uma adoção em andamento ou concluída",
        });
        return;
      }
    }

    const novaAdocao = await adocaoRepository.save({
      pet,
      larAdotivo: lar,
    });

    await adocaoHistoricoRepository.save({
      adocao: novaAdocao,
      status: STATUS_ADOCAO.ANALISE,
      observacao: dados.observacoes,
    });

    response.status(CREATED_STATUS).send(novaAdocao);
  }),
);

export default petsRoutes;
