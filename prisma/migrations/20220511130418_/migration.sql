/*
  Warnings:

  - Added the required column `createdBy` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Question" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "createdBy" INTEGER NOT NULL
);
INSERT INTO "new_Question" ("answer", "createdAt", "description", "difficulty", "id", "text", "topic") SELECT "answer", "createdAt", "description", "difficulty", "id", "text", "topic" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
