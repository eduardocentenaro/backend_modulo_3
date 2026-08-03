import { AppDataSource } from "../../config/database_postgres.js";

const racasPet = [
  "Outro",
  "Labrador Retriever",
  "Golden Retriever",
  "Bulldog Francês",
  "Poodle",
  "Pastor Alemão",
  "Beagle",
  "Dachshund",
  "Rottweiler",
  "Shih Tzu",
  "Yorkshire Terrier",
  "Siberian Husky",
  "Bichon Frisé",
  "Boxer",
  "Chihuahua",
  "Border Collie",
  "Pug",
  "Pinscher",
  "Cocker Spaniel",
  "Maltês",
  "Persa",
  "Siamês",
  "Angorá",
  "Maine Coon",
  "Bengal",
  "Ragdoll",
  "Sphynx",
  "American Shorthair",
  "British Shorthair",
  "Scottish Fold"
];

export const seedRacas = async () => {
  try {
    await AppDataSource.initialize();

    for (const nome of racasPet) {
      await AppDataSource.query(
        `INSERT INTO racas (nome) VALUES ($1) ON CONFLICT (nome) DO NOTHING`,
        [nome],
      );
    }

    const [{ total }] = await AppDataSource.query(
      `SELECT COUNT(*)::int AS total FROM racas`,
    );

    console.log(`Seed de raças concluída. Total de registros: ${total}`);
  } catch (error) {
    console.error("Erro ao criar seed de raças:", error);
    process.exitCode = 1;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
};

