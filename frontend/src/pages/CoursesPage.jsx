import React, { useEffect, useState } from 'react';
import { courseService } from '../services/courseService';
import { facultyService } from '../services/facultyService';
import { useToast } from '../context/ToastContext';
import { Button, Input, Select, Modal, ConfirmDialog, Badge, EmptyState, Spinner, PageHeader } from '../components/ui';
import { FiPlus, FiEdit2, FiTrash2, FiBook, FiHash, FiLayers, FiAward, FiUserCheck } from 'react-icons/fi';

const emptyForm = { courseCode: '', courseName: '', credits: '', branch: '', semester: '', facultyId: '' };

export default function CoursesPage() {
  const toast = useToast();
  const [courses, setCourses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [coursesData, facultiesData] = await Promise.all([
        courseService.getAll(),
        facultyService.getAll(),
      ]);
      setCourses(coursesData);
      setFaculties(facultiesData);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (course) => {
    setEditingId(course.id);
    setForm({
      courseCode: course.courseCode,
      courseName: course.courseName,
      credits: String(course.credits),
      branch: course.branch,
      semester: String(course.semester),
      facultyId: course.facultyId ? String(course.facultyId) : '',
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
      const payload = {
        ...form,
        credits: parseInt(form.credits, 10),
        semester: parseInt(form.semester, 10),
        facultyId: form.facultyId ? parseInt(form.facultyId, 10) : null,
      };
      if (editingId) {
        await courseService.update(editingId, payload);
        toast.success('Course updated successfully');
      } else {
        await courseService.create(payload);
        toast.success('Course added successfully');
      }
      closeModal();
      loadData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await courseService.remove(deleteTarget.id);
      toast.success('Course deleted');
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete course');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="p-8 max-w-[1400px]">
      <PageHeader
        title="Courses"
        subtitle={`${courses.length} course${courses.length === 1 ? '' : 's'} offered`}
        actions={<Button icon={FiPlus} onClick={openAddModal}>Add Course</Button>}
      />

      <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
        {loading ? (
          <Spinner label="Loading courses..." />
        ) : courses.length === 0 ? (
          <EmptyState
            icon={FiBook}
            title="No courses found"
            description="Add your first course and optionally assign a faculty member."
            action={<Button icon={FiPlus} size="sm" onClick={openAddModal}>Add Course</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wide">
                <tr>
                  <th className="px-6 py-3.5">Code</th>
                  <th className="px-6 py-3.5">Course Name</th>
                  <th className="px-6 py-3.5">Credits</th>
                  <th className="px-6 py-3.5">Branch</th>
                  <th className="px-6 py-3.5">Semester</th>
                  <th className="px-6 py-3.5">Faculty</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courses.map((c, i) => (
                  <tr key={c.id} className={`group transition-smooth hover:bg-primary-50/40 ${i % 2 === 1 ? 'bg-slate-50/40' : ''}`}>
                    <td className="px-6 py-3.5 font-medium text-slate-700 text-sm">{c.courseCode}</td>
                    <td className="px-6 py-3.5 text-sm text-slate-700">{c.courseName}</td>
                    <td className="px-6 py-3.5 text-sm text-slate-500">{c.credits}</td>
                    <td className="px-6 py-3.5"><Badge>{c.branch}</Badge></td>
                    <td className="px-6 py-3.5 text-sm text-slate-500">Sem {c.semester}</td>
                    <td className="px-6 py-3.5 text-sm text-slate-500">{c.facultyName || '—'}</td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-smooth">
                        <button onClick={() => openEditModal(c)} className="p-2 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-smooth" title="Edit">
                          <FiEdit2 size={15} />
                        </button>
                        <button onClick={() => setDeleteTarget(c)} className="p-2 rounded-lg text-slate-400 hover:text-danger hover:bg-red-50 transition-smooth" title="Delete">
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

      <Modal open={showModal} onClose={closeModal} title={editingId ? 'Edit Course' : 'Add Course'}
        subtitle={editingId ? 'Update course information' : 'Enter the new course details'}>
        {formError && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 text-danger text-sm rounded-xl font-medium">
            {formError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Course Code" icon={FiHash} required value={form.courseCode}
            onChange={(e) => setForm({ ...form, courseCode: e.target.value })} />
          <Input label="Course Name" icon={FiBook} required value={form.courseName}
            onChange={(e) => setForm({ ...form, courseName: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Credits" icon={FiAward} type="number" min="1" max="6" required
              value={form.credits} onChange={(e) => setForm({ ...form, credits: e.target.value })} />
            <Input label="Semester" type="number" min="1" max="8" required
              value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} />
          </div>
          <Input label="Branch" icon={FiLayers} required value={form.branch}
            onChange={(e) => setForm({ ...form, branch: e.target.value })} />
          <Select label="Faculty (optional)" value={form.facultyId}
            onChange={(e) => setForm({ ...form, facultyId: e.target.value })}>
            <option value="">— None —</option>
            {faculties.map((f) => (
              <option key={f.id} value={f.id}>{f.fullName} ({f.department})</option>
            ))}
          </Select>
          <div className="flex justify-end gap-2.5 pt-2">
            <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit" loading={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete course?"
        message={deleteTarget ? `This will permanently remove ${deleteTarget.courseCode} — ${deleteTarget.courseName}.` : ''}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
