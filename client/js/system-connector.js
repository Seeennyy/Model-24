/**
 * System Connector - Links all hydrogen factory systems together
 * Manages system dependencies and connections
 */

class SystemConnector {
    constructor() {
        this.systems = {};
        this.isInitialized = false;
        console.log('🔗 Initializing System Connector...');
    }
    
    async init() {
        try {
            // Wait for all systems to be available
            await this.waitForSystems();
            
            // Initialize all systems
            await this.initializeSystems();
            
            // Connect systems together
            this.connectSystems();
            
            // Start monitoring
            this.startMonitoring();
            
            this.isInitialized = true;
            console.log('✅ System Connector initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize System Connector:', error);
        }
    }
    
    async waitForSystems() {
        const requiredSystems = [
            'WaterSystem', 'ElectrolysisSystem', 'PurificationSystem', 
            'CompressionSystem', 'StorageSystem', 'PowerSystem'
        ];
        
        console.log('⏳ Waiting for systems to load...');
        
        for (let i = 0; i < 50; i++) { // Wait up to 5 seconds
            const allLoaded = requiredSystems.every(sys => typeof window[sys] !== 'undefined');
            if (allLoaded) {
                console.log('✅ All systems loaded');
                return;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        throw new Error('Some systems failed to load');
    }
    
    async initializeSystems() {
        console.log('🔧 Initializing individual systems...');
        
        // Initialize each system
        if (window.WaterSystem) {
            this.systems.water = new window.WaterSystem();
            await this.systems.water.init();
        }
        
        if (window.ElectrolysisSystem) {
            this.systems.electrolysis = new window.ElectrolysisSystem();
            await this.systems.electrolysis.init();
        }
        
        if (window.PurificationSystem) {
            this.systems.purification = new window.PurificationSystem();
            await this.systems.purification.init();
        }
        
        if (window.CompressionSystem) {
            this.systems.compression = new window.CompressionSystem();
            await this.systems.compression.init();
        }
        
        if (window.StorageSystem) {
            this.systems.storage = new window.StorageSystem();
            await this.systems.storage.init();
        }
        
        if (window.PowerSystem) {
            this.systems.power = new window.PowerSystem();
            await this.systems.power.init();
        }
        
        console.log('✅ All systems initialized');
    }
    
    connectSystems() {
        console.log('🔗 Connecting systems together...');
        
        // Power system connects to all other systems
        if (this.systems.power && this.systems.water) {
            this.systems.water.setPowerSystem(this.systems.power);
        }
        
        if (this.systems.power && this.systems.electrolysis) {
            this.systems.electrolysis.setPowerSystem(this.systems.power);
        }
        
        if (this.systems.power && this.systems.purification) {
            this.systems.purification.setPowerSystem(this.systems.power);
        }
        
        if (this.systems.power && this.systems.compression) {
            this.systems.compression.setPowerSystem(this.systems.power);
        }
        
        if (this.systems.power && this.systems.storage) {
            this.systems.storage.setPowerSystem(this.systems.power);
        }
        
        // Water system connects to electrolysis
        if (this.systems.water && this.systems.electrolysis) {
            this.systems.electrolysis.setWaterSystem(this.systems.water);
        }
        
        // Electrolysis connects to purification
        if (this.systems.electrolysis && this.systems.purification) {
            this.systems.purification.setInputSystem(this.systems.electrolysis);
            this.systems.purification.setElectrolysisSystem(this.systems.electrolysis);
            
            // Set up callback to notify purification when electrolysis production rate changes
            this.systems.electrolysis.setProductionRateChangeCallback(() => {
                this.systems.purification.recalculateFromElectrolysis();
            });
        }
        
        // Purification connects to compression
        if (this.systems.purification && this.systems.compression) {
            this.systems.compression.setInputSystem(this.systems.purification);
            this.systems.compression.setPurificationSystem(this.systems.purification);
        }
        
        // Compression connects to storage
        if (this.systems.compression && this.systems.storage) {
            this.systems.storage.setInputSystem(this.systems.compression);
            this.systems.storage.setCompressionSystem(this.systems.compression);
        }
        
        // Water system connects to storage (for cooling)
        if (this.systems.water && this.systems.storage) {
            this.systems.storage.setWaterSystem(this.systems.water);
        }
        
        console.log('✅ All systems connected');
    }
    
    startMonitoring() {
        console.log('📊 Starting system monitoring...');
        
        // Update systems every 100ms
        setInterval(() => {
            this.updateSystems();
        }, 100);
        
        // Update UI displays every 500ms
        setInterval(() => {
            this.updateUIDisplays();
        }, 500);
    }
    
    updateSystems() {
        const deltaTime = 0.1; // 100ms in seconds
        
        Object.values(this.systems).forEach(system => {
            if (system && typeof system.update === 'function') {
                system.update(deltaTime);
            }
        });
    }
    
    updateUIDisplays() {
        // Update system status displays
        this.updateSystemStatus('water');
        this.updateSystemStatus('electrolysis');
        this.updateSystemStatus('purification');
        this.updateSystemStatus('compression');
        this.updateSystemStatus('storage');
        this.updateSystemStatus('power');
        
        // Update overview metrics
        this.updateOverviewMetrics();
    }
    
    updateSystemStatus(systemName) {
        const system = this.systems[systemName];
        if (!system) return;
        
        const statusElement = document.getElementById(`${systemName}Status`);
        if (statusElement) {
            statusElement.textContent = system.getStatus();
            statusElement.className = `status-value ${system.getStatus()}`;
        }
        
        // Update connectivity displays
        this.updateConnectivityDisplay(systemName);
    }
    
    updateConnectivityDisplay(systemName) {
        const system = this.systems[systemName];
        if (!system || !system.getSystemConnectivity) return;
        
        const connectivity = system.getSystemConnectivity();
        
        Object.entries(connectivity).forEach(([connectedSystem, data]) => {
            const displayElement = document.getElementById(`${systemName}-${connectedSystem}-connectivity`);
            if (displayElement) {
                if (data.connected) {
                    displayElement.innerHTML = '✅ Connected';
                    displayElement.style.color = '#2ecc71';
                } else {
                    displayElement.innerHTML = '❌ Disconnected';
                    displayElement.style.color = '#e74c3c';
                }
            }
        });
    }
    
    updateOverviewMetrics() {
        // Update overview tab metrics
        if (this.systems.electrolysis) {
            const production = this.systems.electrolysis.getProductionRate ? this.systems.electrolysis.getProductionRate() : 0;
            this.updateElement('production-rate', `${production.toFixed(1)} Nm³/hr`);
            
            const efficiency = this.systems.electrolysis.getEfficiency ? this.systems.electrolysis.getEfficiency() : 0;
            this.updateElement('system-efficiency', `${efficiency.toFixed(1)}%`);
            
            const power = this.systems.electrolysis.getPowerConsumption ? this.systems.electrolysis.getPowerConsumption() : 0;
            this.updateElement('power-consumption', `${power.toFixed(1)} kW`);
        }
        
        if (this.systems.storage) {
            const fillLevel = this.systems.storage.getFillLevel ? this.systems.storage.getFillLevel() : 0;
            this.updateElement('overview-storage-level', `${fillLevel.toFixed(1)}%`);
        }
        
        // Update system-specific metrics
        this.updateSystemMetrics();
    }
    
    updateSystemMetrics() {
        // Water system metrics
        if (this.systems.water) {
            this.updateElement('water-resistivity', '8.5 MΩ·cm');
            this.updateElement('water-flow-rate', '1000 L/hr');
            this.updateElement('raw-water-tds', '500 ppm');
            this.updateElement('process-water-tds', '5.0 ppm');
        }
        
        // Electrolysis metrics
        if (this.systems.electrolysis) {
            this.updateElement('h2-production', '45.2 Nm³/hr');
            this.updateElement('o2-production', '22.6 Nm³/hr');
            this.updateElement('power-input', '1200 kW');
            this.updateElement('cell-voltage', '1.85V');
            this.updateElement('energy-cost', '$0.12/Nm³');
            this.updateElement('system-health', '95%');
        }
        
        // Purification metrics
        if (this.systems.purification) {
            this.updateElement('purification-input-rate', '45.2 Nm³/hr');
            this.updateElement('purification-output-rate', '44.8 Nm³/hr');
            this.updateElement('purification-efficiency', '99.1%');
            this.updateElement('purification-water-removal', '4.5 L/hr');
            this.updateElement('purification-power-consumption', '22.6 kW');
        }
        
        // Compression metrics
        if (this.systems.compression) {
            this.updateElement('compression-input-rate', '44.8 Nm³/hr');
            this.updateElement('compression-output-rate', '44.3 Nm³/hr');
            this.updateElement('compression-input-pressure', '25 bar');
            this.updateElement('compression-output-pressure', '350 bar');
            this.updateElement('compression-ratio', '14:1');
            this.updateElement('compression-power-consumption', '180 kW');
        }
        
        // Storage metrics
        if (this.systems.storage) {
            this.updateElement('storage-input-rate', '44.3 Nm³/hr');
            this.updateElement('storage-net-rate', '44.3 Nm³/hr');
            this.updateElement('storage-inventory', '2215 Nm³');
            this.updateElement('storage-fill-level', '22.2%');
            this.updateElement('storage-pressure', '350 bar');
            this.updateElement('storage-power-consumption', '6.1 kW');
        }
    }
    
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
    
    // System control methods
    startSystem(systemName) {
        const system = this.systems[systemName];
        if (system && typeof system.startup === 'function') {
            console.log(`🚀 Starting ${systemName} system...`);
            system.startup();
        }
    }
    
    stopSystem(systemName) {
        const system = this.systems[systemName];
        if (system && typeof system.shutdown === 'function') {
            console.log(`⏹️ Stopping ${systemName} system...`);
            system.shutdown();
        }
    }
    
    emergencyStopSystem(systemName) {
        const system = this.systems[systemName];
        if (system && typeof system.emergencyStop === 'function') {
            console.log(`🚨 Emergency stopping ${systemName} system...`);
            system.emergencyStop();
        }
    }
    
    // Get system instances for external access
    getSystem(systemName) {
        return this.systems[systemName];
    }
    
    getAllSystems() {
        return this.systems;
    }
    
    // Check if all systems are ready
    areSystemsReady() {
        return Object.values(this.systems).every(system => 
            system && system.isInitialized
        );
    }
}

// Initialize when DOM is ready
let systemConnector;

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(async () => {
        systemConnector = new SystemConnector();
        await systemConnector.init();
        
        // Make globally accessible
        window.systemConnector = systemConnector;
        
        console.log('🎉 System Connector Ready!');
        
    }, 1500);
});

// Export for global access
window.SystemConnector = SystemConnector;
