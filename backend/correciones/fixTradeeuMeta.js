// backend/fixTradeeuMeta.js
import sequelize from "./database/database.js";
import User from "./models/user.js";

async function fix() {
  try {
    await sequelize.authenticate();
    console.log("Conectado a la DB");

    const users = await User.findAll();

    for (const u of users) {
      const data = u.toJSON();
      let meta = data.meta;

      // meta puede venir como string o ya object
      if (typeof meta === "string") {
        try { meta = JSON.parse(meta); } catch { meta = {}; }
      }
      meta = meta || {};

      // Asegurar estructura base
      meta.tradeeu = meta.tradeeu || {};
      meta.tradeeu.DID_Voiso = meta.tradeeu.DID_Voiso || {};
      meta.tradeeu.Voicespin = meta.tradeeu.Voicespin || {};
      meta.tradeeu.omni = meta.tradeeu.omni || {};

      // Si hay datos a nivel raíz y tradeeu.* está vacío, copiarlos
      if ((!meta.tradeeu.DID_Voiso || Object.keys(meta.tradeeu.DID_Voiso).length === 0)
          && meta.DID_Voiso && Object.keys(meta.DID_Voiso).length > 0) {
        meta.tradeeu.DID_Voiso = meta.DID_Voiso;
      }
      if ((!meta.tradeeu.Voicespin || Object.keys(meta.tradeeu.Voicespin).length === 0)
          && meta.Voicespin && Object.keys(meta.Voicespin).length > 0) {
        meta.tradeeu.Voicespin = meta.Voicespin;
      }
      if ((!meta.tradeeu.omni || Object.keys(meta.tradeeu.omni).length === 0)
          && meta.omni && Object.keys(meta.omni).length > 0) {
        meta.tradeeu.omni = meta.omni;
      }

      // (Opcional) eliminar las claves raiz si deseas:
      // delete meta.DID_Voiso; delete meta.Voicespin; delete meta.omni;

      // Solo actualizar si hubo cambio
      await u.update({ meta: JSON.stringify(meta) });
      console.log(`Usuario ${u.id} actualizado`);
    }

    console.log("Migración completa");
    await sequelize.close();
  } catch (err) {
    console.error("Error en migración:", err);
    process.exit(1);
  }
}

fix();
