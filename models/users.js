const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../util/db");

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    profile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    nrc: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    education: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    preferContractPlan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    exprienceLevel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    skill: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cv: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    about: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "user",
    scopes: {
      withoutPassword: {
        attributes: {
          exclude: ["password"],
        },
      },
    },
  }
);

module.exports = User;
