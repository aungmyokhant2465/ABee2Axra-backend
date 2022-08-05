const router = require("express").Router();
const { User } = require("../models");
const { tokenExtractor, userExtractor, isOwn } = require("../util/middleware");
const bcrypt = require("bcrypt");

// /**
//  * @description any user who have valid token will get all users information, need to upgrate
//  */
// router.get("/", tokenExtractor, async (req, res) => {
//   const users = await User.findAll();
//   res.json(users);
// });

/**
 * @description anyone can create user account and disabled field will be auto filled
 * @params name, password, and email must be included
 */
router.post("/", async (req, res) => {
  try {
    const body = req.body;
    if (!body.name || !body.password || !body.email) {
      return res.status(400).json({ error: "Invalid inputs" });
    }
    const existingUser = await User.findOne({
      where: {
        email: body.email,
      },
    });
    if (existingUser) {
      return res.status(400).json({ error: "Email is alredy existed." });
    }
    const passwordHash = req.body.password
      ? await bcrypt.hash(req.body.password, 10)
      : null;
    const user = await User.create({ ...req.body, password: passwordHash });
    let jsonUser = user.toJSON();
    delete jsonUser["password"];
    res.status(201).json(jsonUser);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

/**
 * @description users who have valid token can fetch their own user information
 */
router.get("/:id", tokenExtractor, userExtractor, isOwn, async (req, res) => {
  const user = await User.scope("withoutPassword").findByPk(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

/**
 * @description users who have valid token can only delete their own account
 */
router.delete(
  "/:id",
  tokenExtractor,
  userExtractor,
  isOwn,
  async (req, res) => {
    if (req.params.id !== req.user.id + "") {
      res.status(401).json({ error: "operation not allowed" });
    }
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
    }
    res.status(204).end();
  }
);

/**
 * @description users who have valid token can only update their own user information
 * @params none or many of name, phone and disabled
 */
router.put("/:id", tokenExtractor, userExtractor, isOwn, async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    user.name = req.body.name ?? user.name;
    user.phone = req.body.phone ?? user.phone;
    user.disabled =
      req.body.disabled === undefined ? user.disabled : req.body.disabled;
    user.dateOfBirth = req.body.dateOfBirth ?? user.dateOfBirth;
    user.nrc = req.body.nrc ?? user.nrc;
    user.education = req.body.education ?? user.education;
    user.preferContractPlan =
      req.body.preferContractPlan ?? user.preferContractPlan;
    user.exprienceLevel = req.body.exprienceLevel ?? user.exprienceLevel;
    user.skill = req.body.skill ?? user.skill;
    user.cv = req.body.cv ?? user.cv;
    user.address = req.body.address ?? user.address;
    user.about = req.body.about ?? user.about;
    user.profile = req.body.profile ?? user.profile;
    await user.save();
    res.json(user);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
