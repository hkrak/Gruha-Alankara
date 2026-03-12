/**
 * AR Service
 * API calls for AR visualization, furniture placement, and interaction
 */

import { post, get } from './api';

export interface ARFurniture {
  id: string;
  name: string;
  modelUrl: string;
  scale: { x: number; y: number; z: number };
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
}

export interface ARScene {
  id: string;
  designId: string;
  furnitureList: ARFurniture[];
  roomDimensions: {
    width: number;
    height: number;
    length: number;
  };
  lightingSetup: {
    ambientLight: number;
    spotlights: Array<{
      position: { x: number; y: number; z: number };
      intensity: number;
    }>;
  };
  textures: {
    floorMaterial: string;
    wallColor: string;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Get AR models for furniture
 */
export async function getARModels(designId: string) {
  return get<ARFurniture[]>(`/api/ar/models?designId=${designId}`);
}

/**
 * Get specific AR model
 */
export async function getARModel(modelId: string) {
  return get<ARFurniture>(`/api/ar/models/${modelId}`);
}

/**
 * Create AR scene from design
 */
export async function createARScene(designId: string) {
  return post<ARScene>('/api/ar/scenes', { designId });
}

/**
 * Get AR scene
 */
export async function getARScene(sceneId: string) {
  return get<ARScene>(`/api/ar/scenes/${sceneId}`);
}

/**
 * Update furniture position in scene
 */
export async function updateFurniturePosition(
  sceneId: string,
  furnitureId: string,
  position: { x: number; y: number; z: number }
) {
  return post(`/api/ar/scenes/${sceneId}/furniture/${furnitureId}/position`, {
    position,
  });
}

/**
 * Rotate furniture in scene
 */
export async function rotateFurniture(
  sceneId: string,
  furnitureId: string,
  rotation: { x: number; y: number; z: number }
) {
  return post(`/api/ar/scenes/${sceneId}/furniture/${furnitureId}/rotation`, {
    rotation,
  });
}

/**
 * Scale furniture in scene
 */
export async function scaleFurniture(
  sceneId: string,
  furnitureId: string,
  scale: { x: number; y: number; z: number }
) {
  return post(`/api/ar/scenes/${sceneId}/furniture/${furnitureId}/scale`, {
    scale,
  });
}

/**
 * Add furniture to scene
 */
export async function addFurnitureToScene(
  sceneId: string,
  furnitureId: string,
  position?: { x: number; y: number; z: number }
) {
  return post<ARFurniture>(
    `/api/ar/scenes/${sceneId}/furniture`,
    { furnitureId, position }
  );
}

/**
 * Remove furniture from scene
 */
export async function removeFurnitureFromScene(
  sceneId: string,
  furnitureId: string
) {
  return post(`/api/ar/scenes/${sceneId}/furniture/${furnitureId}/remove`);
}

/**
 * Get furniture collision detection
 */
export async function checkCollisions(
  sceneId: string,
  furnitureId: string,
  position: { x: number; y: number; z: number }
) {
  return post<{
    hasCollision: boolean;
    collidingWith?: string[];
  }>(`/api/ar/scenes/${sceneId}/furniture/${furnitureId}/collision-check`, {
    position,
  });
}

/**
 * Generate optimal layout
 */
export async function generateOptimalLayout(sceneId: string) {
  return post<{ furniturePositions: Record<string, any> }>(
    `/api/ar/scenes/${sceneId}/optimize-layout`
  );
}

/**
 * Capture AR screenshot
 */
export async function captureARScreenshot(sceneId: string, imageData: Blob) {
  const formData = new FormData();
  formData.append('image', imageData);
  return post<{ url: string }>(
    `/api/ar/scenes/${sceneId}/screenshot`,
    formData
  );
}

/**
 * Export AR scene as 3D model
 */
export async function exportARScene(
  sceneId: string,
  format: 'gltf' | 'usdz' | 'obj'
) {
  return get<Blob>(`/api/ar/scenes/${sceneId}/export?format=${format}`);
}

/**
 * Get supported device capabilities
 */
export async function getDeviceCapabilities() {
  return post<{
    supportsAR: boolean;
    supportsWebGL: boolean;
    maxTextureSize: number;
    gpuInfo?: string;
  }>('/api/ar/device-capabilities', navigator.userAgent);
}

/**
 * Check AR support
 */
export async function checkARSupport() {
  const capabilities = await getDeviceCapabilities();
  return capabilities.success && capabilities.data?.supportsAR;
}

export default {
  getARModels,
  getARModel,
  createARScene,
  getARScene,
  updateFurniturePosition,
  rotateFurniture,
  scaleFurniture,
  addFurnitureToScene,
  removeFurnitureFromScene,
  checkCollisions,
  generateOptimalLayout,
  captureARScreenshot,
  exportARScene,
  getDeviceCapabilities,
  checkARSupport,
};
