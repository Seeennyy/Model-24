// Simple Gas Purification System
// Takes electrolysis outputs and does basic purification

class PurificationSystem {
    constructor() {
        this.status = 'offline';
        
        // Simple dependencies
        this.electrolysisSystem = null;
        this.powerSystem = null;
        
        // Simple parameters
        this.purificationLevel = 0.95; // 0.0 to 1.0
        
        // Simple outputs
        this.inputHydrogenRate = 0; // From electrolysis
        this.outputHydrogenRate = 0; // After purification
        this.efficiency = 99.5; // %
        this.powerConsumption = 0; // kW
        this.waterRemovalRate = 0; // L/hr
        this.temperature = 25; // °C
        this.pressure = 25; // bar
        
        // Simple totals
        this.totalHydrogenProcessed = 0;
        this.totalWaterRemoved = 0;
        this.totalEnergyConsumed = 0;
        this.operationalHours = 0;
        
        // Time tracking for continuous calculations
        this.lastUpdateTime = Date.now();
        this.updateInterval = 100; // ms
    }
    
    setElectrolysisSystem(system) {
        this.electrolysisSystem = system;
        console.log('🔗 Purification connected to electrolysis');
    }
    
    setPowerSystem(system) {
        this.powerSystem = system;
        console.log('🔗 Purification connected to power');
    }
    
    startup() {
        if (!this.electrolysisSystem || this.electrolysisSystem.getStatus() !== 'running') {
            console.log('⚠️ Need electrolysis running');
            return false;
        }
        
        this.status = 'running';
        console.log('🧪 Purification started');
        return true;
    }
    
    shutdown() {
        this.status = 'offline';
        // Don't reset totals on shutdown, just stop current operations
        this.inputHydrogenRate = 0;
        this.outputHydrogenRate = 0;
        this.powerConsumption = 0;
        this.waterRemovalRate = 0;
        console.log('🧪 Purification shutdown - totals preserved');
    }
    
    setPurificationLevel(level) {
        this.purificationLevel = Math.max(0.0, Math.min(1.0, level));
        this._calculate();
    }
    
    getStatus() {
        return this.status;
    }
    
    getProductionRate() {
        return this.outputHydrogenRate;
    }
    
    getInputRate() {
        return this.inputHydrogenRate;
    }
    
    getEfficiency() {
        return this.efficiency;
    }
    
    getPowerConsumption() {
        return this.powerConsumption;
    }
    
    getWaterRemovalRate() {
        return this.waterRemovalRate;
    }
    
    getStackTemperature() {
        return this.temperature;
    }
    
    getStackPressure() {
        return this.pressure;
    }
    
    getTotalEnergyConsumed() {
        return this.totalEnergyConsumed;
    }
    
    getTotalHydrogenProcessed() {
        return this.totalHydrogenProcessed;
    }
    
    getTotalWaterRemoved() {
        return this.totalWaterRemoved;
    }
    
    getOperationalHours() {
        return this.operationalHours;
    }
    
    resetTotals() {
        this.totalHydrogenProcessed = 0;
        this.totalWaterRemoved = 0;
        this.totalEnergyConsumed = 0;
        this.operationalHours = 0;
        this.lastUpdateTime = Date.now();
        console.log('🧪 Purification totals reset');
    }
    
    // Get electrolysis efficiency for display
    getElectrolysisEfficiency() {
        if (this.electrolysisSystem) {
            return this.electrolysisSystem.getEfficiency();
        }
        return 0;
    }
    
    // Force recalculation when electrolysis parameters change
    recalculateFromElectrolysis() {
        console.log('🧪 Purification: Forcing recalculation from electrolysis changes');
        this._calculate();
    }
    
    // Enhanced calculation based on electrolysis output with real-time updates
    _calculate() {
        if (!this.electrolysisSystem) {
            this._reset();
            return;
        }
        
        // Get input from electrolysis (even when not running for real-time updates)
        const electrolysisProductionRate = this.electrolysisSystem.getProductionRate();
        this.inputHydrogenRate = electrolysisProductionRate;
        const electrolysisEfficiency = this.electrolysisSystem.getEfficiency();
        
        // Debug logging to track the issue
        console.log(`🧪 Purification Debug: Electrolysis Production Rate = ${electrolysisProductionRate.toFixed(1)} Nm³/hr`);
        console.log(`🧪 Purification Debug: Electrolysis Efficiency = ${electrolysisEfficiency.toFixed(1)}%`);
        
        // Calculate purification efficiency based on purification level
        this.efficiency = 99.0 + (this.purificationLevel * 0.9); // 99.0% to 99.9%
        
        // Calculate output H2 rate
        this.outputHydrogenRate = this.inputHydrogenRate * (this.efficiency / 100);
        
        // Calculate water removal (8% of input)
        this.waterRemovalRate = this.inputHydrogenRate * 0.08;
        
        // Calculate power consumption
        const basePower = this.inputHydrogenRate * 0.3; // 0.3 kW per Nm³/hr
        const multiplier = 1 + (this.purificationLevel * 0.5); // 1.0 to 1.5
        this.powerConsumption = basePower * multiplier;
        
        // Update totals continuously based on input rates
        const currentTime = Date.now();
        const deltaTime = (currentTime - this.lastUpdateTime) / 3600000; // Convert to hours
        
        // Only update totals if there's actual input (electrolysis is producing)
        if (this.inputHydrogenRate > 0) {
            this.operationalHours += deltaTime;
            this.totalHydrogenProcessed += this.inputHydrogenRate * deltaTime;
            this.totalWaterRemoved += this.waterRemovalRate * deltaTime;
            this.totalEnergyConsumed += this.powerConsumption * deltaTime;
            
            console.log(`🧪 Totals Updated: H2=${this.totalHydrogenProcessed.toFixed(2)} Nm³, Water=${this.totalWaterRemoved.toFixed(2)} L, Energy=${this.totalEnergyConsumed.toFixed(2)} kWh`);
        }
        
        this.lastUpdateTime = currentTime;
        
        console.log(`🧪 Purification: Input=${this.inputHydrogenRate.toFixed(1)} Nm³/hr, Output=${this.outputHydrogenRate.toFixed(1)} Nm³/hr, Efficiency=${this.efficiency.toFixed(1)}%, Electrolysis Efficiency=${electrolysisEfficiency.toFixed(1)}%`);
    }
    
    _reset() {
        this.inputHydrogenRate = 0;
        this.outputHydrogenRate = 0;
        this.efficiency = 99.5;
        this.powerConsumption = 0;
        this.waterRemovalRate = 0;
        this.temperature = 25;
        this.pressure = 25;
        this.lastUpdateTime = Date.now();
    }
    
    update() {
        // Always calculate to update totals, even when not running
        this._calculate();
    }
}

// Make globally accessible
window.PurificationSystem = PurificationSystem;