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

  const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
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
      updateStudent(editingStudent.id, payload);
    } else {
      addStudent(payload);
    }

    setIsOpen(false);
  };

  return (
    <Card className="p-0">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h3 className="text-lg font-semibold text-unicorn-primary">Students</h3>
        <Button onClick={openAdd}>Add Student</Button>
      </div>
      <div className="overflow-x-auto">
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
                <TableCell>{student.name}</TableCell>
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
