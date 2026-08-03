import { AppDataSource } from "../../config/database_postgres.js";

const coresPet = [
  "Outro",
  "Preto",
  "Branco",
  "Marrom",
  "Caramelo",
  "Bege",
  "Cinza",
  "Grafite",
  "Creme",
  "Amarelo",
  "Laranja",
  "Vermelho",
  "Rosa",
  "Roxo",
  "Azul",
  "Verde",
  "Turquesa",
  "Dourado",
  "Prata",
  "Chocolate",
  "Tijolo",
  "Bordô",
  "Vinho",
  "Lilás",
  "Lavanda",
  "Magenta",
  "Coral",
  "Pêssego",
  "Terracota",
  "Oliva",
  "Menta",
  "Ciano",
  "Teal",
  "Ocre",
  "Café",
  "Avelã",
  "Baunilha",
  "Castanho",
  "Nude",
  "Cobre",
  "Ardósia",
  "Índigo",
  "Marfim",
  "Púrpura",
  "Fúcsia",
  "Salmão",
  "Mocassim",
  "Pistache",
  "Champagne",
  "Azul-marinho",
  "Cinza-escuro",
  "Verde-musgo",
];

export const seedCores = async () => {
  try {
    await AppDataSource.initialize();

    for (const nome of coresPet) {
      await AppDataSource.query(
        `INSERT INTO cores (nome) VALUES ($1) ON CONFLICT (nome) DO NOTHING`,
        [nome],
      );
    }

    const [{ total }] = await AppDataSource.query(
      `SELECT COUNT(*)::int AS total FROM cores`,
    );

    console.log(`Seed de cores concluída. Total de registros: ${total}`);
  } catch (error) {
    console.error("Erro ao criar seed de cores:", error);
    process.exitCode = 1;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
};
