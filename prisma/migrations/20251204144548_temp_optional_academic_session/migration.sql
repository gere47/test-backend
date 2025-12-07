/*
  Warnings:

  - You are about to drop the `AttendanceSummary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `holidays` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `teacher_assignments` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[studentId,classId,date]` on the table `attendance` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "AttendanceSummary" DROP CONSTRAINT "AttendanceSummary_academicSessionId_fkey";

-- DropForeignKey
ALTER TABLE "AttendanceSummary" DROP CONSTRAINT "AttendanceSummary_classId_fkey";

-- DropForeignKey
ALTER TABLE "AttendanceSummary" DROP CONSTRAINT "AttendanceSummary_studentId_fkey";

-- DropForeignKey
ALTER TABLE "teacher_assignments" DROP CONSTRAINT "teacher_assignments_classId_fkey";

-- DropForeignKey
ALTER TABLE "teacher_assignments" DROP CONSTRAINT "teacher_assignments_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "teacher_assignments" DROP CONSTRAINT "teacher_assignments_teacherId_fkey";

-- DropIndex
DROP INDEX "attendance_studentId_classId_date_subjectId_key";

-- AlterTable
ALTER TABLE "classes" ADD COLUMN     "academicSessionId" INTEGER;

-- DropTable
DROP TABLE "AttendanceSummary";

-- DropTable
DROP TABLE "holidays";

-- DropTable
DROP TABLE "teacher_assignments";

-- CreateTable
CREATE TABLE "Module" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "path" TEXT,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModulePermission" (
    "id" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "moduleId" INTEGER NOT NULL,
    "canView" BOOLEAN NOT NULL DEFAULT false,
    "canCreate" BOOLEAN NOT NULL DEFAULT false,
    "canEdit" BOOLEAN NOT NULL DEFAULT false,
    "canDelete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModulePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Holiday" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Holiday_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance_summary" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "academicSessionId" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "totalDays" INTEGER NOT NULL,
    "presentDays" INTEGER NOT NULL,
    "absentDays" INTEGER NOT NULL,
    "lateDays" INTEGER NOT NULL,
    "halfDays" INTEGER NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendance_summary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherAssignment" (
    "id" SERIAL NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "subjectId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeacherAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ModulePermission_roleId_moduleId_key" ON "ModulePermission"("roleId", "moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "Holiday_date_key" ON "Holiday"("date");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_summary_studentId_classId_academicSessionId_mont_key" ON "attendance_summary"("studentId", "classId", "academicSessionId", "month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_studentId_classId_date_key" ON "attendance"("studentId", "classId", "date");

-- AddForeignKey
ALTER TABLE "ModulePermission" ADD CONSTRAINT "ModulePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModulePermission" ADD CONSTRAINT "ModulePermission_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_academicSessionId_fkey" FOREIGN KEY ("academicSessionId") REFERENCES "academic_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_summary" ADD CONSTRAINT "attendance_summary_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_summary" ADD CONSTRAINT "attendance_summary_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_summary" ADD CONSTRAINT "attendance_summary_academicSessionId_fkey" FOREIGN KEY ("academicSessionId") REFERENCES "academic_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherAssignment" ADD CONSTRAINT "TeacherAssignment_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherAssignment" ADD CONSTRAINT "TeacherAssignment_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherAssignment" ADD CONSTRAINT "TeacherAssignment_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
