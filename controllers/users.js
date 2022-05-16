const { Prisma, PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.getUser = async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        userQuizzes: {
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
        },
        quizzes: true,
        questions: true,
      },
    });
    const userQuizzesData = user.userQuizzes.map((userQuiz) => {
      const tempQuizQuestionsData = userQuiz.quiz.quizQuestions.map(
        (quizQuestion) => ({
          questionId: quizQuestion.questionId,
          userAnswer: quizQuestion.userAnswers[0]?.userAnswer,
          answeredAt: quizQuestion.userAnswers[0]?.answeredAt,
          description: quizQuestion.question.description,
          correctAnswer: quizQuestion.question.correctAnswer,
        })
      );

      const score = 0;
      const total = tempQuizQuestionsData.length;
      const attempted = [];

      for (question of tempQuizQuestionsData) {
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

      const tempUserQuizData = {
        userId: userQuiz.userId,
        quizId: userQuiz.quizId,
        status: getStatus(),
        progress: `${attempted.length}/${total}`,
        score: score,
        title: userQuiz.quiz.title,
        createdAt: userQuiz.quiz.createdAt,
        quizQuestions: tempQuizQuestionsData,
      };
      return tempUserQuizData;
    });

    const quizzesData = user.quizzes.map((quiz) => ({
      quizId: quiz.id,
      title: quiz.title,
      createdAt: quiz.createdAt,
      createdBy: quiz.userId,
    }));

    const questionsData = user.questions.map((question) => ({
      questionId: question.id,
      description: question.description,
      correctAnswer: question.correctAnswer,
      createdAt: question.createdAt,
      createdBy: question.userId,
    }));
    const data = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      userQuizzes: userQuizzesData,
      quizzes: quizzesData,
      questions: questionsData,
    };
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

exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
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

exports.createUser = async (req, res) => {
  const userData = req.body;

  try {
    await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        role: userData.role,
      },
    });
    res.json({
      message: "User Added",
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
