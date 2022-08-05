const { Model, DataTypes, Op } = require("sequelize");
const { sequelize } = require("../util/db");
const User = require("./users");

class Job extends Model {}

Job.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contractPlan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    salary: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    experienceLevel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    // appliers: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true,
    //   references: { model: "users", key: "id" },
    // },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "job",
    scopes: {
      withApplier: {
        include: [
          {
            model: User,
            as: "applier",
            attributes: { exclude: ["password"] },
          },
        ],
      },
      title(value) {
        return {
          where: {
            title: {
              [Op.like]: value,
            },
          },
        };
      },
      plan(value) {
        return {
          where: {
            contractPlan: {
              [Op.in]: value,
            },
          },
        };
      },
      experience(value) {
        return {
          where: {
            experienceLevel: {
              [Op.in]: value,
            },
          },
        };
      },
      location(value) {
        return {
          where: {
            location: {
              [Op.like]: value,
            },
          },
        };
      },

      titleAndLocation(value1, value2) {
        return {
          where: {
            [Op.and]: [
              {
                title: {
                  [Op.like]: value1,
                },
              },
              {
                location: {
                  [Op.like]: value2,
                },
              },
            ],
          },
        };
      },
      titleAndPlan(value1, value2) {
        return {
          where: {
            [Op.and]: [
              {
                title: {
                  [Op.like]: value1,
                },
              },
              {
                contractPlan: {
                  [Op.in]: value2,
                },
              },
            ],
          },
        };
      },
      titleAndExperience(value1, value2) {
        return {
          where: {
            [Op.and]: [
              {
                title: {
                  [Op.like]: value1,
                },
              },
              {
                experienceLevel: {
                  [Op.in]: value2,
                },
              },
            ],
          },
        };
      },
      locationAndPlan(value1, value2) {
        return {
          where: {
            [Op.and]: [
              {
                location: {
                  [Op.like]: value2,
                },
              },
              {
                contractPlan: {
                  [Op.in]: value1,
                },
              },
            ],
          },
        };
      },
      locationAndExperience(value1, value2) {
        return {
          where: {
            [Op.and]: [
              {
                location: {
                  [Op.like]: value1,
                },
              },
              {
                experienceLevel: {
                  [Op.in]: value2,
                },
              },
            ],
          },
        };
      },
      planAndExperience(value1, value2) {
        return {
          where: {
            [Op.and]: [
              {
                contractPlan: {
                  [Op.in]: value1,
                },
              },
              {
                experienceLevel: {
                  [Op.in]: value2,
                },
              },
            ],
          },
        };
      },

      titleAndPlanAndExperience(value1, value2, value3) {
        return {
          where: {
            [Op.and]: [
              {
                title: {
                  [Op.like]: value1,
                },
              },
              {
                contractPlan: {
                  [Op.in]: value2,
                },
              },
              {
                experienceLevel: {
                  [Op.in]: value3,
                },
              },
            ],
          },
        };
      },
      titleAndPlanAndLocation(value1, value2, value3) {
        return {
          where: {
            [Op.and]: [
              {
                title: {
                  [Op.like]: value1,
                },
              },
              {
                contractPlan: {
                  [Op.in]: value2,
                },
              },
              {
                location: {
                  [Op.like]: value3,
                },
              },
            ],
          },
        };
      },
      titleAndLocationAndExperience(value1, value2, value3) {
        return {
          where: {
            [Op.and]: [
              {
                title: {
                  [Op.like]: value1,
                },
              },
              {
                location: {
                  [Op.like]: value2,
                },
              },
              {
                experienceLevel: {
                  [Op.in]: value3,
                },
              },
            ],
          },
        };
      },
      locationAndPlanAndExperience(value1, value2, value3) {
        return {
          where: {
            [Op.and]: [
              {
                location: {
                  [Op.like]: value1,
                },
              },
              {
                contractPlan: {
                  [Op.in]: value2,
                },
              },
              {
                experienceLevel: {
                  [Op.in]: value3,
                },
              },
            ],
          },
        };
      },

      titleAndPlanAndExperienceAndLocation(value1, value2, value3, value4) {
        return {
          where: {
            [Op.and]: [
              {
                title: {
                  [Op.like]: value1,
                },
              },
              {
                contractPlan: {
                  [Op.in]: value2,
                },
              },
              {
                experienceLevel: {
                  [Op.in]: value3,
                },
              },
              {
                location: {
                  [Op.like]: value4,
                },
              },
            ],
          },
        };
      },
    },
  }
);

module.exports = Job;
