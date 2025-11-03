//src/components/credentialsSection.jsx

import React from "react";

const CredentialsSection = ({ title, data }) => {
  if (!data || Object.keys(data).length === 0) return null;

  const renderKeyValue = (obj, prefix = "") => {
    return Object.entries(obj).map(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        return (
          <div key={prefix + key} className="ml-4 border-l pl-3 mt-2">
            <h4 className="font-semibold text-gray-700">{key}</h4>
            {renderKeyValue(value, `${prefix}${key}.`)}
          </div>
        );
      }
      return (
        <p key={prefix + key} className="text-sm text-gray-800">
          {key}: <span className="font-medium">{value}</span>
        </p>
      );
    });
  };

  return (
    <section className="p-4 border rounded bg-gray-50">
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      {renderKeyValue(data)}
    </section>
  );
};

export default CredentialsSection;
