const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn("jobs", "photo", {
      type: DataTypes.STRING,
      allowNull: true,
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn("jobs", "photo");
  },
};
