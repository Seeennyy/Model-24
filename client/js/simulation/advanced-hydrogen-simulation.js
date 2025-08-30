/**
 * Advanced Hydrogen Production Simulation Engine
 * Physics-based electrolysis simulation with real-time parameter calculations
 * Based on electrochemical principles and Faraday's law
 */

class AdvancedHydrogenSimulation {
    constructor() {
        this.isRunning = false;
        this.simulationTime = 0;
        this.lastUpdate = Date.now();
        
        // Core electrochemical parameters (based on real science)
        this.parameters = {
            voltage: 1.8,           // Cell voltage (V)
            currentDensity: 1.0,    // Current density (A/cm²)
            temperature: 25,        // Temperature (°C)
            pressure: 1,            // Pressure (bar)
            waterQuality: 1.0,      // Water purity (ppm TDS)
            electrodeArea: 100,     // Electrode area (cm²)
            electrolyteConcentration: 30, // KOH concentration (wt%)
            cellCount: 12,          // Number of electrolysis cells
            stackConfiguration: 'bipolar' // monopolar or bipolar
        };
        
        // Parameter constraints (realistic industrial limits)
        this.constraints = {
            voltage: { min: 1.2, max: 2.5, locked: false, optimal: 1.8 },
            currentDensity: { min: 0.1, max: 2.0, locked: false, optimal: 1.0 },
            temperature: { min: 20, max: 80, locked: false, optimal: 70 },
            pressure: { min: 1, max: 30, locked: false, optimal: 15 },
            waterQuality: { min: 0.1, max: 100, locked: false, optimal: 0.1 }
        };
        
        // Real-time calculated metrics (based on electrochemical formulas)
        this.metrics = {
            // Production rates (Faraday's law)
            h2Production: 0,        // Nm³/hr (Normal cubic meters per hour)
            o2Production: 0,        // Nm³/hr
            h2Purity: 99.9,        // % purity
            
            // Efficiency metrics
            efficiency: 75.2,       // Overall system efficiency (%)
            currentEfficiency: 95.0, // Current efficiency (%)
            faradaicEfficiency: 98.5, // Faradaic efficiency (%)
            thermalEfficiency: 85.0, // Thermal efficiency (%)
            
            // Power and energy metrics
            powerInput: 3.2,        // Total power input (kW)
            specificEnergyConsumption: 4.5, // kWh/Nm³ H₂
            energyCost: 0.08,       // Energy cost ($/kWh)
            cellVoltage: 1.8,       // Average cell voltage (V)
            stackCurrent: 100,      // Stack current (A)
            
            // Electrochemical metrics
            overpotential: 0.3,     // Total overpotential (V)
            activationOverpotential: 0.15, // Activation overpotential (V)
            ohmicOverpotential: 0.10,      // Ohmic overpotential (V)
            concentrationOverpotential: 0.05, // Concentration overpotential (V)
            
            // System health and performance
            systemHealth: 100,
            cellDegradation: 0,     // % degradation
            electrodeWear: 0,       // % electrode wear
            membraneResistance: 0.15, // Ω·cm²
            uptime: 0
        };
        
        // Physical constants (for accurate calculations)
        this.constants = {
            faradayConstant: 96485,     // C/mol
            gasConstant: 8.314,         // J/(mol·K)
            standardTemperature: 273.15, // K
            standardPressure: 101325,   // Pa
            h2MolarMass: 2.016,         // g/mol
            o2MolarMass: 31.998,        // g/mol
            waterMolarMass: 18.015,     // g/mol
            theoreticalCellVoltage: 1.229, // V at 25°C, 1 atm
            electricityPrice: 0.12      // $/kWh
        };
        
        // Historical data for real-time charts (60 data points = 1 hour at 1 min intervals)
        this.history = {
            time: [],
            efficiency: [],
            h2Production: [],
            powerInput: [],
            temperature: [],
            pressure: [],
            voltage: [],
            currentDensity: [],
            cellVoltage: [],
            energyCost: []
        };
        
        // Advanced features
        this.operatingModes = ['startup', 'steady_state', 'ramp_up', 'ramp_down', 'maintenance'];
        this.currentMode = 'startup';
        this.autoOptimization = false;
        this.predictiveMaintenance = true;
        
        // Initialize simulation
        this.initializeSimulation();
    }
    
    initializeSimulation() {
        console.log('🔬 Initializing advanced hydrogen simulation...');
        this.updateMetrics();
        this.startDataCollection();
        console.log('✅ Advanced simulation ready!');
    }
    
    startDataCollection() {
        // Collect data every second for real-time updates
        setInterval(() => {
            if (this.isRunning) {
                this.collectDataPoint();
            }
        }, 1000);
    }
    
    collectDataPoint() {
        const currentTime = (Date.now() - this.simulationTime) / 1000;
        
        this.history.time.push(currentTime);
        this.history.efficiency.push(this.metrics.efficiency);
        this.history.h2Production.push(this.metrics.h2Production);
        this.history.powerInput.push(this.metrics.powerInput);
        this.history.temperature.push(this.parameters.temperature);
        this.history.pressure.push(this.parameters.pressure);
        this.history.voltage.push(this.parameters.voltage);
        this.history.currentDensity.push(this.parameters.currentDensity);
        this.history.cellVoltage.push(this.metrics.cellVoltage);
        this.history.energyCost.push(this.metrics.energyCost);
        
        // Keep only last 60 data points (1 hour of data)
        if (this.history.time.length > 60) {
            Object.keys(this.history).forEach(key => {
                this.history[key].shift();
            });
        }
    }
    
    // Core parameter update method
    updateParameter(name, value) {
        const oldValue = this.parameters[name];
        this.parameters[name] = this.validateParameter(name, parseFloat(value));
        
        // Trigger recalculation
        this.updateMetrics();
        
        // Emit parameter change event
        this.triggerParameterChange(name, oldValue, this.parameters[name]);
        
        return this.parameters[name];
    }
    
    validateParameter(name, value) {
        if (this.constraints[name]) {
            const constraint = this.constraints[name];
            if (constraint.locked) {
                return this.parameters[name]; // Don't change if locked
            }
            return Math.max(constraint.min, Math.min(constraint.max, value));
        }
        return value;
    }
    
    // Advanced metric calculations based on electrochemical principles
    updateMetrics() {
        // 1. Calculate cell voltage components
        this.calculateCellVoltage();
        
        // 2. Calculate current and power
        this.calculateElectricalMetrics();
        
        // 3. Calculate production rates using Faraday's law
        this.calculateProductionRates();
        
        // 4. Calculate efficiencies
        this.calculateEfficiencies();
        
        // 5. Calculate energy consumption and costs
        this.calculateEnergyMetrics();
        
        // 6. Update system health
        this.updateSystemHealth();
    }
    
    calculateCellVoltage() {
        // Nernst equation for theoretical voltage
        const temp = this.parameters.temperature + this.constants.standardTemperature;
        const pressure = this.parameters.pressure * 100000; // Convert bar to Pa
        
        // Theoretical voltage (Nernst equation)
        const nernstVoltage = this.constants.theoreticalCellVoltage + 
            (this.constants.gasConstant * temp / (2 * this.constants.faradayConstant)) * 
            Math.log(pressure / this.constants.standardPressure);
        
        // Overpotentials
        this.metrics.activationOverpotential = this.calculateActivationOverpotential();
        this.metrics.ohmicOverpotential = this.calculateOhmicOverpotential();
        this.metrics.concentrationOverpotential = this.calculateConcentrationOverpotential();
        
        this.metrics.overpotential = this.metrics.activationOverpotential + 
                                   this.metrics.ohmicOverpotential + 
                                   this.metrics.concentrationOverpotential;
        
        // Total cell voltage
        this.metrics.cellVoltage = nernstVoltage + this.metrics.overpotential;
        
        // Stack voltage (multiple cells in series)
        this.metrics.stackVoltage = this.metrics.cellVoltage * this.parameters.cellCount;
    }
    
    calculateActivationOverpotential() {
        // Butler-Volmer equation (simplified)
        const exchangeCurrentDensity = 0.001; // A/cm² (typical for Pt electrodes)
        const transferCoefficient = 0.5;
        const temp = this.parameters.temperature + this.constants.standardTemperature;
        
        const overpotential = (this.constants.gasConstant * temp) / 
                            (transferCoefficient * this.constants.faradayConstant) * 
                            Math.asinh(this.parameters.currentDensity / (2 * exchangeCurrentDensity));
        
        return Math.max(0.05, Math.min(0.4, overpotential)); // Realistic bounds
    }
    
    calculateOhmicOverpotential() {
        // Ohm's law: V = I * R
        const membraneThickness = 0.018; // cm (typical Nafion membrane)
        const conductivity = this.calculateElectrolyteConductivity();
        
        const resistance = membraneThickness / conductivity; // Ω·cm²
        this.metrics.membraneResistance = resistance;
        
        return this.parameters.currentDensity * resistance;
    }
    
    calculateElectrolyteConductivity() {
        // KOH conductivity as function of concentration and temperature
        const concentration = this.parameters.electrolyteConcentration / 100; // Convert to fraction
        const temp = this.parameters.temperature;
        
        // Empirical formula for KOH conductivity (S/cm)
        const baseConductivity = 0.8 * concentration * (1 - concentration);
        const tempFactor = 1 + 0.02 * (temp - 25); // 2% per degree
        
        return baseConductivity * tempFactor;
    }
    
    calculateConcentrationOverpotential() {
        // Mass transport limitations
        const limitingCurrentDensity = 2.0; // A/cm² (typical limit)
        const temp = this.parameters.temperature + this.constants.standardTemperature;
        
        if (this.parameters.currentDensity >= limitingCurrentDensity * 0.9) {
            return (this.constants.gasConstant * temp / this.constants.faradayConstant) * 
                   Math.log(limitingCurrentDensity / (limitingCurrentDensity - this.parameters.currentDensity));
        }
        
        return 0.02 * (this.parameters.currentDensity / limitingCurrentDensity); // Linear approximation
    }
    
    calculateElectricalMetrics() {
        // Stack current
        this.metrics.stackCurrent = this.parameters.currentDensity * this.parameters.electrodeArea;
        
        // Total power input
        this.metrics.powerInput = (this.metrics.stackVoltage * this.metrics.stackCurrent) / 1000; // kW
        
        // Power factor and electrical efficiency
        this.metrics.electricalEfficiency = (this.constants.theoreticalCellVoltage / this.metrics.cellVoltage) * 100;
    }
    
    calculateProductionRates() {
        // Faraday's law: n = I * t / (z * F)
        // Where: n = moles, I = current (A), t = time (s), z = electrons per molecule, F = Faraday constant
        
        const current = this.metrics.stackCurrent;
        const faradaicEff = this.metrics.faradaicEfficiency / 100;
        const timePerHour = 3600; // seconds
        
        // Hydrogen production (2 electrons per H₂ molecule)
        const h2MolesPerHour = (current * timePerHour * faradaicEff) / (2 * this.constants.faradayConstant);
        
        // Convert to Nm³/hr (Normal cubic meters per hour at STP)
        const gasConstantLiter = 0.0821; // L·atm/(mol·K)
        this.metrics.h2Production = (h2MolesPerHour * gasConstantLiter * this.constants.standardTemperature) / 1.01325 / 1000; // Nm³/hr
        
        // Oxygen production (stoichiometric ratio 1:2)
        this.metrics.o2Production = this.metrics.h2Production / 2;
        
        // Water consumption (stoichiometric: 1 H₂O → 1 H₂ + 0.5 O₂)
        const waterMolesPerHour = h2MolesPerHour;
        this.metrics.waterConsumption = (waterMolesPerHour * this.constants.waterMolarMass) / 1000; // kg/hr
    }
    
    calculateEfficiencies() {
        // Faradaic efficiency (typically 95-99% for water electrolysis)
        const baseEfficiency = 98.5;
        const tempPenalty = Math.abs(this.parameters.temperature - 70) * 0.1;
        const qualityPenalty = (this.parameters.waterQuality - 0.1) * 0.05;
        const currentPenalty = Math.max(0, (this.parameters.currentDensity - 1.5) * 2);
        
        this.metrics.faradaicEfficiency = Math.max(90, Math.min(99.5, 
            baseEfficiency - tempPenalty - qualityPenalty - currentPenalty));
        
        // Current efficiency (accounts for parasitic reactions)
        this.metrics.currentEfficiency = Math.max(85, this.metrics.faradaicEfficiency - 2);
        
        // Thermal efficiency
        const theoreticalHeat = 285.8; // kJ/mol H₂ (higher heating value)
        const actualHeat = this.metrics.cellVoltage * this.constants.faradayConstant / 1000; // kJ/mol
        this.metrics.thermalEfficiency = (theoreticalHeat / actualHeat) * 100;
        
        // Overall system efficiency
        this.metrics.efficiency = (this.metrics.faradaicEfficiency / 100) * 
                                 (this.metrics.electricalEfficiency / 100) * 
                                 (this.metrics.thermalEfficiency / 100) * 100;
    }
    
    calculateEnergyMetrics() {
        // Specific energy consumption (kWh/Nm³ H₂)
        if (this.metrics.h2Production > 0) {
            this.metrics.specificEnergyConsumption = this.metrics.powerInput / this.metrics.h2Production;
        } else {
            this.metrics.specificEnergyConsumption = 0;
        }
        
        // Energy cost ($/Nm³ H₂)
        this.metrics.energyCost = this.metrics.specificEnergyConsumption * this.constants.electricityPrice;
        
        // Efficiency-based cost penalty
        const efficiencyFactor = this.metrics.efficiency / 75; // Normalize to 75% baseline
        this.metrics.energyCost = this.metrics.energyCost / efficiencyFactor;
    }
    
    updateSystemHealth() {
        // System health based on operating conditions
        let health = 100;
        
        // Temperature stress
        const tempStress = Math.abs(this.parameters.temperature - 70) / 50; // Optimal at 70°C
        health -= tempStress * 10;
        
        // Current density stress
        const currentStress = Math.max(0, (this.parameters.currentDensity - 1.5) / 0.5);
        health -= currentStress * 15;
        
        // Voltage stress
        const voltageStress = Math.max(0, (this.parameters.voltage - 2.0) / 0.5);
        health -= voltageStress * 5;
        
        // Water quality impact
        const qualityStress = (this.parameters.waterQuality - 0.1) / 100;
        health -= qualityStress * 20;
        
        this.metrics.systemHealth = Math.max(50, Math.min(100, health));
        
        // Update degradation metrics
        if (this.isRunning) {
            const degradationRate = (100 - health) / 100000; // Very slow degradation
            this.metrics.cellDegradation += degradationRate;
            this.metrics.electrodeWear += degradationRate * 0.5;
        }
    }
    
    // Simulation control methods
    startSimulation() {
        this.isRunning = true;
        this.simulationTime = Date.now();
        this.currentMode = 'startup';
        
        console.log('🚀 Advanced hydrogen simulation started');
        this.triggerSimulationStateChange('start');
    }
    
    pauseSimulation() {
        this.isRunning = false;
        this.currentMode = 'paused';
        this.triggerSimulationStateChange('pause');
    }
    
    resetSimulation() {
        this.isRunning = false;
        this.simulationTime = 0;
        this.currentMode = 'startup';
        
        // Reset metrics
        this.metrics.cellDegradation = 0;
        this.metrics.electrodeWear = 0;
        this.metrics.uptime = 0;
        
        // Clear history
        Object.keys(this.history).forEach(key => {
            this.history[key] = [];
        });
        
        this.triggerSimulationStateChange('reset');
    }
    
    // Advanced optimization features
    autoOptimize() {
        console.log('🎯 Running auto-optimization...');
        const optimalParams = this.findOptimalParameters();
        this.animateParameterChanges(optimalParams);
        return optimalParams;
    }
    
    constraintOptimize() {
        console.log('🔒 Running constraint-based optimization...');
        const optimalParams = this.findOptimalParametersWithConstraints();
        this.animateParameterChanges(optimalParams);
        return optimalParams;
    }
    
    findOptimalParameters() {
        // Multi-objective optimization for maximum efficiency and production
        return {
            voltage: 1.6,        // Lower voltage = higher efficiency
            currentDensity: 1.2, // Balanced for production vs efficiency
            temperature: 70,     // Optimal kinetics
            pressure: 15,        // Good balance
            waterQuality: 0.1,   // Highest purity
            electrolyteConcentration: 30 // Standard concentration
        };
    }
    
    findOptimalParametersWithConstraints() {
        const optimal = {};
        
        Object.keys(this.parameters).forEach(param => {
            if (this.constraints[param] && this.constraints[param].locked) {
                optimal[param] = this.parameters[param];
            } else if (this.constraints[param] && this.constraints[param].optimal) {
                const constraint = this.constraints[param];
                optimal[param] = Math.max(constraint.min, Math.min(constraint.max, constraint.optimal));
            } else {
                optimal[param] = this.parameters[param];
            }
        });
        
        return optimal;
    }
    
    animateParameterChanges(targetParams) {
        const duration = 3000; // 3 seconds
        const steps = 30;
        const stepDuration = duration / steps;
        
        let step = 0;
        const interval = setInterval(() => {
            step++;
            
            Object.keys(targetParams).forEach(param => {
                if (this.parameters.hasOwnProperty(param)) {
                    const current = this.parameters[param];
                    const target = targetParams[param];
                    const progress = step / steps;
                    
                    // Smooth easing function
                    const easedProgress = 1 - Math.cos(progress * Math.PI / 2);
                    const newValue = current + (target - current) * easedProgress;
                    
                    this.updateParameter(param, newValue);
                }
            });
            
            if (step >= steps) {
                clearInterval(interval);
                console.log('✅ Parameter optimization complete');
            }
        }, stepDuration);
    }
    
    // Constraint management
    setConstraint(param, locked, min = null, max = null, optimal = null) {
        if (this.constraints[param]) {
            this.constraints[param].locked = locked;
            if (min !== null) this.constraints[param].min = min;
            if (max !== null) this.constraints[param].max = max;
            if (optimal !== null) this.constraints[param].optimal = optimal;
        }
    }
    
    getConstraints() {
        return { ...this.constraints };
    }
    
    // Event system
    triggerParameterChange(param, oldValue, newValue) {
        const event = new CustomEvent('advancedParameterChange', {
            detail: { 
                parameter: param, 
                oldValue: oldValue,
                newValue: newValue, 
                metrics: this.metrics,
                efficiency: this.metrics.efficiency,
                production: this.metrics.h2Production
            }
        });
        document.dispatchEvent(event);
    }
    
    triggerSimulationStateChange(state) {
        const event = new CustomEvent('advancedSimulationStateChange', {
            detail: { 
                state: state, 
                metrics: this.metrics,
                parameters: this.parameters,
                mode: this.currentMode
            }
        });
        document.dispatchEvent(event);
    }
    
    // Data export and analysis
    getCurrentState() {
        return {
            parameters: { ...this.parameters },
            metrics: { ...this.metrics },
            history: { ...this.history },
            constraints: { ...this.constraints },
            constants: { ...this.constants },
            isRunning: this.isRunning,
            currentMode: this.currentMode
        };
    }
    
    exportData() {
        return {
            timestamp: new Date().toISOString(),
            simulationData: this.getCurrentState(),
            performance: {
                averageEfficiency: this.calculateAverageEfficiency(),
                totalProduction: this.calculateTotalProduction(),
                energyIntensity: this.metrics.specificEnergyConsumption
            }
        };
    }
    
    calculateAverageEfficiency() {
        if (this.history.efficiency.length === 0) return 0;
        return this.history.efficiency.reduce((sum, val) => sum + val, 0) / this.history.efficiency.length;
    }
    
    calculateTotalProduction() {
        if (this.history.h2Production.length === 0) return 0;
        return this.history.h2Production.reduce((sum, val) => sum + val, 0);
    }
    
    // Predictive maintenance
    predictMaintenanceNeeds() {
        const predictions = [];
        
        if (this.metrics.cellDegradation > 5) {
            predictions.push({
                component: 'Electrolysis Cells',
                urgency: 'medium',
                timeToMaintenance: Math.max(0, (10 - this.metrics.cellDegradation) * 100), // hours
                reason: 'Cell performance degradation detected'
            });
        }
        
        if (this.metrics.electrodeWear > 3) {
            predictions.push({
                component: 'Electrodes',
                urgency: 'low',
                timeToMaintenance: Math.max(0, (5 - this.metrics.electrodeWear) * 200), // hours
                reason: 'Electrode wear approaching maintenance threshold'
            });
        }
        
        if (this.metrics.membraneResistance > 0.25) {
            predictions.push({
                component: 'Membrane',
                urgency: 'high',
                timeToMaintenance: 48, // hours
                reason: 'Membrane resistance indicates fouling or degradation'
            });
        }
        
        return predictions;
    }
}

// Make globally accessible
window.AdvancedHydrogenSimulation = AdvancedHydrogenSimulation;

