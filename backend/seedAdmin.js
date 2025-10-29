// backend/seedAdmin.js
import bcrypt from "bcryptjs";
import sequelize from "./database/database.js";
import User from "./models/user.js";

const seedAdmin = async () => {
  try {
    // Sincronizar los modelos con la base de datos
    await sequelize.sync({ alter: true });

    // Verificar si ya existe un admin
    const adminExistente = await User.findOne({ where: { email: "admin@local" } });

    if (!adminExistente) {
      const hashedPassword = await bcrypt.hash("admin123", 10);

      await User.create({
        nombre: "Administrador",
        email: "admin@local",
        password: hashedPassword,
        pw: "0000", // Indicativo inicial del admin
        rol: "admin",
        img: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      });

      console.log("Usuario administrador creado exitosamente.");
    } else {
      console.log("El usuario admin ya existe. No se creó uno nuevo.");
    }

    process.exit();
  } catch (error) {
    console.error("Error al crear el usuario admin:", error);
    process.exit(1);
  }
};

seedAdmin();
