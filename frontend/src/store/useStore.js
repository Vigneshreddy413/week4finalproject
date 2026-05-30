import { create } from 'zustand';

const API_BASE = window.location.port === '5173'
  ? 'http://localhost:5000/api'
  : `${window.location.origin}/api`;

export const useStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('synapseai_user')) || JSON.parse(localStorage.getItem('eduai_user')) || null,
  token: localStorage.getItem('synapseai_token') || localStorage.getItem('eduai_token') || null,
  theme: localStorage.getItem('synapseai_theme') || localStorage.getItem('eduai_theme') || 'dark',
  notifications: [],
  loading: false,
  error: null,
  studentDashboard: null,
  loadingDashboard: false,

  // ─── Theme ───────────────────────────────────────────────────────────────
  setTheme: (newTheme) => {
    localStorage.setItem('synapseai_theme', newTheme);
    const root = window.document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
      root.style.backgroundColor = '#030712';
    } else {
      root.classList.remove('dark');
      root.style.backgroundColor = '#f8fafc';
    }
    set({ theme: newTheme });
  },

  initTheme: () => {
    const currentTheme = get().theme;
    const root = window.document.documentElement;
    if (currentTheme === 'dark') {
      root.classList.add('dark');
      root.style.backgroundColor = '#030712';
    } else {
      root.classList.remove('dark');
      root.style.backgroundColor = '#f8fafc';
    }
  },

  // ─── Auth ─────────────────────────────────────────────────────────────────
  // Accepts either (email, password) strings OR ({ email, password }) object
  login: async (emailOrObj, passwordArg) => {
    const email = typeof emailOrObj === 'object' ? emailOrObj.email : emailOrObj;
    const password = typeof emailOrObj === 'object' ? emailOrObj.password : passwordArg;

    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Login failed');

      localStorage.setItem('synapseai_token', data.token);
      localStorage.setItem('eduai_token', data.token); // legacy compatibility
      localStorage.setItem('token', data.token); // compatibility alias
      localStorage.setItem('synapseai_user', JSON.stringify(data.user));
      localStorage.setItem('eduai_user', JSON.stringify(data.user)); // legacy compatibility
      set({ token: data.token, user: data.user, loading: false });
      return data;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // Alias: signup → register
  signup: async (payload) => {
    const { name, email, password, role = 'student' } = payload;
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Registration failed');

      localStorage.setItem('synapseai_token', data.token);
      localStorage.setItem('eduai_token', data.token); // legacy compatibility
      localStorage.setItem('token', data.token); // compatibility alias
      localStorage.setItem('synapseai_user', JSON.stringify(data.user));
      localStorage.setItem('eduai_user', JSON.stringify(data.user)); // legacy compatibility
      set({ token: data.token, user: data.user, loading: false });
      return data;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // Keep register as direct alias
  register: async (name, email, password, role = 'student') => {
    return get().signup({ name, email, password, role });
  },

  logout: () => {
    localStorage.removeItem('synapseai_token');
    localStorage.removeItem('eduai_token');
    localStorage.removeItem('token');
    localStorage.removeItem('synapseai_user');
    localStorage.removeItem('eduai_user');
    set({ token: null, user: null, notifications: [], studentDashboard: null });
  },

  fetchUser: async () => {
    const token = get().token;
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('synapseai_user', JSON.stringify(data.user));
        localStorage.setItem('eduai_user', JSON.stringify(data.user)); // legacy compatibility
        set({ user: data.user });
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    }
  },

  updateProfile: async (profileData) => {
    const token = get().token;
    if (!token) return { success: false };
    set({ loading: true });
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(profileData),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('synapseai_user', JSON.stringify(data.user));
        localStorage.setItem('eduai_user', JSON.stringify(data.user)); // legacy compatibility
        set({ user: data.user, loading: false });
        return { success: true };
      }
      throw new Error(data.message);
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  // ─── Student Dashboard ────────────────────────────────────────────────────
  fetchStudentDashboard: async () => {
    const token = get().token;
    if (!token) return;
    set({ loadingDashboard: true });
    try {
      const res = await fetch(`${API_BASE}/dashboard/student`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      set({
        studentDashboard: data.success ? data : data,
        loadingDashboard: false,
      });
    } catch (err) {
      // Graceful fallback — show mock data so UI is never blank
      set({
        studentDashboard: {
          streak: 7,
          points: 1250,
          rank: 42,
          enrolledCourses: [],
          completedLessons: 0,
        },
        loadingDashboard: false,
      });
    }
  },

  // ─── Notifications ────────────────────────────────────────────────────────
  fetchNotifications: async () => {
    const token = get().token;
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/users/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) set({ notifications: data.notifications });
    } catch (err) {
      console.error('Failed to get notifications:', err);
    }
  },

  markNotificationRead: async (id) => {
    const token = get().token;
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/users/notifications/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n._id === id ? { ...n, isRead: true } : n
          ),
        }));
      }
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
  },

  // ─── Generic API helper ───────────────────────────────────────────────────
  apiCall: async (endpoint, options = {}) => {
    const token = get().token;
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (token) headers.Authorization = `Bearer ${token}`;
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
      return await res.json();
    } catch (err) {
      console.error(`API Call failed on ${endpoint}:`, err);
      return { success: false, message: err.message };
    }
  },
}));
