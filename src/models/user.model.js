const { DataTypes } = require("sequelize");

const userModel = (sequelize) => {
  const model = sequelize.define(
    "users",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      chatId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      used_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      timestamps: true,
      tableName: "users",
    }
  );

  return model;
};

module.exports = userModel;
