import { check, sleep } from 'k6';
import http from 'k6/http';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { API_BASE, getAuthToken, getAuthHeaders } from './auth.js';

// Configuração do teste de stress
export const options = {
  stages: [
    { duration: '2m', target: 50 },  // Rampa para 50 usuários
    { duration: '5m', target: 50 },  // Mantém 50 usuários
    { duration: '2m', target: 100 }, // Aumenta para 100 usuários
    { duration: '5m', target: 100 }, // Mantém 100 usuários
    { duration: '2m', target: 150 }, // Aumenta para 150 usuários
    { duration: '5m', target: 150 }, // Mantém 150 usuários
    { duration: '10m', target: 0 },  // Rampa down gradual
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% das requests <2s
    http_req_failed: ['rate<0.1'],     // Menos de 10% de falhas
  },
};

let authToken;

export function setup() {
  authToken = getAuthToken();
  return { authToken };
}

export default function (data) {
  const headers = getAuthHeaders(data.authToken);

  // Operações mais pesadas para stress test
  const operations = [
    () => http.get(`${API_BASE}/admins/dashboard`, { headers }),
    () => http.get(`${API_BASE}/responsaveis?page=1&limit=50`, { headers }),
    () => http.get(`${API_BASE}/criancas?page=1&limit=50`, { headers }),
  ];

  const randomOp = operations[randomIntBetween(0, operations.length - 1)];
  const response = randomOp();
  
  check(response, {
    'operation successful': (r) => r.status === 200 || r.status === 201,
  });

  sleep(randomIntBetween(1, 2));
}