import http from 'k6/http';
import { check, sleep } from 'k6';
import { getAuthToken, getAuthHeaders, BASE_URL, API_BASE } from './auth.js';

// Configuração do teste
export const options = {
  vus: 1,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

// Setup executado uma vez antes do teste
export function setup() {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Falha na autenticação');
  }
  return { authToken: token };
}

// Função principal executada por cada VU
export default function (data) {
  const headers = getAuthHeaders(data.authToken);

  // 1. Health Check
  const healthCheck = http.get(`${BASE_URL}/health`);
  check(healthCheck, {
    'health check status 200': (r) => r.status === 200,
  });

  // 2. Listar administradores
  const admins = http.get(`${API_BASE}/admins`, { headers });
  check(admins, {
    'admins list status 200': (r) => r.status === 200,
  });

  // 3. Listar responsáveis
  const responsaveis = http.get(`${API_BASE}/responsaveis`, { headers });
  check(responsaveis, {
    'responsaveis list status 200': (r) => r.status === 200,
  });

  sleep(1);
}