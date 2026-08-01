import React, { useEffect, useState } from 'react';
import { facultyService } from '../services/facultyService';
import { useToast } from '../context/ToastContext';
import { Button, Input, Modal, ConfirmDialog, Badge, EmptyState, Spinner, PageHeader } from '../components/ui';
import { FiPlus, FiEdit2, FiTrash2, FiUserCheck, FiHash, FiMail, FiLayers } from 'react-icons/fi';

const emptyForm = { facultyId: '', fullName: '', email: '', department: '' };

export default function FacultyPage() {
  const toast = useToast();
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadFaculties = async () => {
    setLoading(true);
    try {
      const data = await facultyService.getAll();
      setFaculties(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load faculty members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaculties();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (faculty) => {
    setEditingId(faculty.id);
    setForm({
      facultyId: faculty.facultyId,
      fullName: faculty.fullName,
      email: faculty.email,
      department: faculty.department,
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
      if (editingId) {
        await facultyService.update(editingId, form);
        toast.success('Faculty member updated successfully');
      } else {
        await facultyService.create(form);
        toast.success('Faculty member added successfully');
      }
      closeModal();
      loadFaculties();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save faculty member');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await facultyService.remove(deleteTarget.id);
      toast.success('Faculty member deleted');
      loadFaculties();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete faculty member');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="p-8 max-w-[1400px]">
      <PageHeader
        title="Faculty"
        subtitle={`${faculties.length} faculty member${faculties.length === 1 ? '' : 's'}`}
        actions={<Button icon={FiPlus} onClick={openAddModal}>Add Faculty</Button>}
      />

      <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
        {loading ? (
          <Spinner label="Loading faculty..." />
        ) : faculties.length === 0 ? (
          <EmptyState
            icon={FiUserCheck}
            title="No faculty members found"
            description="Add your first faculty member to start assigning courses."
            action={<Button icon={FiPlus} size="sm" onClick={openAddModal}>Add Faculty</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wide">
                <tr>
                  <th className="px-6 py-3.5">Faculty ID</th>
                  <th className="px-6 py-3.5">Full Name</th>
                  <th className="px-6 py-3.5">Email</th>
                  <th className="px-6 py-3.5">Department</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {faculties.map((f, i) => (
                  <tr key={f.id} className={`group transition-smooth hover:bg-primary-50/40 ${i % 2 === 1 ? 'bg-slate-50/40' : ''}`}>
                    <td className="px-6 py-3.5 font-medium text-slate-700 text-sm">{f.facultyId}</td>
                    <td className="px-6 py-3.5 text-sm text-slate-700">{f.fullName}</td>
                    <td className="px-6 py-3.5 text-sm text-slate-500">{f.email}</td>
                    <td className="px-6 py-3.5"><Badge>{f.department}</Badge></td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-smooth">
                        <button onClick={() => openEditModal(f)} className="p-2 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-smooth" title="Edit">
                          <FiEdit2 size={15} />
                        </button>
                        <button onClick={() => setDeleteTarget(f)} className="p-2 rounded-lg text-slate-400 hover:text-danger hover:bg-red-50 transition-smooth" title="Delete">
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

      <Modal open={showModal} onClose={closeModal} title={editingId ? 'Edit Faculty' : 'Add Faculty'}
        subtitle={editingId ? 'Update faculty information' : 'Enter the new faculty member\'s details'}>
        {formError && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 text-danger text-sm rounded-xl font-medium">
            {formError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Faculty ID" icon={FiHash} required value={form.facultyId}
            onChange={(e) => setForm({ ...form, facultyId: e.target.value })} />
          <Input label="Full Name" icon={FiUserCheck} required value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          <Input label="Email" icon={FiMail} type="email" required value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Department" icon={FiLayers} required value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })} />
          <div className="flex justify-end gap-2.5 pt-2">
            <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit" loading={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete faculty member?"
        message={deleteTarget ? `This will permanently remove ${deleteTarget.fullName} (${deleteTarget.facultyId}).` : ''}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
