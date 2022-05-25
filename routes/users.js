const express = require("express");
const cors = require("cors");

const { jsonParser } = require("../middleware/bodyparser");
const router = express.Router();

const keycloak = require("../config/keycloak-config.js").getKeycloak();

var usersController = require("../controllers/users");

const headers = (req, res, next) => {
  const origin =
    req.headers.origin == "http://localhost:3000"
      ? "http://localhost:3000"
      : "https://mywebsite.com";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
};

module.exports = headers;

router.all("*", keycloak.protect(["quizTaker", "quizMaker"]), jsonParser);
router.get("/getUser", usersController.getUser);
router.get("/getUserWithToken", cors(), headers, usersController.getUserWithToken);
router.get("/getUsers", usersController.getUsers);
router.post("/createUser", usersController.createUser);

module.exports = router;
