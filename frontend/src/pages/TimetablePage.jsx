import React, { useEffect, useState } from 'react';
import { schedulingService } from '../services/schedulingService';
import { useToast } from '../context/ToastContext';
import { Button, Badge, EmptyState, Spinner, ConfirmDialog } from '../components/ui';
import EditTimetableModal from '../components/EditTimetableModal';
import {
  FiPlay, FiTrash2, FiAlertTriangle, FiDownload, FiFilter, FiX,
  FiCalendar, FiCheckCircle, FiXCircle, FiClock, FiMapPin, FiUserCheck, FiUsers,
  FiEdit2,
} from 'react-icons/fi';

export default function TimetablePage() {
  const toast = useToast();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const [filters, setFilters] = useState({ date: '', course: '', room: '', branch: '' });

  const loadSchedule = async () => {
    setLoading(true);
    try {
      const data = await schedulingService.getSchedule();
      setSchedule(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load timetable');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedule();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setLastResult(null);
    try {
      const result = await schedulingService.generate();
      setLastResult(result);
      setSchedule(result.schedule);
      toast.success(`Timetable generated — ${result.scheduledCount} of ${result.totalCourses} courses scheduled`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate timetable');
    } finally {
      setGenerating(false);
    }
  };

  const handleClear = async () => {
    try {
      await schedulingService.clear();
      setSchedule([]);
      setLastResult(null);
      toast.success('Timetable cleared');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to clear timetable');
    } finally {
      setConfirmClear(false);
    }
  };

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      await schedulingService.downloadPdf();
      toast.success('Timetable PDF downloaded');
    } catch (err) {
      toast.error('Failed to download PDF. Make sure a timetable has been generated.');
    } finally {
      setDownloading(false);
    }
  };

  const clearFilters = () => setFilters({ date: '', course: '', room: '', branch: '' });

  // Called by EditTimetableModal after a successful save.
  // Updates only the edited row in local state — no full reload needed.
  const handleExamSaved = (updated) => {
    setSchedule((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    setEditTarget(null);
    toast.success('Exam updated successfully');
  };

  const filteredSchedule = schedule.filter((e) => {
    if (filters.date && e.examDate !== filters.date) return false;
    if (filters.course) {
      const q = filters.course.toLowerCase();
      if (!`${e.courseCode} ${e.courseName}`.toLowerCase().includes(q)) return false;
    }
    if (filters.room && !e.roomNumber.toLowerCase().includes(filters.room.toLowerCase())) return false;
    if (filters.branch && !e.branch.toLowerCase().includes(filters.branch.toLowerCase())) return false;
    return true;
  });

  const filtersActive = filters.date || filters.course || filters.room || filters.branch;

  return (
    <div className="p-8 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-7">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Exam Timetable</h1>
          <p className="text-sm text-slate-500 mt-1">
            Generate a conflict-free schedule and export it for distribution.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button icon={FiPlay} onClick={handleGenerate} loading={generating}>
            {generating ? 'Generating...' : 'Generate Timetable'}
          </Button>
          {schedule.length > 0 && (
            <>
              <Button variant="accent" icon={FiDownload} onClick={handleDownloadPdf} loading={downloading}>
                {downloading ? 'Exporting...' : 'Export PDF'}
              </Button>
              <Button variant="secondary" icon={FiTrash2} onClick={() => setConfirmClear(true)}>
                Clear
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Result summary */}
      {lastResult && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-card border border-slate-100 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
              <FiCalendar size={19} className="text-primary-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Total Courses</p>
              <p className="text-2xl font-bold text-slate-800">{lastResult.totalCourses}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-card border border-slate-100 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-accent-50 flex items-center justify-center flex-shrink-0">
              <FiCheckCircle size={19} className="text-accent-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Scheduled</p>
              <p className="text-2xl font-bold text-accent-600">{lastResult.scheduledCount}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-card border border-slate-100 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${lastResult.unscheduledCount > 0 ? 'bg-red-50' : 'bg-slate-50'}`}>
              <FiXCircle size={19} className={lastResult.unscheduledCount > 0 ? 'text-danger' : 'text-slate-400'} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Unscheduled</p>
              <p className={`text-2xl font-bold ${lastResult.unscheduledCount > 0 ? 'text-danger' : 'text-slate-800'}`}>
                {lastResult.unscheduledCount}
              </p>
            </div>
          </div>
        </div>
      )}

      {lastResult && lastResult.unscheduledCourses?.length > 0 && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl animate-fadeIn">
          <div className="flex items-center gap-2 text-amber-800 font-semibold text-sm mb-2">
            <FiAlertTriangle size={16} />
            Could not schedule the following courses (no valid room/slot found)
          </div>
          <ul className="text-sm text-amber-800 space-y-1 ml-1">
            {lastResult.unscheduledCourses.map((c, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-amber-500" /> {c}
              </li>
            ))}
          </ul>
          <p className="text-xs text-amber-700 mt-2.5">
            Try adding more rooms with sufficient capacity, or more exam slots.
          </p>
        </div>
      )}

      {/* Filter panel */}
      <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5 mb-6">
        <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm mb-4">
          <FiFilter size={15} className="text-slate-400" /> Filter Timetable
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative">
            <FiCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={15} />
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus-ring transition-smooth"
            />
          </div>
          <div className="relative">
            <FiCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={15} />
            <input
              type="text"
              placeholder="Filter by course"
              value={filters.course}
              onChange={(e) => setFilters({ ...filters, course: e.target.value })}
              className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus-ring transition-smooth"
            />
          </div>
          <div className="relative">
            <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={15} />
            <input
              type="text"
              placeholder="Filter by room"
              value={filters.room}
              onChange={(e) => setFilters({ ...filters, room: e.target.value })}
              className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus-ring transition-smooth"
            />
          </div>
          <div className="relative">
            <FiUsers className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={15} />
            <input
              type="text"
              placeholder="Filter by branch/department"
              value={filters.branch}
              onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
              className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus-ring transition-smooth"
            />
          </div>
        </div>
        {filtersActive && (
          <div className="flex items-center gap-2 mt-3.5 flex-wrap">
            {filters.date && <FilterChip label={`Date: ${filters.date}`} onRemove={() => setFilters({ ...filters, date: '' })} />}
            {filters.course && <FilterChip label={`Course: ${filters.course}`} onRemove={() => setFilters({ ...filters, course: '' })} />}
            {filters.room && <FilterChip label={`Room: ${filters.room}`} onRemove={() => setFilters({ ...filters, room: '' })} />}
            {filters.branch && <FilterChip label={`Branch: ${filters.branch}`} onRemove={() => setFilters({ ...filters, branch: '' })} />}
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 ml-1"
            >
              <FiX size={12} /> Clear all
            </button>
          </div>
        )}
      </div>

      {/* Timetable table */}
      <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
        {loading ? (
          <Spinner label="Loading timetable..." />
        ) : schedule.length === 0 ? (
          <EmptyState
            icon={FiCalendar}
            title="No timetable generated yet"
            description="Click “Generate Timetable” above to build a conflict-free exam schedule from your current courses, rooms, and exam slots."
            action={<Button icon={FiPlay} size="sm" onClick={handleGenerate} loading={generating}>Generate Timetable</Button>}
          />
        ) : filteredSchedule.length === 0 ? (
          <EmptyState
            icon={FiFilter}
            title="No exams match the current filters"
            description="Try adjusting or clearing your filters."
            action={<Button variant="secondary" size="sm" icon={FiX} onClick={clearFilters}>Clear filters</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wide">
                <tr>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Time</th>
                  <th className="px-6 py-3.5">Course</th>
                  <th className="px-6 py-3.5">Branch / Sem</th>
                  <th className="px-6 py-3.5">Room</th>
                  <th className="px-6 py-3.5">Faculty</th>
                  <th className="px-6 py-3.5">Students</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSchedule.map((e, i) => (
                  <tr key={e.id} className={`transition-smooth hover:bg-primary-50/40 ${i % 2 === 1 ? 'bg-slate-50/40' : ''}`}>
                    <td className="px-6 py-3.5 text-sm text-slate-600 whitespace-nowrap">
                      <span className="flex items-center gap-2">
                        <FiCalendar size={13} className="text-slate-400" /> {e.examDate}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-slate-600 whitespace-nowrap">
                      <span className="flex items-center gap-2">
                        <FiClock size={13} className="text-slate-400" /> {e.startTime}–{e.endTime}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <p className="text-sm font-medium text-slate-800">{e.courseCode}</p>
                      <p className="text-xs text-slate-400">{e.courseName}</p>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <Badge>{e.branch}</Badge>
                        <span className="text-xs text-slate-400">Sem {e.semester}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-slate-600">
                      <span className="flex items-center gap-2">
                        <FiMapPin size={13} className="text-slate-400" /> {e.roomNumber}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-slate-600">
                      <span className="flex items-center gap-2">
                        <FiUserCheck size={13} className="text-slate-400" /> {e.facultyName || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-sm font-medium text-slate-700">{e.studentCount}</td>
                    <td className="px-6 py-3.5">
                      {e.manuallyModified ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                          Manually Modified
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent-50 text-accent-700 border border-accent-100">
                          Auto Generated
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => setEditTarget(e)}
                        className="p-2 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-smooth"
                        title="Edit this exam"
                      >
                        <FiEdit2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmClear}
        title="Clear timetable?"
        message="This will remove every scheduled exam from the current timetable. You can always regenerate it."
        onConfirm={handleClear}
        onCancel={() => setConfirmClear(false)}
      />

      <EditTimetableModal
        exam={editTarget}
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        onSaved={handleExamSaved}
      />
    </div>
  );
}

function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-medium">
      {label}
      <button onClick={onRemove} className="hover:text-primary-900">
        <FiX size={11} />
      </button>
    </span>
  );
}
