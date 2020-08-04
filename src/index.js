const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

//app.use(bodyParser.json);
//app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  console.log("method~> ", req.method);
  res.send("test");
});

app.listen(port, () => {
  console.log(`listen in localhost:${port}`);
});
