// 2D Factory Animation System
// Simple, creative 2D animations for hydrogen factory systems

class Factory2DAnimation {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.isInitialized = false;
        this.isRunning = false;
        this.animationId = null;
        
        // System states
        this.systems = {
            power: { status: 'offline', units: 0, power: 0 },
            water: { status: 'offline', flow: 0, quality: 0, treatmentLevel: 0.5 },
            electrolysis: { status: 'offline', production: 0, efficiency: 0 },
            purification: { status: 'offline', purity: 0, flow: 0 },
            compression: { status: 'offline', pressure: 0, stages: [1, 30, 700] },
            storage: { status: 'offline', level: 0, tanks: 10 }
        };
        
        // Animation properties
        this.time = 0;
        this.particles = [];
        this.bubbles = [];
        this.flows = [];
        this.focusedSystem = null;
        this.highlightedSystem = null;
        
        // Colors
        this.colors = {
            offline: '#666666',
            starting: '#ffaa00',
            running: '#00ff00',
            error: '#ff0000',
            hydrogen: '#4a90e2',
            oxygen: '#ff6b6b',
            water: '#74b9ff',
            power: '#fdcb6e',
            background: '#1a1a1a'
        };
    }
    
    async init() {
        try {
            console.log('🎨 Initializing 2D Factory Animation...');
            
            // Get or create canvas
            const viewport = document.getElementById('viewport');
            if (!viewport) {
                throw new Error('Viewport element not found');
            }
            
            // Clear viewport and create canvas
            viewport.innerHTML = '';
            this.canvas = document.createElement('canvas');
            this.canvas.width = viewport.clientWidth || 800;
            this.canvas.height = viewport.clientHeight || 600;
            this.canvas.style.background = this.colors.background;
            this.canvas.style.display = 'block';
            viewport.appendChild(this.canvas);
            
            console.log(`Canvas created: ${this.canvas.width}x${this.canvas.height}`);
            
            this.ctx = this.canvas.getContext('2d');
            if (!this.ctx) {
                throw new Error('Failed to get 2D rendering context');
            }
            
            // Setup resize handler
            window.addEventListener('resize', () => this.handleResize());
            
            this.isInitialized = true;
            
            // Start animation immediately to show the factory layout
            this.start();
            console.log('✅ 2D Factory Animation initialized and started');
            
        } catch (error) {
            console.error('❌ Failed to initialize 2D animation:', error);
            throw error;
        }
    }
    
    handleResize() {
        if (this.canvas) {
            const viewport = document.getElementById('viewport');
            this.canvas.width = viewport.clientWidth;
            this.canvas.height = viewport.clientHeight;
        }
    }
    
    // Update system status from simulation
    updateSystemStatus(systemName, status, metrics = {}) {
        if (this.systems[systemName]) {
            this.systems[systemName].status = status;
            Object.assign(this.systems[systemName], metrics);
        }
    }
    
    // Start animation loop
    start() {
        if (!this.isInitialized) return;
        
        this.isRunning = true;
        this.animate();
        console.log('🎬 Factory animation started');
    }
    
    // Stop animation loop
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        console.log('⏹️ Factory animation stopped');
    }
    
    // Main animation loop
    animate() {
        if (!this.isRunning) return;
        
        this.time += 0.016; // ~60fps
        this.update();
        this.render();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    // Update animation state
    update() {
        this.updateParticles();
        this.updateBubbles();
        this.updateFlows();
    }
    
    // Main render function
    render() {
        if (!this.ctx) return;
        
        // Clear canvas
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Test rectangle to ensure something is visible
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillRect(10, 100, 50, 30);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText('TEST', 15, 120);
        
        // Always draw factory layout and systems (even when offline)
        this.drawFactoryLayout();
        this.drawPowerSystem();
        this.drawWaterSystem();
        this.drawElectrolysisSystem();
        this.drawPurificationSystem();
        this.drawCompressionSystem();
        this.drawStorageSystem();
        
        // Draw connections and flows (only when running)
        if (this.isRunning) {
            this.drawSystemConnections();
            this.drawParticles();
            this.drawBubbles();
        }
        
        // Debug info
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(`Animation: ${this.isRunning ? 'Running' : 'Paused'}`, 10, 20);
        this.ctx.fillText(`Time: ${this.time.toFixed(1)}s`, 10, 35);
        this.ctx.fillText(`Canvas: ${this.canvas.width}x${this.canvas.height}`, 10, 50);
        this.ctx.fillText(`Systems: ${Object.keys(this.systems).length}`, 10, 65);
    }
    
    // Draw factory layout background
    drawFactoryLayout() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        // Draw factory floor
        this.ctx.strokeStyle = '#333333';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([5, 5]);
        
        // Grid lines
        for (let x = 0; x < w; x += 100) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, h);
            this.ctx.stroke();
        }
        
        for (let y = 0; y < h; y += 100) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(w, y);
            this.ctx.stroke();
        }
        
        this.ctx.setLineDash([]);
    }
    
    // Draw power system
    drawPowerSystem() {
        const x = 50, y = 50;
        const status = this.systems.power.status;
        const units = this.systems.power.units;
        const isHighlighted = this.highlightedSystem === 'power';
        
        // Highlight background
        if (isHighlighted) {
            this.ctx.fillStyle = 'rgba(253, 203, 110, 0.2)';
            this.ctx.fillRect(x - 10, y - 30, 270, 140);
            this.ctx.strokeStyle = this.colors.power;
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(x - 10, y - 30, 270, 140);
        }
        
        // Power generation units
        for (let i = 0; i < 4; i++) {
            const unitX = x + i * 60;
            const isActive = i < units;
            
            // Unit box
            this.ctx.fillStyle = isActive && status === 'running' ? this.colors.power : this.colors.offline;
            this.ctx.fillRect(unitX, y, 50, 80);
            
            // Unit border
            this.ctx.strokeStyle = status === 'running' ? this.colors.running : this.colors.offline;
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(unitX, y, 50, 80);
            
            // Power indicator
            if (isActive && status === 'running') {
                this.ctx.fillStyle = '#ffff00';
                const sparkle = Math.sin(this.time * 10 + i) * 0.5 + 0.5;
                this.ctx.globalAlpha = sparkle;
                this.ctx.fillRect(unitX + 20, y + 30, 10, 20);
                this.ctx.globalAlpha = 1;
            }
            
            // Unit number
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`${i + 1}`, unitX + 25, y + 50);
        }
        
        // System label
        this.ctx.fillStyle = isHighlighted ? this.colors.power : '#ffffff';
        this.ctx.font = isHighlighted ? '18px Arial' : '16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('⚡ Power System', x, y - 10);
        
        // Power output
        this.ctx.fillStyle = this.colors.power;
        this.ctx.font = '12px Arial';
        this.ctx.fillText(`${units * 300} kW`, x, y + 100);
    }
    
    // Draw water system with enhanced treatment visualization
    drawWaterSystem() {
        const x = 50, y = 200;
        const status = this.systems.water.status;
        const flow = this.systems.water.flow;
        const treatmentLevel = this.systems.water.treatmentLevel || 0.5;
        const quality = this.systems.water.quality || 0;
        const isHighlighted = this.highlightedSystem === 'water';
        
        // Highlight background
        if (isHighlighted) {
            this.ctx.fillStyle = 'rgba(116, 185, 255, 0.2)';
            this.ctx.fillRect(x - 10, y - 30, 280, 180);
            this.ctx.strokeStyle = this.colors.water;
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(x - 10, y - 30, 280, 180);
        }
        
        // Raw water inlet
        this.ctx.fillStyle = '#95a5a6';
        this.ctx.fillRect(x - 30, y + 50, 25, 20);
        this.ctx.strokeStyle = '#7f8c8d';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x - 30, y + 50, 25, 20);
        
        // Raw water flow animation
        if (status === 'running') {
            for (let i = 0; i < 3; i++) {
                const particleX = x - 25 + (this.time * 30 + i * 10) % 20;
                this.ctx.fillStyle = '#bdc3c7';
                this.ctx.globalAlpha = 0.6;
                this.ctx.beginPath();
                this.ctx.arc(particleX, y + 60, 1.5, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.globalAlpha = 1;
            }
        }
        
        // Main water tank with realistic water behavior
        this.ctx.fillStyle = status === 'running' ? this.colors.water : this.colors.offline;
        this.ctx.fillRect(x, y, 100, 120);
        
        // Tank border
        this.ctx.strokeStyle = status === 'running' ? this.colors.running : this.colors.offline;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, 100, 120);
        
        // Water level and quality visualization
        if (status === 'running') {
            const baseWaterLevel = y + 20; // Keep water level consistent
            const waterHeight = 100;
            
            // Water quality affects color (purer = clearer blue)
            const purityFactor = Math.min(1, quality / 18); // Normalize resistivity
            const waterColor = `rgba(116, 185, 255, ${0.4 + purityFactor * 0.4})`;
            this.ctx.fillStyle = waterColor;
            
            // Animated water surface with flow effect
            this.ctx.beginPath();
            this.ctx.moveTo(x, baseWaterLevel);
            for (let i = 0; i <= 100; i += 5) {
                const waveHeight = Math.sin(this.time * 4 + i * 0.15) * (2 + flow * 0.001);
                this.ctx.lineTo(x + i, baseWaterLevel + waveHeight);
            }
            this.ctx.lineTo(x + 100, y + 120);
            this.ctx.lineTo(x, y + 120);
            this.ctx.fill();
            
            // Water circulation patterns
            if (Math.random() < 0.1) {
                this.particles.push({
                    x: x + 10 + Math.random() * 80,
                    y: y + 30 + Math.random() * 80,
                    size: 1,
                    color: waterColor,
                    life: 60,
                    velocity: { 
                        x: (Math.random() - 0.5) * 0.5, 
                        y: (Math.random() - 0.5) * 0.3 
                    }
                });
            }
            
            // TDS particles (more particles = lower quality)
            const tdsLevel = Math.max(0, 1 - purityFactor);
            if (Math.random() < tdsLevel * 0.05) {
                this.particles.push({
                    x: x + Math.random() * 100,
                    y: y + 20 + Math.random() * 100,
                    size: 0.5 + Math.random(),
                    color: '#e74c3c',
                    life: 40,
                    velocity: { x: 0, y: 0.1 }
                });
            }
        }
        
        // Treatment stages with detailed visualization
        const stageNames = ['Pre-filter', 'RO Membrane', 'Polisher'];
        const stageColors = ['#3498db', '#2980b9', '#1abc9c'];
        
        for (let i = 0; i < 3; i++) {
            const filterX = x + 120 + i * 50;
            const filterActive = status === 'running' && treatmentLevel > (i * 0.33);
            
            // Filter housing
            this.ctx.fillStyle = filterActive ? stageColors[i] : this.colors.offline;
            this.ctx.fillRect(filterX, y + 30, 40, 80);
            this.ctx.strokeStyle = '#34495e';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(filterX, y + 30, 40, 80);
            
            // Filter media visualization
            if (filterActive) {
                const intensity = Math.max(0, Math.min(1, (treatmentLevel - i * 0.33) * 3));
                
                // Media particles
                for (let j = 0; j < 8; j++) {
                    this.ctx.fillStyle = '#ecf0f1';
                    this.ctx.globalAlpha = intensity * 0.8;
                    this.ctx.beginPath();
                    this.ctx.arc(
                        filterX + 8 + (j % 3) * 8,
                        y + 40 + Math.floor(j / 3) * 15,
                        2, 0, Math.PI * 2
                    );
                    this.ctx.fill();
                }
                this.ctx.globalAlpha = 1;
                
                // Treatment activity animation
                if (Math.random() < intensity * 0.1) {
                    this.particles.push({
                        x: filterX + 20,
                        y: y + 50 + Math.random() * 40,
                        size: 1,
                        color: stageColors[i],
                        life: 30,
                        velocity: { x: 0, y: -1 }
                    });
                }
                
                // Efficiency indicator
                const efficiencyColor = intensity > 0.8 ? '#2ecc71' : intensity > 0.5 ? '#f39c12' : '#e74c3c';
                this.ctx.fillStyle = efficiencyColor;
                this.ctx.fillRect(filterX + 35, y + 35, 3, intensity * 40);
            }
            
            // Stage label
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '9px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(stageNames[i], filterX + 20, y + 125);
            
            // Flow connections
            if (i < 2 && filterActive) {
                this.ctx.strokeStyle = this.colors.water;
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.moveTo(filterX + 40, y + 70);
                this.ctx.lineTo(filterX + 50, y + 70);
                this.ctx.stroke();
                
                // Flow particles in connections
                if (Math.random() < 0.2) {
                    this.ctx.fillStyle = this.colors.water;
                    this.ctx.globalAlpha = 0.7;
                    this.ctx.beginPath();
                    this.ctx.arc(filterX + 45, y + 70, 1.5, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.globalAlpha = 1;
                }
            }
        }
        
        // Output pipe to electrolysis
        if (status === 'running') {
            this.ctx.strokeStyle = this.colors.water;
            this.ctx.lineWidth = 4;
            this.ctx.beginPath();
            this.ctx.moveTo(x + 270, y + 70);
            this.ctx.lineTo(x + 300, y + 70);
            this.ctx.lineTo(x + 300, y - 50);
            this.ctx.stroke();
            
            // Pure water flow to electrolysis
            const flowSpeed = flow * 0.001;
            if (Math.random() < flowSpeed) {
                this.ctx.fillStyle = '#1abc9c';
                this.ctx.globalAlpha = 0.8;
                this.ctx.beginPath();
                this.ctx.arc(x + 285, y + 70 - Math.random() * 120, 2, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.globalAlpha = 1;
            }
        }
        
        // System label with status
        this.ctx.fillStyle = isHighlighted ? this.colors.water : '#ffffff';
        this.ctx.font = isHighlighted ? '18px Arial' : '16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('💧 Water Treatment System', x, y - 10);
        
        // Real-time metrics display
        this.ctx.fillStyle = this.colors.water;
        this.ctx.font = '11px Arial';
        this.ctx.fillText(`Flow: ${flow.toFixed(0)} L/hr`, x, y + 140);
        this.ctx.fillText(`Treatment: ${(treatmentLevel * 100).toFixed(0)}%`, x, y + 155);
        if (quality > 0) {
            this.ctx.fillText(`Quality: ${quality.toFixed(1)} MΩ·cm`, x, y + 170);
        }
    }
    
    // Draw electrolysis system with enhanced animations
    drawElectrolysisSystem() {
        const x = 350, y = 50;
        const status = this.systems.electrolysis.status;
        const production = this.systems.electrolysis.production;
        const efficiency = this.systems.electrolysis.efficiency;
        const isHighlighted = this.highlightedSystem === 'electrolysis';
        const voltage = this.systems.electrolysis.voltage || 900;
        const current = this.systems.electrolysis.current || 1111;
        const temperature = this.systems.electrolysis.temperature || 70;
        
        // Highlight background
        if (isHighlighted) {
            this.ctx.fillStyle = 'rgba(74, 144, 226, 0.2)';
            this.ctx.fillRect(x - 20, y - 30, 200, 200);
            this.ctx.strokeStyle = this.colors.hydrogen;
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(x - 20, y - 30, 200, 200);
        }
        
        // Main electrolysis stack
        this.ctx.fillStyle = status === 'running' ? this.colors.hydrogen : this.colors.offline;
        this.ctx.fillRect(x, y, 160, 120);
        this.ctx.strokeStyle = status === 'running' ? this.colors.running : this.colors.offline;
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(x, y, 160, 120);
        
        // Electrolysis cells (4x3 grid) with detailed animations
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 4; col++) {
                const cellX = x + 5 + col * 37;
                const cellY = y + 5 + row * 35;
                
                // Individual cell
                this.ctx.fillStyle = status === 'running' ? '#2980b9' : '#34495e';
                this.ctx.fillRect(cellX, cellY, 32, 30);
                this.ctx.strokeStyle = '#ecf0f1';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(cellX, cellY, 32, 30);
                
                if (status === 'running') {
                    // Electrode animations based on current
                    const currentIntensity = Math.min(1, current / 1400);
                    
                    // Anode (positive) - red glow
                    this.ctx.fillStyle = '#e74c3c';
                    this.ctx.globalAlpha = 0.3 + currentIntensity * 0.4;
                    this.ctx.fillRect(cellX + 2, cellY + 5, 6, 20);
                    
                    // Cathode (negative) - blue glow
                    this.ctx.fillStyle = '#3498db';
                    this.ctx.fillRect(cellX + 24, cellY + 5, 6, 20);
                    this.ctx.globalAlpha = 1;
                    
                    // Electric current visualization
                    if (Math.random() < currentIntensity * 0.2) {
                        this.ctx.strokeStyle = '#f1c40f';
                        this.ctx.lineWidth = 2;
                        this.ctx.globalAlpha = 0.8;
                        this.ctx.beginPath();
                        this.ctx.moveTo(cellX + 8, cellY + 15);
                        this.ctx.lineTo(cellX + 24, cellY + 15);
                        this.ctx.stroke();
                        this.ctx.globalAlpha = 1;
                    }
                    
                    // Water molecules splitting animation
                    if (Math.random() < production * 0.001) {
                        // H₂O molecule
                        this.ctx.fillStyle = '#74b9ff';
                        this.ctx.beginPath();
                        this.ctx.arc(cellX + 16, cellY + 15, 2, 0, Math.PI * 2);
                        this.ctx.fill();
                    }
                    
                    // Hydrogen bubble generation (2/3 probability)
                    if (Math.random() < production * 0.0008) {
                        this.bubbles.push({
                            x: cellX + 26,
                            y: cellY + 30,
                            size: Math.random() * 2 + 1,
                            type: 'hydrogen',
                            life: 120,
                            velocity: { x: (Math.random() - 0.5) * 0.5, y: -1 - Math.random() }
                        });
                    }
                    
                    // Oxygen bubble generation (1/3 probability)
                    if (Math.random() < production * 0.0004) {
                        this.bubbles.push({
                            x: cellX + 6,
                            y: cellY + 30,
                            size: Math.random() * 1.5 + 0.5,
                            type: 'oxygen',
                            life: 100,
                            velocity: { x: (Math.random() - 0.5) * 0.5, y: -0.8 - Math.random() * 0.5 }
                        });
                    }
                    
                    // Temperature effect - heat waves
                    if (temperature > 75 && Math.random() < 0.1) {
                        this.particles.push({
                            x: cellX + 16,
                            y: cellY,
                            size: 1,
                            color: '#ff6b6b',
                            life: 30,
                            velocity: { x: (Math.random() - 0.5) * 0.3, y: -2 }
                        });
                    }
                }
                
                // Cell efficiency indicator
                if (status === 'running') {
                    const cellEfficiency = efficiency + (Math.random() - 0.5) * 5; // Slight variation
                    const efficiencyColor = cellEfficiency > 80 ? '#2ecc71' : cellEfficiency > 70 ? '#f39c12' : '#e74c3c';
                    this.ctx.fillStyle = efficiencyColor;
                    this.ctx.fillRect(cellX + 14, cellY + 26, 4, 2);
                }
            }
        }
        
        // Stack voltage and current indicators
        if (status === 'running') {
            // Voltage indicator
            this.ctx.fillStyle = '#f1c40f';
            this.ctx.font = '10px Arial';
            this.ctx.fillText(`${voltage}V`, x + 165, y + 20);
            
            // Current indicator
            this.ctx.fillStyle = '#e67e22';
            this.ctx.fillText(`${current.toFixed(0)}A`, x + 165, y + 35);
            
            // Temperature indicator
            const tempColor = temperature > 75 ? '#e74c3c' : temperature < 65 ? '#3498db' : '#2ecc71';
            this.ctx.fillStyle = tempColor;
            this.ctx.fillText(`${temperature.toFixed(1)}°C`, x + 165, y + 50);
        }
        
        // Gas collection pipes
        if (status === 'running') {
            // Hydrogen collection (top)
            this.ctx.strokeStyle = this.colors.hydrogen;
            this.ctx.lineWidth = 4;
            this.ctx.beginPath();
            this.ctx.moveTo(x + 40, y);
            this.ctx.lineTo(x + 40, y - 20);
            this.ctx.lineTo(x + 200, y - 20);
            this.ctx.stroke();
            
            // Oxygen collection (right side)
            this.ctx.strokeStyle = this.colors.oxygen;
            this.ctx.beginPath();
            this.ctx.moveTo(x + 160, y + 30);
            this.ctx.lineTo(x + 180, y + 30);
            this.ctx.stroke();
            
            // Flow indicators in pipes
            if (Math.random() < 0.3) {
                this.ctx.fillStyle = this.colors.hydrogen;
                this.ctx.globalAlpha = 0.7;
                this.ctx.beginPath();
                this.ctx.arc(x + 60 + Math.random() * 120, y - 20, 2, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.globalAlpha = 1;
            }
        }
        
        // System label with status
        this.ctx.fillStyle = isHighlighted ? this.colors.hydrogen : '#ffffff';
        this.ctx.font = isHighlighted ? '18px Arial' : '16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('⚡ Electrolysis Stack', x, y - 10);
        
        // Real-time metrics display
        this.ctx.fillStyle = this.colors.hydrogen;
        this.ctx.font = '11px Arial';
        this.ctx.fillText(`H₂ Production: ${production.toFixed(1)} Nm³/hr`, x, y + 140);
        this.ctx.fillText(`Overall Efficiency: ${efficiency.toFixed(1)}%`, x, y + 155);
        if (status === 'running') {
            this.ctx.fillText(`Power: ${((voltage * current) / 1000).toFixed(0)} kW`, x, y + 170);
        }
    }
    
    // Draw purification system with enhanced multi-stage filtering
    drawPurificationSystem() {
        const x = 600, y = 50;
        const status = this.systems.purification.status;
        const purity = this.systems.purification.purity || 95;
        const flow = this.systems.purification.flow || 0;
        const isHighlighted = this.highlightedSystem === 'purification';
        
        // Highlight background
        if (isHighlighted) {
            this.ctx.fillStyle = 'rgba(162, 155, 254, 0.2)';
            this.ctx.fillRect(x - 20, y - 30, 200, 200);
            this.ctx.strokeStyle = '#a29bfe';
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(x - 20, y - 30, 200, 200);
        }
        
        // Input hydrogen from electrolysis
        if (status === 'running') {
            this.ctx.strokeStyle = this.colors.hydrogen;
            this.ctx.lineWidth = 4;
            this.ctx.beginPath();
            this.ctx.moveTo(x - 30, y + 50);
            this.ctx.lineTo(x, y + 50);
            this.ctx.stroke();
            
            // Input flow particles
            if (Math.random() < flow * 0.01) {
                this.ctx.fillStyle = '#74b9ff';
                this.ctx.globalAlpha = 0.7;
                this.ctx.beginPath();
                this.ctx.arc(x - 15, y + 50, 2, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.globalAlpha = 1;
            }
        }
        
        // Purification stages with detailed visualization
        const stageNames = ['Moisture Sep.', 'Molecular Sieve', 'Final Polish'];
        const stageColors = ['#ff7675', '#74b9ff', '#a29bfe'];
        const stagePurities = [97, 99.5, 99.9];
        
        for (let i = 0; i < 3; i++) {
            const vesselX = x + i * 60;
            const stageActive = status === 'running';
            const stagePurity = Math.min(stagePurities[i], purity + (Math.random() - 0.5) * 2);
            
            // Vessel housing
            this.ctx.fillStyle = stageActive ? stageColors[i] : this.colors.offline;
            this.ctx.fillRect(vesselX, y, 50, 120);
            this.ctx.strokeStyle = '#34495e';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(vesselX, y, 50, 120);
            
            if (stageActive) {
                // Media bed visualization
                const mediaHeight = 80;
                const mediaY = y + 20;
                
                // Draw media particles based on stage type
                if (i === 0) { // Moisture separator - larger particles
                    for (let j = 0; j < 12; j++) {
                        this.ctx.fillStyle = '#ecf0f1';
                        this.ctx.globalAlpha = 0.8;
                        this.ctx.beginPath();
                        this.ctx.arc(
                            vesselX + 10 + (j % 3) * 10,
                            mediaY + Math.floor(j / 3) * 15,
                            3, 0, Math.PI * 2
                        );
                        this.ctx.fill();
                    }
                } else if (i === 1) { // Molecular sieve - medium particles
                    for (let j = 0; j < 20; j++) {
                        this.ctx.fillStyle = '#ddd';
                        this.ctx.globalAlpha = 0.7;
                        this.ctx.beginPath();
                        this.ctx.arc(
                            vesselX + 8 + (j % 4) * 8,
                            mediaY + Math.floor(j / 4) * 12,
                            2, 0, Math.PI * 2
                        );
                        this.ctx.fill();
                    }
                } else { // Final polish - fine particles
                    for (let j = 0; j < 30; j++) {
                        this.ctx.fillStyle = '#bdc3c7';
                        this.ctx.globalAlpha = 0.6;
                        this.ctx.beginPath();
                        this.ctx.arc(
                            vesselX + 6 + (j % 5) * 7,
                            mediaY + Math.floor(j / 5) * 10,
                            1, 0, Math.PI * 2
                        );
                        this.ctx.fill();
                    }
                }
                this.ctx.globalAlpha = 1;
                
                // Purification activity animation
                const activityRate = flow * 0.001;
                if (Math.random() < activityRate) {
                    // Impurity removal particles
                    this.particles.push({
                        x: vesselX + 25,
                        y: y + 30 + Math.random() * 60,
                        size: 1 + Math.random(),
                        color: i === 0 ? '#3498db' : i === 1 ? '#e74c3c' : '#f39c12', // Different impurities
                        life: 40,
                        velocity: { 
                            x: (Math.random() - 0.5) * 0.5, 
                            y: 0.5 + Math.random() * 0.5 
                        }
                    });
                }
                
                // Gas flow visualization through media
                if (Math.random() < 0.1) {
                    const purityColor = `rgba(162, 155, 254, ${0.3 + stagePurity / 200})`;
                    this.particles.push({
                        x: vesselX + 25,
                        y: y + 10,
                        size: 1.5,
                        color: purityColor,
                        life: 60,
                        velocity: { x: 0, y: 2 }
                    });
                }
                
                // Purity indicator bar
                const purityHeight = (stagePurity / 100) * 100;
                const purityColor = stagePurity > 99 ? '#2ecc71' : stagePurity > 98 ? '#f39c12' : '#e74c3c';
                this.ctx.fillStyle = purityColor;
                this.ctx.fillRect(vesselX + 45, y + 120 - purityHeight, 3, purityHeight);
                
                // Stage efficiency display
                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = '8px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(`${stagePurity.toFixed(1)}%`, vesselX + 25, y + 135);
                
                // Temperature indicator (higher stages run hotter)
                const stageTemp = 25 + i * 15;
                const tempColor = stageTemp > 50 ? '#e74c3c' : '#3498db';
                this.ctx.fillStyle = tempColor;
                this.ctx.fillRect(vesselX + 2, y + 2, 4, 2);
                
                // Pressure drop visualization
                const pressureDrop = i * 2; // Each stage causes pressure drop
                for (let p = 0; p < pressureDrop; p++) {
                    this.ctx.fillStyle = '#95a5a6';
                    this.ctx.globalAlpha = 0.5;
                    this.ctx.fillRect(vesselX + 20 + p * 3, y - 5, 2, 3);
                    this.ctx.globalAlpha = 1;
                }
            }
            
            // Inter-stage connections
            if (i < 2 && stageActive) {
                this.ctx.strokeStyle = this.colors.hydrogen;
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.moveTo(vesselX + 50, y + 60);
                this.ctx.lineTo(vesselX + 60, y + 60);
                this.ctx.stroke();
                
                // Flow particles between stages
                if (Math.random() < 0.3) {
                    const flowPurity = Math.min(100, purity + (Math.random() - 0.5) * 5);
                    const flowColor = `rgba(74, 144, 226, ${0.4 + flowPurity / 200})`;
                    this.ctx.fillStyle = flowColor;
                    this.ctx.globalAlpha = 0.8;
                    this.ctx.beginPath();
                    this.ctx.arc(vesselX + 55, y + 60, 1.5, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.globalAlpha = 1;
                }
            }
            
            // Stage label
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '9px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(stageNames[i], vesselX + 25, y + 150);
        }
        
        // Output to compression
        if (status === 'running') {
            this.ctx.strokeStyle = '#a29bfe';
            this.ctx.lineWidth = 4;
            this.ctx.beginPath();
            this.ctx.moveTo(x + 180, y + 60);
            this.ctx.lineTo(x + 220, y + 60);
            this.ctx.stroke();
            
            // Pure hydrogen output particles
            if (Math.random() < flow * 0.008) {
                this.ctx.fillStyle = '#a29bfe';
                this.ctx.globalAlpha = 0.9;
                this.ctx.beginPath();
                this.ctx.arc(x + 200, y + 60, 2.5, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.globalAlpha = 1;
            }
        }
        
        // System label with status
        this.ctx.fillStyle = isHighlighted ? '#a29bfe' : '#ffffff';
        this.ctx.font = isHighlighted ? '18px Arial' : '16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('🔬 H₂ Purification System', x, y - 10);
        
        // Real-time metrics display
        this.ctx.fillStyle = '#a29bfe';
        this.ctx.font = '11px Arial';
        this.ctx.fillText(`Purity: ${purity.toFixed(1)}%`, x, y + 170);
        this.ctx.fillText(`Flow: ${flow.toFixed(1)} Nm³/hr`, x, y + 185);
        if (status === 'running') {
            const efficiency = Math.min(100, purity - 90) * 10; // Convert purity to efficiency %
            this.ctx.fillText(`Efficiency: ${efficiency.toFixed(1)}%`, x, y + 200);
        }
    }
    
    // Draw compression system with multi-stage compression visualization
    drawCompressionSystem() {
        const x = 350, y = 250;
        const status = this.systems.compression.status;
        const pressure = this.systems.compression.pressure || 350;
        const stages = this.systems.compression.stages || [1, 30, 700];
        const isHighlighted = this.highlightedSystem === 'compression';
        const flow = this.systems.compression.flow || 0;
        
        // Highlight background
        if (isHighlighted) {
            this.ctx.fillStyle = 'rgba(253, 203, 110, 0.2)';
            this.ctx.fillRect(x - 20, y - 50, 280, 180);
            this.ctx.strokeStyle = '#fdcb6e';
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(x - 20, y - 50, 280, 180);
        }
        
        // Input from purification
        if (status === 'running') {
            this.ctx.strokeStyle = '#a29bfe';
            this.ctx.lineWidth = 4;
            this.ctx.beginPath();
            this.ctx.moveTo(x - 30, y + 40);
            this.ctx.lineTo(x, y + 40);
            this.ctx.stroke();
            
            // Input flow particles
            if (Math.random() < flow * 0.01) {
                this.ctx.fillStyle = '#a29bfe';
                this.ctx.globalAlpha = 0.7;
                this.ctx.beginPath();
                this.ctx.arc(x - 15, y + 40, 2, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.globalAlpha = 1;
            }
        }
        
        // Multi-stage compression system
        const stageNames = ['LP Stage', 'MP Stage', 'HP Stage'];
        const stageColors = ['#74b9ff', '#fdcb6e', '#e17055'];
        const stagePressures = [30, 150, 350];
        
        for (let i = 0; i < 3; i++) {
            const compX = x + i * 85;
            const size = 70 - i * 5; // Slightly smaller for higher stages
            const stageActive = status === 'running';
            const stagePressure = stagePressures[i];
            
            // Compressor housing
            this.ctx.fillStyle = stageActive ? stageColors[i] : this.colors.offline;
            this.ctx.fillRect(compX, y, size, 90);
            this.ctx.strokeStyle = '#2d3436';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(compX, y, size, 90);
            
            if (stageActive) {
                // Piston/impeller animation with different speeds
                const pistonSpeed = 3 + i * 2; // Higher stages run faster
                const pistonY = y + 25 + Math.sin(this.time * pistonSpeed) * 8;
                
                // Piston
                this.ctx.fillStyle = '#34495e';
                this.ctx.fillRect(compX + size/4, pistonY, size/2, 12);
                
                // Connecting rod
                this.ctx.strokeStyle = '#7f8c8d';
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.moveTo(compX + size/2, pistonY + 6);
                this.ctx.lineTo(compX + size/2, y + 60);
                this.ctx.stroke();
                
                // Crankshaft
                const crankAngle = this.time * pistonSpeed;
                const crankRadius = 8;
                this.ctx.fillStyle = '#95a5a6';
                this.ctx.beginPath();
                this.ctx.arc(compX + size/2, y + 65, 6, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Flywheel
                this.ctx.strokeStyle = '#7f8c8d';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(compX + size/2, y + 65, 15, 0, Math.PI * 2);
                this.ctx.stroke();
                
                // Heat generation visualization (higher stages get hotter)
                const heatGeneration = i * 0.02;
                if (Math.random() < heatGeneration) {
                    this.particles.push({
                        x: compX + size/2,
                        y: y,
                        size: 1,
                        color: '#e74c3c',
                        life: 30,
                        velocity: { x: (Math.random() - 0.5) * 0.5, y: -2 }
                    });
                }
                
                // Compression work visualization
                if (Math.random() < flow * 0.002) {
                    // Gas compression particles
                    this.particles.push({
                        x: compX + size/2,
                        y: y + 45,
                        size: 1.5,
                        color: stageColors[i],
                        life: 40,
                        velocity: { 
                            x: (Math.random() - 0.5) * 0.3, 
                            y: (Math.random() - 0.5) * 0.3 
                        }
                    });
                }
                
                // Vibration effects (more vibration at higher pressures)
                if (i > 0 && Math.random() < 0.05) {
                    const vibration = i * 0.5;
                    this.ctx.fillStyle = '#95a5a6';
                    this.ctx.globalAlpha = 0.3;
                    this.ctx.fillRect(
                        compX + (Math.random() - 0.5) * vibration,
                        y + (Math.random() - 0.5) * vibration,
                        size, 90
                    );
                    this.ctx.globalAlpha = 1;
                }
            }
            
            // Pressure gauge with realistic needle movement
            const gaugeX = compX + size/2;
            const gaugeY = y - 25;
            
            // Gauge body
            this.ctx.fillStyle = '#ecf0f1';
            this.ctx.beginPath();
            this.ctx.arc(gaugeX, gaugeY, 18, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.strokeStyle = '#34495e';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // Gauge scale
            for (let tick = 0; tick <= 8; tick++) {
                const tickAngle = -Math.PI * 0.75 + (tick / 8) * Math.PI * 1.5;
                const tickX1 = gaugeX + Math.cos(tickAngle) * 12;
                const tickY1 = gaugeY + Math.sin(tickAngle) * 12;
                const tickX2 = gaugeX + Math.cos(tickAngle) * 15;
                const tickY2 = gaugeY + Math.sin(tickAngle) * 15;
                
                this.ctx.strokeStyle = '#7f8c8d';
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.moveTo(tickX1, tickY1);
                this.ctx.lineTo(tickX2, tickY2);
                this.ctx.stroke();
            }
            
            // Gauge needle
            if (stageActive) {
                const maxPressure = 400;
                const needleAngle = -Math.PI * 0.75 + (stagePressure / maxPressure) * Math.PI * 1.5;
                const needleLength = 12;
                
                this.ctx.strokeStyle = '#e74c3c';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(gaugeX, gaugeY);
                this.ctx.lineTo(
                    gaugeX + Math.cos(needleAngle) * needleLength,
                    gaugeY + Math.sin(needleAngle) * needleLength
                );
                this.ctx.stroke();
                
                // Center dot
                this.ctx.fillStyle = '#2d3436';
                this.ctx.beginPath();
                this.ctx.arc(gaugeX, gaugeY, 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            // Pressure reading
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '8px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`${stagePressure} bar`, gaugeX, y + 105);
            
            // Stage label
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '10px Arial';
            this.ctx.fillText(stageNames[i], gaugeX, y + 120);
            
            // Intercooler between stages (cooling system)
            if (i < 2 && stageActive) {
                const coolerX = compX + size + 5;
                const coolerY = y + 20;
                
                // Cooler body
                this.ctx.fillStyle = '#3498db';
                this.ctx.fillRect(coolerX, coolerY, 15, 50);
                this.ctx.strokeStyle = '#2980b9';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(coolerX, coolerY, 15, 50);
                
                // Cooling fins
                for (let fin = 0; fin < 5; fin++) {
                    this.ctx.strokeStyle = '#85C1E9';
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(coolerX - 2, coolerY + 5 + fin * 8);
                    this.ctx.lineTo(coolerX + 17, coolerY + 5 + fin * 8);
                    this.ctx.stroke();
                }
                
                // Cooling effect particles
                if (Math.random() < 0.1) {
                    this.particles.push({
                        x: coolerX + 7,
                        y: coolerY,
                        size: 1,
                        color: '#3498db',
                        life: 25,
                        velocity: { x: 0, y: -1.5 }
                    });
                }
            }
            
            // Inter-stage piping
            if (i < 2 && stageActive) {
                this.ctx.strokeStyle = stageColors[i];
                this.ctx.lineWidth = 4;
                this.ctx.beginPath();
                this.ctx.moveTo(compX + size, y + 45);
                this.ctx.lineTo(compX + 85, y + 45);
                this.ctx.stroke();
                
                // Flow particles in piping
                if (Math.random() < 0.2) {
                    const pipeFlow = Math.min(1, stagePressure / 100);
                    this.ctx.fillStyle = stageColors[i];
                    this.ctx.globalAlpha = 0.8;
                    this.ctx.beginPath();
                    this.ctx.arc(compX + size + 20, y + 45, 2, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.globalAlpha = 1;
                }
            }
        }
        
        // Output to storage
        if (status === 'running') {
            this.ctx.strokeStyle = '#e17055';
            this.ctx.lineWidth = 5;
            this.ctx.beginPath();
            this.ctx.moveTo(x + 255, y + 45);
            this.ctx.lineTo(x + 300, y + 45);
            this.ctx.stroke();
            
            // High-pressure output particles
            if (Math.random() < flow * 0.01) {
                this.ctx.fillStyle = '#e17055';
                this.ctx.globalAlpha = 0.9;
                this.ctx.beginPath();
                this.ctx.arc(x + 280, y + 45, 3, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.globalAlpha = 1;
            }
        }
        
        // System label with status
        this.ctx.fillStyle = isHighlighted ? '#fdcb6e' : '#ffffff';
        this.ctx.font = isHighlighted ? '18px Arial' : '16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('⚡ Multi-Stage Compressor', x, y - 55);
        
        // Real-time metrics display
        this.ctx.fillStyle = '#fdcb6e';
        this.ctx.font = '11px Arial';
        this.ctx.fillText(`Output: ${pressure} bar`, x, y + 140);
        this.ctx.fillText(`Flow: ${flow.toFixed(1)} Nm³/hr`, x, y + 155);
        if (status === 'running') {
            const compressionRatio = pressure / 1; // Assuming 1 bar input
            this.ctx.fillText(`Ratio: ${compressionRatio.toFixed(0)}:1`, x, y + 170);
        }
    }
    
    // Draw storage system
    drawStorageSystem() {
        const x = 700, y = 200;
        const status = this.systems.storage.status;
        const level = this.systems.storage.level;
        const tanks = this.systems.storage.tanks;
        
        // Storage tanks (2 rows of 5)
        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 5; col++) {
                const tankX = x + col * 45;
                const tankY = y + row * 60;
                const tankIndex = row * 5 + col;
                const tankLevel = Math.max(0, (level - tankIndex * 10) / 10);
                
                // Tank body
                this.ctx.fillStyle = status === 'running' ? '#6c5ce7' : this.colors.offline;
                this.ctx.fillRect(tankX, tankY, 40, 50);
                
                // Tank border
                this.ctx.strokeStyle = status === 'running' ? this.colors.running : this.colors.offline;
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(tankX, tankY, 40, 50);
                
                // Fill level
                if (status === 'running' && tankLevel > 0) {
                    const fillHeight = Math.min(1, tankLevel) * 45;
                    this.ctx.fillStyle = this.colors.hydrogen;
                    this.ctx.globalAlpha = 0.7;
                    this.ctx.fillRect(tankX + 2, tankY + 47 - fillHeight, 36, fillHeight);
                    this.ctx.globalAlpha = 1;
                }
                
                // Tank number
                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = '8px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(`${tankIndex + 1}`, tankX + 20, tankY + 28);
            }
        }
        
        // System label
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('🛢️ Storage System', x, y - 10);
        
        // Storage level
        this.ctx.fillStyle = '#6c5ce7';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(`Level: ${level.toFixed(1)}%`, x, y + 140);
    }
    
    // Draw system connections
    drawSystemConnections() {
        if (!this.isRunning) return;
        
        const connections = [
            { from: { x: 290, y: 90 }, to: { x: 350, y: 90 } }, // Power to Electrolysis
            { from: { x: 200, y: 260 }, to: { x: 350, y: 90 } }, // Water to Electrolysis
            { from: { x: 530, y: 90 }, to: { x: 600, y: 90 } }, // Electrolysis to Purification
            { from: { x: 780, y: 90 }, to: { x: 350, y: 290 } }, // Purification to Compression
            { from: { x: 590, y: 290 }, to: { x: 700, y: 240 } }  // Compression to Storage
        ];
        
        connections.forEach(conn => {
            this.drawConnection(conn.from, conn.to);
        });
    }
    
    // Draw a connection line with flow animation
    drawConnection(from, to) {
        // Connection line
        this.ctx.strokeStyle = '#555555';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(from.x, from.y);
        this.ctx.lineTo(to.x, to.y);
        this.ctx.stroke();
        
        // Flow particles
        const distance = Math.sqrt((to.x - from.x) ** 2 + (to.y - from.y) ** 2);
        const numParticles = Math.floor(distance / 30);
        
        for (let i = 0; i < numParticles; i++) {
            const progress = (this.time * 0.5 + i * 0.2) % 1;
            const x = from.x + (to.x - from.x) * progress;
            const y = from.y + (to.y - from.y) * progress;
            
            this.ctx.fillStyle = this.colors.hydrogen;
            this.ctx.globalAlpha = 0.8;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 3, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
        }
    }
    
    // Update particles with enhanced physics
    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.life--;
            
            // Use velocity if available, otherwise use old method
            if (particle.velocity) {
                particle.x += particle.velocity.x;
                particle.y += particle.velocity.y;
                
                // Apply slight gravity and air resistance
                particle.velocity.y += 0.01; // Gravity
                particle.velocity.x *= 0.99; // Air resistance
                particle.velocity.y *= 0.99;
            } else {
                // Legacy particle movement
                particle.y -= 2;
            }
            
            return particle.life > 0;
        });
    }
    
    // Update bubbles with enhanced physics
    updateBubbles() {
        this.bubbles = this.bubbles.filter(bubble => {
            bubble.life--;
            
            // Use velocity if available, otherwise use old method
            if (bubble.velocity) {
                bubble.x += bubble.velocity.x;
                bubble.y += bubble.velocity.y;
                
                // Add buoyancy effect
                bubble.velocity.y *= 0.98; // Slight deceleration
                bubble.velocity.x *= 0.99; // Horizontal damping
            } else {
                // Legacy bubble movement
                bubble.y -= bubble.type === 'hydrogen' ? 3 : 2;
                bubble.x += (Math.random() - 0.5) * 0.5;
            }
            
            return bubble.life > 0;
        });
    }
    
    // Update flows
    updateFlows() {
        // Add flow particles if systems are running
        if (this.systems.electrolysis.status === 'running' && Math.random() < 0.1) {
            this.flows.push({
                x: 350,
                y: 90,
                targetX: 600,
                targetY: 90,
                progress: 0,
                speed: 0.02
            });
        }
    }
    
    // Draw particles
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.life / 100;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
        });
    }
    
    // Draw bubbles
    drawBubbles() {
        this.bubbles.forEach(bubble => {
            const color = bubble.type === 'hydrogen' ? this.colors.hydrogen : this.colors.oxygen;
            this.ctx.fillStyle = color;
            this.ctx.globalAlpha = bubble.life / 100;
            this.ctx.beginPath();
            this.ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
        });
    }
    
    // Focus on a specific system
    focusOnSystem(systemName) {
        console.log(`🎯 Focusing on ${systemName} system`);
        this.focusedSystem = systemName;
    }
    
    // Highlight a specific system
    highlightSystem(systemName) {
        console.log(`✨ Highlighting ${systemName} system`);
        this.highlightedSystem = systemName;
        
        // Clear highlight after 3 seconds
        setTimeout(() => {
            this.highlightedSystem = null;
        }, 3000);
    }
    
    // Show parameter change effect
    showParameterChange(systemName, parameter, oldValue, newValue) {
        console.log(`📊 Parameter change in ${systemName}: ${parameter} ${oldValue} → ${newValue}`);
        
        // Create visual effect for parameter change
        const systemPositions = {
            water: { x: 150, y: 260 },
            electrolysis: { x: 430, y: 120 },
            purification: { x: 650, y: 120 },
            compression: { x: 430, y: 320 },
            storage: { x: 770, y: 260 },
            power: { x: 150, y: 120 }
        };
        
        const pos = systemPositions[systemName];
        if (pos) {
            // Add parameter change indicator
            for (let i = 0; i < 5; i++) {
                this.particles.push({
                    x: pos.x + (Math.random() - 0.5) * 40,
                    y: pos.y + (Math.random() - 0.5) * 40,
                    size: 2 + Math.random() * 2,
                    color: '#f39c12',
                    life: 60,
                    velocity: { 
                        x: (Math.random() - 0.5) * 2, 
                        y: -1 - Math.random() * 2 
                    }
                });
            }
            
            // Highlight the system briefly
            this.highlightedSystem = systemName;
            setTimeout(() => {
                if (this.highlightedSystem === systemName) {
                    this.highlightedSystem = null;
                }
            }, 1500);
        }
    }
    
    // Show efficiency impact visualization
    showEfficiencyImpact(systemName, efficiencyChange) {
        const systemPositions = {
            water: { x: 150, y: 260 },
            electrolysis: { x: 430, y: 120 },
            purification: { x: 650, y: 120 },
            compression: { x: 430, y: 320 },
            storage: { x: 770, y: 260 },
            power: { x: 150, y: 120 }
        };
        
        const pos = systemPositions[systemName];
        if (pos) {
            const color = efficiencyChange > 0 ? '#2ecc71' : '#e74c3c';
            const direction = efficiencyChange > 0 ? -1 : 1;
            
            // Create efficiency change particles
            for (let i = 0; i < Math.abs(efficiencyChange) * 2; i++) {
                this.particles.push({
                    x: pos.x,
                    y: pos.y,
                    size: 1.5,
                    color: color,
                    life: 80,
                    velocity: { 
                        x: (Math.random() - 0.5) * 1, 
                        y: direction * (1 + Math.random()) 
                    }
                });
            }
        }
    }
    
    // Compatibility methods for 3D scene interface
    setTopView() { console.log('Top view - 2D animation'); }
    setSideView() { console.log('Side view - 2D animation'); }
    setIsometricView() { console.log('Isometric view - 2D animation'); }
    resetCamera() { console.log('Reset camera - 2D animation'); }
    update(deltaTime) { /* Animation handled in animate() */ }
    render() { /* Rendering handled in animate() */ }
    
    // Clean up
    destroy() {
        this.stop();
        if (this.canvas) {
            this.canvas.remove();
            this.canvas = null;
        }
        this.isInitialized = false;
        console.log('🗑️ 2D Factory Animation destroyed');
    }
}

// Make globally accessible
window.Factory2DAnimation = Factory2DAnimation;
