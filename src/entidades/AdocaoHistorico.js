import { EntitySchema } from "typeorm";
import { STATUS_ADOCAO_VALIDOS } from "../constants/statusAdocao.js";

export const AdocaoHistoricoEntity = new EntitySchema({
  name: "AdocaoHistorico",
  tableName: "adocoes_historico",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: "increment",
    },
    status: {
      type: "enum",
      enum: STATUS_ADOCAO_VALIDOS,
      nullable: false,
    },
    observacao: {
      type: "text",
      nullable: false,
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
  },
  relations: {
    adocao: {
      type: "many-to-one",
      target: "Adocao",
      joinColumn: { name: "adocao_id" },
      nullable: false,
      inverseSide: "historico",
    },
  },
});
