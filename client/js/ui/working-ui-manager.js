/**
 * Working UI Manager - Complete Interactive System
 * Handles all tabs, buttons, and controls
 */

class WorkingUIManager {
    constructor() {
        this.activeTab = 'overview';
        this.isRunning = false;
        this.isInitialized = false;
    }
    
    async init() {
        console.log('🎨 Initializing Working UI Manager...');
        
        // Setup everything
        this.setupTabs();
        this.setupMainControls();
        this.setupSystemControls();
        this.setupParameterControls();
        this.setupKeyboardShortcuts();
        this.hideLoadingScreen();
        this.injectStyles();
        

        
        this.isInitialized = true;
        console.log('✅ Working UI Manager initialized');
    }
    
    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const targetTab = e.target.dataset.tab;
                this.switchTab(targetTab);
            });
        });
        
        console.log(`📑 ${tabButtons.length} tabs configured`);
    }
    
    switchTab(tabName) {
        console.log(`🎯 Switching to ${tabName} tab`);
        this.activeTab = tabName;
        
        // Update buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-tab`);
        });
    }
    
    setupMainControls() {
        const startBtn = document.getElementById('start-factory-btn');
        const stopBtn = document.getElementById('stop-factory-btn');
        const optimizeBtn = document.getElementById('optimize-btn');
        const emergencyBtn = document.getElementById('emergency-stop-btn');
        
        if (startBtn) startBtn.addEventListener('click', () => this.startFactory());
        if (stopBtn) stopBtn.addEventListener('click', () => this.stopFactory());
        if (optimizeBtn) optimizeBtn.addEventListener('click', () => this.optimizeFactory());
        if (emergencyBtn) emergencyBtn.addEventListener('click', () => this.emergencyStop());
        
        console.log('🎮 Main controls configured');
    }
    
    setupSystemControls() {
        const systems = ['water', 'electrolysis', 'purification', 'compression', 'storage', 'power'];
        
        systems.forEach(system => {
            const startBtn = document.getElementById(`${system}-start`);
            const stopBtn = document.getElementById(`${system}-stop`);
            
            if (startBtn) startBtn.addEventListener('click', () => this.startSystem(system));
            if (stopBtn) stopBtn.addEventListener('click', () => this.stopSystem(system));
        });
        
        console.log('⚙️ System controls configured');
    }
    
    setupParameterControls() {
        const sliders = [
            { id: 'voltage-slider', display: 'voltage-display', unit: 'V', decimals: 2 },
            { id: 'current-density-slider', display: 'current-density-display', unit: ' A/cm²', decimals: 2 },
            { id: 'temperature-slider', display: 'temperature-display', unit: '°C', decimals: 1 },
            { id: 'pressure-slider', display: 'pressure-display', unit: ' bar', decimals: 1 },
            { id: 'water-quality-slider', display: 'water-quality-display', unit: ' ppm', decimals: 1 },
            { id: 'water-treatment-level', display: 'water-treatment-display', unit: '% Treatment', decimals: 0, multiplier: 100 }
        ];
        
        sliders.forEach(slider => {
            const element = document.getElementById(slider.id);
            const display = document.getElementById(slider.display);
            
            if (element) {
                element.addEventListener('input', (e) => {
                    const value = parseFloat(e.target.value);
                    const displayValue = slider.multiplier ? value * slider.multiplier : value;
                    
                    if (display) {
                        display.textContent = displayValue.toFixed(slider.decimals) + slider.unit;
                    }
                    
                    // Update animation if available
                    if (window.integratedAnimation) {
                        const paramName = this.getParameterName(slider.id);
                        window.integratedAnimation.updateParameter(paramName, value);
                    }
                });
            }
        });
        
        // Enhanced Water Treatment Level Slider
        const waterTreatmentSlider = document.getElementById('water-treatment-level');
        if (waterTreatmentSlider) {
            waterTreatmentSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                this.updateWaterTreatmentDisplay(value);
                this.updateWaterPowerUnits();
                this.updateElectrolysisInputGuide(); // Update electrolysis guide
                this.updateElectrolysisInputParameters(); // Update input parameters
                
                                    // Update dependency status
                    this.updateElectrolysisDependencyStatus();
                    
                    // Update purification system when water treatment changes
                    this.updatePurificationFromElectrolysis();
                    
                    // Update water system metrics
                    this.updateWaterSystemMetrics();
                    
                    // Update system status overview
                    this.updateSystemStatusOverview();
            });
            
            // Initialize display
            this.updateWaterTreatmentDisplay(parseFloat(waterTreatmentSlider.value));
        }
        
        // Power units input event listener
        const powerUnitsInput = document.getElementById('power-units');
        if (powerUnitsInput) {
            powerUnitsInput.addEventListener('input', (e) => {
                const n = parseInt(e.target.value, 10);
                console.log(`🎛️ Power units input changed to: ${n}`);
                if (Number.isFinite(n)) {
                    const clampedN = Math.max(0, Math.min(n, 4));
                    if (clampedN !== n) {
                        e.target.value = clampedN;
                    }
                    
                    // Update power display
                    this.updatePowerDisplayDirect(clampedN);
                    
                    // Update water system power units
                    this.updateWaterPowerUnits();
                    
                    // Update electrolysis input guide
                    this.updateElectrolysisInputGuide();
                    this.updateElectrolysisInputParameters(); // Update input parameters
                    
                    // Update dependency status
                    this.updateElectrolysisDependencyStatus();
                    
                    // Update purification system when power units change
                    this.updatePurificationFromElectrolysis();
                    
                    // Update system status overview
                    this.updateSystemStatusOverview();
                    
                    // Try to update factory simulation if available
                    if (window.factorySimulation && window.factorySimulation.setPowerUnits) {
                        console.log('✅ Factory simulation available, updating power units');
                        window.factorySimulation.setPowerUnits(clampedN);
                    } else if (window.integratedMain && window.integratedMain.factorySimulation) {
                        console.log('✅ Factory simulation found in integratedMain, updating power units');
                        window.integratedMain.factorySimulation.setPowerUnits(clampedN);
                    } else {
                        console.warn('⚠️ Factory simulation not available yet');
                    }
                }
            });
        }
        
        // Monitor water system status changes
        this.setupWaterSystemStatusMonitoring();
        
        // Setup electrolysis input guide controls
        this.setupElectrolysisInputGuideControls();
        
        // Initialize electrolysis input guide
        setTimeout(() => {
            this.updateElectrolysisInputGuide();
            this.updateElectrolysisInputParameters(); // Update input parameters
            this.updateElectrolysisDependencyStatus();
            this.updateSystemStatusOverview();
        }, 500);
        
        // Setup purification level slider for real-time updates
        const purificationLevelSlider = document.getElementById('purification-level');
        if (purificationLevelSlider) {
            purificationLevelSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                const display = document.getElementById('purification-level-display');
                if (display) {
                    display.textContent = (value * 100).toFixed(0) + '%';
                }
                // Update purification calculations in real-time
                this.updatePurificationFromElectrolysis();
            });
            
            // Initialize purification display
            const initialValue = parseFloat(purificationLevelSlider.value) || 0.95;
            const display = document.getElementById('purification-level-display');
            if (display) {
                display.textContent = (initialValue * 100).toFixed(0) + '%';
            }
        }
        
        console.log('🎛️ Parameter controls configured');
    }
    
    getParameterName(sliderId) {
        const mapping = {
            'voltage-slider': 'voltage',
            'current-density-slider': 'currentDensity',
            'temperature-slider': 'temperature',
            'pressure-slider': 'pressure',
            'water-quality-slider': 'waterQuality',
            'water-treatment-level': 'waterTreatmentLevel'
        };
        return mapping[sliderId] || sliderId;
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            switch(e.key) {
                case ' ':
                    e.preventDefault();
                    this.isRunning ? this.stopFactory() : this.startFactory();
                    break;
                case 'o':
                case 'O':
                    this.optimizeFactory();
                    break;
                case 'e':
                case 'E':
                    this.emergencyStop();
                    break;
                case '1': this.switchTab('overview'); break;
                case '2': this.switchTab('water'); break;
                case '3': this.switchTab('electrolysis'); break;
                case '4': this.switchTab('purification'); break;
                case '5': this.switchTab('compression'); break;
                case '6': this.switchTab('storage'); break;
                case '7': this.switchTab('power'); break;
            }
        });
        
        console.log('⌨️ Keyboard shortcuts configured');
    }
    
    hideLoadingScreen() {
        console.log('🎨 Hiding loading screen...');
        
        // Ensure loading screen is hidden even if there are issues
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            const app = document.getElementById('app');
            
            if (loadingScreen) {
                loadingScreen.style.transition = 'opacity 0.5s ease';
                loadingScreen.style.opacity = '0';
                setTimeout(() => loadingScreen.style.display = 'none', 500);
            }
            
            if (app) {
                app.classList.remove('hidden');
                app.style.transition = 'opacity 0.5s ease';
                app.style.opacity = '0';
                app.style.display = 'block';
                setTimeout(() => app.style.opacity = '1', 100);
            }
            
            console.log('✅ Loading screen hidden, app visible');
        }, 1500);
        
        // Fallback: force hide after 4 seconds
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            const app = document.getElementById('app');
            
            if (loadingScreen && loadingScreen.style.display !== 'none') {
                console.log('⚠️ Force hiding loading screen (fallback)');
                loadingScreen.style.display = 'none';
            }
            
            if (app && app.classList.contains('hidden')) {
                console.log('⚠️ Force showing app (fallback)');
                app.classList.remove('hidden');
                app.style.display = 'block';
                app.style.opacity = '1';
            }
        }, 4000);
    }
    
    startFactory() {
        console.log('🚀 Starting factory...');
        this.isRunning = true;
        this.updateSystemStatus('Running', 'running');
        
        if (window.integratedAnimation) {
            window.integratedAnimation.start();
        }
        
        this.showMessage('success', 'Factory Started', 'All systems operational');
    }
    
    stopFactory() {
        console.log('⏹️ Stopping factory...');
        this.isRunning = false;
        this.updateSystemStatus('Stopped', 'stopped');
        
        if (window.integratedAnimation) {
            window.integratedAnimation.stop();
        }
        
        this.showMessage('info', 'Factory Stopped', 'All systems shut down');
    }
    
    emergencyStop() {
        console.log('🚨 Emergency stop!');
        this.isRunning = false;
        this.updateSystemStatus('EMERGENCY STOP', 'emergency');
        
        if (window.integratedAnimation) {
            window.integratedAnimation.emergencyStop();
        }
        
        this.showMessage('error', '🚨 EMERGENCY STOP', 'Immediate shutdown');
        
        document.body.style.animation = 'emergency-flash 0.5s ease-in-out 3';
        setTimeout(() => document.body.style.animation = '', 1500);
    }
    
    optimizeFactory() {
        console.log('🎯 Optimizing...');
        this.showMessage('info', '🎯 Optimizing', 'Finding optimal parameters');
        
        if (window.integratedAnimation) {
            window.integratedAnimation.optimize();
        }
        
        setTimeout(() => {
            this.showMessage('success', '✅ Optimized', 'Parameters optimized');
        }, 2000);
    }
    
    startSystem(systemName) {
        console.log(`🔧 Starting ${systemName}...`);
        
        // Use system connector if available
        if (window.systemConnector) {
            window.systemConnector.startSystem(systemName);
        }
        
        const statusElement = document.getElementById(`${systemName}Status`);
        if (statusElement) {
            statusElement.textContent = 'running';
            statusElement.className = 'status-value running';
        }
        
        // Update overview status immediately
        this.updateSystemStatusOverview();
        
        // Update water system metrics if it's the water system
        if (systemName === 'water') {
            this.updateWaterSystemMetrics();
        }
        
        this.showMessage('success', `${systemName} Started`, `${systemName} operational`);
    }
    
    stopSystem(systemName) {
        console.log(`🔧 Stopping ${systemName}...`);
        
        // Use system connector if available
        if (window.systemConnector) {
            window.systemConnector.stopSystem(systemName);
        }
        
        const statusElement = document.getElementById(`${systemName}Status`);
        if (statusElement) {
            statusElement.textContent = 'offline';
            statusElement.className = 'status-value offline';
        }
        
        // Update overview status
        this.updateSystemStatusOverview();
        
        this.showMessage('info', `${systemName} Stopped`, `${systemName} shut down`);
    }
    
    updateSystemStatus(text, className) {
        const systemStatus = document.getElementById('system-status');
        const factoryStatus = document.getElementById('factory-status');
        
        if (systemStatus) {
            systemStatus.textContent = text;
            systemStatus.className = `status-indicator ${className}`;
        }
        
        if (factoryStatus) {
            factoryStatus.textContent = text;
            factoryStatus.className = `status ${className}`;
        }
        
        const timeElement = document.getElementById('system-time');
        if (timeElement) {
            timeElement.textContent = new Date().toLocaleTimeString();
        }
    }
    
    showMessage(type, title, message) {
        console.log(`${type.toUpperCase()}: ${title} - ${message}`);
        
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.style.cssText = `
            position: fixed; top: 20px; right: 20px; padding: 15px 20px;
            border-radius: 5px; z-index: 10000; max-width: 300px;
            animation: slideIn 0.3s ease; color: white; font-weight: bold;
        `;
        
        const styles = {
            success: 'background: rgba(46, 204, 113, 0.95); border-left: 4px solid #27ae60;',
            info: 'background: rgba(52, 152, 219, 0.95); border-left: 4px solid #2980b9;',
            error: 'background: rgba(231, 76, 60, 0.95); border-left: 4px solid #c0392b;'
        };
        
        alert.style.cssText += styles[type] || styles.info;
        alert.innerHTML = `
            ${title}: ${message}
            <button style="float: right; background: none; border: none; color: inherit; font-size: 18px; cursor: pointer; margin-left: 10px;" onclick="this.parentElement.remove()">&times;</button>
        `;
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            if (alert.parentElement) {
                alert.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => alert.remove(), 300);
            }
        }, 4000);
    }
    
    updateWaterTreatmentDisplay(treatmentLevel) {
        const percentage = Math.round(treatmentLevel * 100);
        
        // Update treatment display
        const treatmentDisplay = document.getElementById('water-treatment-display');
        if (treatmentDisplay) {
            treatmentDisplay.textContent = `${percentage}%`;
        }
        
        // Update water quality display
        const waterQualityDisplay = document.getElementById('water-quality-display');
        if (waterQualityDisplay) {
            if (treatmentLevel < 0.3) waterQualityDisplay.textContent = 'Basic';
            else if (treatmentLevel < 0.7) waterQualityDisplay.textContent = 'Good';
            else waterQualityDisplay.textContent = 'Excellent';
        }
        
        // Update flow impact
        const flowImpact = document.getElementById('flow-impact');
        if (flowImpact) {
            const impact = Math.round(-treatmentLevel * 30);
            flowImpact.textContent = `${impact}%`;
        }
        
        // Update quality impact
        const qualityImpact = document.getElementById('quality-impact');
        if (qualityImpact) {
            const impact = Math.round(treatmentLevel * 50);
            qualityImpact.textContent = `+${impact}%`;
        }
        
        // Update slider fill visual
        const sliderFill = document.getElementById('slider-fill');
        if (sliderFill) {
            sliderFill.style.width = `${percentage}%`;
        }
    }
    
    updateWaterPowerUnits() {
        const powerUnitsInput = document.getElementById('power-units');
        const waterPowerUnits = document.getElementById('water-power-units');
        
        if (powerUnitsInput && waterPowerUnits) {
            const currentUnits = parseInt(powerUnitsInput.value) || 0;
            waterPowerUnits.textContent = `${currentUnits} units required`;
            
            // Update the display with enhanced styling
            waterPowerUnits.className = 'info-value';
            if (currentUnits > 0) {
                waterPowerUnits.style.color = '#27ae60';
            } else {
                waterPowerUnits.style.color = '#95a5a6';
            }
        }
    }
    
    updatePowerDisplayDirect(units) {
        const powerPerUnit = 300; // kW per unit
        const totalPower = units * powerPerUnit;
        
        // Update power total display
        const powerKw = document.getElementById('power-total-kw');
        if (powerKw) {
            powerKw.textContent = totalPower.toFixed(0) + ' kW';
            console.log(`⚡ Power display updated directly: ${units} units × ${powerPerUnit} kW = ${totalPower} kW`);
        }
        
        // Update overview power consumption if available
        const overviewPowerConsumption = document.getElementById('power-consumption');
        if (overviewPowerConsumption) {
            overviewPowerConsumption.textContent = totalPower.toFixed(0) + ' kW';
        }
        
        // Update power units available display
        const powerUnitsAvailable = document.getElementById('power-units-available');
        if (powerUnitsAvailable) {
            powerUnitsAvailable.textContent = '4';
        }
    }
    
    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            @keyframes emergency-flash {
                0%, 100% { background-color: transparent; }
                50% { background-color: rgba(231, 76, 60, 0.1); }
            }
            .tab-btn.active {
                background: #4a90e2 !important;
                color: white !important;
                box-shadow: 0 2px 10px rgba(74, 144, 226, 0.3);
            }
            .tab-content { display: none; }
            .tab-content.active { display: block; }
            .status-value.running { color: #2ecc71 !important; }
            .status-value.offline { color: #95a5a6 !important; }
            .status-indicator.running { color: #2ecc71 !important; }
            .status-indicator.stopped { color: #95a5a6 !important; }
            .status-indicator.emergency { color: #e74c3c !important; animation: pulse 1s infinite; }
            .status.running { color: #2ecc71 !important; }
            .status.stopped { color: #95a5a6 !important; }
            .status.emergency { color: #e74c3c !important; animation: pulse 1s infinite; }
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
            
            /* Enhanced Water Treatment Slider Styles */
            .enhanced-slider {
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                margin: 20px 0;
            }
            
            .slider-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            }
            
            .slider-title {
                font-weight: 600;
                color: #2c3e50;
                font-size: 16px;
            }
            
            .slider-value {
                background: linear-gradient(135deg, #3498db, #2980b9);
                color: white;
                padding: 6px 12px;
                border-radius: 20px;
                font-weight: bold;
                font-size: 14px;
                min-width: 60px;
                text-align: center;
            }
            
            .enhanced-range {
                width: 100%;
                height: 8px;
                border-radius: 4px;
                background: linear-gradient(90deg, #e74c3c 0%, #f39c12 50%, #27ae60 100%);
                outline: none;
                -webkit-appearance: none;
                margin: 20px 0;
            }
            
            .enhanced-range::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: linear-gradient(135deg, #3498db, #2980b9);
                cursor: pointer;
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                border: 3px solid white;
                transition: all 0.2s ease;
            }
            
            .enhanced-range::-webkit-slider-thumb:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 12px rgba(0,0,0,0.4);
            }
            
            .enhanced-range::-moz-range-thumb {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: linear-gradient(135deg, #3498db, #2980b9);
                cursor: pointer;
                border: 3px solid white;
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            }
            
            .slider-labels {
                display: flex;
                justify-content: space-between;
                margin: 15px 0;
                font-size: 12px;
                color: #7f8c8d;
            }
            
            .label-min { color: #e74c3c; font-weight: 500; }
            .label-optimal { color: #f39c12; font-weight: 600; }
            .label-max { color: #27ae60; font-weight: 500; }
            
            .enhanced-info {
                background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
                border-radius: 8px;
                padding: 15px;
                border-left: 4px solid #3498db;
            }
            
            .info-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 15px;
                margin-bottom: 15px;
            }
            
            .info-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                padding: 10px;
                background: rgba(52, 152, 219, 0.1);
                border-radius: 6px;
            }
            
            .info-label {
                font-size: 11px;
                color: #7f8c8d;
                margin-bottom: 5px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .info-value {
                font-size: 16px;
                font-weight: 600;
                color: #2c3e50;
            }
            
            .treatment-description {
                border-top: 1px solid #ecf0f1;
                padding-top: 15px;
                margin-top: 15px;
            }
            
            .treatment-description p {
                margin: 8px 0;
                color: #34495e;
                font-size: 14px;
            }
        `;
        document.head.appendChild(style);
    }
    
    // New method to update electrolysis input parameters from dependencies
    updateElectrolysisInputParameters() {
        const powerUnitsInput = document.getElementById('power-units');
        const waterTreatmentSlider = document.getElementById('water-treatment-level');
        
        if (powerUnitsInput && waterTreatmentSlider) {
            const powerUnits = parseInt(powerUnitsInput.value) || 0;
            const treatmentLevel = parseFloat(waterTreatmentSlider.value) || 0.5;
            
            // Calculate water system values (same as water system)
            const waterFlow = 1000 * (1 - treatmentLevel * 0.3);
            const waterResistivity = 8 + treatmentLevel * 10;
            const processWaterTDS = 50 - treatmentLevel * 45;
            
            // Update power system parameters
            const powerUnitsDisplay = document.getElementById('electrolysis-input-power-units');
            if (powerUnitsDisplay) {
                powerUnitsDisplay.textContent = powerUnits;
            }
            
            const powerCapacityDisplay = document.getElementById('electrolysis-input-power-capacity');
            if (powerCapacityDisplay) {
                const powerCapacity = powerUnits * 300;
                powerCapacityDisplay.textContent = powerCapacity.toFixed(0) + ' kW';
            }
            
            // Update water system parameters
            const waterFlowDisplay = document.getElementById('electrolysis-input-water-flow');
            if (waterFlowDisplay) {
                waterFlowDisplay.textContent = waterFlow.toFixed(0) + ' L/hr';
            }
            
            const waterResistivityDisplay = document.getElementById('electrolysis-input-water-resistivity');
            if (waterResistivityDisplay) {
                waterResistivityDisplay.textContent = waterResistivity.toFixed(1) + ' MΩ·cm';
            }
            
            const waterTDSDisplay = document.getElementById('electrolysis-input-water-tds');
            if (waterTDSDisplay) {
                waterTDSDisplay.textContent = processWaterTDS.toFixed(1) + ' ppm';
            }
            
            // Update purification system when electrolysis parameters change
            this.updatePurificationFromElectrolysis();
        }
    }
    
    // New method to update electrolysis dependency status
    updateElectrolysisDependencyStatus() {
        const powerUnitsInput = document.getElementById('power-units');
        const waterTreatmentSlider = document.getElementById('water-treatment-level');
        
        if (powerUnitsInput && waterTreatmentSlider) {
            const powerUnits = parseInt(powerUnitsInput.value) || 0;
            const treatmentLevel = parseFloat(waterTreatmentSlider.value) || 0.5;
            
            // Check power system dependency
            const powerDependency = document.getElementById('electrolysis-power-dependency');
            if (powerDependency) {
                if (powerUnits > 0) {
                    powerDependency.textContent = '✅ Connected & Running';
                    powerDependency.style.color = '#27ae60';
                } else {
                    powerDependency.textContent = '❌ No Power Units';
                    powerDependency.style.color = '#e74c3c';
                }
            }
            
            // Check water system dependency
            const waterDependency = document.getElementById('electrolysis-water-dependency');
            if (waterDependency) {
                // Check if water system is actually running by looking for water system status
                const waterSystemStatus = document.getElementById('waterStatus');
                const isWaterSystemRunning = waterSystemStatus && waterSystemStatus.textContent === 'running';
                
                if (isWaterSystemRunning && powerUnits > 0) {
                    waterDependency.textContent = '✅ Connected & Running';
                    waterDependency.style.color = '#27ae60';
                } else if (!isWaterSystemRunning) {
                    waterDependency.textContent = '❌ Water System Offline';
                    waterDependency.style.color = '#e74c3c';
                } else if (powerUnits === 0) {
                    waterDependency.textContent = '⚠️ No Power Units';
                    waterDependency.style.color = '#f39c12';
                } else {
                    waterDependency.textContent = '❌ No Water Flow';
                    waterDependency.style.color = '#e74c3c';
                }
            }
            
            // Check water quality dependency
            const waterQualityDependency = document.getElementById('electrolysis-water-quality-dependency');
            if (waterQualityDependency) {
                const waterResistivity = 8 + treatmentLevel * 10; // Same calculation as water system
                
                // Check if water system is running first
                const waterSystemStatus = document.getElementById('waterStatus');
                const isWaterSystemRunning = waterSystemStatus && waterSystemStatus.textContent === 'running';
                
                if (!isWaterSystemRunning) {
                    waterQualityDependency.textContent = '❌ System Offline';
                    waterQualityDependency.style.color = '#e74c3c';
                } else if (waterResistivity >= 15.0) {
                    waterQualityDependency.textContent = '✅ Sufficient Quality';
                    waterQualityDependency.style.color = '#27ae60';
                } else {
                    waterQualityDependency.textContent = '⚠️ Insufficient Quality';
                    waterQualityDependency.style.color = '#f39c12';
                }
            }
        }
    }
    
    // New method to monitor water system status changes
    setupWaterSystemStatusMonitoring() {
        // Monitor water system status changes
        const waterStartBtn = document.getElementById('water-start');
        const waterStopBtn = document.getElementById('water-stop');
        
        if (waterStartBtn) {
            waterStartBtn.addEventListener('click', () => {
                // Update electrolysis dependencies after a short delay to allow status to update
                setTimeout(() => {
                    this.updateElectrolysisDependencyStatus();
                    this.updateElectrolysisInputGuide();
                    this.updateElectrolysisInputParameters(); // Update input parameters
                    this.updateSystemStatusOverview();
                }, 500);
            });
        }
        
        if (waterStopBtn) {
            waterStopBtn.addEventListener('click', () => {
                // Update electrolysis dependencies after a short delay to allow status to update
                setTimeout(() => {
                    this.updateElectrolysisDependencyStatus();
                    this.updateElectrolysisInputGuide();
                    this.updateElectrolysisInputParameters(); // Update input parameters
                    this.updateSystemStatusOverview();
                }, 500);
            });
        }
        
        // Also monitor the water status element for changes
        const waterStatusElement = document.getElementById('waterStatus');
        if (waterStatusElement) {
            // Create a mutation observer to watch for status changes
            const observer = new MutationObserver(() => {
                this.updateElectrolysisDependencyStatus();
                this.updateElectrolysisInputGuide();
                this.updateElectrolysisInputParameters(); // Update input parameters
                this.updateSystemStatusOverview();
            });
            
            observer.observe(waterStatusElement, {
                childList: true,
                characterData: true,
                subtree: true
            });
        }
    }
    
    // New method to setup electrolysis input guide controls
    setupElectrolysisInputGuideControls() {
        // Cell count slider
        const cellCountSlider = document.getElementById('cell-count');
        if (cellCountSlider) {
            cellCountSlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                const display = document.getElementById('cell-count-display');
                if (display) {
                    display.textContent = value;
                }
                this.calculateElectrolysisResults();
                this.updatePurificationFromElectrolysis();
            });
        }
        
        // Power level slider
        const powerLevelSlider = document.getElementById('power-level');
        if (powerLevelSlider) {
            powerLevelSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                const display = document.getElementById('power-level-display');
                if (display) {
                    display.textContent = value + '%';
                }
                this.calculateElectrolysisResults();
                this.updatePurificationFromElectrolysis();
            });
        }
        
        // Target temperature slider
        const targetTempSlider = document.getElementById('target-temp');
        if (targetTempSlider) {
            targetTempSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                const display = document.getElementById('target-temp-display');
                if (display) {
                    display.textContent = value + '°C';
                }
                this.calculateElectrolysisResults();
                this.updatePurificationFromElectrolysis();
            });
        }
        
        // Target pressure slider
        const targetPressureSlider = document.getElementById('target-pressure');
        if (targetPressureSlider) {
            targetPressureSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                const display = document.getElementById('target-pressure-display');
                if (display) {
                    display.textContent = value + ' bar';
                }
                this.calculateElectrolysisResults();
                this.updatePurificationFromElectrolysis();
            });
        }
        
        // Radio button event listeners
        const electrolyzerTypeRadios = document.querySelectorAll('input[name="electrolyzer-type"]');
        electrolyzerTypeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                this.calculateElectrolysisResults();
                this.updatePurificationFromElectrolysis();
            });
        });
        
        const electrodeMaterialRadios = document.querySelectorAll('input[name="electrode-material"]');
        electrodeMaterialRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                this.calculateElectrolysisResults();
                this.updatePurificationFromElectrolysis();
            });
        });
    }
    
    // New method to update electrolysis input guide
    updateElectrolysisInputGuide() {
        // Update "What You Have" section with current values
        const powerUnitsInput = document.getElementById('power-units');
        const waterTreatmentSlider = document.getElementById('water-treatment-level');
        
        if (powerUnitsInput && waterTreatmentSlider) {
            const powerUnits = parseInt(powerUnitsInput.value) || 0;
            const treatmentLevel = parseFloat(waterTreatmentSlider.value) || 0.5;
            
            // Calculate available values (same as water system)
            const availablePowerCapacity = powerUnits * 300;
            const availableWaterFlow = 1000 * (1 - treatmentLevel * 0.3);
            const availableResistivity = 8 + treatmentLevel * 10;
            const availableTDS = 50 - treatmentLevel * 45;
            
            // Update displays
            const powerCapacityDisplay = document.getElementById('available-power-capacity');
            if (powerCapacityDisplay) {
                powerCapacityDisplay.textContent = availablePowerCapacity.toFixed(0) + ' kW';
            }
            
            const waterFlowDisplay = document.getElementById('available-water-flow');
            if (waterFlowDisplay) {
                waterFlowDisplay.textContent = availableWaterFlow.toFixed(0) + ' L/hr';
            }
            
            const resistivityDisplay = document.getElementById('available-resistivity');
            if (resistivityDisplay) {
                resistivityDisplay.textContent = availableResistivity.toFixed(1) + ' MΩ·cm';
            }
            
            const tdsDisplay = document.getElementById('available-tds');
            if (tdsDisplay) {
                tdsDisplay.textContent = availableTDS.toFixed(1) + ' ppm';
            }
            
            // Calculate and update results
            this.calculateElectrolysisResults();
        }
    }
    
    // New method to update purification system from electrolysis changes
    updatePurificationFromElectrolysis() {
        // Get current electrolysis parameters
        const powerUnitsInput = document.getElementById('power-units');
        const waterTreatmentSlider = document.getElementById('water-treatment-level');
        const cellCountSlider = document.getElementById('cell-count');
        const powerLevelSlider = document.getElementById('power-level');
        const targetTempSlider = document.getElementById('target-temp');
        const targetPressureSlider = document.getElementById('target-pressure');
        
        if (!powerUnitsInput || !waterTreatmentSlider || !cellCountSlider || 
            !powerLevelSlider || !targetTempSlider || !targetPressureSlider) {
            return;
        }
        
        const powerUnits = parseInt(powerUnitsInput.value) || 0;
        const treatmentLevel = parseFloat(waterTreatmentSlider.value) || 0.5;
        const cellCount = parseInt(cellCountSlider.value) || 350;
        const powerLevel = parseFloat(powerLevelSlider.value) || 80;
        const targetTemp = parseFloat(targetTempSlider.value) || 70;
        const targetPressure = parseFloat(targetPressureSlider.value) || 30;
        
        // Get selected options
        const electrolyzerType = document.querySelector('input[name="electrolyzer-type"]:checked')?.value || 'A';
        const electrodeMaterial = document.querySelector('input[name="electrode-material"]:checked')?.value || 'nickel';
        
        // Calculate electrolysis production rate (same logic as before)
        const waterResistivity = 8 + treatmentLevel * 10;
        const waterTDS = 50 - treatmentLevel * 45;
        const waterQualityFactor = Math.min(1.0, waterResistivity / 15.0) * (1.0 - waterTDS / 100.0);
        
        const availablePower = powerUnits * 300;
        const usedPower = availablePower * (powerLevel / 100);
        const powerLimit = usedPower / 3.54;
        
        const waterFlow = 1000 * (1 - treatmentLevel * 0.3);
        const waterLimit = waterFlow / 9;
        
        const cellAreas = { 'A': 0.1, 'B': 0.25, 'C': 0.5 };
        const cellArea = cellAreas[electrolyzerType];
        const electrodeEfficiencies = { 'nickel': 0.75, 'mixed': 0.80, 'platinum': 0.85 };
        const electrodeEfficiency = electrodeEfficiencies[electrodeMaterial];
        const cellLimit = cellCount * cellArea * electrodeEfficiency * 2.5;
        
        const finalProduction = Math.min(powerLimit, waterLimit, cellLimit);
        
        const tempFactor = 0.8 + (targetTemp - 60) * 0.01;
        const pressureFactor = 0.9 + (targetPressure - 20) * 0.005;
        const overallEfficiency = electrodeEfficiency * waterQualityFactor * tempFactor * pressureFactor * 100;
        
        const productionRate = finalProduction * (overallEfficiency / 100);
        
        // Get purification level
        const purificationLevelSlider = document.getElementById('purification-level');
        const purificationLevel = purificationLevelSlider ? parseFloat(purificationLevelSlider.value) || 0.95 : 0.95;
        
        // Calculate purification outputs
        const purificationEfficiency = 99.0 + (purificationLevel * 0.9); // 99.0% to 99.9%
        const outputHydrogenRate = productionRate * (purificationEfficiency / 100);
        const waterRemovalRate = productionRate * 0.08;
        const basePower = productionRate * 0.3;
        const multiplier = 1 + (purificationLevel * 0.5);
        const powerConsumption = basePower * multiplier;
        
        // Update purification displays
        const inputHydrogenRateDisplay = document.getElementById('purification-input-hydrogen-rate');
        if (inputHydrogenRateDisplay) {
            inputHydrogenRateDisplay.textContent = productionRate.toFixed(1) + ' Nm³/hr';
        }
        
        const inputElectrolysisEfficiencyDisplay = document.getElementById('purification-input-electrolysis-efficiency');
        if (inputElectrolysisEfficiencyDisplay) {
            inputElectrolysisEfficiencyDisplay.textContent = overallEfficiency.toFixed(1) + ' %';
        }
        
        const outputRateDisplay = document.getElementById('purification-output-rate');
        if (outputRateDisplay) {
            outputRateDisplay.textContent = outputHydrogenRate.toFixed(1) + ' Nm³/hr';
        }
        
        const purificationEfficiencyDisplay = document.getElementById('purification-efficiency');
        if (purificationEfficiencyDisplay) {
            purificationEfficiencyDisplay.textContent = purificationEfficiency.toFixed(1) + ' %';
        }
        
        const waterRemovalDisplay = document.getElementById('purification-water-removal');
        if (waterRemovalDisplay) {
            waterRemovalDisplay.textContent = waterRemovalRate.toFixed(1) + ' L/hr';
        }
        
        const powerConsumptionDisplay = document.getElementById('purification-power-consumption');
        if (powerConsumptionDisplay) {
            powerConsumptionDisplay.textContent = powerConsumption.toFixed(1) + ' kW';
        }
        
        // Update overview production rate from purification output
        const overviewProductionRate = document.getElementById('production-rate');
        if (overviewProductionRate) {
            overviewProductionRate.textContent = outputHydrogenRate.toFixed(1) + ' Nm³/hr';
        }
        
        // Update overview purification output
        const overviewPurificationOutput = document.getElementById('overview-purification-output');
        if (overviewPurificationOutput) {
            overviewPurificationOutput.textContent = outputHydrogenRate.toFixed(1) + ' Nm³/hr';
        }
        
        // Update overview purification efficiency
        const overviewPurificationEfficiency = document.getElementById('overview-purification-efficiency');
        if (overviewPurificationEfficiency) {
            overviewPurificationEfficiency.textContent = purificationEfficiency.toFixed(1) + ' %';
        }
        
        console.log(`🧪 Purification updated: Input=${productionRate.toFixed(1)} Nm³/hr, Output=${outputHydrogenRate.toFixed(1)} Nm³/hr, Efficiency=${purificationEfficiency.toFixed(1)}%`);
    }
    
    // New method to calculate electrolysis results
    calculateElectrolysisResults() {
        // Get all input values
        const powerUnitsInput = document.getElementById('power-units');
        const waterTreatmentSlider = document.getElementById('water-treatment-level');
        const cellCountSlider = document.getElementById('cell-count');
        const powerLevelSlider = document.getElementById('power-level');
        const targetTempSlider = document.getElementById('target-temp');
        const targetPressureSlider = document.getElementById('target-pressure');
        
        if (!powerUnitsInput || !waterTreatmentSlider || !cellCountSlider || 
            !powerLevelSlider || !targetTempSlider || !targetPressureSlider) {
            return;
        }
        
        const powerUnits = parseInt(powerUnitsInput.value) || 0;
        const treatmentLevel = parseFloat(waterTreatmentSlider.value) || 0.5;
        const cellCount = parseInt(cellCountSlider.value) || 350;
        const powerLevel = parseFloat(powerLevelSlider.value) || 80;
        const targetTemp = parseFloat(targetTempSlider.value) || 70;
        const targetPressure = parseFloat(targetPressureSlider.value) || 30;
        
        // Get selected options
        const electrolyzerType = document.querySelector('input[name="electrolyzer-type"]:checked')?.value || 'A';
        const electrodeMaterial = document.querySelector('input[name="electrode-material"]:checked')?.value || 'nickel';
        
        // Step 1: Water Quality Factor
        const waterResistivity = 8 + treatmentLevel * 10;
        const waterTDS = 50 - treatmentLevel * 45;
        const waterQualityFactor = Math.min(1.0, waterResistivity / 15.0) * (1.0 - waterTDS / 100.0);
        
        // Step 2: Power Limit
        const availablePower = powerUnits * 300;
        const usedPower = availablePower * (powerLevel / 100);
        const powerLimit = usedPower / 3.54; // 3.54 kWh per Nm³ H₂
        
        // Step 3: Water Limit
        const waterFlow = 1000 * (1 - treatmentLevel * 0.3);
        const waterLimit = waterFlow / 9; // 9L water = 1 Nm³ H₂
        
        // Step 4: Cell Limit
        const cellAreas = { 'A': 0.1, 'B': 0.25, 'C': 0.5 };
        const cellArea = cellAreas[electrolyzerType];
        const electrodeEfficiencies = { 'nickel': 0.75, 'mixed': 0.80, 'platinum': 0.85 };
        const electrodeEfficiency = electrodeEfficiencies[electrodeMaterial];
        const cellLimit = cellCount * cellArea * electrodeEfficiency * 2.5; // 2.5 Nm³/hr per m² at 100% efficiency
        
        // Step 5: Final Production (take the smallest limit)
        const finalProduction = Math.min(powerLimit, waterLimit, cellLimit);
        
        // Step 6: Overall Efficiency
        const tempFactor = 0.8 + (targetTemp - 60) * 0.01; // 0.8 to 1.0
        const pressureFactor = 0.9 + (targetPressure - 20) * 0.005; // 0.9 to 1.0
        const overallEfficiency = electrodeEfficiency * waterQualityFactor * tempFactor * pressureFactor * 100;
        
        // Update result displays
        const waterQualityFactorDisplay = document.getElementById('water-quality-factor');
        if (waterQualityFactorDisplay) {
            waterQualityFactorDisplay.textContent = waterQualityFactor.toFixed(3);
        }
        
        const powerLimitDisplay = document.getElementById('power-limit');
        if (powerLimitDisplay) {
            powerLimitDisplay.textContent = powerLimit.toFixed(1) + ' Nm³/hr';
        }
        
        const waterLimitDisplay = document.getElementById('water-limit');
        if (waterLimitDisplay) {
            waterLimitDisplay.textContent = waterLimit.toFixed(1) + ' Nm³/hr';
        }
        
        const cellLimitDisplay = document.getElementById('cell-limit');
        if (cellLimitDisplay) {
            cellLimitDisplay.textContent = cellLimit.toFixed(1) + ' Nm³/hr';
        }
        
        const finalProductionDisplay = document.getElementById('final-production');
        if (finalProductionDisplay) {
            finalProductionDisplay.textContent = finalProduction.toFixed(1) + ' Nm³/hr';
        }
        
        const overallEfficiencyDisplay = document.getElementById('overall-efficiency-calc');
        if (overallEfficiencyDisplay) {
            overallEfficiencyDisplay.textContent = overallEfficiency.toFixed(1) + ' %';
        }
    }
    
    // New method to update electrolysis system production rate
    updateElectrolysisSystemProduction() {
        // Get current input parameters
        const powerUnitsInput = document.getElementById('power-units');
        const waterTreatmentSlider = document.getElementById('water-treatment-level');
        const cellCountSlider = document.getElementById('cell-count');
        const powerLevelSlider = document.getElementById('power-level');
        const targetTempSlider = document.getElementById('target-temp');
        const targetPressureSlider = document.getElementById('target-pressure');
        
        if (!powerUnitsInput || !waterTreatmentSlider || !cellCountSlider || 
            !powerLevelSlider || !targetTempSlider || !targetPressureSlider) {
            return;
        }
        
        const powerUnits = parseInt(powerUnitsInput.value) || 0;
        const treatmentLevel = parseFloat(waterTreatmentSlider.value) || 0.5;
        const cellCount = parseInt(cellCountSlider.value) || 350;
        const powerLevel = parseFloat(powerLevelSlider.value) || 80;
        const targetTemp = parseFloat(targetTempSlider.value) || 70;
        const targetPressure = parseFloat(targetPressureSlider.value) || 30;
        
        // Get selected options
        const electrolyzerType = document.querySelector('input[name="electrolyzer-type"]:checked')?.value || 'A';
        const electrodeMaterial = document.querySelector('input[name="electrode-material"]:checked')?.value || 'nickel';
        
        // Calculate production rate using the same logic as the electrolysis system
        // Step 1: Water Quality Factor
        const waterResistivity = 8 + treatmentLevel * 10;
        const waterTDS = 50 - treatmentLevel * 45;
        const waterQualityFactor = Math.min(1.0, waterResistivity / 15.0) * (1.0 - waterTDS / 100.0);
        
        // Step 2: Power Limit
        const availablePower = powerUnits * 300;
        const usedPower = availablePower * (powerLevel / 100);
        const powerLimit = usedPower / 3.54; // 3.54 kWh per Nm³ H₂
        
        // Step 3: Water Limit
        const waterFlow = 1000 * (1 - treatmentLevel * 0.3);
        const waterLimit = waterFlow / 9; // 9L water = 1 Nm³ H₂
        
        // Step 4: Cell Limit
        const cellAreas = { 'A': 0.1, 'B': 0.25, 'C': 0.5 };
        const cellArea = cellAreas[electrolyzerType];
        const electrodeEfficiencies = { 'nickel': 0.75, 'mixed': 0.80, 'platinum': 0.85 };
        const electrodeEfficiency = electrodeEfficiencies[electrodeMaterial];
        const cellLimit = cellCount * cellArea * electrodeEfficiency * 2.5; // 2.5 Nm³/hr per m² at 100% efficiency
        
        // Step 5: Final Production (take the smallest limit)
        const finalProduction = Math.min(powerLimit, waterLimit, cellLimit);
        
        // Step 6: Overall Efficiency
        const tempFactor = 0.8 + (targetTemp - 60) * 0.01; // 0.8 to 1.0
        const pressureFactor = 0.9 + (targetPressure - 20) * 0.005; // 0.9 to 1.0
        const overallEfficiency = electrodeEfficiency * waterQualityFactor * tempFactor * pressureFactor * 100;
        
        // Apply efficiency to get final production rate
        const productionRate = finalProduction * (overallEfficiency / 100);
        
        // Update the overview production display
        const overviewProductionDisplay = document.getElementById('overview-electrolysis-production');
        if (overviewProductionDisplay) {
            overviewProductionDisplay.textContent = productionRate.toFixed(1) + ' Nm³/hr';
        }
        
        // Update the main production rate display
        const productionRateDisplay = document.getElementById('production-rate');
        if (productionRateDisplay) {
            productionRateDisplay.textContent = productionRate.toFixed(1) + ' Nm³/hr';
        }
        
        // Update electrolysis efficiency display
        const overviewEfficiencyDisplay = document.getElementById('overview-electrolysis-efficiency');
        if (overviewEfficiencyDisplay) {
            overviewEfficiencyDisplay.textContent = overallEfficiency.toFixed(1) + ' %';
        }
        
        console.log(`🔋 Calculated production rate: ${productionRate.toFixed(1)} Nm³/hr (Efficiency: ${overallEfficiency.toFixed(1)}%)`);
        
        // Update purification system when electrolysis results change
        this.updatePurificationFromElectrolysis();
    }
    
    // New method to update all system status overview values from other tabs
    updateSystemStatusOverview() {
        // Update water system status
        const waterStatusElement = document.getElementById('waterStatus');
        const overviewWaterStatus = document.getElementById('overview-water-status');
        if (waterStatusElement && overviewWaterStatus) {
            overviewWaterStatus.textContent = waterStatusElement.textContent;
            overviewWaterStatus.className = waterStatusElement.className;
        }
        
        // Update water system metrics
        const waterResistivityElement = document.getElementById('water-resistivity');
        const overviewWaterQuality = document.getElementById('overview-water-quality');
        if (waterResistivityElement && overviewWaterQuality) {
            overviewWaterQuality.textContent = waterResistivityElement.textContent;
        }
        
        const waterFlowRateElement = document.getElementById('water-flow-rate');
        const overviewWaterFlow = document.getElementById('overview-water-flow');
        if (waterFlowRateElement && overviewWaterFlow) {
            overviewWaterFlow.textContent = waterFlowRateElement.textContent;
        }
        
        // Update electrolysis system status
        const electrolysisStatusElement = document.getElementById('electrolysisStatus');
        const overviewElectrolysisStatus = document.getElementById('overview-electrolysis-status');
        if (electrolysisStatusElement && overviewElectrolysisStatus) {
            overviewElectrolysisStatus.textContent = electrolysisStatusElement.textContent;
            overviewElectrolysisStatus.className = electrolysisStatusElement.className;
        }
        
        // Update electrolysis production and efficiency
        const finalProductionElement = document.getElementById('final-production');
        const overviewElectrolysisProduction = document.getElementById('overview-electrolysis-production');
        if (finalProductionElement && overviewElectrolysisProduction) {
            overviewElectrolysisProduction.textContent = finalProductionElement.textContent;
        }
        
        const overallEfficiencyElement = document.getElementById('overall-efficiency-calc');
        const overviewElectrolysisEfficiency = document.getElementById('overview-electrolysis-efficiency');
        if (overallEfficiencyElement && overviewElectrolysisEfficiency) {
            overviewElectrolysisEfficiency.textContent = overallEfficiencyElement.textContent;
        }
        
        // Update purification system status
        const purificationStatusElement = document.getElementById('purificationStatus');
        const overviewPurificationStatus = document.getElementById('overview-purification-status');
        if (purificationStatusElement && overviewPurificationStatus) {
            overviewPurificationStatus.textContent = purificationStatusElement.textContent;
            overviewPurificationStatus.className = purificationStatusElement.className;
        }
        
        // Update compression system status
        const compressionStatusElement = document.getElementById('compressionStatus');
        const overviewCompressionStatus = document.getElementById('overview-compression-status');
        if (compressionStatusElement && overviewCompressionStatus) {
            overviewCompressionStatus.textContent = compressionStatusElement.textContent;
            overviewCompressionStatus.className = compressionStatusElement.className;
        }
        
        // Update compression metrics
        const compressionOutputPressureElement = document.getElementById('compression-output-pressure');
        const overviewCompressionPressure = document.getElementById('overview-compression-pressure');
        if (compressionOutputPressureElement && overviewCompressionPressure) {
            overviewCompressionPressure.textContent = compressionOutputPressureElement.textContent;
        }
        
        const compressionOverallEfficiencyElement = document.getElementById('compression-overall-efficiency');
        const overviewCompressionEfficiency = document.getElementById('overview-compression-efficiency');
        if (compressionOverallEfficiencyElement && overviewCompressionEfficiency) {
            overviewCompressionEfficiency.textContent = compressionOverallEfficiencyElement.textContent;
        }
        
        // Update storage system status
        const storageStatusElement = document.getElementById('storageStatus');
        const overviewStorageStatus = document.getElementById('overview-storage-status');
        if (storageStatusElement && overviewStorageStatus) {
            overviewStorageStatus.textContent = storageStatusElement.textContent;
            overviewStorageStatus.className = storageStatusElement.className;
        }
        
        // Update storage metrics
        const storageFillLevelElement = document.getElementById('storage-fill-level');
        const overviewStorageFill = document.getElementById('overview-storage-fill');
        if (storageFillLevelElement && overviewStorageFill) {
            overviewStorageFill.textContent = storageFillLevelElement.textContent;
        }
        
        const storageActiveTanksElement = document.getElementById('storage-active-tanks');
        const overviewStorageTanks = document.getElementById('overview-storage-tanks');
        if (storageActiveTanksElement && overviewStorageTanks) {
            overviewStorageTanks.textContent = storageActiveTanksElement.textContent;
        }
        
        // Update overview storage level
        const overviewStorageLevel = document.getElementById('overview-storage-level');
        if (storageFillLevelElement && overviewStorageLevel) {
            overviewStorageLevel.textContent = storageFillLevelElement.textContent;
        }
        
        // Update system efficiency (average of all system efficiencies)
        this.updateSystemEfficiency();
        
        console.log('📊 System status overview updated');
    }
    
    // New method to calculate and update system efficiency
    updateSystemEfficiency() {
        const overviewSystemEfficiency = document.getElementById('system-efficiency');
        if (!overviewSystemEfficiency) return;
        
        // Get efficiency values from different systems
        const electrolysisEfficiencyElement = document.getElementById('overall-efficiency-calc');
        const purificationEfficiencyElement = document.getElementById('purification-efficiency');
        const compressionEfficiencyElement = document.getElementById('compression-overall-efficiency');
        const storageEfficiencyElement = document.getElementById('storage-storage-efficiency');
        
        let totalEfficiency = 0;
        let efficiencyCount = 0;
        
        if (electrolysisEfficiencyElement) {
            const efficiency = parseFloat(electrolysisEfficiencyElement.textContent);
            if (!isNaN(efficiency)) {
                totalEfficiency += efficiency;
                efficiencyCount++;
            }
        }
        
        if (purificationEfficiencyElement) {
            const efficiency = parseFloat(purificationEfficiencyElement.textContent);
            if (!isNaN(efficiency)) {
                totalEfficiency += efficiency;
                efficiencyCount++;
            }
        }
        
        if (compressionEfficiencyElement) {
            const efficiency = parseFloat(compressionEfficiencyElement.textContent);
            if (!isNaN(efficiency)) {
                totalEfficiency += efficiency;
                efficiencyCount++;
            }
        }
        
        if (storageEfficiencyElement) {
            const efficiency = parseFloat(storageEfficiencyElement.textContent);
            if (!isNaN(efficiency)) {
                totalEfficiency += efficiency;
                efficiencyCount++;
            }
        }
        
        const averageEfficiency = efficiencyCount > 0 ? totalEfficiency / efficiencyCount : 0;
        overviewSystemEfficiency.textContent = averageEfficiency.toFixed(1) + '%';
    }
    

    
    // New method to update water system metrics
    updateWaterSystemMetrics() {
        const waterTreatmentSlider = document.getElementById('water-treatment-level');
        if (!waterTreatmentSlider) return;
        
        const treatmentLevel = parseFloat(waterTreatmentSlider.value) || 0.5;
        
        // Calculate water metrics
        const waterResistivity = 8 + treatmentLevel * 10;
        const waterFlow = 1000 * (1 - treatmentLevel * 0.3);
        
        // Update water resistivity display
        const waterResistivityElement = document.getElementById('water-resistivity');
        if (waterResistivityElement) {
            waterResistivityElement.textContent = waterResistivity.toFixed(1) + ' MΩ·cm';
        }
        
        // Update water flow rate display
        const waterFlowRateElement = document.getElementById('water-flow-rate');
        if (waterFlowRateElement) {
            waterFlowRateElement.textContent = waterFlow.toFixed(0) + ' L/hr';
        }
        
        // Update process water TDS
        const processWaterTDSElement = document.getElementById('process-water-tds');
        if (processWaterTDSElement) {
            const processWaterTDS = 50 - treatmentLevel * 45;
            processWaterTDSElement.textContent = processWaterTDS.toFixed(1) + ' ppm';
        }
        
        // Update raw water TDS
        const rawWaterTDSElement = document.getElementById('raw-water-tds');
        if (rawWaterTDSElement) {
            rawWaterTDSElement.textContent = '50.0 ppm';
        }
        
        console.log('💧 Water system metrics updated');
    }
}

// Initialize when DOM is ready - Vercel compatible
let workingUIManager;

// Only initialize if not already initialized by another system
if (!window.vercelApp && !window.hydrogenApp && !window.integratedController) {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            workingUIManager = new WorkingUIManager();
            workingUIManager.init();
            
            window.workingUIManager = workingUIManager;
            window.UIManager = WorkingUIManager; // For compatibility
            
            console.log('🎉 Working UI System Ready!');
            
        }, 100);
    });
}

window.WorkingUIManager = WorkingUIManager;
