const express = require("express");

const { jsonParser } = require("../middleware/bodyparser");
const router = express.Router();

const keycloak = require('../config/keycloak-config.js').getKeycloak();

var questionsController = require("../controllers/questions");

/* router.all("*", checkJwt, jsonParser); */
router.all("*", keycloak.protect(['quizTaker', 'quizMaker']), jsonParser);
router.get("/getAllQuestions", questionsController.getAllQuestions);
router.post("/createQuestion", questionsController.createQuestion);
router.put("/assignQuestion", questionsController.assignQuestion);
router.post("/updateUserAnswer", questionsController.updateUserAnswer);

module.exports = router;
