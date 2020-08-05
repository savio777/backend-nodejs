const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email } = req.body;

  try {
    if (await User.findOne({ email })) {
      return res.status(400).send({ error: "User already exists" });
    }

    const user = await User.create(req.body);
    user.password = undefined;

    return res.send({ user });
  } catch (error) {
    console.log("err ", error);

    return res.status(400).send({ error: "Registration failed" });
  }
});

router.post("/authenticate", async (req, res) => {
  const { email, password } = req.body;

  // select na senha pq está configurado para não mostrar por padrão nas buscas no banco
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(400).send({ error: "User not found" });
  }

  //const hash = await bcrypt.hashSync(password, 10);

  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(400).send({ error: "Invalid password" });
  }

  user.password = undefined;

  res.send({ user });
});

module.exports = (app) => app.use("/auth", router);
