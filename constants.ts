
import { Status, Student, TaskRecords } from './types';

export const INITIAL_STUDENTS: Student[] = [
  { id: '1', name: 'Alex Johnson', email: 'alex.j@example.com' },
  { id: '2', name: 'Beatrix Thorne', email: 'beatrix.t@example.com' },
  { id: '3', name: 'Caleb Rivers', email: 'caleb.r@example.com' },
  { id: '4', name: 'Diana Prince', email: 'diana.p@example.com' },
  { id: '5', name: 'Evan Wright', email: 'evan.w@example.com' },
  { id: '6', name: 'Fiona Gallagher', email: 'fiona.g@example.com' },
  { id: '7', name: 'George Miller', email: 'george.m@example.com' },
  { id: '8', name: 'Hannah Abbott', email: 'hannah.a@example.com' },
  { id: '9', name: 'Ian Somerhalder', email: 'ian.s@example.com' },
  { id: '10', name: 'Julianna Margulies', email: 'julie.m@example.com' },
];

export const STATUS_OPTIONS: Status[] = ['Completed', 'In Progress', 'Missing', 'Not Started'];

export const EMPTY_TASK_RECORDS: TaskRecords = {
  hw1: 'Not Started',
  hw2: 'Not Started',
  bonus: 'Not Started',
  group1: 'Not Started',
  group2: 'Not Started',
  verification: 'Not Started',
};

export const TASKS = [
  { id: 'hw1', label: 'HW 1' },
  { id: 'hw2', label: 'HW 2' },
  { id: 'bonus', label: 'Bonus' },
  { id: 'group1', label: 'Group 1' },
  { id: 'group2', label: 'Group 2' },
  { id: 'verification', label: 'Verification' },
];

export const STATUS_COLORS: Record<Status, string> = {
  'Completed': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'In Progress': 'bg-amber-100 text-amber-800 border-amber-200',
  'Missing': 'bg-rose-100 text-rose-800 border-rose-200',
  'Not Started': 'bg-slate-100 text-slate-800 border-slate-200',
};
