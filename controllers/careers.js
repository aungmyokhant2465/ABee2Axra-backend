/**
 * @description only authorizated user can perform these operations
 */
const router = require("express").Router();
const { Career } = require("../models");
const { careerExtractor, isOwnCareer } = require("../util/middleware");

// router.get("/", async (req, res) => {
//   const careers = await Career.findAll();
//   res.json(careers);
// });

router.get("/", async (req, res) => {
  const careers = await Career.findAll({
    where: {
      user_id: req.decodedToken.id,
    },
  });
  if (careers) {
    res.json(careers);
  } else {
    res.status(404).end();
  }
});

/**
 * @description description is nullable and user_id will be auto filled
 * @params title must be provided.
 */
router.post("/", async (req, res) => {
  try {
    const body = req.body;
    if (!body.title) {
      return res.status(401).json({ error: "Invalid input" });
    }
    const career = await Career.create({
      ...req.body,
      userId: req.decodedToken.id,
    });
    res.json(career);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.get("/:id", careerExtractor, async (req, res) => {
  // const career = await Career.findByPk(req.params.id);
  // if (career) {
  //   res.json(career);
  // } else {
  //   res.status(404).end();
  // }
  res.json(req.career);
});

router.delete("/:id", careerExtractor, isOwnCareer, async (req, res) => {
  // const career = await Career.findByPk(req.params.id);
  // if (career) {
  //   await career.destroy();
  // }
  await req.career.destroy();
  res.status(204).end();
});

/**
 * @params title and description
 */
router.put("/:id", careerExtractor, isOwnCareer, async (req, res) => {
  // const career = await Career.findByPk(req.params.id);
  const career = req.career;
  // if (career) {
  career.title = req.body.title ?? career.title;
  career.description = req.body.description ?? career.description;
  await career.save();
  res.json(career);
  // } else {
  //   res.status(404).end();
  // }
});

module.exports = router;
