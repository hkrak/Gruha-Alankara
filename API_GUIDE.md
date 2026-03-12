# API Configuration Guide

## Backend Setup Instructions

This document explains how to connect your frontend to the backend and ensure all functions work properly.

## Environment Variables

Create a `.env` file in the project root with the following configuration:

```env
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:3000
VITE_API_TIMEOUT=30000

# Feature Flags
VITE_ENABLE_AR=true
VITE_ENABLE_ANALYTICS=false
```

### Variable Explanations

- `VITE_API_BASE_URL`: The base URL of your backend server (e.g., `http://localhost:3000` for development)
- `VITE_API_TIMEOUT`: Request timeout in milliseconds (default: 30000ms = 30 seconds)
- `VITE_ENABLE_AR`: Enable/disable AR features (default: true)
- `VITE_ENABLE_ANALYTICS`: Enable/disable analytics tracking (default: false)

## Required Backend Endpoints

The application expects the following endpoints (grouped by feature):

### Design Service (`/src/services/designService.ts`)

- `POST /api/designs/generate` - Generate AI design based on preferences
- `GET /api/designs` - Get all user designs
- `GET /api/designs/:id` - Get specific design
- `PUT /api/designs/:id` - Update design
- `DELETE /api/designs/:id` - Delete design
- `GET /api/designs/:id/recommendations` - Get furniture recommendations
- `GET /api/designs/:id/export/pdf` - Export design as PDF
- `POST /api/designs/:id/share` - Share design
- `GET /api/designs/styles` - Get available styles

### Room Service (`/src/services/roomService.ts`)

- `POST /api/rooms/analyze` - Analyze room image
- `GET /api/rooms/analyze/:id` - Get room analysis
- `GET /api/rooms/analyze` - Get all user analyses
- `GET /api/rooms/:id/suggestions` - Get room suggestions
- `POST /api/rooms/detect-dimensions` - Detect room dimensions
- `POST /api/rooms/detect-lighting` - Detect lighting conditions

### Catalog Service (`/src/services/catalogService.ts`)

- `GET /api/catalog/products` - Get products with filtering
- `GET /api/catalog/products/:id` - Get product details
- `GET /api/catalog/categories` - Get all categories
- `GET /api/catalog/categories/:category/subcategories` - Get subcategories
- `GET /api/catalog/trending` - Get trending products
- `GET /api/catalog/recommendations` - Get recommended products
- `POST /api/catalog/wishlist` - Add to wishlist
- `GET /api/catalog/wishlist` - Get wishlist
- `DELETE /api/catalog/wishlist/:id` - Remove from wishlist
- `GET /api/catalog/filters` - Get filter metadata

### Budget Service (`/src/services/budgetService.ts`)

- `POST /api/budget` - Create budget
- `GET /api/budget` - Get all budgets
- `GET /api/budget/:id` - Get specific budget
- `PUT /api/budget/:id` - Update budget
- `DELETE /api/budget/:id` - Delete budget
- `POST /api/budget/:id/items` - Add budget item
- `PUT /api/budget/:id/items/:itemId` - Update budget item
- `DELETE /api/budget/:id/items/:itemId` - Delete budget item
- `GET /api/budget/:id/analysis` - Get budget analysis
- `GET /api/budget/:id/comparison` - Get budget comparison
- `GET /api/budget/:id/optimization` - Get optimization recommendations
- `GET /api/budget/:id/export/pdf` - Export as PDF
- `GET /api/budget/:id/export/csv` - Export as CSV

### AR Service (`/src/services/arService.ts`)

- `GET /api/ar/models` - Get AR models
- `GET /api/ar/models/:id` - Get specific model
- `POST /api/ar/scenes` - Create AR scene
- `GET /api/ar/scenes/:id` - Get scene
- `POST /api/ar/scenes/:id/furniture/:furnitureId/position` - Update position
- `POST /api/ar/scenes/:id/furniture/:furnitureId/rotation` - Update rotation
- `POST /api/ar/scenes/:id/furniture/:furnitureId/scale` - Update scale
- `POST /api/ar/scenes/:id/furniture` - Add furniture
- `POST /api/ar/scenes/:id/furniture/:furnitureId/remove` - Remove furniture
- `POST /api/ar/scenes/:id/furniture/:furnitureId/collision-check` - Check collisions
- `POST /api/ar/scenes/:id/optimize-layout` - Generate optimal layout
- `POST /api/ar/scenes/:id/screenshot` - Capture screenshot
- `GET /api/ar/scenes/:id/export` - Export scene
- `POST /api/ar/device-capabilities` - Get device capabilities

### Health Check

- `GET /health` - Backend health check endpoint

## Using the API Services

Import and use the services in your components:

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { generateDesign, getProducts } from '@/services/designService';
import catalogService from '@/services/catalogService';

// Example: Get products with React Query
function ProductList() {
  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => catalogService.getProducts({ limit: 20 })
  });

  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {data?.data?.products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

## Error Handling

The API services automatically handle errors and return an `ApiResponse<T>` structure:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}
```

Example usage:

```typescript
const response = await generateDesign({
  style: 'Modern Minimalist',
  room: 'Living Room',
  budget: '$5,000 - $10,000'
});

if (response.success) {
  console.log('Design created:', response.data);
} else {
  console.error('Error:', response.error);
}
```

## Testing Backend Connection

To verify your backend is properly connected:

1. Start your backend server (default on `http://localhost:3000`)
2. Start the frontend: `npm run dev`
3. Check the browser console for any API errors
4. The app should load without connection errors

## Development Tips

- Keep `VITE_API_BASE_URL` pointed to your development backend
- Use `VITE_API_TIMEOUT` to control how long to wait for responses
- Check network tab in browser DevTools to debug API calls
- Log API responses to understand data structure

## Production Deployment

Before deploying to production:

1. Update `VITE_API_BASE_URL` to your production backend URL
2. Set appropriate `VITE_API_TIMEOUT` value
3. Ensure backend is properly secured with authentication/validation
4. Test all features in production-like environment
5. Set up proper error monitoring and logging

## Troubleshooting

### "Cannot connect to backend"
- Verify backend is running on the configured URL
- Check `VITE_API_BASE_URL` in `.env` file
- Check browser console for CORS errors
- Ensure backend has proper CORS headers

### "Request timeout"
- Increase `VITE_API_TIMEOUT` value if backend is slow
- Check backend performance and database queries
- Look for slow image processing or AI model inference

### "API returns 404"
- Verify endpoint path matches backend routes
- Check routing configuration on backend
- Ensure database/models are initialized

### "CORS errors"
- Backend must include proper CORS headers
- Verify `Access-Control-Allow-Origin` includes frontend URL
- Check `Access-Control-Allow-Methods` includes needed HTTP methods

## Support

For API-related issues:
1. Check the endpoint documentation above
2. Review error messages in browser console
3. Check backend server logs
4. Verify `.env` configuration
