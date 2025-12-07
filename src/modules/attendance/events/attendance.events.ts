export class AbsentStudentEvent {
  constructor(
    public readonly attendance: any,
    public readonly recordedBy: number,
  ) {}
}

export class BulkAbsentStudentsEvent {
  constructor(
    public readonly attendances: any[],
    public readonly recordedBy: number,
  ) {}
}

export class AttendanceMarkedEvent {
  constructor(
    public readonly attendance: any,
    public readonly recordedBy: number,
  ) {}
}

export class AttendanceUpdatedEvent {
  constructor(
    public readonly attendance: any,
    public readonly previousStatus: string,
    public readonly updatedBy: number,
  ) {}
}