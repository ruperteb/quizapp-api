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
  const userId = Number(req.query.userId);
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
  const userId = Number(req.query.userId);
  try {
    const quizzes = await prisma.userQuiz.findMany({
      where: {
        user: {
          id: userId,
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

    const quizzesData = quizzes.map((quiz) => {
      const questionsData = quiz.quiz.quizQuestions.map((question) => ({
        questionId: question.questionId,
        userAnswer: question.userAnswers[0]?.userAnswer,
        answeredAt: question.userAnswers[0]?.answeredAt,
        description: question.question.description,
        correctAnswer: question.question.correctAnswer,
      }));

      let score = 0;
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
        userId: quiz.userId,
        quizId: quiz.quizId,
        status: getStatus(),
        progress: `${attempted.length}/${total}`,
        score: score,
        title: quiz.quiz.title,
        createdAt: quiz.quiz.createdAt,
        /* questions: questionsData, */
      };
      return quizData;
    });

    res.json(quizzesData);
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
  const userId = Number(req.query.userId);
  const quizId = Number(req.query.quizId);
  try {
    const quiz = await prisma.userQuiz.findUnique({
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

    if (quiz === null) {
      throw "Invalid userId and quizId combination";
    }

    const questionsData = quiz.quiz.quizQuestions.map((question) => ({
      questionId: question.questionId,
      userAnswer: question.userAnswers[0]?.userAnswer,
      answeredAt: question.userAnswers[0]?.answeredAt,
      description: question.question.description,
      correctAnswer: question.question.correctAnswer,
    }));

    let score = 0;
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
      userId: quiz.userId,
      quizId: quiz.quizId,
      status: getStatus(),
      progress: `${attempted.length}/${total}`,
      score: score,
      title: quiz.quiz.title,
      createdAt: quiz.quiz.createdAt,
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
    const quiz = await prisma.quiz.create({
      data: {
        title: quizData.title,
        createdAt: date,
        createdBy: {
          connect: { id: quizData.userId },
        },
      },
    });
    res.json({
      quizId: quiz.id,
      title: quiz.title,
      createdAt: quiz.createdAt,
      createdBy: quiz.userId,
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
