import { EntitySchema } from "typeorm";
import { ROLES, ROLES_VALIDAS } from "../constants/roles.js";

export const UsuarioEntity = new EntitySchema({
  name: "Usuario",
  tableName: "usuarios",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: "increment",
    },
    nome: {
      type: "varchar",
      length: 150,
      nullable: false,
    },
    email: {
      type: "varchar",
      length: 150,
      nullable: false,
      unique: true,
    },
    senha: {
      type: "varchar",
      length: 150,
      nullable: false,
    },
    role: {
      type: "enum",
      enum: ROLES_VALIDAS,
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
});
