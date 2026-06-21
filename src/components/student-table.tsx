"use client";

import * as React from "react";
import { ModalForm } from "@/components/modal-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableCell, TableHead } from "@/components/ui/table";
import { useCrm } from "@/components/crm-provider";
import type { Student } from "@/types";

interface StudentFormState {
  name: string;
  class: string;
  monthlyFee: string;
  feePaid: boolean;
}

const defaultStudentForm: StudentFormState = {
  name: "",
  class: "",
  monthlyFee: "",
  feePaid: false
};

export function StudentTable(): React.JSX.Element {
  const { students, addStudent, updateStudent, deleteStudent, toggleStudentFeeStatus } = useCrm();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [editingStudent, setEditingStudent] = React.useState<Student | null>(null);
  const [formState, setFormState] = React.useState<StudentFormState>(defaultStudentForm);

  const openAdd = (): void => {
    setEditingStudent(null);
    setFormState(defaultStudentForm);
    setIsOpen(true);
  };

  const openEdit = (student: Student): void => {
    setEditingStudent(student);
    setFormState({
      name: student.name,
      class: student.class,
      monthlyFee: student.monthlyFee.toString(),
      feePaid: student.feePaid
    });
    setIsOpen(true);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const payload = {
      name: formState.name.trim(),
      class: formState.class.trim(),
      monthlyFee: Number(formState.monthlyFee),
      feePaid: formState.feePaid
    };

    if (!payload.name || !payload.class || Number.isNaN(payload.monthlyFee)) {
      return;
    }

    if (editingStudent) {
      await updateStudent(editingStudent.id, payload);
    } else {
      await addStudent(payload);
    }

    setIsOpen(false);
  };

  return (
    <Card className="p-0">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h3 className="text-lg font-semibold text-unicorn-primary">Students</h3>
        <Button onClick={openAdd}>Add Student</Button>
      </div>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <thead>
            <tr>
              <TableHead>Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Monthly Fee</TableHead>
              <TableHead>Fee Status</TableHead>
              <TableHead>Actions</TableHead>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>{student.class}</TableCell>
                <TableCell>Rs {student.monthlyFee.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge tone={student.feePaid ? "paid" : "pending"}>{student.feePaid ? "Paid" : "Pending"}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="h-8 px-3" onClick={() => openEdit(student)}>
                      Edit
                    </Button>
                    <Button variant="outline" className="h-8 px-3" onClick={() => toggleStudentFeeStatus(student.id)}>
                      Toggle Status
                    </Button>
                    <Button variant="destructive" className="h-8 px-3" onClick={() => deleteStudent(student.id)}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Mobile Card List View */}
      <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
        {students.map((student) => (
          <div
            key={student.id}
            className="flex flex-col gap-3 rounded-xl border border-border bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-unicorn-primary text-base">{student.name}</span>
              <Badge tone={student.feePaid ? "paid" : "pending"}>
                {student.feePaid ? "Paid" : "Pending"}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 border-t border-slate-100 pt-3">
              <div>
                <span className="block text-slate-400 font-medium mb-0.5">Class</span>
                <span className="text-slate-700 font-semibold text-sm">{student.class}</span>
              </div>
              <div>
                <span className="block text-slate-400 font-medium mb-0.5">Monthly Fee</span>
                <span className="text-slate-700 font-semibold text-sm">Rs {student.monthlyFee.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3 mt-1">
              <Button
                variant="outline"
                className="h-9 flex-1 text-xs font-medium"
                onClick={() => openEdit(student)}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                className="h-9 flex-1 text-xs font-medium"
                onClick={() => toggleStudentFeeStatus(student.id)}
              >
                Status
              </Button>
              <Button
                variant="destructive"
                className="h-9 px-3 text-xs font-medium"
                onClick={() => deleteStudent(student.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
        {students.length === 0 && (
          <div className="text-center py-8 text-sm text-slate-400 font-medium">
            No students found.
          </div>
        )}
      </div>

      <ModalForm open={isOpen} onClose={() => setIsOpen(false)} title={editingStudent ? "Edit Student" : "Add Student"}>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="studentName">
              Name
            </label>
            <Input
              id="studentName"
              value={formState.name}
              onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="studentClass">
              Class
            </label>
            <Input
              id="studentClass"
              value={formState.class}
              onChange={(e) => setFormState((prev) => ({ ...prev, class: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="studentFee">
              Monthly Fee
            </label>
            <Input
              id="studentFee"
              type="number"
              value={formState.monthlyFee}
              onChange={(e) => setFormState((prev) => ({ ...prev, monthlyFee: e.target.value }))}
              required
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={formState.feePaid}
              onChange={(e) => setFormState((prev) => ({ ...prev, feePaid: e.target.checked }))}
            />
            Fee Paid
          </label>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingStudent ? "Save Changes" : "Add Student"}</Button>
          </div>
        </form>
      </ModalForm>
    </Card>
  );
}
