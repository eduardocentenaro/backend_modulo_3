CREATE TABLE "pets"(
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "tipo_id" INTEGER NOT NULL,
    "raca_id" INTEGER NOT NULL,
    "cor_id" INTEGER NOT NULL,
    "porte" VARCHAR(255) CHECK
        ("porte" IN('P', 'M', 'G')) NOT NULL,
        "sexo" VARCHAR(255)
    CHECK
        ("sexo" IN('M', 'F')) NOT NULL,
        "foto_url" VARCHAR(255) NULL,
        "historia" TEXT NULL,
        "comportamento" TEXT NULL,
        "observacoes_extras" TEXT NULL,
        "idade_meses" INTEGER NULL,
        "criado_em" TIMESTAMP(0)
    WITH
        TIME zone NOT NULL DEFAULT NOW(), "atualizado_em" TIMESTAMP(0)
    WITH
        TIME zone NOT NULL DEFAULT NOW());
ALTER TABLE
    "pets" ADD PRIMARY KEY("id");
CREATE TABLE "tipos"(
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "criado_em" TIMESTAMP(0) WITH
        TIME zone NOT NULL DEFAULT NOW(), "atualizado_em" TIMESTAMP(0)
    WITH
        TIME zone NOT NULL DEFAULT NOW());
ALTER TABLE
    "tipos" ADD PRIMARY KEY("id");
ALTER TABLE
    "tipos" ADD CONSTRAINT "tipos_nome_unique" UNIQUE("nome");
CREATE TABLE "racas"(
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "criado_em" TIMESTAMP(0) WITH
        TIME zone NOT NULL DEFAULT NOW(), "atualizado_em" TIMESTAMP(0)
    WITH
        TIME zone NOT NULL DEFAULT NOW());
ALTER TABLE
    "racas" ADD PRIMARY KEY("id");
ALTER TABLE
    "racas" ADD CONSTRAINT "racas_nome_unique" UNIQUE("nome");
CREATE TABLE "cores"(
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "criado_em" TIMESTAMP(0) WITH
        TIME zone NOT NULL DEFAULT NOW(), "atualizado_em" TIMESTAMP(0)
    WITH
        TIME zone NOT NULL DEFAULT NOW());
ALTER TABLE
    "cores" ADD PRIMARY KEY("id");
ALTER TABLE
    "cores" ADD CONSTRAINT "cores_nome_unique" UNIQUE("nome");
CREATE TABLE "adocoes"(
    "id" SERIAL NOT NULL,
    "pet_id" INTEGER NOT NULL,
    "lar_adotivo_id" INTEGER NOT NULL,
    "criado_em" TIMESTAMP(0) WITH
        TIME zone NOT NULL DEFAULT NOW(), "atualizado_em" TIMESTAMP(0)
    WITH
        TIME zone NOT NULL DEFAULT NOW());
ALTER TABLE
    "adocoes" ADD PRIMARY KEY("id");
CREATE TABLE "lares_adotivos"(
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "cep" VARCHAR(20) NOT NULL,
    "estado" VARCHAR(2) NOT NULL,
    "cidade" VARCHAR(100) NOT NULL,
    "bairro" VARCHAR(50) NOT NULL,
    "rua" VARCHAR(100) NOT NULL,
    "possui_telas_protecao" BOOLEAN NOT NULL DEFAULT FALSE,
    "tipo" VARCHAR(255) CHECK
        (
            "tipo" IN('DEFINITIVO', 'TEMPORARIO')
        ) NOT NULL DEFAULT 'DEFINITIVO',
        "telefone" VARCHAR(20) NOT NULL,
        "criado_em" TIMESTAMP(0)
    WITH
        TIME zone NOT NULL DEFAULT NOW(), "atualizado_em" TIMESTAMP(0)
    WITH
        TIME zone NOT NULL DEFAULT NOW());
ALTER TABLE
    "lares_adotivos" ADD PRIMARY KEY("id");
CREATE TABLE "adocoes_historico"(
    "id" SERIAL NOT NULL,
    "status" VARCHAR(255) CHECK
        (
            "status" IN(
                'ANALISE',
                'CONCLUIDO',
                'FINALIZADO',
                'CANCELADO',
                'REPROVADO'
            )
        ) NOT NULL,
        "observacao" TEXT NOT NULL,
        "adocao_id" INTEGER NOT NULL,
        "criado_em" TIMESTAMP(0)
    WITH
        TIME zone NOT NULL DEFAULT NOW(), "atualizado_em" TIMESTAMP(0)
    WITH
        TIME zone NOT NULL DEFAULT NOW());
ALTER TABLE
    "adocoes_historico" ADD PRIMARY KEY("id");
CREATE TABLE "usuarios"(
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(50) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "senha" VARCHAR(100) NOT NULL,
    "role" VARCHAR(255) CHECK
        ("role" IN('admin', 'funcionario')) NOT NULL,
        "criado_em" TIMESTAMP(0)
    WITH
        TIME zone NOT NULL DEFAULT NOW(), "atualizado_em" TIMESTAMP(0)
    WITH
        TIME zone NOT NULL DEFAULT NOW());
ALTER TABLE
    "usuarios" ADD PRIMARY KEY("id");
ALTER TABLE
    "usuarios" ADD CONSTRAINT "usuarios_email_unique" UNIQUE("email");
ALTER TABLE
    "pets" ADD CONSTRAINT "pets_cor_id_foreign" FOREIGN KEY("cor_id") REFERENCES "cores"("id");
ALTER TABLE
    "adocoes_historico" ADD CONSTRAINT "adocoes_historico_adocao_id_foreign" FOREIGN KEY("adocao_id") REFERENCES "adocoes"("id");
ALTER TABLE
    "pets" ADD CONSTRAINT "pets_tipo_id_foreign" FOREIGN KEY("tipo_id") REFERENCES "tipos"("id");
ALTER TABLE
    "pets" ADD CONSTRAINT "pets_raca_id_foreign" FOREIGN KEY("raca_id") REFERENCES "racas"("id");
ALTER TABLE
    "adocoes" ADD CONSTRAINT "adocoes_lar_adotivo_id_foreign" FOREIGN KEY("lar_adotivo_id") REFERENCES "lares_adotivos"("id");
ALTER TABLE
    "adocoes" ADD CONSTRAINT "adocoes_pet_id_foreign" FOREIGN KEY("pet_id") REFERENCES "pets"("id");