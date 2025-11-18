#!/usr/bin/env python3
"""
CrewAI Insurance Agent Copilot Startup Script
Starts the multi-agent CrewAI backend and frontend
"""

import os
import sys
import subprocess
import time
import signal
from pathlib import Path

def check_requirements():
    """Check if required dependencies are installed"""
    print("🔍 Checking CrewAI requirements...")
    
    try:
        import crewai
        print(f"✅ CrewAI version: {crewai.__version__}")
    except ImportError:
        print("❌ CrewAI not installed. Installing...")
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "backend/requirements_crewai.txt"])
    
    try:
        import fastapi
        print(f"✅ FastAPI version: {fastapi.__version__}")
    except ImportError:
        print("❌ FastAPI not installed")
        return False
    
    return True

def start_crewai_backend():
    """Start the CrewAI backend server"""
    print("🚀 Starting CrewAI Backend (Port 5001)...")
    
    backend_cmd = [
        sys.executable, "-m", "uvicorn", 
        "crewai_main:app", 
        "--reload", 
        "--port", "5001",
        "--host", "0.0.0.0"
    ]
    
    backend_process = subprocess.Popen(
        backend_cmd,
        cwd="backend",
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        universal_newlines=True,
        bufsize=1
    )
    
    return backend_process

def start_frontend():
    """Start the frontend development server"""
    print("🎨 Starting Frontend (Port 3000)...")
    
    # Update .env to point to CrewAI backend
    env_content = """# CrewAI Backend Configuration
PORT=5001
CLIENT_URL=http://localhost:3000
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Frontend Configuration  
VITE_API_URL=http://localhost:5001/api
"""
    
    with open('.env', 'w') as f:
        f.write(env_content)
    
    frontend_process = subprocess.Popen(
        ["npm", "run", "dev"],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        universal_newlines=True,
        bufsize=1
    )
    
    return frontend_process

def monitor_processes(backend_process, frontend_process):
    """Monitor both processes and handle output"""
    print("\n" + "="*70)
    print("🎯 Root Agent Insurance Copilot Started!")
    print("="*70)
    print("📊 Backend (Root Agent): http://localhost:5001")
    print("🎨 Frontend:             http://localhost:3000") 
    print("📚 API Docs:             http://localhost:5001/docs")
    print("="*70)
    print("🎯 Insurance Agent Supervisor (Root Agent)")
    print("   └── Intelligent delegation to specialist team:")
    print("       🎯 Lead Manager")
    print("       💬 Communication Specialist") 
    print("       📋 Task Coordinator")
    print("       📊 Analytics Expert")
    print("       🛡️ Compliance Officer")
    print("="*70)
    print("Press Ctrl+C to stop all services")
    print("="*60)
    
    try:
        while True:
            # Check if processes are still running
            backend_status = backend_process.poll()
            frontend_status = frontend_process.poll()
            
            if backend_status is not None:
                print(f"❌ Backend process exited with code {backend_status}")
                break
                
            if frontend_status is not None:
                print(f"❌ Frontend process exited with code {frontend_status}")
                break
            
            time.sleep(1)
            
    except KeyboardInterrupt:
        print("\n🛑 Shutting down services...")
        
        # Terminate processes
        backend_process.terminate()
        frontend_process.terminate()
        
        # Wait for graceful shutdown
        try:
            backend_process.wait(timeout=5)
            frontend_process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            backend_process.kill()
            frontend_process.kill()
        
        print("✅ All services stopped")

def main():
    """Main startup function"""
    print("🎯 Root Agent Insurance Copilot Startup")
    print("🤖 Hierarchical CrewAI with Intelligent Delegation")
    print("=" * 60)
    
    # Check if we're in the right directory
    if not Path("backend/crewai_main.py").exists():
        print("❌ Error: crewai_main.py not found in backend/")
        print("Please run this script from the project root directory")
        sys.exit(1)
    
    # Check requirements
    if not check_requirements():
        print("❌ Requirements check failed")
        sys.exit(1)
    
    # Check for API key
    if not os.getenv("GEMINI_API_KEY"):
        print("⚠️  Warning: GEMINI_API_KEY not set in environment")
        print("Please add your Gemini API key to .env file")
    
    try:
        # Start backend
        backend_process = start_crewai_backend()
        time.sleep(3)  # Give backend time to start
        
        # Start frontend
        frontend_process = start_frontend()
        time.sleep(2)  # Give frontend time to start
        
        # Monitor both processes
        monitor_processes(backend_process, frontend_process)
        
    except Exception as e:
        print(f"❌ Startup error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()