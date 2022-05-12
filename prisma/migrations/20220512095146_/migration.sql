-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_QuizQuestion" (
    "quizId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "userAnswer" TEXT NOT NULL DEFAULT '',
    "answered" BOOLEAN NOT NULL,
    "correct" BOOLEAN NOT NULL,

    PRIMARY KEY ("quizId", "questionId"),
    CONSTRAINT "QuizQuestion_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "QuizQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_QuizQuestion" ("answered", "correct", "questionId", "quizId") SELECT "answered", "correct", "questionId", "quizId" FROM "QuizQuestion";
DROP TABLE "QuizQuestion";
ALTER TABLE "new_QuizQuestion" RENAME TO "QuizQuestion";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
