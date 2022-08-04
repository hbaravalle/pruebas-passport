const { Sequelize, Model, DataTypes } = require("sequelize");

const sequelize = new Sequelize("prueba-passport", "root", "rootroot", {
  host: "127.0.0.1",
  dialect: "mysql",
});

const User = require("./User")(sequelize, Model, DataTypes);

sequelize.sync().then(() => console.log("Las tablas se han creado"));

module.exports = { sequelize, User };
