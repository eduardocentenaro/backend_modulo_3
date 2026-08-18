import { EntitySchema } from "typeorm";

export const AdocaoEntity = new EntitySchema({
  name: "Adocao",
  tableName: "adocoes",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: "increment",
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
    pet: {
      type: "many-to-one",
      target: "Pet",
      joinColumn: { name: "pet_id" },
      nullable: false,
      inverseSide: "adocoes",
    },
    larAdotivo: {
      type: "many-to-one",
      target: "LarAdotivo",
      joinColumn: { name: "lar_adotivo_id" },
      nullable: false,
      inverseSide: "adocoes",
    },
    historico: {
      type: "one-to-many",
      target: "AdocaoHistorico",
      inverseSide: "adocao",
    },
  },
});
