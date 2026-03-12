# Quick Start Cheatsheet

## 🚀 Start Everything (2 Commands)

**Windows:**
```bash
start-all.bat
```

**Mac/Linux:**
```bash
bash start-all.sh
```

Then open: **http://localhost:8080**

---

## 🔧 Manual Start (If Needed)

### Terminal 1 - Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```

Visit: **http://localhost:3000/api/health** (verify it works)

### Terminal 2 - Frontend
```bash
npm install
npm run dev
```

Visit: **http://localhost:8080**

---

## 🔑 Important: Configure API Key

1. Open `backend/.env`
2. Find line: `ANTHROPIC_API_KEY=sk-ant-v1-your-key-here`
3. Replace with your actual Anthropic API key
4. Restart backend: `python app.py`

**Get free key**: https://console.anthropic.com

---

## 🧪 Test Individual Features

### Test 1: Backend Health
```bash
curl http://localhost:3000/api/health
```
Expected: `{"success": true, "message": "Backend is running"}`

### Test 2: AI Design Generation
```bash
curl -X POST http://localhost:3000/api/designs/generate \
  -H "Content-Type: application/json" \
  -d '{"style": "Modern", "room": "Living Room"}'
```

### Test 3: Agent Planning
```bash
curl -X POST http://localhost:3000/api/agents/plan-design \
  -H "Content-Type: application/json" \
  -d '{"room": "Bedroom", "budget": 5000}'
```

### Test 4: Room Analysis
```bash
# Upload a JPG:
curl -X POST http://localhost:3000/api/rooms/analyze \
  -F "image=@room.jpg"
```

---

## 📁 File Structure Guide

```
home-design-ai/
├── backend/              ← Python Flask server
│   ├── app.py           → Main Flask app
│   ├── requirements.txt  → Dependencies
│   ├── .env            → Configuration (add API key here!)
│   ├── services/       → AI logic (CV, LLM, Agents, AR)
│   └── routes/         → API endpoints
│
├── src/                ← React frontend
│   ├── pages/          → Page components
│   ├── components/     → React components
│   └── services/       → API client functions
│
├── start-all.bat       ← Windows startup
├── start-all.sh        ← Mac/Linux startup
├── README.md           ← Project overview
├── DEPLOYMENT_GUIDE.md → Detailed setup
└── API_ENDPOINTS.md    → All API endpoints
```

---

## 🎯 Core Features

| Feature | How to Use | Endpoint |
|---------|-----------|----------|
| **Room Analysis** | Upload room photo | `POST /api/rooms/analyze` |
| **AI Design** | Fill design form | `POST /api/designs/generate` |
| **Agent Planning** | Review project plan | `POST /api/agents/plan-design` |
| **AR Viewer** | See 3D design | `POST /api/ar/scenes` |
| **Budget** | Plan budget | `POST /api/budget` |
| **Catalog** | Browse products | `GET /api/catalog/products` |

---

## ⚡ Common Commands

| Task | Command |
|------|---------|
| Install Python deps | `cd backend && pip install -r requirements.txt` |
| Install NPM deps | `npm install` |
| Start backend | `cd backend && python app.py` |
| Start frontend | `npm run dev` |
| Build frontend | `npm run build` |
| Check backend health | `curl http://localhost:3000/api/health` |
| View backend logs | Press `Ctrl+C` to stop, check output |
| View frontend logs | Check Browser DevTools (F12) |

---

## 🐛 Quick Fixes

**Port 3000 in use?**
```bash
# Change port in backend/.env
FLASK_PORT=3001
```

**Port 8080 in use?**
```bash
npm run dev -- --port 3001
```

**Backend won't start?**
```bash
# Check Python version
python --version  # Should be 3.9+

# Reinstall deps
cd backend
rm -rf venv
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**No API response?**
1. Check backend is running: `curl http://localhost:3000/api/health`
2. Check API key in `backend/.env`
3. Check browser DevTools (F12) → Network tab for errors

---

## 📊 Technology Stack (Quick Reference)

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + TypeScript | UI |
| **Frontend Build** | Vite | Fast build |
| **UI Framework** | shadcn-ui | Components |
| **Styling** | TailwindCSS | Design |
| **Backend** | Flask 2.3 | Web server |
| **AI Model** | Claude 3.5 Sonnet | Design recommendations |
| **Computer Vision** | OpenCV | Room analysis |
| **Agents** | LangChain | Autonomous AI |
| **AR** | GLTF/USDZ | 3D visualization |

---

## 🎨 Design Styles Available

- Modern Minimalist
- Scandinavian  
- Bohemian
- Traditional
- Industrial
- Contemporary
- Transitional
- Farmhouse

---

## 🌍 Environment Variables

### Backend (backend/.env)
```env
FLASK_ENV=development          # or production
FLASK_PORT=3000               # Change if needed
ANTHROPIC_API_KEY=sk-ant-...  # REQUIRED - Add your key!
CV_CONFIDENCE_THRESHOLD=0.75   # CV detection threshold
AR_ENABLE=true                 # Enable AR features
CORS_ORIGINS=http://localhost:8080
```

### Frontend (.env or vite.config.ts)
```env
VITE_API_BASE_URL=http://localhost:3000
```

---

## 📱 Accessing from Phone/Tablet

Instead of `localhost`, use your computer's IP:

```
Frontend: http://192.168.1.100:8080
Backend:  http://192.168.1.100:3000
```

Find your IP:
- **Windows**: `ipconfig` (look for IPv4)
- **Mac/Linux**: `ifconfig` (look for inet)

---

## 🔒 Pre-Launch Checklist

- [ ] Python installed: `python --version`
- [ ] Node.js installed: `node --version`
- [ ] `.env` has API key: `ANTHROPIC_API_KEY=sk-ant-...`
- [ ] Backend starts: `python backend/app.py`
- [ ] Frontend starts: `npm run dev`
- [ ] Health check works: `curl http://localhost:3000/api/health`
- [ ] Frontend loads: http://localhost:8080

---

## 📚 Full Documentation

For detailed information, see:
- **[README.md](README.md)** - Project overview
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Complete setup guide
- **[API_ENDPOINTS.md](API_ENDPOINTS.md)** - All API endpoints
- **[backend/README.md](backend/README.md)** - Backend documentation

---

## 💡 Pro Tips

1. **Use curl to test APIs**:
   ```bash
   curl http://localhost:3000/api/health
   ```

2. **Check Network tab for API issues**:
   - Open DevTools (F12)
   - Go to Network tab
   - Reload page
   - Look for API calls and responses

3. **Keep `.env` secret**:
   - Never commit to git
   - Never share API keys
   - Never push to GitHub

4. **API responses always follow pattern**:
   ```json
   {
     "success": true/false,
     "data": {...},
     "error": "error message if failure"
   }
   ```

5. **Frontend automatically connects to backend**:
   - No extra config needed
   - Just ensure both are running
   - Check CORS in backend/.env if issues

---

## 🚀 Deployment

**Simple deployment** (Heroku):
```bash
cd backend
heroku create myapp-backend
heroku config:set ANTHROPIC_API_KEY=sk-ant-...
git push heroku main
```

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for more options.

---

## 📞 Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check Python 3.9+, reinstall `pip install -r requirements.txt` |
| frontend won't start | Check Node.js 18+, run `npm install`, check port 8080 |
| API returns 404 | Check backend is running on port 3000 |
| API returns error | Check `.env` has valid API key, check logs |
| No response from API | Check CORS in `backend/.env` |
| Image upload fails | Check file size < 50MB, format is JPG/PNG |

---

## ✨ System Architecture (Visual)

```
┌─────────────────────────────────────────────────────┐
│  React Frontend (Port 8080)                        │
│  ├─ Design Studio                                   │
│  ├─ Room Analyzer                                   │
│  ├─ AR Camera                                       │
│  ├─ Budget Planner                                  │
│  └─ Catalog                                         │
└──────────────────┬──────────────────────────────────┘
                   │ HTTP Requests
        ┌──────────▼──────────┐
        │  Flask API (3000)   │
        ├────────────────────┤
        │ Routes             │
        │ ├─ /rooms/*        │
        │ ├─ /designs/*      │
        │ ├─ /agents/*       │
        │ ├─ /ar/*           │
        │ ├─ /catalog/*      │
        │ └─ /budget/*       │
        └────────┬──────┬────┘
                 │      │
         ┌───────▼──────▼──────┐
         │   AI Services       │
         ├─────────────────────┤
         │ CV (OpenCV)         │
         │ LLM (Claude)        │
         │ Agents (LangChain)  │
         │ AR (GLTF)           │
         └─────────────────────┘
```

---

**Status**: ✅ Production Ready  
**Last Updated**: February 2026  
**Version**: 1.0.0
