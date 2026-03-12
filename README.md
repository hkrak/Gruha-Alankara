# Home Design AI

An **Agentic AI-powered interior design platform** that provides personalized design recommendations, room analysis, and automated design assistance using cutting-edge AI technologies.

## 🚀 Key Features

### AI-Powered Capabilities
- 🧠 **Agentic AI** - Autonomous agents make intelligent design decisions
- 🤖 **LLM Integration** - Claude AI generates personalized recommendations
- 👁️ **Computer Vision** - OpenCV analyzes room images for dimensions and features
- 🎨 **Design Generation** - AI creates complete design plans automatically
- 📱 **AR Visualization** - See designs in your space before implementation
- 💡 **Intelligent Assistant** - Context-aware design suggestions

### Core Modules
- 🏠 **Design Studio** - Create and customize room designs with AI
- 📱 **Room Analyzer** - Upload photos for AI-powered room analysis
- 🛋️ **Catalog** - Browse and filter design products intelligently
- 💰 **Budget Planner** - Plan and optimize project budgets
- 🥽 **AR Camera** - Visualize designs in real space using AR
- 🤴 **Design Agent** - Let AI plan your entire project

## 🏗️ Architecture

The application uses a **modern full-stack architecture**:

```
Frontend (React + TypeScript)
  ↓ (HTTP)
Backend (Flask + Agentic AI)
  ├── Computer Vision (OpenCV)
  ├── LLM (Claude AI)
  ├── Agentic Framework (LangChain)
  └── AR Visualization (GLTF)
```

## ⚡ Quick Start

### Option 1: Run Everything (Recommended)

**Windows:**
```bash
start-all.bat
```

**Linux/Mac:**
```bash
bash start-all.sh
```

This starts:
- Frontend: http://localhost:8080
- Backend: http://localhost:3000

### Option 2: Manual Setup

#### Frontend

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Frontend: http://localhost:8080
```

#### Backend

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Add your API key to .env
ANTHROPIC_API_KEY=sk-ant-...

# Start server
python app.py
# Backend: http://localhost:3000
```

## 📋 Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **TailwindCSS** - Styling
- **shadcn-ui** - Component library
- **React Router** - Navigation
- **React Query** - Data fetching

### Backend
- **Flask 2.3** - Python web framework
- **Claude 3.5 Sonnet** - LLM for design recommendations
- **LangChain** - Agentic AI framework
- **OpenCV** - Computer vision for room analysis
- **Flask-CORS** - API security
- **Pydantic** - Data validation

## 🔌 API Endpoints

### Core Endpoints

**Room Analysis (Computer Vision)**
```
POST /api/rooms/analyze          - Analyze room image with CV
GET  /api/rooms/analyze/<id>     - Get analysis results
GET  /api/rooms/<id>/suggestions - Get design suggestions
```

**Design Generation (LLM)**
```
POST /api/designs/generate       - Generate design with AI
GET  /api/designs/<id>          - Get design details
PUT  /api/designs/<id>          - Update design
```

**Agentic AI (Autonomous Agents)**
```
POST /api/agents/plan-design     - Plan complete project
POST /api/agents/optimize-layout - Optimize furniture placement
POST /api/agents/suggest-purchases - Suggest items to buy
POST /api/agents/automate-process - Fully automate process
POST /api/agents/review-design   - Multi-agent design review
```

**AR Visualization**
```
POST /api/ar/scenes              - Create 3D AR scene
POST /api/ar/scenes/<id>/furniture/<id>/position - Move furniture
GET  /api/ar/scenes/<id>/export  - Export to GLTF/USDZ
```

**Budget & Catalog**
```
POST /api/budget                 - Create budget
GET  /api/catalog/products       - Get product catalog
```

See [backend/README.md](backend/README.md) for complete API documentation.

## 📚 Project Structure

```
home-design-ai/
├── src/                         # Frontend (React)
│   ├── components/             # React components
│   ├── pages/                  # Page components
│   ├── services/               # API service layer
│   │   ├── api.ts             # Core HTTP client
│   │   ├── designService.ts   # Design API calls
│   │   ├── roomService.ts     # Room analysis API
│   │   ├── agentService.ts    # Agent API calls
│   │   ├── arService.ts       # AR API calls
│   │   └── ...
│   └── App.tsx                # Main app
│
├── backend/                     # Backend (Flask)
│   ├── app.py                  # Flask application
│   ├── requirements.txt        # Python dependencies
│   ├── .env                    # Environment config
│   ├── routes/                 # API endpoints
│   │   ├── health.py          # Health check
│   │   ├── rooms.py           # Room analysis routes
│   │   ├── designs.py         # Design routes
│   │   ├── agents.py          # Agent routes
│   │   ├── ar.py              # AR routes
│   │   ├── catalog.py         # Catalog routes
│   │   └── budget.py          # Budget routes
│   └── services/               # Business logic
│       ├── cv_service.py      # OpenCV room analysis
│       ├── llm_service.py     # Claude AI integration
│       ├── agent_service.py   # Agentic AI agents
│       └── ar_service.py      # AR scene creation
│
├── package.json               # Frontend dependencies
├── vite.config.ts            # Vite config
├── tsconfig.json             # TypeScript config
├── tailwind.config.ts        # TailwindCSS config
├── start-all.sh              # Startup script (Unix)
├── start-all.bat             # Startup script (Windows)
└── README.md                 # This file
```

## 🔐 Configuration

### Frontend Environment (.env)

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_API_TIMEOUT=30000
VITE_ENABLE_AR=true
```

### Backend Environment (backend/.env)

```env
FLASK_ENV=development
FLASK_PORT=3000
ANTHROPIC_API_KEY=sk-ant-v1-...
CV_CONFIDENCE_THRESHOLD=0.75
ENABLE_AR=true
```

## 🎯 Usage Examples

### 1. Analyze a Room

```typescript
import { analyzeRoomImage } from '@/services/roomService';

const imageFile = new File([imageData], 'room.jpg');
const result = await analyzeRoomImage({
  image: imageFile,
  detectDimensions: true,
  detectLighting: true
});

console.log(result.data); // See room analysis
```

### 2. Generate Design with LLM

```typescript
import { generateDesign } from '@/services/designService';

const design = await generateDesign({
  style: 'Modern Minimalist',
  room: 'Living Room',
  budget: '$5,000 - $10,000'
});

console.log(design.data.recommendations); // AI design
```

### 3. Use Agent to Plan Project

```typescript
import { planDesignProject } from '@/services/agentService';

const plan = await planDesignProject({
  room: 'Bedroom',
  style: 'Scandinavian',
  budget: 3000,
  constraints: ['small space', 'limited budget']
});

console.log(plan.data.plan); // Complete project plan
```

### 4. Create AR Scene

```typescript
import { createARScene } from '@/services/arService';

const scene = await createARScene({
  designId: 'design_001',
  furnitureList: [
    { name: 'Sofa', type: 'sofa', width: 2.5, height: 0.8 },
    { name: 'Coffee Table', type: 'table', width: 1.2, height: 0.75 }
  ],
  roomDimensions: { width: 5, height: 2.8, length: 5 }
});

// Visualize in AR
```

## 🚀 Build & Deploy

### Production Build

```bash
npm run build
```

Creates optimized build in `dist/`

### Deploy Frontend

**Vercel (Recommended)**
```bash
npm install -g vercel
vercel
```

**Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Deploy Backend

**Heroku**
```bash
heroku create homedesign-ai-backend
git push heroku main
```

**Docker**
```bash
cd backend
docker build -t homedesign-ai-backend .
docker run -p 3000:3000 --env-file .env homedesign-ai-backend
```

## 📖 Documentation

- [Backend API Guide](backend/README.md) - Complete API documentation
- [API Endpoints](API_GUIDE.md) - Endpoint specifications
- [Frontend Services](src/services/) - Service layer documentation
- [Backend Services](backend/services/) - AI service documentation

## 🤖 AI Technologies Used

| Technology | Purpose | Provider |
|-----------|---------|----------|
| Claude 3.5 Sonnet | Design recommendations & agents | Anthropic |
| OpenCV | Room image analysis | Open source |
| LangChain | Multi-agent orchestration | Open source |
| GLTF/USDZ | 3D AR models | Industry standard |

## 🔒 Security

- API keys stored in `.env` (never committed)
- CORS configured for frontend only
- Request validation on all endpoints
- No sensitive data logged
- File upload restricted to images only

## 🐛 Troubleshooting

### Backend Won't Start

```bash
# Check Python version
python --version  # Should be 3.9+

# Reinstall dependencies
cd backend
rm -rf venv
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Check port 3000 is available
netstat -an | grep 3000
```

### API Connection Issues

1. Verify backend is running: `curl http://localhost:3000/api/health`
2. Check `VITE_API_BASE_URL` in frontend `.env`
3. Check `CORS_ORIGINS` in backend `.env`
4. Review browser console for detailed errors

### Image Upload Fails

- Check file size (max 50MB)
- Check file type (JPG, PNG, GIF, WEBP)
- Verify upload directory permissions

## 📊 Performance

- **Frontend**: Optimized with Code splitting & lazy loading
- **Backend**: Async request handling
- **AI**: Streaming responses from LLM
- **AR**: GPU-accelerated rendering

## 🤝 Contributing

1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request with description

## 📄 License

Proprietary - All Rights Reserved

## 📞 Support

For issues and questions:
1. Check documentation
2. Review API Guide
3. Check backend/README.md
4. Review backend logs

## 🗂️ File Size & Structure

- **Frontend**: ~400 KB (minified + gzipped)
- **Backend**: ~50 MB (with all dependencies installed)
- **Total**: ~50 MB (production ready)

## 🎉 Recent Updates

- ✨ Agentic AI integration with extended thinking
- ✨ Computer Vision room analysis
- ✨ Claude LLM design recommendations
- ✨ Multi-agent design review system
- ✨ AR scene creation & visualization
- ✨ Budget optimization with AI

---

**Built with ❤️ using Agentic AI | Last Updated: February 2026**

**Status**: Production Ready  
**Frontend Version**: 1.0.0  
**Backend Version**: 1.0.0

## Getting Started

### Prerequisites

- Node.js 16+ (or Bun)
- npm or Bun package manager

### Installation

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd home-design-ai

# Step 3: Install dependencies
npm install
# or with Bun
bun install

# Step 4: Start the development server
npm run dev
# or with Bun
bun run dev
```

The application will be available at `http://localhost:8080`

## Available Scripts

```sh
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Build for development (with source maps)
npm run build:dev

# Preview production build locally
npm run preview

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint
```

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── ui/             # shadcn-ui components
│   ├── AppLayout.tsx   # Main layout wrapper
│   └── NavLink.tsx     # Navigation link component
├── pages/              # Page-level components
│   ├── HomePage.tsx
│   ├── DesignStudioPage.tsx
│   ├── ARCameraPage.tsx
│   ├── CatalogPage.tsx
│   ├── AnalyzePage.tsx
│   ├── BudgetPlannerPage.tsx
│   └── NotFound.tsx
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── assets/             # Static assets
├── styles/             # Global styles
├── App.tsx             # Main app component
└── main.tsx            # Application entry point
```

## Backend Configuration

To connect to your backend API, create a `.env` file in the project root:

```env
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:3000
VITE_API_TIMEOUT=30000

# Optional Features
VITE_ENABLE_AR=true
VITE_ENABLE_ANALYTICS=false
```

Update the API endpoints in your services to use the environment variable:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
```

## Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL (default: http://localhost:3000)
- `VITE_API_TIMEOUT` - API request timeout in milliseconds (default: 30000)
- `VITE_ENABLE_AR` - Enable/disable AR features (default: true)
- `VITE_ENABLE_ANALYTICS` - Enable/disable analytics (default: false)

## Deployment

### Build for Production

```sh
npm run build
npm run preview
```

The build output will be in the `dist/` directory.

### Deployment Platforms

The application can be deployed to:

- **Vercel** - Push to GitHub and connect to Vercel for automatic deployments
- **Netlify** - Connect your GitHub repo to Netlify
- **AWS Amplify** - Deploy through AWS console or CLI
- **Docker** - Use a Node.js container for production deployments

Example Dockerfile:

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app
RUN npm install -g http-server
COPY --from=builder /app/dist ./dist
EXPOSE 8080
CMD ["http-server", "dist", "-p", "8080"]
```

## Development

### Code Style

We use ESLint and TypeScript for code quality:

```sh
npm run lint
```

### Testing

Run the test suite:

```sh
npm run test
npm run test:watch
```

### Component Development

Components are organized in the `src/components` directory. UI components use shadcn-ui and Tailwind CSS. Follow these conventions:

- Use TypeScript for all components
- Export components as default exports
- Use Tailwind CSS for styling
- Keep components focused and reusable

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is privately licensed. All rights reserved.

## Support

For issues and questions:
1. Check existing documentation
2. Review the code comments
3. Open an issue in the repository
4. Contact the development team

## Contributing

Guidelines for contributing:

1. Create a feature branch from `main`
2. Make your changes with clear commit messages
3. Ensure tests pass: `npm run test`
4. Ensure code is linted: `npm run lint`
5. Submit a pull request

---

**Last Updated**: February 2026
