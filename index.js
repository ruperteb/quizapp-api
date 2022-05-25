require("dotenv").config();
const express = require("express");
/* var cors = require("cors"); */
const app = express();
const keycloak = require("./config/keycloak-config.js").initKeycloak();

app.use(keycloak.middleware());

const users = require("./routes/users");
const quizzes = require("./routes/quizzes");
const questions = require("./routes/questions");

/* var allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
};

app.use(allowCrossDomain); */

app.use("/users/", users);
app.use("/quizzes/", quizzes);
app.use("/questions/", questions);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
