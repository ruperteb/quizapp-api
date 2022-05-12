const { Prisma, PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await prisma.quiz.findMany();
    res.json(quizzes);
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

exports.getQuizzes = async (req, res) => {
  const userId = req.body.userId;
  try {
    const quizzes = await prisma.quiz.findMany({
      where: {
        user: {
          id: userId,
        },
      },
    });
    res.json(quizzes);
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

exports.getUserQuizzes = async (req, res) => {
  const userId = req.body.userId;
  try {
    const quizzes = await prisma.userQuiz.findMany({
      where: {
        user: {
          id: userId,
        },
      },
      include: {
        quiz: { include: { quizQuestions: { include: { question: true } } } },
      },
    });

    const data = quizzes.map((quiz) => {
      /* const questionsData = quiz.quiz.quizQuestions.map((item) => ({
        questionId: item.questionId,
        userAnswer: item.userAnswer,
        answered: item.answered,
        correct: item.correct,
        description: item.question.description,
        text: item.question.text,
        answer: item.question.answer,
        topic: item.question.topic,
        difficulty: item.question.difficulty,
      })); */

      const quizData = {
        userId: quiz.userId,
        quizId: quiz.quizId,
        status: quiz.status,
        progress: quiz.progress,
        score: quiz.score,
        title: quiz.quiz.title,
        topic: quiz.quiz.topic,
        difficulty: quiz.quiz.difficulty,
        createdAt: quiz.quiz.createdAt,
        /* questions: questionsData, */
      };
      return quizData;
    });

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

exports.getUserQuiz = async (req, res) => {
  const userId = req.body.userId;
  const quizId = req.body.quizId;
  try {
    const quizzes = await prisma.userQuiz.findUnique({
      where: {
        userId_quizId: {
          userId: userId,
          quizId: quizId,
        },
      },
      include: {
        quiz: { include: { quizQuestions: { include: { question: true } } } },
      },
    });

    if (quizzes === null) {
      throw "Invalid userId and quizId combination";
    }

    const questionsData = quizzes.quiz.quizQuestions.map((item) => ({
      questionId: item.questionId,
      userAnswer: item.userAnswer,
      answered: item.answered,
      correct: item.correct,
      description: item.question.description,
      text: item.question.text,
      answer: item.question.answer,
      topic: item.question.topic,
      difficulty: item.question.difficulty,
    }));

    const quizData = {
      userId: quizzes.userId,
      quizId: quizzes.quizId,
      status: quizzes.status,
      progress: quizzes.progress,
      score: quizzes.score,
      title: quizzes.quiz.title,
      topic: quizzes.quiz.topic,
      difficulty: quizzes.quiz.difficulty,
      createdAt: quizzes.quiz.createdAt,
      questions: questionsData,
    };

    res.status(200).json(quizData);
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

exports.createQuiz = async (req, res) => {
  const quizData = req.body;

  const date = new Date().toISOString();

  try {
    await prisma.quiz.create({
      data: {
        title: quizData.title,
        topic: quizData.topic,
        difficulty: quizData.difficulty,
        createdAt: date,
        createdBy: quizData.createdBy,
        user: {
          connect: { id: quizData.userId },
        },
      },
    });
    res.json({
      message: "Quiz created",
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

exports.assignQuiz = async (req, res) => {
  const quizId = req.body.quizId;
  const userIdArray = req.body.userIdArray;

  const userIDs = userIdArray.map((item) => ({
    create: {
      userId: item,
      status: "incomplete",
      progress: 0,
      score: 0,
    },
    where: {
      userId_quizId: {
        userId: item,
        quizId: quizId,
      },
    },
  }));

  try {
    await prisma.quiz.update({
      where: { id: quizId },

      data: {
        userQuizzes: { connectOrCreate: userIDs },
      },
    });
    res.json({
      message: "Quiz assigned",
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
