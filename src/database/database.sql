CREATE TABLE "mesas"(
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(50) NOT NULL,
    "reservado" BOOLEAN NOT NULL DEFAULT FALSE,
    "quantidade_lugares" INTEGER NULL,
    "criado_em" TIMESTAMP(0) WITH
        TIME zone NOT NULL DEFAULT NOW(), "atualizado_em" TIMESTAMP(0)
    WITH
        TIME zone NOT NULL DEFAULT NOW());
ALTER TABLE
    "mesas" ADD PRIMARY KEY("id");
CREATE TABLE "items_cardapio"(
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "preco" DECIMAL(10, 2) NOT NULL,
    "tipo" VARCHAR(100) NOT NULL,
    "porcoes" INTEGER NOT NULL,
    "tamanho" VARCHAR(255) CHECK
        ("tamanho" IN('P', 'M', 'G')) NOT NULL,
        "vegetariano" BOOLEAN NOT NULL DEFAULT FALSE,
        "descricao" TEXT NULL,
        "criado_em" TIMESTAMP(0)
    WITH
        TIME zone NOT NULL DEFAULT NOW(), "atualizado_em" TIMESTAMP(0)
    WITH
        TIME zone NOT NULL DEFAULT NOW());
ALTER TABLE
    "items_cardapio" ADD PRIMARY KEY("id");
CREATE TABLE "chefs"(
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "faz_sobremesa" BOOLEAN NOT NULL DEFAULT FALSE,
    "especializacao" TEXT NULL,
    "criado_em" TIMESTAMP(0) WITH
        TIME zone NOT NULL DEFAULT NOW(), "atualizado_em" TIMESTAMP(0)
    WITH
        TIME zone NOT NULL DEFAULT NOW());
ALTER TABLE
    "chefs" ADD PRIMARY KEY("id");
CREATE TABLE "pedidos"(
    "id" SERIAL NOT NULL,
    "nome_cliente" VARCHAR(100) NOT NULL,
    "mesa_id" INTEGER NOT NULL,
    "fechado" BOOLEAN NOT NULL DEFAULT FALSE,
    "data" DATE NOT NULL,
    "total" DECIMAL(10, 2) NULL,
    "criado_em" TIMESTAMP(0) WITH
        TIME zone NOT NULL DEFAULT NOW(), "atualizado_em" TIMESTAMP(0)
    WITH
        TIME zone NOT NULL DEFAULT NOW());
ALTER TABLE
    "pedidos" ADD PRIMARY KEY("id");
CREATE TABLE "agenda_chefs"(
    "id" SERIAL NOT NULL,
    "chef_id" INTEGER NOT NULL,
    "semana" INTEGER NOT NULL,
    "mes" BIGINT NOT NULL,
    "segunda" BOOLEAN NOT NULL DEFAULT FALSE,
    "terca" BOOLEAN NOT NULL DEFAULT FALSE,
    "quarta" BOOLEAN NOT NULL DEFAULT FALSE,
    "quinta" BOOLEAN NOT NULL DEFAULT FALSE,
    "sexta" BOOLEAN NOT NULL DEFAULT FALSE,
    "sabado" BOOLEAN NOT NULL DEFAULT FALSE,
    "domingo" BOOLEAN NOT NULL DEFAULT FALSE,
    "criado_em" TIMESTAMP(0) WITH
        TIME zone NOT NULL DEFAULT NOW(), "atualizado_em" TIMESTAMP(0)
    WITH
        TIME zone NOT NULL DEFAULT NOW());
ALTER TABLE
    "agenda_chefs" ADD PRIMARY KEY("id");
CREATE TABLE "items_pedidos"(
    "id" SERIAL NOT NULL,
    "pedido_id" INTEGER NOT NULL,
    "item_cardapio_id" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "criado_em" TIMESTAMP(0) WITH
        TIME zone NOT NULL DEFAULT NOW(), "atualizado_em" TIMESTAMP(0)
    WITH
        TIME zone NOT NULL DEFAULT NOW());
ALTER TABLE
    "items_pedidos" ADD PRIMARY KEY("id");
ALTER TABLE
    "agenda_chefs" ADD CONSTRAINT "agenda_chefs_chef_id_foreign" FOREIGN KEY("chef_id") REFERENCES "chefs"("id");
ALTER TABLE
    "items_pedidos" ADD CONSTRAINT "items_pedidos_item_cardapio_id_foreign" FOREIGN KEY("item_cardapio_id") REFERENCES "items_cardapio"("id");
ALTER TABLE
    "items_pedidos" ADD CONSTRAINT "items_pedidos_pedido_id_foreign" FOREIGN KEY("pedido_id") REFERENCES "pedidos"("id");
ALTER TABLE
    "pedidos" ADD CONSTRAINT "pedidos_mesa_id_foreign" FOREIGN KEY("mesa_id") REFERENCES "mesas"("id");