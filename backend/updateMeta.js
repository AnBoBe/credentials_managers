import sequelize from "./database/database.js";
import User from "./models/user.js";

const userId = 5;  // Cambia al ID del usuario que quieras actualizar

const exampleMeta = {
  tradeeu: { teams: "Equipo X", correo: "user@tradeeu.com", contraseña: "passTE" },
  ALGOBI: { teams: "Equipo A", correo: "user@algobi.com", contraseña: "passAL" },
  CAPITALIX: { teams: "Equipo C", correo: "user@capitalix.com", contraseña: "passCA" }
};

const run = async () => {
  try {
    await sequelize.sync();
    const user = await User.findByPk(userId);
    if (!user) {
      console.error("Usuario no encontrado con ID", userId);
      process.exit(1);
    }
    user.meta = JSON.stringify(exampleMeta);
    await user.save();
    console.log("Meta actualizado para usuario ID", userId);
  } catch (err) {
    console.error("Error al actualizar meta:", err);
  } finally {
    process.exit();
  }
};

run();
