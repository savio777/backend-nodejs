const express = require("express");

const User = require("../models/user");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const user = await User.create(req.body);
    console.log("req ", req.body);
    console.log("res ", user);
    return res.send({ user });
  } catch (error) {
    console.log("err ", error);
    return res.status(400).send({ error: "Registration failed" });
  }
});

module.exports = (app) => app.use("/auth", router);
