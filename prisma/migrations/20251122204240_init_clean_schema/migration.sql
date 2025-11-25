/*
  Warnings:

  - You are about to drop the column `description` on the `academic_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `isCurrent` on the `academic_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `academic_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `attendances` table. All the data in the column will be lost.
  - You are about to drop the column `markedBy` on the `attendances` table. All the data in the column will be lost.
  - You are about to drop the column `period` on the `attendances` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `attendances` table. All the data in the column will be lost.
  - You are about to drop the column `academicYear` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the column `grade` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `exam_results` table. All the data in the column will be lost.
  - You are about to drop the column `isAbsent` on the `exam_results` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `exam_results` table. All the data in the column will be lost.
  - You are about to drop the column `maxMarks` on the `exam_results` table. All the data in the column will be lost.
  - You are about to drop the column `percentage` on the `exam_results` table. All the data in the column will be lost.
  - You are about to drop the column `practicalMarks` on the `exam_results` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `exam_results` table. All the data in the column will be lost.
  - You are about to drop the column `theoryMarks` on the `exam_results` table. All the data in the column will be lost.
  - You are about to drop the column `totalMarks` on the `exam_results` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `exam_results` table. All the data in the column will be lost.
  - You are about to drop the column `academicYear` on the `exams` table. All the data in the column will be lost.
  - You are about to drop the column `classId` on the `exams` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `exams` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `exams` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `exams` table. All the data in the column will be lost.
  - You are about to drop the column `examTypeId` on the `exams` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `exams` table. All the data in the column will be lost.
  - You are about to drop the column `isPublished` on the `exams` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `exams` table. All the data in the column will be lost.
  - You are about to drop the column `term` on the `exams` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `exams` table. All the data in the column will be lost.
  - You are about to drop the column `aadharUrl` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `admissionNumber` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `allergies` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `birthCertificateUrl` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `bloodGroup` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `emergencyContact` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `guardianIncome` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `medicalConditions` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `photoUrl` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `pincode` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `previousClass` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `previousPercentage` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `previousSchool` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `religion` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `rollNumber` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `tcDate` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `tcNumber` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `tcUrl` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `failedLoginAttempts` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastLogin` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastLoginAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lockedUntil` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `passwordChangedAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `account_ledgers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `announcements` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `asset_assignments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `asset_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `assets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `audit_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `book_transactions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `books` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `class_subjects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dashboards` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `employees` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `exam_subjects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `exam_types` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `fee_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `fee_structures` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `fee_transactions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `grade_scales` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `holidays` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `leaves` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `library_members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `messages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `module_permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `modules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payrolls` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reports` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subjects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `timetables` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_sessions` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `students` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `marks` to the `exam_results` table without a default value. This is not possible if the table is not empty.
  - Added the required column `examDate` to the `exams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxMarks` to the `exams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipCode` to the `students` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `students` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `students` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `students` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `students` required. This step will fail if there are existing NULL values in that column.
  - Made the column `state` on table `students` required. This step will fail if there are existing NULL values in that column.
  - Made the column `guardianEmail` on table `students` required. This step will fail if there are existing NULL values in that column.
  - Made the column `guardianOccupation` on table `students` required. This step will fail if there are existing NULL values in that column.
  - Made the column `firstName` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastName` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `roleId` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "account_ledgers" DROP CONSTRAINT "account_ledgers_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "announcements" DROP CONSTRAINT "announcements_authorId_fkey";

-- DropForeignKey
ALTER TABLE "asset_assignments" DROP CONSTRAINT "asset_assignments_assetId_fkey";

-- DropForeignKey
ALTER TABLE "asset_assignments" DROP CONSTRAINT "asset_assignments_assignedBy_fkey";

-- DropForeignKey
ALTER TABLE "asset_assignments" DROP CONSTRAINT "asset_assignments_assignedTo_fkey";

-- DropForeignKey
ALTER TABLE "assets" DROP CONSTRAINT "assets_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "attendances" DROP CONSTRAINT "attendances_markedBy_fkey";

-- DropForeignKey
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_userId_fkey";

-- DropForeignKey
ALTER TABLE "book_transactions" DROP CONSTRAINT "book_transactions_bookId_fkey";

-- DropForeignKey
ALTER TABLE "book_transactions" DROP CONSTRAINT "book_transactions_memberId_fkey";

-- DropForeignKey
ALTER TABLE "class_subjects" DROP CONSTRAINT "class_subjects_classId_fkey";

-- DropForeignKey
ALTER TABLE "class_subjects" DROP CONSTRAINT "class_subjects_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "class_subjects" DROP CONSTRAINT "class_subjects_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_userId_fkey";

-- DropForeignKey
ALTER TABLE "exam_subjects" DROP CONSTRAINT "exam_subjects_examId_fkey";

-- DropForeignKey
ALTER TABLE "exam_subjects" DROP CONSTRAINT "exam_subjects_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "exams" DROP CONSTRAINT "exams_classId_fkey";

-- DropForeignKey
ALTER TABLE "exams" DROP CONSTRAINT "exams_examTypeId_fkey";

-- DropForeignKey
ALTER TABLE "fee_structures" DROP CONSTRAINT "fee_structures_classId_fkey";

-- DropForeignKey
ALTER TABLE "fee_structures" DROP CONSTRAINT "fee_structures_feeCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "fee_transactions" DROP CONSTRAINT "fee_transactions_collectedBy_fkey";

-- DropForeignKey
ALTER TABLE "fee_transactions" DROP CONSTRAINT "fee_transactions_feeStructureId_fkey";

-- DropForeignKey
ALTER TABLE "fee_transactions" DROP CONSTRAINT "fee_transactions_studentId_fkey";

-- DropForeignKey
ALTER TABLE "leaves" DROP CONSTRAINT "leaves_approvedBy_fkey";

-- DropForeignKey
ALTER TABLE "leaves" DROP CONSTRAINT "leaves_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "library_members" DROP CONSTRAINT "library_members_studentId_fkey";

-- DropForeignKey
ALTER TABLE "library_members" DROP CONSTRAINT "library_members_userId_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_parentId_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_senderId_fkey";

-- DropForeignKey
ALTER TABLE "module_permissions" DROP CONSTRAINT "module_permissions_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "module_permissions" DROP CONSTRAINT "module_permissions_roleId_fkey";

-- DropForeignKey
ALTER TABLE "payrolls" DROP CONSTRAINT "payrolls_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "payrolls" DROP CONSTRAINT "payrolls_processedBy_fkey";

-- DropForeignKey
ALTER TABLE "reports" DROP CONSTRAINT "reports_generatedBy_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_classId_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_userId_fkey";

-- DropForeignKey
ALTER TABLE "timetables" DROP CONSTRAINT "timetables_classId_fkey";

-- DropForeignKey
ALTER TABLE "timetables" DROP CONSTRAINT "timetables_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "timetables" DROP CONSTRAINT "timetables_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "user_sessions" DROP CONSTRAINT "user_sessions_userId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_roleId_fkey";

-- DropIndex
DROP INDEX "attendances_classId_date_idx";

-- DropIndex
DROP INDEX "attendances_studentId_date_idx";

-- DropIndex
DROP INDEX "attendances_studentId_date_period_key";

-- DropIndex
DROP INDEX "classes_grade_section_academicYear_key";

-- DropIndex
DROP INDEX "exam_results_examId_studentId_subjectId_key";

-- DropIndex
DROP INDEX "exam_results_studentId_examId_idx";

-- DropIndex
DROP INDEX "exams_classId_academicYear_term_idx";

-- DropIndex
DROP INDEX "students_admissionNumber_key";

-- DropIndex
DROP INDEX "students_userId_key";

-- AlterTable
ALTER TABLE "academic_sessions" DROP COLUMN "description",
DROP COLUMN "isCurrent",
DROP COLUMN "updatedAt",
ADD COLUMN     "admissionOpen" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "attendances" DROP COLUMN "createdAt",
DROP COLUMN "markedBy",
DROP COLUMN "period",
DROP COLUMN "updatedAt",
ALTER COLUMN "date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "classes" DROP COLUMN "academicYear",
DROP COLUMN "createdAt",
DROP COLUMN "grade",
DROP COLUMN "isActive",
DROP COLUMN "updatedAt",
ALTER COLUMN "section" DROP NOT NULL,
ALTER COLUMN "capacity" DROP DEFAULT;

-- AlterTable
ALTER TABLE "exam_results" DROP COLUMN "createdAt",
DROP COLUMN "isAbsent",
DROP COLUMN "isVerified",
DROP COLUMN "maxMarks",
DROP COLUMN "percentage",
DROP COLUMN "practicalMarks",
DROP COLUMN "subjectId",
DROP COLUMN "theoryMarks",
DROP COLUMN "totalMarks",
DROP COLUMN "updatedAt",
ADD COLUMN     "enteredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "marks" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "verifiedAt" TIMESTAMP(3),
ALTER COLUMN "grade" DROP NOT NULL;

-- AlterTable
ALTER TABLE "exams" DROP COLUMN "academicYear",
DROP COLUMN "classId",
DROP COLUMN "createdAt",
DROP COLUMN "description",
DROP COLUMN "endDate",
DROP COLUMN "examTypeId",
DROP COLUMN "isActive",
DROP COLUMN "isPublished",
DROP COLUMN "startDate",
DROP COLUMN "term",
DROP COLUMN "updatedAt",
ADD COLUMN     "examDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "maxMarks" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "students" DROP COLUMN "aadharUrl",
DROP COLUMN "admissionNumber",
DROP COLUMN "allergies",
DROP COLUMN "birthCertificateUrl",
DROP COLUMN "bloodGroup",
DROP COLUMN "category",
DROP COLUMN "emergencyContact",
DROP COLUMN "guardianIncome",
DROP COLUMN "isActive",
DROP COLUMN "medicalConditions",
DROP COLUMN "photoUrl",
DROP COLUMN "pincode",
DROP COLUMN "previousClass",
DROP COLUMN "previousPercentage",
DROP COLUMN "previousSchool",
DROP COLUMN "religion",
DROP COLUMN "rollNumber",
DROP COLUMN "sessionId",
DROP COLUMN "tcDate",
DROP COLUMN "tcNumber",
DROP COLUMN "tcUrl",
DROP COLUMN "userId",
ADD COLUMN     "academicSessionId" TEXT,
ADD COLUMN     "admissionTestScore" INTEGER,
ADD COLUMN     "zipCode" TEXT NOT NULL,
ALTER COLUMN "classId" DROP NOT NULL,
ALTER COLUMN "nationality" DROP NOT NULL,
ALTER COLUMN "nationality" DROP DEFAULT,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "state" SET NOT NULL,
ALTER COLUMN "guardianEmail" SET NOT NULL,
ALTER COLUMN "guardianOccupation" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "deletedAt",
DROP COLUMN "failedLoginAttempts",
DROP COLUMN "isActive",
DROP COLUMN "isVerified",
DROP COLUMN "lastLogin",
DROP COLUMN "lastLoginAt",
DROP COLUMN "lockedUntil",
DROP COLUMN "passwordChangedAt",
DROP COLUMN "status",
ALTER COLUMN "firstName" SET NOT NULL,
ALTER COLUMN "lastName" SET NOT NULL,
DROP COLUMN "roleId",
ADD COLUMN     "roleId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "account_ledgers";

-- DropTable
DROP TABLE "announcements";

-- DropTable
DROP TABLE "asset_assignments";

-- DropTable
DROP TABLE "asset_categories";

-- DropTable
DROP TABLE "assets";

-- DropTable
DROP TABLE "audit_logs";

-- DropTable
DROP TABLE "book_transactions";

-- DropTable
DROP TABLE "books";

-- DropTable
DROP TABLE "class_subjects";

-- DropTable
DROP TABLE "dashboards";

-- DropTable
DROP TABLE "employees";

-- DropTable
DROP TABLE "exam_subjects";

-- DropTable
DROP TABLE "exam_types";

-- DropTable
DROP TABLE "fee_categories";

-- DropTable
DROP TABLE "fee_structures";

-- DropTable
DROP TABLE "fee_transactions";

-- DropTable
DROP TABLE "grade_scales";

-- DropTable
DROP TABLE "holidays";

-- DropTable
DROP TABLE "leaves";

-- DropTable
DROP TABLE "library_members";

-- DropTable
DROP TABLE "messages";

-- DropTable
DROP TABLE "module_permissions";

-- DropTable
DROP TABLE "modules";

-- DropTable
DROP TABLE "payrolls";

-- DropTable
DROP TABLE "reports";

-- DropTable
DROP TABLE "roles";

-- DropTable
DROP TABLE "subjects";

-- DropTable
DROP TABLE "timetables";

-- DropTable
DROP TABLE "user_sessions";

-- CreateTable
CREATE TABLE "educational_backgrounds" (
    "id" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "qualification" TEXT NOT NULL,
    "yearCompleted" INTEGER NOT NULL,
    "percentage" DOUBLE PRECISION,
    "board" TEXT,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "educational_backgrounds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_documents" (
    "id" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studentId" TEXT NOT NULL,
    "uploadedBy" TEXT NOT NULL,

    CONSTRAINT "student_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_academicSessionId_fkey" FOREIGN KEY ("academicSessionId") REFERENCES "academic_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "educational_backgrounds" ADD CONSTRAINT "educational_backgrounds_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_documents" ADD CONSTRAINT "student_documents_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_documents" ADD CONSTRAINT "student_documents_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
