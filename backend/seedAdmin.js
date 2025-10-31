// backend/seedAdmin.js
import bcrypt from "bcryptjs";
import User from "./models/user.js";
import sequelize from "./config/db.js";

async function seedAdmin() {
  try {
    await sequelize.sync(); // Asegura que las tablas existan

    // Verifica si ya existe un admin
    const existingAdmin = await User.findOne({ where: { pw: "0000" } });
    if (existingAdmin) {
      console.log("El usuario admin ya existe.");
      return;
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.create({
      nombre: "Administrador",
      email: "admin@local.com", // formato válido, pero no se usa en login
      password: hashedPassword,
      rol: "admin",
      pw: "0000", // el consecutivo que usará para loguearse
      mustChangePassword: true, // fuerza cambio en el primer login
    });

    console.log("Usuario admin creado correctamente:");
    console.log("PW: 0000");
    console.log("Contraseña inicial: admin123");
  } catch (error) {
    console.error("Error al crear el usuario admin:", error);
  } finally {
    await sequelize.close();
  }
}

seedAdmin();
