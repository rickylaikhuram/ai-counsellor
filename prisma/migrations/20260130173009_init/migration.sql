-- CreateEnum
CREATE TYPE "FundingPlan" AS ENUM ('SELF_FUNDED', 'SCHOLARSHIP', 'LOAN');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "Stage" AS ENUM ('BUILDING_PROFILE', 'DISCOVERING', 'FINALIZING', 'PREPARING');

-- CreateEnum
CREATE TYPE "UniversityCategory" AS ENUM ('DREAM', 'TARGET', 'SAFE');

-- CreateEnum
CREATE TYPE "Level" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ASSISTANT');

-- CreateEnum
CREATE TYPE "Intent" AS ENUM ('EXPLORING', 'SHORTLISTING', 'READY');

-- CreateEnum
CREATE TYPE "DecisionPath" AS ENUM ('LOW_COST', 'BALANCED', 'HIGH_RISK');

-- CreateEnum
CREATE TYPE "SessionStage" AS ENUM ('INTENT_CONFIRMED', 'PROFILE_ANALYZED', 'DECISION_FRAMED', 'SHORTLISTED', 'LOCKED', 'ACTION_PLAN_CREATED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "educationLevel" TEXT NOT NULL,
    "degree" TEXT,
    "major" TEXT,
    "graduationYear" INTEGER,
    "gpa" DOUBLE PRECISION,
    "gpaScale" TEXT,
    "normalizedGpa" DOUBLE PRECISION,
    "targetDegree" TEXT,
    "fieldOfStudy" TEXT,
    "targetIntake" TEXT,
    "preferredCountries" TEXT[],
    "budgetMin" INTEGER,
    "budgetMax" INTEGER,
    "fundingPlan" "FundingPlan",
    "ieltsStatus" "Status",
    "greStatus" "Status",
    "sopStatus" "Status",
    "isComplete" BOOLEAN NOT NULL DEFAULT false,
    "currentStage" "Stage" NOT NULL DEFAULT 'BUILDING_PROFILE',

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "University" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT,
    "ranking" INTEGER,
    "tuition" INTEGER NOT NULL,
    "acceptanceRate" DOUBLE PRECISION,
    "programs" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "University_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShortlistedUniversity" (
    "id" TEXT NOT NULL,
    "counsellingSessionId" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "category" "UniversityCategory" NOT NULL,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "reasoning" TEXT NOT NULL,
    "risks" TEXT NOT NULL,
    "costLevel" "Level" NOT NULL,
    "acceptanceChance" "Level" NOT NULL,
    "lockedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShortlistedUniversity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "counsellingSessionId" TEXT NOT NULL,
    "universityId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'TODO',
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "dueDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "content" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CounsellingSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "intent" "Intent",
    "riskLevel" "Level",
    "decisionPath" "DecisionPath",
    "stage" "SessionStage" NOT NULL DEFAULT 'INTENT_CONFIRMED',
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CounsellingSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShortlistedUniversity" ADD CONSTRAINT "ShortlistedUniversity_counsellingSessionId_fkey" FOREIGN KEY ("counsellingSessionId") REFERENCES "CounsellingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShortlistedUniversity" ADD CONSTRAINT "ShortlistedUniversity_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_counsellingSessionId_fkey" FOREIGN KEY ("counsellingSessionId") REFERENCES "CounsellingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "CounsellingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounsellingSession" ADD CONSTRAINT "CounsellingSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
