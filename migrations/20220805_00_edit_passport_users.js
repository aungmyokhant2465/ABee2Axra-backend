const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn("users", "password", {
      type: DataTypes.STRING,
      allowNull: true,
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn("users", "password", {
      type: DataTypes.STRING,
      allowNull: false,
    });
  },
};
