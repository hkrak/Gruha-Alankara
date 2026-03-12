# Home Design AI - Agentic AI Backend

## Overview

This is a **Flask-based backend** for the Home Design AI application that provides personalized interior design recommendations using:

- **Computer Vision (OpenCV)** - Room image analysis for dimensions, lighting, colors, and features
- **Large Language Models (Claude)** - AI-powered design recommendations and suggestions
- **Agentic AI (LangChain)** - Autonomous agents for multi-step design planning and decision-making
- **AR Tools Integration** - 3D AR scene creation and furniture visualization

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React/Vite)                  │
│              (Located in src/ directory)                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                    HTTP/WSGI
                         │
┌─────────────────────────▼────────────────────────────────────┐
│                   Flask Backend (Python)                     │
│                  (Located in backend/)                       │
├──────────────────────────────────────────────────────────────┤
│  Routes Layer                                                │
│  ├── /api/health      - Health check                        │
│  ├── /api/rooms       - CV-based room analysis              │
│  ├── /api/designs     - LLM design recommendations          │
│  ├── /api/agents      - Agentic AI autonomous tasks         │
│  ├── /api/ar          - AR scene creation & management      │
│  ├── /api/catalog     - Product catalog                     │
│  └── /api/budget      - Budget planning & tracking          │
├──────────────────────────────────────────────────────────────┤
│  Services Layer                                              │
│  ├── cv_service.py    - Computer Vision (OpenCV)            │
│  ├── llm_service.py   - LLM Integration (Claude)            │
│  ├── agent_service.py - Agentic AI (LangChain)              │
│  └── ar_service.py    - AR Visualization                    │
└──────────────────────────────────────────────────────────────┘
```

## Setup & Installation

### Prerequisites

- Python 3.9+
- pip (Python package manager)
- Flask
- Claude API key from [Anthropic](https://console.anthropic.com)

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
# Required
ANTHROPIC_API_KEY=sk-ant-v1-your-api-key-here

# Optional but recommended
OPENAI_API_KEY=your-openai-key
```

### 3. Run the Backend

```bash
python app.py
```

The backend will start on `http://localhost:3000`

### Verify Backend is Running

```bash
curl http://localhost:3000/api/health
```

## Key Features

### 1. Computer Vision Room Analysis

**Endpoint:** `POST /api/rooms/analyze`

Analyzes room images to extract:
- Room type detection
- Dimension estimation
- Lighting analysis
- Color extraction
- Feature detection (doors, windows, walls)
- Furniture identification

**Example:**
```python
# Frontend sends image
POST /api/rooms/analyze
Content-Type: multipart/form-data
{
  "image": <binary_image_file>
}

# Backend returns analysis
{
  "success": true,
  "data": {
    "room_type": "living_room",
    "dimensions": {"width": 5.0, "height": 2.8, "length": 6.0},
    "lighting": {"type": "natural", "level": "medium"},
    "colors": {"dominant": ["#FFFFFF", "#000000"]},
    "features": {"doors": 1, "windows": 2},
    "confidence": 0.85
  }
}
```

### 2. LLM-Based Design Recommendations

**Endpoint:** `POST /api/designs/generate`

Uses Claude AI to generate personalized design recommendations:
- Color palettes
- Furniture suggestions
- Material recommendations
- Lighting plans
- Design narrative

**Example:**
```python
POST /api/designs/generate
{
  "style": "Modern Minimalist",
  "room": "Living Room",
  "budget": "$5000-$10000",
  "room_analysis": { ... }  # Optional: previous room analysis
}

# Returns AI-generated design
{
  "success": true,
  "recommendations": {
    "color_palettes": [...],
    "furniture": [...],
    "materials": [...],
    "design_narrative": "..."
  }
}
```

### 3. Agentic AI - Autonomous Design Agent

**Endpoints:**
- `POST /api/agents/plan-design` - Plan complete design project
- `POST /api/agents/optimize-layout` - Optimize furniture placement
- `POST /api/agents/suggest-purchases` - Suggest missing items
- `POST /api/agents/make-decisions` - Make autonomous choices
- `POST /api/agents/automate-process` - Fully automate design

These agents use **extended thinking** to:
- Reason through design challenges
- Make coherent design decisions
- Consider multiple factors (budget, space, style)
- Generate detailed project plans

**Example:**
```python
POST /api/agents/plan-design
{
  "room": "Bedroom",
  "style": "Scandinavian",
  "budget": 3000,
  "constraints": ["small space", "limited budget"]
}

# Agent reasons deeply and returns comprehensive plan
{
  "success": true,
  "project_id": "proj_abc123",
  "plan": {
    "design_strategy": "...",
    "budget_allocation": {...},
    "timeline": {...}
  },
  "reasoning_depth": "extended"
}
```

### 4. AR Visualization

**Endpoints:**
- `POST /api/ar/scenes` - Create AR scene
- `POST /api/ar/scenes/<id>/furniture/<id>/position` - Update furniture
- `GET /api/ar/scenes/<id>/export` - Export as GLTF/USDZ

**Features:**
- Create 3D room models
- Place/move furniture in AR
- Collision detection
- Auto-layout optimization
- Export to various 3D formats

### 5. Intelligent Assistant

The backend provides endpoints for an intelligent design assistant that can:
- Analyze images in real-time
- Suggest improvements
- Answer design questions
- Provide budgeting advice
- Track design progress

## API Endpoints Reference

### Health & Status
```
GET  /api/health                    - Check backend health
```

### Room Analysis (Computer Vision)
```
POST /api/rooms/analyze             - Analyze room image
GET  /api/rooms/analyze/<id>       - Get analysis by ID
GET  /api/rooms/analyze            - List all analyses
GET  /api/rooms/<id>/suggestions   - Get design suggestions
POST /api/rooms/detect-dimensions  - Detect room size from image
POST /api/rooms/detect-lighting    - Analyze lighting conditions
```

### Design Generation (LLM)
```
POST /api/designs/generate          - Generate design using LLM
GET  /api/designs                   - List all designs
GET  /api/designs/<id>             - Get specific design
PUT  /api/designs/<id>             - Update design
DELETE /api/designs/<id>           - Delete design
GET  /api/designs/<id>/recommendations - Get furniture suggestions
GET  /api/designs/<id>/export/pdf  - Export design as PDF
POST /api/designs/<id>/share       - Share design
GET  /api/designs/styles           - Get available styles
```

### Agentic AI (Autonomous Agents)
```
POST /api/agents/plan-design                    - Plan project
POST /api/agents/optimize-layout               - Optimize layout
POST /api/agents/suggest-purchases             - Suggest items
POST /api/agents/make-decisions                - Make autonomous decisions
POST /api/agents/review-design                 - Multi-agent review
POST /api/agents/automate-process              - Full automation
```

### AR Visualization
```
GET  /api/ar/models                 - List AR models
GET  /api/ar/models/<id>           - Get specific model
POST /api/ar/scenes                 - Create AR scene
GET  /api/ar/scenes/<id>           - Get scene details
POST /api/ar/scenes/<id>/furniture/<fid>/position - Update position
POST /api/ar/scenes/<id>/furniture/<fid>/rotation - Update rotation
POST /api/ar/scenes/<id>/furniture/<fid>/scale    - Update scale
POST /api/ar/scenes/<id>/furniture              - Add furniture
POST /api/ar/scenes/<id>/furniture/<fid>/remove - Remove furniture
POST /api/ar/scenes/<id>/furniture/<fid>/collision-check - Check collision
POST /api/ar/scenes/<id>/optimize-layout       - Optimize layout
POST /api/ar/scenes/<id>/screenshot            - Capture screenshot
GET  /api/ar/scenes/<id>/export                - Export scene (GLTF/USDZ)
POST /api/ar/device-capabilities               - Check device support
```

### Catalog
```
GET  /api/catalog/products          - List products with filters
GET  /api/catalog/products/<id>    - Get product details
GET  /api/catalog/categories        - List categories
GET  /api/catalog/categories/<cat>/subcategories - Get subcategories
GET  /api/catalog/trending          - Get trending products
GET  /api/catalog/recommendations   - Get recommendations
POST /api/catalog/wishlist          - Add to wishlist
GET  /api/catalog/wishlist          - Get wishlist
DELETE /api/catalog/wishlist/<id>  - Remove from wishlist
GET  /api/catalog/filters           - Get filter options
```

### Budget Planning
```
POST /api/budget                    - Create budget
GET  /api/budget                    - List budgets
GET  /api/budget/<id>              - Get budget details
PUT  /api/budget/<id>              - Update budget
DELETE /api/budget/<id>            - Delete budget
POST /api/budget/<id>/items        - Add budget item
PUT  /api/budget/<id>/items/<iid>  - Update budget item
DELETE /api/budget/<id>/items/<iid> - Delete budget item
GET  /api/budget/<id>/analysis     - Get budget analysis
GET  /api/budget/<id>/comparison   - Compare with similar projects
GET  /api/budget/<id>/optimization - Get cost optimization tips
GET  /api/budget/<id>/export/pdf   - Export as PDF
GET  /api/budget/<id>/export/csv   - Export as CSV
```

## Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Framework | Flask 2.3+ | Python web framework |
| LLM | Claude 3.5 Sonnet | AI design recommendations & agents |
| Computer Vision | OpenCV | Room image analysis |
| AI Agents | LangChain | Multi-step reasoning |
| AR | Custom (GLTF) | 3D scene creation |
| Async | aiohttp | Async HTTP requests |
| Validation | Pydantic | Data validation |
| API | Flask-CORS | Cross-Origin support |

## Environment Variables

```env
# Flask Settings
FLASK_ENV=development
FLASK_HOST=0.0.0.0
FLASK_PORT=3000
DEBUG=True

# LLM (Claude)
ANTHROPIC_API_KEY=sk-ant-...

# Feature Flags
ENABLE_AR=true
ENABLE_ANALYTICS=false

# CV Settings
CV_CONFIDENCE_THRESHOLD=0.75
CV_ENABLE_ADVANCED=true

# File Upload
MAX_UPLOAD_SIZE=50
ALLOWED_EXTENSIONS=jpg,jpeg,png,gif,webp
```

## Project Structure

```
backend/
├── app.py                     # Main Flask application
├── requirements.txt           # Python dependencies
├── .env                       # Environment variables (NEVER commit!)
├── .env.example              # Environment template
│
├── routes/                    # API route handlers
│   ├── __init__.py
│   ├── health.py            # Health check
│   ├── rooms.py             # Room analysis routes
│   ├── designs.py           # Design generation routes
│   ├── agents.py            # Agentic AI routes
│   ├── ar.py               # AR visualization routes
│   ├── catalog.py          # Product catalog routes
│   └── budget.py           # Budget planning routes
│
├── services/                 # Business logic & integrations
│   ├── __init__.py
│   ├── cv_service.py       # OpenCV room analysis
│   ├── llm_service.py      # Claude LLM integration
│   ├── agent_service.py    # LangChain agents
│   └── ar_service.py       # AR scene generation
│
├── utils/                   # Utility functions
│   └── (future)
│
└── models/                  # Data models & database
    └── (future)
```

## Running Examples

### Example 1: Analyze Room & Get Design

```bash
# 1. Upload room image
curl -X POST http://localhost:3000/api/rooms/analyze \
  -F "image=@room_photo.jpg"

# Response includes room analysis
{
  "room_type": "living_room",
  "dimensions": {...},
  "colors": {...}
}

# 2. Generate design based on analysis
curl -X POST http://localhost:3000/api/designs/generate \
  -H "Content-Type: application/json" \
  -d '{
    "style": "Modern Minimalist",
    "room": "Living Room",
    "budget": "$5000-$10000",
    "room_analysis": {...}
  }'

# Response: AI-generated design recommendations
```

### Example 2: Use Agent to Plan Project

```bash
curl -X POST http://localhost:3000/api/agents/plan-design \
  -H "Content-Type: application/json" \
  -d '{
    "room": "Bedroom",
    "style": "Scandinavian",
    "budget": 3000,
    "constraints": ["small space"]
  }'

# Response: Comprehensive design project plan
```

### Example 3: Create AR Scene

```bash
curl -X POST http://localhost:3000/api/ar/scenes \
  -H "Content-Type: application/json" \
  -d '{
    "designId": "design_001",
    "room_dimensions": {
      "width": 5.0,
      "height": 2.8,
      "length": 5.0
    },
    "furniture_list": [...]
  }'

# Response: AR scene with 3D models
```

## Debugging

### Check Backend Logs

```bash
tail -f logs/app.log
```

### Enable Debug Mode

Set `DEBUG=True` in `.env`:

```env
FLASK_ENV=development
DEBUG=True
```

### Test Endpoints with curl

```bash
# Test health
curl http://localhost:3000/api/health

# Test with JSON
curl -X POST http://localhost:3000/api/designs/generate \
  -H "Content-Type: application/json" \
  -d '{"style":"Modern","room":"Living Room","budget":"$5000"}'
```

## Common Issues

### Issue: "Connection refused"
- **Solution**: Ensure backend is running on port 3000
  ```bash
  python app.py
  ```

### Issue: "CORS error"
- **Solution**: Check `CORS_ORIGINS` in `.env`
  ```env
  CORS_ORIGINS=http://localhost:8080
  ```

### Issue: "API Key error"
- **Solution**: Add Anthropic API key to `.env`
  ```env
  ANTHROPIC_API_KEY=sk-ant-...
  ```

### Issue: "File upload error"
- **Solution**: Check file size and type
  - Max size: 50MB
  - Types: jpg, jpeg, png, gif, webp

## Production Deployment

### Using Gunicorn

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:3000 app:create_app()
```

### Using Docker

Create `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
ENV FLASK_ENV=production
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:3000", "app:create_app()"]
```

Build and run:

```bash
docker build -t homedesign-ai-backend .
docker run -p 3000:3000 --env-file .env homedesign-ai-backend
```

## Advanced Features

### Extended Thinking
Agents use Claude's extended thinking capability for deeper reasoning:

```python
response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000  # Allow deep thinking
    },
    messages=[...]
)
```

### Multi-Agent Collaboration
For complex tasks, multiple agents collaborate:

```python
# Agent 1: Analyzes style consistency
style_review = review_agent.check_style()

# Agent 2: Optimizes budget
budget_review = budget_agent.optimize()

# Synthesize results
final_decision = synthesis_agent.combine(style_review, budget_review)
```

## Future Enhancements

- [ ] User authentication & profiles
- [ ] Design history & versioning
- [ ] Real-time 3D viewer
- [ ] Integration with furniture retailers
- [ ] Mobile app API
- [ ] WebSocket for real-time collaboration
- [ ] Database persistence (PostgreSQL/MongoDB)
- [ ] Advanced vision models (YOLO, etc.)
- [ ] Support for multiple LLM backends
- [ ] Design marketplace

## Support & Documentation

- **API Docs**: This README + inline comments
- **Frontend Integration**: See [../API_GUIDE.md](../API_GUIDE.md)
- **Frontend Code**: See `../src/services/`
- **Claude Docs**: https://docs.anthropic.com
- **Flask Docs**: https://flask.palletsprojects.com
- **OpenCV Docs**: https://docs.opencv.org

---

**Built with ❤️ using Agentic AI | Last Updated: February 2026**
