const express = require("express");

const { jsonParser } = require("../middleware/bodyparser");
const { checkJwt } = require("../middleware/auth");
const router = express.Router();

var questionsController = require("../controllers/questions");

router.all("*", checkJwt, jsonParser);
router.get("/getAllQuestions", questionsController.getAllQuestions);
router.post("/createQuestion", questionsController.createQuestion);
router.put("/assignQuestion", questionsController.assignQuestion);

module.exports = router;
