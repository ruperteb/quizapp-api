/*
  Warnings:

  - You are about to drop the column `quizAnswer` on the `QuizQuestion` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "UserAnswer" (
    "userId" INTEGER NOT NULL,
    "quizId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "userAnswer" TEXT NOT NULL,

    PRIMARY KEY ("userId", "quizId", "questionId"),
    CONSTRAINT "UserAnswer_userId_quizId_fkey" FOREIGN KEY ("userId", "quizId") REFERENCES "UserQuiz" ("userId", "quizId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserAnswer_quizId_questionId_fkey" FOREIGN KEY ("quizId", "questionId") REFERENCES "QuizQuestion" ("quizId", "questionId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_QuizQuestion" (
    "quizId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "assignedAt" DATETIME NOT NULL,

    PRIMARY KEY ("quizId", "questionId"),
    CONSTRAINT "QuizQuestion_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "QuizQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_QuizQuestion" ("assignedAt", "questionId", "quizId") SELECT "assignedAt", "questionId", "quizId" FROM "QuizQuestion";
DROP TABLE "QuizQuestion";
ALTER TABLE "new_QuizQuestion" RENAME TO "QuizQuestion";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
