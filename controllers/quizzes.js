const { Prisma, PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await prisma.quiz.findMany();
    const data = quizzes.map((quiz) => ({
      quizId: quiz.id,
      title: quiz.title,
      createdAt: quiz.createdAt,
      createdBy: quiz.userId,
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

exports.getQuizzes = async (req, res) => {
  const userId = req.body.userId;
  try {
    const quizzes = await prisma.quiz.findMany({
      where: {
        createdBy: {
          id: userId,
        },
      },
    });

    const data = quizzes.map((quiz) => ({
      quizId: quiz.id,
      title: quiz.title,
      createdAt: quiz.createdAt,
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
        /* status: quiz.status,
        progress: quiz.progress,
        score: quiz.score, */
        title: quiz.quiz.title,
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
        quiz: {
          include: {
            quizQuestions: {
              include: {
                question: true,
                userAnswers: { where: { userId: userId } },
              },
            },
          },
        },
      },
    });

    if (quizzes === null) {
      throw "Invalid userId and quizId combination";
    }

    const questionsData = quizzes.quiz.quizQuestions.map((item) => ({
      questionId: item.questionId,
      userAnswer: item.userAnswers[0]?.userAnswer,
      answeredAt: item.userAnswers[0]?.answeredAt,
      description: item.question.description,
      correctAnswer: item.question.correctAnswer,
    }));

    const score = 0;
    const total = questionsData.length;
    const attempted = [];

    for (question of questionsData) {
      if (question.userAnswer) {
        attempted.push(question.questionId);
        if (question.userAnswer === question.correctAnswer) {
          score += 1;
        }
      }
    }

    const getStatus = () => {
      if (attempted.length < total) {
        return "incomplete";
      }
      return "complete";
    };

    const quizData = {
      userId: quizzes.userId,
      quizId: quizzes.quizId,
      status: getStatus(),
      progress: `${attempted.length}/${total}`,
      score: score,
      title: quizzes.quiz.title,
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
        createdAt: date,
        createdBy: {
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
  const date = new Date().toISOString();

  const userIDs = userIdArray.map((item) => ({
    create: {
      userId: item,
      assignedAt: date,
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
