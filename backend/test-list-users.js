import sequelize from "./database/database.js";
import User from "./models/user.js";

const run = async () => {
  try {
    await sequelize.sync();
    const users = await User.findAll({ attributes: ["id", "nombre", "pw"] });
    console.log(users.map((u) => u.toJSON()));
  } catch (err) {
    console.error("Error:", err);
  } finally {
    process.exit();
  }
};

run();
