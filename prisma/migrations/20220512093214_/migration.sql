/*
  Warnings:

  - You are about to alter the column `progress` on the `UserQuiz` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Float`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserQuiz" (
    "userId" INTEGER NOT NULL,
    "quizId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "progress" REAL NOT NULL,
    "score" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "quizId"),
    CONSTRAINT "UserQuiz_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserQuiz_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserQuiz" ("progress", "quizId", "score", "status", "userId") SELECT "progress", "quizId", "score", "status", "userId" FROM "UserQuiz";
DROP TABLE "UserQuiz";
ALTER TABLE "new_UserQuiz" RENAME TO "UserQuiz";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
