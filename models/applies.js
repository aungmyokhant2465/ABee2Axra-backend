const { Model, DataTypes } = require("sequelize");

const { sequelize } = require("../util/db");

class Applies extends Model {}

Applies.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    jobId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "jobs", key: "id" },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "applie",
  }
);

module.exports = Applies;
