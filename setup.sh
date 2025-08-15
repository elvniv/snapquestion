#!/bin/bash

# SnapQuestion Setup Script
# This script sets up the entire SnapQuestion development environment

set -e  # Exit on error

echo "🚀 SnapQuestion Setup Script"
echo "============================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check prerequisites
echo "Checking prerequisites..."

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    print_status "Node.js installed: $NODE_VERSION"
else
    print_error "Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

# Check Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    print_status "Python installed: $PYTHON_VERSION"
else
    print_error "Python 3 is not installed. Please install Python 3.10+"
    exit 1
fi

# Check Docker
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    print_status "Docker installed: $DOCKER_VERSION"
else
    print_warning "Docker is not installed. You'll need it for the database."
fi

echo ""
echo "Setting up environment..."

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    print_status "Created .env file from template"
    print_warning "Please edit .env with your API keys"
else
    print_status ".env file already exists"
fi

echo ""
echo "Setting up backend..."

# Navigate to backend directory
cd snap-question-backend

# Create virtual environment if it doesn't exist
if [ ! -d .venv ]; then
    python3 -m venv .venv
    print_status "Created Python virtual environment"
else
    print_status "Virtual environment already exists"
fi

# Activate virtual environment and install dependencies
source .venv/bin/activate
pip install --quiet --upgrade pip
pip install --quiet -e .
print_status "Installed backend dependencies"

# Return to root
cd ..

echo ""
echo "Setting up frontend..."

# Navigate to frontend directory
cd snap-question

# Install npm dependencies
if [ ! -d node_modules ]; then
    npm install --silent
    print_status "Installed frontend dependencies"
else
    print_status "Frontend dependencies already installed"
fi

# Return to root
cd ..

echo ""
echo "Setting up widget..."

# Navigate to widget directory
cd widget

# Install npm dependencies
if [ ! -d node_modules ]; then
    npm install --silent
    print_status "Installed widget dependencies"
else
    print_status "Widget dependencies already installed"
fi

# Build widget
npm run build --silent
print_status "Built widget bundle"

# Return to root
cd ..

echo ""
echo "Setting up Docker services..."

# Check if Docker is running
if command -v docker &> /dev/null && docker info &> /dev/null; then
    cd infra/docker
    
    # Start Docker services
    docker-compose up -d
    
    # Wait for PostgreSQL to be ready
    echo "Waiting for PostgreSQL to be ready..."
    sleep 5
    
    # Apply database schema
    if docker exec -i $(docker ps -qf "name=snapq_db") psql -U postgres -d snapq < ../sql/init.sql 2>/dev/null; then
        print_status "Database schema applied"
    else
        print_warning "Database schema may already exist"
    fi
    
    cd ../..
    print_status "Docker services started"
else
    print_warning "Docker is not running. Please start Docker and run: cd infra/docker && docker-compose up -d"
fi

echo ""
echo "================================"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo "================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Edit the .env file with your API keys:"
echo "   - OpenAI API Key"
echo "   - Firebase credentials"
echo "   - Stripe keys (optional)"
echo ""
echo "2. Start the development servers:"
echo ""
echo "   Terminal 1 - Backend API:"
echo "   $ cd snap-question-backend"
echo "   $ source .venv/bin/activate"
echo "   $ uvicorn main:app --reload --port 8000"
echo ""
echo "   Terminal 2 - Background Worker:"
echo "   $ cd snap-question-backend"
echo "   $ source .venv/bin/activate"
echo "   $ python worker.py"
echo ""
echo "   Terminal 3 - Frontend:"
echo "   $ cd snap-question"
echo "   $ npm start"
echo ""
echo "3. Access the applications:"
echo "   - Frontend: http://localhost:3000"
echo "   - API: http://localhost:8000"
echo "   - API Docs: http://localhost:8000/docs"
echo "   - Widget Demo: Open widget/dist/demo.html"
echo ""
echo "Happy coding! 🚀"