
export type Status = 'Completed' | 'In Progress' | 'Missing' | 'Not Started';

export interface Student {
  id: string;
  name: string;
  email: string;
}

export interface TaskRecords {
  hw1: Status;
  hw2: Status;
  bonus: Status;
  group1: Status;
  group2: Status;
  verification: Status;
}

export interface WeeklyData {
  [studentId: string]: TaskRecords;
}

export interface AppState {
  students: Student[];
  currentWeek: number;
  data: {
    [week: number]: WeeklyData;
  };
}

export interface CohortStats {
  completionRate: number;
  attendanceRate: number;
  riskStudents: string[];
  topPerformers: string[];
}
