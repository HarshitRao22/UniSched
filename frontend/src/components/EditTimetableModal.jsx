import React, { useEffect, useState } from 'react';
import { roomService } from '../services/roomService';
import { examSlotService } from '../services/examSlotService';
import { schedulingService } from '../services/schedulingService';
import { Modal, Button, Select } from './ui';
import {
  FiCalendar, FiClock, FiMapPin, FiAlertTriangle,
  FiBook, FiUsers, FiUserCheck,
} from 'react-icons/fi';

/**
 * Modal for manually editing a single scheduled exam.
 *
 * @param {object}   exam      The ScheduledExamDTO currently being edited.
 * @param {boolean}  open      Controls modal visibility.
 * @param {function} onClose   Called when the modal is dismissed.
 * @param {function} onSaved   Called with the updated ScheduledExamDTO after a successful save.
 */
export default function EditTimetableModal({ exam, open, onClose, onSaved }) {
  const [rooms, setRooms] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Load rooms and slots once when the modal opens.
  useEffect(() => {
    if (!open || !exam) return;

    setSelectedRoomId(String(exam.roomId));
    setSelectedSlotId(String(exam.examSlotId));
    setError('');

    const load = async () => {
      setLoadingOptions(true);
      try {
        const [roomsData, slotsData] = await Promise.all([
          roomService.getAll(),
          examSlotService.getAll(),
        ]);
        setRooms(roomsData);
        setSlots(slotsData);
      } catch {
        setError('Failed to load rooms or exam slots.');
      } finally {
        setLoadingOptions(false);
      }
    };
    load();
  }, [open, exam]);

  const handleSave = async () => {
    setError('');
    if (!selectedRoomId || !selectedSlotId) {
      setError('Please select both a room and an exam slot.');
      return;
    }

    setSaving(true);
    try {
      const updated = await schedulingService.updateScheduledExam(
        exam.id,
        parseInt(selectedRoomId, 10),
        parseInt(selectedSlotId, 10),
      );
      onSaved(updated);
    } catch (err) {
      // Show the server-side conflict message directly — it is already
      // written in plain English by the service layer.
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to save changes. Please check for conflicts.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  if (!exam) return null;

  const selectedRoom = rooms.find((r) => String(r.id) === selectedRoomId);
  const selectedSlot = slots.find((s) => String(s.id) === selectedSlotId);
  const capacityWarning =
    selectedRoom && exam.studentCount > selectedRoom.capacity
      ? `⚠ Room capacity (${selectedRoom.capacity}) is less than students (${exam.studentCount}).`
      : null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Edit Scheduled Exam"
      subtitle={`${exam.courseCode} — ${exam.courseName}`}
      width="max-w-lg"
    >
      {/* Exam info (read-only) */}
      <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 mb-5 space-y-2">
        <InfoRow icon={FiBook} label="Course" value={`${exam.courseCode} — ${exam.courseName}`} />
        <InfoRow icon={FiUsers} label="Students" value={`${exam.studentCount} students (${exam.branch}, Sem ${exam.semester})`} />
        {exam.facultyName && (
          <InfoRow icon={FiUserCheck} label="Faculty" value={exam.facultyName} />
        )}
      </div>

      {/* Current assignment */}
      <div className="flex gap-3 mb-5">
        <div className="flex-1 rounded-xl border border-slate-100 p-3 text-center bg-white">
          <p className="text-[10px] font-semibold text-slate-400 uppercase mb-1">Current Room</p>
          <p className="text-sm font-semibold text-slate-700">{exam.roomNumber}</p>
        </div>
        <div className="flex-1 rounded-xl border border-slate-100 p-3 text-center bg-white">
          <p className="text-[10px] font-semibold text-slate-400 uppercase mb-1">Current Slot</p>
          <p className="text-sm font-semibold text-slate-700">{exam.examDate}</p>
          <p className="text-xs text-slate-400">{exam.startTime}–{exam.endTime}</p>
        </div>
      </div>

      {/* Editable fields */}
      {loadingOptions ? (
        <div className="text-center py-4 text-sm text-slate-400">Loading options…</div>
      ) : (
        <div className="space-y-4 mb-5">
          <Select
            label="New Room"
            value={selectedRoomId}
            onChange={(e) => { setSelectedRoomId(e.target.value); setError(''); }}
          >
            <option value="">— Select a room —</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.roomNumber} — {r.building} (capacity: {r.capacity})
              </option>
            ))}
          </Select>

          {capacityWarning && (
            <div className="flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-100 rounded-lg">
              <FiAlertTriangle size={15} className="text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-700">{capacityWarning}</p>
            </div>
          )}

          <Select
            label="New Exam Slot"
            value={selectedSlotId}
            onChange={(e) => { setSelectedSlotId(e.target.value); setError(''); }}
          >
            <option value="">— Select a slot —</option>
            {slots.map((s) => (
              <option key={s.id} value={s.id}>
                {s.examDate} · {s.startTime}–{s.endTime}
              </option>
            ))}
          </Select>
        </div>
      )}

      {/* Conflict / validation error */}
      {error && (
        <div className="flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl mb-4 animate-fadeIn">
          <FiAlertTriangle size={16} className="text-danger mt-0.5 flex-shrink-0" />
          <p className="text-sm text-danger">{error}</p>
        </div>
      )}

      {/* Preview of new assignment */}
      {selectedRoom && selectedSlot && !capacityWarning && (
        <div className="flex gap-2 mb-5 p-3 bg-primary-50 rounded-xl border border-primary-100 text-xs text-primary-700">
          <FiMapPin size={14} className="mt-0.5 flex-shrink-0" />
          <span>
            Will be scheduled in <strong>{selectedRoom.roomNumber}</strong> on{' '}
            <strong>{selectedSlot.examDate}</strong> from{' '}
            <strong>{selectedSlot.startTime}–{selectedSlot.endTime}</strong>
          </span>
        </div>
      )}

      <div className="flex justify-end gap-2.5">
        <Button type="button" variant="secondary" onClick={handleClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          loading={saving}
          disabled={loadingOptions || !!capacityWarning}
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </Button>
      </div>
    </Modal>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5 text-sm">
      <Icon size={14} className="text-slate-400 flex-shrink-0" />
      <span className="text-slate-500 w-16 flex-shrink-0">{label}</span>
      <span className="text-slate-700 font-medium">{value}</span>
    </div>
  );
}
