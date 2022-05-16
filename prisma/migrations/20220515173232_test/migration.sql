-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserAnswer" (
    "userId" INTEGER NOT NULL,
    "quizId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "userAnswer" TEXT NOT NULL,
    "answeredAt" DATETIME NOT NULL DEFAULT '2022-05-15 15:10:01.973 +00:00',

    PRIMARY KEY ("userId", "quizId", "questionId"),
    CONSTRAINT "UserAnswer_userId_quizId_fkey" FOREIGN KEY ("userId", "quizId") REFERENCES "UserQuiz" ("userId", "quizId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserAnswer_quizId_questionId_fkey" FOREIGN KEY ("quizId", "questionId") REFERENCES "QuizQuestion" ("quizId", "questionId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserAnswer" ("questionId", "quizId", "userAnswer", "userId") SELECT "questionId", "quizId", "userAnswer", "userId" FROM "UserAnswer";
DROP TABLE "UserAnswer";
ALTER TABLE "new_UserAnswer" RENAME TO "UserAnswer";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
