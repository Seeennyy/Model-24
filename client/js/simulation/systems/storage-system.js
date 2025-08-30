// Storage System
// Dependencies loaded via CDN: Math.js

class StorageSystem {
    constructor() {
        this.isInitialized = false;
        this.status = 'offline';
        this.outputSystem = null;
        this.inputSystem = null;
        
        // System dependencies
        this.powerSystem = null;
        this.compressionSystem = null;
        this.waterSystem = null;
        
        // Storage configuration
        this.maxCapacity = 10000; // Nm³ (total storage capacity)
        this.tankCount = 10; // number of storage tanks
        this.tankCapacity = 1000; // Nm³ per tank
        this.storagePressure = 350; // bar (operating pressure)
        
        // Current operational parameters
        this.currentInventory = 0; // Nm³ (current stored hydrogen)
        this.fillLevel = 0; // % (percentage of capacity filled)
        this.temperature = 25; // °C (storage temperature)
        
        // Real-time calculated metrics
        this.inputHydrogenRate = 0; // Nm³/hr (from compression)
        this.outputHydrogenRate = 0; // Nm³/hr (to consumers, if any)
        this.netStorageRate = 0; // Nm³/hr (net storage rate)
        this.powerConsumption = 0; // kW (cooling, monitoring)
        
        // Enhanced performance metrics
        this.performanceScore = 0; // 0-100
        this.storageEfficiency = 0; // % (storage utilization)
        this.temperatureEfficiency = 0; // % (temperature control)
        this.pressureEfficiency = 0; // % (pressure control)
        this.overallEfficiency = 0; // % (combined efficiency)
        
        // Performance metrics
        this.operationalHours = 0; // hours
        this.totalHydrogenStored = 0; // Nm³
        this.totalHydrogenWithdrawn = 0; // Nm³
        this.totalEnergyConsumed = 0; // kWh
        
        // Tank status tracking
        this.tankStatus = []; // Array of tank status objects
        this.activeTanks = 0; // number of tanks currently in use
        
        // Connectivity and system health monitoring
        this.systemConnectivity = {
            powerSystem: { connected: false, status: 'unknown', lastUpdate: 0 },
            compressionSystem: { connected: false, status: 'unknown', lastUpdate: 0 },
            waterSystem: { connected: false, status: 'unknown', lastUpdate: 0 }
        };
        
        // Real-time monitoring
        this.lastUpdateTime = Date.now();
        this.updateInterval = 100; // ms
        this.performanceHistory = []; // Store last 100 performance readings
        this.maxHistorySize = 100;
        
        // Alert thresholds
        this.alertThresholds = {
            lowEfficiency: 75.0, // Alert if efficiency drops below 75%
            highTemperature: 35, // Alert if temperature exceeds 35°C
            lowPressure: 300, // Alert if pressure drops below 300 bar
            highFillLevel: 90, // Alert if storage is above 90%
            connectivityTimeout: 5000 // Alert if no update for 5 seconds
        };
        
        // Alert system
        this.activeAlerts = [];
        this.alertHistory = [];
        
        // Engineering-specific metrics
        this.coolingSystemStatus = 'normal'; // cooling system status
        this.safetySystemStatus = 'normal'; // safety system status
        this.leakDetectionStatus = 'normal'; // leak detection status
        this.ventilationStatus = 'normal'; // ventilation system status
        
        // Resource consumption tracking
        this.electricityConsumption = 0; // kWh (monitoring, cooling, safety systems)
        this.totalElectricityConsumed = 0; // kWh (cumulative electricity consumption)
    }
    
    async init() {
        this.isInitialized = true;
        this.status = 'offline';
        this.lastUpdateTime = Date.now();
        this._initializePerformanceHistory();
        
        // Initialize tank status
        this.tankStatus = [];
        for (let i = 0; i < this.tankCount; i++) {
            this.tankStatus.push({
                id: i + 1,
                capacity: this.tankCapacity,
                currentLevel: 0,
                fillLevel: 0,
                status: 'empty',
                temperature: 25,
                pressure: 1
            });
        }
    }
    
    setInputSystem(system) {
        this.inputSystem = system;
        this.compressionSystem = system;
        this._updateConnectivity('compressionSystem', true, system.getStatus());
    }
    
    setOutputSystem(system) {
        this.outputSystem = system;
    }
    
    setPowerSystem(powerSystem) {
        this.powerSystem = powerSystem;
        this._updateConnectivity('powerSystem', true, powerSystem.getStatus());
    }
    
    setWaterSystem(waterSystem) {
        this.waterSystem = waterSystem;
        this._updateConnectivity('waterSystem', true, waterSystem.getStatus());
    }
    
    setCompressionSystem(compressionSystem) {
        this.compressionSystem = compressionSystem;
        this._updateConnectivity('compressionSystem', true, compressionSystem.getStatus());
    }
    
    setStoragePressure(pressure) {
        this.storagePressure = Math.max(100, Math.min(500, pressure)); // Limit between 100-500 bar
        console.log(`✅ Storage pressure set to ${this.storagePressure} bar`);
    }
    
    // Enhanced startup with dependency validation
    startup() {
        console.log('🛢️ Starting storage system...');
        
        if (!this._checkDependencies()) {
            console.log('⚠️ Cannot start storage: dependencies not met');
            this._generateAlert('dependency_error', 'Critical dependencies not met for startup');
            return false;
        }
        
        this.status = 'starting';
        console.log('🛢️ Storage system starting...');
        
        // Validate all system connections
        this._validateSystemConnections();
        
        setTimeout(() => {
            this.status = 'running';
            console.log('🛢️ Storage system is now running');
            this._calculateOperationalParameters();
            this._updatePerformanceMetrics();
        }, 2000);
        
        return true;
    }
    
    shutdown() {
        this.status = 'stopping';
        setTimeout(() => {
            this.status = 'offline';
            this._resetMetrics();
            this._clearAlerts();
        }, 2000);
    }
    
    emergencyStop() {
        this.status = 'emergency_stop';
        this._resetMetrics();
        this._generateAlert('emergency_stop', 'Emergency stop activated');
    }
    
    // Enhanced status and metrics retrieval
    getStatus() {
        return this.status;
    }
    
    getCurrentInventory() {
        return this.currentInventory;
    }
    
    getFillLevel() {
        return this.fillLevel;
    }
    
    // New enhanced methods
    getPerformanceScore() {
        return this.performanceScore;
    }
    
    getSystemConnectivity() {
        return this.systemConnectivity;
    }
    
    getActiveAlerts() {
        return this.activeAlerts;
    }
    
    getPerformanceHistory() {
        return this.performanceHistory;
    }
    
    getOverallEfficiency() {
        return this.overallEfficiency;
    }
    
    getTankStatus() {
        return this.tankStatus;
    }
    
    getActiveTanks() {
        return this.activeTanks;
    }
    
    getElectricityConsumption() {
        return this.electricityConsumption;
    }
    
    getTotalElectricityConsumed() {
        return this.totalElectricityConsumed;
    }
    
    getOperationalHours() {
        return this.operationalHours;
    }
    
    getTotalHydrogenStored() {
        return this.totalHydrogenStored;
    }
    
    getPowerConsumption() {
        return this.powerConsumption;
    }
    
    getOutputRate() {
        return this.outputHydrogenRate;
    }
    
    // Dependency checks with enhanced validation
    _checkDependencies() {
        const inputOk = this.inputSystem && this.inputSystem.getStatus() === 'running';
        const powerOk = this.powerSystem && this.powerSystem.getStatus() === 'running';
        
        if (!inputOk) {
            console.log('⚠️ Storage requires input system (compression) to be running');
            return false;
        }
        
        if (!powerOk) {
            console.log('⚠️ Storage requires power system to be running');
            return false;
        }
        
        return true;
    }
    
    // Enhanced operational parameter calculation
    _calculateOperationalParameters() {
        if (!this.inputSystem) return;
        
        // Get hydrogen input from compression system
        this.inputHydrogenRate = this.inputSystem.getOutputRate();
        
        // Calculate net storage rate (input - output)
        this.netStorageRate = this.inputHydrogenRate - this.outputHydrogenRate;
        
        // Update current inventory
        const deltaTime = (Date.now() - this.lastUpdateTime) / 3600000; // Convert to hours
        if (this.status === 'running') {
            this.currentInventory += this.netStorageRate * deltaTime;
            this.currentInventory = Math.max(0, Math.min(this.maxCapacity, this.currentInventory));
            
            // Update fill level
            this.fillLevel = (this.currentInventory / this.maxCapacity) * 100;
            
            // Update tank status
            this._updateTankStatus();
            
            // Calculate power consumption (cooling, monitoring, safety systems)
            this.powerConsumption = 5 + (this.currentInventory / 1000) * 0.5; // Base 5 kW + 0.5 kW per 1000 Nm³
            
            // Update totals
            this.operationalHours += deltaTime;
            this.totalHydrogenStored += this.inputHydrogenRate * deltaTime;
            this.totalEnergyConsumed += this.powerConsumption * deltaTime;
            this.totalElectricityConsumed += this.powerConsumption * deltaTime;
        }
        this.lastUpdateTime = Date.now();
        
        console.log(`🛢️ Storage: Input=${this.inputHydrogenRate.toFixed(1)} Nm³/hr, Inventory=${this.currentInventory.toFixed(1)} Nm³, Fill=${this.fillLevel.toFixed(1)}%, Power=${this.powerConsumption.toFixed(1)} kW, Water=${this.waterConsumption.toFixed(1)} L/hr`);
    }
    
    // Enhanced performance metrics calculation
    _updatePerformanceMetrics() {
        // Calculate storage efficiency (utilization)
        this.storageEfficiency = this.fillLevel;
        
        // Calculate temperature efficiency (temperature control)
        const tempEfficiency = Math.max(0, 100 - Math.abs(this.temperature - 25) * 3);
        this.temperatureEfficiency = Math.min(100, tempEfficiency);
        
        // Calculate pressure efficiency
        const pressureEfficiency = Math.max(0, 100 - Math.abs(this.storagePressure - 350) * 0.5);
        this.pressureEfficiency = Math.min(100, pressureEfficiency);
        
        // Calculate overall efficiency
        this.overallEfficiency = (this.storageEfficiency + this.temperatureEfficiency + this.pressureEfficiency) / 3;
        
        // Calculate performance score (weighted average)
        this.performanceScore = (
            this.overallEfficiency * 0.4 +
            this.storageEfficiency * 0.3 +
            this.temperatureEfficiency * 0.2 +
            this.pressureEfficiency * 0.1
        );
        
        // Store performance history
        this._addPerformanceHistory({
            timestamp: Date.now(),
            performanceScore: this.performanceScore,
            efficiency: this.overallEfficiency,
            temperature: this.temperature,
            fillLevel: this.fillLevel,
            inventory: this.currentInventory
        });
        
        // Check for alerts
        this._checkAlertThresholds();
    }
    
    // Update tank status based on current inventory
    _updateTankStatus() {
        const tanksNeeded = Math.ceil(this.currentInventory / this.tankCapacity);
        this.activeTanks = Math.min(tanksNeeded, this.tankCount);
        
        for (let i = 0; i < this.tankCount; i++) {
            const tank = this.tankStatus[i];
            if (i < this.activeTanks) {
                // Calculate tank fill level
                const tankStartLevel = i * this.tankCapacity;
                const tankEndLevel = Math.min((i + 1) * this.tankCapacity, this.currentInventory);
                const tankCurrentLevel = Math.max(0, tankEndLevel - tankStartLevel);
                
                tank.currentLevel = tankCurrentLevel;
                tank.fillLevel = (tankCurrentLevel / this.tankCapacity) * 100;
                tank.status = tank.fillLevel > 90 ? 'full' : tank.fillLevel > 10 ? 'filling' : 'empty';
                tank.temperature = this.temperature + (Math.random() - 0.5) * 2;
                tank.pressure = this.storagePressure + (Math.random() - 0.5) * 10;
            } else {
                tank.currentLevel = 0;
                tank.fillLevel = 0;
                tank.status = 'empty';
                tank.temperature = 25;
                tank.pressure = 1;
            }
        }
    }
    
    // System connectivity monitoring
    _updateConnectivity(systemName, connected, status) {
        if (this.systemConnectivity[systemName]) {
            this.systemConnectivity[systemName].connected = connected;
            this.systemConnectivity[systemName].status = status;
            this.systemConnectivity[systemName].lastUpdate = Date.now();
        }
    }
    
    // Validate all system connections
    _validateSystemConnections() {
        if (this.powerSystem) {
            this._updateConnectivity('powerSystem', true, this.powerSystem.getStatus());
        }
        if (this.compressionSystem) {
            this._updateConnectivity('compressionSystem', true, this.compressionSystem.getStatus());
        }
        if (this.waterSystem) {
            this._updateConnectivity('waterSystem', true, this.waterSystem.getStatus());
        }
    }
    
    // Performance history management
    _initializePerformanceHistory() {
        this.performanceHistory = [];
        for (let i = 0; i < this.maxHistorySize; i++) {
            this.performanceHistory.push({
                timestamp: Date.now() - (this.maxHistorySize - i) * 1000,
                performanceScore: 0,
                efficiency: 0,
                temperature: 25,
                fillLevel: 0,
                inventory: 0
            });
        }
    }
    
    _addPerformanceHistory(data) {
        this.performanceHistory.push(data);
        if (this.performanceHistory.length > this.maxHistorySize) {
            this.performanceHistory.shift();
        }
    }
    
    // Alert system
    _generateAlert(type, message) {
        const alert = {
            id: Date.now(),
            type: type,
            message: message,
            timestamp: Date.now(),
            acknowledged: false
        };
        
        this.activeAlerts.push(alert);
        this.alertHistory.push(alert);
        
        // Keep only last 50 alerts in history
        if (this.alertHistory.length > 50) {
            this.alertHistory.shift();
        }
        
        console.log(`🚨 Storage Alert [${type}]: ${message}`);
    }
    
    _clearAlerts() {
        this.activeAlerts = [];
    }
    
    _checkAlertThresholds() {
        // Check efficiency threshold
        if (this.overallEfficiency < this.alertThresholds.lowEfficiency) {
            if (!this.activeAlerts.find(a => a.type === 'low_efficiency')) {
                this._generateAlert('low_efficiency', `Storage efficiency below threshold: ${this.overallEfficiency.toFixed(1)}%`);
            }
        }
        
        // Check temperature threshold
        if (this.temperature > this.alertThresholds.highTemperature) {
            if (!this.activeAlerts.find(a => a.type === 'high_temperature')) {
                this._generateAlert('high_temperature', `Temperature above threshold: ${this.temperature.toFixed(1)}°C`);
            }
        }
        
        // Check pressure threshold
        if (this.storagePressure < this.alertThresholds.lowPressure) {
            if (!this.activeAlerts.find(a => a.type === 'low_pressure')) {
                this._generateAlert('low_pressure', `Storage pressure below threshold: ${this.storagePressure.toFixed(1)} bar`);
            }
        }
        
        // Check fill level threshold
        if (this.fillLevel > this.alertThresholds.highFillLevel) {
            if (!this.activeAlerts.find(a => a.type === 'high_fill_level')) {
                this._generateAlert('high_fill_level', `Storage fill level above threshold: ${this.fillLevel.toFixed(1)}%`);
            }
        }
        
        // Check connectivity timeouts
        Object.entries(this.systemConnectivity).forEach(([systemName, data]) => {
            if (data.connected && (Date.now() - data.lastUpdate) > this.alertThresholds.connectivityTimeout) {
                if (!this.activeAlerts.find(a => a.type === 'connectivity_timeout' && a.message.includes(systemName))) {
                    this._generateAlert('connectivity_timeout', `${systemName} connectivity timeout detected`);
                }
            }
        });
    }
    
    // Acknowledge alert
    acknowledgeAlert(alertId) {
        const alert = this.activeAlerts.find(a => a.id === alertId);
        if (alert) {
            alert.acknowledged = true;
            this.activeAlerts = this.activeAlerts.filter(a => a.id !== alertId);
        }
    }
    
    // Reset all metrics to zero
    _resetMetrics() {
        this.currentInventory = 0;
        this.fillLevel = 0;
        this.temperature = 25;
        this.inputHydrogenRate = 0;
        this.outputHydrogenRate = 0;
        this.netStorageRate = 0;
        this.powerConsumption = 0;
        this.performanceScore = 0;
        this.storageEfficiency = 0;
        this.temperatureEfficiency = 0;
        this.pressureEfficiency = 0;
        this.overallEfficiency = 0;
    }
    
    // Enhanced update method with comprehensive monitoring
    update(deltaTime) {
        if (this.status === 'running') {
            // Check dependencies first
            if (!this._checkDependencies()) {
                this.status = 'error';
                this._resetMetrics();
                this._generateAlert('dependency_error', 'System dependencies not met during operation');
                return;
            }
            
            // Update temperature with realistic variations
            const tempDiff = 25 - this.temperature;
            this.temperature += tempDiff * 0.01 + (Math.random() - 0.5) * 1;
            this.temperature = Math.max(20, Math.min(30, this.temperature));
            
            // Update system connectivity
            this._validateSystemConnections();
            
            // Recalculate operational parameters
            this._calculateOperationalParameters();
            
            // Update performance metrics
            this._updatePerformanceMetrics();
        }
    }
    
    // Get comprehensive system report
    getSystemReport() {
        return {
            status: this.status,
            performance: {
                score: this.performanceScore,
                efficiency: this.overallEfficiency,
                storageEfficiency: this.storageEfficiency,
                temperatureEfficiency: this.temperatureEfficiency,
                pressureEfficiency: this.pressureEfficiency
            },
            operational: {
                inputRate: this.inputHydrogenRate,
                outputRate: this.outputHydrogenRate,
                netStorageRate: this.netStorageRate,
                currentInventory: this.currentInventory,
                fillLevel: this.fillLevel,
                temperature: this.temperature,
                pressure: this.storagePressure,
                powerConsumption: this.powerConsumption
            },
            connectivity: this.systemConnectivity,
            alerts: this.activeAlerts,
            metrics: {
                operationalHours: this.operationalHours,
                totalHydrogenStored: this.totalHydrogenStored,
                totalHydrogenWithdrawn: this.totalHydrogenWithdrawn,
                totalEnergyConsumed: this.totalEnergyConsumed,
                totalElectricityConsumed: this.totalElectricityConsumed
            },
            engineering: {
                tankStatus: this.tankStatus,
                activeTanks: this.activeTanks,
                coolingSystemStatus: this.coolingSystemStatus,
                safetySystemStatus: this.safetySystemStatus,
                leakDetectionStatus: this.leakDetectionStatus,
                ventilationStatus: this.ventilationStatus
            },
            history: this.performanceHistory.slice(-10) // Last 10 readings
        };
    }
    
    destroy() {
        this.isInitialized = false;
        this.status = 'offline';
        this.performanceHistory = [];
        this.activeAlerts = [];
        this.alertHistory = [];
    }
}

// Make globally accessible
window.StorageSystem = StorageSystem;