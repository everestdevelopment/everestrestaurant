#!/bin/bash

# Everest Restaurant Deployment Script
echo "🚀 Starting Everest Restaurant deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose down

# Remove old images
print_status "Removing old images..."
docker system prune -f

# Build and start services
print_status "Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 30

# Check if services are running
print_status "Checking service status..."

# Check backend
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    print_status "✅ Backend is running on http://localhost:5000"
else
    print_warning "⚠️  Backend might still be starting up..."
fi

# Check frontend
if curl -f http://localhost/health > /dev/null 2>&1; then
    print_status "✅ Frontend is running on http://localhost"
else
    print_warning "⚠️  Frontend might still be starting up..."
fi

# Show container status
print_status "Container status:"
docker-compose ps

print_status "🎉 Deployment completed!"
print_status "📱 Frontend: http://localhost"
print_status "🔧 Backend API: http://localhost:5000"
print_status "📊 Health Check: http://localhost:5000/api/health"

print_warning "⚠️  Don't forget to:"
print_warning "   1. Update environment variables in docker-compose.yml"
print_warning "   2. Configure your domain and SSL certificates"
print_warning "   3. Set up proper database backups"
print_warning "   4. Configure monitoring and logging" 