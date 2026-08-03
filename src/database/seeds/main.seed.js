import { usuarioSeed } from "./usuarios.seed.js";
import { seedCores } from "./cores.seed.js";
import { seedRacas } from "./racas.seed.js";
import { seedTiposPets } from "./tipos_pets.seed.js";

const runAllSeeds = async () => {
  try {
    await usuarioSeed();
    await seedCores();
    await seedRacas();
    await seedTiposPets();

    console.log("\nTodas as seeds foram executadas com sucesso.");
  } catch (error) {
    console.error("Erro ao executar as seeds:", error.message);
    process.exitCode = 1;
  }
};

runAllSeeds();
