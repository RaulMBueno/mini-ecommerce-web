import api from '../api';

/**
 * Lista pré-cadastros de interesse (admin — requer JWT).
 * GET /interest-signups
 */
export async function fetchInterestSignups() {
  const { data } = await api.get('/interest-signups');
  return Array.isArray(data) ? data : [];
}
