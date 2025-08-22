import { check, sleep } from 'k6';
import http from 'k6/http';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { API_BASE, getAuthToken, getAuthHeaders } from './auth.js';

// Configuração do teste de carga
export const options = {
  stages: [
    { duration: '1m', target: 10 }, // Rampa para 10 usuários em 1 minuto
    { duration: '3m', target: 10 }, // Mantém 10 usuários por 3 minutos
    { duration: '1m', target: 20 }, // Aumenta para 20 usuários
    { duration: '3m', target: 20 }, // Mantém 20 usuários
    { duration: '1m', target: 0 },  // Rampa down para 0 usuários
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% das requests <1s
    http_req_failed: ['rate<0.05'],    // Menos de 5% de falhas
  },
};

// Token de autenticação
let authToken;

export function setup() {
  authToken = getAuthToken();
  return { authToken };
}

export default function (data) {
  const headers = getAuthHeaders(data.authToken);

  // Lista de endpoints para testar
  const endpoints = [
    `${API_BASE}/admins`,
    `${API_BASE}/responsaveis`,
    `${API_BASE}/criancas`,
    `${API_BASE}/turmas`,
    `${API_BASE}/admins/dashboard`,
    `${API_BASE}/responsaveis/statistics`,
  ];

  // Seleciona um endpoint aleatório
  const randomEndpoint = endpoints[randomIntBetween(0, endpoints.length - 1)];
  
  const response = http.get(randomEndpoint, { headers });
  
  check(response, {
    [`${randomEndpoint} status 200`]: (r) => r.status === 200,
  });

  sleep(randomIntBetween(1, 3)); // Pausa aleatória entre 1-3 segundos
}