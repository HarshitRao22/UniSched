import React, { useEffect, useState } from 'react';
import { roomService } from '../services/roomService';
import { useToast } from '../context/ToastContext';
import { Button, Input, Modal, ConfirmDialog, EmptyState, Spinner, PageHeader } from '../components/ui';
import { FiPlus, FiEdit2, FiTrash2, FiGrid, FiHash, FiHome, FiUsers } from 'react-icons/fi';

const emptyForm = { roomNumber: '', capacity: '', building: '' };

export default function RoomsPage() {
  const toast = useToast();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadRooms = async () => {
    setLoading(true);
    try {
      const data = await roomService.getAll();
      setRooms(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (room) => {
    setEditingId(room.id);
    setForm({
      roomNumber: room.roomNumber,
      capacity: String(room.capacity),
      building: room.building,
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
      const payload = { ...form, capacity: parseInt(form.capacity, 10) };
      if (editingId) {
        await roomService.update(editingId, payload);
        toast.success('Room updated successfully');
      } else {
        await roomService.create(payload);
        toast.success('Room added successfully');
      }
      closeModal();
      loadRooms();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save room');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await roomService.remove(deleteTarget.id);
      toast.success('Room deleted');
      loadRooms();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete room');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="p-8 max-w-[1400px]">
      <PageHeader
        title="Rooms"
        subtitle={`${rooms.length} room${rooms.length === 1 ? '' : 's'} available for exams`}
        actions={<Button icon={FiPlus} onClick={openAddModal}>Add Room</Button>}
      />

      {loading ? (
        <div className="bg-white rounded-2xl shadow-card border border-slate-100">
          <Spinner label="Loading rooms..." />
        </div>
      ) : rooms.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card border border-slate-100">
          <EmptyState
            icon={FiGrid}
            title="No rooms found"
            description="Add exam rooms to start building your timetable."
            action={<Button icon={FiPlus} size="sm" onClick={openAddModal}>Add Room</Button>}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((r) => (
            <div key={r.id} className="group bg-white rounded-2xl p-5 shadow-card hover:shadow-elevated hover:-translate-y-0.5 transition-smooth border border-slate-100">
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
                  <FiGrid size={19} className="text-amber-600" />
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-smooth">
                  <button onClick={() => openEditModal(r)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-smooth" title="Edit">
                    <FiEdit2 size={14} />
                  </button>
                  <button onClick={() => setDeleteTarget(r)} className="p-1.5 rounded-lg text-slate-400 hover:text-danger hover:bg-red-50 transition-smooth" title="Delete">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-base font-semibold text-slate-800">{r.roomNumber}</p>
              <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-1">
                <FiHome size={13} /> {r.building}
              </p>
              <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-100">
                <FiUsers size={13} className="text-slate-400" />
                <span className="text-sm text-slate-600">Capacity: <strong>{r.capacity}</strong> students</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={closeModal} title={editingId ? 'Edit Room' : 'Add Room'}
        subtitle={editingId ? 'Update room information' : 'Enter the new room details'}>
        {formError && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 text-danger text-sm rounded-xl font-medium">
            {formError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Room Number" icon={FiHash} required value={form.roomNumber}
            onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} />
          <Input label="Building" icon={FiHome} required value={form.building}
            onChange={(e) => setForm({ ...form, building: e.target.value })} />
          <Input label="Capacity" icon={FiUsers} type="number" min="1" required value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
          <div className="flex justify-end gap-2.5 pt-2">
            <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit" loading={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete room?"
        message={deleteTarget ? `This will permanently remove ${deleteTarget.roomNumber}.` : ''}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
