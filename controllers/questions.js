const { Prisma, PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await prisma.question.findMany();
    const data = questions.map((question) => ({
      questionId: question.id,
      description: question.description,
      correctAnswer: question.correctAnswer,
      createdAt: question.createdAt,
      createdBy: question.userId,
    }));
    res.json(data);
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
    const question = await prisma.question.create({
      data: {
        description: questionData.description,
        correctAnswer: questionData.correctAnswer,
        createdAt: date,
        createdBy: {
          connect: { id: questionData.userId },
        },
      },
    });
    res.json({
      questionId: question.id,
      description: question.description,
      correctAnswer: question.correctAnswer,
      createdAt: question.createdAt,
      createdBy: question.userId,
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
  const date = new Date().toISOString();

  const quizIDs = quizIdArray.map((item) => ({
    create: {
      quizId: item,
      assignedAt: date,
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

exports.updateUserAnswer = async (req, res) => {
  const questionId = req.body.questionId;
  const quizId = req.body.quizId;
  const userId = req.body.userId;
  const userAnswer = req.body.userAnswer;
  const date = new Date().toISOString();

  try {
    await prisma.userAnswer.upsert({
      where: {
        userId_quizId_questionId: {
          questionId: questionId,
          quizId: quizId,
          userId: userId,
        },
      },
      update: {
        userAnswer: userAnswer,
        answeredAt: date,
      },
      create: {
        userAnswer: userAnswer,
        answeredAt: date,
        userQuiz: {
          connect: { userId_quizId: { userId: userId, quizId: quizId } },
        },
        quizQuestion: {
          connect: {
            quizId_questionId: { questionId: questionId, quizId: quizId },
          },
        },
      },
    });
    res.json({
      message: "Answer updated",
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
