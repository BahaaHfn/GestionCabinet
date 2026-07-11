import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  CalendarRange, 
  FileText, 
  LogOut, 
  Lock,
  Menu,
  X
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  if (!user) return null;

  const links = [
    {path: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'DOCTOR', 'PATIENT', 'RECEPTIONIST'] },
    { path: '/appointments', label: 'Appointments', icon: CalendarRange, roles: ['ADMIN', 'DOCTOR', 'PATIENT', 'RECEPTIONIST'] },
    { path: '/patients', label: 'Patients', icon: Users, roles: ['ADMIN', 'DOCTOR', 'RECEPTIONIST'] },
    { path: '/doctors', label: 'Doctors', icon: Stethoscope, roles: ['ADMIN'] },
  ];

  // If the user is a patient, they might also access their Medical File directly. Let's add that.
  if (user.role === 'PATIENT') {
    links.push({ path: `/medical-file/${user.targetId}`, label: 'My Medical File', icon: FileText, roles: ['PATIENT'] });
  }

  const activeClass = 'bg-sky-600 text-white flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium';
  const inactiveClass = 'text-slate-700 hover:bg-slate-100 flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors';

  const mobileActiveLink = 'bg-sky-600 text-white flex items-center gap-2 px-4 py-3 rounded-lg text-base font-semibold';
  const mobileInactiveLink = 'text-slate-700 hover:bg-slate-100 flex items-center gap-2 px-4 py-3 rounded-lg text-base font-semibold transition-colors';

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="p-2 bg-sky-500 text-white rounded-lg shadow-md shadow-sky-200">
                <Stethoscope size={20} />
              </div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">SmartCare</span>
            </div>
            {/* Desktop Links */}
            <div className="hidden md:flex space-x-2">
              {links.map((link) => {
                if (link.roles.includes(user.role)) {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={isActive ? activeClass : inactiveClass}
                    >
                      <link.icon size={16} />
                      {link.label}
                    </Link>
                  );
                }
                return null;
              })}
            </div>
          </div>
          
          {/* Desktop User Info & Logout */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex flex-col text-right">
              <span className="text-sm font-semibold text-slate-800">{user.firstName} {user.lastName}</span>
              <span className="text-xs text-slate-500 capitalize">{user.role.toLowerCase()}</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="text-slate-500 hover:text-rose-600 p-2 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
              title="Logout"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>

          {/* Hamburger Menu (Mobile Toggle) */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-500 hover:text-slate-800 p-2 hover:bg-slate-100 rounded-lg outline-none transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Links Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-2 shadow-inner">
          <div className="pb-3 border-b border-slate-100 mb-2 px-2 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800">{user.firstName} {user.lastName}</span>
              <span className="text-xs font-medium text-slate-400 capitalize">{user.role.toLowerCase()}</span>
            </div>
          </div>
          
          {links.map((link) => {
            if (link.roles.includes(user.role)) {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={isActive ? mobileActiveLink : mobileInactiveLink}
                >
                  <link.icon size={18} />
                  {link.label}
                </Link>
              );
            }
            return null;
          })}
          
          <button
            onClick={handleLogout}
            className="w-full text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 px-4 py-3 rounded-lg text-base font-semibold transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};
