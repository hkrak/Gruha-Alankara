/**
 * Catalog Service
 * API calls for product catalog, filtering, and recommendations
 */

import { get, post, put, deleteRequest } from './api';

export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  dimensions?: {
    width: number;
    height: number;
    depth: number;
    unit: string;
  };
  material: string;
  color: string;
  availability: boolean;
  rating: number;
  reviews: number;
  tags: string[];
  url?: string;
}

export interface CatalogFilter {
  category?: string;
  subcategory?: string;
  priceMin?: number;
  priceMax?: number;
  material?: string;
  color?: string;
  search?: string;
  inStock?: boolean;
  minRating?: number;
  sort?: 'price-asc' | 'price-desc' | 'rating' | 'newest';
  page?: number;
  limit?: number;
}

export interface CatalogResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  categories: string[];
}

/**
 * Get all products with filtering options
 */
export async function getProducts(filters: CatalogFilter) {
  const queryParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  });
  return get<CatalogResponse>(`/api/catalog/products?${queryParams.toString()}`);
}

/**
 * Get product by ID
 */
export async function getProduct(productId: string) {
  return get<Product>(`/api/catalog/products/${productId}`);
}

/**
 * Search products
 */
export async function searchProducts(
  query: string,
  filters?: Omit<CatalogFilter, 'search'>
) {
  return getProducts({ ...filters, search: query });
}

/**
 * Get product categories
 */
export async function getCategories() {
  return get<string[]>('/api/catalog/categories');
}

/**
 * Get subcategories for a category
 */
export async function getSubcategories(category: string) {
  return get<string[]>(`/api/catalog/categories/${category}/subcategories`);
}

/**
 * Get trending products
 */
export async function getTrendingProducts(limit: number = 12) {
  return get<Product[]>(`/api/catalog/trending?limit=${limit}`);
}

/**
 * Get recommended products based on design
 */
export async function getRecommendedProducts(
  designId: string,
  limit: number = 20
) {
  return get<Product[]>(
    `/api/catalog/recommendations?designId=${designId}&limit=${limit}`
  );
}

/**
 * Save product to wishlist
 */
export async function saveToWishlist(productId: string) {
  return post('/api/catalog/wishlist', { productId });
}

/**
 * Get user wishlist
 */
export async function getWishlist() {
  return get<Product[]>('/api/catalog/wishlist');
}

/**
 * Remove product from wishlist
 */
export async function removeFromWishlist(productId: string) {
  return deleteRequest(`/api/catalog/wishlist/${productId}`);
}

/**
 * Get product filters metadata
 */
export async function getFilterMetadata() {
  return get<{
    materials: string[];
    colors: string[];
    priceRanges: Array<{ min: number; max: number; label: string }>;
  }>('/api/catalog/filters');
}

export default {
  getProducts,
  getProduct,
  searchProducts,
  getCategories,
  getSubcategories,
  getTrendingProducts,
  getRecommendedProducts,
  saveToWishlist,
  getWishlist,
  removeFromWishlist,
  getFilterMetadata,
};
