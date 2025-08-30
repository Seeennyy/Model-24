// Factory Simulation Engine
// Dependencies loaded via CDN: Math.js, Socket.IO

class FactorySimulation {
    constructor() {
        this.isInitialized = false;
        this.isRunning = false;
        this.simulationTime = 0;
        this.simulationSpeed = 1.0;
        this.difficultyLevel = 'operator';
        this.failureRate = 100;
        
        // System components
        this.waterSystem = null;
        this.electrolysisSystem = null;
        this.purificationSystem = null;
        this.compressionSystem = null;
        this.storageSystem = null;
        this.powerSystem = null;
        this.safetySystem = null;
        
        // Simulation state
        this.currentMetrics = {
            productionRate: 0,        // Nm³/hr
            efficiency: 0,            // %
            powerConsumption: 0,      // kW
            waterConsumption: 0,      // L/hr
            water: {
                rawTds: 0,            // ppm
                processTds: 0,        // ppm
                resistivity: 0        // MΩ·cm
            },
            electrolysis: {
                status: 'offline',    // system status
                voltage: 0,           // V
                current: 0,           // A
                temperature: 0,       // °C
                pressure: 0,          // bar
                cellCount: 0,
                hydrogenProductionRate: 0, // Nm³/hr
                oxygenProductionRate: 0,   // Nm³/hr
                powerInput: 0,        // kW
                energyCost: 0,        // kWh/Nm³ H2
                waterConsumption: 0,  // L/hr
                thermalEfficiency: 0, // %
                electricalEfficiency: 0, // %
                overallEfficiency: 0, // %
                performanceScore: 0,  // 0-100
                operationalHours: 0,  // hours
                totalHydrogenProduced: 0, // Nm³
                totalEnergyConsumed: 0,   // kWh
                powerUnitsUsed: 0,    // number of power units
                waterQuality: {
                    tds: 0,           // ppm
                    resistivity: 0    // MΩ·cm
                }
            },
            purification: {
                status: 'offline',    // system status
                inputHydrogenRate: 0, // Nm³/hr
                outputHydrogenRate: 0, // Nm³/hr
                purificationEfficiency: 99.5, // %
                powerConsumption: 0,  // kW
                waterRemovalRate: 0,  // L/hr
                pressure: 25,         // bar
                temperature: 25,      // °C
                operationalHours: 0,  // hours
                totalHydrogenProcessed: 0, // Nm³
                totalWaterRemoved: 0, // L
                totalEnergyConsumed: 0 // kWh
            },
            compression: {
                status: 'offline',    // system status
                inputHydrogenRate: 0, // Nm³/hr
                outputHydrogenRate: 0, // Nm³/hr
                compressionRatio: 14, // 14:1 compression ratio
                powerConsumption: 0,  // kW
                compressionEfficiency: 85, // %
                inputPressure: 25,    // bar
                outputPressure: 350,  // bar
                temperature: 40,      // °C
                operationalHours: 0,  // hours
                totalHydrogenCompressed: 0, // Nm³
                totalEnergyConsumed: 0 // kWh
            },
            storage: {
                status: 'offline',    // system status
                currentInventory: 0,  // Nm³
                fillLevel: 0,         // %
                maxCapacity: 10000,   // Nm³
                inputHydrogenRate: 0, // Nm³/hr
                netStorageRate: 0,    // Nm³/hr
                powerConsumption: 0,  // kW
                storagePressure: 350, // bar
                temperature: 25,      // °C
                tankCount: 10,        // number of tanks
                activeTanks: 0,       // tanks currently in use
                operationalHours: 0,  // hours
                totalHydrogenStored: 0, // Nm³
                totalHydrogenWithdrawn: 0, // Nm³
                totalEnergyConsumed: 0 // kWh
            }
        };
        
        // Historical data for charts
        this.historicalData = {
            timestamps: [],
            productionRates: [],
            efficiencies: [],
            powerConsumptions: [],
            temperatures: []
        };
        
        // Failure tracking
        this.failures = new Map();
        this.maintenanceSchedule = new Map();
        
        // Performance tracking
        this.uptime = 0;
        this.totalProduction = 0;
        this.totalEnergy = 0;
        this.totalWater = 0;
        
        // Event system
        this.eventListeners = new Map();
    }
    
    async init() {
        try {
            console.log('⚙️ Initializing factory simulation...');
            
            // Initialize all systems
            this.waterSystem = new WaterSystem();
            this.electrolysisSystem = new ElectrolysisSystem();
            this.purificationSystem = new PurificationSystem();
            this.compressionSystem = new CompressionSystem();
            this.storageSystem = new StorageSystem();
            this.powerSystem = new PowerSystem();
            this.safetySystem = new SafetySystem();
            
            // Initialize each system
            await Promise.all([
                this.waterSystem.init(),
                this.electrolysisSystem.init(),
                this.purificationSystem.init(),
                this.compressionSystem.init(),
                this.storageSystem.init(),
                this.powerSystem.init(),
                this.safetySystem.init()
            ]);
            
            // Setup system interconnections
            this.setupSystemInterconnections();
            
            // Setup failure scenarios
            this.setupFailureScenarios();
            
            // Setup maintenance schedule
            this.setupMaintenanceSchedule();
            
            this.isInitialized = true;
            console.log('✅ Factory simulation initialized successfully!');
            
        } catch (error) {
            console.error('❌ Failed to initialize factory simulation:', error);
            throw error;
        }
    }
    
    setupSystemInterconnections() {
        // Water system feeds electrolysis
        this.waterSystem.setOutputSystem(this.electrolysisSystem);
        
        // Water system needs power system reference for flow calculation
        this.waterSystem.setPowerSystem(this.powerSystem);
        
        // Electrolysis system needs power and water system references
        this.electrolysisSystem.setPowerSystem(this.powerSystem);
        this.electrolysisSystem.setWaterSystem(this.waterSystem);
        
        // Complete hydrogen flow chain: Electrolysis → Purification → Compression → Storage
        
        // Electrolysis feeds purification
        this.electrolysisSystem.setOutputSystem(this.purificationSystem);
        this.purificationSystem.setInputSystem(this.electrolysisSystem);
        
        // Purification feeds compression
        this.purificationSystem.setOutputSystem(this.compressionSystem);
        this.compressionSystem.setInputSystem(this.purificationSystem);
        
        // Compression feeds storage
        this.compressionSystem.setOutputSystem(this.storageSystem);
        this.storageSystem.setInputSystem(this.compressionSystem);
        
        // All systems need power system reference
        this.purificationSystem.setPowerSystem(this.powerSystem);
        this.purificationSystem.setWaterSystem(this.waterSystem);
        this.compressionSystem.setPowerSystem(this.powerSystem);
        this.compressionSystem.setPurificationSystem(this.purificationSystem);
        this.storageSystem.setPowerSystem(this.powerSystem);
        this.storageSystem.setWaterSystem(this.waterSystem);
        
        // Power system feeds electrolysis
        this.powerSystem.setOutputSystem(this.electrolysisSystem);
        
        // Safety system monitors all systems
        this.safetySystem.addMonitoredSystem('water', this.waterSystem);
        this.safetySystem.addMonitoredSystem('electrolysis', this.electrolysisSystem);
        this.safetySystem.addMonitoredSystem('purification', this.purificationSystem);
        this.safetySystem.addMonitoredSystem('compression', this.compressionSystem);
        this.safetySystem.addMonitoredSystem('storage', this.storageSystem);
        this.safetySystem.addMonitoredSystem('power', this.powerSystem);
    }
    
    setupFailureScenarios() {
        // Water system failures
        this.failures.set('water_membrane_fouling', {
            probability: 0.15, // 15% annual probability
            meanTimeToFailure: 8760 * 0.15, // hours
            meanTimeToRepair: 4, // hours
            impact: 'reduced_water_quality',
            severity: 'medium'
        });
        
        this.failures.set('water_pump_failure', {
            probability: 0.08,
            meanTimeToFailure: 8760 * 0.08,
            meanTimeToRepair: 12,
            impact: 'flow_interruption',
            severity: 'high'
        });
        
        // Electrolysis failures
        this.failures.set('electrolysis_cell_failure', {
            probability: 0.08,
            meanTimeToFailure: 8760 * 0.08,
            meanTimeToRepair: 24,
            impact: 'reduced_efficiency',
            severity: 'medium'
        });
        
        this.failures.set('electrolysis_temperature_excursion', {
            probability: 0.02,
            meanTimeToFailure: 8760 * 0.02,
            meanTimeToRepair: 6,
            impact: 'efficiency_loss',
            severity: 'high'
        });
        
        // Power system failures
        this.failures.set('power_transformer_fault', {
            probability: 0.01,
            meanTimeToFailure: 8760 * 0.01,
            meanTimeToRepair: 168,
            impact: 'complete_shutdown',
            severity: 'critical'
        });
        
        this.failures.set('power_grid_outage', {
            probability: 0.02,
            meanTimeToFailure: 8760 * 0.02,
            meanTimeToRepair: 2,
            impact: 'reduced_capacity',
            severity: 'high'
        });
    }
    
    setupMaintenanceSchedule() {
        // Daily maintenance
        this.maintenanceSchedule.set('daily_checks', {
            frequency: 24, // hours
            lastPerformed: 0,
            tasks: ['system_parameter_review', 'safety_system_checks', 'visual_inspection']
        });
        
        // Weekly maintenance
        this.maintenanceSchedule.set('weekly_maintenance', {
            frequency: 168, // hours
            lastPerformed: 0,
            tasks: ['vibration_monitoring', 'lubricant_checks', 'filter_monitoring']
        });
        
        // Monthly maintenance
        this.maintenanceSchedule.set('monthly_maintenance', {
            frequency: 720, // hours
            lastPerformed: 0,
            tasks: ['electrical_inspections', 'insulation_tests', 'performance_analysis']
        });
        
        // Annual maintenance
        this.maintenanceSchedule.set('annual_maintenance', {
            frequency: 8760, // hours
            lastPerformed: 0,
            tasks: ['major_overhaul', 'pressure_vessel_inspection', 'efficiency_testing']
        });
    }
    
// Main simulation methods
startFactory() {
    if (!this.isInitialized) {
        throw new Error('Simulation not initialized');
    }
    
    try {
        console.log('🏭 Starting hydrogen factory...');
        
        // Startup sequence
        this.startupSequence();
        
        this.isRunning = true;
        this.simulationTime = 0;
        
        // Emit startup event
        this.emitEvent('factory_started', { timestamp: Date.now() });
        
        console.log('✅ Factory started successfully');
        
    } catch (error) {
        console.error('❌ Failed to start factory:', error);
        throw error;
    }
}

startupSequence() {
    // 1. Power system startup
    this.powerSystem.startup();
    
    // 2. Water system startup
    this.waterSystem.startup();
    
    // 3. Thermal system activation
    this.electrolysisSystem.startupThermal();
    
    // 4. Electrolysis startup
    this.electrolysisSystem.startup();
    
    // 5. Downstream systems
    this.purificationSystem.startup();
    this.compressionSystem.startup();
    this.storageSystem.startup();
    
    // 6. Safety system activation
    this.safetySystem.activate();
}
    
    emergencyStop() {
        if (!this.isRunning) return;
        
        console.log('🚨 Emergency stop activated!');
        
        // Stop all systems
        this.waterSystem.emergencyStop();
        this.electrolysisSystem.emergencyStop();
        this.purificationSystem.emergencyStop();
        this.compressionSystem.emergencyStop();
        this.storageSystem.emergencyStop();
        this.powerSystem.emergencyStop();
        
        this.isRunning = false;
        
        // Emit emergency stop event
        this.emitEvent('emergency_stop', { timestamp: Date.now() });
    }
    
    update(deltaTime) {
        if (!this.isRunning || !this.isInitialized) return;
        
        // Update simulation time
        this.simulationTime += deltaTime * 0.001; // Convert to seconds
        
        // Update all systems
        this.waterSystem.update(deltaTime);
        this.electrolysisSystem.update(deltaTime);
        this.purificationSystem.update(deltaTime);
        this.compressionSystem.update(deltaTime);
        this.storageSystem.update(deltaTime);
        this.powerSystem.update(deltaTime);
        this.safetySystem.update(deltaTime);
        
        // Check for failures
        this.checkFailures(deltaTime);
        
        // Check maintenance schedule
        this.checkMaintenanceSchedule(deltaTime);
        
        // Update metrics
        this.updateMetrics();
        
        // Update historical data
        this.updateHistoricalData();
        
        // Emit update event
        this.emitEvent('simulation_updated', { 
            timestamp: Date.now(),
            deltaTime: deltaTime
        });
    }
    
    checkFailures(deltaTime) {
        this.failures.forEach((failure, failureType) => {
            // Check if failure should occur based on probability
            const failureChance = (failure.probability * this.failureRate / 100) * (deltaTime / (8760 * 3600)); // Convert to per-second probability
            
            if (Math.random() < failureChance) {
                this.triggerFailure(failureType, failure);
            }
        });
    }
    
    triggerFailure(failureType, failure) {
        console.log(`⚠️ Failure triggered: ${failureType}`);
        
        // Apply failure effects
        switch (failureType) {
            case 'water_membrane_fouling':
                this.waterSystem.triggerMembraneFouling();
                break;
            case 'water_pump_failure':
                this.waterSystem.triggerPumpFailure();
                break;
            case 'electrolysis_cell_failure':
                this.electrolysisSystem.triggerCellFailure();
                break;
            case 'electrolysis_temperature_excursion':
                this.electrolysisSystem.triggerTemperatureExcursion();
                break;
            case 'power_transformer_fault':
                this.powerSystem.triggerTransformerFault();
                break;
            case 'power_grid_outage':
                this.powerSystem.triggerGridOutage();
                break;
        }
        
        // Emit failure event
        this.emitEvent('failure_occurred', {
            failureType,
            failure,
            timestamp: Date.now()
        });
    }
    
    checkMaintenanceSchedule(deltaTime) {
        this.maintenanceSchedule.forEach((schedule, maintenanceType) => {
            if (this.simulationTime - schedule.lastPerformed >= schedule.frequency) {
                this.performMaintenance(maintenanceType, schedule);
            }
        });
    }
    
    performMaintenance(maintenanceType, schedule) {
        console.log(`🔧 Performing maintenance: ${maintenanceType}`);
        
        // Update last performed time
        schedule.lastPerformed = this.simulationTime;
        
        // Perform maintenance tasks
        schedule.tasks.forEach(task => {
            this.performMaintenanceTask(task);
        });
        
        // Emit maintenance event
        this.emitEvent('maintenance_performed', {
            maintenanceType,
            tasks: schedule.tasks,
            timestamp: Date.now()
        });
    }
    
    performMaintenanceTask(task) {
        switch (task) {
            case 'system_parameter_review':
                this.reviewSystemParameters();
                break;
            case 'safety_system_checks':
                this.safetySystem.performChecks();
                break;
            case 'visual_inspection':
                this.performVisualInspection();
                break;
            case 'vibration_monitoring':
                this.performVibrationMonitoring();
                break;
            case 'lubricant_checks':
                this.performLubricantChecks();
                break;
            case 'filter_monitoring':
                this.performFilterMonitoring();
                break;
            case 'electrical_inspections':
                this.performElectricalInspections();
                break;
            case 'insulation_tests':
                this.performInsulationTests();
                break;
            case 'performance_analysis':
                this.performPerformanceAnalysis();
                break;
            case 'major_overhaul':
                this.performMajorOverhaul();
                break;
            case 'pressure_vessel_inspection':
                this.performPressureVesselInspection();
                break;
            case 'efficiency_testing':
                this.performEfficiencyTesting();
                break;
        }
    }
    
    // Maintenance task implementations
    reviewSystemParameters() {
        // Review and log all system parameters
        console.log('📊 Reviewing system parameters...');
    }
    
    performVisualInspection() {
        // Simulate visual inspection process
        console.log('👁️ Performing visual inspection...');
    }
    
    performVibrationMonitoring() {
        // Simulate vibration monitoring
        console.log('📳 Monitoring vibration levels...');
    }
    
    performLubricantChecks() {
        // Simulate lubricant level checks
        console.log('🛢️ Checking lubricant levels...');
    }
    
    performFilterMonitoring() {
        // Simulate filter pressure drop monitoring
        console.log('🔍 Monitoring filter conditions...');
    }
    
    performElectricalInspections() {
        // Simulate electrical connection inspections
        console.log('⚡ Inspecting electrical connections...');
    }
    
    performInsulationTests() {
        // Simulate insulation resistance tests
        console.log('🛡️ Testing insulation resistance...');
    }
    
    performPerformanceAnalysis() {
        // Simulate performance trending analysis
        console.log('📈 Analyzing performance trends...');
    }
    
    performMajorOverhaul() {
        // Simulate major equipment overhaul
        console.log('🔧 Performing major overhaul...');
    }
    
    performPressureVesselInspection() {
        // Simulate pressure vessel inspections
        console.log('📦 Inspecting pressure vessels...');
    }
    
    performEfficiencyTesting() {
        // Simulate efficiency testing and tuning
        console.log('🎯 Testing and tuning efficiency...');
    }
    
    updateMetrics() {
        // Update current metrics from all systems
        this.currentMetrics.productionRate = this.electrolysisSystem.getProductionRate();
        this.currentMetrics.efficiency = this.electrolysisSystem.getEfficiency();
        this.currentMetrics.powerConsumption = this.powerSystem.getPowerConsumption();
        this.currentMetrics.waterConsumption = this.waterSystem.getWaterConsumption();
        
        // Water system metrics
        this.currentMetrics.water.rawTds = this.waterSystem.getRawWaterTDS();
        this.currentMetrics.water.processTds = this.waterSystem.getProcessWaterTDS();
        this.currentMetrics.water.resistivity = this.waterSystem.getWaterResistivity();
        
        // Electrolysis metrics
        this.currentMetrics.electrolysis.status = this.electrolysisSystem.getStatus();
        this.currentMetrics.electrolysis.voltage = this.electrolysisSystem.getStackVoltage();
        this.currentMetrics.electrolysis.current = this.electrolysisSystem.getStackCurrent();
        this.currentMetrics.electrolysis.temperature = this.electrolysisSystem.getStackTemperature();
        this.currentMetrics.electrolysis.pressure = this.electrolysisSystem.pressure || 1;
        this.currentMetrics.electrolysis.cellCount = this.electrolysisSystem.getCellCount();
        this.currentMetrics.electrolysis.hydrogenProductionRate = this.electrolysisSystem.getProductionRate();
        this.currentMetrics.electrolysis.oxygenProductionRate = this.electrolysisSystem.getOxygenProductionRate();
        this.currentMetrics.electrolysis.powerInput = this.electrolysisSystem.getPowerInput();
        this.currentMetrics.electrolysis.energyCost = this.electrolysisSystem.getEnergyCost();
        this.currentMetrics.electrolysis.waterConsumption = this.electrolysisSystem.getWaterConsumption();
        this.currentMetrics.electrolysis.thermalEfficiency = this.electrolysisSystem.getThermalEfficiency();
        this.currentMetrics.electrolysis.electricalEfficiency = this.electrolysisSystem.getElectricalEfficiency();
        this.currentMetrics.electrolysis.overallEfficiency = this.electrolysisSystem.getEfficiency();
        this.currentMetrics.electrolysis.performanceScore = this.electrolysisSystem.getPerformanceScore();
        this.currentMetrics.electrolysis.operationalHours = this.electrolysisSystem.getOperationalHours();
        this.currentMetrics.electrolysis.totalHydrogenProduced = this.electrolysisSystem.getTotalHydrogenProduced();
        this.currentMetrics.electrolysis.totalEnergyConsumed = this.electrolysisSystem.getTotalEnergyConsumed();
        this.currentMetrics.electrolysis.powerUnitsUsed = this.powerSystem ? this.powerSystem.getUnitsRunning() : 0;
        this.currentMetrics.electrolysis.waterQuality.tds = this.waterSystem ? this.waterSystem.getProcessWaterTDS() : 0;
        this.currentMetrics.electrolysis.waterQuality.resistivity = this.waterSystem ? this.waterSystem.getWaterResistivity() : 0;
        
        // Purification system metrics
        this.currentMetrics.purification.status = this.purificationSystem.getStatus();
        this.currentMetrics.purification.inputHydrogenRate = this.purificationSystem.inputHydrogenRate || 0;
        this.currentMetrics.purification.outputHydrogenRate = this.purificationSystem.getOutputRate ? this.purificationSystem.getOutputRate() : 0;
        this.currentMetrics.purification.purificationEfficiency = this.purificationSystem.getPurificationEfficiency ? this.purificationSystem.getPurificationEfficiency() : 99.5;
        this.currentMetrics.purification.powerConsumption = this.purificationSystem.getPowerConsumption ? this.purificationSystem.getPowerConsumption() : 0;
        this.currentMetrics.purification.waterRemovalRate = this.purificationSystem.getWaterRemovalRate ? this.purificationSystem.getWaterRemovalRate() : 0;
        this.currentMetrics.purification.pressure = this.purificationSystem.pressure || 25;
        this.currentMetrics.purification.temperature = this.purificationSystem.temperature || 25;
        this.currentMetrics.purification.operationalHours = this.purificationSystem.getOperationalHours ? this.purificationSystem.getOperationalHours() : 0;
        this.currentMetrics.purification.totalHydrogenProcessed = this.purificationSystem.getTotalHydrogenProcessed ? this.purificationSystem.getTotalHydrogenProcessed() : 0;
        this.currentMetrics.purification.totalWaterRemoved = this.purificationSystem.getTotalWaterRemoved ? this.purificationSystem.getTotalWaterRemoved() : 0;
        this.currentMetrics.purification.totalEnergyConsumed = this.purificationSystem.totalEnergyConsumed || 0;
        
        // Compression system metrics
        this.currentMetrics.compression.status = this.compressionSystem.getStatus();
        this.currentMetrics.compression.inputHydrogenRate = this.compressionSystem.inputHydrogenRate || 0;
        this.currentMetrics.compression.outputHydrogenRate = this.compressionSystem.getOutputRate ? this.compressionSystem.getOutputRate() : 0;
        this.currentMetrics.compression.compressionRatio = this.compressionSystem.getCompressionRatio ? this.compressionSystem.getCompressionRatio() : 14;
        this.currentMetrics.compression.powerConsumption = this.compressionSystem.getPowerConsumption ? this.compressionSystem.getPowerConsumption() : 0;
        this.currentMetrics.compression.compressionEfficiency = this.compressionSystem.getCompressionEfficiency ? this.compressionSystem.getCompressionEfficiency() : 85;
        this.currentMetrics.compression.inputPressure = this.compressionSystem.inputPressure || 25;
        this.currentMetrics.compression.outputPressure = this.compressionSystem.getOutputPressure ? this.compressionSystem.getOutputPressure() : 350;
        this.currentMetrics.compression.temperature = this.compressionSystem.temperature || 40;
        this.currentMetrics.compression.operationalHours = this.compressionSystem.getOperationalHours ? this.compressionSystem.getOperationalHours() : 0;
        this.currentMetrics.compression.totalHydrogenCompressed = this.compressionSystem.getTotalHydrogenCompressed ? this.compressionSystem.getTotalHydrogenCompressed() : 0;
        this.currentMetrics.compression.totalEnergyConsumed = this.compressionSystem.totalEnergyConsumed || 0;
        
        // Storage system metrics
        this.currentMetrics.storage.status = this.storageSystem.getStatus();
        this.currentMetrics.storage.currentInventory = this.storageSystem.getCurrentInventory ? this.storageSystem.getCurrentInventory() : 0;
        this.currentMetrics.storage.fillLevel = this.storageSystem.getFillLevel ? this.storageSystem.getFillLevel() : 0;
        this.currentMetrics.storage.maxCapacity = this.storageSystem.getMaxCapacity ? this.storageSystem.getMaxCapacity() : 10000;
        this.currentMetrics.storage.inputHydrogenRate = this.storageSystem.getInputRate ? this.storageSystem.getInputRate() : 0;
        this.currentMetrics.storage.netStorageRate = this.storageSystem.getNetStorageRate ? this.storageSystem.getNetStorageRate() : 0;
        this.currentMetrics.storage.powerConsumption = this.storageSystem.getPowerConsumption ? this.storageSystem.getPowerConsumption() : 0;
        this.currentMetrics.storage.storagePressure = this.storageSystem.storagePressure || 350;
        this.currentMetrics.storage.temperature = this.storageSystem.temperature || 25;
        this.currentMetrics.storage.tankCount = this.storageSystem.tankCount || 10;
        this.currentMetrics.storage.activeTanks = this.storageSystem.getActiveTanks ? this.storageSystem.getActiveTanks() : 0;
        this.currentMetrics.storage.operationalHours = this.storageSystem.getOperationalHours ? this.storageSystem.getOperationalHours() : 0;
        this.currentMetrics.storage.totalHydrogenStored = this.storageSystem.getTotalHydrogenStored ? this.storageSystem.getTotalHydrogenStored() : 0;
        this.currentMetrics.storage.totalHydrogenWithdrawn = this.storageSystem.getTotalHydrogenWithdrawn ? this.storageSystem.getTotalHydrogenWithdrawn() : 0;
        this.currentMetrics.storage.totalEnergyConsumed = this.storageSystem.totalEnergyConsumed || 0;
    }
    
    updateHistoricalData() {
        const timestamp = this.simulationTime;
        
        // Add new data point every 5 minutes (300 seconds)
        if (timestamp % 300 < 0.1) {
            this.historicalData.timestamps.push(timestamp);
            this.historicalData.productionRates.push(this.currentMetrics.productionRate);
            this.historicalData.efficiencies.push(this.currentMetrics.efficiency);
            this.historicalData.powerConsumptions.push(this.currentMetrics.powerConsumption);
            this.historicalData.temperatures.push(this.currentMetrics.electrolysis.temperature);
            
            // Keep only last 1000 data points
            if (this.historicalData.timestamps.length > 1000) {
                this.historicalData.timestamps.shift();
                this.historicalData.productionRates.shift();
                this.historicalData.efficiencies.shift();
                this.historicalData.powerConsumptions.shift();
                this.historicalData.temperatures.shift();
            }
        }
    }
    
    // Public methods for external access
    getCurrentMetrics() {
        return { ...this.currentMetrics };
    }
    
    getHistoricalData() {
        return { ...this.historicalData };
    }
    
    setDifficulty(level) {
        this.difficultyLevel = level;
        
        // Adjust failure rates based on difficulty
        switch (level) {
            case 'trainee':
                this.failureRate = 50; // Reduced failures
                break;
            case 'operator':
                this.failureRate = 100; // Normal failures
                break;
            case 'expert':
                this.failureRate = 150; // Increased failures
                break;
            case 'master':
                this.failureRate = 200; // Maximum failures
                break;
        }
        
        console.log(`🎯 Difficulty set to: ${level} (failure rate: ${this.failureRate}%)`);
    }
    
    // System control methods
    startWaterSystem() {
        if (!this._ensurePower()) return false;
        if (this.waterSystem) {
            this.waterSystem.startup();
            return true;
        }
        return false;
    }
    
    stopWaterSystem() {
        if (this.waterSystem) {
            this.waterSystem.shutdown();
        }
    }
    
    setWaterMaintenanceMode() {
        if (this.waterSystem) {
            this.waterSystem.setMaintenanceMode(true);
        }
    }
    
    setWaterTreatmentLevel(level) {
        if (this.waterSystem) {
            this.waterSystem.setTreatmentLevel(level);
        }
    }
    
    getWaterTreatmentLevel() {
        return this.waterSystem ? this.waterSystem.getTreatmentLevel() : 0.5;
    }
    
    startElectrolysis() {
        if (!this._ensurePower()) return false;
        if (this.electrolysisSystem) {
            this.electrolysisSystem.startup();
            return true;
        }
        return false;
    }
    
    stopElectrolysis() {
        if (this.electrolysisSystem) {
            this.electrolysisSystem.shutdown();
        }
    }
    
    rampUpElectrolysis() {
        if (!this._ensurePower()) return false;
        if (this.electrolysisSystem) {
            this.electrolysisSystem.rampUp();
            return true;
        }
        return false;
    }

    // Added: power guards and helpers
    _ensurePower() {
        const on = this.isPowerOn();
        if (!on) {
            this.emitEvent('power_required', { timestamp: Date.now() });
        }
        return on;
    }

    isPowerOn() {
        return this.powerSystem && this.powerSystem.getStatus() === 'running';
    }

    setPowerUnits(n) {
        if (this.powerSystem) {
            this.powerSystem.setUnitsRunning(n);
        }
    }

    // Optional wrappers for other systems
    startPurification() {
        if (!this._ensurePower()) return false;
        if (this.purificationSystem) { this.purificationSystem.startup(); return true; }
        return false;
    }

    stopPurification() {
        if (this.purificationSystem) {
            this.purificationSystem.shutdown();
        }
    }

    startCompression() {
        if (!this._ensurePower()) return false;
        if (this.compressionSystem) { this.compressionSystem.startup(); return true; }
        return false;
    }

    stopCompression() {
        if (this.compressionSystem) {
            this.compressionSystem.shutdown();
        }
    }

    startStorage() {
        if (!this._ensurePower()) return false;
        if (this.storageSystem) { this.storageSystem.startup(); return true; }
        return false;
    }

    stopStorage() {
        if (this.storageSystem) {
            this.storageSystem.shutdown();
        }
    }
    
    // Event system
    addEventListener(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }
    
    removeEventListener(event, callback) {
        if (this.eventListeners.has(event)) {
            const callbacks = this.eventListeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }
    
    emitEvent(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            });
        }
    }
    
    // Performance and statistics
    getUptime() {
        return this.uptime;
    }
    
    getTotalProduction() {
        return this.totalProduction;
    }
    
    getTotalEnergy() {
        return this.totalEnergy;
    }
    
    getTotalWater() {
        return this.totalWater;
    }
    
    getSystemStatus(systemName) {
        switch (systemName) {
            case 'water':
                return this.waterSystem ? this.waterSystem.getStatus() : 'unknown';
            case 'electrolysis':
                return this.electrolysisSystem ? this.electrolysisSystem.getStatus() : 'unknown';
            case 'purification':
                return this.purificationSystem ? this.purificationSystem.getStatus() : 'unknown';
            case 'compression':
                return this.compressionSystem ? this.compressionSystem.getStatus() : 'unknown';
            case 'storage':
                return this.storageSystem ? this.storageSystem.getStatus() : 'unknown';
            case 'power':
                return this.powerSystem ? this.powerSystem.getStatus() : 'unknown';
            default:
                return 'unknown';
        }
    }
    
    // Cleanup
    destroy() {
        // Stop all systems
        if (this.isRunning) {
            this.emergencyStop();
        }
        
        // Destroy all system components
        if (this.waterSystem) this.waterSystem.destroy();
        if (this.electrolysisSystem) this.electrolysisSystem.destroy();
        if (this.purificationSystem) this.purificationSystem.destroy();
        if (this.compressionSystem) this.compressionSystem.destroy();
        if (this.storageSystem) this.storageSystem.destroy();
        if (this.powerSystem) this.powerSystem.destroy();
        if (this.safetySystem) this.safetySystem.destroy();
        
        // Clear data
        this.historicalData = {
            timestamps: [],
            productionRates: [],
            efficiencies: [],
            powerConsumptions: [],
            temperatures: []
        };
        
        this.failures.clear();
        this.maintenanceSchedule.clear();
        this.eventListeners.clear();
        
        console.log('⚙️ Factory simulation destroyed');
    }
}

// Make globally accessible
window.FactorySimulation = FactorySimulation;