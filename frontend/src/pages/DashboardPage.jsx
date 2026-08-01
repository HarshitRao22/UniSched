import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { studentService } from '../services/studentService';
import { facultyService } from '../services/facultyService';
import { courseService } from '../services/courseService';
import { roomService } from '../services/roomService';
import { schedulingService } from '../services/schedulingService';
import { Badge, Spinner } from '../components/ui';
import {
  FiUsers, FiUserCheck, FiBook, FiGrid, FiCalendar,
  FiUserPlus, FiPlay, FiDownload, FiActivity, FiCheckCircle,
  FiArrowRight, FiClock,
} from 'react-icons/fi';

const STAT_CARDS = [
  { key: 'students', title: 'Total Students', icon: FiUsers, iconBg: 'bg-primary-50', iconColor: 'text-primary-600', trend: 'Across all departments' },
  { key: 'faculty', title: 'Total Faculty', icon: FiUserCheck, iconBg: 'bg-accent-50', iconColor: 'text-accent-600', trend: 'Active members' },
  { key: 'courses', title: 'Total Courses', icon: FiBook, iconBg: 'bg-violet-50', iconColor: 'text-violet-600', trend: 'Offered this term' },
  { key: 'rooms', title: 'Total Rooms', icon: FiGrid, iconBg: 'bg-amber-50', iconColor: 'text-amber-600', trend: 'Available for exams' },
  { key: 'scheduledExams', title: 'Scheduled Exams', icon: FiCalendar, iconBg: 'bg-rose-50', iconColor: 'text-rose-600', trend: 'In current timetable' },
];

const QUICK_ACTIONS = [
  { to: '/students', label: 'Add Student', icon: FiUserPlus, color: 'text-primary-600 bg-primary-50' },
  { to: '/faculty', label: 'Add Faculty', icon: FiUserCheck, color: 'text-accent-600 bg-accent-50' },
  { to: '/timetable', label: 'Generate Timetable', icon: FiPlay, color: 'text-violet-600 bg-violet-50' },
  { to: '/timetable', label: 'Export PDF', icon: FiDownload, color: 'text-rose-600 bg-rose-50' },
];

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function DashboardPage() {
  const { admin } = useAuthStore();
  const [counts, setCounts] = useState({});
  const [recentStudents, setRecentStudents] = useState([]);
  const [recentSchedule, setRecentSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError('');
      try {
        const [students, faculty, courses, rooms, scheduledExams, schedule] = await Promise.all([
          studentService.getAll(),
          facultyService.getCount(),
          courseService.getCount(),
          roomService.getCount(),
          schedulingService.getCount(),
          schedulingService.getSchedule(),
        ]);

        setCounts({
          students: students.length,
          faculty,
          courses,
          rooms,
          scheduledExams,
        });

        setRecentStudents([...students].reverse().slice(0, 4));
        setRecentSchedule(schedule.slice(0, 5));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) {
    return <div className="p-8"><Spinner label="Loading dashboard..." /></div>;
  }

  return (
    <div className="p-8 max-w-[1400px]">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Welcome back, {(admin?.fullName || 'Admin').split(' ')[0]}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Here's what's happening across your exam scheduling system today.
        </p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-100 text-danger rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.key}
              className="group bg-white rounded-2xl p-5 shadow-card hover:shadow-elevated hover:-translate-y-0.5 transition-smooth border border-slate-100"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{card.title}</p>
                  <p className="text-3xl font-bold text-slate-800 mt-2 tracking-tight">
                    {counts[card.key] ?? 0}
                  </p>
                  <p className="text-xs text-slate-400 mt-2">{card.trend}</p>
                </div>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.iconBg} group-hover:scale-105 transition-smooth`}>
                  <Icon size={20} className={card.iconColor} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Scheduled Exams */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800">Recent Scheduled Exams</h3>
            <Link to="/timetable" className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View all <FiArrowRight size={12} />
            </Link>
          </div>
          {recentSchedule.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-slate-400">No timetable generated yet.</p>
              <Link to="/timetable" className="text-sm text-primary-600 font-medium hover:underline mt-1 inline-block">
                Generate one now →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentSchedule.map((exam) => (
                <div key={exam.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/70 transition-smooth">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                      <FiCalendar size={15} className="text-primary-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">
                        {exam.courseCode} — {exam.courseName}
                      </p>
                      <p className="text-xs text-slate-400">
                        {exam.examDate} · {exam.startTime}–{exam.endTime} · Room {exam.roomNumber}
                      </p>
                    </div>
                  </div>
                  <Badge>{exam.branch}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column: Quick Actions + System Status */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.label}
                    to={action.to}
                    className="flex flex-col items-start gap-2 p-3 rounded-xl border border-slate-100
                      hover:border-slate-200 hover:shadow-soft transition-smooth"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${action.color}`}>
                      <Icon size={15} />
                    </div>
                    <span className="text-xs font-medium text-slate-600 leading-tight">{action.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-2">
                  <FiCheckCircle size={14} className="text-accent-500" /> API
                </span>
                <span className="text-xs font-medium text-accent-600">Operational</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-2">
                  <FiCheckCircle size={14} className="text-accent-500" /> Database
                </span>
                <span className="text-xs font-medium text-accent-600">Connected</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-2">
                  <FiClock size={14} className="text-slate-400" /> Last sync
                </span>
                <span className="text-xs font-medium text-slate-400">just now</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <FiActivity size={15} className="text-slate-400" /> Recent Activity
            </h3>
            {recentStudents.length === 0 ? (
              <p className="text-sm text-slate-400">No recent student records.</p>
            ) : (
              <ul className="space-y-3">
                {recentStudents.map((s) => (
                  <li key={s.id} className="flex items-center gap-3 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-500 flex-shrink-0" />
                    <span className="text-slate-600 truncate flex-1">
                      <span className="font-medium text-slate-700">{s.fullName}</span> added to {s.branch}
                    </span>
                    <span className="text-xs text-slate-400 flex-shrink-0">{timeAgo(s.createdAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
