# Deployment & Testing Guide

This guide will help you successfully deploy and test the **Home Design AI - Agentic AI System**.

## 📋 Prerequisites

- **Node.js**: v18 or higher
- **Python**: 3.9 or higher
- **Anthropic API Key**: Get from https://console.anthropic.com
- **2 Terminal windows** (or tabs)

## ✅ Step 1: Verify Prerequisites

### Check Node.js
```bash
node --version
npm --version
```

Expected: Node v18+, npm 9+

### Check Python
```bash
python --version
```

Expected: Python 3.9+

## 🚀 Quick Start (Recommended)

### Windows Users
Simply run from project root:
```bash
start-all.bat
```

This automatically starts both servers in separate windows.

### Mac/Linux Users
```bash
bash start-all.sh
```

Then skip to [Step 4: Verify Deployment](#step-4-verify-deployment).

---

## 📝 Manual Setup (If Quick Start Doesn't Work)

### Step 2a: Setup Backend

**Terminal 1:**
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 2b: Configure Backend

1. Open `backend/.env`
2. Find the line: `ANTHROPIC_API_KEY=sk-ant-v1-your-key-here`
3. Replace `sk-ant-v1-your-key-here` with your actual Anthropic API key
4. Save the file

**Get your API key:**
- Visit https://console.anthropic.com
- Click "API Keys" in sidebar
- Create new API key and copy it
- Paste into `.env` file

### Step 2c: Start Backend

**Terminal 1 (continuing):**
```bash
python app.py
```

✅ You should see:
```
Flask application initialized successfully
WARNING in werkzeug - Running on http://0.0.0.0:3000
```

### Step 3a: Setup Frontend

**Terminal 2:**
```bash
# From project root (not backend folder)
npm install

# Start development server
npm run dev
```

✅ You should see:
```
VITE v4.x.x ready in xxx ms

➜ Local: http://localhost:8080/
```

---

## ✔️ Step 4: Verify Deployment

### 4.1 Verify Backend Health

**Terminal 3 (or new tab):**

**Windows (PowerShell):**
```powershell
curl http://localhost:3000/api/health
```

**Mac/Linux (Terminal):**
```bash
curl http://localhost:3000/api/health
```

✅ Expected Response:
```json
{"success": true, "message": "Backend is running"}
```

### 4.2 Verify Frontend

Open browser and go to: **http://localhost:8080**

✅ Expected:
- Homepage loads
- Navigation bar visible
- No errors in console (Press F12)

### 4.3 Verify API Connection

Open browser DevTools (F12) → Network tab, then:

1. Click **"Design Studio"** navigation link
2. Scroll down and interact with the application
3. Check Network tab for API calls
4. Look for requests to `http://localhost:3000/api/*`

✅ Expected:
- API requests show in Network tab
- Responses contain `"success": true`

---

## 🧪 Test Each Feature

### Test 1: Room Analysis (Computer Vision)

1. Go to **"Analyze"** page (if available in UI)
2. Upload a room image
3. Click analyze button
4. Wait for response

✅ Expected: See room analysis results (room type, dimensions, lighting, colors)

**Manual API Test:**

```bash
# Using curl with a sample image
curl -X POST http://localhost:3000/api/rooms/analyze \
  -F "image=@/path/to/room-image.jpg"
```

### Test 2: AI Design Generation (LLM)

1. Go to **"Design Studio"**
2. Fill in design preferences
3. Click "Generate Design"
4. Wait for AI response

✅ Expected: See AI-generated design recommendations with specific suggestions

**Manual API Test:**

```bash
curl -X POST http://localhost:3000/api/designs/generate \
  -H "Content-Type: application/json" \
  -d '{
    "style": "Modern",
    "room": "Living Room"
  }'
```

### Test 3: Agentic AI (Agent Planning)

1. Go to **"Design Agent"** page (if available)
2. Enter room and budget
3. Click "Plan My Design"
4. Wait for comprehensive plan

✅ Expected: See detailed project plan with timeline and budget breakdown

**Manual API Test:**

```bash
curl -X POST http://localhost:3000/api/agents/plan-design \
  -H "Content-Type: application/json" \
  -d '{
    "room": "Bedroom",
    "style": "Scandinavian",
    "budget": 5000,
    "constraints": ["small space"]
  }'
```

### Test 4: AR Visualization

1. Go to **"AR Camera"** page
2. Select a design
3. Click "View in AR"
4. See 3D furniture in your space

✅ Expected: See the AR scene loading with furniture

---

## 🔍 Troubleshooting

### Backend Won't Start

**Error:** `Port 3000 already in use`

Solution: Change port in `backend/.env`
```env
FLASK_PORT=3001
```

**Error:** `ModuleNotFoundError: No module named 'flask'`

Solution: Reinstall dependencies
```bash
cd backend
pip install -r requirements.txt
```

**Error:** `ANTHROPIC_API_KEY not found`

Solution: 
1. Check `backend/.env` exists
2. Verify API key is set correctly
3. Don't add quotes around the key

### Frontend Won't Start

**Error:** `Command not found: npm`

Solution:
- Install Node.js from https://nodejs.org
- Close and reopen terminal
- Try again

**Error:** `Port 8080 already in use`

Solution: Use different port
```bash
npm run dev -- --port 3001
```

### API Calls Return 404

**Issue:** Frontend can't reach backend

Check:
1. Backend is running: `curl http://localhost:3000/api/health`
2. Frontend `VITE_API_BASE_URL` contains `http://localhost:3000`
3. CORS is enabled in `backend/.env`

### API Returns Error

1. Check backend logs in Terminal 1
2. Look for error messages
3. Verify API key is correct in `.env`
4. Check request format matches examples above

---

## 📦 Production Deployment

### Deploy Backend (Heroku)

```bash
# Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login

# Create app
heroku create your-app-name-backend

# Set environment variables
heroku config:set ANTHROPIC_API_KEY=sk-ant-...

# Deploy
git push heroku main
```

### Deploy Frontend (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variable
vercel env add VITE_API_BASE_URL https://your-app-name-backend.herokuapp.com
```

### Docker Deployment

**Build Docker image:**
```bash
cd backend
docker build -t homedesign-backend .
docker run -p 3000:3000 \
  -e ANTHROPIC_API_KEY=sk-ant-... \
  homedesign-backend
```

---

## 📊 Monitoring

### Check Backend Health
```bash
curl http://localhost:3000/api/health
```

### View Backend Logs
The logs appear in Terminal 1. Watch for:
- API requests
- Errors
- Processing times

### Advanced Testing
Use Postman or similar API client:

1. Download Postman: https://www.postman.com/downloads/
2. Create new POST request: `http://localhost:3000/api/designs/generate`
3. Set headers: `Content-Type: application/json`
4. Send test data
5. View response in detail

---

## ✨ What to Expect

### First Time Setup
- ⏱️ Backend setup: 2-5 minutes (pip install)
- ⏱️ Frontend setup: 1-2 minutes (npm install)
- ⏱️ Startup time: 5-10 seconds

### First API Request
- ⏱️ LLM responses: 5-15 seconds (first request may be slower)
- ⏱️ Room analysis: 2-3 seconds
- ⏱️ AR scene creation: 1-2 seconds

### Features Enabled
- ✓ Room image analysis (Computer Vision)
- ✓ AI design recommendations (Claude LLM)
- ✓ Agent-based planning (Agentic AI)
- ✓ AR visualization (3D scenes)
- ✓ Budget optimization
- ✓ Product cataloging

---

## 📞 Support & Help

### Check These Files
- [backend/README.md](backend/README.md) - Full API documentation
- [README.md](README.md) - Project overview

### Common Questions

**Q: Do I need to restart when I change .env?**
A: Yes, restart `python app.py`

**Q: Can I access from my phone?**
A: Yes, use your computer's IP address instead of localhost
```bash
frontend: http://192.168.1.xxx:8080
backend: http://192.168.1.xxx:3000
```

**Q: How do I update the AI model?**
A: Edit `backend/services/llm_service.py` line with `model="claude-3-5-sonnet-20241022"`

**Q: Can I add authentication?**
A: See [backend/README.md](backend/README.md) for security setup

---

## ✅ Verification Checklist

- [ ] Python installed (python --version)
- [ ] Node.js installed (node --version)
- [ ] `.env` configured with API key
- [ ] Backend starts without errors
- [ ] Frontend starts on port 8080
- [ ] Health check returns success: `curl http://localhost:3000/api/health`
- [ ] Frontend loads at http://localhost:8080
- [ ] Network tab shows API requests
- [ ] At least one feature works (design generation, room analysis, etc.)

✨ **System is ready for production use once all checks pass!**

---

**Last Updated**: February 2026  
**Version**: 1.0.0  
**Status**: Production Ready
