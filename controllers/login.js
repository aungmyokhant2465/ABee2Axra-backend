const jwt = require("jsonwebtoken");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt_decode = require("jwt-decode");

const { SECRET } = require("../util/config");
const { User } = require("../models");

router.post("/", async (request, response) => {
  const body = request.body;

  if (!body.email || !body.password) {
    return response.status(401).json({ error: "invalid input" });
  }

  const user = await User.findOne({
    where: {
      email: body.email,
    },
  });

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(body.password, user.password);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "Invalid email or password",
    });
  }

  const userForToken = {
    email: user.email,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET, { expiresIn: 12 * 60 * 60 });

  response.status(200).send({ token });
});

router.post("/google", async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return response.status(401).json({ error: "invalid input" });
  }
  const userObject = jwt_decode(token);
  const existingUser = await User.findOne({
    where: {
      email: userObject.email,
    },
  });
  let userForToken;
  if (!existingUser) {
    try {
      const user = await User.create({
        email: userObject.email,
        name: `${userObject.given_name} ${userObject.family_name}`,
        profile: userObject.picture ?? null,
      });
      userForToken = {
        email: user.email,
        id: user.id,
      };
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error });
    }
    // console.log("user object : ", userObject);
  } else {
    userForToken = {
      email: existingUser.email,
      id: existingUser.id,
    };
  }

  const createdToken = jwt.sign(userForToken, SECRET, {
    expiresIn: 12 * 60 * 60,
  });
  res.status(200).send(createdToken);
});

module.exports = router;
