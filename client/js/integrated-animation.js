/**
 * Integrated Animation System for Hydrogen Factory
 * Simple animations for each system tab with real-time feedback
 */

class IntegratedHydrogenAnimation {
    constructor() {
        this.isRunning = false;
        this.time = 0;
        this.frameCount = 0;
        this.lastFpsUpdate = Date.now();
        
        // Physics-based parameters
        this.parameters = {
            voltage: 1.8,
            currentDensity: 1.0,
            temperature: 70,
            pressure: 15,
            waterQuality: 1.0,
            electrodeArea: 100,
            cellCount: 12,
            waterTreatmentLevel: 0.5
        };
        
        // Constants for real calculations
        this.constants = {
            faradayConstant: 96485,
            gasConstant: 8.314,
            theoreticalVoltage: 1.229
        };
        
        // Animation canvases for each system
        this.canvases = {};
        this.contexts = {};
        
        // Particle systems for each tab
        this.particles = {
            water: [],
            electrolysis: [],
            purification: [],
            compression: [],
            storage: []
        };
        
        // Current active tab
        this.activeTab = 'overview';
        
        this.initializeCanvases();
        this.setupTabSwitching();
    }
    
    initializeCanvases() {
        console.log('🎨 Initializing integrated animation canvases...');
        
        // Wait for DOM to be ready
        setTimeout(() => {
            // Create canvas for each system tab
            const tabs = ['water', 'electrolysis', 'purification', 'compression', 'storage'];
            
            tabs.forEach(tab => {
                const tabContent = document.getElementById(`${tab}-tab`);
                if (tabContent) {
                    // Create animation container
                    const animationContainer = document.createElement('div');
                    animationContainer.className = 'animation-container';
                    animationContainer.style.cssText = `
                        width: 100%;
                        height: 400px;
                        background: #000;
                        border: 2px solid #4a90e2;
                        border-radius: 10px;
                        margin: 20px 0;
                        position: relative;
                        overflow: hidden;
                        box-shadow: 0 4px 15px rgba(74, 144, 226, 0.3);
                    `;
                    
                    // Create canvas
                    const canvas = document.createElement('canvas');
                    canvas.id = `${tab}-animation-canvas`;
                    canvas.width = 800;
                    canvas.height = 400;
                    canvas.style.width = '100%';
                    canvas.style.height = '100%';
                    canvas.style.display = 'block';
                    
                    animationContainer.appendChild(canvas);
                    
                    // Add title
                    const title = document.createElement('div');
                    title.style.cssText = `
                        position: absolute;
                        top: 10px;
                        left: 15px;
                        color: white;
                        font-weight: bold;
                        font-size: 14px;
                        z-index: 1;
                        text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
                    `;
                    title.textContent = `🎬 ${tab.charAt(0).toUpperCase() + tab.slice(1)} Animation`;
                    animationContainer.appendChild(title);
                    
                    // Insert at the beginning of the tab content
                    const firstChild = tabContent.firstElementChild;
                    if (firstChild) {
                        tabContent.insertBefore(animationContainer, firstChild.nextSibling);
                    } else {
                        tabContent.appendChild(animationContainer);
                    }
                    
                    this.canvases[tab] = canvas;
                    this.contexts[tab] = canvas.getContext('2d');
                    
                    console.log(`✅ Canvas created for ${tab} tab`);
                } else {
                    console.warn(`⚠️ Tab content not found for ${tab}`);
                }
            });
            
            console.log('✅ Animation canvases initialized');
            
            // Start animation loop immediately
            this.start();
        }, 1000);
    }
    
    setupTabSwitching() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.activeTab = tab;
                console.log(`🎯 Switched to ${tab} tab`);
            });
        });
    }
    
    start() {
        this.isRunning = true;
        this.animate();
        console.log('🚀 Integrated animation started');
        
        // Update status displays
        document.getElementById('system-status').textContent = 'Running';
        if (document.getElementById('factory-status')) {
            document.getElementById('factory-status').textContent = 'Running';
            document.getElementById('factory-status').className = 'status running';
        }
    }
    
    stop() {
        this.isRunning = false;
        console.log('⏹️ Integrated animation stopped');
        
        // Update status displays
        document.getElementById('system-status').textContent = 'Stopped';
        if (document.getElementById('factory-status')) {
            document.getElementById('factory-status').textContent = 'Stopped';
            document.getElementById('factory-status').className = 'status stopped';
        }
    }
    
    emergencyStop() {
        this.stop();
        document.getElementById('system-status').textContent = 'EMERGENCY STOP';
        if (document.getElementById('factory-status')) {
            document.getElementById('factory-status').textContent = 'EMERGENCY STOP';
            document.getElementById('factory-status').className = 'status emergency';
        }
        console.log('🚨 Emergency stop activated');
    }
    
    animate() {
        if (!this.isRunning) return;
        
        this.time += 0.016;
        this.updateMetrics();
        this.updateAllAnimations();
        this.updateFPS();
        
        requestAnimationFrame(() => this.animate());
    }
    
    updateMetrics() {
        // Real electrochemical calculations
        const tempFactor = 1 + (this.parameters.temperature - 25) * 0.002;
        const pressureFactor = 1 + (this.parameters.pressure - 1) * 0.01;
        const currentFactor = 1 - (this.parameters.currentDensity - 0.5) * 0.1;
        const voltageFactor = 1 - (this.parameters.voltage - 1.23) * 0.15;
        
        // Calculate efficiency
        const efficiency = Math.max(60, Math.min(95, 75 * tempFactor * pressureFactor * currentFactor * voltageFactor));
        
        // Faraday's law for production
        const current = this.parameters.currentDensity * this.parameters.electrodeArea;
        const h2Production = (current * 3600 * efficiency / 100) / (2 * this.constants.faradayConstant) * 22.4;
        const o2Production = h2Production / 2;
        
        // Power calculation
        const cellVoltage = this.constants.theoreticalVoltage + (this.parameters.currentDensity * 0.3) + (this.parameters.voltage - 1.23);
        const powerInput = (cellVoltage * current * this.parameters.cellCount) / 1000;
        
        // Energy cost
        const energyCost = (powerInput / h2Production) * 0.12;
        
        // System health
        const tempStress = Math.abs(this.parameters.temperature - 70) / 50;
        const systemHealth = Math.max(70, 100 - (tempStress * 20));
        
        // Update overview metrics
        this.updateElement('production-rate', h2Production.toFixed(2) + ' Nm³/hr');
        this.updateElement('system-efficiency', efficiency.toFixed(1) + '%');
        this.updateElement('power-consumption', powerInput.toFixed(1) + ' kW');
        
        // Update electrolysis metrics
        this.updateElement('h2-production', h2Production.toFixed(2) + ' Nm³/hr');
        this.updateElement('o2-production', o2Production.toFixed(2) + ' Nm³/hr');
        this.updateElement('power-input', powerInput.toFixed(1) + ' kW');
        this.updateElement('cell-voltage', cellVoltage.toFixed(3) + 'V');
        this.updateElement('energy-cost', '$' + energyCost.toFixed(2) + '/Nm³');
        this.updateElement('system-health', systemHealth.toFixed(0) + '%');
        this.updateElement('faradaic-efficiency', (95 + Math.random() * 4).toFixed(1) + '%');
        this.updateElement('current-efficiency', (92 + Math.random() * 6).toFixed(1) + '%');
        this.updateElement('thermal-efficiency', (85 + Math.random() * 10).toFixed(1) + '%');
        
        // Update advanced metrics
        this.updateElement('activation-overpotential', (150 + Math.random() * 50).toFixed(0) + ' mV');
        this.updateElement('ohmic-overpotential', (100 + Math.random() * 30).toFixed(0) + ' mV');
        this.updateElement('concentration-overpotential', (50 + Math.random() * 20).toFixed(0) + ' mV');
        this.updateElement('specific-energy', (powerInput / h2Production).toFixed(1) + ' kWh/Nm³');
        
        // Update parameter displays
        this.updateElement('temperature-current', this.parameters.temperature.toFixed(1) + '°C');
        this.updateElement('pressure-current', this.parameters.pressure.toFixed(1) + ' bar');
        this.updateElement('voltage-current', this.parameters.voltage.toFixed(2) + 'V');
        this.updateElement('current-density-current', this.parameters.currentDensity.toFixed(2) + ' A/cm²');
        
        // Update water system
        const waterQuality = 8 + this.parameters.waterTreatmentLevel * 10;
        const flowRate = 1000 * (1 - this.parameters.waterTreatmentLevel * 0.3);
        this.updateElement('water-resistivity', waterQuality.toFixed(1) + ' MΩ·cm');
        this.updateElement('water-flow-rate', flowRate.toFixed(0) + ' L/hr');
        this.updateElement('raw-water-tds', (500 - this.parameters.waterTreatmentLevel * 450).toFixed(0) + ' ppm');
        this.updateElement('process-water-tds', (50 - this.parameters.waterTreatmentLevel * 45).toFixed(1) + ' ppm');
    }
    
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
    
    updateAllAnimations() {
        // Update particles and animations for each system
        this.updateWaterAnimation();
        this.updateElectrolysisAnimation();
        this.updatePurificationAnimation();
        this.updateCompressionAnimation();
        this.updateStorageAnimation();
    }
    
    updateWaterAnimation() {
        const canvas = this.canvases.water;
        const ctx = this.contexts.water;
        if (!canvas || !ctx) return;
        
        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw water treatment system
        this.drawWaterTreatmentSystem(ctx, canvas.width, canvas.height);
        
        // Generate water particles
        if (Math.random() < 0.05) {
            this.particles.water.push({
                x: 50,
                y: 150 + Math.random() * 50,
                vx: 2 + Math.random(),
                vy: (Math.random() - 0.5) * 0.5,
                size: 2 + Math.random() * 2,
                life: 200,
                type: 'water'
            });
        }
        
        // Update and draw particles
        this.particles.water = this.particles.water.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
            
            // Draw particle
            ctx.fillStyle = '#74b9ff';
            ctx.globalAlpha = p.life / 200;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
            
            return p.life > 0 && p.x < canvas.width;
        });
        
        // Draw system info
        ctx.fillStyle = '#fff';
        ctx.font = '16px Arial';
        ctx.fillText(`💧 Water Treatment - ${this.particles.water.length} particles`, 10, 25);
    }
    
    drawWaterTreatmentSystem(ctx, width, height) {
        // Raw water tank
        ctx.fillStyle = '#3498db';
        ctx.fillRect(20, 100, 80, 100);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(20, 100, 80, 100);
        
        // Treatment stages
        for (let i = 0; i < 3; i++) {
            const x = 150 + i * 100;
            const active = this.parameters.waterTreatmentLevel > i * 0.33;
            
            ctx.fillStyle = active ? '#2ecc71' : '#7f8c8d';
            ctx.fillRect(x, 120, 60, 60);
            ctx.strokeRect(x, 120, 60, 60);
            
            if (active) {
                // Treatment activity
                const intensity = Math.min(1, (this.parameters.waterTreatmentLevel - i * 0.33) * 3);
                ctx.fillStyle = `rgba(46, 204, 113, ${intensity * 0.5})`;
                ctx.fillRect(x + 5, 125, 50, 50);
            }
        }
        
        // Pure water output
        ctx.fillStyle = '#00d4aa';
        ctx.fillRect(width - 100, 120, 60, 60);
        ctx.strokeRect(width - 100, 120, 60, 60);
        
        // Pipes
        ctx.strokeStyle = '#4a90e2';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(100, 150);
        ctx.lineTo(width - 40, 150);
        ctx.stroke();
        
        // Labels
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.fillText('Raw', 30, 95);
        ctx.fillText('RO', 165, 115);
        ctx.fillText('DI', 265, 115);
        ctx.fillText('UF', 365, 115);
        ctx.fillText('Pure', width - 90, 115);
    }
    
    updateElectrolysisAnimation() {
        const canvas = this.canvases.electrolysis;
        const ctx = this.contexts.electrolysis;
        if (!canvas || !ctx) return;
        
        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw electrolyzer
        this.drawElectrolyzerSystem(ctx, canvas.width, canvas.height);
        
        // Generate bubbles based on production
        if (Math.random() < this.parameters.currentDensity * 0.02) {
            this.particles.electrolysis.push({
                x: 200 + Math.random() * 400,
                y: 250,
                type: Math.random() < 0.67 ? 'hydrogen' : 'oxygen',
                size: 2 + Math.random() * 3,
                life: 100,
                vy: -1 - Math.random() * 2
            });
        }
        
        // Update and draw bubbles
        this.particles.electrolysis = this.particles.electrolysis.filter(bubble => {
            bubble.y += bubble.vy;
            bubble.life--;
            
            // Draw bubble
            const color = bubble.type === 'hydrogen' ? '#3498db' : '#e74c3c';
            ctx.fillStyle = color;
            ctx.globalAlpha = bubble.life / 100;
            ctx.beginPath();
            ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
            
            return bubble.life > 0 && bubble.y > 0;
        });
        
        // Draw system info
        ctx.fillStyle = '#fff';
        ctx.font = '16px Arial';
        ctx.fillText(`⚡ Electrolysis Stack - ${this.particles.electrolysis.length} bubbles`, 10, 25);
    }
    
    drawElectrolyzerSystem(ctx, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Main tank
        ctx.strokeStyle = '#4a90e2';
        ctx.lineWidth = 3;
        ctx.strokeRect(centerX - 200, centerY - 75, 400, 150);
        
        // Electrolyte
        ctx.fillStyle = 'rgba(52, 152, 219, 0.3)';
        ctx.fillRect(centerX - 195, centerY - 70, 390, 140);
        
        // Electrodes
        for (let i = 0; i < 6; i++) {
            const x = centerX - 150 + i * 60;
            
            // Cathode
            ctx.fillStyle = '#8e44ad';
            ctx.fillRect(x - 5, centerY - 60, 10, 120);
            
            // Anode  
            ctx.fillStyle = '#e67e22';
            ctx.fillRect(x + 15, centerY - 60, 10, 120);
            
            // Electric activity
            if (this.isRunning && Math.random() < this.parameters.currentDensity * 0.1) {
                ctx.strokeStyle = '#f1c40f';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x, centerY);
                ctx.lineTo(x + 20, centerY);
                ctx.stroke();
            }
        }
        
        // Gas outlets
        ctx.fillStyle = '#3498db';
        ctx.fillRect(centerX - 220, centerY - 90, 20, 30);
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(centerX + 200, centerY - 90, 20, 30);
        
        // Labels
        ctx.fillStyle = '#fff';
        ctx.font = '14px Arial';
        ctx.fillText('H₂ Out', centerX - 240, centerY - 65);
        ctx.fillText('O₂ Out', centerX + 180, centerY - 65);
    }
    
    updatePurificationAnimation() {
        const canvas = this.canvases.purification;
        const ctx = this.contexts.purification;
        if (!canvas || !ctx) return;
        
        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw purification system
        this.drawPurificationSystem(ctx, canvas.width, canvas.height);
        
        // Generate purification particles
        if (Math.random() < 0.03) {
            this.particles.purification.push({
                x: 50,
                y: 120 + Math.random() * 60,
                vx: 1.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: 1 + Math.random() * 2,
                life: 150,
                type: 'impurity'
            });
        }
        
        // Update particles
        this.particles.purification = this.particles.purification.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
            
            // Draw particle
            ctx.fillStyle = p.type === 'impurity' ? '#e74c3c' : '#2ecc71';
            ctx.globalAlpha = p.life / 150;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
            
            return p.life > 0 && p.x < canvas.width;
        });
        
        // Draw system info
        ctx.fillStyle = '#fff';
        ctx.font = '16px Arial';
        ctx.fillText(`🔬 Purification - ${this.particles.purification.length} particles`, 10, 25);
    }
    
    drawPurificationSystem(ctx, width, height) {
        // Purification vessels
        for (let i = 0; i < 4; i++) {
            const x = 100 + i * 150;
            const y = 100;
            
            ctx.fillStyle = '#6c5ce7';
            ctx.fillRect(x, y, 80, 100);
            ctx.strokeStyle = '#fff';
            ctx.strokeRect(x, y, 80, 100);
            
            // Purification activity
            if (Math.random() < 0.1) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.fillRect(x + 10, y + 10, 60, 80);
            }
            
            // Labels
            ctx.fillStyle = '#fff';
            ctx.font = '12px Arial';
            const stages = ['Dry', 'Cool', 'Filter', 'Pure'];
            ctx.fillText(stages[i], x + 20, y - 10);
        }
        
        // Connection pipes
        ctx.strokeStyle = '#4a90e2';
        ctx.lineWidth = 3;
        for (let i = 0; i < 3; i++) {
            const x1 = 180 + i * 150;
            const x2 = 250 + i * 150;
            ctx.beginPath();
            ctx.moveTo(x1, 150);
            ctx.lineTo(x2, 150);
            ctx.stroke();
        }
    }
    
    updateCompressionAnimation() {
        const canvas = this.canvases.compression;
        const ctx = this.contexts.compression;
        if (!canvas || !ctx) return;
        
        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw compression system
        this.drawCompressionSystem(ctx, canvas.width, canvas.height);
        
        // Generate compression particles
        if (Math.random() < 0.04) {
            this.particles.compression.push({
                x: 50,
                y: 140 + Math.random() * 20,
                vx: 2,
                vy: 0,
                size: 3 + Math.random() * 2,
                life: 120,
                pressure: 1 + Math.random() * 10
            });
        }
        
        // Update particles
        this.particles.compression = this.particles.compression.filter(p => {
            p.x += p.vx;
            p.pressure += 0.5;
            p.life--;
            
            // Compression effect - particles get smaller and faster
            p.size = Math.max(1, p.size * 0.995);
            p.vx += 0.01;
            
            // Draw particle
            ctx.fillStyle = `hsl(${p.pressure * 10}, 70%, 50%)`;
            ctx.globalAlpha = p.life / 120;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
            
            return p.life > 0 && p.x < canvas.width;
        });
        
        // Draw system info
        ctx.fillStyle = '#fff';
        ctx.font = '16px Arial';
        ctx.fillText(`⚡ Compression - ${this.particles.compression.length} particles`, 10, 25);
    }
    
    drawCompressionSystem(ctx, width, height) {
        // Compressor stages
        const stages = [
            { x: 100, pressure: '1 bar', color: '#3498db' },
            { x: 300, pressure: '50 bar', color: '#f39c12' },
            { x: 500, pressure: '200 bar', color: '#e74c3c' },
            { x: 700, pressure: '350 bar', color: '#9b59b6' }
        ];
        
        stages.forEach((stage, i) => {
            // Compressor body
            ctx.fillStyle = stage.color;
            ctx.fillRect(stage.x - 40, 120, 80, 60);
            ctx.strokeStyle = '#fff';
            ctx.strokeRect(stage.x - 40, 120, 80, 60);
            
            // Piston animation
            if (this.isRunning) {
                const pistonY = 140 + Math.sin(this.time * 5 + i) * 10;
                ctx.fillStyle = '#34495e';
                ctx.fillRect(stage.x - 10, pistonY, 20, 20);
            }
            
            // Pressure gauge
            ctx.beginPath();
            ctx.arc(stage.x, 100, 15, 0, Math.PI * 2);
            ctx.fillStyle = '#2c3e50';
            ctx.fill();
            ctx.stroke();
            
            // Labels
            ctx.fillStyle = '#fff';
            ctx.font = '12px Arial';
            ctx.fillText(stage.pressure, stage.x - 15, 95);
        });
        
        // Connection pipes
        ctx.strokeStyle = '#4a90e2';
        ctx.lineWidth = 4;
        for (let i = 0; i < 3; i++) {
            const x1 = 140 + i * 200;
            const x2 = 260 + i * 200;
            ctx.beginPath();
            ctx.moveTo(x1, 150);
            ctx.lineTo(x2, 150);
            ctx.stroke();
        }
    }
    
    updateStorageAnimation() {
        const canvas = this.canvases.storage;
        const ctx = this.contexts.storage;
        if (!canvas || !ctx) return;
        
        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw storage system
        this.drawStorageSystem(ctx, canvas.width, canvas.height);
        
        // Generate storage particles
        if (Math.random() < 0.02) {
            this.particles.storage.push({
                x: 50,
                y: 180 + Math.random() * 40,
                vx: 1,
                vy: -0.5,
                size: 2 + Math.random() * 2,
                life: 200,
                stored: false
            });
        }
        
        // Update particles
        this.particles.storage = this.particles.storage.filter(p => {
            if (!p.stored) {
                p.x += p.vx;
                p.y += p.vy;
                
                // Check if particle reaches storage tank
                if (p.x > 200 && p.x < 600 && p.y > 120 && p.y < 220) {
                    p.stored = true;
                    p.vx = 0;
                    p.vy = 0;
                }
            }
            
            p.life--;
            
            // Draw particle
            ctx.fillStyle = p.stored ? '#2ecc71' : '#3498db';
            ctx.globalAlpha = p.life / 200;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
            
            return p.life > 0;
        });
        
        // Draw system info
        ctx.fillStyle = '#fff';
        ctx.font = '16px Arial';
        ctx.fillText(`🛢️ Storage - ${this.particles.storage.filter(p => p.stored).length} stored`, 10, 25);
    }
    
    drawStorageSystem(ctx, width, height) {
        // Storage tanks
        for (let i = 0; i < 4; i++) {
            const x = 200 + i * 100;
            const y = 120;
            
            // Tank body
            ctx.fillStyle = '#34495e';
            ctx.fillRect(x, y, 80, 100);
            ctx.strokeStyle = '#fff';
            ctx.strokeRect(x, y, 80, 100);
            
            // Fill level (animated)
            const fillLevel = 0.3 + Math.sin(this.time * 0.5 + i) * 0.1;
            ctx.fillStyle = '#2ecc71';
            ctx.fillRect(x + 5, y + (95 - fillLevel * 90), 70, fillLevel * 90);
            
            // Pressure indicator
            ctx.fillStyle = '#f39c12';
            ctx.fillRect(x + 30, y - 20, 20, 15);
            
            // Tank label
            ctx.fillStyle = '#fff';
            ctx.font = '12px Arial';
            ctx.fillText(`T${i + 1}`, x + 35, y + 235);
            ctx.fillText(`${(fillLevel * 100).toFixed(0)}%`, x + 25, y + 250);
        }
        
        // Manifold
        ctx.strokeStyle = '#4a90e2';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(200, 180);
        ctx.lineTo(580, 180);
        ctx.stroke();
        
        // Inlet pipe
        ctx.beginPath();
        ctx.moveTo(50, 200);
        ctx.lineTo(200, 200);
        ctx.lineTo(200, 180);
        ctx.stroke();
    }
    
    updateFPS() {
        this.frameCount++;
        const now = Date.now();
        if (now - this.lastFpsUpdate >= 1000) {
            const fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsUpdate));
            this.updateElement('fps-display', fps + ' FPS');
            this.frameCount = 0;
            this.lastFpsUpdate = now;
        }
    }
    
    updateParameter(name, value) {
        this.parameters[name] = parseFloat(value);
        console.log(`📊 Parameter updated: ${name} = ${value}`);
    }
    
    optimize() {
        console.log('🎯 Optimizing parameters...');
        
        // Optimal parameters for maximum efficiency
        const optimal = {
            voltage: 1.6,
            currentDensity: 1.2,
            temperature: 70,
            pressure: 20,
            waterTreatmentLevel: 0.8
        };
        
        // Animate to optimal values
        Object.keys(optimal).forEach(param => {
            const slider = document.getElementById(param + '-slider');
            if (slider) {
                slider.value = optimal[param];
                slider.dispatchEvent(new Event('input'));
            }
            
            // Also check for alternative slider names
            const altSlider = document.getElementById('water-treatment-level');
            if (param === 'waterTreatmentLevel' && altSlider) {
                altSlider.value = optimal[param];
                altSlider.dispatchEvent(new Event('input'));
            }
        });
        
        setTimeout(() => {
            alert('🎯 Optimization complete! Parameters set for maximum efficiency.');
        }, 1000);
    }
}

// Global animation instance
let integratedAnimation = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    integratedAnimation = new IntegratedHydrogenAnimation();
    console.log('✅ Integrated animation system ready!');
});

// Export for global access
window.IntegratedHydrogenAnimation = IntegratedHydrogenAnimation;
