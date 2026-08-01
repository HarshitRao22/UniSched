import React, { useEffect, useState } from 'react';
import { studentService } from '../services/studentService';
import { useToast } from '../context/ToastContext';
import { Button, Input, Modal, ConfirmDialog, Badge, EmptyState, Spinner, PageHeader } from '../components/ui';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiUsers, FiHash, FiMail, FiLayers } from 'react-icons/fi';

const emptyForm = { studentId: '', fullName: '', email: '', branch: '', semester: '' };

export default function StudentsPage() {
  const toast = useToast();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      loadStudents();
      return;
    }
    setLoading(true);
    try {
      const data = await studentService.search(searchTerm.trim());
      setStudents(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (student) => {
    setEditingId(student.id);
    setForm({
      studentId: student.studentId,
      fullName: student.fullName,
      email: student.email,
      branch: student.branch,
      semester: String(student.semester),
    });
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(emptyForm);
    setEditingId(null);
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      const payload = { ...form, semester: parseInt(form.semester, 10) };
      if (editingId) {
        await studentService.update(editingId, payload);
        toast.success('Student updated successfully');
      } else {
        await studentService.create(payload);
        toast.success('Student added successfully');
      }
      closeModal();
      loadStudents();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save student');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await studentService.remove(deleteTarget.id);
      toast.success('Student deleted');
      loadStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete student');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="p-8 max-w-[1400px]">
      <PageHeader
        title="Students"
        subtitle={`${students.length} student${students.length === 1 ? '' : 's'} on record`}
        actions={
          <Button icon={FiPlus} onClick={openAddModal}>Add Student</Button>
        }
      />

      <form onSubmit={handleSearch} className="flex gap-2.5 mb-5">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, ID, or email"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus-ring transition-smooth"
          />
        </div>
        <Button type="submit" variant="secondary">Search</Button>
        {searchTerm && (
          <Button type="button" variant="ghost" icon={FiX} onClick={() => { setSearchTerm(''); loadStudents(); }}>
            Clear
          </Button>
        )}
      </form>

      <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
        {loading ? (
          <Spinner label="Loading students..." />
        ) : students.length === 0 ? (
          <EmptyState
            icon={FiUsers}
            title="No students found"
            description="Try a different search, or add your first student to get started."
            action={<Button icon={FiPlus} size="sm" onClick={openAddModal}>Add Student</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wide">
                <tr>
                  <th className="px-6 py-3.5">Student ID</th>
                  <th className="px-6 py-3.5">Full Name</th>
                  <th className="px-6 py-3.5">Email</th>
                  <th className="px-6 py-3.5">Branch</th>
                  <th className="px-6 py-3.5">Semester</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((s, i) => (
                  <tr key={s.id} className={`group transition-smooth hover:bg-primary-50/40 ${i % 2 === 1 ? 'bg-slate-50/40' : ''}`}>
                    <td className="px-6 py-3.5 font-medium text-slate-700 text-sm">{s.studentId}</td>
                    <td className="px-6 py-3.5 text-sm text-slate-700">{s.fullName}</td>
                    <td className="px-6 py-3.5 text-sm text-slate-500">{s.email}</td>
                    <td className="px-6 py-3.5"><Badge>{s.branch}</Badge></td>
                    <td className="px-6 py-3.5 text-sm text-slate-500">Sem {s.semester}</td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-smooth">
                        <button
                          onClick={() => openEditModal(s)}
                          className="p-2 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-smooth"
                          title="Edit"
                        >
                          <FiEdit2 size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(s)}
                          className="p-2 rounded-lg text-slate-400 hover:text-danger hover:bg-red-50 transition-smooth"
                          title="Delete"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={showModal} onClose={closeModal} title={editingId ? 'Edit Student' : 'Add Student'}
        subtitle={editingId ? 'Update student information' : 'Enter the new student\'s details'}>
        {formError && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 text-danger text-sm rounded-xl font-medium">
            {formError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Student ID" icon={FiHash} required
            value={form.studentId}
            onChange={(e) => setForm({ ...form, studentId: e.target.value })}
          />
          <Input
            label="Full Name" icon={FiUsers} required
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
          <Input
            label="Email" icon={FiMail} type="email" required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label="Branch" icon={FiLayers} required
            value={form.branch}
            onChange={(e) => setForm({ ...form, branch: e.target.value })}
          />
          <Input
            label="Semester" type="number" min="1" max="8" required
            value={form.semester}
            onChange={(e) => setForm({ ...form, semester: e.target.value })}
          />
          <div className="flex justify-end gap-2.5 pt-2">
            <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit" loading={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete student?"
        message={deleteTarget ? `This will permanently remove ${deleteTarget.fullName} (${deleteTarget.studentId}).` : ''}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
