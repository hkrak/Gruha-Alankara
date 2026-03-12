#!/bin/bash
# Home Design AI - Complete Startup Script
# Starts both frontend and backend servers

echo ""
echo "============================================"
echo "Home Design AI - Agentic Design System"
echo "============================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: Please run this script from the project root directory"
    exit 1
fi

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set trap for cleanup
trap cleanup EXIT INT TERM

# Start backend
echo "[1/2] Starting Flask Backend..."
echo "Backend URL: http://localhost:3000"
echo ""
BACKEND_DIR="$(cd "$(dirname "$0")" && pwd)/backend"
if [ ! -x "$BACKEND_DIR/venv/bin/python" ]; then
    echo "Creating backend virtual environment..."
    python3 -m venv "$BACKEND_DIR/venv"
fi

echo "Upgrading pip/setuptools/wheel..."
"$BACKEND_DIR/venv/bin/python" -m pip install --upgrade pip setuptools wheel

echo "Installing backend dependencies (core)..."
"$BACKEND_DIR/venv/bin/python" -m pip install -r "$BACKEND_DIR/requirements-core.txt"

cd backend
./venv/bin/python app.py &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "[2/2] Starting React Frontend..."
echo "Frontend URL: http://localhost:8080"
echo ""
npm run dev &
FRONTEND_PID=$!

echo ""
echo "============================================"
echo "✓ Both servers are starting..."
echo ""
echo "Frontend: http://localhost:8080"
echo "Backend:  http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop servers"
echo "============================================"
echo ""

# Wait for both processes
wait
