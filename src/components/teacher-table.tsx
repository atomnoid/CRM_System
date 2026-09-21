"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, BookOpen } from "lucide-react";
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
    <Card className="p-0 border border-border shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-border bg-slate-50/50 p-4">
        <div>
          <h3 className="text-lg font-bold text-unicorn-primary">Faculty Directory</h3>
          <p className="text-xs text-slate-500">Manage teaching staff, subjects, and salaries.</p>
        </div>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button onClick={openAdd} className="flex items-center gap-2 font-semibold">
            <Plus className="h-4 w-4" /> Add Teacher
          </Button>
        </motion.div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <thead>
            <tr className="bg-slate-50/80 text-slate-600 text-xs uppercase tracking-wider">
              <TableHead>Name</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Monthly Salary</TableHead>
              <TableHead className="text-right pr-6">Actions</TableHead>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {teachers.map((teacher, idx) => (
                <motion.tr
                  key={teacher.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.03 }}
                  className="border-b border-slate-100 hover:bg-indigo-50/30 transition-colors"
                >
                  <TableCell className="font-semibold text-slate-800">{teacher.name}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                      <BookOpen className="h-3 w-3 text-indigo-500" /> {teacher.subject}
                    </span>
                  </TableCell>
                  <TableCell className="font-semibold text-slate-900">
                    Rs {teacher.monthlySalary.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        className="h-8 px-3 text-xs font-medium hover:border-indigo-300 hover:bg-indigo-50"
                        onClick={() => openEdit(teacher)}
                      >
                        <Edit className="h-3.5 w-3.5 mr-1 text-slate-500" /> Edit
                      </Button>
                      <Button
                        variant="destructive"
                        className="h-8 px-3 text-xs font-medium"
                        onClick={() => deleteTeacher(teacher.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
            {teachers.length === 0 && (
              <tr>
                <TableCell colSpan={4} className="text-center py-10 text-slate-400 font-medium">
                  No teachers found. Click "Add Teacher" to add faculty members.
                </TableCell>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Mobile Card List View */}
      <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
        <AnimatePresence>
          {teachers.map((teacher, idx) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, delay: idx * 0.04 }}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-base">{teacher.name}</span>
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
            </motion.div>
          ))}
        </AnimatePresence>
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

