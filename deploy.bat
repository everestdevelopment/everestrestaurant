@echo off
echo 🚀 Starting Everest Restaurant deployment...

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not installed. Please install Docker first.
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Compose is not installed. Please install Docker Compose first.
    exit /b 1
)

echo [INFO] Stopping existing containers...
docker-compose down

echo [INFO] Removing old images...
docker system prune -f

echo [INFO] Building and starting services...
docker-compose up --build -d

echo [INFO] Waiting for services to be ready...
timeout /t 30 /nobreak >nul

echo [INFO] Checking service status...

REM Check backend
curl -f http://localhost:5000/api/health >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Backend might still be starting up...
) else (
    echo [INFO] ✅ Backend is running on http://localhost:5000
)

REM Check frontend
curl -f http://localhost/health >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Frontend might still be starting up...
) else (
    echo [INFO] ✅ Frontend is running on http://localhost
)

echo [INFO] Container status:
docker-compose ps

echo [INFO] 🎉 Deployment completed!
echo [INFO] 📱 Frontend: http://localhost
echo [INFO] 🔧 Backend API: http://localhost:5000
echo [INFO] 📊 Health Check: http://localhost:5000/api/health

echo [WARNING] ⚠️  Don't forget to:
echo [WARNING]    1. Update environment variables in docker-compose.yml
echo [WARNING]    2. Configure your domain and SSL certificates
echo [WARNING]    3. Set up proper database backups
echo [WARNING]    4. Configure monitoring and logging

pause 