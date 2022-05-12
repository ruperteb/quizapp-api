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
    res.json(user);
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
