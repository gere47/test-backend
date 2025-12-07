/*
  Warnings:

  - You are about to drop the `AcademicSession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AdmissionSession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Attendance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AuditLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Class` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EducationalBackground` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Student` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentDocument` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `exam_results` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `exam_subjects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `exam_types` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `grade_scales` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `module_permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `modules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_sessions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `academicSessionId` to the `exams` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AdmissionClass" DROP CONSTRAINT "AdmissionClass_admissionSessionId_fkey";

-- DropForeignKey
ALTER TABLE "AdmissionClass" DROP CONSTRAINT "AdmissionClass_classId_fkey";

-- DropForeignKey
ALTER TABLE "AdmissionSession" DROP CONSTRAINT "AdmissionSession_academicSessionId_fkey";

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_classId_fkey";

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_recordedBy_fkey";

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_studentId_fkey";

-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_classTeacherId_fkey";

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "EducationalBackground" DROP CONSTRAINT "EducationalBackground_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_classId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_userId_fkey";

-- DropForeignKey
ALTER TABLE "StudentDocument" DROP CONSTRAINT "StudentDocument_studentId_fkey";

-- DropForeignKey
ALTER TABLE "StudentDocument" DROP CONSTRAINT "StudentDocument_uploadedBy_fkey";

-- DropForeignKey
ALTER TABLE "exam_results" DROP CONSTRAINT "exam_results_enteredBy_fkey";

-- DropForeignKey
ALTER TABLE "exam_results" DROP CONSTRAINT "exam_results_examId_fkey";

-- DropForeignKey
ALTER TABLE "exam_results" DROP CONSTRAINT "exam_results_studentId_fkey";

-- DropForeignKey
ALTER TABLE "exam_results" DROP CONSTRAINT "exam_results_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "exam_results" DROP CONSTRAINT "exam_results_verifiedBy_fkey";

-- DropForeignKey
ALTER TABLE "exam_subjects" DROP CONSTRAINT "exam_subjects_examId_fkey";

-- DropForeignKey
ALTER TABLE "exam_subjects" DROP CONSTRAINT "exam_subjects_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "exams" DROP CONSTRAINT "exams_classId_fkey";

-- DropForeignKey
ALTER TABLE "exams" DROP CONSTRAINT "exams_examTypeId_fkey";

-- DropForeignKey
ALTER TABLE "module_permissions" DROP CONSTRAINT "module_permissions_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "module_permissions" DROP CONSTRAINT "module_permissions_roleId_fkey";

-- DropForeignKey
ALTER TABLE "user_sessions" DROP CONSTRAINT "user_sessions_userId_fkey";

-- AlterTable
ALTER TABLE "exams" ADD COLUMN     "academicSessionId" INTEGER NOT NULL,
ADD COLUMN     "instructions" TEXT,
ADD COLUMN     "passingCriteria" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
ADD COLUMN     "totalWeightage" DECIMAL(5,2);

-- DropTable
DROP TABLE "AcademicSession";

-- DropTable
DROP TABLE "AdmissionSession";

-- DropTable
DROP TABLE "Attendance";

-- DropTable
DROP TABLE "AuditLog";

-- DropTable
DROP TABLE "Class";

-- DropTable
DROP TABLE "EducationalBackground";

-- DropTable
DROP TABLE "Student";

-- DropTable
DROP TABLE "StudentDocument";

-- DropTable
DROP TABLE "Subject";

-- DropTable
DROP TABLE "exam_results";

-- DropTable
DROP TABLE "exam_subjects";

-- DropTable
DROP TABLE "exam_types";

-- DropTable
DROP TABLE "grade_scales";

-- DropTable
DROP TABLE "module_permissions";

-- DropTable
DROP TABLE "modules";

-- DropTable
DROP TABLE "user_sessions";

-- CreateTable
CREATE TABLE "UserSession" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "oldValues" JSONB,
    "newValues" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_sessions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "academic_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "grade" TEXT,
    "section" TEXT,
    "capacity" INTEGER,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" SERIAL NOT NULL,
    "studentId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "identificationNumber" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "nationality" TEXT,
    "guardianName" TEXT NOT NULL,
    "guardianPhone" TEXT NOT NULL,
    "guardianEmail" TEXT,
    "guardianRelation" TEXT NOT NULL,
    "guardianOccupation" TEXT,
    "guardianAddress" TEXT,
    "previousSchool" TEXT,
    "lastGradeCompleted" TEXT,
    "previousAcademicYear" TEXT,
    "lastGradeMarks" TEXT,
    "admissionTestDate" TIMESTAMP(3),
    "admissionTestScore" DOUBLE PRECISION,
    "admissionTestResult" TEXT,
    "admissionRemarks" TEXT,
    "admissionCategory" TEXT,
    "sessionId" INTEGER NOT NULL,
    "classId" INTEGER,
    "section" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "remarks" TEXT,
    "admissionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    "deletedBy" INTEGER,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admission_tests" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "testType" TEXT,
    "score" DOUBLE PRECISION,
    "testDate" TIMESTAMP(3),
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL,

    CONSTRAINT "admission_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassAutoAssignmentConfig" (
    "id" SERIAL NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "criteria" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClassAutoAssignmentConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "educational_backgrounds" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "institution" TEXT NOT NULL,
    "qualification" TEXT NOT NULL,
    "yearCompleted" INTEGER NOT NULL,
    "grade" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "educational_backgrounds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentInquiry" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "interestedClass" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_documents" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "documentType" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "description" TEXT,
    "uploadedBy" INTEGER NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "subjectId" INTEGER,
    "recordedBy" INTEGER NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceSummary" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "academicSessionId" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "totalDays" INTEGER NOT NULL DEFAULT 0,
    "presentDays" INTEGER NOT NULL DEFAULT 0,
    "absentDays" INTEGER NOT NULL DEFAULT 0,
    "lateDays" INTEGER NOT NULL DEFAULT 0,
    "halfDays" INTEGER NOT NULL DEFAULT 0,
    "percentage" DECIMAL(5,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttendanceSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "holidays" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "type" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "holidays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher_assignments" (
    "id" SERIAL NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "subjectId" INTEGER,

    CONSTRAINT "teacher_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "weightage" DECIMAL(5,2) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamSubject" (
    "id" SERIAL NOT NULL,
    "examId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "examDate" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "maxMarks" INTEGER NOT NULL,
    "minMarks" INTEGER NOT NULL,
    "isTheory" BOOLEAN NOT NULL DEFAULT true,
    "isPractical" BOOLEAN NOT NULL DEFAULT false,
    "practicalMarks" INTEGER,
    "theoryMarks" INTEGER,
    "roomNumber" TEXT,
    "instructions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamSubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamResult" (
    "id" SERIAL NOT NULL,
    "examId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "theoryMarks" DECIMAL(5,2),
    "practicalMarks" DECIMAL(5,2),
    "totalMarks" DECIMAL(5,2) NOT NULL,
    "maxMarks" INTEGER NOT NULL,
    "percentage" DECIMAL(5,2) NOT NULL,
    "grade" TEXT NOT NULL,
    "remarks" TEXT,
    "isAbsent" BOOLEAN NOT NULL DEFAULT false,
    "enteredBy" INTEGER NOT NULL,
    "verifiedBy" INTEGER,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grade" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "examId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "marksObtained" DECIMAL(5,2) NOT NULL,
    "maxMarks" DECIMAL(5,2) NOT NULL,
    "grade" TEXT NOT NULL,
    "gradePoint" DECIMAL(3,2),
    "percentage" DECIMAL(5,2) NOT NULL,
    "isPassed" BOOLEAN NOT NULL DEFAULT true,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportCard" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "examId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "academicSessionId" INTEGER NOT NULL,
    "totalMarks" DECIMAL(6,2) NOT NULL,
    "obtainedMarks" DECIMAL(6,2) NOT NULL,
    "percentage" DECIMAL(5,2) NOT NULL,
    "finalGrade" TEXT NOT NULL,
    "rank" INTEGER,
    "remarks" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GradeScale" (
    "id" SERIAL NOT NULL,
    "grade" TEXT NOT NULL,
    "minPercent" DECIMAL(5,2) NOT NULL,
    "maxPercent" DECIMAL(5,2) NOT NULL,
    "gradePoint" DECIMAL(3,2) NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GradeScale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClassTeachers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSession_sessionToken_key" ON "UserSession"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "students_studentId_key" ON "students"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");

-- CreateIndex
CREATE UNIQUE INDEX "students_identificationNumber_key" ON "students"("identificationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_studentId_classId_date_subjectId_key" ON "attendance"("studentId", "classId", "date", "subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceSummary_studentId_classId_academicSessionId_month_key" ON "AttendanceSummary"("studentId", "classId", "academicSessionId", "month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_assignments_teacherId_classId_subjectId_key" ON "teacher_assignments"("teacherId", "classId", "subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamType_name_key" ON "ExamType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ExamSubject_examId_subjectId_key" ON "ExamSubject"("examId", "subjectId");

-- CreateIndex
CREATE INDEX "ExamResult_studentId_examId_idx" ON "ExamResult"("studentId", "examId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamResult_examId_studentId_subjectId_key" ON "ExamResult"("examId", "studentId", "subjectId");

-- CreateIndex
CREATE INDEX "Grade_studentId_examId_idx" ON "Grade"("studentId", "examId");

-- CreateIndex
CREATE INDEX "Grade_subjectId_examId_idx" ON "Grade"("subjectId", "examId");

-- CreateIndex
CREATE UNIQUE INDEX "Grade_studentId_examId_subjectId_key" ON "Grade"("studentId", "examId", "subjectId");

-- CreateIndex
CREATE INDEX "ReportCard_studentId_academicSessionId_idx" ON "ReportCard"("studentId", "academicSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "ReportCard_studentId_examId_key" ON "ReportCard"("studentId", "examId");

-- CreateIndex
CREATE UNIQUE INDEX "GradeScale_grade_key" ON "GradeScale"("grade");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_code_key" ON "subjects"("code");

-- CreateIndex
CREATE UNIQUE INDEX "_ClassTeachers_AB_unique" ON "_ClassTeachers"("A", "B");

-- CreateIndex
CREATE INDEX "_ClassTeachers_B_index" ON "_ClassTeachers"("B");

-- CreateIndex
CREATE INDEX "exams_classId_academicSessionId_term_idx" ON "exams"("classId", "academicSessionId", "term");

-- CreateIndex
CREATE INDEX "exams_startDate_endDate_idx" ON "exams"("startDate", "endDate");

-- AddForeignKey
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "academic_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admission_tests" ADD CONSTRAINT "admission_tests_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admission_tests" ADD CONSTRAINT "admission_tests_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassAutoAssignmentConfig" ADD CONSTRAINT "ClassAutoAssignmentConfig_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "academic_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "educational_backgrounds" ADD CONSTRAINT "educational_backgrounds_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_documents" ADD CONSTRAINT "student_documents_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_documents" ADD CONSTRAINT "student_documents_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_recordedBy_fkey" FOREIGN KEY ("recordedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceSummary" ADD CONSTRAINT "AttendanceSummary_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceSummary" ADD CONSTRAINT "AttendanceSummary_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceSummary" ADD CONSTRAINT "AttendanceSummary_academicSessionId_fkey" FOREIGN KEY ("academicSessionId") REFERENCES "academic_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_assignments" ADD CONSTRAINT "teacher_assignments_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_assignments" ADD CONSTRAINT "teacher_assignments_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_assignments" ADD CONSTRAINT "teacher_assignments_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_examTypeId_fkey" FOREIGN KEY ("examTypeId") REFERENCES "ExamType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_academicSessionId_fkey" FOREIGN KEY ("academicSessionId") REFERENCES "academic_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSubject" ADD CONSTRAINT "ExamSubject_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSubject" ADD CONSTRAINT "ExamSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamResult" ADD CONSTRAINT "ExamResult_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamResult" ADD CONSTRAINT "ExamResult_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamResult" ADD CONSTRAINT "ExamResult_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamResult" ADD CONSTRAINT "ExamResult_enteredBy_fkey" FOREIGN KEY ("enteredBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamResult" ADD CONSTRAINT "ExamResult_verifiedBy_fkey" FOREIGN KEY ("verifiedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportCard" ADD CONSTRAINT "ReportCard_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportCard" ADD CONSTRAINT "ReportCard_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportCard" ADD CONSTRAINT "ReportCard_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportCard" ADD CONSTRAINT "ReportCard_academicSessionId_fkey" FOREIGN KEY ("academicSessionId") REFERENCES "academic_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdmissionClass" ADD CONSTRAINT "AdmissionClass_admissionSessionId_fkey" FOREIGN KEY ("admissionSessionId") REFERENCES "academic_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdmissionClass" ADD CONSTRAINT "AdmissionClass_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassTeachers" ADD CONSTRAINT "_ClassTeachers_A_fkey" FOREIGN KEY ("A") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassTeachers" ADD CONSTRAINT "_ClassTeachers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
