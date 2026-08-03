import bcrypt from "bcrypt";
import { AppDataSource } from "../../config/database_postgres.js";
import { UsuarioEntity } from "../../entidades/Usuario.js";
import { ROLES } from "../../constants/roles.js";

export const usuarioSeed = async () => {
  try {
    await AppDataSource.initialize();

    const usuarioRepository = AppDataSource.getRepository(UsuarioEntity);
    const emailAdmin = "admin@restaurante.com";

    const usuarioExistente = await usuarioRepository.findOneBy({
      email: emailAdmin,
    });

    if (usuarioExistente) {
      console.log(`Usuário admin já existe: ${emailAdmin}`);
      return;
    }

    const senhaHash = await bcrypt.hash("admin123", 12);

    const novoUsuario = await usuarioRepository.save({
      nome: "Administrador",
      email: emailAdmin,
      senha: senhaHash,
      role: ROLES.ADMIN,
    });

    console.log(
      `Seed concluída. Usuário admin criado com e-mail: ${emailAdmin}`,
    );
  } catch (error) {
    console.error("Erro ao criar seed de usuário admin:", error);
    process.exitCode = 1;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
};
