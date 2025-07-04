# WebSocket Setup and Troubleshooting Guide

## Overview

This application uses Socket.IO for real-time communication between the frontend and backend. The WebSocket implementation has been strengthened with better error handling, reconnection logic, and monitoring capabilities.

## Architecture

### Backend (Node.js + Socket.IO)
- **Server**: `backend/server.js`
- **Socket Emitter**: `backend/utils/socketEmitter.js`
- **Health Check**: `/api/websocket/status`

### Frontend (React + Socket.IO Client)
- **Socket Manager**: `frontend/src/lib/socket.ts`
- **Debug Utility**: `frontend/src/lib/socketDebug.ts`
- **Context Integration**: `frontend/src/context/AdminNotificationContext.tsx`

## Features

### ✅ Robust Connection Management
- Automatic reconnection with exponential backoff
- Connection health monitoring with ping/pong
- Proper cleanup on component unmount
- Authentication support

### ✅ Error Handling
- Comprehensive error logging
- Graceful degradation
- Connection state management
- Timeout handling

### ✅ Real-time Events
- New orders and reservations
- Payment confirmations
- Contact messages
- Admin notifications
- Status updates

### ✅ Monitoring & Debugging
- Connection statistics
- Health check endpoints
- Debug mode for development
- Performance monitoring

## Setup Instructions

### 1. Environment Configuration

#### Backend (.env)
```env
PORT=5000
FRONTEND_URL=http://localhost:8080
JWT_SECRET=your_jwt_secret
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 2. Dependencies

#### Backend
```json
{
  "socket.io": "^4.8.1"
}
```

#### Frontend
```json
{
  "socket.io-client": "^4.8.1"
}
```

### 3. Usage Examples

#### Basic Connection
```typescript
import { createSocketManager } from '@/lib/socket';

const socketManager = createSocketManager({
  url: 'http://localhost:5000',
  auth: {
    token: userToken,
    userId: user._id,
    role: user.role,
    name: user.name
  }
});

socketManager.connect()
  .then(() => {
    console.log('Connected successfully');
  })
  .catch((error) => {
    console.error('Connection failed:', error);
  });
```

#### Event Handling
```typescript
// Listen for events
socketManager.on('new_order', (data) => {
  console.log('New order received:', data);
});

// Emit events
socketManager.emit('custom_event', { data: 'value' });
```

#### Cleanup
```typescript
import { disconnectSocketManager } from '@/lib/socket';

// In useEffect cleanup
return () => {
  disconnectSocketManager();
};
```

## Health Monitoring

### Backend Health Check
```bash
curl http://localhost:5000/api/health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "websocket": {
    "connected": true,
    "clientsCount": 5,
    "activeAdmins": 2,
    "pendingLogins": 0
  }
}
```

### WebSocket Status
```bash
curl http://localhost:5000/api/websocket/status
```

Response:
```json
{
  "server": {
    "running": true,
    "clientsCount": 5,
    "uptime": 3600
  },
  "admins": {
    "active": 2,
    "list": [
      {
        "userId": "admin1",
        "name": "Admin User",
        "connectedAt": "2024-01-01T12:00:00.000Z",
        "socketId": "socket123"
      }
    ]
  },
  "pending": {
    "count": 0,
    "list": []
  }
}
```

## Troubleshooting

### Common Issues

#### 1. Connection Failed
**Symptoms**: `WebSocket connection error` in console
**Solutions**:
- Check if backend server is running
- Verify `VITE_SOCKET_URL` in frontend .env
- Check CORS configuration
- Ensure firewall allows WebSocket connections

#### 2. Authentication Errors
**Symptoms**: `Authentication failed` messages
**Solutions**:
- Verify JWT token is valid
- Check user role permissions
- Ensure token is being sent correctly

#### 3. Events Not Received
**Symptoms**: Real-time updates not working
**Solutions**:
- Check event names match between frontend and backend
- Verify socket is connected before listening
- Check browser console for errors
- Ensure proper cleanup in useEffect

#### 4. Memory Leaks
**Symptoms**: Multiple connections, high memory usage
**Solutions**:
- Always call `disconnectSocketManager()` in cleanup
- Remove event listeners properly
- Check for multiple socket instances

### Debug Mode

Enable debug mode in development:
```typescript
import socketDebugger from '@/lib/socketDebug';

// Debug mode is automatically enabled in development
// Manual control:
socketDebugger.enableDebugMode();
socketDebugger.disableDebugMode();

// Get connection info
const stats = socketDebugger.getConnectionStats();
console.log(stats);

// Test connection health
const health = await socketDebugger.testConnection();
console.log(health);
```

### Performance Monitoring

#### Connection Statistics
```typescript
const socketManager = getSocketManager();
const isConnected = socketManager?.isConnected();
const socket = socketManager?.getSocket();

console.log({
  connected: isConnected,
  socketId: socket?.id,
  transport: socket?.io?.engine?.transport?.name,
  readyState: socket?.io?.readyState
});
```

#### Event Monitoring
```typescript
// Monitor all events
socketManager?.on('*', (event, data) => {
  console.log(`Event: ${event}`, data);
});
```

## Best Practices

### 1. Connection Management
- Always handle connection errors gracefully
- Implement proper reconnection logic
- Clean up connections on component unmount
- Use singleton pattern for socket management

### 2. Event Handling
- Use descriptive event names
- Validate event data
- Handle missing or malformed data
- Implement proper error boundaries

### 3. Security
- Authenticate all connections
- Validate user permissions
- Sanitize event data
- Use HTTPS in production

### 4. Performance
- Limit event frequency
- Implement event throttling
- Monitor connection health
- Use efficient data formats

## Production Deployment

### Environment Variables
```env
# Production
VITE_SOCKET_URL=https://your-domain.com
NODE_ENV=production
```

### SSL/TLS
- Use HTTPS for WebSocket connections
- Configure proper SSL certificates
- Enable secure WebSocket (WSS)

### Load Balancing
- Configure sticky sessions for WebSocket connections
- Use Redis adapter for multiple server instances
- Monitor connection distribution

### Monitoring
- Set up connection monitoring
- Monitor event frequency
- Track error rates
- Set up alerts for connection issues

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console for errors
3. Check backend logs for connection issues
4. Use debug mode to gather more information
5. Verify environment configuration

## Changelog

### v2.0.0 (Current)
- ✅ Robust socket manager implementation
- ✅ Automatic reconnection with exponential backoff
- ✅ Comprehensive error handling
- ✅ Health monitoring and debugging tools
- ✅ Authentication support
- ✅ Performance optimizations

### v1.0.0 (Previous)
- Basic Socket.IO implementation
- Simple event handling
- Manual connection management 