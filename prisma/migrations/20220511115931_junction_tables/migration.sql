/*
  Warnings:

  - You are about to drop the `_QuestionToQuiz` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_QuizToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_QuestionToQuiz";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_QuizToUser";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "UserQuiz" (
    "userId" INTEGER NOT NULL,
    "quizId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "progress" BIGINT NOT NULL,
    "score" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "quizId"),
    CONSTRAINT "UserQuiz_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserQuiz_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QuizQuestion" (
    "quizId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "answered" BOOLEAN NOT NULL,
    "correct" BOOLEAN NOT NULL,

    PRIMARY KEY ("quizId", "questionId"),
    CONSTRAINT "QuizQuestion_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "QuizQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
