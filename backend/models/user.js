// backend/models/User.js
import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pw: {
    type: DataTypes.STRING,
    allowNull: true, // tu "indicativo" no obligatorio
  },
  rol: {
    type: DataTypes.ENUM("admin", "user"),
    defaultValue: "user",
  },
  img: {
    type: DataTypes.STRING,
    allowNull: true, // imagen opcional
  },
});

export default User;
