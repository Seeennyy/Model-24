const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: process.env.NODE_ENV === 'production' ? false : ["http://localhost:3000"],
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "ws:", "wss:"]
        }
    }
}));
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

// Environment variables
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Simulation state
let simulationState = {
    isRunning: false,
    startTime: null,
    metrics: {
        productionRate: 0,
        efficiency: 0,
        powerConsumption: 0,
        waterConsumption: 0
    },
    systems: {
        water: 'offline',
        electrolysis: 'offline',
        purification: 'offline',
        compression: 'offline',
        storage: 'offline',
        power: 'offline'
    },
    failures: [],
    maintenance: []
};

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);
    
    // Send current state to new client
    socket.emit('simulation_state', simulationState);
    
    // Handle client events
    socket.on('start_factory', () => {
        console.log('🏭 Factory start requested');
        simulationState.isRunning = true;
        simulationState.startTime = Date.now();
        
        // Update system statuses
        simulationState.systems.water = 'starting';
        simulationState.systems.electrolysis = 'starting';
        simulationState.systems.purification = 'starting';
        simulationState.systems.compression = 'starting';
        simulationState.systems.storage = 'starting';
        simulationState.systems.power = 'starting';
        
        // Broadcast to all clients
        io.emit('simulation_state', simulationState);
        io.emit('factory_started', { timestamp: Date.now() });
        
        // Simulate startup sequence
        simulateStartupSequence();
    });
    
    socket.on('stop_factory', () => {
        console.log('🛑 Factory stop requested');
        simulationState.isRunning = false;
        simulationState.startTime = null;
        
        // Update system statuses
        Object.keys(simulationState.systems).forEach(system => {
            simulationState.systems[system] = 'offline';
        });
        
        // Broadcast to all clients
        io.emit('simulation_state', simulationState);
        io.emit('factory_stopped', { timestamp: Date.now() });
    });
    
    socket.on('emergency_stop', () => {
        console.log('🚨 Emergency stop activated!');
        simulationState.isRunning = false;
        simulationState.startTime = null;
        
        // Update system statuses
        Object.keys(simulationState.systems).forEach(system => {
            simulationState.systems[system] = 'emergency_stop';
        });
        
        // Broadcast to all clients
        io.emit('simulation_state', simulationState);
        io.emit('emergency_stop', { timestamp: Date.now() });
    });
    
    socket.on('system_control', (data) => {
        console.log('🎛️ System control:', data);
        
        const { system, action, parameters } = data;
        
        switch (action) {
            case 'start':
                simulationState.systems[system] = 'running';
                break;
            case 'stop':
                simulationState.systems[system] = 'stopped';
                break;
            case 'maintenance':
                simulationState.systems[system] = 'maintenance';
                break;
        }
        
        // Broadcast updated state
        io.emit('simulation_state', simulationState);
        io.emit('system_updated', { system, action, timestamp: Date.now() });
    });
    
    socket.on('disconnect', () => {
        console.log('🔌 Client disconnected:', socket.id);
    });
});

// Simulate startup sequence
function simulateStartupSequence() {
    const startupSteps = [
        { system: 'power', delay: 2000, status: 'running' },
        { system: 'water', delay: 4000, status: 'running' },
        { system: 'electrolysis', delay: 6000, status: 'running' },
        { system: 'purification', delay: 8000, status: 'running' },
        { system: 'compression', delay: 10000, status: 'running' },
        { system: 'storage', delay: 12000, status: 'running' }
    ];
    
    startupSteps.forEach((step, index) => {
        setTimeout(() => {
            simulationState.systems[step.system] = step.status;
            io.emit('system_started', { 
                system: step.system, 
                status: step.status,
                timestamp: Date.now() 
            });
            
            // Start metrics simulation when all systems are running
            if (index === startupSteps.length - 1) {
                startMetricsSimulation();
            }
        }, step.delay);
    });
}

// Simulate real-time metrics
function startMetricsSimulation() {
    setInterval(() => {
        if (!simulationState.isRunning) return;
        
        // Simulate realistic metrics
        simulationState.metrics.productionRate = 180 + Math.random() * 40; // 180-220 Nm³/hr
        simulationState.metrics.efficiency = 65 + Math.random() * 10; // 65-75%
        simulationState.metrics.powerConsumption = 1200 + Math.random() * 200; // 1200-1400 kW
        simulationState.metrics.waterConsumption = 2000 + Math.random() * 320; // 2000-2320 L/hr
        
        // Simulate occasional failures
        if (Math.random() < 0.001) { // 0.1% chance per second
            simulateRandomFailure();
        }
        
        // Broadcast updated metrics
        io.emit('metrics_updated', simulationState.metrics);
    }, 1000);
}

// Simulate random failures
function simulateRandomFailure() {
    const failureTypes = [
        'water_membrane_fouling',
        'electrolysis_cell_failure',
        'compressor_valve_failure',
        'power_transformer_fault'
    ];
    
    const failureType = failureTypes[Math.floor(Math.random() * failureTypes.length)];
    const failure = {
        id: Date.now(),
        type: failureType,
        timestamp: Date.now(),
        severity: Math.random() < 0.3 ? 'critical' : 'warning',
        description: `Simulated ${failureType.replace(/_/g, ' ')}`
    };
    
    simulationState.failures.push(failure);
    
    // Broadcast failure event
    io.emit('failure_occurred', failure);
    
    // Auto-resolve after some time
    setTimeout(() => {
        const index = simulationState.failures.findIndex(f => f.id === failure.id);
        if (index > -1) {
            simulationState.failures.splice(index, 1);
            io.emit('failure_resolved', { id: failure.id });
        }
    }, 30000); // 30 seconds
}

// API Routes
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: NODE_ENV
    });
});

app.get('/api/status', (req, res) => {
    res.json({
        simulation: simulationState,
        server: {
            uptime: process.uptime(),
            environment: NODE_ENV,
            timestamp: new Date().toISOString()
        }
    });
});

app.get('/api/metrics', (req, res) => {
    res.json(simulationState.metrics);
});

app.get('/api/systems', (req, res) => {
    res.json(simulationState.systems);
});

app.get('/api/failures', (req, res) => {
    res.json(simulationState.failures);
});

app.post('/api/control', (req, res) => {
    const { action, system, parameters } = req.body;
    
    try {
        switch (action) {
            case 'start_factory':
                simulationState.isRunning = true;
                simulationState.startTime = Date.now();
                io.emit('factory_started', { timestamp: Date.now() });
                break;
                
            case 'stop_factory':
                simulationState.isRunning = false;
                simulationState.startTime = null;
                io.emit('factory_stopped', { timestamp: Date.now() });
                break;
                
            case 'emergency_stop':
                simulationState.isRunning = false;
                simulationState.startTime = null;
                io.emit('emergency_stop', { timestamp: Date.now() });
                break;
                
            case 'system_control':
                if (system && simulationState.systems.hasOwnProperty(system)) {
                    const { operation } = parameters || {};
                    if (operation) {
                        simulationState.systems[system] = operation;
                        io.emit('system_updated', { system, action: operation, timestamp: Date.now() });
                    }
                }
                break;
                
            default:
                return res.status(400).json({ error: 'Invalid action' });
        }
        
        res.json({ success: true, message: `Action ${action} executed successfully` });
        
    } catch (error) {
        console.error('Control error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Serve frontend for production
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
server.listen(PORT, () => {
    console.log(`🚀 Hydrogen Factory Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${NODE_ENV}`);
    console.log(`🔌 WebSocket server ready for connections`);
    
    if (NODE_ENV === 'development') {
        console.log(`📱 Frontend: http://localhost:3000`);
        console.log(`🔧 Backend: http://localhost:${PORT}`);
    }
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('🛑 SIGINT received, shutting down gracefully');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

module.exports = { app, server, io };
