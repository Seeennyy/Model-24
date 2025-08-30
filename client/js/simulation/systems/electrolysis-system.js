// Electrolysis System
// Dependencies loaded via CDN: Math.js

class ElectrolysisSystem {
    constructor() {
        this.isInitialized = false;
        this.status = 'offline';
        this.outputSystem = null;
        
        // Callback for when production rate changes
        this.onProductionRateChange = null;
        
        // System dependencies
        this.powerSystem = null;
        this.waterSystem = null;
        
        // Real-time control parameters
        this.targetTemperature = 70; // °C
        this.targetVoltage = 900; // V
        this.targetCurrent = 1111; // A
        this.targetPressure = 30; // bar
        
        // Current operational parameters
        this.voltage = 0; // V
        this.current = 0; // A
        this.temperature = 20; // °C
        this.pressure = 1; // bar
        this.cellCount = 450;
        
        // Real-time calculated metrics
        this.hydrogenProductionRate = 0; // Nm³/hr
        this.oxygenProductionRate = 0; // Nm³/hr
        this.efficiency = 0; // %
        this.powerInput = 0; // kW
        this.energyCost = 0; // kWh/Nm³ H2
        this.waterConsumption = 0; // L/hr
        
        // Performance analysis metrics
        this.thermalEfficiency = 0; // %
        this.electricalEfficiency = 0; // %
        this.overallEfficiency = 0; // %
        this.performanceScore = 0; // 0-100
        this.operationalHours = 0; // hours
        this.totalHydrogenProduced = 0; // Nm³
        this.totalEnergyConsumed = 0; // kWh
        
        // Chemical constants
        this.molarRatioH2OtoH2 = 1.0; // 1:1 ratio
        this.molarRatioH2toO2 = 2.0; // 2:1 ratio (H2:O2)
        this.waterDensity = 1.0; // kg/L
        this.molarMassH2O = 18.015; // g/mol
        this.molarMassH2 = 2.016; // g/mol
        this.molarMassO2 = 31.999; // g/mol
        
        // Efficiency factors
        this.temperatureEfficiencyFactor = 1.0;
        this.pressureEfficiencyFactor = 1.0;
        this.voltageEfficiencyFactor = 1.0;
        this.currentEfficiencyFactor = 1.0;
        
        // Real-time monitoring
        this.lastUpdateTime = Date.now();
        this.updateInterval = 100; // ms
    }
    
    async init() {
        this.isInitialized = true;
        this.status = 'offline';
        this.lastUpdateTime = Date.now();
    }
    
    setPowerSystem(powerSystem) {
        this.powerSystem = powerSystem;
    }
    
    setWaterSystem(waterSystem) {
        this.waterSystem = waterSystem;
    }
    
    // New methods to get input parameters from dependencies
    getInputPowerUnits() {
        if (!this.powerSystem) return 0;
        return this.powerSystem.getUnitsRunning();
    }
    
    getInputPowerCapacity() {
        if (!this.powerSystem) return 0;
        const units = this.powerSystem.getUnitsRunning();
        return units * 300; // 300 kW per unit
    }
    
    getInputWaterFlowRate() {
        if (!this.waterSystem) return 0;
        return this.waterSystem.getWaterConsumption();
    }
    
    getInputWaterResistivity() {
        if (!this.waterSystem) return 0;
        return this.waterSystem.getWaterResistivity();
    }
    
    getInputWaterTDS() {
        if (!this.waterSystem) return 0;
        return this.waterSystem.getProcessWaterTDS();
    }
    
    // Real-time control methods
    setTargetTemperature(temp) {
        this.targetTemperature = Math.max(60, Math.min(80, temp));
    }
    
    setTargetVoltage(voltage) {
        this.targetVoltage = Math.max(800, Math.min(1000, voltage));
    }
    
    setTargetCurrent(current) {
        this.targetCurrent = Math.max(800, Math.min(1400, current));
    }
    
    setTargetPressure(pressure) {
        this.targetPressure = Math.max(20, Math.min(40, pressure));
    }
    
    startup() {
        console.log('🔋 Starting electrolysis system...');
        console.log('🔋 Power system status:', this.powerSystem ? this.powerSystem.getStatus() : 'null');
        console.log('🔋 Water system status:', this.waterSystem ? this.waterSystem.getStatus() : 'null');
        
        if (!this._checkDependencies()) {
            console.log('⚠️ Cannot start electrolysis: dependencies not met');
            return false;
        }
        
        this.status = 'starting';
        console.log('🔋 Electrolysis system starting...');
        
        // Initialize pressure to target value
        this.pressure = this.targetPressure;
        
        setTimeout(() => {
            this.status = 'running';
            console.log('🔋 Electrolysis system is now running');
            this._calculateOperationalParameters();
        }, 3000);
        
        return true;
    }
    
    startupThermal() {
        // Start thermal management
        this.temperature = 20;
        const thermalRamp = setInterval(() => {
            this.temperature += 2;
            if (this.temperature >= this.targetTemperature) {
                clearInterval(thermalRamp);
            }
        }, 100);
    }
    
    shutdown() {
        this.status = 'stopping';
        setTimeout(() => {
            this.status = 'offline';
            this._resetMetrics();
        }, 2000);
    }
    
    emergencyStop() {
        this.status = 'emergency_stop';
        this._resetMetrics();
    }
    
    rampUp() {
        if (this.status === 'running' && this._checkDependencies()) {
            // Simulate ramping up production
            const targetProduction = this._calculateMaxProduction();
            const rampInterval = setInterval(() => {
                if (this.hydrogenProductionRate < targetProduction) {
                    this.hydrogenProductionRate += targetProduction * 0.1;
                    this._calculateOperationalParameters();
                } else {
                    clearInterval(rampInterval);
                }
            }, 500);
        }
    }
    
    setOutputSystem(system) {
        this.outputSystem = system;
    }
    
    setProductionRateChangeCallback(callback) {
        this.onProductionRateChange = callback;
    }
    
    getStatus() {
        return this.status;
    }
    
    getProductionRate() {
        return this.calculateOverallProductionRate();
    }
    
    getEfficiency() {
        return this.overallEfficiency;
    }
    
    getStackVoltage() {
        return this.voltage;
    }
    
    getStackCurrent() {
        return this.current;
    }
    
    getStackTemperature() {
        return this.temperature;
    }
    
    getCellCount() {
        return this.cellCount;
    }
    
    getPowerInput() {
        return this.powerInput;
    }
    
    getEnergyCost() {
        return this.energyCost;
    }
    
    getWaterConsumption() {
        return this.waterConsumption;
    }
    
    getOxygenProductionRate() {
        return this.oxygenProductionRate;
    }
    
    // Performance analysis methods
    getPerformanceScore() {
        return this.performanceScore;
    }
    
    getThermalEfficiency() {
        return this.thermalEfficiency;
    }
    
    getElectricalEfficiency() {
        return this.electricalEfficiency;
    }
    
    getOperationalHours() {
        return this.operationalHours;
    }
    
    getTotalHydrogenProduced() {
        return this.totalHydrogenProduced;
    }
    
    getTotalEnergyConsumed() {
        return this.totalEnergyConsumed;
    }
    
    // Calculate overall H₂ production rate based on current system state
    calculateOverallProductionRate() {
        if (this.status !== 'running') {
            return 0;
        }
        
        // Get current system parameters
        const powerUnits = this.powerSystem ? this.powerSystem.getUnitsRunning() : 0;
        const waterFlow = this.waterSystem ? this.waterSystem.getWaterConsumption() : 0;
        const waterResistivity = this.waterSystem ? this.waterSystem.getWaterResistivity() : 0;
        
        // Calculate power limit
        const totalPowerKw = powerUnits * 300; // 300 kW per unit
        const powerLimit = totalPowerKw / 3.54; // 3.54 kWh per Nm³ H₂
        
        // Calculate water limit
        const waterLimit = waterFlow / 9.0; // 9L water = 1 Nm³ H₂
        
        // Calculate cell limit based on current cell count and efficiency
        const cellEfficiency = this.overallEfficiency / 100; // Convert percentage to decimal
        const cellLimit = this.cellCount * 0.25 * cellEfficiency * 2.5; // 0.25 m² per cell, 2.5 Nm³/hr/m² at 100% efficiency
        
        // Calculate water quality factor
        const waterQualityFactor = Math.min(1.0, waterResistivity / 15.0);
        
        // Calculate temperature and pressure factors
        const tempFactor = 0.8 + (this.temperature - 60) * 0.01; // 0.8 to 1.0
        const pressureFactor = 0.9 + (this.pressure - 20) * 0.005; // 0.9 to 1.0
        
        // Calculate final production (take the smallest limit)
        const rawProduction = Math.min(powerLimit, waterLimit, cellLimit);
        
        // Apply efficiency factors
        const efficiencyModifier = waterQualityFactor * tempFactor * pressureFactor;
        const finalProduction = rawProduction * efficiencyModifier;
        
        console.log(`🔋 Overall Production Calculation:`);
        console.log(`  Power Units: ${powerUnits}, Power Limit: ${powerLimit.toFixed(1)} Nm³/hr`);
        console.log(`  Water Flow: ${waterFlow.toFixed(0)} L/hr, Water Limit: ${waterLimit.toFixed(1)} Nm³/hr`);
        console.log(`  Cell Count: ${this.cellCount}, Cell Limit: ${cellLimit.toFixed(1)} Nm³/hr`);
        console.log(`  Water Quality Factor: ${waterQualityFactor.toFixed(3)}`);
        console.log(`  Temperature Factor: ${tempFactor.toFixed(3)}`);
        console.log(`  Pressure Factor: ${pressureFactor.toFixed(3)}`);
        console.log(`  Final Production: ${finalProduction.toFixed(1)} Nm³/hr`);
        
        return Math.max(0, finalProduction);
    }
    
    // Enhanced dependency checks with detailed validation
    _checkDependencies() {
        // Check if systems exist
        if (!this.powerSystem) {
            console.log('⚠️ Electrolysis requires power system to be connected');
            return false;
        }
        
        if (!this.waterSystem) {
            console.log('⚠️ Electrolysis requires water system to be connected');
            return false;
        }
        
        // Check if systems are running
        const powerStatus = this.powerSystem.getStatus();
        const waterStatus = this.waterSystem.getStatus();
        
        if (powerStatus !== 'running') {
            console.log(`⚠️ Electrolysis requires power system to be running (current: ${powerStatus})`);
            return false;
        }
        
        if (waterStatus !== 'running') {
            console.log(`⚠️ Electrolysis requires water system to be running (current: ${waterStatus})`);
            return false;
        }
        
        // Check if power units are available
        const powerUnits = this.powerSystem.getUnitsRunning();
        if (powerUnits <= 0) {
            console.log('⚠️ Electrolysis requires at least 1 power unit to be running');
            return false;
        }
        
        // Check if water flow is available
        const waterFlow = this.waterSystem.getWaterConsumption();
        if (waterFlow <= 0) {
            console.log('⚠️ Electrolysis requires water flow to be available');
            return false;
        }
        
        // Check water quality
        const waterResistivity = this.waterSystem.getWaterResistivity();
        if (waterResistivity < 15.0) { // Minimum resistivity for electrolysis
            console.log(`⚠️ Electrolysis requires water resistivity > 15.0 MΩ·cm (current: ${waterResistivity.toFixed(1)} MΩ·cm)`);
            return false;
        }
        
        console.log('✅ All electrolysis dependencies met');
        return true;
    }
    
    // Calculate efficiency factors based on operational parameters
    _calculateEfficiencyFactors() {
        // Temperature efficiency factor (optimal: 70°C)
        const tempDiff = Math.abs(this.temperature - 70);
        this.temperatureEfficiencyFactor = Math.max(0.8, 1.0 - (tempDiff / 50) * 0.2);
        
        // Pressure efficiency factor (optimal: 30 bar)
        const pressureDiff = Math.abs(this.pressure - 30);
        this.pressureEfficiencyFactor = Math.max(0.85, 1.0 - (pressureDiff / 20) * 0.15);
        
        // Voltage efficiency factor (optimal: 900V)
        const voltageDiff = Math.abs(this.voltage - 900);
        this.voltageEfficiencyFactor = Math.max(0.9, 1.0 - (voltageDiff / 200) * 0.1);
        
        // Current efficiency factor (optimal: 1111A)
        const currentDiff = Math.abs(this.current - 1111);
        this.currentEfficiencyFactor = Math.max(0.95, 1.0 - (currentDiff / 600) * 0.05);
    }
    
    // Calculate maximum possible production based on power units
    _calculateMaxProduction() {
        if (!this.powerSystem) return 0;
        
        const powerUnits = this.powerSystem.getUnitsRunning();
        const baseProduction = 85; // Nm³/hr per power unit (theoretical maximum)
        return baseProduction * powerUnits;
    }
    
    // Calculate operational parameters based on power and water systems
    _calculateOperationalParameters() {
        if (!this.powerSystem || !this.waterSystem) return;
        
        const powerUnits = this.powerSystem.getUnitsRunning();
        const totalPowerKw = powerUnits * 300; // Total power from units (300 kW per unit)
        const waterFlow = this.waterSystem.getWaterConsumption();
        
        // Calculate voltage and current to match total power
        // Power = Voltage × Current
        // We'll use the target voltage and calculate current to match power
        this.voltage = this.targetVoltage;
        this.current = (totalPowerKw * 1000) / this.voltage; // Convert kW to W, then divide by voltage
        this.powerInput = totalPowerKw; // This should match the power from units
        
        console.log(`🔋 Power calculation: ${powerUnits} units × 300 kW = ${totalPowerKw} kW`);
        console.log(`🔋 Voltage: ${this.voltage}V, Current: ${this.current.toFixed(0)}A, Power: ${this.powerInput} kW`);
        
        // Calculate efficiency factors first
        this._calculateEfficiencyFactors();
        
        // Calculate realistic overall efficiency (70-85% range)
        const baseEfficiency = 75; // Base 75% efficiency
        const efficiencyModifier = this.temperatureEfficiencyFactor * this.pressureEfficiencyFactor * 
                                  this.voltageEfficiencyFactor * this.currentEfficiencyFactor;
        
        this.overallEfficiency = Math.max(70, Math.min(85, baseEfficiency * efficiencyModifier));
        
        // Use the same calculation as calculateOverallProductionRate for consistency
        this.hydrogenProductionRate = this.calculateOverallProductionRate();
        this.oxygenProductionRate = this.hydrogenProductionRate / this.molarRatioH2toO2;
        
        // Notify purification system if callback is set
        if (this.onProductionRateChange && typeof this.onProductionRateChange === 'function') {
            this.onProductionRateChange();
        }
        
        // Calculate water consumption (1 L water produces ~0.111 L H2 at STP)
        this.waterConsumption = this.hydrogenProductionRate * 9.0; // L/hr
        
        // Calculate electrical efficiency based on theoretical vs actual energy
        const theoreticalEnergy = this.hydrogenProductionRate * 3.54; // kWh/Nm³ H2
        this.electricalEfficiency = this.hydrogenProductionRate > 0 ? (theoreticalEnergy / this.powerInput) * 100 : 0;
        this.thermalEfficiency = this.temperatureEfficiencyFactor * 100;
        
        // Calculate energy cost
        this.energyCost = this.hydrogenProductionRate > 0 ? this.powerInput / this.hydrogenProductionRate : 0;
        
        // Calculate performance score
        this.performanceScore = this.overallEfficiency;
        
        console.log(`🔋 Efficiency: Electrical=${this.electricalEfficiency.toFixed(1)}%, Thermal=${this.thermalEfficiency.toFixed(1)}%, Overall=${this.overallEfficiency.toFixed(1)}%`);
        
        // Update totals
        const deltaTime = (Date.now() - this.lastUpdateTime) / 3600000; // Convert to hours
        if (this.status === 'running') {
            this.operationalHours += deltaTime;
            this.totalHydrogenProduced += this.hydrogenProductionRate * deltaTime;
            this.totalEnergyConsumed += this.powerInput * deltaTime;
        }
        this.lastUpdateTime = Date.now();
    }
    
    // Reset all metrics to zero
    _resetMetrics() {
        this.voltage = 0;
        this.current = 0;
        this.temperature = 20;
        this.pressure = 1;
        this.hydrogenProductionRate = 0;
        this.oxygenProductionRate = 0;
        this.efficiency = 0;
        this.powerInput = 0;
        this.energyCost = 0;
        this.waterConsumption = 0;
        this.overallEfficiency = 0;
        this.thermalEfficiency = 0;
        this.electricalEfficiency = 0;
        this.performanceScore = 0;
    }
    
    update(deltaTime) {
        if (this.status === 'running') {
            // Check dependencies first
            if (!this._checkDependencies()) {
                this.status = 'error';
                this._resetMetrics();
                return;
            }
            
            // Update temperature towards target with realistic variations
            const tempDiff = this.targetTemperature - this.temperature;
            this.temperature += tempDiff * 0.01 + (Math.random() - 0.5) * 2;
            this.temperature = Math.max(60, Math.min(80, this.temperature));
            
            // Update pressure towards target with realistic variations
            const pressureDiff = this.targetPressure - this.pressure;
            this.pressure += pressureDiff * 0.005 + (Math.random() - 0.5) * 0.5;
            this.pressure = Math.max(20, Math.min(40, this.pressure));
            
            console.log(`🔋 Pressure: ${this.pressure.toFixed(1)} bar (target: ${this.targetPressure} bar)`);
            
            // Recalculate operational parameters
            this._calculateOperationalParameters();
        }
    }
    
    triggerCellFailure() {
        console.log('⚠️ Electrolysis cell failure triggered');
        this.cellCount = Math.max(400, this.cellCount - 10);
        this.overallEfficiency = Math.max(70, this.overallEfficiency - 3);
        this._calculateOperationalParameters();
    }
    
    triggerTemperatureExcursion() {
        console.log('⚠️ Temperature excursion triggered');
        this.temperature = 90; // High temperature
        this.overallEfficiency = Math.max(70, this.overallEfficiency - 5);
        this._calculateOperationalParameters();
    }
    
    destroy() {
        this.isInitialized = false;
        this.status = 'offline';
    }
    
    // Test method to set initial values for demonstration
    setTestValues() {
        this.totalHydrogenProduced = 1250.5; // Set a test value
        this.totalEnergyConsumed = 4425.8; // Set a test value
        console.log(`🔋 Test values set: Total H2 = ${this.totalHydrogenProduced} Nm³, Total Energy = ${this.totalEnergyConsumed} kWh`);
    }
}

// Make globally accessible
window.ElectrolysisSystem = ElectrolysisSystem;
