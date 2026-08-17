import { EntitySchema } from "typeorm";
import { PORTES_VALIDOS } from "../constants/porte.js";
import { SEXOS_VALIDOS } from "../constants/sexo.js";

export const PetEntity = new EntitySchema({
  name: "Pet",
  tableName: "pets",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: "increment",
    },
    nome: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    porte: {
      type: "enum",
      enum: PORTES_VALIDOS,
      nullable: false,
    },
    sexo: {
      type: "enum",
      enum: SEXOS_VALIDOS,
      nullable: true,
    },
    foto_url: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    historia: {
      type: "text",
      nullable: true,
    },
    comportamento: {
      type: "text",
      nullable: true,
    },
    observacoes_extras: {
      type: "text",
      nullable: true,
    },
    idade_meses: {
      type: "int",
      nullable: true,
    },
    criado_em: {
      type: "timestamp with time zone",
      nullable: false,
      default: () => "CURRENT_TIMESTAMP",
    },
    atualizado_em: {
      type: "timestamp with time zone",
      nullable: false,
      default: () => "CURRENT_TIMESTAMP",
    },
    deletado_em: {
      type: "timestamp with time zone",
      nullable: true,
    },
  },
  relations: {
    tipo: {
      type: "many-to-one",
      target: "Tipo",
      joinColumn: { name: "tipo_id" },
      nullable: false,
      inverseSide: "pets",
    },
    raca: {
      type: "many-to-one",
      target: "Raca",
      joinColumn: { name: "raca_id" },
      nullable: false,
      inverseSide: "pets",
    },
    cor: {
      type: "many-to-one",
      target: "Cor",
      joinColumn: { name: "cor_id" },
      nullable: false,
      inverseSide: "pets",
    },
    adocoes: {
      type: "one-to-many",
      target: "Adocao",
      inverseSide: "pet",
    },
  },
});
