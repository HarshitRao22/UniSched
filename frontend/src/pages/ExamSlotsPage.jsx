import React, { useEffect, useState } from 'react';
import { examSlotService } from '../services/examSlotService';
import { useToast } from '../context/ToastContext';
import { Button, Input, Modal, ConfirmDialog, EmptyState, Spinner, PageHeader } from '../components/ui';
import { FiPlus, FiTrash2, FiClock, FiCalendar } from 'react-icons/fi';

const emptyForm = { examDate: '', startTime: '', endTime: '' };

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ExamSlotsPage() {
  const toast = useToast();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadSlots = async () => {
    setLoading(true);
    try {
      const data = await examSlotService.getAll();
      setSlots(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load exam slots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlots();
  }, []);

  const openAddModal = () => {
    setForm(emptyForm);
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(emptyForm);
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      await examSlotService.create(form);
      toast.success('Exam slot added successfully');
      closeModal();
      loadSlots();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save exam slot');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await examSlotService.remove(deleteTarget.id);
      toast.success('Exam slot deleted');
      loadSlots();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete exam slot');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="p-8 max-w-[1400px]">
      <PageHeader
        title="Exam Slots"
        subtitle={`${slots.length} slot${slots.length === 1 ? '' : 's'} configured`}
        actions={<Button icon={FiPlus} onClick={openAddModal}>Add Slot</Button>}
      />

      <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
        {loading ? (
          <Spinner label="Loading exam slots..." />
        ) : slots.length === 0 ? (
          <EmptyState
            icon={FiClock}
            title="No exam slots found"
            description="Add exam dates and time slots before generating a timetable."
            action={<Button icon={FiPlus} size="sm" onClick={openAddModal}>Add Slot</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wide">
                <tr>
                  <th className="px-6 py-3.5">Exam Date</th>
                  <th className="px-6 py-3.5">Start Time</th>
                  <th className="px-6 py-3.5">End Time</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {slots.map((s, i) => (
                  <tr key={s.id} className={`group transition-smooth hover:bg-primary-50/40 ${i % 2 === 1 ? 'bg-slate-50/40' : ''}`}>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <FiCalendar size={14} className="text-slate-400" />
                        <span className="text-sm font-medium text-slate-700">{formatDate(s.examDate)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-slate-500">{s.startTime}</td>
                    <td className="px-6 py-3.5 text-sm text-slate-500">{s.endTime}</td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => setDeleteTarget(s)}
                        className="p-2 rounded-lg text-slate-400 hover:text-danger hover:bg-red-50 transition-smooth opacity-0 group-hover:opacity-100"
                        title="Delete"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={showModal} onClose={closeModal} title="Add Exam Slot" subtitle="Define a new exam date and time window">
        {formError && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 text-danger text-sm rounded-xl font-medium">
            {formError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Exam Date" icon={FiCalendar} type="date" required value={form.examDate}
            onChange={(e) => setForm({ ...form, examDate: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Time" icon={FiClock} type="time" required value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
            <Input label="End Time" icon={FiClock} type="time" required value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2.5 pt-2">
            <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit" loading={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete exam slot?"
        message={deleteTarget ? `This will remove the slot on ${formatDate(deleteTarget.examDate)} (${deleteTarget.startTime}–${deleteTarget.endTime}).` : ''}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
