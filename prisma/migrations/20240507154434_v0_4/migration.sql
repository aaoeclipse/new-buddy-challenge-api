-- CreateTable
CREATE TABLE "MeasurementOnChallenge" (
    "challengeId" INTEGER NOT NULL,
    "measurementId" INTEGER NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("challengeId", "measurementId"),
    CONSTRAINT "MeasurementOnChallenge_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MeasurementOnChallenge_measurementId_fkey" FOREIGN KEY ("measurementId") REFERENCES "Measurement" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Challenge" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "goal" TEXT,
    "ownerId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deadLine" DATETIME,
    CONSTRAINT "Challenge_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Challenge" ("goal", "id", "name", "ownerId") SELECT "goal", "id", "name", "ownerId" FROM "Challenge";
DROP TABLE "Challenge";
ALTER TABLE "new_Challenge" RENAME TO "Challenge";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
