import axios from 'axios';

const LOGIN_PATH = 'http://localhost:8080/api/auth/login';

function parseJwt(token) {
  try {
    const base64 = token.split('.')[1];
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

export async function login(email, password) {
  const res = await axios.post(LOGIN_PATH, { email, password });
  // backend may return token string or { token: '...' }
  const token = typeof res.data === 'string' ? res.data : res.data?.token || res.data;

  if (!token || typeof token !== 'string') {
    throw new Error('Invalid authentication response');
  }

  // try to extract role from JWT payload
  const payload = parseJwt(token) || {};
  const role = (payload.role || payload.roles || payload.roleName || '').toString();

  localStorage.setItem('authToken', token);
  if (role) localStorage.setItem('userRole', role);

  return { token, role };
}

export async function register(name, email, password) {
  const res = await axios.post('http://localhost:8080/api/auth/register', { name, email, password });
  const token = typeof res.data === 'string' ? res.data : res.data?.token || res.data;

  if (!token || typeof token !== 'string') {
    throw new Error('Invalid registration response');
  }

  const payload = parseJwt(token) || {};
  const role = (payload.role || payload.roles || payload.roleName || '').toString();

  localStorage.setItem('authToken', token);
  if (role) localStorage.setItem('userRole', role);

  return { token, role };
}

export function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userRole');
}

export function getToken() {
  return localStorage.getItem('authToken');
}

export function getRole() {
  const r = localStorage.getItem('userRole');
  if (r) return r;
  const token = getToken();
  const payload = token ? parseJwt(token) : null;
  return payload?.role || payload?.roles || null;
}

export function isAuthenticated() {
  return !!getToken();
}

export default { login, logout, getToken, getRole, isAuthenticated };
