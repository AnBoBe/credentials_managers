import sequelize from "./database/database.js";
import User from "./models/user.js";

async function addCRM() {
  try {
    await sequelize.authenticate();
    console.log("Conectado a la base de datos");

    const users = await User.findAll();

    for (const u of users) {
      const data = u.toJSON();
      let meta = data.meta;

      if (typeof meta === "string") {
        try {
          meta = JSON.parse(meta);
        } catch {
          meta = {};
        }
      }

      // Asegurar estructura base
      const companies = ["tradeeu", "ALGOBI", "CAPITALIX"];

      for (const company of companies) {
        meta[company] = meta[company] || {};
        meta[company].crm = meta[company].crm || {
          correo: "",
          contraseña: "",
        };

        // Si quieres que el crm copie el mismo correo y contraseña base de la empresa:
        if (!meta[company].crm.correo && meta[company].correo) {
          meta[company].crm.correo = meta[company].correo;
        }
        if (!meta[company].crm.contraseña && meta[company].contraseña) {
          meta[company].crm.contraseña = meta[company].contraseña;
        }
      }

      await u.update({ meta: JSON.stringify(meta) });
      console.log(`Usuario ${u.id} actualizado`);
    }

    console.log("Todos los usuarios actualizados con el campo crm");
    await sequelize.close();
  } catch (err) {
    console.error("Error durante la migración:", err);
    process.exit(1);
  }
}

addCRM();
