import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const User = sequelize.define("User", {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmailOrEmpty(value) {
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          throw new Error("Formato de email inválido");
        }
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rol: {
    type: DataTypes.STRING,
    defaultValue: "usuario",
  },
  pw: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  img: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  mustChangePassword: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  meta: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default User;
