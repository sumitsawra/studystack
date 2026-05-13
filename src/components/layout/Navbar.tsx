// ========================================
// Navbar Component
// ========================================
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Menu, X, Sun, Moon, Monitor, Upload, User,
  LogOut, BookOpen, LayoutDashboard, Shield, ChevronDown,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { Avatar } from '@/components/ui/Elements';
import { cn } from '@/lib/utils';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut, loginAsDemo } = useAuthStore();
  const { theme, setTheme, isMobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/browse', label: 'Browse' },
    { path: '/upload', label: 'Upload', auth: true },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const themeIcon = theme === 'dark' ? <Moon className="w-4 h-4" /> :
    theme === 'light' ? <Sun className="w-4 h-4" /> : <Monitor className="w-4 h-4" />;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-themed">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[#64D2FF] flex items-center justify-center">
              <BookOpen className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-lg font-bold text-primary hidden sm:block">
              Study<span className="text-accent">Stack</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              if (link.auth && !isAuthenticated) return null;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'text-accent accent-light-bg'
                      : 'text-secondary hover:text-primary hover:bg-[var(--color-bg-tertiary)]'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Search + Actions */}
          <div className="flex items-center gap-2">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden lg:block relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary" />
              <input
                type="text"
                placeholder="Search papers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-56 pl-9 pr-4 py-2 text-sm card-bg border border-themed rounded-xl text-primary placeholder:text-tertiary focus:w-72 transition-all duration-300"
              />
            </form>

            {/* Theme Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="p-2.5 rounded-xl text-secondary hover:text-primary hover:bg-[var(--color-bg-tertiary)] transition-colors"
              >
                {themeIcon}
              </button>
              <AnimatePresence>
                {showThemeMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-40 card-bg rounded-xl border border-themed shadow-lg overflow-hidden"
                  >
                    {[
                      { value: 'light' as const, icon: <Sun className="w-4 h-4" />, label: 'Light' },
                      { value: 'dark' as const, icon: <Moon className="w-4 h-4" />, label: 'Dark' },
                      { value: 'system' as const, icon: <Monitor className="w-4 h-4" />, label: 'System' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setTheme(opt.value); setShowThemeMenu(false); }}
                        className={cn(
                          'w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors',
                          theme === opt.value
                            ? 'text-accent accent-light-bg'
                            : 'text-secondary hover:text-primary hover:bg-[var(--color-bg-tertiary)]'
                        )}
                      >
                        {opt.icon}
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Auth Area */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[var(--color-bg-tertiary)] transition-colors"
                >
                  <Avatar src={user.avatar} name={user.name} size="sm" />
                  <span className="hidden sm:block text-sm font-medium text-primary max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-tertiary hidden sm:block" />
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 card-bg rounded-xl border border-themed shadow-lg overflow-hidden"
                    >
                      <div className="p-3 border-b border-themed">
                        <p className="text-sm font-medium text-primary">{user.name}</p>
                        <p className="text-xs text-tertiary">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-secondary hover:text-primary hover:bg-[var(--color-bg-tertiary)] transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <Link
                          to="/upload"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-secondary hover:text-primary hover:bg-[var(--color-bg-tertiary)] transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          Upload Paper
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-secondary hover:text-primary hover:bg-[var(--color-bg-tertiary)] transition-colors"
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </Link>
                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-secondary hover:text-primary hover:bg-[var(--color-bg-tertiary)] transition-colors"
                          >
                            <Shield className="w-4 h-4" />
                            Admin Panel
                          </Link>
                        )}
                      </div>
                      <div className="border-t border-themed py-1">
                        <button
                          onClick={() => { signOut(); setShowUserMenu(false); }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--color-error)] hover:bg-[var(--color-error)]/5 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={loginAsDemo}
                  className="hidden sm:block px-4 py-2 text-sm font-medium text-secondary hover:text-primary transition-colors"
                >
                  Try Demo
                </button>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium bg-accent text-white rounded-xl hover:opacity-90 transition-opacity"
                >
                  Sign In
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-secondary hover:text-primary hover:bg-[var(--color-bg-tertiary)] transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-themed"
          >
            <div className="p-4 space-y-2">
              <form onSubmit={handleSearch} className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary" />
                <input
                  type="text"
                  placeholder="Search papers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm card-bg border border-themed rounded-xl text-primary placeholder:text-tertiary"
                />
              </form>
              {navLinks.map((link) => {
                if (link.auth && !isAuthenticated) return null;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                      location.pathname === link.path
                        ? 'text-accent accent-light-bg'
                        : 'text-secondary hover:text-primary'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
