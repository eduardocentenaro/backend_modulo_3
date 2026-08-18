import { EntitySchema } from "typeorm";

export const CorEntity = new EntitySchema({
  name: "Cor",
  tableName: "cores",
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
      unique: true,
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
    pets: {
      type: "one-to-many",
      target: "Pet",
      inverseSide: "cor",
    },
  },
});
