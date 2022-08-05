const jwt = require("jsonwebtoken");
const { SECRET } = require("./config.js");
const User = require("../models/users");
const Career = require("../models/careers");
const Job = require("../models/jobs");

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

const userExtractor = async (req, res, next) => {
  const decodedToken = req.decodedToken;
  if (!decodedToken) {
    return res.status(401).json({ error: "token missing" });
  }
  const { id } = decodedToken;
  const user = await User.findByPk(id);
  if (!user) {
    return res.status(404).end();
  }
  req.user = user;
  next();
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "JsonWebTokenError") {
    return response.status(401).json({
      error: "invalid token",
    });
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({ error: "token expired" });
  }
  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const isOwn = (req, res, next) => {
  if (req.params.id !== req.user.id + "") {
    res.status(401).json({ error: "operation not allowed" });
  } else {
    next();
  }
};

const careerExtractor = async (req, res, next) => {
  const career = await Career.findByPk(req.params.id);
  if (!career) {
    return res.status(404).end();
  }
  req.career = career;
  next();
};

const isOwnCareer = (req, res, next) => {
  if (req.career.userId !== req.decodedToken.id) {
    res.status(401).json({ error: "operation not allowed" });
  } else {
    next();
  }
};

const jobExtractor = async (req, res, next) => {
  const job = await Job.scope("withApplier").findByPk(req.params.id);
  if (!job) {
    return res.status(404).end();
  }
  req.job = job;
  next();
};

const isOwnJob = (req, res, next) => {
  if (req.job.userId !== req.decodedToken.id) {
    res.status(401).json({ error: "operation not allowed" });
  } else {
    next();
  }
};

const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id);
  if (!user.admin) {
    return res.status(401).json({ error: "operation not allowed" });
  }
  next();
};

module.exports = {
  tokenExtractor,
  isAdmin,
  errorHandler,
  unknownEndpoint,
  userExtractor,
  isOwn,
  careerExtractor,
  isOwnCareer,
  jobExtractor,
  isOwnJob,
};
