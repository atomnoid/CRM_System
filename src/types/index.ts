export type FeeStatus = "Paid" | "Pending";

export interface Student {
  id: string;
  name: string;
  class: string;
  monthlyFee: number;
  feePaid: boolean;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  monthlySalary: number;
}
