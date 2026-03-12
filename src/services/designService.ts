/**
 * Design Service
 * API calls for AI-powered design generation using Claude LLM
 * Backend: Flask with Anthropic Claude for intelligent design recommendations
 */

import { get, post, put, deleteRequest } from './api';

export interface DesignRequest {
  style: string;
  room: string;
  budget: string;
  width?: number;
  height?: number;
  features?: string[];
}

export interface DesignResponse {
  id: string;
  style: string;
  room: string;
  budget: string;
  colors: string[];
  materials: string[];
  furniture: string[];
  layout?: string;
  recommendations?: string[];
  createdAt: string;
}

export interface DesignRecommendation {
  category: string;
  items: Array<{
    name: string;
    description: string;
    price?: number;
    image?: string;
  }>;
}

/**
 * Generate AI design based on preferences
 */
export async function generateDesign(request: DesignRequest) {
  return post<DesignResponse>('/api/designs/generate', request);
}

/**
 * Get design by ID
 */
export async function getDesign(designId: string) {
  return get<DesignResponse>(`/api/designs/${designId}`);
}

/**
 * Get all user designs
 */
export async function getUserDesigns() {
  return get<DesignResponse[]>('/api/designs');
}

/**
 * Update design
 */
export async function updateDesign(
  designId: string,
  updates: Partial<DesignRequest>
) {
  return put<DesignResponse>(`/api/designs/${designId}`, updates);
}

/**
 * Delete design
 */
export async function deleteDesign(designId: string) {
  return deleteRequest(`/api/designs/${designId}`);
}

/**
 * Get furniture recommendations for a design
 */
export async function getFurnitureRecommendations(designId: string) {
  return get<DesignRecommendation[]>(`/api/designs/${designId}/recommendations`);
}

/**
 * Export design as PDF
 */
export async function exportDesignPDF(designId: string) {
  return get<Blob>(`/api/designs/${designId}/export/pdf`);
}

/**
 * Share design
 */
export async function shareDesign(designId: string) {
  return post<{ shareUrl: string }>(`/api/designs/${designId}/share`);
}

/**
 * Get design styles
 */
export async function getDesignStyles() {
  return get<Array<{
    name: string;
    description: string;
    colors: string[];
    materials: string[];
  }>>('/api/designs/styles');
}

export default {
  generateDesign,
  getDesign,
  getUserDesigns,
  updateDesign,
  deleteDesign,
  getFurnitureRecommendations,
  exportDesignPDF,
  shareDesign,
  getDesignStyles,
};
