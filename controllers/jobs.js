/**
 * @description only authorizated user can perform these operations
 */
const router = require("express").Router();
const { Job, User } = require("../models");
const {
  jobExtractor,
  isOwnJob,
  tokenExtractor,
} = require("../util/middleware");

router.get("/", async (req, res) => {
  let jobs;
  if (
    req.query.search &&
    req.query.plan &&
    req.query.experience &&
    req.query.location
  ) {
    const plans = `${req.query.plan}`.split(",");
    const experiences = `${req.query.experience}`.split(",");
    jobs = await Job.scope("withApplier", {
      method: [
        "titleAndPlanAndExperienceAndLocation",
        `%${req.query.search}%`,
        plans,
        experiences,
        `%${req.query.location}%`,
      ],
    }).findAll({ order: [["createdAt", "DESC"]] });
  } else if (req.query.search && req.query.plan && req.query.experience) {
    const plans = `${req.query.plan}`.split(",");
    const experiences = `${req.query.experience}`.split(",");
    jobs = await Job.scope("withApplier", {
      method: [
        "titleAndPlanAndExperience",
        `%${req.query.search}%`,
        plans,
        experiences,
      ],
    }).findAll({ order: [["createdAt", "DESC"]] });
  } else if (req.query.experience && req.query.plan && req.query.location) {
    const plans = `${req.query.plan}`.split(",");
    const experiences = `${req.query.experience}`.split(",");
    jobs = await Job.scope("withApplier", {
      method: [
        "titleAndPlanAndLocation",
        plans,
        experiences,
        `%${req.query.location}%`,
      ],
    }).findAll({ order: [["createdAt", "DESC"]] });
  } else if (req.query.search && req.query.location && req.query.experience) {
    const experiences = `${req.query.experience}`.split(",");
    jobs = await Job.scope("withApplier", {
      method: [
        "titleAndLocationAndExperience",
        `%${req.query.search}%`,
        `%${req.query.location}%`,
        experiences,
      ],
    }).findAll({ order: [["createdAt", "DESC"]] });
  } else if (req.query.location && req.query.plan && req.query.experience) {
    const plans = `${req.query.plan}`.split(",");
    const experiences = `${req.query.experience}`.split(",");
    jobs = await Job.scope("withApplier", {
      method: [
        "LocationAndPlanAndExperience",
        `%${req.query.location}%`,
        plans,
        experiences,
      ],
    }).findAll({ order: [["createdAt", "DESC"]] });
  } else if (req.query.search && req.query.plan) {
    const plans = `${req.query.plan}`.split(",");
    jobs = await Job.scope("withApplier", {
      method: ["titleAndPlan", `%${req.query.search}%`, plans],
    }).findAll({ order: [["createdAt", "DESC"]] });
  } else if (req.query.search && req.query.location) {
    console.log("..................................");

    jobs = await Job.scope("withApplier", {
      method: [
        "titleAndLocation",
        `%${req.query.search}%`,
        `%${req.query.location}%`,
      ],
    }).findAll({ order: [["createdAt", "DESC"]] });
  } else if (req.query.search && req.query.experience) {
    const experiences = `${req.query.experience}`.split(",");
    jobs = await Job.scope("withApplier", {
      method: ["titleAndExperience", `%${req.query.search}%`, experiences],
    }).findAll({ order: [["createdAt", "DESC"]] });
  } else if (req.query.location && req.query.plan) {
    console.log("=========================================");
    const plans = `${req.query.plan}`.split(",");
    jobs = await Job.scope("withApplier", {
      method: ["locationAndPlan", `%${req.query.location}%`, plans],
    }).findAll({ order: [["createdAt", "DESC"]] });
  } else if (req.query.location && req.query.experience) {
    console.log("-------------------------------------------");
    const experiences = `${req.query.experience}`.split(",");
    jobs = await Job.scope("withApplier", {
      method: ["locationAndExperience", `%${req.query.location}%`, experiences],
    }).findAll({ order: [["createdAt", "DESC"]] });
  } else if (req.query.plan && req.query.experience) {
    const experiences = `${req.query.experience}`.split(",");
    const plans = `${req.query.plan}`.split(",");
    jobs = await Job.scope("withApplier", {
      method: ["planAndExperience", plans, experiences],
    }).findAll({ order: [["createdAt", "DESC"]] });
  } else if (req.query.search) {
    jobs = await Job.scope("withApplier", {
      method: ["title", `%${req.query.search}%`],
    }).findAll({ order: [["createdAt", "DESC"]] });
  } else if (req.query.plan) {
    const plans = `${req.query.plan}`.split(",");
    jobs = await Job.scope("withApplier", {
      method: ["plan", plans],
    }).findAll({ order: [["createdAt", "DESC"]] });
  } else if (req.query.experience) {
    const experiences = `${req.query.experience}`.split(",");
    jobs = await Job.scope("withApplier", {
      method: ["experience", experiences],
    }).findAll({ order: [["createdAt", "DESC"]] });
  } else if (req.query.location) {
    jobs = await Job.scope("withApplier", {
      method: ["location", `%${req.query.location}%`],
    }).findAll({ order: [["createdAt", "DESC"]] });
  } else {
    jobs = await Job.scope("withApplier").findAll({
      order: [["createdAt", "DESC"]],
    });
  }

  if (jobs) {
    res.json(jobs);
  } else {
    res.status(404).end();
  }
});

/**
 * @description description is nullable and userId will be auto filled
 * @params all fields must be provided.
 */
router.post("/", tokenExtractor, async (req, res) => {
  try {
    const body = req.body;
    if (
      !body.title ||
      !body.contractPlan ||
      !body.description ||
      !body.salary ||
      !body.location ||
      !body.experienceLevel ||
      !body.companyName
    ) {
      return res.status(400).json({ error: "Invalid input" });
    }
    const job = await Job.create({
      ...req.body,
      userId: req.decodedToken.id,
    });
    res.json(job);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.get("/:id", jobExtractor, async (req, res) => {
  // const job = await Job.findByPk(req.params.id);
  // if (job) {
  //   res.json(job);
  // } else {
  //   res.status(404).end();
  // }
  res.json(req.job);
});

router.delete(
  "/:id",
  tokenExtractor,
  jobExtractor,
  isOwnJob,
  async (req, res) => {
    // const job = await Job.findByPk(req.params.id);
    // if (job) {
    //   await job.destroy();
    // }
    await req.job.destroy();
    res.status(204).end();
  }
);

router.put("/:id", tokenExtractor, jobExtractor, isOwnJob, async (req, res) => {
  // const job = await Job.findByPk(req.params.id);
  const job = req.job;
  if (job) {
    job.title = req.body.title ?? job.title;
    job.contractPlan = req.body.contractPlan ?? job.contractPlan;
    job.salary = req.body.salary ?? job.salary;
    job.experienceLevel = req.body.experienceLevel ?? job.experienceLevel;
    job.description = req.body.description ?? job.description;
    job.location = req.body.location ?? job.location;
    job.companyName = req.body.companyName ?? job.companyName;
    job.photo = req.body.photo ?? job.photo;
    await job.save();
    res.json(job);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
