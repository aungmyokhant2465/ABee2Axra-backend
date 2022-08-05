const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    // Users table
    await queryInterface.addColumn("users", "date_of_birth", {
      type: DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("users", "nrc", {
      type: DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("users", "education", {
      type: DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("users", "prefer_contract_plan", {
      type: DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("users", "exprience_level", {
      type: DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("users", "skill", {
      type: DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("users", "cv", {
      type: DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("users", "address", {
      type: DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("users", "about", {
      type: DataTypes.STRING,
      allowNull: true,
    });

    //Jobs table
    await queryInterface.addColumn("jobs", "contract_plan", {
      type: DataTypes.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn("jobs", "salary", {
      type: DataTypes.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn("jobs", "experience_level", {
      type: DataTypes.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn("jobs", "description", {
      type: DataTypes.TEXT,
      allowNull: false,
    });

    await queryInterface.removeColumn("jobs", "open_to");
    await queryInterface.removeColumn("jobs", "requirments");
    await queryInterface.removeColumn("jobs", "type");
  },
  down: async ({ context: queryInterface }) => {},
};
