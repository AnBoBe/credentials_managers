import React, { useState } from "react";
import * as XLSX from "xlsx";
import { createUser } from "../services/api";

const ImportExcelUsers = ({ onFinish }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [progress, setProgress] = useState(0);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    setError("");
    setSuccess("");
    setProgress(0);

    try {
      const fileData = await file.arrayBuffer(); // nombre cambiado
      const workbook = XLSX.read(fileData);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      let created = 0;

      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];

        // Construcción del payload para el backend
        const payload = {
          nombre: r["Nombre"] || "",
          email: r["Email"] || "",
          password: r["Password"] || "123456",
          rol: r["Rol"] || "user",
          pw: r["PW"] || "",
          meta: {
            tradeeu: {
              teams: r["TradeEU Teams"] || "",
              correo: r["TradeEU Correo"] || "",
              contraseña: r["TradeEU Contraseña"] || "",
              DID_Voiso: {
                correo: r["TradeEU DID_Voiso Correo"] || "",
                contraseña: r["TradeEU DID_Voiso Contraseña"] || "",
              },
              Voicespin: {
                agent: r["TradeEU Voicespin Agent"] || "",
                ext: r["TradeEU Voicespin Ext"] || "",
                secret_extension: r["TradeEU Voicespin Secret"] || "",
              },
              omni: {
                usuario: r["TradeEU Omni Usuario"] || "",
                contraseña: r["TradeEU Omni Contraseña"] || "",
              },
            },
            ALGOBI: {
              teams: r["ALGOBI Teams"] || "",
              correo: r["ALGOBI Correo"] || "",
              contraseña: r["ALGOBI Contraseña"] || "",
              DID_Voiso: {
                correo: r["ALGOBI DID_Voiso Correo"] || "",
                contraseña: r["ALGOBI DID_Voiso Contraseña"] || "",
              },
              omni: {
                usuario: r["ALGOBI Omni Usuario"] || "",
                contraseña: r["ALGOBI Omni Contraseña"] || "",
              },
            },
            CAPITALIX: {
              teams: r["CAPITALIX Teams"] || "",
              correo: r["CAPITALIX Correo"] || "",
              contraseña: r["CAPITALIX Contraseña"] || "",
              DID_Voiso: {
                correo: r["CAPITALIX DID_Voiso Correo"] || "",
                contraseña: r["CAPITALIX DID_Voiso Contraseña"] || "",
              },
              Voicespin: {
                agent: r["CAPITALIX Voicespin Agent"] || "",
                ext: r["CAPITALIX Voicespin Ext"] || "",
                secret_extension: r["CAPITALIX Voicespin Secret"] || "",
              },
            },
          },
        };

        try {
          await createUser(payload);
          created++;
          setProgress(Math.round(((i + 1) / rows.length) * 100));
        } catch (err) {
          console.error("Error en fila", i + 1, err);
        }
      }

      setSuccess(`Se crearon ${created} usuarios correctamente`);
      if (onFinish) onFinish();
    } catch (err) {
      console.error(err);
      setError("Error al procesar el archivo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 border rounded-lg bg-gray-100 text-black w-full max-w-lg mx-auto">
      <h3 className="text-lg font-semibold mb-2">Importar usuarios desde Excel</h3>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFile}
        disabled={loading}
        className="mb-4"
      />
      {loading && <p>Procesando... {progress}%</p>}
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}
    </div>
  );
};

export default ImportExcelUsers;
