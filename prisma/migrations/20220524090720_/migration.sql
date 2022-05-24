/*
  Warnings:

  - The primary key for the `UserAnswer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - The primary key for the `UserQuiz` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- CreateTable
CREATE TABLE "Role" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "role" TEXT NOT NULL,
    "userId" TEXT,
    CONSTRAINT "Role_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserAnswer" (
    "userId" TEXT NOT NULL,
    "quizId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "userAnswer" TEXT NOT NULL,
    "answeredAt" DATETIME NOT NULL,

    PRIMARY KEY ("userId", "quizId", "questionId"),
    CONSTRAINT "UserAnswer_userId_quizId_fkey" FOREIGN KEY ("userId", "quizId") REFERENCES "UserQuiz" ("userId", "quizId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserAnswer_quizId_questionId_fkey" FOREIGN KEY ("quizId", "questionId") REFERENCES "QuizQuestion" ("quizId", "questionId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserAnswer" ("answeredAt", "questionId", "quizId", "userAnswer", "userId") SELECT "answeredAt", "questionId", "quizId", "userAnswer", "userId" FROM "UserAnswer";
DROP TABLE "UserAnswer";
ALTER TABLE "new_UserAnswer" RENAME TO "UserAnswer";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL
);
INSERT INTO "new_User" ("email", "id", "name") SELECT "email", "id", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new_UserQuiz" (
    "userId" TEXT NOT NULL,
    "quizId" INTEGER NOT NULL,
    "assignedAt" DATETIME NOT NULL,

    PRIMARY KEY ("userId", "quizId"),
    CONSTRAINT "UserQuiz_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserQuiz_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserQuiz" ("assignedAt", "quizId", "userId") SELECT "assignedAt", "quizId", "userId" FROM "UserQuiz";
DROP TABLE "UserQuiz";
ALTER TABLE "new_UserQuiz" RENAME TO "UserQuiz";
CREATE TABLE "new_Question" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "userId" TEXT,
    CONSTRAINT "Question_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Question" ("correctAnswer", "createdAt", "description", "id", "userId") SELECT "correctAnswer", "createdAt", "description", "id", "userId" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
CREATE TABLE "new_Quiz" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "userId" TEXT,
    CONSTRAINT "Quiz_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Quiz" ("createdAt", "id", "title", "userId") SELECT "createdAt", "id", "title", "userId" FROM "Quiz";
DROP TABLE "Quiz";
ALTER TABLE "new_Quiz" RENAME TO "Quiz";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
