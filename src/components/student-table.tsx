"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Plus, Edit, Trash2, CheckCircle2, Clock } from "lucide-react";
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

  const downloadCSV = (): void => {
    if (!students || students.length === 0) return;

    const headers = ["S.No", "ID", "Name", "Class", "Monthly Fee (Rs)", "Fee Status", "Paid Till Month", "Created Date"];
    const rows = students.map((s, idx) => [
      idx + 1,
      `"${s.id}"`,
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.class.replace(/"/g, '""')}"`,
      s.monthlyFee,
      s.feePaid ? "Paid" : "Pending",
      `"${s.paidTillMonth || ""}"`,
      `"${s.createdAt ? new Date(s.createdAt).toLocaleDateString() : ""}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `students_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="p-0 border border-border shadow-sm overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-slate-50/50 p-4">
        <div>
          <h3 className="text-lg font-bold text-unicorn-primary">Students Directory</h3>
          <p className="text-xs text-slate-500">Manage enrolled students, fees, and status.</p>
        </div>
        <div className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="outline"
              onClick={downloadCSV}
              disabled={students.length === 0}
              className="flex items-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 font-semibold"
            >
              <Download className="h-4 w-4 text-emerald-600" />
              Download CSV
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button onClick={openAdd} className="flex items-center gap-2 font-semibold">
              <Plus className="h-4 w-4" /> Add Student
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <thead>
            <tr className="bg-slate-50/80 text-slate-600 text-xs uppercase tracking-wider">
              <TableHead className="w-16">S.No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Monthly Fee</TableHead>
              <TableHead>Fee Status</TableHead>
              <TableHead className="text-right pr-6">Actions</TableHead>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {students.map((student, idx) => (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.03 }}
                  className="border-b border-slate-100 hover:bg-indigo-50/30 transition-colors"
                >
                  <TableCell className="font-semibold text-slate-400 text-xs">{idx + 1}</TableCell>
                  <TableCell className="font-semibold text-slate-800">{student.name}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                      {student.class}
                    </span>
                  </TableCell>
                  <TableCell className="font-semibold text-slate-900">
                    Rs {student.monthlyFee.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge tone={student.feePaid ? "paid" : "pending"}>
                      {student.feePaid ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Paid
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Pending
                        </span>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        className="h-8 px-3 text-xs font-medium hover:border-indigo-300 hover:bg-indigo-50"
                        onClick={() => openEdit(student)}
                      >
                        <Edit className="h-3.5 w-3.5 mr-1 text-slate-500" /> Edit
                      </Button>
                      <Button
                        variant="outline"
                        className="h-8 px-3 text-xs font-medium hover:border-emerald-300 hover:bg-emerald-50"
                        onClick={() => toggleStudentFeeStatus(student.id)}
                      >
                        Toggle Status
                      </Button>
                      <Button
                        variant="destructive"
                        className="h-8 px-3 text-xs font-medium"
                        onClick={() => deleteStudent(student.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
            {students.length === 0 && (
              <tr>
                <TableCell colSpan={6} className="text-center py-10 text-slate-400 font-medium">
                  No students found. Click "Add Student" to create your first record.
                </TableCell>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Mobile Card List View */}
      <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
        <AnimatePresence>
          {students.map((student, idx) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, delay: idx * 0.04 }}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-slate-900 text-base">{student.name}</span>
                </div>
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
            </motion.div>
          ))}
        </AnimatePresence>
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

