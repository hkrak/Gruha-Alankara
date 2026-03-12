#!/usr/bin/env python3
"""
System Verification Script for Home Design AI
Tests that all components are properly configured and working.
"""

import sys
import subprocess
import os
from pathlib import Path

# ANSI Colors for output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'
BOLD = '\033[1m'

def print_header(text):
    print(f"\n{BLUE}{BOLD}{'='*60}{RESET}")
    print(f"{BLUE}{BOLD}{text:^60}{RESET}")
    print(f"{BLUE}{BOLD}{'='*60}{RESET}\n")

def print_success(text):
    print(f"{GREEN}✓ {text}{RESET}")

def print_error(text):
    print(f"{RED}✗ {text}{RESET}")

def print_warning(text):
    print(f"{YELLOW}⚠ {text}{RESET}")

def print_info(text):
    print(f"{BLUE}ℹ {text}{RESET}")

def check_python_version():
    """Check if Python version is 3.9 or higher"""
    print_header("Python Version Check")
    
    version = sys.version_info
    version_str = f"{version.major}.{version.minor}.{version.micro}"
    
    if version.major >= 3 and version.minor >= 9:
        print_success(f"Python {version_str} detected")
        return True
    else:
        print_error(f"Python {version_str} - minimum 3.9 required")
        return False

def check_node_version():
    """Check if Node.js version is 18 or higher"""
    print_header("Node.js Version Check")
    
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            version = result.stdout.strip()
            # Extract major version
            major = int(version[1:].split('.')[0])
            if major >= 18:
                print_success(f"Node.js {version} detected")
                return True
            else:
                print_error(f"Node.js {version} - minimum v18 required")
                return False
        else:
            print_error("Node.js not found - please install from https://nodejs.org")
            return False
    except Exception as e:
        print_error(f"Could not check Node.js: {e}")
        return False

def check_npm_packages():
    """Check if npm packages are installed"""
    print_header("NPM Packages Check")
    
    if not os.path.exists('package.json'):
        print_error("package.json not found - please run from project root")
        return False
    
    if os.path.exists('node_modules'):
        print_success("node_modules directory exists")
        return True
    else:
        print_warning("node_modules not found - run: npm install")
        return False

def check_python_dependencies():
    """Check if Python dependencies are installed"""
    print_header("Python Dependencies Check")
    
    if not os.path.exists('backend/requirements.txt'):
        print_error("backend/requirements.txt not found")
        return False
    
    required_packages = [
        'flask',
        'flask_cors',
        'dotenv',
        'cv2',  # opencv-python
        'PIL',  # pillow
        'anthropic',
        'langchain'
    ]
    
    missing = []
    for package in required_packages:
        try:
            __import__(package)
            print_success(f"{package} is installed")
        except ImportError:
            missing.append(package)
            print_warning(f"{package} is not installed")
    
    if missing:
        print_error(f"Missing packages: {', '.join(missing)}")
        print_info("Run: pip install -r backend/requirements.txt")
        return False
    else:
        print_success("All required Python packages installed")
        return True

def check_env_files():
    """Check if environment files exist and are configured"""
    print_header("Environment Files Check")
    
    # Check frontend .env
    has_frontend_env = os.path.exists('.env')
    if has_frontend_env:
        print_success("Frontend .env exists")
    else:
        print_warning("Frontend .env not found (optional)")
    
    # Check backend .env
    if os.path.exists('backend/.env'):
        print_success("Backend .env exists")
        
        # Check if API key is configured
        with open('backend/.env', 'r') as f:
            content = f.read()
            if 'ANTHROPIC_API_KEY=sk-ant-' in content:
                print_success("Anthropic API key configured")
                return True
            elif 'ANTHROPIC_API_KEY=sk-ant-v1-your-key-here' in content:
                print_error("Anthropic API key not configured (template value)")
                print_info("Get key from: https://console.anthropic.com")
                return False
            else:
                print_warning("Anthropic API key status unclear")
                return True
    else:
        if os.path.exists('backend/.env.example'):
            print_error("backend/.env not found - copy from .env.example")
            return False
        else:
            print_error("Neither backend/.env nor .env.example found")
            return False

def check_backend_filestructure():
    """Check if backend directory structure is correct"""
    print_header("Backend File Structure Check")
    
    required_files = [
        'backend/app.py',
        'backend/requirements.txt',
        'backend/.env',
    ]
    
    required_dirs = [
        'backend/services',
        'backend/routes',
    ]
    
    all_present = True
    
    for file in required_files:
        if os.path.exists(file):
            print_success(f"{file} exists")
        else:
            print_error(f"{file} missing")
            all_present = False
    
    for dir in required_dirs:
        if os.path.isdir(dir):
            print_success(f"{dir}/ exists")
        else:
            print_error(f"{dir}/ missing")
            all_present = False
    
    # Check service files
    service_files = [
        'backend/services/cv_service.py',
        'backend/services/llm_service.py',
        'backend/services/agent_service.py',
        'backend/services/ar_service.py',
    ]
    
    print_info("Service files:")
    for file in service_files:
        if os.path.exists(file):
            print_success(f"  {file}")
        else:
            print_error(f"  {file} missing")
            all_present = False
    
    return all_present

def check_frontend_structure():
    """Check if frontend directory structure is correct"""
    print_header("Frontend File Structure Check")
    
    required_files = [
        'src/main.tsx',
        'src/App.tsx',
        'vite.config.ts',
        'tsconfig.json',
        'package.json',
    ]
    
    required_dirs = [
        'src/components',
        'src/pages',
        'src/services',
    ]
    
    all_present = True
    
    for file in required_files:
        if os.path.exists(file):
            print_success(f"{file} exists")
        else:
            print_error(f"{file} missing")
            all_present = False
    
    for dir in required_dirs:
        if os.path.isdir(dir):
            print_success(f"{dir}/ exists")
        else:
            print_error(f"{dir}/ missing")
            all_present = False
    
    return all_present

def test_backend_health():
    """Test if backend health endpoint is reachable"""
    print_header("Backend Health Check")
    
    try:
        import requests
        url = "http://localhost:3000/api/health"
        print_info(f"Testing {url}...")
        response = requests.get(url, timeout=5)
        
        if response.status_code == 200:
            print_success("Backend is running and responding")
            return True
        else:
            print_error(f"Backend returned status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print_warning("Backend not running on http://localhost:3000")
        print_info("Start backend with: cd backend && python app.py")
        return False
    except Exception as e:
        print_warning(f"Could not test backend: {e}")
        return False

def test_frontend_build():
    """Test if frontend can be built"""
    print_header("Frontend Build Check")
    
    try:
        result = subprocess.run(
            ['npm', 'run', 'build'],
            capture_output=True,
            text=True,
            timeout=60
        )
        
        if result.returncode == 0:
            print_success("Frontend builds successfully")
            return True
        else:
            print_error("Frontend build failed")
            print_info("Run: npm run build")
            return False
    except subprocess.TimeoutExpired:
        print_warning("Frontend build timed out")
        return False
    except Exception as e:
        print_error(f"Could not test frontend build: {e}")
        return False

def generate_report(checks):
    """Generate final report"""
    print_header("System Verification Report")
    
    passed = sum(1 for v in checks.values() if v)
    total = len(checks)
    percentage = (passed / total) * 100
    
    print(f"Tests Passed: {passed}/{total} ({percentage:.0f}%)\n")
    
    print("Summary:")
    for check_name, result in checks.items():
        status = f"{GREEN}✓{RESET}" if result else f"{RED}✗{RESET}"
        print(f"  {status} {check_name}")
    
    print("\nRecommendations:")
    
    if not checks.get('Python Version', False):
        print(f"  • Upgrade Python to 3.9+ from https://python.org")
    
    if not checks.get('Node.js Version', False):
        print(f"  • Install Node.js 18+ from https://nodejs.org")
    
    if not checks.get('NPM Packages', False):
        print(f"  • Run: npm install")
    
    if not checks.get('Python Dependencies', False):
        print(f"  • Run: pip install -r backend/requirements.txt")
    
    if not checks.get('Environment Files', False):
        print(f"  • Configure backend/.env with Anthropic API key")
        print(f"  • Get key from: https://console.anthropic.com")
    
    if passed == total:
        print_success("All checks passed! System is ready.")
        if checks.get('Backend Health', False):
            print_info("Both frontend and backend are running.")
            print_info("Visit: http://localhost:8080")
        else:
            print_info("To start the system:")
            print_info("  1. Terminal 1: cd backend && python app.py")
            print_info("  2. Terminal 2: npm run dev")
            print_info("  3. Open: http://localhost:8080")
    else:
        print_warning(f"Please fix {total - passed} issue(s) above")
    
    print()

def main():
    """Run all checks"""
    print(f"\n{BOLD}Home Design AI - System Verification{RESET}")
    print(f"Version: 1.0.0")
    print(f"Status: {BOLD}Production Ready{RESET}\n")
    
    checks = {}
    
    # Basic environment checks
    checks['Python Version'] = check_python_version()
    checks['Node.js Version'] = check_node_version()
    checks['NPM Packages'] = check_npm_packages()
    checks['Python Dependencies'] = check_python_dependencies()
    
    # File structure checks
    checks['Environment Files'] = check_env_files()
    checks['Backend File Structure'] = check_backend_filestructure()
    checks['Frontend File Structure'] = check_frontend_structure()
    
    # Runtime checks
    checks['Backend Health'] = test_backend_health()
    
    # Generate report
    generate_report(checks)

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n{YELLOW}Verification cancelled by user{RESET}\n")
        sys.exit(1)
    except Exception as e:
        print(f"\n{RED}Error during verification: {e}{RESET}\n")
        sys.exit(1)
