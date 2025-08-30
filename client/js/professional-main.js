/**
 * Professional Hydrogen Factory Application
 * Advanced integration of physics-based simulation and 3D visualization
 * Based on real electrochemical principles and industrial design
 */

class ProfessionalHydrogenFactoryApp {
    constructor() {
        console.log('🏭 Initializing Professional Hydrogen Factory...');
        
        // Core systems
        this.advancedSimulation = null;
        this.professionalVisualization = null;
        this.factorySimulation = null; // Legacy compatibility
        this.uiManager = null;
        this.chartManager = null;
        this.alertManager = null;
        
        // Application state
        this.isInitialized = false;
        this.isRunning = false;
        this.currentMode = 'manual'; // manual, auto, optimization
        this.selectedSystem = 'electrolysis';
        
        // Real-time data
        this.realTimeData = {
            timestamp: Date.now(),
            parameters: {},
            metrics: {},
            history: {},
            alerts: []
        };
        
        // Performance monitoring
        this.performance = {
            frameRate: 0,
            updateFrequency: 60, // Hz
            lastUpdate: Date.now(),
            frameCount: 0
        };
        
        // Professional UI elements
        this.ui = {
            viewport: null,
            controlPanel: null,
            metricsPanel: null,
            chartsPanel: null,
            alertsPanel: null,
            statusBar: null
        };
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    
    async init() {
        try {
            console.log('🔧 Initializing professional systems...');
            
            // Initialize UI elements
            this.initializeUI();
            
            // Initialize advanced simulation engine
            await this.initializeAdvancedSimulation();
            
            // Initialize professional 3D visualization
            await this.initializeProfessionalVisualization();
            
            // Initialize legacy systems for compatibility
            await this.initializeLegacySystems();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Setup real-time updates
            this.setupRealTimeUpdates();
            
            // Setup professional charts and UI
            this.setupProfessionalCharts();
            
            // Initialize charts and metrics
            this.initializeCharts();
            
            this.isInitialized = true;
            console.log('✅ Professional Hydrogen Factory initialized successfully!');
            
            // Show welcome message
            this.showWelcomeMessage();
            
        } catch (error) {
            console.error('❌ Failed to initialize Professional Hydrogen Factory:', error);
            this.showErrorMessage(error);
        }
    }
    
    initializeUI() {
        console.log('🎨 Initializing professional UI...');
        
        // Get main UI elements
        this.ui.viewport = document.getElementById('viewport');
        this.ui.controlPanel = document.querySelector('.control-panel');
        this.ui.metricsPanel = document.querySelector('.metrics-panel');
        this.ui.statusBar = document.querySelector('.status-bar');
        
        // Initialize UI managers
        if (typeof UIManager !== 'undefined') {
            this.uiManager = new UIManager();
        }
        
        if (typeof AlertManager !== 'undefined') {
            this.alertManager = new AlertManager();
        }
        
        if (typeof ChartManager !== 'undefined') {
            this.chartManager = new ChartManager();
        }
        
        console.log('✅ Professional UI initialized');
    }
    
    async initializeAdvancedSimulation() {
        console.log('🔬 Initializing advanced simulation engine...');
        
        try {
            if (typeof AdvancedHydrogenSimulation !== 'undefined') {
                this.advancedSimulation = new AdvancedHydrogenSimulation();
                
                // Setup advanced event listeners
                document.addEventListener('advancedParameterChange', (event) => {
                    this.handleAdvancedParameterChange(event.detail);
                });
                
                document.addEventListener('advancedSimulationStateChange', (event) => {
                    this.handleAdvancedSimulationStateChange(event.detail);
                });
                
                console.log('✅ Advanced simulation engine initialized');
            } else {
                console.warn('⚠️ AdvancedHydrogenSimulation not available - using basic simulation');
                // Continue without advanced simulation
            }
        } catch (error) {
            console.error('❌ Failed to initialize advanced simulation:', error);
            // Continue with basic functionality
        }
    }
    
    async initializeProfessionalVisualization() {
        console.log('🎬 Initializing professional 3D visualization...');
        
        try {
            if (typeof ProfessionalHydrogenVisualization !== 'undefined' && this.ui.viewport) {
                this.professionalVisualization = new ProfessionalHydrogenVisualization('viewport');
                
                // Set initial quality based on device capabilities
                const quality = this.detectOptimalQuality();
                this.professionalVisualization.setQuality(quality);
                
                console.log(`✅ Professional 3D visualization initialized (Quality: ${quality})`);
            } else {
                console.warn('⚠️ ProfessionalHydrogenVisualization not available or viewport not found - using 2D fallback');
                // Continue without 3D visualization
            }
        } catch (error) {
            console.error('❌ Failed to initialize 3D visualization:', error);
            // Continue with basic functionality
        }
    }
    
    detectOptimalQuality() {
        // Detect device capabilities for optimal performance
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        
        if (!gl) return 'low';
        
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
        
        // Simple heuristics for quality detection
        if (renderer.includes('GTX') || renderer.includes('RTX') || renderer.includes('Radeon RX')) {
            return 'ultra';
        } else if (renderer.includes('Intel') && !renderer.includes('UHD')) {
            return 'medium';
        } else if (window.devicePixelRatio > 2) {
            return 'medium';
        } else {
            return 'high';
        }
    }
    
    async initializeLegacySystems() {
        console.log('🔄 Initializing legacy systems for compatibility...');
        
        try {
            // Initialize factory simulation for compatibility
            if (typeof FactorySimulation !== 'undefined') {
                this.factorySimulation = new FactorySimulation();
                await this.factorySimulation.init();
                console.log('✅ Legacy factory simulation initialized');
            } else {
                console.warn('⚠️ Legacy FactorySimulation not available');
            }
        } catch (error) {
            console.error('❌ Failed to initialize legacy systems:', error);
            // Continue without legacy systems
        }
    }
    
    setupEventListeners() {
        console.log('👂 Setting up professional event listeners...');
        
        // Factory control buttons
        const startBtn = document.getElementById('start-factory-btn');
        const stopBtn = document.getElementById('stop-factory-btn');
        const optimizeBtn = document.getElementById('optimize-btn');
        const emergencyBtn = document.getElementById('emergency-stop-btn');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startFactory());
        }
        
        if (stopBtn) {
            stopBtn.addEventListener('click', () => this.stopFactory());
        }
        
        if (optimizeBtn) {
            optimizeBtn.addEventListener('click', () => this.optimizeParameters());
        }
        
        if (emergencyBtn) {
            emergencyBtn.addEventListener('click', () => this.emergencyStop());
        }
        
        // Advanced parameter controls
        this.setupParameterControls();
        
        // System selection tabs
        this.setupSystemTabs();
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        console.log('✅ Event listeners configured');
    }
    
    setupParameterControls() {
        // Voltage control
        const voltageSlider = document.getElementById('voltage-slider');
        const voltageDisplay = document.getElementById('voltage-display');
        
        if (voltageSlider && this.advancedSimulation) {
            let isUpdating = false;
            
            voltageSlider.addEventListener('input', (e) => {
                if (isUpdating) return;
                isUpdating = true;
                
                const value = parseFloat(e.target.value);
                const newValue = this.advancedSimulation.updateParameter('voltage', value);
                
                if (voltageDisplay) {
                    voltageDisplay.textContent = newValue.toFixed(2) + 'V';
                }
                
                // Visual feedback
                this.showParameterChange('voltage', value);
                
                setTimeout(() => { isUpdating = false; }, 50);
            });
        }
        
        // Current density control
        const currentDensitySlider = document.getElementById('current-density-slider');
        const currentDensityDisplay = document.getElementById('current-density-display');
        
        if (currentDensitySlider && this.advancedSimulation) {
            currentDensitySlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                const newValue = this.advancedSimulation.updateParameter('currentDensity', value);
                
                if (currentDensityDisplay) {
                    currentDensityDisplay.textContent = newValue.toFixed(2) + ' A/cm²';
                }
                
                this.showParameterChange('currentDensity', value);
            });
        }
        
        // Temperature control
        const temperatureSlider = document.getElementById('temperature-slider');
        const temperatureDisplay = document.getElementById('temperature-display');
        
        if (temperatureSlider && this.advancedSimulation) {
            temperatureSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                const newValue = this.advancedSimulation.updateParameter('temperature', value);
                
                if (temperatureDisplay) {
                    temperatureDisplay.textContent = newValue.toFixed(1) + '°C';
                }
                
                this.showParameterChange('temperature', value);
                this.updateTemperatureEffects(value);
            });
        }
        
        // Pressure control
        const pressureSlider = document.getElementById('pressure-slider');
        const pressureDisplay = document.getElementById('pressure-display');
        
        if (pressureSlider && this.advancedSimulation) {
            pressureSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                const newValue = this.advancedSimulation.updateParameter('pressure', value);
                
                if (pressureDisplay) {
                    pressureDisplay.textContent = newValue.toFixed(1) + ' bar';
                }
                
                this.showParameterChange('pressure', value);
            });
        }
        
        // Water quality control
        const waterQualitySlider = document.getElementById('water-quality-slider');
        const waterQualityDisplay = document.getElementById('water-quality-display');
        
        if (waterQualitySlider && this.advancedSimulation) {
            waterQualitySlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                const newValue = this.advancedSimulation.updateParameter('waterQuality', value);
                
                if (waterQualityDisplay) {
                    waterQualityDisplay.textContent = newValue.toFixed(1) + ' ppm';
                }
                
                this.showParameterChange('waterQuality', value);
            });
        }
    }
    
    setupSystemTabs() {
        const systemTabs = document.querySelectorAll('.system-tab');
        
        systemTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const system = e.target.dataset.system;
                if (system) {
                    this.selectSystem(system);
                }
            });
        });
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Prevent shortcuts when typing in inputs
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            switch (e.key.toLowerCase()) {
                case ' ': // Spacebar - Start/Stop
                    e.preventDefault();
                    this.isRunning ? this.stopFactory() : this.startFactory();
                    break;
                case 'o': // Optimize
                    this.optimizeParameters();
                    break;
                case 'r': // Reset
                    this.resetSimulation();
                    break;
                case 'e': // Emergency stop
                    this.emergencyStop();
                    break;
                case '1':
                    this.selectSystem('electrolysis');
                    break;
                case '2':
                    this.selectSystem('purification');
                    break;
                case '3':
                    this.selectSystem('compression');
                    break;
                case '4':
                    this.selectSystem('storage');
                    break;
            }
        });
    }
    
    setupRealTimeUpdates() {
        console.log('⏱️ Setting up real-time updates...');
        
        // High-frequency updates for visualization
        setInterval(() => {
            if (this.isRunning) {
                this.updateVisualization();
                this.updatePerformanceMetrics();
            }
        }, 1000 / this.performance.updateFrequency);
        
        // Medium-frequency updates for UI
        setInterval(() => {
            if (this.isRunning) {
                this.updateUI();
                this.updateCharts();
            }
        }, 500);
        
        // Low-frequency updates for data logging
        setInterval(() => {
            if (this.isRunning) {
                this.logData();
                this.checkAlerts();
            }
        }, 2000);
        
        console.log('✅ Real-time updates configured');
    }
    
    setupProfessionalCharts() {
        console.log('📊 Setting up professional charts and UI...');
        
        // Additional professional UI setup can go here
        // For now, this is handled in initializeCharts()
        
        console.log('✅ Professional charts and UI configured');
    }
    
    initializeCharts() {
        console.log('📊 Initializing professional charts...');
        
        if (this.chartManager) {
            // Production rate chart
            this.chartManager.createChart('production-chart', {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'H₂ Production (Nm³/hr)',
                        data: [],
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    animation: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Production Rate (Nm³/hr)'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Time'
                            }
                        }
                    }
                }
            });
            
            // Efficiency chart
            this.chartManager.createChart('efficiency-chart', {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'System Efficiency (%)',
                        data: [],
                        borderColor: '#2ecc71',
                        backgroundColor: 'rgba(46, 204, 113, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    animation: false,
                    scales: {
                        y: {
                            min: 60,
                            max: 100,
                            title: {
                                display: true,
                                text: 'Efficiency (%)'
                            }
                        }
                    }
                }
            });
            
            // Power consumption chart
            this.chartManager.createChart('power-chart', {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Power Input (kW)',
                        data: [],
                        borderColor: '#e74c3c',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    animation: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Power (kW)'
                            }
                        }
                    }
                }
            });
        }
        
        console.log('✅ Professional charts initialized');
    }
    
    // Factory control methods
    startFactory() {
        if (this.isRunning) return;
        
        console.log('🚀 Starting professional hydrogen factory...');
        
        try {
            // Start advanced simulation
            if (this.advancedSimulation) {
                this.advancedSimulation.startSimulation();
            }
            
            // Start professional visualization
            if (this.professionalVisualization) {
                this.professionalVisualization.startAnimation();
            }
            
            // Start legacy systems
            if (this.factorySimulation) {
                this.factorySimulation.startFactory();
            }
            
            this.isRunning = true;
            this.updateFactoryStatus('Running');
            
            // Show success alert
            if (this.alertManager) {
                this.alertManager.showAlert('success', 'Factory Started', 'Hydrogen production is now active');
            }
            
            console.log('✅ Professional hydrogen factory started successfully');
            
        } catch (error) {
            console.error('❌ Failed to start factory:', error);
            if (this.alertManager) {
                this.alertManager.showAlert('error', 'Startup Failed', error.message);
            }
        }
    }
    
    stopFactory() {
        if (!this.isRunning) return;
        
        console.log('⏹️ Stopping professional hydrogen factory...');
        
        try {
            // Stop advanced simulation
            if (this.advancedSimulation) {
                this.advancedSimulation.pauseSimulation();
            }
            
            // Stop professional visualization
            if (this.professionalVisualization) {
                this.professionalVisualization.stopAnimation();
            }
            
            // Stop legacy systems
            if (this.factorySimulation) {
                this.factorySimulation.emergencyStop();
            }
            
            this.isRunning = false;
            this.updateFactoryStatus('Stopped');
            
            // Show info alert
            if (this.alertManager) {
                this.alertManager.showAlert('info', 'Factory Stopped', 'Hydrogen production has been stopped');
            }
            
            console.log('✅ Professional hydrogen factory stopped');
            
        } catch (error) {
            console.error('❌ Failed to stop factory:', error);
        }
    }
    
    emergencyStop() {
        console.log('🚨 EMERGENCY STOP ACTIVATED!');
        
        try {
            // Emergency stop all systems immediately
            if (this.advancedSimulation) {
                this.advancedSimulation.pauseSimulation();
            }
            
            if (this.professionalVisualization) {
                this.professionalVisualization.stopAnimation();
            }
            
            if (this.factorySimulation) {
                this.factorySimulation.emergencyStop();
            }
            
            this.isRunning = false;
            this.updateFactoryStatus('EMERGENCY STOP');
            
            // Show critical alert
            if (this.alertManager) {
                this.alertManager.showAlert('error', '🚨 EMERGENCY STOP', 'All systems have been shut down immediately');
            }
            
            // Flash the interface red
            document.body.style.animation = 'emergency-flash 0.5s ease-in-out 3';
            
        } catch (error) {
            console.error('❌ Emergency stop failed:', error);
        }
    }
    
    optimizeParameters() {
        console.log('🎯 Running parameter optimization...');
        
        if (!this.advancedSimulation) {
            console.warn('⚠️ Advanced simulation not available for optimization');
            return;
        }
        
        try {
            // Show optimization in progress
            if (this.alertManager) {
                this.alertManager.showAlert('info', '🎯 Optimizing', 'Finding optimal parameters...');
            }
            
            // Run constraint-based optimization
            const optimalParams = this.advancedSimulation.constraintOptimize();
            
            // Show results
            setTimeout(() => {
                if (this.alertManager) {
                    this.alertManager.showAlert('success', '✅ Optimization Complete', 
                        `Parameters optimized for maximum efficiency: ${this.advancedSimulation.metrics.efficiency.toFixed(1)}%`);
                }
            }, 3000);
            
            console.log('✅ Parameter optimization complete:', optimalParams);
            
        } catch (error) {
            console.error('❌ Optimization failed:', error);
            if (this.alertManager) {
                this.alertManager.showAlert('error', 'Optimization Failed', error.message);
            }
        }
    }
    
    resetSimulation() {
        console.log('🔄 Resetting simulation...');
        
        try {
            if (this.advancedSimulation) {
                this.advancedSimulation.resetSimulation();
            }
            
            this.isRunning = false;
            this.updateFactoryStatus('Reset');
            
            // Clear charts
            if (this.chartManager) {
                this.chartManager.clearAllCharts();
            }
            
            if (this.alertManager) {
                this.alertManager.showAlert('info', '🔄 Reset Complete', 'Simulation has been reset to initial state');
            }
            
        } catch (error) {
            console.error('❌ Reset failed:', error);
        }
    }
    
    selectSystem(systemName) {
        console.log(`🎯 Selecting system: ${systemName}`);
        
        this.selectedSystem = systemName;
        
        // Update UI to show selected system
        const tabs = document.querySelectorAll('.system-tab');
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.system === systemName);
        });
        
        // Focus visualization on selected system
        if (this.professionalVisualization) {
            // This would focus the camera on the selected system
            console.log(`🔍 Focusing visualization on ${systemName}`);
        }
        
        // Update control panel for selected system
        this.updateControlPanelForSystem(systemName);
    }
    
    updateControlPanelForSystem(systemName) {
        // Hide all system-specific controls
        const systemControls = document.querySelectorAll('.system-controls');
        systemControls.forEach(control => {
            control.style.display = 'none';
        });
        
        // Show controls for selected system
        const selectedControls = document.getElementById(`${systemName}-controls`);
        if (selectedControls) {
            selectedControls.style.display = 'block';
        }
    }
    
    // Real-time update methods
    updateVisualization() {
        if (!this.professionalVisualization || !this.advancedSimulation) return;
        
        // Get current simulation state
        const state = this.advancedSimulation.getCurrentState();
        
        // Update visualization parameters
        this.professionalVisualization.updateParameters({
            temperature: state.parameters.temperature,
            pressure: state.parameters.pressure,
            currentDensity: state.parameters.currentDensity,
            voltage: state.parameters.voltage,
            efficiency: state.metrics.efficiency,
            h2Production: state.metrics.h2Production,
            powerInput: state.metrics.powerInput
        });
    }
    
    updateUI() {
        if (!this.advancedSimulation) return;
        
        const state = this.advancedSimulation.getCurrentState();
        const metrics = state.metrics;
        
        // Update metric displays
        this.updateMetricDisplay('h2-production', metrics.h2Production.toFixed(2) + ' Nm³/hr');
        this.updateMetricDisplay('o2-production', metrics.o2Production.toFixed(2) + ' Nm³/hr');
        this.updateMetricDisplay('efficiency', metrics.efficiency.toFixed(1) + '%');
        this.updateMetricDisplay('power-input', metrics.powerInput.toFixed(1) + ' kW');
        this.updateMetricDisplay('cell-voltage', metrics.cellVoltage.toFixed(3) + ' V');
        this.updateMetricDisplay('energy-cost', '$' + metrics.energyCost.toFixed(3) + '/Nm³');
        this.updateMetricDisplay('system-health', metrics.systemHealth.toFixed(0) + '%');
        
        // Update parameter displays
        this.updateMetricDisplay('temperature-current', state.parameters.temperature.toFixed(1) + '°C');
        this.updateMetricDisplay('pressure-current', state.parameters.pressure.toFixed(1) + ' bar');
        this.updateMetricDisplay('voltage-current', state.parameters.voltage.toFixed(2) + 'V');
        this.updateMetricDisplay('current-density-current', state.parameters.currentDensity.toFixed(2) + ' A/cm²');
        
        // Update efficiency breakdown
        this.updateMetricDisplay('faradaic-efficiency', metrics.faradaicEfficiency.toFixed(1) + '%');
        this.updateMetricDisplay('current-efficiency', metrics.currentEfficiency.toFixed(1) + '%');
        this.updateMetricDisplay('thermal-efficiency', metrics.thermalEfficiency.toFixed(1) + '%');
        
        // Update overpotential breakdown
        this.updateMetricDisplay('activation-overpotential', (metrics.activationOverpotential * 1000).toFixed(0) + ' mV');
        this.updateMetricDisplay('ohmic-overpotential', (metrics.ohmicOverpotential * 1000).toFixed(0) + ' mV');
        this.updateMetricDisplay('concentration-overpotential', (metrics.concentrationOverpotential * 1000).toFixed(0) + ' mV');
    }
    
    updateMetricDisplay(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
            
            // Add visual feedback for changes
            element.style.transition = 'color 0.3s ease';
            element.style.color = '#2ecc71';
            setTimeout(() => {
                element.style.color = '';
            }, 300);
        }
    }
    
    updateCharts() {
        if (!this.chartManager || !this.advancedSimulation) return;
        
        const state = this.advancedSimulation.getCurrentState();
        const history = state.history;
        
        // Update production chart
        this.chartManager.updateChart('production-chart', {
            labels: history.time.map(t => (t / 60).toFixed(1) + 'min'),
            datasets: [{
                data: history.h2Production
            }]
        });
        
        // Update efficiency chart
        this.chartManager.updateChart('efficiency-chart', {
            labels: history.time.map(t => (t / 60).toFixed(1) + 'min'),
            datasets: [{
                data: history.efficiency
            }]
        });
        
        // Update power chart
        this.chartManager.updateChart('power-chart', {
            labels: history.time.map(t => (t / 60).toFixed(1) + 'min'),
            datasets: [{
                data: history.powerInput
            }]
        });
    }
    
    updatePerformanceMetrics() {
        this.performance.frameCount++;
        const now = Date.now();
        const elapsed = now - this.performance.lastUpdate;
        
        if (elapsed >= 1000) {
            this.performance.frameRate = this.performance.frameCount / (elapsed / 1000);
            this.performance.frameCount = 0;
            this.performance.lastUpdate = now;
            
            // Update performance display
            const fpsDisplay = document.getElementById('fps-display');
            if (fpsDisplay) {
                fpsDisplay.textContent = this.performance.frameRate.toFixed(1) + ' FPS';
            }
        }
    }
    
    updateFactoryStatus(status) {
        const statusElement = document.getElementById('factory-status');
        if (statusElement) {
            statusElement.textContent = status;
            statusElement.className = 'status ' + status.toLowerCase().replace(' ', '-');
        }
    }
    
    // Event handlers
    handleAdvancedParameterChange(detail) {
        console.log('📊 Advanced parameter changed:', detail);
        
        // Update UI immediately
        this.updateUI();
        
        // Show visual feedback
        this.showParameterChange(detail.parameter, detail.newValue);
        
        // Update visualization
        this.updateVisualization();
    }
    
    handleAdvancedSimulationStateChange(detail) {
        console.log('🔄 Advanced simulation state changed:', detail);
        
        switch (detail.state) {
            case 'start':
                this.updateFactoryStatus('Starting');
                break;
            case 'pause':
                this.updateFactoryStatus('Paused');
                break;
            case 'reset':
                this.updateFactoryStatus('Reset');
                break;
        }
    }
    
    showParameterChange(parameter, value) {
        // Visual feedback for parameter changes
        const element = document.querySelector(`[data-parameter="${parameter}"]`);
        if (element) {
            element.style.animation = 'parameter-change 0.5s ease-in-out';
            setTimeout(() => {
                element.style.animation = '';
            }, 500);
        }
    }
    
    updateTemperatureEffects(temperature) {
        // Update temperature-related visual effects
        const tempIndicator = document.getElementById('temperature-indicator');
        if (tempIndicator) {
            const hue = Math.max(0, Math.min(240, 240 - (temperature - 20) * 4)); // Blue to red
            tempIndicator.style.backgroundColor = `hsl(${hue}, 70%, 50%)`;
        }
    }
    
    logData() {
        if (!this.advancedSimulation) return;
        
        const state = this.advancedSimulation.getCurrentState();
        this.realTimeData = {
            timestamp: Date.now(),
            parameters: state.parameters,
            metrics: state.metrics,
            history: state.history,
            alerts: this.realTimeData.alerts
        };
        
        // Log to console for debugging (remove in production)
        if (Math.random() < 0.1) { // Log 10% of the time
            console.log('📊 Real-time data:', this.realTimeData);
        }
    }
    
    checkAlerts() {
        if (!this.advancedSimulation || !this.alertManager) return;
        
        const state = this.advancedSimulation.getCurrentState();
        const metrics = state.metrics;
        
        // Check for efficiency alerts
        if (metrics.efficiency < 70) {
            this.alertManager.showAlert('warning', 'Low Efficiency', 
                `System efficiency is ${metrics.efficiency.toFixed(1)}%. Consider optimizing parameters.`);
        }
        
        // Check for temperature alerts
        if (state.parameters.temperature > 75) {
            this.alertManager.showAlert('warning', 'High Temperature', 
                `Operating temperature is ${state.parameters.temperature.toFixed(1)}°C. Monitor for overheating.`);
        }
        
        // Check for system health alerts
        if (metrics.systemHealth < 80) {
            this.alertManager.showAlert('warning', 'System Health', 
                `System health is ${metrics.systemHealth.toFixed(0)}%. Maintenance may be required.`);
        }
        
        // Check for production alerts
        if (metrics.h2Production < 1.0 && this.isRunning) {
            this.alertManager.showAlert('error', 'Low Production', 
                `Hydrogen production is only ${metrics.h2Production.toFixed(2)} Nm³/hr. Check system parameters.`);
        }
    }
    
    showWelcomeMessage() {
        if (this.alertManager) {
            this.alertManager.showAlert('success', '🏭 Professional Hydrogen Factory Ready', 
                'Advanced simulation and 3D visualization initialized. Use controls to start production.');
        }
    }
    
    showErrorMessage(error) {
        if (this.alertManager) {
            this.alertManager.showAlert('error', '❌ Initialization Failed', 
                `Failed to initialize: ${error.message}. Please check console for details.`);
        }
    }
    
    // Public API methods
    getSimulationState() {
        return this.advancedSimulation ? this.advancedSimulation.getCurrentState() : null;
    }
    
    exportData() {
        return this.advancedSimulation ? this.advancedSimulation.exportData() : null;
    }
    
    setVisualizationQuality(quality) {
        if (this.professionalVisualization) {
            this.professionalVisualization.setQuality(quality);
            console.log(`🎨 Visualization quality set to: ${quality}`);
        }
    }
    
    // Cleanup
    destroy() {
        console.log('🧹 Destroying Professional Hydrogen Factory...');
        
        this.stopFactory();
        
        if (this.professionalVisualization) {
            this.professionalVisualization.dispose();
        }
        
        if (this.factorySimulation) {
            this.factorySimulation.destroy();
        }
        
        console.log('✅ Professional Hydrogen Factory destroyed');
    }
}

// CSS animations for professional effects
const professionalStyles = `
<style>
@keyframes emergency-flash {
    0%, 100% { background-color: transparent; }
    50% { background-color: rgba(231, 76, 60, 0.2); }
}

@keyframes parameter-change {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); box-shadow: 0 0 10px rgba(52, 152, 219, 0.5); }
    100% { transform: scale(1); }
}

.status {
    padding: 5px 10px;
    border-radius: 5px;
    font-weight: bold;
    text-transform: uppercase;
}

.status.running { background-color: #2ecc71; color: white; }
.status.stopped { background-color: #95a5a6; color: white; }
.status.emergency-stop { background-color: #e74c3c; color: white; animation: emergency-flash 1s infinite; }
.status.starting { background-color: #f39c12; color: white; }
.status.paused { background-color: #3498db; color: white; }

.system-tab.active {
    background-color: #3498db;
    color: white;
    box-shadow: 0 2px 10px rgba(52, 152, 219, 0.3);
}
</style>
`;

// Inject professional styles
document.head.insertAdjacentHTML('beforeend', professionalStyles);

// Initialize the professional application
let professionalApp;

// Wait for all dependencies to load
function initializeProfessionalApp() {
    if (typeof AdvancedHydrogenSimulation !== 'undefined' && 
        typeof ProfessionalHydrogenVisualization !== 'undefined') {
        
        professionalApp = new ProfessionalHydrogenFactoryApp();
        
        // Make globally accessible for debugging
        window.professionalApp = professionalApp;
        
        console.log('🎉 Professional Hydrogen Factory Application loaded successfully!');
        
    } else {
        console.log('⏳ Waiting for dependencies to load...');
        setTimeout(initializeProfessionalApp, 500);
    }
}

// Start initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeProfessionalApp);
} else {
    initializeProfessionalApp();
}

// Export for external access
window.ProfessionalHydrogenFactoryApp = ProfessionalHydrogenFactoryApp;
