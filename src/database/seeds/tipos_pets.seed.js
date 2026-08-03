import { AppDataSource } from "../../config/database_postgres.js";

const tiposPets = [
  "Outro",
  "Cachorro",
  "Gato",
  "Pássaro",
  "Peixe",
  "Coelho",
  "Hamster",
  "Tartaruga",
  "Furão",
  "Cavalo",
  "Porquinho-da-índia",
  "Chinchila",
  "Papagaio",
  "Calopsita",
  "Periquito",
  "Serpente",
  "Lagarto",
  "Caranguejo",
  "Tilápia",
  "Camundongo",
  "Rato",
  "Avestruz",
  "Ovelha",
  "Cabra",
  "Vaca",
  "Porco",
  "Capivara",
  "Texugo",
  "Raposa",
  "Gato-do-mato",
  "Cachorro de rua",
];

export const seedTiposPets = async () => {
  try {
    await AppDataSource.initialize();

    for (const nome of tiposPets) {
      await AppDataSource.query(
        `INSERT INTO tipos_pets (nome) VALUES ($1) ON CONFLICT (nome) DO NOTHING`,
        [nome],
      );
    }

    const [{ total }] = await AppDataSource.query(
      `SELECT COUNT(*)::int AS total FROM tipos_pets`,
    );

    console.log(
      `Seed de tipos de pets concluída. Total de registros: ${total}`,
    );
  } catch (error) {
    console.error("Erro ao criar seed de tipos de pets:", error);
    process.exitCode = 1;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
};
