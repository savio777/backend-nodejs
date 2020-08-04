const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

const urlEncodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json;

app.get("/", urlEncodedParser, (req, res) => {
  console.log("method~> ", req.method);
  res.send("test");
});

app.listen(port, () => {
  console.log(`listen in localhost:${port}`);
});
