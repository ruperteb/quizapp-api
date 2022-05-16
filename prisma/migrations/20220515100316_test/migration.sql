/*
  Warnings:

  - You are about to drop the column `answer` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `difficulty` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `topic` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `answered` on the `QuizQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `correct` on the `QuizQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `progress` on the `UserQuiz` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `UserQuiz` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `UserQuiz` table. All the data in the column will be lost.
  - Added the required column `correctAnswer` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assignedAt` to the `QuizQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assignedAt` to the `UserQuiz` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Question" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "userId" INTEGER,
    CONSTRAINT "Question_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Question" ("createdAt", "description", "id", "userId") SELECT "createdAt", "description", "id", "userId" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
CREATE TABLE "new_QuizQuestion" (
    "quizId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "userAnswer" TEXT NOT NULL DEFAULT '',
    "assignedAt" DATETIME NOT NULL,

    PRIMARY KEY ("quizId", "questionId"),
    CONSTRAINT "QuizQuestion_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "QuizQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_QuizQuestion" ("questionId", "quizId", "userAnswer") SELECT "questionId", "quizId", "userAnswer" FROM "QuizQuestion";
DROP TABLE "QuizQuestion";
ALTER TABLE "new_QuizQuestion" RENAME TO "QuizQuestion";
CREATE TABLE "new_UserQuiz" (
    "userId" INTEGER NOT NULL,
    "quizId" INTEGER NOT NULL,
    "assignedAt" DATETIME NOT NULL,

    PRIMARY KEY ("userId", "quizId"),
    CONSTRAINT "UserQuiz_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserQuiz_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserQuiz" ("quizId", "userId") SELECT "quizId", "userId" FROM "UserQuiz";
DROP TABLE "UserQuiz";
ALTER TABLE "new_UserQuiz" RENAME TO "UserQuiz";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
