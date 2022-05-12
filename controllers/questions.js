const { Prisma, PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await prisma.question.findMany();
    res.json(questions);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log("code", e.code);
      res.status(500).send(`${e.code}`);
    } else {
      console.log("error", e);
      res.status(500).send(`${e}`);
    }
  }
};

exports.createQuestion = async (req, res) => {
  const questionData = req.body;

  const date = new Date().toISOString();

  try {
    await prisma.question.create({
      data: {
        description: questionData.description,
        text: questionData.text,
        answer: questionData.answer,
        topic: questionData.topic,
        difficulty: questionData.difficulty,
        createdAt: date,
        createdBy: questionData.createdBy,
        user: {
          connect: { id: questionData.userId },
        },
      },
    });
    res.json({
      message: "Question Created",
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log("code", e.code);
      res.status(500).send(`${e.code}`);
    } else {
      console.log("error", e);
      res.status(500).send(`${e}`);
    }
  }
};

exports.assignQuestion = async (req, res) => {
  const questionId = req.body.questionId;
  const quizIdArray = req.body.quizIdArray;

  const quizIDs = quizIdArray.map((item) => ({
    create: {
      quizId: item,
      userAnswer: "",
      answered: false,
      correct: false,
    },
    where: {
      quizId_questionId: {
        quizId: item,
        questionId: questionId,
      },
    },
  }));

  try {
    await prisma.question.update({
      where: { id: questionId },
      /* data: {
                  title: quizData.title,
                  topic: quizData.topic,
                  difficulty: quizData.difficulty,
                  createdAt: date,
                  createdBy: quizData.createdBy
              }, */
      data: {
        quizQuestions: { connectOrCreate: quizIDs },
      },
    });
    res.json({
      message: "Question assigned",
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log("code", e.code);
      res.status(500).send(`${e.code}`);
    } else {
      console.log("error", e);
      res.status(500).send(`${e}`);
    }
  }
};
