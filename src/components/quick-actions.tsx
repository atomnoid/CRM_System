"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, GraduationCap, Download, RotateCcw, Zap, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ModalForm } from "@/components/modal-form";
import { useCrm } from "@/components/crm-provider";

export function QuickActions(): React.JSX.Element {
  const { students, addStudent, addTeacher, resetAllStudentFeesToPending, undoResetStudentFees, canUndoReset } = useCrm();

  // Modals state
  const [isAddStudentOpen, setIsAddStudentOpen] = React.useState(false);
  const [isAddTeacherOpen, setIsAddTeacherOpen] = React.useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = React.useState(false);
  const [resetDoneNotice, setResetDoneNotice] = React.useState(false);
  const [undoDoneNotice, setUndoDoneNotice] = React.useState(false);

  // Student form state
  const [studentForm, setStudentForm] = React.useState({
    name: "",
    class: "",
    monthlyFee: "",
    feePaid: false,
  });

  // Teacher form state
  const [teacherForm, setTeacherForm] = React.useState({
    name: "",
    subject: "",
    monthlySalary: "",
  });

  const onAddStudentSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!studentForm.name || !studentForm.class || !studentForm.monthlyFee) return;
    await addStudent({
      name: studentForm.name.trim(),
      class: studentForm.class.trim(),
      monthlyFee: Number(studentForm.monthlyFee),
      feePaid: studentForm.feePaid,
    });
    setStudentForm({ name: "", class: "", monthlyFee: "", feePaid: false });
    setIsAddStudentOpen(false);
  };

  const onAddTeacherSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!teacherForm.name || !teacherForm.subject || !teacherForm.monthlySalary) return;
    await addTeacher({
      name: teacherForm.name.trim(),
      subject: teacherForm.subject.trim(),
      monthlySalary: Number(teacherForm.monthlySalary),
    });
    setTeacherForm({ name: "", subject: "", monthlySalary: "" });
    setIsAddTeacherOpen(false);
  };

  const handleDownloadCsv = (): void => {
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

  const handleConfirmResetFees = async (): Promise<void> => {
    await resetAllStudentFeesToPending();
    setIsResetConfirmOpen(false);
    setResetDoneNotice(true);
  };

  const handleUndoResetFees = async (): Promise<void> => {
    await undoResetStudentFees();
    setResetDoneNotice(false);
    setUndoDoneNotice(true);
    setTimeout(() => setUndoDoneNotice(false), 4000);
  };

  return (
    <Card className="p-5 border border-border bg-gradient-to-r from-slate-50 via-white to-indigo-50/20 shadow-sm relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20 shrink-0">
            <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              Quick Actions
              <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                1-Click Controls
              </span>
            </h3>
            <p className="hidden sm:block text-xs text-slate-500">Perform instant institute management operations.</p>
          </div>
        </div>

        {/* Action Buttons — 2x2 grid on mobile, inline row on sm+ */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-2">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              onClick={() => setIsAddStudentOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 font-semibold shadow-sm text-xs sm:text-sm"
            >
              <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Add Student
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="outline"
              onClick={() => setIsAddTeacherOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-semibold text-xs sm:text-sm"
            >
              <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-600" /> Add Teacher
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="outline"
              onClick={handleDownloadCsv}
              disabled={students.length === 0}
              className="w-full sm:w-auto flex items-center justify-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-semibold text-xs sm:text-sm"
            >
              <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" /> Export CSV
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="outline"
              onClick={() => setIsResetConfirmOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 border-rose-200 text-rose-700 hover:bg-rose-50 font-semibold text-xs sm:text-sm"
            >
              <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-rose-600" /> Reset Fees
            </Button>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {resetDoneNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
              <span>Monthly Reset Done! Using this action reset your this month student fee data to Pending.</span>
            </div>
            {canUndoReset && (
              <Button
                variant="outline"
                onClick={handleUndoResetFees}
                className="h-7 px-3 bg-white text-amber-900 border-amber-300 hover:bg-amber-100 font-bold flex items-center gap-1 shadow-xs"
              >
                <RotateCcw className="h-3 w-3" /> Undo Reset
              </Button>
            )}
          </motion.div>
        )}

        {undoDoneNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Undo Successful! Previous student fee statuses have been restored.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Student Modal */}
      <ModalForm open={isAddStudentOpen} onClose={() => setIsAddStudentOpen(false)} title="Add Student (Quick Action)">
        <form className="space-y-4" onSubmit={onAddStudentSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="quickStudentName">
              Name
            </label>
            <Input
              id="quickStudentName"
              value={studentForm.name}
              onChange={(e) => setStudentForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="quickStudentClass">
              Class
            </label>
            <Input
              id="quickStudentClass"
              value={studentForm.class}
              onChange={(e) => setStudentForm((prev) => ({ ...prev, class: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="quickStudentFee">
              Monthly Fee
            </label>
            <Input
              id="quickStudentFee"
              type="number"
              value={studentForm.monthlyFee}
              onChange={(e) => setStudentForm((prev) => ({ ...prev, monthlyFee: e.target.value }))}
              required
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={studentForm.feePaid}
              onChange={(e) => setStudentForm((prev) => ({ ...prev, feePaid: e.target.checked }))}
            />
            Fee Paid
          </label>
          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setIsAddStudentOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Student</Button>
          </div>
        </form>
      </ModalForm>

      {/* Add Teacher Modal */}
      <ModalForm open={isAddTeacherOpen} onClose={() => setIsAddTeacherOpen(false)} title="Add Teacher (Quick Action)">
        <form className="space-y-4" onSubmit={onAddTeacherSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="quickTeacherName">
              Name
            </label>
            <Input
              id="quickTeacherName"
              value={teacherForm.name}
              onChange={(e) => setTeacherForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="quickTeacherSubject">
              Subject
            </label>
            <Input
              id="quickTeacherSubject"
              value={teacherForm.subject}
              onChange={(e) => setTeacherForm((prev) => ({ ...prev, subject: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="quickTeacherSalary">
              Monthly Salary
            </label>
            <Input
              id="quickTeacherSalary"
              type="number"
              value={teacherForm.monthlySalary}
              onChange={(e) => setTeacherForm((prev) => ({ ...prev, monthlySalary: e.target.value }))}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setIsAddTeacherOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Teacher</Button>
          </div>
        </form>
      </ModalForm>

      {/* Reset Confirmation Modal */}
      <ModalForm open={isResetConfirmOpen} onClose={() => setIsResetConfirmOpen(false)} title="Reset Monthly Fees">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs font-medium">
            <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
            <span>
              <strong>Warning:</strong> Using this button will reset your this month student fee data to Pending for all students.
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Note: An Undo option will be available immediately after reset if you need to revert back your data.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsResetConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmResetFees}>
              Confirm Reset All Fees
            </Button>
          </div>
        </div>
      </ModalForm>
    </Card>
  );
}
