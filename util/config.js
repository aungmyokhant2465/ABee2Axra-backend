require("dotenv").config();

module.exports = {
  DATABASE_URL: process.env.host,
  USERNAME: process.env.user,
  PASSWORD: process.env.password,
  DATABASE_NAME: process.env.database,
  DIALECT: process.env.dialect,
  PORT: process.env.PORT || 3001,
  SECRET: process.env.SECRET || "",
  DIGITAL_OCEAN_ACCESS_KEYID: process.env.DIGITAL_OCEAN_ACCESS_KEYID,
  DIGITAL_OCEAN_SECRET_ACCESS_KEY: process.env.DIGITAL_OCEAN_SECRET_ACCESS_KEY,
};
