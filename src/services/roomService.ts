/**
 * Room Analyzer Service
 * API calls for room analysis using Computer Vision (OpenCV)
 * Backend: Flask with advanced CV algorithms for dimension/lighting detection
 */

import { post, get } from './api';

export interface RoomAnalysisRequest {
  image: File | Blob;
  roomType?: string;
  detectDimensions?: boolean;
  detectLighting?: boolean;
}

export interface RoomAnalysisResponse {
  id: string;
  roomType: string;
  dimensions?: {
    width: number;
    height: number;
    length: number;
    unit: string;
  };
  lighting: {
    type: string;
    level: 'low' | 'medium' | 'high';
    windows: number;
  };
  features: {
    doors: number;
    windows: number;
    walls: string[];
    flooring: string;
  };
  colors: {
    dominant: string[];
    accent: string[];
  };
  recommendations: string[];
  confidence: number;
  imageUrl?: string;
  createdAt: string;
}

/**
 * Analyze a room image
 */
export async function analyzeRoomImage(request: RoomAnalysisRequest) {
  const formData = new FormData();
  formData.append('image', request.image);
  if (request.roomType) formData.append('roomType', request.roomType);
  if (request.detectDimensions !== undefined)
    formData.append('detectDimensions', String(request.detectDimensions));
  if (request.detectLighting !== undefined)
    formData.append('detectLighting', String(request.detectLighting));

  return post<RoomAnalysisResponse>('/api/rooms/analyze', formData);
}

/**
 * Get room analysis by ID
 */
export async function getRoomAnalysis(analysisId: string) {
  return get<RoomAnalysisResponse>(`/api/rooms/analyze/${analysisId}`);
}

/**
 * Get all room analyses for user
 */
export async function getUserRoomAnalyses() {
  return get<RoomAnalysisResponse[]>('/api/rooms/analyze');
}

/**
 * Get room suggestions based on analysis
 */
export async function getRoomSuggestions(analysisId: string) {
  return get<{
    furniture: string[];
    colors: string[];
    layout: string[];
    materials: string[];
  }>(`/api/rooms/${analysisId}/suggestions`);
}

/**
 * Detect room dimensions from image
 */
export async function detectDimensions(image: File | Blob) {
  const formData = new FormData();
  formData.append('image', image);
  return post<{
    width: number;
    height: number;
    length: number;
    unit: string;
    confidence: number;
  }>('/api/rooms/detect-dimensions', formData);
}

/**
 * Detect lighting conditions
 */
export async function detectLighting(imagePath: string) {
  return post<{
    type: string;
    level: 'low' | 'medium' | 'high';
    windows: number;
  }>('/api/rooms/detect-lighting', { imagePath });
}

export default {
  analyzeRoomImage,
  getRoomAnalysis,
  getUserRoomAnalyses,
  getRoomSuggestions,
  detectDimensions,
  detectLighting,
};
