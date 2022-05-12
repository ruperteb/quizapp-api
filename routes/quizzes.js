const express = require("express");

const { jsonParser } = require("../middleware/bodyparser");
const { checkJwt } = require("../middleware/auth");
const router = express.Router();

var quizzesController = require("../controllers/quizzes");

router.all("*", checkJwt, jsonParser);
router.get("/getAllQuizzes", quizzesController.getAllQuizzes);
router.get("/getQuizzes", quizzesController.getQuizzes);
router.get("/getUserQuizzes", quizzesController.getUserQuizzes);
router.get("/getUserQuiz", quizzesController.getUserQuiz);
router.post("/createQuiz", quizzesController.createQuiz);
router.put("/assignQuiz", quizzesController.assignQuiz);

module.exports = router;
