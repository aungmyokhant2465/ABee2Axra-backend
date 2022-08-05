const router = require("express").Router();
const { Applie } = require("../models");

router.post("/", async (req, res) => {
  try {
    const body = req.body;
    if (!body.userId || !body.jobId) {
      return res.status(400).json({ error: "Invalid input" });
    }
    const applie = await Applie.create(body);
    res.json(applie);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

module.exports = router;
