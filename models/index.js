const User = require("./users");
const Career = require("./careers");
const Job = require("./jobs");
const Applie = require("./applies");

User.hasMany(Career);
Career.belongsTo(User);

User.hasMany(Job);
Job.belongsTo(User);

User.belongsToMany(Job, { through: Applie, as: "applied" });
Job.belongsToMany(User, { through: Applie, as: "applier" });

module.exports = {
  User,
  Career,
  Job,
  Applie,
};
