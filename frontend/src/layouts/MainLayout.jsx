import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  FiMenu, FiLogOut, FiHome, FiUsers, FiUserCheck, FiBook,
  FiGrid, FiClock, FiCalendar, FiChevronLeft, FiChevronRight,
} from 'react-icons/fi';

const NAV_SECTIONS = [
  {
    title: 'Overview',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: FiHome },
    ],
  },
  {
    title: 'Records',
    items: [
      { to: '/students', label: 'Students', icon: FiUsers },
      { to: '/faculty', label: 'Faculty', icon: FiUserCheck },
      { to: '/courses', label: 'Courses', icon: FiBook },
      { to: '/rooms', label: 'Rooms', icon: FiGrid },
    ],
  },
  {
    title: 'Scheduling',
    items: [
      { to: '/exam-slots', label: 'Exam Slots', icon: FiClock },
      { to: '/timetable', label: 'Timetable', icon: FiCalendar },
    ],
  },
];

export default function MainLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, admin } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = (admin?.fullName || 'Admin')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="flex h-screen bg-surface">
      {/* Sidebar */}
      <aside
        className={`${collapsed ? 'w-[76px]' : 'w-64'} flex-shrink-0 bg-slate-900 text-white
          transition-smooth flex flex-col relative`}
      >
        {/* Logo / brand */}
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-white/10 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 3L2 8l10 5 10-5-10-5z" fill="white" />
              <path d="M5 11.5v4.5c0 1.5 3 3.5 7 3.5s7-2 7-3.5v-4.5" stroke="white" strokeWidth="1.6" fill="none" />
            </svg>
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5">
                <p className="font-semibold text-sm leading-tight tracking-tight whitespace-nowrap">UniSched</p>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/50 leading-none">v1.0</span>
              </div>
              <p className="text-[11px] text-white/40 leading-tight whitespace-nowrap">University Examination Management</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-6">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              {!collapsed && (
                <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/30">
                  {section.title}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = location.pathname === item.to;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      title={collapsed ? item.label : undefined}
                      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                        transition-smooth group
                        ${active ? 'bg-white/10 text-white' : 'text-white/55 hover:text-white hover:bg-white/5'}`}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full bg-primary-400" />
                      )}
                      <Icon size={17} className="flex-shrink-0" />
                      {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-[3.7rem] w-6 h-6 rounded-full bg-slate-800 border border-white/10
            flex items-center justify-center text-white/60 hover:text-white hover:bg-slate-700 transition-smooth"
        >
          {collapsed ? <FiChevronRight size={13} /> : <FiChevronLeft size={13} />}
        </button>

        {/* User profile card */}
        <div className="border-t border-white/10 p-3 flex-shrink-0">
          <div className={`flex items-center gap-2.5 rounded-lg p-2 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500
              flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
              {initials}
            </div>
            {!collapsed && (
              <div className="flex-1 overflow-hidden min-w-0">
                <p className="text-sm font-medium text-white truncate">{admin?.fullName || 'Admin'}</p>
                <p className="text-[11px] text-white/40 truncate">{admin?.email || ''}</p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={handleLogout}
                title="Logout"
                className="text-white/40 hover:text-danger transition-smooth flex-shrink-0 p-1.5 rounded-md hover:bg-white/5"
              >
                <FiLogOut size={16} />
              </button>
            )}
          </div>
          {collapsed && (
            <button
              onClick={handleLogout}
              title="Logout"
              className="w-full mt-1 flex items-center justify-center text-white/40 hover:text-danger
                transition-smooth p-1.5 rounded-md hover:bg-white/5"
            >
              <FiLogOut size={16} />
            </button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/70 flex items-center
          justify-between px-6 flex-shrink-0">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="lg:hidden text-slate-500 hover:text-slate-700 transition-smooth"
          >
            <FiMenu size={20} />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-700 leading-tight">{admin?.fullName || 'Admin'}</p>
              <p className="text-xs text-slate-400 leading-tight">{admin?.email}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500
              flex items-center justify-center text-white text-xs font-semibold">
              {initials}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
