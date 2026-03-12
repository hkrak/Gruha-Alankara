# API Endpoints Reference

Complete reference of all available API endpoints for the Home Design AI system.

**Base URL**: `http://localhost:3000` (development)  
**Content-Type**: `application/json` for all endpoints

---

## 🏥 Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/api/health` | Check if backend is running |

### Health Check Request
```bash
curl http://localhost:3000/api/health
```

### Health Check Response
```json
{
  "success": true,
  "message": "Backend is running"
}
```

---

## 🏠 Room Analysis (Computer Vision)

### Analyze Room Image
**Endpoint**: `POST /api/rooms/analyze`

Analyzes an uploaded room image using Computer Vision (OpenCV). Returns room type, dimensions, lighting, colors, and features.

**Request**:
```bash
curl -X POST http://localhost:3000/api/rooms/analyze \
  -F "image=@room.jpg" \
  -F "detectDimensions=true" \
  -F "detectLighting=true"
```

**Request Parameters** (multipart/form-data):
- `image` (file, required) - Room image (JPG, PNG, WebP)
- `detectDimensions` (boolean, optional) - Extract room dimensions
- `detectLighting` (boolean, optional) - Analyze lighting conditions

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "room_12345",
    "room_type": "living_room",
    "dimensions": {
      "width": 5.2,
      "height": 2.8,
      "length": 4.8,
      "unit": "meters"
    },
    "lighting": {
      "type": "natural",
      "level": "high",
      "windows": 2,
      "brightness_score": 8.5
    },
    "colors": {
      "dominant": "#E8D4C0",
      "accent": "#4A5568",
      "all": ["#E8D4C0", "#8B7355", "#4A5568", "#F5F5DC"]
    },
    "features": {
      "doors": 2,
      "windows": 2,
      "walls": 4,
      "has_furniture": true
    }
  }
}
```

### Get Room Analysis
**Endpoint**: `GET /api/rooms/analyze/<id>`

Retrieve a previously analyzed room.

**Request**:
```bash
curl http://localhost:3000/api/rooms/analyze/room_12345
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "room_12345",
    "created_at": "2026-02-15T10:30:00Z",
    "room_type": "living_room",
    "dimensions": {...},
    "lighting": {...},
    "colors": {...},
    "features": {...}
  }
}
```

### Get Design Suggestions
**Endpoint**: `GET /api/rooms/<id>/suggestions`

Get AI-powered design suggestions for a specific room analysis.

**Request**:
```bash
curl http://localhost:3000/api/rooms/room_12345/suggestions
```

**Response**:
```json
{
  "success": true,
  "data": {
    "room_id": "room_12345",
    "suggestions": [
      {
        "category": "color_palette",
        "recommendation": "Warm earth tones complement current lighting",
        "options": ["Warm Beige", "Terracotta", "Cream"]
      },
      {
        "category": "furniture",
        "recommendation": "Maximize natural light with minimal furniture",
        "options": ["Clean Line Sofa", "Glass Coffee Table"]
      }
    ]
  }
}
```

### Detect Room Dimensions
**Endpoint**: `POST /api/rooms/detect-dimensions`

Extract precise room dimensions from an image.

**Request**:
```bash
curl -X POST http://localhost:3000/api/rooms/detect-dimensions \
  -H "Content-Type: application/json" \
  -d '{
    "image_url": "https://example.com/room.jpg",
    "unit": "feet"
  }'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "width": 17.05,
    "height": 9.19,
    "length": 15.75,
    "unit": "feet",
    "confidence": 0.92
  }
}
```

### Detect Lighting
**Endpoint**: `POST /api/rooms/detect-lighting`

Analyze lighting conditions in a room image.

**Request**:
```bash
curl -X POST http://localhost:3000/api/rooms/detect-lighting \
  -H "Content-Type: application/json" \
  -d '{"room_id": "room_12345"}'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "natural_light": true,
    "artificial_light": true,
    "brightness_level": "high",
    "brightness_score": 8.5,
    "light_sources": ["north_window", "ceiling_fixture"],
    "recommendations": [
      "Room has excellent natural light",
      "Consider sheer curtains for evening light control"
    ]
  }
}
```

---

## 🎨 Design Generation (LLM)

### Generate Design
**Endpoint**: `POST /api/designs/generate`

Generate a complete AI-powered design using Claude LLM.

**Request**:
```bash
curl -X POST http://localhost:3000/api/designs/generate \
  -H "Content-Type: application/json" \
  -d '{
    "style": "Modern Minimalist",
    "room": "Living Room",
    "budget": "$10,000",
    "preferences": ["neutral colors", "natural light"],
    "room_analysis": {
      "dimensions": {"width": 5.2, "height": 2.8, "length": 4.8},
      "colors": {"dominant": "#E8D4C0"},
      "lighting": {"type": "natural"}
    }
  }'
```

**Request Parameters**:
- `style` (string, required) - Design style (Modern, Scandinavian, Bohemian, etc.)
- `room` (string, required) - Room type (Living Room, Bedroom, Kitchen, etc.)
- `budget` (string, optional) - Budget range
- `preferences` (array, optional) - User preferences
- `room_analysis` (object, optional) - Room CV analysis data

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "design_12345",
    "style": "Modern Minimalist",
    "room": "Living Room",
    "recommendations": {
      "color_palettes": [
        {
          "primary": "#F5F5F5",
          "secondary": "#2C3E50",
          "accent": "#E74C3C",
          "ratios": [60, 30, 10]
        }
      ],
      "furniture": [
        {
          "item": "Minimalist Sofa",
          "color": "#F5F5F5",
          "style": "Modern",
          "estimated_price": "$800-1200"
        }
      ],
      "lighting": [
        {
          "type": "pendant",
          "style": "modern",
          "placement": "above coffee table"
        }
      ],
      "materials": ["Natural Oak", "White Linen", "Matte Black Metal"]
    },
    "design_narrative": "A minimalist living space emphasizing clean lines and functional beauty..."
  }
}
```

### Get Design
**Endpoint**: `GET /api/designs/<id>`

Retrieve a previously generated design.

**Request**:
```bash
curl http://localhost:3000/api/designs/design_12345
```

**Response**: Same as generate response with added `created_at` timestamp.

### List Designs
**Endpoint**: `GET /api/designs`

List all generated designs.

**Request**:
```bash
curl "http://localhost:3000/api/designs?limit=10&offset=0"
```

**Query Parameters**:
- `limit` (integer, optional, default: 20) - Number of results
- `offset` (integer, optional, default: 0) - Pagination offset
- `style` (string, optional) - Filter by style

**Response**:
```json
{
  "success": true,
  "data": {
    "designs": [
      {
        "id": "design_12345",
        "style": "Modern Minimalist",
        "room": "Living Room",
        "created_at": "2026-02-15T10:30:00Z"
      }
    ],
    "total": 42,
    "limit": 10,
    "offset": 0
  }
}
```

### Update Design
**Endpoint**: `PUT /api/designs/<id>`

Update an existing design.

**Request**:
```bash
curl -X PUT http://localhost:3000/api/designs/design_12345 \
  -H "Content-Type: application/json" \
  -d '{
    "style": "Modern Scandinavian",
    "budget": "$12,000"
  }'
```

**Response**: Updated design object.

### Delete Design
**Endpoint**: `DELETE /api/designs/<id>`

Delete a design.

**Request**:
```bash
curl -X DELETE http://localhost:3000/api/designs/design_12345
```

**Response**:
```json
{
  "success": true,
  "message": "Design deleted successfully"
}
```

### Get Available Styles
**Endpoint**: `GET /api/designs/styles`

Get list of available design styles.

**Request**:
```bash
curl http://localhost:3000/api/designs/styles
```

**Response**:
```json
{
  "success": true,
  "data": {
    "styles": [
      {
        "name": "Modern Minimalist",
        "description": "Clean lines, minimal ornament, functionality focused",
        "characteristics": ["minimal", "contemporary", "functional"]
      },
      {
        "name": "Scandinavian",
        "description": "Light, bright, and naturally beautiful",
        "characteristics": ["light", "natural", "cozy"]
      }
    ]
  }
}
```

---

## 🤖 Agentic AI (Autonomous Agents)

### Plan Design Project
**Endpoint**: `POST /api/agents/plan-design`

Use autonomous agents with deep reasoning to plan a complete design project.

**Request**:
```bash
curl -X POST http://localhost:3000/api/agents/plan-design \
  -H "Content-Type: application/json" \
  -d '{
    "room": "Master Bedroom",
    "style": "Scandinavian",
    "budget": 8000,
    "constraints": ["small space", "limited storage"],
    "timeline": "3 months"
  }'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "plan_id": "plan_12345",
    "project_summary": "Complete bedroom renovation with focus...",
    "strategy": "Phase-based approach optimizing budget and timeline",
    "phases": [
      {
        "phase": 1,
        "name": "Planning & Procurement",
        "duration": "2 weeks",
        "budget_allocation": 1000,
        "tasks": ["Finalize design", "Order furniture"]
      },
      {
        "phase": 2,
        "name": "Installation",
        "duration": "1 week",
        "budget_allocation": 3000,
        "tasks": ["Install flooring", "Paint walls", "Install lighting"]
      }
    ],
    "total_estimated_cost": 7500,
    "timeline_weeks": 12,
    "risk_assessment": "Low risk with standard timeline"
  }
}
```

### Optimize Layout
**Endpoint**: `POST /api/agents/optimize-layout`

Optimize furniture placement and room layout using intelligent agents.

**Request**:
```bash
curl -X POST http://localhost:3000/api/agents/optimize-layout \
  -H "Content-Type: application/json" \
  -d '{
    "room_id": "room_12345",
    "furniture_list": [
      {"name": "Sofa", "width": 2.5, "depth": 0.9},
      {"name": "Coffee Table", "width": 1.2, "depth": 0.75}
    ],
    "room_width": 5.2,
    "room_length": 4.8,
    "constraints": ["window at north", "door at east"]
  }'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "optimized_layout": {
      "furniture_placements": [
        {
          "item": "Sofa",
          "position": {"x": 1.0, "y": 2.0},
          "rotation": 0,
          "reasoning": "Faces focal wall with natural light"
        }
      ],
      "traffic_flow_score": 8.5,
      "space_efficiency": 0.78,
      "recommendations": [
        "Keep main walkway clear for traffic",
        "Position seating to view window"
      ]
    }
  }
}
```

### Suggest Purchases
**Endpoint**: `POST /api/agents/suggest-purchases`

Get intelligent purchase suggestions for completing a design.

**Request**:
```bash
curl -X POST http://localhost:3000/api/agents/suggest-purchases \
  -H "Content-Type: application/json" \
  -d '{
    "design_id": "design_12345",
    "existing_items": ["Sofa", "TV"],
    "budget": 5000,
    "style": "Modern Minimalist"
  }'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "missing_items": [
      {
        "category": "seating",
        "item": "Accent Chair",
        "estimated_price": "$400-600",
        "priority": "high",
        "reasons": ["Completes seating area", "Maintains style"]
      }
    ],
    "shopping_strategy": "Start with seating, then lighting, then accessories",
    "estimated_total": 4800,
    "savings_opportunity": "$200"
  }
}
```

### Make Design Decisions
**Endpoint**: `POST /api/agents/make-decisions`

Let autonomous agents make design decisions based on constraints.

**Request**:
```bash
curl -X POST http://localhost:3000/api/agents/make-decisions \
  -H "Content-Type: application/json" \
  -d '{
    "room": "Living Room",
    "options": {
      "wall_color": ["White", "Beige", "Gray"],
      "flooring": ["Hardwood", "Laminate", "Tile"],
      "furniture_style": ["Modern", "Traditional", "Hybrid"]
    },
    "priorities": ["durability", "aesthetic", "budget"]
  }'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "decisions": {
      "primary_color": "Warm Beige",
      "secondary_colors": ["White", "Dark Brown"],
      "flooring": "Light Hardwood",
      "furniture_style": "Modern",
      "lighting_approach": "Layer with ambient + task lighting"
    },
    "reasoning": "Warm beige creates cozy foundation while allowing flexibility...",
    "confidence_score": 0.92
  }
}
```

### Review Design (Multi-Agent)
**Endpoint**: `POST /api/agents/review-design`

Get comprehensive design review from multiple AI agents.

**Request**:
```bash
curl -X POST http://localhost:3000/api/agents/review-design \
  -H "Content-Type: application/json" \
  -d '{
    "design_id": "design_12345",
    "focus_areas": ["aesthetics", "functionality", "budget"]
  }'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "agent": "AestheticsExpert",
        "score": 8.5,
        "feedback": "Strong use of color and space...",
        "recommendations": ["Consider accent wall"]
      },
      {
        "agent": "FunctionalityExpert",
        "score": 8.0,
        "feedback": "Layout supports good traffic flow...",
        "recommendations": ["Add storage solution"]
      }
    ],
    "overall_score": 8.25,
    "consensus": "Strong design with minor optimization opportunities"
  }
}
```

### Automate Design Process
**Endpoint**: `POST /api/agents/automate-process`

Fully automate the design process from image to complete plan.

**Request**:
```bash
curl -X POST http://localhost:3000/api/agents/automate-process \
  -H "Content-Type: application/json" \
  -d '{
    "room_image": "base64_encoded_image_data",
    "style": "Scandinavian",
    "budget": 10000,
    "autonomous_mode": true
  }'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "process_id": "auto_12345",
    "status": "completed",
    "results": {
      "room_analysis": {...},
      "design": {...},
      "project_plan": {...},
      "shopping_list": {...}
    },
    "processing_time_seconds": 45
  }
}
```

---

## 📱 AR Visualization

### Create AR Scene
**Endpoint**: `POST /api/ar/scenes`

Create a 3D AR scene with furniture and design elements.

**Request**:
```bash
curl -X POST http://localhost:3000/api/ar/scenes \
  -H "Content-Type: application/json" \
  -d '{
    "design_id": "design_12345",
    "furniture_list": [
      {
        "name": "Sofa",
        "type": "sofa",
        "width": 2.5,
        "height": 0.8,
        "depth": 0.9,
        "color": "#F5F5F5",
        "position": {"x": 1.0, "y": 0, "z": 2.0}
      }
    ],
    "room_dimensions": {
      "width": 5.2,
      "height": 2.8,
      "length": 4.8
    }
  }'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "scene_id": "scene_12345",
    "scene_data": {
      "format": "gltf",
      "url": "https://cdn.example.com/scenes/scene_12345.gltf",
      "size_mb": 2.5
    },
    "furniture_count": 8,
    "collisions_detected": 0
  }
}
```

### List AR Scenes
**Endpoint**: `GET /api/ar/scenes`

List all created AR scenes.

**Request**:
```bash
curl "http://localhost:3000/api/ar/scenes?limit=20"
```

**Response**:
```json
{
  "success": true,
  "data": {
    "scenes": [
      {
        "id": "scene_12345",
        "design_id": "design_12345",
        "created_at": "2026-02-15T10:30:00Z",
        "furniture_count": 8
      }
    ],
    "total": 42
  }
}
```

### Get AR Scene
**Endpoint**: `GET /api/ar/scenes/<id>`

Get detailed AR scene information.

**Request**:
```bash
curl http://localhost:3000/api/ar/scenes/scene_12345
```

**Response**: Scene details with full furniture positions.

### Update Furniture Position
**Endpoint**: `POST /api/ar/scenes/<id>/furniture/<furniture_id>/position`

Update furniture position in AR scene.

**Request**:
```bash
curl -X POST http://localhost:3000/api/ar/scenes/scene_12345/furniture/sofa_1/position \
  -H "Content-Type: application/json" \
  -d '{
    "position": {"x": 2.0, "y": 0, "z": 1.5},
    "rotation": 45
  }'
```

**Response**: Updated furniture position with collision detection.

### Detect Collision
**Endpoint**: `POST /api/ar/scenes/<id>/collision-check`

Check for furniture collisions in scene.

**Request**:
```bash
curl -X POST http://localhost:3000/api/ar/scenes/scene_12345/collision-check
```

**Response**:
```json
{
  "success": true,
  "data": {
    "has_collision": false,
    "collisions": []
  }
}
```

### Export AR Scene
**Endpoint**: `GET /api/ar/scenes/<id>/export?format=gltf`

Export scene in different formats.

**Request**:
```bash
curl "http://localhost:3000/api/ar/scenes/scene_12345/export?format=usdz"
```

**Query Parameters**:
- `format` (string) - Export format: `gltf`, `glb`, `usdz`

**Response**: Download link or file stream.

---

## 🛋️ Catalog Management

### Get Products
**Endpoint**: `GET /api/catalog/products`

Search and filter products in catalog.

**Request**:
```bash
curl "http://localhost:3000/api/catalog/products?category=furniture&style=modern&limit=20"
```

**Query Parameters**:
- `category` (string, optional) - Product category
- `style` (string, optional) - Design style
- `price_min` (number, optional) - Minimum price
- `price_max` (number, optional) - Maximum price
- `limit` (integer, optional) - Results per page
- `offset` (integer, optional) - Pagination offset

**Response**:
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod_12345",
        "name": "Modern Sofa",
        "category": "furniture",
        "style": "modern",
        "price": 899.99,
        "image_url": "https://...",
        "in_stock": true
      }
    ],
    "total": 242
  }
}
```

### Get Categories
**Endpoint**: `GET /api/catalog/categories`

Get available product categories.

**Request**:
```bash
curl http://localhost:3000/api/catalog/categories
```

### Get Trends
**Endpoint**: `GET /api/catalog/trends`

Get trending products and styles.

**Request**:
```bash
curl http://localhost:3000/api/catalog/trends
```

### Get Recommendations
**Endpoint**: `GET /api/catalog/recommendations`

Get personalized product recommendations.

**Request**:
```bash
curl "http://localhost:3000/api/catalog/recommendations?style=scandinavian&budget=5000"
```

---

## 💰 Budget Planning

### Create Budget
**Endpoint**: `POST /api/budget`

Create a project budget.

**Request**:
```bash
curl -X POST http://localhost:3000/api/budget \
  -H "Content-Type: application/json" \
  -d '{
    "design_id": "design_12345",
    "total_budget": 10000,
    "categories": {
      "furniture": 5000,
      "lighting": 1500,
      "accessories": 1500,
      "labor": 2000
    }
  }'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "budget_id": "budget_12345",
    "total_budget": 10000,
    "allocated": 10000,
    "remaining": 0,
    "categories": {...}
  }
}
```

### Get Budget
**Endpoint**: `GET /api/budget/<id>`

Get budget details.

**Request**:
```bash
curl http://localhost:3000/api/budget/budget_12345
```

### Get Budget Analysis
**Endpoint**: `GET /api/budget/<id>/analysis`

Get detailed budget analysis with breakdown.

**Request**:
```bash
curl http://localhost:3000/api/budget/budget_12345/analysis
```

### Compare Budgets
**Endpoint**: `POST /api/budget/compare`

Compare two budget scenarios.

**Request**:
```bash
curl -X POST http://localhost:3000/api/budget/compare \
  -H "Content-Type: application/json" \
  -d '{
    "budget_1": "budget_12345",
    "budget_2": "budget_67890"
  }'
```

---

## 🔐 Error Responses

All endpoints return errors in consistent format:

**400 Bad Request**:
```json
{
  "success": false,
  "error": "Bad Request",
  "message": "Invalid room type"
}
```

**404 Not Found**:
```json
{
  "success": false,
  "error": "Not Found",
  "message": "Design not found"
}
```

**500 Internal Server Error**:
```json
{
  "success": false,
  "error": "Internal Server Error",
  "message": "Unexpected error occurred"
}
```

---

## 📝 Common Request Headers

```
Content-Type: application/json
Accept: application/json
Authorization: Bearer <token> (if authentication enabled)
```

---

## ⚡ Rate Limiting

Current setup: No rate limiting (can be added in production)

---

## 📚 Additional Resources

- [Backend Implementation](backend/README.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Project README](README.md)

**Last Updated**: February 2026  
**API Version**: 1.0.0
