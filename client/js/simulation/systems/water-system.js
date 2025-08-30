// Water Treatment System
// Dependencies loaded via CDN: Math.js

class WaterSystem {
    constructor() {
        this.isInitialized = false;
        this.status = 'offline';
        this.outputSystem = null;
        this.maintenanceMode = false;
        
        // Water quality parameters
        this.rawWaterTDS = 150; // ppm
        this.processWaterTDS = 0.5; // ppm
        this.waterResistivity = 18.2; // MΩ·cm
        this.flowRate = 0; // L/hr
        
        // Water treatment control
        this.treatmentLevel = 0.5; // 0.0 = basic, 1.0 = maximum treatment
        this.treatmentEfficiency = 0.95; // base efficiency
        
        // Power system reference for flow calculation
        this.powerSystem = null;
        this.flowPerPowerUnit = 200; // L/hr per power unit
    }
    
    async init() {
        this.isInitialized = true;
        this.status = 'offline';
    }
    
    startup() {
        this.status = 'starting';
        setTimeout(() => {
            this.status = 'running';
            this._recalculateFlow();
        }, 2000);
    }
    
    shutdown() {
        this.status = 'stopping';
        setTimeout(() => {
            this.status = 'offline';
            this.flowRate = 0;
        }, 1000);
    }
    
    emergencyStop() {
        this.status = 'emergency_stop';
        this.flowRate = 0;
    }
    
    setMaintenanceMode(enabled) {
        this.maintenanceMode = enabled;
        if (enabled) {
            this.status = 'maintenance';
        }
    }
    
    setOutputSystem(system) {
        this.outputSystem = system;
    }
    
    setPowerSystem(powerSystem) {
        this.powerSystem = powerSystem;
        this._recalculateFlow();
    }
    
    setTreatmentLevel(level) {
        this.treatmentLevel = Math.max(0.0, Math.min(1.0, level));
        this._recalculateFlow();
        this._updateTreatmentEfficiency();
    }
    
    getTreatmentLevel() {
        return this.treatmentLevel;
    }
    
    getRequiredPowerUnits() {
        if (!this.powerSystem) return 0;
        
        // Get the current power units from the power system
        const currentPowerUnits = this.powerSystem.getUnitsRunning();
        
        // Calculate required flow based on current power units
        const requiredFlow = currentPowerUnits * this.flowPerPowerUnit;
        
        // Calculate how many power units are needed to maintain this flow
        // This should match what's set in the power system
        return currentPowerUnits;
    }
    
    _recalculateFlow() {
        if (!this.powerSystem || this.status !== 'running') {
            this.flowRate = 0;
            return;
        }
        
        // Calculate flow based on power units and treatment level
        const powerUnits = this.powerSystem.getUnitsRunning();
        const baseFlow = powerUnits * this.flowPerPowerUnit;
        
        // Treatment level affects flow (higher treatment = lower flow due to processing time)
        const treatmentFlowFactor = 1.0 - (this.treatmentLevel * 0.3); // 0.7 to 1.0
        this.flowRate = Math.round(baseFlow * treatmentFlowFactor);
    }
    
    _updateTreatmentEfficiency() {
        // Higher treatment level = better water quality but lower flow
        this.treatmentEfficiency = 0.95 + (this.treatmentLevel * 0.05); // 0.95 to 1.0
        
        // Update process water quality based on treatment
        const baseProcessTDS = 0.5;
        this.processWaterTDS = baseProcessTDS * (1.0 - this.treatmentLevel * 0.8); // 0.1 to 0.5 ppm
        
        // Update resistivity based on treatment
        const baseResistivity = 18.2;
        this.waterResistivity = baseResistivity + (this.treatmentLevel * 0.8); // 18.2 to 19.0 MΩ·cm
    }
    
    getStatus() {
        return this.status;
    }
    
    getRawWaterTDS() {
        return this.rawWaterTDS;
    }
    
    getProcessWaterTDS() {
        return this.processWaterTDS;
    }
    
    getWaterResistivity() {
        return this.waterResistivity;
    }
    
    getWaterConsumption() {
        return this.flowRate;
    }
    
    update(deltaTime) {
        // Update water quality and flow
        if (this.status === 'running' && !this.maintenanceMode) {
            // Simulate water quality variations
            this.rawWaterTDS = 150 + Math.sin(Date.now() * 0.0001) * 20;
            // Process water quality now controlled by treatment level
            this._updateTreatmentEfficiency();
            
            // Add small random variations
            this.processWaterTDS += (Math.random() - 0.5) * 0.05;
            this.waterResistivity += (Math.random() - 0.5) * 0.1;
            
            // Ensure values stay within realistic bounds
            this.processWaterTDS = Math.max(0.05, Math.min(0.8, this.processWaterTDS));
            this.waterResistivity = Math.max(17.5, Math.min(19.5, this.waterResistivity));
        }
    }
    
    triggerMembraneFouling() {
        console.log('⚠️ Water membrane fouling triggered');
        this.processWaterTDS = 2.0; // Increased TDS
        this.waterResistivity = 15.0; // Reduced resistivity
    }
    
    triggerPumpFailure() {
        console.log('⚠️ Water pump failure triggered');
        this.flowRate = this.flowRate * 0.5; // Reduced flow
    }
    
    destroy() {
        this.isInitialized = false;
        this.status = 'offline';
    }
}

// Make globally accessible
window.WaterSystem = WaterSystem;