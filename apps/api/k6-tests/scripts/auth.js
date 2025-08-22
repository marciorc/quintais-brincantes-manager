
import http from 'k6/http';
import { check, env } from 'k6';

export const BASE_URL = 'http://localhost:3001';
export const API_BASE = `${BASE_URL}/api`;

export function getAuthToken() {
  const loginPayload = JSON.stringify({
    usuario: 'superuser',
    senha: __ENV.SUPERUSER_PASSWORD
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: '30s'
  };

  try {
    const loginRes = http.post(`${API_BASE}/admins/authenticate`, loginPayload, params);
    
    check(loginRes, {
      'login successful': (r) => r.status === 200,
    });

    if (loginRes.status === 200) {
      const authData = loginRes.json();
      return authData.data.token;
    }
  } catch (error) {
    console.error('Erro no login:', error);
  }
  
  return null;
}

export function getAuthHeaders(token) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}