// src/modules/attendance/attendance.service.ts
import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { BulkAttendanceDto } from './dto/bulk-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { NotificationService } from '../../common/services/notification.service';
import { AuditService } from '../../common/services/audit.service';

type UserRoleString = 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER' | 'STUDENT' | string | undefined;

@Injectable()
export class AttendanceService {
  private readonly logger = new Logger(AttendanceService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly auditService: AuditService,
  ) {}

  // Helpers / Includes
  private getAttendanceIncludes() {
    return {
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          studentId: true,
          email: true,
          classId: true,
        },
      },
      class: {
        select: {
          id: true,
          name: true,
          grade: true,
          section: true,
          academicSessionId: true,
        },
      },
      subject: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
      recordedByUser: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    };
  }

  private normalizeDateToISODate(date: Date): Date {
    // normalize to UTC midnight to match DB date storage expectation
    const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    return d;
  }

  // -------------------------
  // Holidays / Validation
  // -------------------------
  private async isHoliday(date: Date): Promise<boolean> {
    const checkDate = this.normalizeDateToISODate(date);
    const holiday = await this.prisma.holiday.findFirst({
      where: { date: { equals: checkDate } },
    });
    return Boolean(holiday);
  }

  private async validateAttendanceCreation(
    classId: number,
    date: Date,
    userId: number,
    userRole?: UserRoleString,
    studentId?: number,
    subjectId?: number,
  ) {
    const today = this.normalizeDateToISODate(new Date());
    const attendanceDate = this.normalizeDateToISODate(date);

    if (attendanceDate.getTime() > today.getTime()) {
      throw new BadRequestException('Cannot mark attendance for future dates');
    }

    const dayOfWeek = attendanceDate.getUTCDay(); // 0 = Sunday, 6 = Saturday
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      throw new BadRequestException('Cannot mark attendance on weekends');
    }

    if (await this.isHoliday(attendanceDate)) {
      throw new BadRequestException('Cannot mark attendance on holidays');
    }

    // fetch user role if needed (safe)
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { role: true } });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const roleName = user.role?.name;

    // Super admin / admin bypass
    if (roleName === 'SUPER_ADMIN' || roleName === 'ADMIN') {
      return;
    }

    // Teacher must be assigned to class (and subject if provided)
    if (roleName === 'TEACHER') {
      const assignment = await this.prisma.teacherAssignment.findFirst({
        where: {
          teacherId: userId,
          classId,
          ...(subjectId ? { subjectId } : {}),
        },
      });
      if (!assignment) throw new ForbiddenException('You are not assigned to this class/subject');
    }

    // Students should not mark attendance for others
    if (roleName === 'STUDENT' && user.id !== studentId) {
      throw new ForbiddenException('Students can only view their own attendance');
    }
  }

  // -------------------------
  // Finders
  // -------------------------
  async findAll(filters: any = {}, userId?: number, userRole?: UserRoleString) {
    const where: any = {};

    // basic filters
    if (filters.studentId) where.studentId = Number(filters.studentId);
    if (filters.classId) where.classId = Number(filters.classId);
    if (filters.status) where.status = filters.status;
    if (filters.subjectId) where.subjectId = Number(filters.subjectId);

    // date range
    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) where.date.gte = this.normalizeDateToISODate(new Date(filters.startDate));
      if (filters.endDate) where.date.lte = this.normalizeDateToISODate(new Date(filters.endDate));
    }

    // month/year
    if (filters.month && filters.year) {
      const start = new Date(Number(filters.year), Number(filters.month) - 1, 1);
      const end = new Date(Number(filters.year), Number(filters.month), 0);
      where.date = { gte: this.normalizeDateToISODate(start), lte: this.normalizeDateToISODate(end) };
    }

    // single date
    if (filters.date) {
      where.date = this.normalizeDateToISODate(new Date(filters.date));
    }

    // role-based constraints
    if (userRole === 'TEACHER' && userId) {
      const assignments = await this.prisma.teacherAssignment.findMany({
        where: { teacherId: userId },
        select: { classId: true, subjectId: true },
      });
      const classIds = assignments.map(a => a.classId);
      const subjectIds = assignments.map(a => a.subjectId).filter(Boolean) as number[];

      // If teacher has no assignments, return empty
      if (classIds.length === 0 && subjectIds.length === 0) {
        return [];
      }

      where.AND = [
        {
          OR: [
            ...(classIds.length ? [{ classId: { in: classIds } }] : []),
            ...(subjectIds.length ? [{ subjectId: { in: subjectIds } }] : []),
          ],
        },
      ];
    }

    if (userRole === 'STUDENT' && userId) {
      where.studentId = userId;
    }

    return this.prisma.attendance.findMany({
      where,
      include: this.getAttendanceIncludes(),
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: number, userId?: number, userRole?: UserRoleString) {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id },
      include: this.getAttendanceIncludes(),
    });
    if (!attendance) throw new NotFoundException(`Attendance record with ID ${id} not found`);

    if (userRole === 'TEACHER') {
      const isAssigned = await this.prisma.teacherAssignment.findFirst({
        where: {
          teacherId: userId,
          classId: attendance.classId,
          ...(attendance.subjectId ? { subjectId: attendance.subjectId } : {}),
        },
      });
      if (!isAssigned) throw new ForbiddenException('Access denied to this attendance record');
    }

    if (userRole === 'STUDENT' && userId !== attendance.studentId) {
      throw new ForbiddenException('You can only view your own attendance');
    }

    return attendance;
  }

  // -------------------------
  // Create single attendance
  // -------------------------
  async create(dto: CreateAttendanceDto, userId: number, userRole?: UserRoleString) {
    const { studentId, classId, date, status, subjectId, remarks } = dto;
    const attendanceDate = this.normalizeDateToISODate(new Date(date));

    await this.validateAttendanceCreation(classId, attendanceDate, userId, userRole, studentId, subjectId);

    // check existing (respect subjectId optional)
    const existing = await this.prisma.attendance.findFirst({
      where: {
        studentId,
        classId,
        date: attendanceDate,
        ...(subjectId ? { subjectId } : {}),
      },
    });
    if (existing) throw new BadRequestException('Attendance already recorded for this student on this date');

    // student in class
    const student = await this.prisma.student.findFirst({ where: { id: studentId, classId } });
    if (!student) throw new BadRequestException('Student not found in the specified class');

    const attendance = await this.prisma.attendance.create({
      data: {
        studentId,
        classId,
        date: attendanceDate,
        status,
        recordedBy: userId,
        remarks,
        ...(subjectId ? { subjectId } : {}),
      },
      include: this.getAttendanceIncludes(),
    });

    // update summary and audit & notify
    await this.updateAttendanceSummary(studentId, classId, attendanceDate);
    await this.auditService.log('attendance.create', { attendanceId: attendance.id, createdBy: userId });

    if (status === 'ABSENT') {
      this.notificationService.sendAbsenceAlert(studentId, attendanceDate, { attendanceId: attendance.id }).catch(e => this.logger.error(e));
    }

    return attendance;
  }

  // -------------------------
  // Bulk create
  // -------------------------
  async createBulk(dto: BulkAttendanceDto, userId: number, userRole?: UserRoleString) {
    const { classId, date, subjectId, attendanceRecords } = dto;
    const attendanceDate = this.normalizeDateToISODate(new Date(date));

    await this.validateAttendanceCreation(classId, attendanceDate, userId, userRole, undefined, subjectId);

    const studentIds = attendanceRecords.map(r => r.studentId);

    // check duplicates existing
    const existing = await this.prisma.attendance.findMany({
      where: {
        classId,
        date: attendanceDate,
        studentId: { in: studentIds },
        ...(subjectId ? { subjectId } : {}),
      },
      select: { studentId: true },
    });

    if (existing.length) {
      const ids = existing.map(e => e.studentId).join(', ');
      throw new BadRequestException(`Attendance already exists for students: ${ids}`);
    }

    // verify students belong to class
    const studentsInClass = await this.prisma.student.findMany({
      where: { id: { in: studentIds }, classId },
      select: { id: true },
    });
    const validIds = studentsInClass.map(s => s.id);
    const invalid = studentIds.filter(id => !validIds.includes(id));
    if (invalid.length) throw new BadRequestException(`Students not found in class: ${invalid.join(', ')}`);

    // create records in transaction
    const creates = attendanceRecords.map(r => {
      return this.prisma.attendance.create({
        data: {
          studentId: r.studentId,
          classId,
          date: attendanceDate,
          status: r.status,
          remarks: r.remarks,
          ...(subjectId ? { subjectId } : {}),
          recordedBy: userId,
        },
      });
    });

    const created = await this.prisma.$transaction(creates);

    // update summaries and send notifications
    for (const rec of attendanceRecords) {
      await this.updateAttendanceSummary(rec.studentId, classId, attendanceDate);
      if (rec.status === 'ABSENT') {
        this.notificationService.sendAbsenceAlert(rec.studentId, attendanceDate).catch(e => this.logger.error(e));
      }
    }

    await this.auditService.log('attendance.bulk_create', { count: created.length, createdBy: userId, classId, date: attendanceDate });
    return created;
  }

  // CSV parser helper (simple)
  async createFromCsv(buffer: Buffer, classId: number, date: Date, subjectId?: number, userId?: number, userRole?: UserRoleString) {
    const text = buffer.toString('utf8');
    const rows = text.split(/\r?\n/).map(r => r.trim()).filter(Boolean);
    if (rows.length <= 1) throw new BadRequestException('CSV has no data rows');

    const header = rows[0].split(',').map(h => h.trim().toLowerCase());
    const dataRows = rows.slice(1);
    const attendanceRecords = dataRows.map(line => {
      const cols = line.split(',').map(c => c.trim());
      const obj: Record<string, string> = {};
      header.forEach((h, i) => (obj[h] = cols[i]));

      return {
        studentId: Number(obj['studentid'] ?? obj['student_id'] ?? obj['student'] ?? obj['id']),
        status: (obj['status'] || '').toUpperCase(),
        remarks: obj['remarks'] ?? undefined,
      };
    });

    const dto: BulkAttendanceDto = {
      classId,
      date: date.toISOString(),
      subjectId,
      attendanceRecords,
    } as any;

    return this.createBulk(dto, userId ?? 0, userRole);
  }

  // -------------------------
  // Update & Delete
  // -------------------------
  async update(id: number, dto: UpdateAttendanceDto, userId: number) {
    const existing = await this.prisma.attendance.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Attendance not found');

    // Only owner or admin/super-admin can update
    if (existing.recordedBy !== userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { role: true } });
      if (!user || (user.role.name !== 'ADMIN' && user.role.name !== 'SUPER_ADMIN')) {
        throw new ForbiddenException('You can only update your own attendance records');
      }
    }

    const attendanceDate = this.normalizeDateToISODate(new Date(existing.date));
    const today = this.normalizeDateToISODate(new Date());
    if (attendanceDate.getTime() !== today.getTime()) {
      const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { role: true } });
      if (!user || (user.role.name !== 'ADMIN' && user.role.name !== 'SUPER_ADMIN')) {
        throw new BadRequestException('Can only edit attendance on the same day');
      }
    }

    const updated = await this.prisma.attendance.update({
      where: { id },
      data: { ...dto, recordedBy: userId, updatedAt: new Date() },
      include: this.getAttendanceIncludes(),
    });

    await this.updateAttendanceSummary(updated.studentId, updated.classId, updated.date);
    await this.auditService.log('attendance.update', { attendanceId: id, updatedBy: userId });

    return updated;
  }

  async remove(id: number, userId: number) {
    const existing = await this.prisma.attendance.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Attendance not found');

    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { role: true } });
    if (!user || (user.role.name !== 'ADMIN' && user.role.name !== 'SUPER_ADMIN')) {
      throw new ForbiddenException('Only administrators can delete attendance records');
    }

    const today = this.normalizeDateToISODate(new Date());
    const daysDiff = (today.getTime() - this.normalizeDateToISODate(new Date(existing.date)).getTime()) / (1000 * 3600 * 24);
    if (daysDiff > 7) throw new BadRequestException('Cannot delete attendance records older than 7 days');

    const deleted = await this.prisma.attendance.delete({ where: { id } });
    await this.updateAttendanceSummary(deleted.studentId, deleted.classId, deleted.date);
    await this.auditService.log('attendance.delete', { attendanceId: id, deletedBy: userId });

    return deleted;
  }

  // -------------------------
  // Student / Class lookups
  // -------------------------
  async getStudentAttendance(studentId: number, startDate?: Date, endDate?: Date, userId?: number, userRole?: UserRoleString) {
    if (userRole === 'STUDENT' && userId !== studentId) throw new ForbiddenException('You can only view your own attendance');

    if (userRole === 'TEACHER') {
      const student = await this.prisma.student.findUnique({ where: { id: studentId }, select: { classId: true } });
      if (student) {
        const isAssigned = await this.prisma.teacherAssignment.findFirst({ where: { teacherId: userId, classId: student.classId } });
        if (!isAssigned) throw new ForbiddenException('You are not assigned to this student\'s class');
      }
    }

    const where: any = { studentId };
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = this.normalizeDateToISODate(startDate);
      if (endDate) where.date.lte = this.normalizeDateToISODate(endDate);
    }

    return this.prisma.attendance.findMany({ where, include: this.getAttendanceIncludes(), orderBy: { date: 'desc' } });
  }

  async getClassAttendanceByDate(classId: number, date: Date, userId?: number, userRole?: UserRoleString) {
    if (userRole === 'TEACHER') {
      const isAssigned = await this.prisma.teacherAssignment.findFirst({ where: { teacherId: userId, classId } });
      if (!isAssigned) throw new ForbiddenException('You are not assigned to this class');
    }

    const d = this.normalizeDateToISODate(date);
    return this.prisma.attendance.findMany({ where: { classId, date: d }, include: this.getAttendanceIncludes(), orderBy: { student: { firstName: 'asc' } } });
  }

  // -------------------------
  // Report & Summary
  // -------------------------
  private async calculateWorkingDays(startDate: Date, endDate: Date) {
    let count = 0;
    const cur = new Date(this.normalizeDateToISODate(startDate));
    while (cur <= this.normalizeDateToISODate(endDate)) {
      const day = cur.getUTCDay();
      if (day !== 0 && day !== 6 && !(await this.isHoliday(new Date(cur)))) count++;
      cur.setUTCDate(cur.getUTCDate() + 1);
    }
    return count;
  }

  async generateAttendanceReport(classId: number, month: number, year: number, userId?: number, userRole?: UserRoleString) {
    if (userRole === 'TEACHER') {
      const isAssigned = await this.prisma.teacherAssignment.findFirst({ where: { teacherId: userId, classId } });
      if (!isAssigned) throw new ForbiddenException('You are not assigned to this class');
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const students = await this.prisma.student.findMany({
      where: { classId },
      select: { id: true, firstName: true, lastName: true, studentId: true, email: true },
    });

    const attendance = await this.prisma.attendance.findMany({
      where: { classId, date: { gte: this.normalizeDateToISODate(startDate), lte: this.normalizeDateToISODate(endDate) } },
      include: { student: { select: { id: true, firstName: true, lastName: true } } },
    });

    const workingDays = await this.calculateWorkingDays(startDate, endDate);

    const studentSummaries = students.map(s => {
      const sAttendance = attendance.filter(a => a.studentId === s.id);
      const present = sAttendance.filter(a => a.status === 'PRESENT').length;
      const absent = sAttendance.filter(a => a.status === 'ABSENT').length;
      const late = sAttendance.filter(a => a.status === 'LATE').length;
      const halfDay = sAttendance.filter(a => a.status === 'HALF_DAY').length;
      const percentage = workingDays > 0 ? (present / workingDays) * 100 : 0;
      return { student: s, summary: { totalDays: workingDays, present, absent, late, halfDay, percentage }, attendance: sAttendance };
    });

    const totalPresent = studentSummaries.reduce((sum, s) => sum + s.summary.present, 0);
    const totalPossible = studentSummaries.length * workingDays;
    const classPercentage = totalPossible > 0 ? (totalPresent / totalPossible) * 100 : 0;

    return {
      classId,
      month,
      year,
      period: { startDate, endDate, workingDays },
      overallSummary: { totalStudents: students.length, totalPresent, totalPossible, classPercentage: Math.round(classPercentage * 100) / 100 },
      studentSummaries,
      generatedAt: new Date(),
    };
  }

  async getStudentAttendanceSummary(studentId: number, startDate?: Date, endDate?: Date) {
    const where: any = { studentId };
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = this.normalizeDateToISODate(startDate);
      if (endDate) where.date.lte = this.normalizeDateToISODate(endDate);
    }

    const attendance = await this.prisma.attendance.findMany({ where, select: { status: true, date: true } });

    const present = attendance.filter(a => a.status === 'PRESENT').length;
    const absent = attendance.filter(a => a.status === 'ABSENT').length;
    const late = attendance.filter(a => a.status === 'LATE').length;
    const halfDay = attendance.filter(a => a.status === 'HALF_DAY').length;
    const total = attendance.length;
    const percentage = total > 0 ? (present / total) * 100 : 0;

    return { studentId, period: { startDate, endDate }, summary: { totalDays: total, present, absent, late, halfDay, percentage }, totalRecords: total };
  }


    private async updateAttendanceSummary(studentId: number, classId: number, date: Date) {
    try {
      const month = date.getUTCMonth() + 1;
      const year = date.getUTCFullYear();

      const currentSession = await this.prisma.academicSession.findFirst({
        where: {
          startDate: { lte: date },
          endDate: { gte: date },
          isActive: true,
        },
      });

      if (!currentSession) {
        this.logger.warn(`No active academic session found for date: ${date.toISOString()}`);
        return;
      }

      // Compute month's start/end in UTC-aligned dates to match how attendance dates are normalized
      const start = new Date(Date.UTC(year, month - 1, 1));
      const end = new Date(Date.UTC(year, month, 0));

      const monthlyAttendance = await this.prisma.attendance.findMany({
        where: { studentId, classId, date: { gte: start, lte: end } },
      });

      const presentDays = monthlyAttendance.filter(a => a.status === 'PRESENT').length;
      const absentDays = monthlyAttendance.filter(a => a.status === 'ABSENT').length;
      const lateDays = monthlyAttendance.filter(a => a.status === 'LATE').length;
      const halfDays = monthlyAttendance.filter(a => a.status === 'HALF_DAY').length;
      const totalDays = monthlyAttendance.length;
      const percentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

      // --- Manual upsert (works without schema changes) ---
      const existingSummary = await this.prisma.attendanceSummary.findFirst({
        where: {
          studentId,
          classId,
          academicSessionId: currentSession.id,
          month,
          year,
        },
      });

      if (existingSummary) {
        await this.prisma.attendanceSummary.update({
          where: { id: existingSummary.id },
          data: {
            totalDays,
            presentDays,
            absentDays,
            lateDays,
            halfDays,
            percentage,
            updatedAt: new Date(),
          },
        });
      } else {
        await this.prisma.attendanceSummary.create({
          data: {
            studentId,
            classId,
            academicSessionId: currentSession.id,
            month,
            year,
            totalDays,
            presentDays,
            absentDays,
            lateDays,
            halfDays,
            percentage,
          },
        });
      }

      this.logger.log(`Attendance summary updated for student ${studentId}, month ${month}, year ${year}`);
    } catch (error: any) {
      this.logger.error(`Failed to update attendance summary: ${error?.message ?? error}`);
    }
  }

}
