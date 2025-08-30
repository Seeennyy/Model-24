// Main Application Controller
// Dependencies loaded via CDN: Three.js, Chart.js, Socket.IO, GSAP

// Wait for all libraries to load
function waitForLibraries() {
    return new Promise((resolve) => {
        const checkLibraries = () => {
            if (typeof THREE !== 'undefined' && 
                typeof Chart !== 'undefined' && 
                typeof io !== 'undefined' && 
                typeof gsap !== 'undefined') {
                console.log('✅ All required libraries loaded');
                resolve();
            } else {
                console.log('⏳ Waiting for libraries to load...');
                setTimeout(checkLibraries, 100);
            }
        };
        checkLibraries();
    });
}

// Check if all required classes are available
function checkRequiredClasses() {
    // Check for all required classes
    const requiredClasses = [
        'TestClass',
        'UIManager',
        'AlertManager', 
        'ChartManager',
        'Factory2DAnimation',
        'FactorySimulation'
    ];
    
    const missingClasses = [];
    
    requiredClasses.forEach(className => {
        if (typeof window[className] === 'undefined') {
            missingClasses.push(className);
            console.error(`❌ ${className} class not found`);
        } else {
            console.log(`✅ ${className} class available`);
        }
    });
    
    if (missingClasses.length > 0) {
        throw new Error(`Missing required classes: ${missingClasses.join(', ')}`);
    }
    
    console.log('✅ All required classes are available');
}

class HydrogenFactoryApp {
    constructor() {
        this.animation2D = null;
        this.factorySimulation = null;
        this.uiManager = null;
        this.alertManager = null;
        this.chartManager = null;
        this.socketManager = null;
        this.isRunning = false;
        this.mainLoop = null;
        this.isInitialized = false;
    }

    async init() {
        try {
            console.log('🚀 Initializing Hydrogen Factory Simulation...');
            
            // Show loading progress
            this.showLoadingProgress('Testing basic functionality...', 20);
            
            // Test TestClass
            if (typeof TestClass !== 'undefined') {
                const testInstance = new TestClass();
                const result = testInstance.test();
                console.log('✅ TestClass test successful:', result);
            } else {
                throw new Error('TestClass not available');
            }
            
            this.showLoadingProgress('Initializing UI components...', 40);
            
            // Initialize UI components
            this.uiManager = new UIManager();
            await this.uiManager.init();
            
            this.alertManager = new AlertManager();
            await this.alertManager.init();
            
            this.chartManager = new ChartManager();
            await this.chartManager.init();
            
            // Initialize performance charts
            this.initPurificationChart();
            this.initCompressionChart();
            this.initStorageChart();
            this.initOverviewCharts();
            
            this.showLoadingProgress('Setting up 2D animation...', 60);
            // Initialize 2D animation
            this.animation2D = new Factory2DAnimation();
            await this.animation2D.init();

            this.showLoadingProgress('Initializing simulation engine...', 75);
            // Initialize simulation engine
            this.factorySimulation = new FactorySimulation();
            await this.factorySimulation.init();
            this.factorySimulation.setDifficulty('operator');
            
            // Setup event listeners
            this.setupEventListeners();
            
            this.showLoadingProgress('Starting render loop...', 90);
            // Start render/update loop
            this.startMainLoop();

            this.showLoadingProgress('Basic UI ready!', 100);
            
            // Hide loading screen and show app
            setTimeout(() => {
                this.hideLoadingScreen();
                this.showApp();
                this.isInitialized = true;
                console.log('✅ Basic UI Hydrogen Factory Simulation initialized!');
            }, 1000);
            
        } catch (error) {
            console.error('❌ Failed to initialize simulation:', error);
            this.showError('Initialization failed: ' + error.message);
            this.showLoadingProgress('Initialization failed!', 0);
        }
    }

    showLoadingProgress(message, progress) {
        const loadingText = document.querySelector('.loading-text');
        const loadingProgress = document.querySelector('.loading-progress');
        
        if (loadingText) loadingText.textContent = message;
        if (loadingProgress) loadingProgress.style.width = `${progress}%`;
        
        console.log(`Loading: ${message} (${progress}%)`);
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }
    
    showApp() {
        const app = document.getElementById('app');
        if (app) {
            app.classList.remove('hidden');
        }
    }

    setupEventListeners() {
        // Start/Stop controls
        const startBtn = document.getElementById('startBtn') || document.getElementById('start-btn');
        const stopBtn = document.getElementById('stopBtn') || document.getElementById('stop-btn');
        const emergencyBtn = document.getElementById('emergencyBtn');
        
        if (startBtn) startBtn.addEventListener('click', () => this.startFactory());
        if (stopBtn) stopBtn.addEventListener('click', () => this.stopFactory());
        if (emergencyBtn) emergencyBtn.addEventListener('click', () => this.emergencyStop());
        
        // Camera controls (2D animation view controls)
        const topViewBtn = document.getElementById('topViewBtn') || document.getElementById('top-view');
        const sideViewBtn = document.getElementById('sideViewBtn') || document.getElementById('side-view');
        const isoViewBtn = document.getElementById('isoViewBtn') || document.getElementById('iso-view');
        const resetCamBtn = document.getElementById('reset-camera');
        
        if (topViewBtn) topViewBtn.addEventListener('click', () => this.animation2D.setTopView());
        if (sideViewBtn) sideViewBtn.addEventListener('click', () => this.animation2D.setSideView());
        if (isoViewBtn) isoViewBtn.addEventListener('click', () => this.animation2D.setIsometricView());
        if (resetCamBtn) resetCamBtn.addEventListener('click', () => this.animation2D.resetCamera());
        
        // Tab switching
        const tabButtons = document.querySelectorAll('.tab-button, .tab-btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const targetTab = e.target.dataset.tab;
                this.switchTab(targetTab);
                // Animation focus on selected system
                if (this.animation2D && this.animation2D.focusOnSystem) {
                    const map = {
                        water: 'water',
                        electrolysis: 'electrolysis',
                        purification: 'purification',
                        compression: 'compression',
                        storage: 'storage',
                        power: 'power',
                        overview: null
                    };
                    const sys = map[targetTab];
                    if (sys) {
                        this.animation2D.focusOnSystem(sys);
                        
                        // Highlight the focused system in animation
                        if (this.animation2D.highlightSystem) {
                            this.animation2D.highlightSystem(sys);
                        }
                    }
                }
            });
        });
        
        // Wire system controls with power guard
        const requirePower = (action) => {
            const powerOn = this.factorySimulation && this.factorySimulation.isPowerOn();
            if (!powerOn) {
                if (this.alertManager) this.alertManager.showAlert('Power must be enabled first', 'warning');
                return false;
            }
            action();
            return true;
        };
        const bind = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener('click', () => { fn(); this.updateMetrics(); }); };
        bind('water-start', () => this.factorySimulation && this.factorySimulation.startWaterSystem());
        bind('water-stop', () => this.factorySimulation && this.factorySimulation.stopWaterSystem());
        bind('water-maintenance', () => this.factorySimulation && this.factorySimulation.setWaterMaintenanceMode());
        bind('electrolysis-start', () => this.factorySimulation && this.factorySimulation.startElectrolysis());
        
        // Add test button for electrolysis metrics (temporary for debugging)
        const testButton = document.getElementById('test-electrolysis-metrics');
        console.log('🔍 Looking for test button:', testButton);
        if (testButton) {
            testButton.addEventListener('click', () => {
                console.log('🔋 Test button clicked!');
                console.log('🔋 Factory simulation exists:', !!this.factorySimulation);
                if (this.factorySimulation) {
                    console.log('🔋 Electrolysis system exists:', !!this.factorySimulation.electrolysisSystem);
                }
                if (this.factorySimulation && this.factorySimulation.electrolysisSystem) {
                    this.factorySimulation.electrolysisSystem.setTestValues();
                    console.log('🔋 Test values applied to electrolysis system');
                    // Force update metrics
                    this.updateMetrics();
                } else {
                    console.log('❌ Factory simulation or electrolysis system not available');
                }
            });
        } else {
            console.log('❌ Test button not found in DOM');
        }
        bind('electrolysis-stop', () => this.factorySimulation && this.factorySimulation.stopElectrolysis());
        bind('electrolysis-ramp', () => this.factorySimulation && this.factorySimulation.rampUpElectrolysis());
        bind('purification-start', () => this.factorySimulation && requirePower(() => this.factorySimulation.startPurification()));
        bind('purification-stop', () => this.factorySimulation && this.factorySimulation.purificationSystem && this.factorySimulation.purificationSystem.shutdown());
        bind('purification-emergency', () => this.factorySimulation && this.factorySimulation.purificationSystem && this.factorySimulation.purificationSystem.emergencyStop());
        bind('compression-start', () => this.factorySimulation && requirePower(() => this.factorySimulation.startCompression()));
        bind('compression-stop', () => this.factorySimulation && this.factorySimulation.compressionSystem && this.factorySimulation.compressionSystem.shutdown());
        bind('compression-emergency', () => this.factorySimulation && this.factorySimulation.compressionSystem && this.factorySimulation.compressionSystem.emergencyStop());
        bind('storage-start', () => this.factorySimulation && requirePower(() => this.factorySimulation.startStorage()));
        bind('storage-stop', () => this.factorySimulation && this.factorySimulation.storageSystem && this.factorySimulation.storageSystem.shutdown());
        bind('storage-emergency', () => this.factorySimulation && this.factorySimulation.storageSystem && this.factorySimulation.storageSystem.emergencyStop());
        bind('power-start', () => this.factorySimulation && this.factorySimulation.powerSystem && this.factorySimulation.powerSystem.startup());
        bind('power-stop', () => this.factorySimulation && this.factorySimulation.powerSystem && this.factorySimulation.powerSystem.shutdown());

        // Power units input (optional UI element with id 'power-units')
        const powerUnitsInput = document.getElementById('power-units');
        if (powerUnitsInput) {
            powerUnitsInput.addEventListener('input', (e) => {
                const n = parseInt(e.target.value, 10);
                if (this.factorySimulation && Number.isFinite(n)) {
                    this.factorySimulation.setPowerUnits(n);
                    this.updateMetrics();
                }
            });
        }

        // Electrolysis control sliders with visual feedback
        const targetTemperatureSlider = document.getElementById('target-temperature');
        if (targetTemperatureSlider) {
            let previousTemp = parseFloat(targetTemperatureSlider.value);
            targetTemperatureSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                if (this.factorySimulation && this.factorySimulation.electrolysisSystem && Number.isFinite(value)) {
                    // Calculate efficiency impact
                    const tempDiff = Math.abs(value - 70); // Optimal temperature is 70°C
                    const efficiencyImpact = (70 - tempDiff) / 70 * 100;
                    const previousTempDiff = Math.abs(previousTemp - 70);
                    const previousEfficiencyImpact = (70 - previousTempDiff) / 70 * 100;
                    const efficiencyChange = efficiencyImpact - previousEfficiencyImpact;
                    
                    this.factorySimulation.electrolysisSystem.setTargetTemperature(value);
                    
                    // Update display
                    const display = document.getElementById('target-temperature-display');
                    if (display) display.textContent = value + '°C';
                    
                    // Show visual feedback
                    if (this.animation2D) {
                        this.animation2D.showParameterChange('electrolysis', 'temperature', previousTemp, value);
                        if (Math.abs(efficiencyChange) > 0.5) {
                            this.animation2D.showEfficiencyImpact('electrolysis', efficiencyChange);
                        }
                    }
                    
                    previousTemp = value;
                    this.updateMetrics();
                }
            });
        }

        // Water treatment level slider with visual feedback
        const waterTreatmentLevelSlider = document.getElementById('water-treatment-level');
        if (waterTreatmentLevelSlider) {
            let previousTreatment = parseFloat(waterTreatmentLevelSlider.value);
            waterTreatmentLevelSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                if (this.factorySimulation && this.factorySimulation.waterSystem && Number.isFinite(value)) {
                    // Calculate quality improvement
                    const qualityChange = (value - previousTreatment) * 100;
                    
                    this.factorySimulation.waterSystem.setTreatmentLevel(value);
                    
                    // Update display
                    const display = document.getElementById('water-treatment-display');
                    if (display) {
                        const percentage = (value * 100).toFixed(0);
                        display.textContent = `${percentage}% Treatment`;
                    }
                    
                    // Update flow impact
                    const flowImpact = document.getElementById('flow-impact');
                    if (flowImpact) {
                        const impact = -(value * 30).toFixed(0);
                        flowImpact.textContent = `${impact}%`;
                    }
                    
                    // Show visual feedback
                    if (this.animation2D) {
                        this.animation2D.showParameterChange('water', 'treatment', previousTreatment, value);
                        if (Math.abs(qualityChange) > 5) {
                            this.animation2D.showEfficiencyImpact('water', qualityChange / 10);
                        }
                    }
                    
                    previousTreatment = value;
                    // Update metrics immediately
                    this.updateMetrics();
                }
            });
        }

        // Compression control sliders
        const compressionLevelSlider = document.getElementById('compression-level');
        if (compressionLevelSlider) {
            compressionLevelSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                if (this.factorySimulation && this.factorySimulation.compressionSystem && Number.isFinite(value)) {
                    this.factorySimulation.compressionSystem.setCompressionLevel(value);
                    // Update display
                    const display = document.getElementById('compression-level-display');
                    if (display) display.textContent = (value * 100).toFixed(0) + '%';
                }
            });
        }

        // Storage control sliders
        const storagePressureSlider = document.getElementById('storage-pressure');
        if (storagePressureSlider) {
            storagePressureSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                if (this.factorySimulation && this.factorySimulation.storageSystem && Number.isFinite(value)) {
                    this.factorySimulation.storageSystem.setStoragePressure(value);
                    // Update display
                    const display = document.getElementById('storage-pressure-display');
                    if (display) display.textContent = value + ' bar';
                }
            });
        }

        const targetPressureSlider = document.getElementById('target-pressure');
        if (targetPressureSlider) {
            targetPressureSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                if (this.factorySimulation && this.factorySimulation.electrolysisSystem && Number.isFinite(value)) {
                    this.factorySimulation.electrolysisSystem.setTargetPressure(value);
                    // Update display
                    const display = document.getElementById('target-pressure-display');
                    if (display) display.textContent = value + ' bar';
                }
            });
        }

        const targetVoltageSlider = document.getElementById('target-voltage');
        if (targetVoltageSlider) {
            targetVoltageSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                if (this.factorySimulation && this.factorySimulation.electrolysisSystem && Number.isFinite(value)) {
                    this.factorySimulation.electrolysisSystem.setTargetVoltage(value);
                    // Update display
                    const display = document.getElementById('target-voltage-display');
                    if (display) display.textContent = value + 'V';
                }
            });
        }

        const targetCurrentSlider = document.getElementById('target-current');
        if (targetCurrentSlider) {
            targetCurrentSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                if (this.factorySimulation && this.factorySimulation.electrolysisSystem && Number.isFinite(value)) {
                    this.factorySimulation.electrolysisSystem.setTargetCurrent(value);
                    // Update display
                    const display = document.getElementById('target-current-display');
                    if (display) display.textContent = value + 'A';
                }
            });
        }

        // Purification level slider
        const purificationLevelSlider = document.getElementById('purification-level');
        if (purificationLevelSlider) {
            purificationLevelSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                if (this.factorySimulation && this.factorySimulation.purificationSystem && Number.isFinite(value)) {
                    this.factorySimulation.purificationSystem.setPurificationLevel(value);
                    // Update display
                    const display = document.getElementById('purification-level-display');
                    if (display) display.textContent = (value * 100).toFixed(0) + '%';
                }
            });
        }

        // React to simulation power-required events
        if (this.factorySimulation) {
            this.factorySimulation.addEventListener('power_required', () => {
                if (this.alertManager) this.alertManager.showAlert('Power must be enabled first', 'warning');
            });
        }

        // Settings
        const settingsBtn = document.getElementById('settingsBtn') || document.getElementById('settings-btn');
        const settingsModal = document.getElementById('settingsModal') || document.getElementById('settings-modal');
        const closeSettingsBtn = document.getElementById('settings-close');
        
        const showModal = () => {
            if (!settingsModal) return;
            settingsModal.classList.remove('hidden');
            settingsModal.classList.add('show');
        };
        const hideModal = () => {
            if (!settingsModal) return;
            settingsModal.classList.remove('show');
            // keep hidden class consistent after transition
            setTimeout(() => settingsModal.classList.add('hidden'), 150);
        };
        if (settingsBtn) settingsBtn.addEventListener('click', showModal);
        if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', hideModal);
        if (settingsModal) {
            settingsModal.addEventListener('click', (e) => {
                if (e.target === settingsModal) hideModal();
            });
        }
    }

    async startFactory() {
        try {
            this.isRunning = true;
            const startBtn = document.getElementById('startBtn') || document.getElementById('start-btn');
            const stopBtn = document.getElementById('stopBtn') || document.getElementById('stop-btn');
            
            if (startBtn) startBtn.disabled = true;
            if (stopBtn) stopBtn.disabled = false;
            
            // Animation is already started in init, just ensure it's running
            if (this.animation2D && !this.animation2D.isRunning) {
                this.animation2D.start();
            }
            
            // Start simulation
            await this.factorySimulation.startFactory();
            
            // Update UI
            this.updateMetrics();
            this.updateCharts();
            
            // Show success message
            this.alertManager.showAlert('Factory started successfully!', 'success');
            
        } catch (error) {
            console.error('Failed to start factory:', error);
            this.alertManager.showAlert('Failed to start factory: ' + error.message, 'error');
        }
    }

    async stopFactory() {
        try {
            this.isRunning = false;
            const startBtn = document.getElementById('startBtn') || document.getElementById('start-btn');
            const stopBtn = document.getElementById('stopBtn') || document.getElementById('stop-btn');
            
            if (startBtn) startBtn.disabled = false;
            if (stopBtn) stopBtn.disabled = true;
            
            // Stop animation
            if (this.animation2D) {
                this.animation2D.stop();
            }
            
            // Stop simulation
            await this.factorySimulation.emergencyStop();
            
            // Update UI
            this.updateMetrics();
            this.updateCharts();
            
            // Show success message
            this.alertManager.showAlert('Factory stopped successfully!', 'success');
            
        } catch (error) {
            console.error('Failed to stop factory:', error);
            this.alertManager.showAlert('Failed to stop factory: ' + error.message, 'error');
        }
    }

    async emergencyStop() {
        try {
            this.isRunning = false;
            const startBtn = document.getElementById('startBtn') || document.getElementById('start-btn');
            const stopBtn = document.getElementById('stopBtn') || document.getElementById('stop-btn');
            
            if (startBtn) startBtn.disabled = false;
            if (stopBtn) stopBtn.disabled = true;
            
            // Emergency stop animation
            if (this.animation2D) {
                this.animation2D.stop();
            }
            
            // Emergency stop simulation
            await this.factorySimulation.emergencyStop();
            
            // Update UI
            this.updateMetrics();
            this.updateCharts();
            
            // Show emergency message
            this.alertManager.showAlert('EMERGENCY STOP ACTIVATED!', 'error');
            
        } catch (error) {
            console.error('Emergency stop failed:', error);
            this.alertManager.showAlert('Emergency stop failed: ' + error.message, 'error');
        }
    }

    switchTab(tabName) {
        // Hide all tab content
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => content.style.display = 'none');
        
        // Remove active class from all tab buttons
        const tabButtons = document.querySelectorAll('.tab-button, .tab-btn');
        tabButtons.forEach(button => button.classList.remove('active'));
        
        // Show selected tab content
        const selectedTab = document.getElementById(tabName + 'Tab') || document.getElementById(tabName + '-tab');
        if (selectedTab) selectedTab.style.display = 'block';
        
        // Add active class to selected tab button
        const selectedButton = document.querySelector(`[data-tab="${tabName}"]`);
        if (selectedButton) selectedButton.classList.add('active');
    }

    updateMetrics() {
        if (!this.factorySimulation) {
            console.log('❌ No factory simulation available in updateMetrics');
            return;
        }
        
        console.log('🔍 Updating metrics...');
        
        const metrics = this.factorySimulation.getCurrentMetrics();
        console.log('🔍 Current metrics:', metrics);
        console.log('🔍 Electrolysis metrics:', metrics.electrolysis);
        
        // Update production metrics
        const productionRate = document.getElementById('productionRate') || document.getElementById('production-rate');
        if (productionRate) productionRate.textContent = metrics.productionRate.toFixed(2) + ' kg/h';
        
        const efficiency = document.getElementById('efficiency') || document.getElementById('system-efficiency');
        if (efficiency) efficiency.textContent = metrics.efficiency.toFixed(1) + '%';
        
        const uptime = document.getElementById('uptime');
        if (uptime) uptime.textContent = metrics.uptime.toFixed(1) + '%';
        
        // Update overview storage level
        const overviewStorageLevel = document.getElementById('overview-storage-level');
        if (overviewStorageLevel && this.factorySimulation && this.factorySimulation.storageSystem) {
            overviewStorageLevel.textContent = this.factorySimulation.storageSystem.getFillLevel().toFixed(1) + '%';
        }
        
        // Update overview power consumption
        const overviewPowerConsumption = document.getElementById('power-consumption');
        if (overviewPowerConsumption && this.factorySimulation && this.factorySimulation.powerSystem) {
            const units = this.factorySimulation.powerSystem.getUnitsRunning();
            const powerPerUnit = 300; // kW per unit
            const totalPower = units * powerPerUnit;
            overviewPowerConsumption.textContent = totalPower.toFixed(0) + ' kW';
        }
        
        // Update system status
        this.updateSystemStatus();

        // Update power panel
        const powerKw = document.getElementById('power-total-kw');
        if (powerKw) {
            // Always show the actual power based on units
            const powerSystem = this.factorySimulation && this.factorySimulation.powerSystem;
            if (powerSystem) {
                const units = powerSystem.getUnitsRunning();
                const powerPerUnit = 300; // kW per unit
                const totalPower = units * powerPerUnit;
                powerKw.textContent = totalPower.toFixed(0) + ' kW';
                console.log(`⚡ Displaying power: ${units} units × ${powerPerUnit} kW = ${totalPower} kW`);
            } else {
                powerKw.textContent = '0 kW';
            }
        }
        const unitsAvailEl = document.getElementById('power-units-available');
        if (unitsAvailEl && this.factorySimulation && this.factorySimulation.powerSystem) {
            unitsAvailEl.textContent = this.factorySimulation.powerSystem.getUnitsAvailable();
        }
        const unitsInput = document.getElementById('power-units');
        if (unitsInput && this.factorySimulation && this.factorySimulation.powerSystem) {
            // Keep input in sync if changed elsewhere
            const currentUnits = this.factorySimulation.powerSystem.getUnitsRunning();
            if (Number.isFinite(currentUnits) && unitsInput !== document.activeElement) {
                unitsInput.value = String(currentUnits);
            }
        }
        
        // Update water metrics
        const rawWaterTds = document.getElementById('raw-water-tds');
        if (rawWaterTds) rawWaterTds.textContent = metrics.water.rawTds.toFixed(1) + ' ppm';
        
        const processWaterTds = document.getElementById('process-water-tds');
        if (processWaterTds) processWaterTds.textContent = metrics.water.processTds.toFixed(2) + ' ppm';
        
        const waterResistivity = document.getElementById('water-resistivity');
        if (waterResistivity) waterResistivity.textContent = metrics.water.resistivity.toFixed(1) + ' MΩ·cm';
        
        const waterFlowRate = document.getElementById('water-flow-rate');
        if (waterFlowRate) waterFlowRate.textContent = metrics.waterConsumption.toFixed(0) + ' L/hr';
        
        // Update water treatment level
        const waterTreatmentLevel = document.getElementById('water-treatment-level');
        if (waterTreatmentLevel) {
            const currentLevel = this.factorySimulation.getWaterTreatmentLevel();
            if (waterTreatmentLevel !== document.activeElement) {
                waterTreatmentLevel.value = currentLevel.toFixed(2);
            }
        }
        
        // Update water treatment display
        const waterTreatmentDisplay = document.getElementById('water-treatment-display');
        if (waterTreatmentDisplay) {
            const currentLevel = this.factorySimulation.getWaterTreatmentLevel();
            const percentage = (currentLevel * 100).toFixed(0);
            waterTreatmentDisplay.textContent = `${percentage}% Treatment`;
        }
        
        // Update required power units for water
        const waterPowerUnits = document.getElementById('water-power-units');
        if (waterPowerUnits && this.factorySimulation && this.factorySimulation.waterSystem) {
            const required = this.factorySimulation.waterSystem.getRequiredPowerUnits();
            waterPowerUnits.textContent = `${required} units required`;
        }
        
        // Update flow impact display
        const flowImpact = document.getElementById('flow-impact');
        if (flowImpact && this.factorySimulation && this.factorySimulation.waterSystem) {
            const currentLevel = this.factorySimulation.getWaterTreatmentLevel();
            const impact = -(currentLevel * 30).toFixed(0);
            flowImpact.textContent = `${impact}%`;
        }
        
        // Update electrolysis metrics
        const electrolysisStatus = document.getElementById('electrolysisStatus');
        if (electrolysisStatus) electrolysisStatus.textContent = metrics.electrolysis.status || 'offline';
        
        // System information
        const powerUnitsUsed = document.getElementById('power-units-used');
        if (powerUnitsUsed) powerUnitsUsed.textContent = metrics.electrolysis.powerUnitsUsed || 0;
        
        const waterQualityTds = document.getElementById('water-quality-tds');
        if (waterQualityTds) waterQualityTds.textContent = (metrics.electrolysis.waterQuality?.tds || 0).toFixed(2) + ' ppm';
        
        const waterQualityResistivity = document.getElementById('water-quality-resistivity');
        if (waterQualityResistivity) waterQualityResistivity.textContent = (metrics.electrolysis.waterQuality?.resistivity || 0).toFixed(1) + ' MΩ·cm';
        
        const operationalHours = document.getElementById('operational-hours');
        if (operationalHours) operationalHours.textContent = (metrics.electrolysis.operationalHours || 0).toFixed(1) + ' hrs';
        
        // Core operational metrics
        const stackVoltage = document.getElementById('stack-voltage');
        if (stackVoltage) stackVoltage.textContent = metrics.electrolysis.voltage.toFixed(0) + ' V';
        
        const stackCurrent = document.getElementById('stack-current');
        if (stackCurrent) stackCurrent.textContent = metrics.electrolysis.current.toFixed(0) + ' A';
        
        const stackTemperature = document.getElementById('stack-temperature');
        if (stackTemperature) stackTemperature.textContent = metrics.electrolysis.temperature.toFixed(1) + ' °C';
        
        const stackPressure = document.getElementById('stack-pressure');
        if (stackPressure) stackPressure.textContent = (metrics.electrolysis.pressure || 1).toFixed(1) + ' bar';
        
        // Production metrics
        const hydrogenProductionRate = document.getElementById('hydrogen-production-rate');
        if (hydrogenProductionRate) hydrogenProductionRate.textContent = metrics.electrolysis.hydrogenProductionRate.toFixed(1) + ' Nm³/hr';
        
        const oxygenProductionRate = document.getElementById('oxygen-production-rate');
        if (oxygenProductionRate) oxygenProductionRate.textContent = metrics.electrolysis.oxygenProductionRate.toFixed(1) + ' Nm³/hr';
        
        const electrolysisPowerInput = document.getElementById('electrolysis-power-input');
        if (electrolysisPowerInput) electrolysisPowerInput.textContent = metrics.electrolysis.powerInput.toFixed(1) + ' kW';
        
        const energyCost = document.getElementById('energy-cost');
        if (energyCost) energyCost.textContent = metrics.electrolysis.energyCost.toFixed(2) + ' kWh/Nm³ H₂';
        
        // Performance analysis metrics
        const overallEfficiency = document.getElementById('overall-efficiency');
        if (overallEfficiency) overallEfficiency.textContent = metrics.electrolysis.overallEfficiency.toFixed(1) + '%';
        
        const thermalEfficiency = document.getElementById('thermal-efficiency');
        if (thermalEfficiency) thermalEfficiency.textContent = metrics.electrolysis.thermalEfficiency.toFixed(1) + '%';
        
        const electricalEfficiency = document.getElementById('electrical-efficiency');
        if (electricalEfficiency) electricalEfficiency.textContent = metrics.electrolysis.electricalEfficiency.toFixed(1) + '%';
        
        const performanceScore = document.getElementById('performance-score');
        if (performanceScore) performanceScore.textContent = metrics.electrolysis.performanceScore.toFixed(1);
        
        // Cumulative metrics
        const totalHydrogenProduced = document.getElementById('total-hydrogen-produced');
        console.log('🔍 Looking for total-hydrogen-produced element:', totalHydrogenProduced);
        if (totalHydrogenProduced) {
            const totalH2 = metrics.electrolysis.totalHydrogenProduced || 0;
            const electrolysisStatus = metrics.electrolysis.status || 'offline';
            totalHydrogenProduced.textContent = totalH2.toFixed(1) + ' Nm³';
            console.log(`🔋 Total H2 Produced: ${totalH2.toFixed(1)} Nm³ (Status: ${electrolysisStatus})`);
            console.log(`🔋 Element text content set to: ${totalH2.toFixed(1)} Nm³`);
        } else {
            console.log('❌ total-hydrogen-produced element not found');
        }
        
        const totalEnergyConsumed = document.getElementById('total-energy-consumed');
        if (totalEnergyConsumed) {
            const totalEnergy = metrics.electrolysis.totalEnergyConsumed || 0;
            totalEnergyConsumed.textContent = totalEnergy.toFixed(1) + ' kWh';
            console.log(`🔋 Total Energy Consumed: ${totalEnergy.toFixed(1)} kWh`);
        }
        

        
        // Update purification system metrics
        if (this.factorySimulation && this.factorySimulation.purificationSystem) {
            const purificationSystem = this.factorySimulation.purificationSystem;
            
            // Update connectivity status
            const connectivity = purificationSystem.getSystemConnectivity();
            this.updateElement('power-connectivity', 
                connectivity.powerSystem.connected ? 
                `✅ ${connectivity.powerSystem.status}` : '❌ Disconnected');
            this.updateElement('water-connectivity', 
                connectivity.waterSystem.connected ? 
                `✅ ${connectivity.waterSystem.status}` : '❌ Disconnected');
            this.updateElement('electrolysis-connectivity', 
                connectivity.electrolysisSystem.connected ? 
                `✅ ${connectivity.electrolysisSystem.status}` : '❌ Disconnected');
            
            // Update performance metrics
            this.updateElement('purification-performance-score', 
                purificationSystem.getPerformanceScore().toFixed(1));
            this.updateElement('purification-overall-efficiency', 
                purificationSystem.getOverallEfficiency().toFixed(1) + '%');
            this.updateElement('purification-thermal-efficiency', 
                purificationSystem.thermalEfficiency.toFixed(1) + '%');
            this.updateElement('purification-pressure-efficiency', 
                purificationSystem.pressureEfficiency.toFixed(1) + '%');
            
            // Update operational parameters
            this.updateElement('purification-input-rate', 
                purificationSystem.inputHydrogenRate.toFixed(1) + ' Nm³/hr');
            this.updateElement('purification-output-rate', 
                purificationSystem.outputHydrogenRate.toFixed(1) + ' Nm³/hr');
            this.updateElement('purification-efficiency', 
                purificationSystem.getPurificationEfficiency().toFixed(1) + '%');
            this.updateElement('purification-water-removal', 
                purificationSystem.getWaterRemovalRate().toFixed(1) + ' L/hr');
            this.updateElement('purification-power-consumption', 
                purificationSystem.getPowerConsumption().toFixed(1) + ' kW');
            this.updateElement('purification-temperature', 
                purificationSystem.temperature.toFixed(1) + ' °C');
            this.updateElement('purification-pressure', 
                purificationSystem.pressure.toFixed(1) + ' bar');
            
            // Update cumulative metrics
            this.updateElement('purification-operational-hours', 
                purificationSystem.getOperationalHours().toFixed(1) + ' hrs');
            this.updateElement('purification-total-hydrogen', 
                purificationSystem.getTotalHydrogenProcessed().toFixed(1) + ' Nm³');
            this.updateElement('purification-total-water', 
                purificationSystem.getTotalWaterRemoved().toFixed(1) + ' L');
            this.updateElement('purification-total-energy', 
                purificationSystem.getTotalEnergyConsumed().toFixed(1) + ' kWh');
            
            // Update alerts
            this.updatePurificationAlerts(purificationSystem.getActiveAlerts());
        }
        
        // Update compression system metrics
        if (this.factorySimulation && this.factorySimulation.compressionSystem) {
            const compressionSystem = this.factorySimulation.compressionSystem;
            
            // Update connectivity status
            const connectivity = compressionSystem.getSystemConnectivity();
            this.updateElement('compression-power-connectivity', 
                connectivity.powerSystem.connected ? 
                `✅ ${connectivity.powerSystem.status}` : '❌ Disconnected');
            this.updateElement('compression-purification-connectivity', 
                connectivity.purificationSystem.connected ? 
                `✅ ${connectivity.purificationSystem.status}` : '❌ Disconnected');
            this.updateElement('compression-storage-connectivity', 
                connectivity.storageSystem.connected ? 
                `✅ ${connectivity.storageSystem.status}` : '❌ Disconnected');
            
            // Update performance metrics
            this.updateElement('compression-performance-score', 
                compressionSystem.getPerformanceScore().toFixed(1));
            this.updateElement('compression-overall-efficiency', 
                compressionSystem.getOverallEfficiency().toFixed(1) + '%');
            this.updateElement('compression-thermal-efficiency', 
                compressionSystem.thermalEfficiency.toFixed(1) + '%');
            this.updateElement('compression-pressure-efficiency', 
                compressionSystem.pressureEfficiency.toFixed(1) + '%');
            
            // Update operational parameters
            this.updateElement('compression-input-rate', 
                compressionSystem.inputHydrogenRate.toFixed(1) + ' Nm³/hr');
            this.updateElement('compression-output-rate', 
                compressionSystem.outputHydrogenRate.toFixed(1) + ' Nm³/hr');
            this.updateElement('compression-efficiency', 
                compressionSystem.getCompressionEfficiency().toFixed(1) + '%');
            this.updateElement('compression-ratio', 
                compressionSystem.compressionRatio.toFixed(1) + ':1');
            this.updateElement('compression-power-consumption', 
                compressionSystem.getPowerConsumption().toFixed(1) + ' kW');
            this.updateElement('compression-temperature', 
                compressionSystem.temperature.toFixed(1) + ' °C');
            this.updateElement('compression-input-pressure', 
                compressionSystem.inputPressure.toFixed(1) + ' bar');
            this.updateElement('compression-output-pressure', 
                compressionSystem.outputPressure.toFixed(1) + ' bar');
            
            // Update engineering details (stage pressures and temperatures)
            const stagePressures = compressionSystem.getStagePressures();
            const stageTemperatures = compressionSystem.getStageTemperatures();
            const stageEfficiencies = compressionSystem.getStageEfficiencies();
            
            this.updateElement('compression-stage1-pressure', 
                stagePressures[1].toFixed(1) + ' bar');
            this.updateElement('compression-stage2-pressure', 
                stagePressures[2].toFixed(1) + ' bar');
            this.updateElement('compression-stage1-temperature', 
                stageTemperatures[1].toFixed(1) + ' °C');
            this.updateElement('compression-stage2-temperature', 
                stageTemperatures[2].toFixed(1) + ' °C');
            this.updateElement('compression-interstage-cooling', 
                compressionSystem.interstageCooling ? '✅ Enabled' : '❌ Disabled');
            this.updateElement('compression-lubrication', 
                compressionSystem.lubricationStatus);
            
            // Update cumulative metrics
            this.updateElement('compression-operational-hours', 
                compressionSystem.getOperationalHours().toFixed(1) + ' hrs');
            this.updateElement('compression-total-hydrogen', 
                compressionSystem.getTotalHydrogenCompressed().toFixed(1) + ' Nm³');
            this.updateElement('compression-total-energy', 
                compressionSystem.totalEnergyConsumed.toFixed(1) + ' kWh');
            
            // Update alerts
            this.updateCompressionAlerts(compressionSystem.getActiveAlerts());
        }
        
        // Update storage system metrics
        if (this.factorySimulation && this.factorySimulation.storageSystem) {
            const storageSystem = this.factorySimulation.storageSystem;
            
            // Update connectivity status
            const connectivity = storageSystem.getSystemConnectivity();
            this.updateElement('storage-power-connectivity', 
                connectivity.powerSystem.connected ? 
                `✅ ${connectivity.powerSystem.status}` : '❌ Disconnected');
            this.updateElement('storage-compression-connectivity', 
                connectivity.compressionSystem.connected ? 
                `✅ ${connectivity.compressionSystem.status}` : '❌ Disconnected');
            this.updateElement('storage-water-connectivity', 
                connectivity.waterSystem.connected ? 
                `✅ ${connectivity.waterSystem.status}` : '❌ Disconnected');
            
            // Update performance metrics
            this.updateElement('storage-performance-score', 
                storageSystem.getPerformanceScore().toFixed(1));
            this.updateElement('storage-overall-efficiency', 
                storageSystem.getOverallEfficiency().toFixed(1) + '%');
            this.updateElement('storage-storage-efficiency', 
                storageSystem.storageEfficiency.toFixed(1) + '%');
            this.updateElement('storage-temperature-efficiency', 
                storageSystem.temperatureEfficiency.toFixed(1) + '%');
            this.updateElement('storage-pressure-efficiency', 
                storageSystem.pressureEfficiency.toFixed(1) + '%');
            
            // Update operational parameters
            this.updateElement('storage-input-rate', 
                storageSystem.inputHydrogenRate.toFixed(1) + ' Nm³/hr');
            this.updateElement('storage-output-rate', 
                storageSystem.outputHydrogenRate.toFixed(1) + ' Nm³/hr');
            this.updateElement('storage-net-rate', 
                storageSystem.netStorageRate.toFixed(1) + ' Nm³/hr');
            this.updateElement('storage-inventory', 
                storageSystem.getCurrentInventory().toFixed(1) + ' Nm³');
            this.updateElement('storage-fill-level', 
                storageSystem.getFillLevel().toFixed(1) + '%');
            this.updateElement('storage-power-consumption', 
                storageSystem.getPowerConsumption().toFixed(1) + ' kW');
            this.updateElement('storage-temperature', 
                storageSystem.temperature.toFixed(1) + ' °C');
            this.updateElement('storage-pressure', 
                storageSystem.storagePressure.toFixed(1) + ' bar');
            
            // Update tank status
            const tankStatus = storageSystem.getTankStatus();
            this.updateElement('storage-active-tanks', 
                storageSystem.getActiveTanks() + ' / ' + storageSystem.tankCount);
            this.updateElement('storage-total-capacity', 
                storageSystem.maxCapacity.toFixed(0) + ' Nm³');
            this.updateElement('storage-available-capacity', 
                (storageSystem.maxCapacity - storageSystem.getCurrentInventory()).toFixed(1) + ' Nm³');
            
            // Update system status
            this.updateElement('storage-cooling-status', 
                storageSystem.coolingSystemStatus);
            this.updateElement('storage-safety-status', 
                storageSystem.safetySystemStatus);
            this.updateElement('storage-leak-status', 
                storageSystem.leakDetectionStatus);
            this.updateElement('storage-ventilation-status', 
                storageSystem.ventilationStatus);
            
            // Update cumulative metrics
            this.updateElement('storage-operational-hours', 
                storageSystem.getOperationalHours().toFixed(1) + ' hrs');
            this.updateElement('storage-total-hydrogen', 
                storageSystem.getTotalHydrogenStored().toFixed(1) + ' Nm³');
            this.updateElement('storage-total-energy', 
                storageSystem.totalEnergyConsumed.toFixed(1) + ' kWh');
            
            // Update alerts
            this.updateStorageAlerts(storageSystem.getActiveAlerts());
        }
        
        // Update 2D animation with real-time system status
        this.updateAnimationStatus();
        
        // Update overview system status
        this.updateOverviewSystemStatus();
    }

    updateOverviewSystemStatus() {
        if (!this.factorySimulation) return;
        
        // Update water system overview
        if (this.factorySimulation.waterSystem) {
            const waterSystem = this.factorySimulation.waterSystem;
            this.updateElement('overview-water-status', waterSystem.getStatus());
            this.updateElement('overview-water-quality', waterSystem.getResistivity().toFixed(1) + ' MΩ·cm');
            this.updateElement('overview-water-flow', waterSystem.getWaterConsumption().toFixed(0) + ' L/hr');
        }
        
        // Update electrolysis overview
        if (this.factorySimulation.electrolysisSystem) {
            const electrolysisSystem = this.factorySimulation.electrolysisSystem;
            this.updateElement('overview-electrolysis-status', electrolysisSystem.getStatus());
            this.updateElement('overview-electrolysis-production', electrolysisSystem.getProductionRate().toFixed(1) + ' Nm³/hr');
            this.updateElement('overview-electrolysis-efficiency', electrolysisSystem.getOverallEfficiency().toFixed(1) + '%');
        }
        
        // Update purification overview
        if (this.factorySimulation.purificationSystem) {
            const purificationSystem = this.factorySimulation.purificationSystem;
            this.updateElement('overview-purification-status', purificationSystem.getStatus());
            this.updateElement('overview-purification-output', purificationSystem.getOutputRate().toFixed(1) + ' Nm³/hr');
            this.updateElement('overview-purification-efficiency', purificationSystem.getOverallEfficiency().toFixed(1) + '%');
        }
        
        // Update compression overview
        if (this.factorySimulation.compressionSystem) {
            const compressionSystem = this.factorySimulation.compressionSystem;
            this.updateElement('overview-compression-status', compressionSystem.getStatus());
            this.updateElement('overview-compression-pressure', compressionSystem.getOutputPressure().toFixed(0) + ' bar');
            this.updateElement('overview-compression-efficiency', compressionSystem.getOverallEfficiency().toFixed(1) + '%');
        }
        
        // Update storage overview
        if (this.factorySimulation.storageSystem) {
            const storageSystem = this.factorySimulation.storageSystem;
            this.updateElement('overview-storage-status', storageSystem.getStatus());
            this.updateElement('overview-storage-fill', storageSystem.getFillLevel().toFixed(1) + '%');
            this.updateElement('overview-storage-tanks', storageSystem.getActiveTanks() + ' / ' + storageSystem.tankCount);
        }
    }

    updateAnimationStatus() {
        if (!this.animation2D) return;
        
        // Update power system status
        if (this.factorySimulation.powerSystem) {
            const powerSystem = this.factorySimulation.powerSystem;
            this.animation2D.updateSystemStatus('power', powerSystem.getStatus(), {
                units: powerSystem.getUnitsRunning(),
                power: powerSystem.getUnitsRunning() * 300
            });
        }
        
        // Update water system status with detailed metrics
        if (this.factorySimulation.waterSystem) {
            const waterSystem = this.factorySimulation.waterSystem;
            this.animation2D.updateSystemStatus('water', waterSystem.getStatus(), {
                flow: waterSystem.getWaterConsumption ? waterSystem.getWaterConsumption() : 0,
                quality: waterSystem.getWaterResistivity ? waterSystem.getWaterResistivity() : 0,
                treatmentLevel: waterSystem.getTreatmentLevel ? waterSystem.getTreatmentLevel() : 0.5
            });
        }
        
        // Update electrolysis system status with detailed metrics
        if (this.factorySimulation.electrolysisSystem) {
            const electrolysisSystem = this.factorySimulation.electrolysisSystem;
            this.animation2D.updateSystemStatus('electrolysis', electrolysisSystem.getStatus(), {
                production: electrolysisSystem.getProductionRate(),
                efficiency: electrolysisSystem.getEfficiency ? electrolysisSystem.getEfficiency() : electrolysisSystem.getOverallEfficiency(),
                voltage: electrolysisSystem.getStackVoltage(),
                current: electrolysisSystem.getStackCurrent(),
                temperature: electrolysisSystem.getStackTemperature(),
                pressure: electrolysisSystem.pressure || 30
            });
        }
        
        // Update purification system status
        if (this.factorySimulation.purificationSystem) {
            const purificationSystem = this.factorySimulation.purificationSystem;
            this.animation2D.updateSystemStatus('purification', purificationSystem.getStatus(), {
                purity: purificationSystem.getOverallEfficiency ? purificationSystem.getOverallEfficiency() : 95,
                flow: purificationSystem.getOutputRate ? purificationSystem.getOutputRate() : 0
            });
        }
        
        // Update compression system status
        if (this.factorySimulation.compressionSystem) {
            const compressionSystem = this.factorySimulation.compressionSystem;
            this.animation2D.updateSystemStatus('compression', compressionSystem.getStatus(), {
                pressure: compressionSystem.getOutputPressure ? compressionSystem.getOutputPressure() : 350
            });
        }
        
        // Update storage system status
        if (this.factorySimulation.storageSystem) {
            const storageSystem = this.factorySimulation.storageSystem;
            this.animation2D.updateSystemStatus('storage', storageSystem.getStatus(), {
                level: storageSystem.getFillLevel ? storageSystem.getFillLevel() : 0,
                tanks: storageSystem.getActiveTanks ? storageSystem.getActiveTanks() : 0
            });
        }
    }

    updateCharts() {
        if (this.chartManager) {
            this.chartManager.updateCharts();
        }
    }

    updateSystemStatus() {
        if (!this.factorySimulation) return;
        
        const systems = ['water', 'electrolysis', 'purification', 'compression', 'storage', 'power'];
        
        systems.forEach(systemName => {
            const statusElement = document.getElementById(systemName + 'Status');
            if (statusElement) {
                const status = this.factorySimulation.getSystemStatus(systemName);
                statusElement.textContent = status;
                statusElement.className = 'status ' + status;
            }
        });
    }
    
    // Helper method to update DOM elements
    updateElement(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
        }
    }
    
    // Update purification system alerts
        updatePurificationAlerts(alerts) {
        const alertsContainer = document.getElementById('purification-alerts-container');
        if (!alertsContainer) return;

        if (alerts.length === 0) {
            alertsContainer.innerHTML = '<div class="no-alerts">No active alerts</div>';
            return;
        }

        alertsContainer.innerHTML = alerts.map(alert => `
            <div class="alert-item alert-${alert.type.includes('error') ? 'error' : 'warning'}">
                <div class="alert-message">${alert.message}</div>
                <div class="alert-time">${new Date(alert.timestamp).toLocaleTimeString()}</div>
            </div>
        `).join('');
    }
    
    updateCompressionAlerts(alerts) {
        const alertsContainer = document.getElementById('compression-alerts-container');
        if (!alertsContainer) return;

        if (alerts.length === 0) {
            alertsContainer.innerHTML = '<div class="no-alerts">No active alerts</div>';
            return;
        }

        alertsContainer.innerHTML = alerts.map(alert => `
            <div class="alert-item alert-${alert.type.includes('error') ? 'error' : 'warning'}">
                <div class="alert-message">${alert.message}</div>
                <div class="alert-time">${new Date(alert.timestamp).toLocaleTimeString()}</div>
            </div>
        `).join('');
    }
    
    updateStorageAlerts(alerts) {
        const alertsContainer = document.getElementById('storage-alerts-container');
        if (!alertsContainer) return;

        if (alerts.length === 0) {
            alertsContainer.innerHTML = '<div class="no-alerts">No active alerts</div>';
            return;
        }

        alertsContainer.innerHTML = alerts.map(alert => `
            <div class="alert-item alert-${alert.type.includes('error') ? 'error' : 'warning'}">
                <div class="alert-message">${alert.message}</div>
                <div class="alert-time">${new Date(alert.timestamp).toLocaleTimeString()}</div>
            </div>
        `).join('');
    }
    
    // Initialize purification performance chart
    initPurificationChart() {
        const chartCanvas = document.getElementById('purification-performance-chart');
        if (!chartCanvas) return;
        
        // Create performance trend chart
        this.purificationChart = new Chart(chartCanvas, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Performance Score',
                    data: [],
                    borderColor: '#00d4aa',
                    backgroundColor: 'rgba(0, 212, 170, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Overall Efficiency',
                    data: [],
                    borderColor: '#0984e3',
                    backgroundColor: 'rgba(9, 132, 227, 0.1)',
                    tension: 0.4,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#b0b0b0' },
                        grid: { color: '#404040' }
                    },
                    y: {
                        ticks: { color: '#b0b0b0' },
                        grid: { color: '#404040' },
                        min: 0,
                        max: 100
                    }
                }
            }
        });
    }
    
    // Initialize compression performance chart
    initCompressionChart() {
        const chartCanvas = document.getElementById('compression-performance-chart');
        if (!chartCanvas) return;
        
        // Create performance trend chart
        this.compressionChart = new Chart(chartCanvas, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Performance Score',
                    data: [],
                    borderColor: '#fdcb6e',
                    backgroundColor: 'rgba(253, 203, 110, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Overall Efficiency',
                    data: [],
                    borderColor: '#e17055',
                    backgroundColor: 'rgba(225, 112, 85, 0.1)',
                    tension: 0.4,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#b0b0b0' },
                        grid: { color: '#404040' }
                    },
                    y: {
                        ticks: { color: '#b0b0b0' },
                        grid: { color: '#404040' },
                        min: 0,
                        max: 100
                    }
                }
            }
        });
    }
    
    // Initialize storage performance chart
    initStorageChart() {
        const chartCanvas = document.getElementById('storage-performance-chart');
        if (!chartCanvas) return;
        
        // Create performance trend chart
        this.storageChart = new Chart(chartCanvas, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Performance Score',
                    data: [],
                    borderColor: '#6c5ce7',
                    backgroundColor: 'rgba(108, 92, 231, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Overall Efficiency',
                    data: [],
                    borderColor: '#a29bfe',
                    backgroundColor: 'rgba(162, 155, 254, 0.1)',
                    tension: 0.4,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#b0b0b0' },
                        grid: { color: '#404040' }
                    },
                    y: {
                        ticks: { color: '#b0b0b0' },
                        grid: { color: '#404040' },
                        min: 0,
                        max: 100
                    }
                }
            }
        });
    }
    
    // Initialize overview charts
    initOverviewCharts() {
        // System Performance Overview Chart
        const systemPerformanceCanvas = document.getElementById('system-performance-chart');
        if (systemPerformanceCanvas) {
            this.systemPerformanceChart = new Chart(systemPerformanceCanvas, {
                type: 'radar',
                data: {
                    labels: ['Water Quality', 'Electrolysis', 'Purification', 'Compression', 'Storage'],
                    datasets: [{
                        label: 'System Performance',
                        data: [0, 0, 0, 0, 0],
                        borderColor: '#00d4aa',
                        backgroundColor: 'rgba(0, 212, 170, 0.2)',
                        pointBackgroundColor: '#00d4aa',
                        pointBorderColor: '#ffffff',
                        pointHoverBackgroundColor: '#ffffff',
                        pointHoverBorderColor: '#00d4aa'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: {
                                color: '#ffffff'
                            }
                        }
                    },
                    scales: {
                        r: {
                            ticks: { color: '#b0b0b0' },
                            grid: { color: '#404040' },
                            pointLabels: { color: '#b0b0b0' },
                            min: 0,
                            max: 100
                        }
                    }
                }
            });
        }
        
        // Power & Efficiency Trends Chart
        const powerEfficiencyCanvas = document.getElementById('power-efficiency-chart');
        if (powerEfficiencyCanvas) {
            this.powerEfficiencyChart = new Chart(powerEfficiencyCanvas, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Power Consumption (kW)',
                        data: [],
                        borderColor: '#fdcb6e',
                        backgroundColor: 'rgba(253, 203, 110, 0.1)',
                        tension: 0.4,
                        fill: true,
                        yAxisID: 'y'
                    }, {
                        label: 'Overall Efficiency (%)',
                        data: [],
                        borderColor: '#00d4aa',
                        backgroundColor: 'rgba(0, 212, 170, 0.1)',
                        fill: false,
                        yAxisID: 'y1'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: {
                                color: '#ffffff'
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: { color: '#b0b0b0' },
                            grid: { color: '#404040' }
                        },
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            ticks: { color: '#fdcb6e' },
                            grid: { color: '#404040' },
                            min: 0,
                            max: 1400
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            ticks: { color: '#00d4aa' },
                            grid: { display: false },
                            min: 0,
                            max: 100
                        }
                    }
                }
            });
        }
    }
    
    // Update purification performance chart
    updatePurificationChart() {
        if (!this.purificationChart || !this.factorySimulation || !this.factorySimulation.purificationSystem) return;
        
        const purificationSystem = this.factorySimulation.purificationSystem;
        const performanceHistory = purificationSystem.getPerformanceHistory();
        
        if (performanceHistory.length === 0) return;
        
        // Get last 20 data points
        const recentData = performanceHistory.slice(-20);
        const labels = recentData.map((_, index) => index + 1);
        const performanceScores = recentData.map(d => d.performanceScore);
        const efficiencies = recentData.map(d => d.efficiency);
        
        this.purificationChart.data.labels = labels;
        this.purificationChart.data.datasets[0].data = performanceScores;
        this.purificationChart.data.datasets[1].data = efficiencies;
        this.purificationChart.update('none');
    }
    
    // Update compression performance chart
    updateCompressionChart() {
        if (!this.compressionChart || !this.factorySimulation || !this.factorySimulation.compressionSystem) return;
        
        const compressionSystem = this.factorySimulation.compressionSystem;
        const performanceHistory = compressionSystem.getPerformanceHistory();
        
        if (performanceHistory.length === 0) return;
        
        // Get last 20 data points
        const recentData = performanceHistory.slice(-20);
        const labels = recentData.map((_, index) => index + 1);
        const performanceScores = recentData.map(d => d.performanceScore);
        const efficiencies = recentData.map(d => d.efficiency);
        
        this.compressionChart.data.labels = labels;
        this.compressionChart.data.datasets[0].data = performanceScores;
        this.compressionChart.data.datasets[1].data = efficiencies;
        this.compressionChart.update('none');
    }
    
    // Update storage performance chart
    updateStorageChart() {
        if (!this.storageChart || !this.factorySimulation || !this.factorySimulation.storageSystem) return;
        
        const storageSystem = this.factorySimulation.storageSystem;
        const performanceHistory = storageSystem.getPerformanceHistory();
        
        if (performanceHistory.length === 0) return;
        
        // Get last 20 data points
        const recentData = performanceHistory.slice(-20);
        const labels = recentData.map((_, index) => index + 1);
        const performanceScores = recentData.map(d => d.performanceScore);
        const efficiencies = recentData.map(d => d.efficiency);
        
        this.storageChart.data.labels = labels;
        this.storageChart.data.datasets[0].data = performanceScores;
        this.storageChart.data.datasets[1].data = efficiencies;
        this.storageChart.update('none');
    }
    
    // Update overview charts
    updateOverviewCharts() {
        // Update System Performance Overview Chart
        if (this.systemPerformanceChart && this.factorySimulation) {
            const waterQuality = this.factorySimulation.waterSystem ? 
                (this.factorySimulation.waterSystem.getResistivity() / 18) * 100 : 0; // Normalize to 0-100
            const electrolysis = this.factorySimulation.electrolysisSystem ? 
                this.factorySimulation.electrolysisSystem.getOverallEfficiency() : 0;
            const purification = this.factorySimulation.purificationSystem ? 
                this.factorySimulation.purificationSystem.getOverallEfficiency() : 0;
            const compression = this.factorySimulation.compressionSystem ? 
                this.factorySimulation.compressionSystem.getOverallEfficiency() : 0;
            const storage = this.factorySimulation.storageSystem ? 
                this.factorySimulation.storageSystem.getOverallEfficiency() : 0;
            
            this.systemPerformanceChart.data.datasets[0].data = [
                Math.min(100, waterQuality),
                electrolysis,
                purification,
                compression,
                storage
            ];
            this.systemPerformanceChart.update('none');
        }
        
        // Update Power & Efficiency Trends Chart
        if (this.powerEfficiencyChart && this.factorySimulation) {
            const timestamp = new Date().toLocaleTimeString();
            
            // Add new data point
            this.powerEfficiencyChart.data.labels.push(timestamp);
            this.powerEfficiencyChart.data.datasets[0].data.push(
                this.factorySimulation.powerSystem ? 
                this.factorySimulation.powerSystem.getUnitsRunning() * 300 : 0
            );
            this.powerEfficiencyChart.data.datasets[1].data.push(
                this.factorySimulation.electrolysisSystem ? 
                this.factorySimulation.electrolysisSystem.getOverallEfficiency() : 0
            );
            
            // Keep only last 20 data points
            if (this.powerEfficiencyChart.data.labels.length > 20) {
                this.powerEfficiencyChart.data.labels.shift();
                this.powerEfficiencyChart.data.datasets[0].data.shift();
                this.powerEfficiencyChart.data.datasets[1].data.shift();
            }
            
            this.powerEfficiencyChart.update('none');
        }
    }

    startMainLoop() {
        // UI metrics loop
        this.mainLoop = setInterval(() => {
            if (this.isRunning) {
                this.updateMetrics();
                this.updateCharts();
                this.updatePurificationChart();
                this.updateCompressionChart();
                this.updateStorageChart();
                this.updateOverviewCharts();
            }
        }, 1000);

        // 2D animation + simulation loop
        let lastTime = performance.now();
        const loop = (now) => {
            const delta = now - lastTime;
            lastTime = now;

            if (this.animation2D) {
                this.animation2D.update(delta);
            }

            if (this.factorySimulation) {
                this.factorySimulation.update(delta);
            }

            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    showError(message) {
        if (this.alertManager) {
            this.alertManager.showAlert(message, 'error');
        } else {
            alert('Error: ' + message);
        }
    }

    destroy() {
        if (this.mainLoop) {
            clearInterval(this.mainLoop);
        }
        
        if (this.animation2D) this.animation2D.destroy();
        if (this.factorySimulation) this.factorySimulation.destroy();
        if (this.uiManager) this.uiManager.destroy();
        if (this.alertManager) this.alertManager.destroy();
        if (this.chartManager) this.chartManager.destroy();
        if (this.socketManager) this.socketManager.disconnect();
    }
}

// Initialize app when DOM is loaded - DISABLED FOR VERCEL
// Using simplified initialization in index.html instead
/*
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 DOM loaded, initializing Hydrogen Factory App...');
    
    try {
        await waitForLibraries(); // Wait for all libraries to load
        console.log('🚀 Libraries loaded, checking classes...');
        
        // Check if all required classes are available
        checkRequiredClasses();
        console.log('🚀 All classes available, creating app...');
        
        window.hydrogenApp = new HydrogenFactoryApp();
        console.log('🚀 App created, initializing...');
        
        await window.hydrogenApp.init();
        console.log('🎉 App initialization complete!');
        
    } catch (error) {
        console.error('❌ Failed to initialize app:', error);
        
        // Show error in loading screen
        const loadingText = document.querySelector('.loading-text');
        if (loadingText) {
            loadingText.textContent = 'Initialization failed: ' + error.message;
            loadingText.style.color = '#ff4444';
        }
        
        // Show alert
        setTimeout(() => {
            alert('Failed to initialize Hydrogen Factory Simulation:\n\n' + error.message + '\n\nPlease refresh the page and try again.');
        }, 1000);
    }
});
*/
