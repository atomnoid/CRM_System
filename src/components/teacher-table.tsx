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

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
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
      await updateTeacher(editingTeacher.id, payload);
    } else {
      await addTeacher(payload);
    }

    setIsOpen(false);
  };

  return (
    <Card className="p-0">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h3 className="text-lg font-semibold text-unicorn-primary">Teachers</h3>
        <Button onClick={openAdd}>Add Teacher</Button>
      </div>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
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
                <TableCell className="font-medium">{teacher.name}</TableCell>
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

      {/* Mobile Card List View */}
      <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
        {teachers.map((teacher) => (
          <div
            key={teacher.id}
            className="flex flex-col gap-3 rounded-xl border border-border bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-unicorn-primary text-base">{teacher.name}</span>
              <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                {teacher.subject}
              </span>
            </div>
            
            <div className="grid grid-cols-1 gap-1 text-xs text-slate-500 border-t border-slate-100 pt-3">
              <div>
                <span className="block text-slate-400 font-medium mb-0.5">Monthly Salary</span>
                <span className="text-slate-700 font-semibold text-sm">Rs {teacher.monthlySalary.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-2 border-t border-slate-100 pt-3 mt-1">
              <Button
                variant="outline"
                className="h-9 flex-1 text-xs font-medium"
                onClick={() => openEdit(teacher)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                className="h-9 flex-1 text-xs font-medium"
                onClick={() => deleteTeacher(teacher.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
        {teachers.length === 0 && (
          <div className="text-center py-8 text-sm text-slate-400 font-medium">
            No teachers found.
          </div>
        )}
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
