/**
 * Integrated Main Controller for Hydrogen Factory
 * Connects the new animation system with existing HTML structure
 */

class IntegratedFactoryController {
    constructor() {
        this.animation = null;
        this.isRunning = false;
        
        console.log('🏭 Initializing Integrated Factory Controller...');
        this.init();
    }
    
    async init() {
        try {
            // Wait for animation system to be ready
            if (typeof IntegratedHydrogenAnimation !== 'undefined') {
                this.animation = new IntegratedHydrogenAnimation();
                console.log('✅ Animation system connected');
            } else {
                console.warn('⚠️ Animation system not available');
            }
            
            // Setup event listeners
            this.setupControls();
            this.setupParameterControls();
            
            // Hide loading screen and show app
            this.hideLoadingScreen();
            
            console.log('✅ Integrated Factory Controller ready!');
            
        } catch (error) {
            console.error('❌ Failed to initialize controller:', error);
            this.hideLoadingScreen();
        }
    }
    
    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            const app = document.getElementById('app');
            
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
            
            if (app) {
                app.classList.remove('hidden');
                app.style.opacity = '0';
                app.style.display = 'block';
                setTimeout(() => {
                    app.style.opacity = '1';
                }, 100);
            }
        }, 1000);
    }
    
    setupControls() {
        // Main factory control buttons
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
            optimizeBtn.addEventListener('click', () => this.optimizeFactory());
        }
        
        if (emergencyBtn) {
            emergencyBtn.addEventListener('click', () => this.emergencyStop());
        }
        
        // System control buttons
        this.setupSystemControls();
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT') return;
            
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
            }
        });
    }
    
    setupSystemControls() {
        // Water system controls
        const waterStart = document.getElementById('water-start');
        const waterStop = document.getElementById('water-stop');
        
        if (waterStart) waterStart.addEventListener('click', () => this.startSystem('water'));
        if (waterStop) waterStop.addEventListener('click', () => this.stopSystem('water'));
        
        // Electrolysis system controls
        const electroStart = document.getElementById('electrolysis-start');
        const electroStop = document.getElementById('electrolysis-stop');
        const electroRamp = document.getElementById('electrolysis-ramp');
        
        if (electroStart) electroStart.addEventListener('click', () => this.startSystem('electrolysis'));
        if (electroStop) electroStop.addEventListener('click', () => this.stopSystem('electrolysis'));
        if (electroRamp) electroRamp.addEventListener('click', () => this.rampUpElectrolysis());
        
        // Other system controls
        const systems = ['purification', 'compression', 'storage', 'power'];
        systems.forEach(system => {
            const startBtn = document.getElementById(`${system}-start`);
            const stopBtn = document.getElementById(`${system}-stop`);
            
            if (startBtn) startBtn.addEventListener('click', () => this.startSystem(system));
            if (stopBtn) stopBtn.addEventListener('click', () => this.stopSystem(system));
        });
    }
    
    setupParameterControls() {
        // Advanced parameter sliders
        const sliders = [
            { id: 'voltage-slider', param: 'voltage', display: 'voltage-display', unit: 'V', decimals: 2 },
            { id: 'current-density-slider', param: 'currentDensity', display: 'current-density-display', unit: ' A/cm²', decimals: 2 },
            { id: 'temperature-slider', param: 'temperature', display: 'temperature-display', unit: '°C', decimals: 1 },
            { id: 'pressure-slider', param: 'pressure', display: 'pressure-display', unit: ' bar', decimals: 1 },
            { id: 'water-quality-slider', param: 'waterQuality', display: 'water-quality-display', unit: ' ppm', decimals: 1 },
            { id: 'water-treatment-level', param: 'waterTreatmentLevel', display: 'water-treatment-display', unit: '% Treatment', decimals: 0, multiplier: 100 }
        ];
        
        sliders.forEach(slider => {
            const element = document.getElementById(slider.id);
            const display = document.getElementById(slider.display);
            
            if (element && this.animation) {
                element.addEventListener('input', (e) => {
                    const value = parseFloat(e.target.value);
                    const displayValue = slider.multiplier ? value * slider.multiplier : value;
                    
                    // Update animation parameter
                    this.animation.updateParameter(slider.param, value);
                    
                    // Update display
                    if (display) {
                        display.textContent = displayValue.toFixed(slider.decimals) + slider.unit;
                    }
                    
                    // Visual feedback
                    this.showParameterFeedback(slider.param, value);
                });
            }
        });
        
        // Legacy sliders for compatibility
        const legacySliders = [
            { id: 'target-temperature', param: 'temperature', display: 'target-temperature-display', unit: '°C' },
            { id: 'target-pressure', param: 'pressure', display: 'target-pressure-display', unit: ' bar' },
            { id: 'target-voltage', param: 'voltage', display: 'target-voltage-display', unit: 'V', multiplier: 0.001 },
            { id: 'target-current', param: 'currentDensity', display: 'target-current-display', unit: 'A', multiplier: 0.001 }
        ];
        
        legacySliders.forEach(slider => {
            const element = document.getElementById(slider.id);
            const display = document.getElementById(slider.display);
            
            if (element && this.animation) {
                element.addEventListener('input', (e) => {
                    const rawValue = parseFloat(e.target.value);
                    const value = slider.multiplier ? rawValue * slider.multiplier : rawValue;
                    
                    this.animation.updateParameter(slider.param, value);
                    
                    if (display) {
                        display.textContent = rawValue + slider.unit;
                    }
                });
            }
        });
    }
    
    startFactory() {
        if (this.isRunning) return;
        
        console.log('🚀 Starting integrated factory...');
        
        if (this.animation) {
            this.animation.start();
        }
        
        this.isRunning = true;
        this.updateSystemStatus('running');
        
        // Show success message
        this.showMessage('success', 'Factory Started', 'All systems are now operational');
    }
    
    stopFactory() {
        if (!this.isRunning) return;
        
        console.log('⏹️ Stopping integrated factory...');
        
        if (this.animation) {
            this.animation.stop();
        }
        
        this.isRunning = false;
        this.updateSystemStatus('stopped');
        
        this.showMessage('info', 'Factory Stopped', 'All systems have been shut down');
    }
    
    emergencyStop() {
        console.log('🚨 Emergency stop activated!');
        
        if (this.animation) {
            this.animation.emergencyStop();
        }
        
        this.isRunning = false;
        this.updateSystemStatus('emergency');
        
        this.showMessage('error', '🚨 EMERGENCY STOP', 'All systems shut down immediately for safety');
        
        // Flash effect
        document.body.style.animation = 'emergency-flash 0.5s ease-in-out 3';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 1500);
    }
    
    optimizeFactory() {
        if (!this.animation) return;
        
        console.log('🎯 Optimizing factory parameters...');
        
        this.showMessage('info', '🎯 Optimizing...', 'Finding optimal parameters for maximum efficiency');
        
        this.animation.optimize();
        
        setTimeout(() => {
            this.showMessage('success', '✅ Optimization Complete', 'Parameters optimized for maximum efficiency');
        }, 2000);
    }
    
    startSystem(systemName) {
        console.log(`🔧 Starting ${systemName} system...`);
        
        const statusElement = document.getElementById(`${systemName}Status`);
        if (statusElement) {
            statusElement.textContent = 'starting';
            statusElement.className = 'status-value starting';
            
            setTimeout(() => {
                statusElement.textContent = 'running';
                statusElement.className = 'status-value running';
            }, 1000);
        }
        
        this.showMessage('success', `${systemName.charAt(0).toUpperCase() + systemName.slice(1)} Started`, `${systemName} system is now operational`);
    }
    
    stopSystem(systemName) {
        console.log(`🔧 Stopping ${systemName} system...`);
        
        const statusElement = document.getElementById(`${systemName}Status`);
        if (statusElement) {
            statusElement.textContent = 'stopping';
            statusElement.className = 'status-value stopping';
            
            setTimeout(() => {
                statusElement.textContent = 'offline';
                statusElement.className = 'status-value offline';
            }, 1000);
        }
        
        this.showMessage('info', `${systemName.charAt(0).toUpperCase() + systemName.slice(1)} Stopped`, `${systemName} system has been shut down`);
    }
    
    rampUpElectrolysis() {
        console.log('📈 Ramping up electrolysis...');
        this.showMessage('info', '📈 Ramping Up', 'Gradually increasing electrolysis power');
        
        // Simulate ramp up by gradually increasing current density
        if (this.animation) {
            const currentSlider = document.getElementById('current-density-slider');
            if (currentSlider) {
                const startValue = parseFloat(currentSlider.value);
                const targetValue = Math.min(2.0, startValue + 0.5);
                const steps = 20;
                const increment = (targetValue - startValue) / steps;
                
                let step = 0;
                const rampInterval = setInterval(() => {
                    step++;
                    const newValue = startValue + (increment * step);
                    currentSlider.value = newValue;
                    currentSlider.dispatchEvent(new Event('input'));
                    
                    if (step >= steps) {
                        clearInterval(rampInterval);
                        this.showMessage('success', '✅ Ramp Up Complete', 'Electrolysis at target power level');
                    }
                }, 100);
            }
        }
    }
    
    updateSystemStatus(status) {
        const systemStatus = document.getElementById('system-status');
        if (systemStatus) {
            switch (status) {
                case 'running':
                    systemStatus.textContent = 'Running';
                    systemStatus.className = 'status-indicator running';
                    break;
                case 'stopped':
                    systemStatus.textContent = 'Stopped';
                    systemStatus.className = 'status-indicator stopped';
                    break;
                case 'emergency':
                    systemStatus.textContent = 'EMERGENCY STOP';
                    systemStatus.className = 'status-indicator emergency';
                    break;
            }
        }
        
        // Update time display
        const timeElement = document.getElementById('system-time');
        if (timeElement) {
            const now = new Date();
            timeElement.textContent = now.toLocaleTimeString();
        }
    }
    
    showParameterFeedback(parameter, value) {
        // Visual feedback for parameter changes
        console.log(`📊 ${parameter} changed to ${value}`);
        
        // You could add visual effects here like highlighting the changed parameter
        const element = document.querySelector(`[data-parameter="${parameter}"]`);
        if (element) {
            element.style.animation = 'parameter-highlight 0.5s ease-in-out';
            setTimeout(() => {
                element.style.animation = '';
            }, 500);
        }
    }
    
    showMessage(type, title, message) {
        // Simple message system
        console.log(`${type.toUpperCase()}: ${title} - ${message}`);
        
        // You could integrate with existing alert system here
        const alertContainer = document.getElementById('alert-container');
        if (alertContainer) {
            const alert = document.createElement('div');
            alert.className = `alert alert-${type}`;
            alert.innerHTML = `
                <strong>${title}</strong><br>
                ${message}
                <button class="alert-close" onclick="this.parentElement.remove()">&times;</button>
            `;
            alertContainer.appendChild(alert);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (alert.parentElement) {
                    alert.remove();
                }
            }, 5000);
        }
    }
}

// CSS for visual effects
const integratedStyles = `
<style>
@keyframes emergency-flash {
    0%, 100% { background-color: transparent; }
    50% { background-color: rgba(231, 76, 60, 0.1); }
}

@keyframes parameter-highlight {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); box-shadow: 0 0 10px rgba(74, 144, 226, 0.5); }
    100% { transform: scale(1); }
}

.animation-container {
    border: 2px solid #4a90e2 !important;
    border-radius: 10px !important;
    background: #000 !important;
    box-shadow: 0 4px 15px rgba(74, 144, 226, 0.3);
}

.status-value.running { color: #2ecc71; }
.status-value.starting { color: #f39c12; }
.status-value.stopping { color: #e67e22; }
.status-value.offline { color: #95a5a6; }

.alert {
    position: relative;
    padding: 15px;
    margin: 10px 0;
    border-radius: 5px;
    animation: slideIn 0.3s ease-in-out;
}

.alert-success { background: rgba(46, 204, 113, 0.1); border-left: 4px solid #2ecc71; color: #2ecc71; }
.alert-info { background: rgba(52, 152, 219, 0.1); border-left: 4px solid #3498db; color: #3498db; }
.alert-error { background: rgba(231, 76, 60, 0.1); border-left: 4px solid #e74c3c; color: #e74c3c; }

.alert-close {
    position: absolute;
    top: 5px;
    right: 10px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: inherit;
}

@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', integratedStyles);

// Initialize when DOM is ready - DISABLED FOR VERCEL
// Using simplified initialization in index.html instead
/*
let integratedController;

document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other scripts to load
    setTimeout(() => {
        integratedController = new IntegratedFactoryController();
        
        // Make globally accessible
        window.integratedController = integratedController;
        
        console.log('🎉 Integrated Hydrogen Factory System Ready!');
        console.log('💡 Controls: Spacebar=Start/Stop, O=Optimize, E=Emergency');
        
    }, 500);
});
*/

// Export for external access
window.IntegratedFactoryController = IntegratedFactoryController;

