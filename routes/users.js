const express = require("express");

const { jsonParser } = require("../middleware/bodyparser");
const router = express.Router();

var cors = require("cors");

const keycloak = require("../config/keycloak-config.js").getKeycloak();

var usersController = require("../controllers/users");

router.all("*", keycloak.protect(["quizTaker", "quizMaker"]), jsonParser);
router.options("/getUserWithToken", cors());
router.get("/getUser", usersController.getUser);
router.get("/getUserWithToken", usersController.getUserWithToken);
router.get("/getUsers", usersController.getUsers);
router.post("/createUser", usersController.createUser);

module.exports = router;
