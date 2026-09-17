import { apiRequest } from './api';
import type { DashboardSummary } from '@/types';

export function fetchDashboardSummary(): Promise<DashboardSummary> {
  return apiRequest('/dashboard/summary');
}
