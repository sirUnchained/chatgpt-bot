const { Sequelize } = require("sequelize");

const db = new Sequelize({
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  loggin: true,
});

(async function runDB() {
  try {
    await db.authenticate();
    console.log("database connected !");
  } catch (error) {
    console.log(error);
    await db.close();
  }
})();

const userModel = require("./models/user.model")(db);

module.exports = { db, userModel };
