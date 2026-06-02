import type { Student, Teacher } from "@/types";

export const initialStudents: Student[] = [
  { id: "s1", name: "Aarav Mehta", class: "Class 10", monthlyFee: 2200, feePaid: true },
  { id: "s2", name: "Diya Sharma", class: "Class 9", monthlyFee: 2000, feePaid: false },
  { id: "s3", name: "Ishaan Verma", class: "Class 12", monthlyFee: 2600, feePaid: true }
];

export const initialTeachers: Teacher[] = [
  { id: "t1", name: "Ritika Das", subject: "Mathematics", monthlySalary: 32000 },
  { id: "t2", name: "Neeraj Nair", subject: "Physics", monthlySalary: 34000 }
];
