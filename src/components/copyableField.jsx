import { useState } from "react";
import { Copy, Eye, EyeOff } from "lucide-react";

const CopyableField = ({
  label,
  value = "",
  type = "text",
  hideToggle = false,
}) => {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

const handleCopy = () => {
  if (!value) return;

  // Usar Clipboard API si existe
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(value)
      .then(() => showCopied())
      .catch(() => fallbackCopy());
  } else {
    fallbackCopy();
  }
};

const fallbackCopy = () => {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  showCopied();
};

const showCopied = () => {
  setCopied(true);
  setTimeout(() => setCopied(false), 1500);
};

  const isPassword = type === "password";

  // Mostrar siempre 8 puntos si es una contraseña y no está visible
  const displayValue =
    isPassword && !visible ? "•".repeat(8) : value || "-";

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-2 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-700 w-28">
          {label}:
        </label>
      )}

      <div className="flex items-center flex-1 border border-gray-300 bg-white rounded-lg px-2 py-1">
        <span className="flex-1 truncate select-text text-sm">
          {displayValue}
        </span>

        <div className="flex items-center gap-1 ml-2">
          {/* Botón de mostrar/ocultar solo si no está oculto */}
          

          <button
            onClick={handleCopy}
            className="p-1 hover:text-green-600 transition relative"
            title="Copiar"
          >
            <Copy size={16} />
            {copied && (
              <span className="absolute -top-5 right-0 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded shadow">
                Copiado
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CopyableField;
