const express = require("express");
const app = express();
const cors = require("cors");

const { PORT } = require("./util/config");
// const { OAuth2Client } = require("google-auth-library");
const session = require("express-session");

const { connectToDatabase } = require("./util/db");
const {
  errorHandler,
  unknownEndpoint,
  tokenExtractor,
  userExtractor,
} = require("./util/middleware");

require("./controllers/auth");

const usersRouter = require("./controllers/users");
const careerRouter = require("./controllers/careers");
const loginRouter = require("./controllers/login");
const jobRouter = require("./controllers/jobs");
const uploadRouter = require("./controllers/upload");
const applieRouter = require("./controllers/applie");

// app.use(express.static("build"));

app.use(cors());
app.use(express.json());

// app.use(session({ secret: "cats" }));
// app.use(passport.initialize());
// app.use(passport.session());

// function isLoggedIn(req, res, next) {
//   req.user ? next() : res.sendStatus(401);
// }

// app.get(
//   "/google",
//   passport.authenticate("google", { scope: ["email", "profile"] })
// );

// app.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     successRedirect: "/google/protected",
//     failureRedirect: "/google/failure",
//   })
// );

// app.get("/google/failure", (req, res) => {
//   res.send("something went wrong...");
// });

// app.get("/google/protected", isLoggedIn, (req, res) => {
//   res.send(`Hello : ${req.user.displayName}`);
// });

// app.get("/google/logout", (req, res) => {
//   // req.logout();
//   req.session.destroy();
//   res.send("Goodbye");
// });

app.use("/api/login", loginRouter);

/**
 * @description user can only fetch their own info
 * @params valid own token
 */
app.get("/api/profile", tokenExtractor, userExtractor, async (req, res) => {
  res.json(req.user);
});
app.use("/api/users", usersRouter);
app.use("/api/jobs", jobRouter);
app.use(tokenExtractor);
app.use("/api/careers", careerRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/applies", applieRouter);

// handler of requests with unknown endpoint
app.use(unknownEndpoint);
app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
