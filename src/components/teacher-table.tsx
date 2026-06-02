"use client";

import * as React from "react";
import { ModalForm } from "@/components/modal-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableCell, TableHead } from "@/components/ui/table";
import { useCrm } from "@/components/crm-provider";
import type { Teacher } from "@/types";

interface TeacherFormState {
  name: string;
  subject: string;
  monthlySalary: string;
}

const defaultTeacherForm: TeacherFormState = {
  name: "",
  subject: "",
  monthlySalary: ""
};

export function TeacherTable(): React.JSX.Element {
  const { teachers, addTeacher, updateTeacher, deleteTeacher } = useCrm();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [editingTeacher, setEditingTeacher] = React.useState<Teacher | null>(null);
  const [formState, setFormState] = React.useState<TeacherFormState>(defaultTeacherForm);

  const openAdd = (): void => {
    setEditingTeacher(null);
    setFormState(defaultTeacherForm);
    setIsOpen(true);
  };

  const openEdit = (teacher: Teacher): void => {
    setEditingTeacher(teacher);
    setFormState({
      name: teacher.name,
      subject: teacher.subject,
      monthlySalary: teacher.monthlySalary.toString()
    });
    setIsOpen(true);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const payload = {
      name: formState.name.trim(),
      subject: formState.subject.trim(),
      monthlySalary: Number(formState.monthlySalary)
    };

    if (!payload.name || !payload.subject || Number.isNaN(payload.monthlySalary)) {
      return;
    }

    if (editingTeacher) {
      updateTeacher(editingTeacher.id, payload);
    } else {
      addTeacher(payload);
    }

    setIsOpen(false);
  };

  return (
    <Card className="p-0">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h3 className="text-lg font-semibold text-unicorn-primary">Teachers</h3>
        <Button onClick={openAdd}>Add Teacher</Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <thead>
            <tr>
              <TableHead>Name</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Monthly Salary</TableHead>
              <TableHead>Actions</TableHead>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id}>
                <TableCell>{teacher.name}</TableCell>
                <TableCell>{teacher.subject}</TableCell>
                <TableCell>Rs {teacher.monthlySalary.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="h-8 px-3" onClick={() => openEdit(teacher)}>
                      Edit
                    </Button>
                    <Button variant="destructive" className="h-8 px-3" onClick={() => deleteTeacher(teacher.id)}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <ModalForm open={isOpen} onClose={() => setIsOpen(false)} title={editingTeacher ? "Edit Teacher" : "Add Teacher"}>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="teacherName">
              Name
            </label>
            <Input
              id="teacherName"
              value={formState.name}
              onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="teacherSubject">
              Subject
            </label>
            <Input
              id="teacherSubject"
              value={formState.subject}
              onChange={(e) => setFormState((prev) => ({ ...prev, subject: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="teacherSalary">
              Monthly Salary
            </label>
            <Input
              id="teacherSalary"
              type="number"
              value={formState.monthlySalary}
              onChange={(e) => setFormState((prev) => ({ ...prev, monthlySalary: e.target.value }))}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingTeacher ? "Save Changes" : "Add Teacher"}</Button>
          </div>
        </form>
      </ModalForm>
    </Card>
  );
}
