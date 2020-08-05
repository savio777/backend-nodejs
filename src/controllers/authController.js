const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authJson = require("../config/auth.json");

const User = require("../models/user");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email } = req.body;

  try {
    if (await User.findOne({ email })) {
      return res.status(400).send({ error: "User already exists" });
    }

    const user = await User.create(req.body);

    if (!user) {
      return res.status(400).send({ error: "Error in signup" });
    }

    const token = jwt.sign({ id: user.id }, authJson.secret, {
      expiresIn: 86400,
    });

    // esconder a senha do usuario que está no banco de dados
    user.password = undefined;

    return res.send({ user, token });
  } catch (error) {
    console.log("err ", error);

    return res.status(400).send({ error: "Registration failed" });
  }
});

router.post("/authenticate", async (req, res) => {
  const { email, password } = req.body;

  try {
    // select na senha pq está configurado para não mostrar por padrão nas buscas no banco
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }

    //const hash = await bcrypt.hashSync(password, 10);
    //const hash = await bcrypt.compare(password, user.password);

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).send({ error: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id }, authJson.secret, {
      expiresIn: 86400,
    });

    user.password = undefined;

    res.send({ user, token });
  } catch (error) {
    console.log("err ", error);

    return res.status(400).send({ error: "Auth failed" });
  }
});

module.exports = (app) => app.use("/auth", router);
