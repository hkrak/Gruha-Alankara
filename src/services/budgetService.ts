/**
 * Budget Service
 * API calls for budget planning, tracking, and analysis
 */

import { get, post, put, deleteRequest } from './api';

export interface BudgetItem {
  id: string;
  category: string;
  description: string;
  estimatedCost: number;
  actualCost?: number;
  quantity: number;
  notes?: string;
  productId?: string; // Link to catalog product
  status: 'planned' | 'ordered' | 'received' | 'installed';
}

export interface Budget {
  id: string;
  name: string;
  roomType: string;
  totalBudget: number;
  currency: string;
  items: BudgetItem[];
  categories: {
    name: string;
    allocated: number;
    spent: number;
    remaining: number;
  }[];
  createdAt: string;
  updatedAt: string;
  projectDeadline?: string;
  status: 'active' | 'completed' | 'on-hold';
}

export interface BudgetAnalysis {
  totalAllocated: number;
  totalSpent: number;
  remainingBudget: number;
  percentageUsed: number;
  categoryBreakdown: {
    category: string;
    allocated: number;
    spent: number;
    remaining: number;
    percentageUsed: number;
  }[];
  estimatedTotal: number;
  savingsTips: string[];
  overtrendItems?: string[];
}

/**
 * Create new budget
 */
export async function createBudget(budget: Omit<Budget, 'id' | 'categories'>) {
  return post<Budget>('/api/budget', budget);
}

/**
 * Get budget by ID
 */
export async function getBudget(budgetId: string) {
  return get<Budget>(`/api/budget/${budgetId}`);
}

/**
 * Get all user budgets
 */
export async function getUserBudgets() {
  return get<Budget[]>('/api/budget');
}

/**
 * Update budget
 */
export async function updateBudget(budgetId: string, updates: Partial<Budget>) {
  return put<Budget>(`/api/budget/${budgetId}`, updates);
}

/**
 * Delete budget
 */
export async function deleteBudget(budgetId: string) {
  return deleteRequest(`/api/budget/${budgetId}`);
}

/**
 * Add item to budget
 */
export async function addBudgetItem(budgetId: string, item: Omit<BudgetItem, 'id'>) {
  return post<BudgetItem>(`/api/budget/${budgetId}/items`, item);
}

/**
 * Update budget item
 */
export async function updateBudgetItem(
  budgetId: string,
  itemId: string,
  updates: Partial<BudgetItem>
) {
  return put<BudgetItem>(
    `/api/budget/${budgetId}/items/${itemId}`,
    updates
  );
}

/**
 * Remove budget item
 */
export async function removeBudgetItem(budgetId: string, itemId: string) {
  return deleteRequest(`/api/budget/${budgetId}/items/${itemId}`);
}

/**
 * Get budget analysis
 */
export async function getBudgetAnalysis(budgetId: string) {
  return get<BudgetAnalysis>(`/api/budget/${budgetId}/analysis`);
}

/**
 * Get budget comparison with similar projects
 */
export async function getBudgetComparison(budgetId: string) {
  return get<{
    yourBudget: number;
    averageBudget: number;
    minBudget: number;
    maxBudget: number;
    percentile: number;
  }>(`/api/budget/${budgetId}/comparison`);
}

/**
 * Get cost optimization recommendations
 */
export async function getCostOptimizationRecommendations(budgetId: string) {
  return get<{
    category: string;
    currentCost: number;
    recommendedCost: number;
    savings: number;
    suggestions: string[];
  }[]>(`/api/budget/${budgetId}/optimization`);
}

/**
 * Export budget as PDF
 */
export async function exportBudgetPDF(budgetId: string) {
  return get<Blob>(`/api/budget/${budgetId}/export/pdf`);
}

/**
 * Export budget as CSV
 */
export async function exportBudgetCSV(budgetId: string) {
  return get<Blob>(`/api/budget/${budgetId}/export/csv`);
}

export default {
  createBudget,
  getBudget,
  getUserBudgets,
  updateBudget,
  deleteBudget,
  addBudgetItem,
  updateBudgetItem,
  removeBudgetItem,
  getBudgetAnalysis,
  getBudgetComparison,
  getCostOptimizationRecommendations,
  exportBudgetPDF,
  exportBudgetCSV,
};
