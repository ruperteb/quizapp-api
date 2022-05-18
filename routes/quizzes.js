const express = require("express");

const { jsonParser } = require("../middleware/bodyparser");
const router = express.Router();

const keycloak = require('../config/keycloak-config.js').getKeycloak();

var quizzesController = require("../controllers/quizzes");

router.all("*", keycloak.protect(['quizTaker', 'quizMaker']), jsonParser);
router.get("/getAllQuizzes", quizzesController.getAllQuizzes);
router.get("/getQuizzes", quizzesController.getQuizzes);
router.get("/getUserQuizzes", quizzesController.getUserQuizzes);
router.get("/getUserQuiz", quizzesController.getUserQuiz);
router.post("/createQuiz", quizzesController.createQuiz);
router.put("/assignQuiz", quizzesController.assignQuiz);

module.exports = router;
