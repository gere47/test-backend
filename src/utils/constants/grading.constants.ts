export const EXAM_STATUS = {
  SCHEDULED: 'SCHEDULED',
  ONGOING: 'ONGOING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  POSTPONED: 'POSTPONED',
};

export const DEFAULT_GRADE_SCALE = [
  { grade: 'A+', minPercent: 90, maxPercent: 100, gradePoint: 4.0 },
  { grade: 'A', minPercent: 80, maxPercent: 89, gradePoint: 3.7 },
  { grade: 'B+', minPercent: 70, maxPercent: 79, gradePoint: 3.3 },
  { grade: 'B', minPercent: 60, maxPercent: 69, gradePoint: 3.0 },
  { grade: 'C+', minPercent: 50, maxPercent: 59, gradePoint: 2.7 },
  { grade: 'C', minPercent: 40, maxPercent: 49, gradePoint: 2.3 },
  { grade: 'D', minPercent: 33, maxPercent: 39, gradePoint: 2.0 },
  { grade: 'F', minPercent: 0, maxPercent: 32, gradePoint: 0.0 },
];