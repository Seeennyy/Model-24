// Compression System
// Dependencies loaded via CDN: Math.js

class CompressionSystem {
    constructor() {
        this.isInitialized = false;
        this.status = 'offline';
        this.outputSystem = null;
        this.inputSystem = null;
        
        // System dependencies
        this.powerSystem = null;
        this.purificationSystem = null;
        
        // Real-time control parameters
        this.targetOutputPressure = 350; // bar (compression target)
        this.targetTemperature = 40; // °C (compression heating)
        this.compressionLevel = 0.85; // 0.0 = basic, 1.0 = maximum compression
        
        // Current operational parameters
        this.inputPressure = 25; // bar (from purification)
        this.outputPressure = 350; // bar (to storage)
        this.temperature = 20; // °C
        
        // Real-time calculated metrics
        this.inputHydrogenRate = 0; // Nm³/hr (from purification)
        this.outputHydrogenRate = 0; // Nm³/hr (compressed)
        this.compressionRatio = 14; // 350/25 = 14:1 compression ratio
        this.powerConsumption = 0; // kW
        this.compressionEfficiency = 85; // % (mechanical efficiency)
        
        // Enhanced performance metrics
        this.performanceScore = 0; // 0-100
        this.thermalEfficiency = 0; // % (temperature control)
        this.pressureEfficiency = 0; // % (pressure control)
        this.mechanicalEfficiency = 0; // % (compressor efficiency)
        this.overallEfficiency = 0; // % (combined efficiency)
        
        // Performance metrics
        this.operationalHours = 0; // hours
        this.totalHydrogenCompressed = 0; // Nm³
        this.totalEnergyConsumed = 0; // kWh
        this.compressorStages = 3; // number of compression stages
        
        // Connectivity and system health monitoring
        this.systemConnectivity = {
            powerSystem: { connected: false, status: 'unknown', lastUpdate: 0 },
            purificationSystem: { connected: false, status: 'unknown', lastUpdate: 0 },
            storageSystem: { connected: false, status: 'unknown', lastUpdate: 0 }
        };
        
        // Real-time monitoring
        this.lastUpdateTime = Date.now();
        this.updateInterval = 100; // ms
        this.performanceHistory = []; // Store last 100 performance readings
        this.maxHistorySize = 100;
        
        // Alert thresholds
        this.alertThresholds = {
            lowEfficiency: 80.0, // Alert if efficiency drops below 80%
            highTemperature: 50, // Alert if temperature exceeds 50°C
            lowOutputPressure: 300, // Alert if output pressure drops below 300 bar
            connectivityTimeout: 5000 // Alert if no update for 5 seconds
        };
        
        // Alert system
        this.activeAlerts = [];
        this.alertHistory = [];
        
        // Engineering-specific metrics
        this.stagePressures = [25, 100, 200, 350]; // bar (input, stage1, stage2, output)
        this.stageTemperatures = [20, 35, 45, 40]; // °C (input, stage1, stage2, output)
        this.stageEfficiencies = [100, 88, 82, 85]; // % (input, stage1, stage2, output)
        this.interstageCooling = true; // interstage cooling enabled
        this.lubricationStatus = 'normal'; // lubrication system status
    }
    
    async init() {
        this.isInitialized = true;
        this.status = 'offline';
        this.lastUpdateTime = Date.now();
        this._initializePerformanceHistory();
    }
    
    setInputSystem(system) {
        this.inputSystem = system;
        this.purificationSystem = system;
        this._updateConnectivity('purificationSystem', true, system.getStatus());
    }
    
    setOutputSystem(system) {
        this.outputSystem = system;
        this._updateConnectivity('storageSystem', true, system.getStatus());
    }
    
    setPowerSystem(powerSystem) {
        this.powerSystem = powerSystem;
        this._updateConnectivity('powerSystem', true, powerSystem.getStatus());
    }
    
    setPurificationSystem(purificationSystem) {
        this.purificationSystem = purificationSystem;
        this._updateConnectivity('purificationSystem', true, purificationSystem.getStatus());
    }
    
    // Enhanced startup with dependency validation
    startup() {
        console.log('⚡ Starting compression system...');
        
        if (!this._checkDependencies()) {
            console.log('⚠️ Cannot start compression: dependencies not met');
            this._generateAlert('dependency_error', 'Critical dependencies not met for startup');
            return false;
        }
        
        this.status = 'starting';
        console.log('⚡ Compression system starting...');
        
        // Validate all system connections
        this._validateSystemConnections();
        
        setTimeout(() => {
            this.status = 'running';
            console.log('⚡ Compression system is now running');
            this._calculateOperationalParameters();
            this._updatePerformanceMetrics();
        }, 3000);
        
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
    
    getOutputRate() {
        return this.outputHydrogenRate;
    }
    
    getOutputPressure() {
        return this.outputPressure;
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
    
    getCompressionEfficiency() {
        return this.compressionEfficiency;
    }
    
    getOperationalHours() {
        return this.operationalHours;
    }
    
    getTotalHydrogenCompressed() {
        return this.totalHydrogenCompressed;
    }
    
    getPowerConsumption() {
        return this.powerConsumption;
    }
    
    getStagePressures() {
        return this.stagePressures;
    }
    
    getStageTemperatures() {
        return this.stageTemperatures;
    }
    
    getStageEfficiencies() {
        return this.stageEfficiencies;
    }
    
    // Set compression level (0.0 to 1.0)
    setCompressionLevel(level) {
        this.compressionLevel = Math.max(0.0, Math.min(1.0, level));
        this._updateCompressionParameters();
    }
    
    // Dependency checks with enhanced validation
    _checkDependencies() {
        const inputOk = this.inputSystem && this.inputSystem.getStatus() === 'running';
        const powerOk = this.powerSystem && this.powerSystem.getStatus() === 'running';
        
        if (!inputOk) {
            console.log('⚠️ Compression requires input system (purification) to be running');
            return false;
        }
        
        if (!powerOk) {
            console.log('⚠️ Compression requires power system to be running');
            return false;
        }
        
        return true;
    }
    
    // Enhanced operational parameter calculation
    _calculateOperationalParameters() {
        if (!this.inputSystem) return;
        
        // Get hydrogen input from purification system
        this.inputHydrogenRate = this.inputSystem.getOutputRate();
        
        // Calculate output hydrogen rate (compression efficiency)
        this.outputHydrogenRate = this.inputHydrogenRate * (this.compressionEfficiency / 100);
        
        // Calculate power consumption based on compression ratio and flow rate
        // Power = Flow × Pressure × ln(CompressionRatio) / Efficiency
        const pressureDiff = this.outputPressure - this.inputPressure;
        this.powerConsumption = (this.inputHydrogenRate * pressureDiff * Math.log(this.compressionRatio)) / (this.compressionEfficiency / 100) * 0.001; // Convert to kW
        
        // Update pressure and temperature
        this.outputPressure = this.targetOutputPressure;
        this.temperature = this.targetTemperature;
        
        console.log(`⚡ Compression: Input=${this.inputHydrogenRate.toFixed(1)} Nm³/hr, Output=${this.outputHydrogenRate.toFixed(1)} Nm³/hr, Power=${this.powerConsumption.toFixed(1)} kW`);
        
        // Update totals
        const deltaTime = (Date.now() - this.lastUpdateTime) / 3600000; // Convert to hours
        if (this.status === 'running') {
            this.operationalHours += deltaTime;
            this.totalHydrogenCompressed += this.inputHydrogenRate * deltaTime;
            this.totalEnergyConsumed += this.powerConsumption * deltaTime;
        }
        this.lastUpdateTime = Date.now();
    }
    
    // Enhanced performance metrics calculation
    _updatePerformanceMetrics() {
        // Calculate thermal efficiency (temperature control)
        const tempEfficiency = Math.max(0, 100 - Math.abs(this.temperature - this.targetTemperature) * 2);
        this.thermalEfficiency = Math.min(100, tempEfficiency);
        
        // Calculate pressure efficiency
        const pressureEfficiency = Math.max(0, 100 - Math.abs(this.outputPressure - this.targetOutputPressure) * 0.5);
        this.pressureEfficiency = Math.min(100, pressureEfficiency);
        
        // Calculate mechanical efficiency (compressor performance)
        this.mechanicalEfficiency = this.compressionEfficiency;
        
        // Calculate overall efficiency
        this.overallEfficiency = (this.thermalEfficiency + this.pressureEfficiency + this.mechanicalEfficiency) / 3;
        
        // Calculate performance score (weighted average)
        this.performanceScore = (
            this.overallEfficiency * 0.4 +
            this.thermalEfficiency * 0.2 +
            this.pressureEfficiency * 0.2 +
            this.mechanicalEfficiency * 0.2
        );
        
        // Store performance history
        this._addPerformanceHistory({
            timestamp: Date.now(),
            performanceScore: this.performanceScore,
            efficiency: this.overallEfficiency,
            temperature: this.temperature,
            outputPressure: this.outputPressure,
            outputRate: this.outputHydrogenRate
        });
        
        // Check for alerts
        this._checkAlertThresholds();
    }
    
    // Update compression parameters based on level
    _updateCompressionParameters() {
        // Adjust compression ratio based on level
        const baseRatio = 10; // Base compression ratio
        const maxRatio = 20; // Maximum compression ratio
        this.compressionRatio = baseRatio + (this.compressionLevel * (maxRatio - baseRatio));
        
        // Adjust target output pressure
        this.targetOutputPressure = 200 + (this.compressionLevel * 300); // 200-500 bar range
        
        // Adjust efficiency based on compression level
        this.compressionEfficiency = 90 - (this.compressionLevel * 10); // 90-80% range
        
        // Update stage pressures based on compression level
        this.stagePressures[0] = this.inputPressure; // Input pressure (25 bar)
        this.stagePressures[1] = 25 + (this.compressionLevel * 75); // Stage 1: 25-100 bar
        this.stagePressures[2] = 100 + (this.compressionLevel * 100); // Stage 2: 100-200 bar
        this.stagePressures[3] = this.targetOutputPressure; // Output pressure (200-500 bar)
        
        // Update stage temperatures based on compression level
        this.stageTemperatures[0] = 20; // Input temperature
        this.stageTemperatures[1] = 20 + (this.compressionLevel * 15); // Stage 1: 20-35°C
        this.stageTemperatures[2] = 35 + (this.compressionLevel * 10); // Stage 2: 35-45°C
        this.stageTemperatures[3] = this.targetTemperature; // Output temperature (40°C)
        
        // Update stage efficiencies based on compression level
        this.stageEfficiencies[0] = 100; // Input efficiency
        this.stageEfficiencies[1] = 100 - (this.compressionLevel * 12); // Stage 1: 100-88%
        this.stageEfficiencies[2] = 88 - (this.compressionLevel * 6); // Stage 2: 88-82%
        this.stageEfficiencies[3] = this.compressionEfficiency; // Output efficiency (85-80%)
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
        if (this.purificationSystem) {
            this._updateConnectivity('purificationSystem', true, this.purificationSystem.getStatus());
        }
        if (this.outputSystem) {
            this._updateConnectivity('storageSystem', true, this.outputSystem.getStatus());
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
                temperature: 20,
                outputPressure: 350,
                outputRate: 0
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
        
        console.log(`🚨 Compression Alert [${type}]: ${message}`);
    }
    
    _clearAlerts() {
        this.activeAlerts = [];
    }
    
    _checkAlertThresholds() {
        // Check efficiency threshold
        if (this.compressionEfficiency < this.alertThresholds.lowEfficiency) {
            if (!this.activeAlerts.find(a => a.type === 'low_efficiency')) {
                this._generateAlert('low_efficiency', `Compression efficiency below threshold: ${this.compressionEfficiency.toFixed(1)}%`);
            }
        }
        
        // Check temperature threshold
        if (this.temperature > this.alertThresholds.highTemperature) {
            if (!this.activeAlerts.find(a => a.type === 'high_temperature')) {
                this._generateAlert('high_temperature', `Temperature above threshold: ${this.temperature.toFixed(1)}°C`);
            }
        }
        
        // Check pressure threshold
        if (this.outputPressure < this.alertThresholds.lowOutputPressure) {
            if (!this.activeAlerts.find(a => a.type === 'low_pressure')) {
                this._generateAlert('low_pressure', `Output pressure below threshold: ${this.outputPressure.toFixed(1)} bar`);
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
        this.inputPressure = 25;
        this.outputPressure = 350;
        this.temperature = 20;
        this.inputHydrogenRate = 0;
        this.outputHydrogenRate = 0;
        this.powerConsumption = 0;
        this.performanceScore = 0;
        this.thermalEfficiency = 0;
        this.pressureEfficiency = 0;
        this.mechanicalEfficiency = 0;
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
            const tempDiff = this.targetTemperature - this.temperature;
            this.temperature += tempDiff * 0.01 + (Math.random() - 0.5) * 2;
            this.temperature = Math.max(20, Math.min(60, this.temperature));
            
            // Update pressure with realistic variations
            const pressureDiff = this.targetOutputPressure - this.outputPressure;
            this.outputPressure += pressureDiff * 0.005 + (Math.random() - 0.5) * 5;
            this.outputPressure = Math.max(300, Math.min(500, this.outputPressure));
            
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
                thermalEfficiency: this.thermalEfficiency,
                pressureEfficiency: this.pressureEfficiency,
                mechanicalEfficiency: this.mechanicalEfficiency
            },
            operational: {
                inputRate: this.inputHydrogenRate,
                outputRate: this.outputHydrogenRate,
                inputPressure: this.inputPressure,
                outputPressure: this.outputPressure,
                temperature: this.temperature,
                compressionRatio: this.compressionRatio,
                powerConsumption: this.powerConsumption
            },
            connectivity: this.systemConnectivity,
            alerts: this.activeAlerts,
            metrics: {
                operationalHours: this.operationalHours,
                totalHydrogenCompressed: this.totalHydrogenCompressed,
                totalEnergyConsumed: this.totalEnergyConsumed
            },
            engineering: {
                stagePressures: this.stagePressures,
                stageTemperatures: this.stageTemperatures,
                stageEfficiencies: this.stageEfficiencies,
                interstageCooling: this.interstageCooling,
                lubricationStatus: this.lubricationStatus
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
window.CompressionSystem = CompressionSystem;