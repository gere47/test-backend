/*
  Warnings:

  - You are about to drop the column `token` on the `user_sessions` table. All the data in the column will be lost.
  - You are about to drop the `academic_sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `admission_application_documents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `admission_applications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `admission_classes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `admission_sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `attendances` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `audit_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `class_subjects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `classes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `educational_backgrounds` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `holidays` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `student_documents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `students` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subjects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[roleId,moduleId]` on the table `module_permissions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sessionToken]` on the table `user_sessions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `createdBy` to the `exams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `module_permissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionToken` to the `user_sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `user_sessions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "admission_application_documents" DROP CONSTRAINT "admission_application_documents_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "admission_applications" DROP CONSTRAINT "admission_applications_admissionSessionId_fkey";

-- DropForeignKey
ALTER TABLE "admission_applications" DROP CONSTRAINT "admission_applications_classId_fkey";

-- DropForeignKey
ALTER TABLE "admission_applications" DROP CONSTRAINT "admission_applications_reviewedBy_fkey";

-- DropForeignKey
ALTER TABLE "admission_classes" DROP CONSTRAINT "admission_classes_admissionSessionId_fkey";

-- DropForeignKey
ALTER TABLE "admission_classes" DROP CONSTRAINT "admission_classes_classId_fkey";

-- DropForeignKey
ALTER TABLE "admission_sessions" DROP CONSTRAINT "admission_sessions_academicSessionId_fkey";

-- DropForeignKey
ALTER TABLE "attendances" DROP CONSTRAINT "attendances_classId_fkey";

-- DropForeignKey
ALTER TABLE "attendances" DROP CONSTRAINT "attendances_markedBy_fkey";

-- DropForeignKey
ALTER TABLE "attendances" DROP CONSTRAINT "attendances_studentId_fkey";

-- DropForeignKey
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_userId_fkey";

-- DropForeignKey
ALTER TABLE "class_subjects" DROP CONSTRAINT "class_subjects_classId_fkey";

-- DropForeignKey
ALTER TABLE "class_subjects" DROP CONSTRAINT "class_subjects_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "class_subjects" DROP CONSTRAINT "class_subjects_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "classes" DROP CONSTRAINT "classes_classTeacherId_fkey";

-- DropForeignKey
ALTER TABLE "classes" DROP CONSTRAINT "classes_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "educational_backgrounds" DROP CONSTRAINT "educational_backgrounds_studentId_fkey";

-- DropForeignKey
ALTER TABLE "exam_results" DROP CONSTRAINT "exam_results_enteredBy_fkey";

-- DropForeignKey
ALTER TABLE "exam_results" DROP CONSTRAINT "exam_results_studentId_fkey";

-- DropForeignKey
ALTER TABLE "exam_results" DROP CONSTRAINT "exam_results_verifiedBy_fkey";

-- DropForeignKey
ALTER TABLE "exam_subjects" DROP CONSTRAINT "exam_subjects_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "exams" DROP CONSTRAINT "exams_classId_fkey";

-- DropForeignKey
ALTER TABLE "module_permissions" DROP CONSTRAINT "module_permissions_roleId_fkey";

-- DropForeignKey
ALTER TABLE "student_documents" DROP CONSTRAINT "student_documents_studentId_fkey";

-- DropForeignKey
ALTER TABLE "student_documents" DROP CONSTRAINT "student_documents_uploadedBy_fkey";

-- DropForeignKey
ALTER TABLE "student_documents" DROP CONSTRAINT "student_documents_verifiedBy_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_classId_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_sessions" DROP CONSTRAINT "user_sessions_userId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_roleId_fkey";

-- DropIndex
DROP INDEX "module_permissions_moduleId_roleId_key";

-- AlterTable
ALTER TABLE "exams" ADD COLUMN     "createdBy" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "module_permissions" ADD COLUMN     "canManage" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "modules" ALTER COLUMN "path" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user_sessions" DROP COLUMN "token",
ADD COLUMN     "sessionToken" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "academic_sessions";

-- DropTable
DROP TABLE "admission_application_documents";

-- DropTable
DROP TABLE "admission_applications";

-- DropTable
DROP TABLE "admission_classes";

-- DropTable
DROP TABLE "admission_sessions";

-- DropTable
DROP TABLE "attendances";

-- DropTable
DROP TABLE "audit_logs";

-- DropTable
DROP TABLE "class_subjects";

-- DropTable
DROP TABLE "classes";

-- DropTable
DROP TABLE "educational_backgrounds";

-- DropTable
DROP TABLE "holidays";

-- DropTable
DROP TABLE "roles";

-- DropTable
DROP TABLE "student_documents";

-- DropTable
DROP TABLE "students";

-- DropTable
DROP TABLE "subjects";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "roleId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "permissions" JSONB,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicSession" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "admissionOpen" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcademicSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdmissionSession" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "academicSessionId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdmissionSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdmissionClass" (
    "id" SERIAL NOT NULL,
    "admissionSessionId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "availableSeats" INTEGER NOT NULL,
    "appliedSeats" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdmissionClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Class" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "section" TEXT,
    "capacity" INTEGER,
    "sessionId" INTEGER NOT NULL,
    "classTeacherId" INTEGER,
    "roomNumber" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "studentId" TEXT NOT NULL,
    "userId" INTEGER,
    "admissionNumber" TEXT,
    "admissionDate" TIMESTAMP(3),
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "nationality" TEXT,
    "guardianName" TEXT,
    "guardianRelation" TEXT,
    "guardianEmail" TEXT,
    "guardianPhone" TEXT,
    "guardianOccupation" TEXT,
    "classId" INTEGER,
    "sessionId" INTEGER,
    "status" TEXT DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducationalBackground" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "institution" TEXT NOT NULL,
    "qualification" TEXT NOT NULL,
    "yearCompleted" INTEGER NOT NULL,
    "percentage" DOUBLE PRECISION,
    "board" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EducationalBackground_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentDocument" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "documentType" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "uploadedBy" INTEGER NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'active',

    CONSTRAINT "StudentDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "remarks" TEXT,
    "recordedBy" INTEGER NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" INTEGER NOT NULL,
    "description" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AcademicSession_name_key" ON "AcademicSession"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Student_studentId_key" ON "Student"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_userId_key" ON "Student"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_phone_key" ON "Student"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_name_key" ON "Subject"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_code_key" ON "Subject"("code");

-- CreateIndex
CREATE UNIQUE INDEX "module_permissions_roleId_moduleId_key" ON "module_permissions"("roleId", "moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_sessionToken_key" ON "user_sessions"("sessionToken");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdmissionSession" ADD CONSTRAINT "AdmissionSession_academicSessionId_fkey" FOREIGN KEY ("academicSessionId") REFERENCES "AcademicSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdmissionClass" ADD CONSTRAINT "AdmissionClass_admissionSessionId_fkey" FOREIGN KEY ("admissionSessionId") REFERENCES "AdmissionSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdmissionClass" ADD CONSTRAINT "AdmissionClass_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "AcademicSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_classTeacherId_fkey" FOREIGN KEY ("classTeacherId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "AcademicSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducationalBackground" ADD CONSTRAINT "EducationalBackground_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentDocument" ADD CONSTRAINT "StudentDocument_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentDocument" ADD CONSTRAINT "StudentDocument_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_recordedBy_fkey" FOREIGN KEY ("recordedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "module_permissions" ADD CONSTRAINT "module_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_subjects" ADD CONSTRAINT "exam_subjects_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_results" ADD CONSTRAINT "exam_results_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_results" ADD CONSTRAINT "exam_results_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_results" ADD CONSTRAINT "exam_results_enteredBy_fkey" FOREIGN KEY ("enteredBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_results" ADD CONSTRAINT "exam_results_verifiedBy_fkey" FOREIGN KEY ("verifiedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
