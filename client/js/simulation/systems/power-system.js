// Power System
// Dependencies loaded via CDN: Math.js

class PowerSystem {
    constructor() {
        this.isInitialized = false;
        this.status = 'offline';
        this.outputSystem = null;
        this.powerConsumption = 0; // kW

        // Added: unitized power control
        this.unitsAvailable = 4;      // total available power units
        this.unitsRunning = 0;        // active power units
        this.unitPowerKw = 300;       // kW per power unit
    }
    
    async init() {
        this.isInitialized = true;
        this.status = 'offline';
    }
    
    startup() {
        this.status = 'starting';
        setTimeout(() => { 
            this.status = 'running';
            // Default to prior nominal 1200 kW via units if none set
            this.unitsRunning = this.unitsRunning > 0 ? this.unitsRunning : Math.min(this.unitsAvailable, 4);
            this._recomputePower();
        }, 1000);
    }
    
    shutdown() {
        this.status = 'stopping';
        setTimeout(() => { 
            this.status = 'offline';
            this.unitsRunning = 0;
            this.powerConsumption = 0;
        }, 1000);
    }
    
    emergencyStop() {
        this.status = 'emergency_stop';
        this.unitsRunning = 0;
        this.powerConsumption = 0;
    }
    
    setOutputSystem(system) {
        this.outputSystem = system;
    }

    // Added: units API
    setUnitsRunning(n) {
        const next = Math.max(0, Math.min(this.unitsAvailable, Number.isFinite(n) ? Math.floor(n) : 0));
        this.unitsRunning = next;
        this._recomputePower();
        console.log(`⚡ Power units set to ${next}, power consumption: ${this.powerConsumption} kW`);
    }

    getUnitsRunning() {
        return this.unitsRunning;
    }

    getUnitsAvailable() {
        return this.unitsAvailable;
    }

    _recomputePower() {
        // Calculate power based on units, regardless of status
        this.powerConsumption = this.unitsRunning * this.unitPowerKw;
        console.log(`⚡ Recomputing power: ${this.unitsRunning} units × ${this.unitPowerKw} kW = ${this.powerConsumption} kW`);
    }
    
    getStatus() {
        return this.status;
    }
    
    getPowerConsumption() {
        return this.powerConsumption;
    }

    // Planned power based on units, regardless of running state
    getPlannedPower() {
        return this.unitsRunning * this.unitPowerKw;
    }
    
    update(deltaTime) {}

    triggerTransformerFault() {
        console.log('⚠️ Power transformer fault triggered');
        this.status = 'fault';
        this.unitsRunning = 0;
        this.powerConsumption = 0;
    }
    
    triggerGridOutage() {
        console.log('⚠️ Grid outage triggered');
        this.status = 'grid_outage';
        // Reduce effective power to 35% of current planned capacity
        this.powerConsumption = this.powerConsumption * 0.35; // Reduced capacity
    }
    
    destroy() {
        this.isInitialized = false;
        this.status = 'offline';
    }
}

// Make globally accessible
window.PowerSystem = PowerSystem;