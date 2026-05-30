import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Bell, Sun, Moon, LogOut, User as UserIcon, BookOpen, Terminal, Shield, Menu, X, Award, Brain } from 'lucide-react';

export default function Navbar() {
  const { user, token, theme, setTheme, logout, notifications, fetchNotifications, markNotificationRead } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    if (token) {
      fetchNotifications();
      // Poll notifications every 30 seconds for dynamic live updates
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
    setProfileOpen(false);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getDashboardLink = () => {
    if (!user) return '/auth';
    if (user.role === 'instructor') return '/dashboard/instructor';
    if (user.role === 'admin') return '/admin';
    return '/dashboard/student';
  };

  const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'Smart Tools', path: '/smart-tools' },
    { title: 'Dashboard', path: getDashboardLink(), auth: true },
    { title: 'Playground', path: '/challenges', auth: true },
  ];

  return (
    <nav className="sticky top-0 z-50 glass dark:bg-slate-950/65 bg-white/70 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 animate-pulse">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="font-display font-extrabold text-2xl tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                SynapseAI
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-6 items-center">
            {navLinks.map((link) => {
              if (link.auth && !token) return null;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-indigo-400 dark:text-indigo-400 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  {link.title}
                </Link>
              );
            })}
          </div>

          {/* Right Action Items */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 transition-colors duration-200"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {token ? (
              <>
                {/* Notifications Panel */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotificationsOpen(!notificationsOpen);
                      setProfileOpen(false);
                    }}
                    className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 transition-colors duration-200"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown Card */}
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 rounded-xl shadow-xl glass bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-2">
                      <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                        <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-medium">
                            {unreadCount} New
                          </span>
                        )}
                      </div>
                      
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
                            All caught up! No notifications.
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n._id}
                              onClick={() => markNotificationRead(n._id)}
                              className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer border-b border-slate-100 dark:border-slate-800/30 transition-colors ${
                                !n.isRead ? 'bg-indigo-500/5 dark:bg-indigo-500/5' : ''
                              }`}
                            >
                              <div className="flex justify-between items-start mb-0.5">
                                <h4 className={`text-xs font-semibold ${!n.isRead ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                  {n.title}
                                </h4>
                                <span className="text-[9px] text-slate-400">
                                  {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                                {n.message}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setProfileOpen(!profileOpen);
                      setNotificationsOpen(false);
                    }}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md border border-indigo-400">
                      {user?.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="h-full w-full rounded-full object-cover" />
                      ) : (
                        user?.name.charAt(0)
                      )}
                    </div>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl glass bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-1">
                      <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user?.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role} Profile</p>
                      </div>
                      
                      <Link
                        to={getDashboardLink()}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50"
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        My Dashboard
                      </Link>

                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50"
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Admin Panel
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/auth"
                className="inline-flex items-center px-4 py-1.5 border border-transparent text-sm font-semibold rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 focus:outline-none"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 transition-colors"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden glass bg-white dark:bg-slate-950 px-2 pt-2 pb-4 space-y-1 sm:px-3 border-t border-slate-200 dark:border-slate-800">
          {navLinks.map((link) => {
            if (link.auth && !token) return null;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
              >
                {link.title}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
