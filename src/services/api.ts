/**
 * API Service - Connected to Agentic AI Flask Backend
 * Centralized backend API client with automatic error handling and configuration
 * Backend: Flask with Claude AI, Computer Vision, and Agentic AI
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 30000;

interface FetchOptions extends RequestInit {
  timeout?: number;
  skipErrorHandling?: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

/**
 * Fetch wrapper with timeout and error handling
 */
async function fetchWithTimeout(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const timeout = options.timeout || API_TIMEOUT;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const isFormData =
      typeof FormData !== 'undefined' && options.body instanceof FormData;

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(options.headers || {}),
      },
    });

    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Generic API request handler
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetchWithTimeout(url, {
      method: 'GET',
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText} (${response.status})`);
    }

    const contentType = response.headers.get('content-type') || '';
    let data: any;
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // Support file downloads and non-JSON responses (Blob/text)
      data = await response.blob();
    }

    return {
      success: true,
      data: data as T,
      statusCode: response.status,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';

    console.error(`API Request failed: ${endpoint}`, error);

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * GET request
 */
export function get<T = any>(endpoint: string, options?: FetchOptions) {
  return apiRequest<T>(endpoint, { ...options, method: 'GET' });
}

/**
 * POST request
 */
export function post<T = any>(
  endpoint: string,
  data?: any,
  options?: FetchOptions
) {
  const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'POST',
    body: data ? (isFormData ? data : JSON.stringify(data)) : undefined,
  });
}

/**
 * PUT request
 */
export function put<T = any>(
  endpoint: string,
  data?: any,
  options?: FetchOptions
) {
  const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: data ? (isFormData ? data : JSON.stringify(data)) : undefined,
  });
}

/**
 * DELETE request
 */
export function deleteRequest<T = any>(endpoint: string, options?: FetchOptions) {
  return apiRequest<T>(endpoint, { ...options, method: 'DELETE' });
}

/**
 * PATCH request
 */
export function patch<T = any>(
  endpoint: string,
  data?: any,
  options?: FetchOptions
) {
  const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'PATCH',
    body: data ? (isFormData ? data : JSON.stringify(data)) : undefined,
  });
}

/**
 * Backend Health Check
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      timeout: 5000,
    });
    return response.ok;
  } catch {
    return false;
  }
}

export default {
  apiRequest,
  get,
  post,
  put,
  patch,
  deleteRequest,
  checkBackendHealth,
};
