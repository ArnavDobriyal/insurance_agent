#!/usr/bin/env python3
"""
Insurance Agent Copilot - Unified Startup Script
Starts all servers: Backend API, Whisper Server, and Frontend
"""

import subprocess
import sys
import os
import time
import signal
from pathlib import Path
import platform
import shutil

# Colors for terminal output
class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_header(text):
    print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{text.center(60)}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}\n")

def print_success(text):
    print(f"{Colors.GREEN}✓ {text}{Colors.ENDC}")

def print_info(text):
    print(f"{Colors.CYAN}ℹ {text}{Colors.ENDC}")

def print_error(text):
    print(f"{Colors.FAIL}✗ {text}{Colors.ENDC}")

def print_warning(text):
    print(f"{Colors.WARNING}⚠ {text}{Colors.ENDC}")

# Store process references
processes = []

def cleanup(signum=None, frame=None):
    """Clean up all processes on exit"""
    print_header("Shutting Down")
    for name, process in processes:
        if process and process.poll() is None:
            print_info(f"Stopping {name}...")
            process.terminate()
            try:
                process.wait(timeout=5)
                print_success(f"{name} stopped")
            except subprocess.TimeoutExpired:
                process.kill()
                print_warning(f"{name} force killed")
    print_success("All services stopped")
    sys.exit(0)

# Register signal handlers
signal.signal(signal.SIGINT, cleanup)
signal.signal(signal.SIGTERM, cleanup)

def check_port(port):
    """Check if a port is already in use"""
    import socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('localhost', port))
    sock.close()
    return result == 0

def main():
    print_header("Insurance Agent Copilot Startup")
    
    # Get the project root directory
    project_root = Path(__file__).parent
    os.chdir(project_root)
    
    print_info("Project directory: " + str(project_root))
    
    # Check if ports are available
    print_info("Checking ports...")
    ports = {
        5000: "Backend API",
        5001: "Whisper Server",
        3000: "Frontend"
    }
    
    for port, service in ports.items():
        if check_port(port):
            print_warning(f"Port {port} ({service}) is already in use")
            response = input(f"Kill process on port {port}? (y/n): ")
            if response.lower() == 'y':
                os.system(f"lsof -ti:{port} | xargs kill -9 2>/dev/null")
                time.sleep(1)
                print_success(f"Port {port} freed")
            else:
                print_error(f"Cannot start {service} - port in use")
                return
    
    print_success("All ports available")
    
    # Start Backend API
    print_header("Starting Backend API (Port 5000)")
    try:
        backend_process = subprocess.Popen(
            [sys.executable, "backend/main.py"],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            universal_newlines=True,
            bufsize=1
        )
        processes.append(("Backend API", backend_process))
        print_success("Backend API starting...")
        time.sleep(3)  # Wait for backend to initialize
        
        if backend_process.poll() is not None:
            print_error("Backend API failed to start")
            return
        print_success("Backend API running on http://localhost:5000")
    except Exception as e:
        print_error(f"Failed to start Backend API: {e}")
        return
    
    # Start Whisper Server
    print_header("Starting Whisper Server (Port 5001)")
    try:
        whisper_process = subprocess.Popen(
            [sys.executable, "backend/whisper_server.py"],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            universal_newlines=True,
            bufsize=1
        )
        processes.append(("Whisper Server", whisper_process))
        print_success("Whisper Server starting...")
        print_info("Loading Whisper model (this may take a moment)...")
        time.sleep(5)  # Wait for Whisper to load model
        
        if whisper_process.poll() is not None:
            print_error("Whisper Server failed to start")
            return
        print_success("Whisper Server running on http://localhost:5001")
    except Exception as e:
        print_error(f"Failed to start Whisper Server: {e}")
        return
    
    # Start Frontend
    print_header("Starting Frontend (Port 3000)")
    try:
        # Check if node_modules exists
        if not (project_root / "node_modules").exists():
            print_warning("node_modules not found. Running npm install...")
            install_process = subprocess.run(
                ["npm", "install"],
                capture_output=True,
                text=True
            )
            if install_process.returncode != 0:
                print_error("npm install failed")
                print_error(install_process.stderr)
                return
            print_success("Dependencies installed")
        if platform.system() == "Windows":
            npm_executable = shutil.which("npm.cmd")
        else:
            npm_executable = shutil.which("npm")
        if npm_executable is None:
            print_error("npm executable not found. Please install Node.js and ensure npm is in PATH.")
            return
        frontend_process = subprocess.Popen(
            ["npm", "run", "dev"],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            universal_newlines=True,
            bufsize=1
        )
        processes.append(("Frontend", frontend_process))
        print_success("Frontend starting...")
        time.sleep(5)  # Wait for Vite to start
        
        if frontend_process.poll() is not None:
            print_error("Frontend failed to start")
            return
        print_success("Frontend running on http://localhost:3000")
    except Exception as e:
        print_error(f"Failed to start Frontend: {e}")
        return
    
    # All services started successfully
    print_header("All Services Running!")
    print_success("Backend API:     http://localhost:5000")
    print_success("Whisper Server:  http://localhost:5001")
    print_success("Frontend:        http://localhost:3000")
    print()
    print_info("Press Ctrl+C to stop all services")
    print()
    
    # Monitor processes
    try:
        while True:
            time.sleep(1)
            # Check if any process has died
            for name, process in processes:
                if process.poll() is not None:
                    print_error(f"{name} has stopped unexpectedly!")
                    cleanup()
                    return
    except KeyboardInterrupt:
        cleanup()

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print_error(f"Startup failed: {e}")
        cleanup()
        sys.exit(1)
