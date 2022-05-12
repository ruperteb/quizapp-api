const express = require("express");

const { jsonParser } = require("../middleware/bodyparser");
const { checkJwt } = require("../middleware/auth");
const router = express.Router();

var usersController = require("../controllers/users");

router.all("*", checkJwt, jsonParser);
router.get("/getUser", usersController.getUser);
router.get("/getUsers", usersController.getUsers);
router.post("/createUser", usersController.createUser);

module.exports = router;
