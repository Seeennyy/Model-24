// Factory Animations
// Dependencies loaded via CDN: Three.js, GSAP

class FactoryAnimations {
    constructor(scene = null, models = null) {
        this.scene = scene;
        this.models = models;
        this.isInitialized = false;
        
        // Animation objects
        this.alarms = new Map();
        this.particles = new Map();
        this.flowAnimations = new Map();
        this.maintenanceAnimations = new Map();
        
        // Animation state
        this.isRunning = false;
        this.animationSpeed = 1.0;
        
        // Particle systems
        this.particleMaterials = {};
        this.setupParticleMaterials();
    }
    
    async init() {
        try {
            console.log('🎭 Initializing factory animations...');
            
            // Setup particle systems
            this.setupParticleSystems();
            
            // Setup flow animations
            this.setupFlowAnimations();
            
            // Setup maintenance animations
            this.setupMaintenanceAnimations();
            
            this.isInitialized = true;
            console.log('✅ Factory animations initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize factory animations:', error);
            throw error;
        }
    }
    
    setupParticleMaterials() {
        // Hydrogen gas particles
        this.particleMaterials.hydrogen = new THREE.PointsMaterial({
            color: 0x00d4aa,
            size: 0.5,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        // Oxygen gas particles
        this.particleMaterials.oxygen = new THREE.PointsMaterial({
            color: 0xf39c12,
            size: 0.4,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });
        
        // Water particles
        this.particleMaterials.water = new THREE.PointsMaterial({
            color: 0x0984e3,
            size: 0.3,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        // Steam particles
        this.particleMaterials.steam = new THREE.PointsMaterial({
            color: 0x87ceeb,
            size: 0.2,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending
        });
        
        // Spark particles
        this.particleMaterials.spark = new THREE.PointsMaterial({
            color: 0xffff00,
            size: 0.8,
            transparent: true,
            opacity: 1.0,
            blending: THREE.AdditiveBlending
        });
    }
    
    setupParticleSystems() {
        // Create particle systems for different systems
        this.createParticleSystem('water', 'water', 100);
        this.createParticleSystem('electrolysis', 'hydrogen', 200);
        this.createParticleSystem('electrolysis', 'oxygen', 150);
        this.createParticleSystem('compression', 'steam', 80);
        this.createParticleSystem('power', 'spark', 50);
    }
    
    createParticleSystem(systemName, particleType, count) {
        const system = this.models.models.get(systemName);
        if (!system) return;
        
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);
        const lifetimes = new Float32Array(count);
        
        // Initialize particles
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            
            // Random position around system
            positions[i3] = (Math.random() - 0.5) * 20;
            positions[i3 + 1] = Math.random() * 10;
            positions[i3 + 2] = (Math.random() - 0.5) * 20;
            
            // Random velocity
            velocities[i3] = (Math.random() - 0.5) * 0.1;
            velocities[i3 + 1] = Math.random() * 0.2;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.1;
            
            // Random lifetime
            lifetimes[i] = Math.random() * 5 + 2;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
        geometry.setAttribute('lifetime', new THREE.BufferAttribute(lifetimes, 1));
        
        const material = this.particleMaterials[particleType];
        const particles = new THREE.Points(geometry, material);
        
        // Position particles relative to system
        particles.position.copy(system.position);
        
        // Store for updates
        const key = `${systemName}_${particleType}`;
        this.particles.set(key, {
            particles,
            velocities,
            lifetimes,
            count,
            systemPosition: system.position.clone()
        });
        
        this.scene.add(particles);
    }
    
    setupFlowAnimations() {
        // Create flow indicators for pipes and systems
        this.createFlowIndicator('water_flow', 0x00d4aa);
        this.createFlowIndicator('gas_flow', 0x0984e3);
        this.createFlowIndicator('power_flow', 0xf39c12);
    }
    
    createFlowIndicator(name, color) {
        const geometry = new THREE.SphereGeometry(0.3, 8, 6);
        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.8
        });
        
        const flowBall = new THREE.Mesh(geometry, material);
        flowBall.visible = false;
        
        this.flowAnimations.set(name, {
            ball: flowBall,
            path: [],
            currentIndex: 0,
            speed: 0.02,
            isActive: false
        });
        
        this.scene.add(flowBall);
    }
    
    setupMaintenanceAnimations() {
        // Create maintenance indicators (wrenches, tools, etc.)
        this.createMaintenanceIndicator('maintenance_tool', 0xf39c12);
        this.createMaintenanceIndicator('warning_light', 0xe17055);
        this.createMaintenanceIndicator('info_panel', 0x00d4aa);
    }
    
    createMaintenanceIndicator(name, color) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.7
        });
        
        const indicator = new THREE.Mesh(geometry, material);
        indicator.visible = false;
        
        this.maintenanceAnimations.set(name, {
            indicator,
            isActive: false,
            animationType: 'pulse'
        });
        
        this.scene.add(indicator);
    }
    
    // Public methods for external control
    showSystemAlarm(systemName, alarmType) {
        const system = this.models.models.get(systemName);
        if (!system) return;
        
        const alarm = this.createAlarm(alarmType, system.position);
        this.alarms.set(systemName, alarm);
        
        // Add alarm to scene
        this.scene.add(alarm);
        
        // Start alarm animation
        this.startAlarmAnimation(alarm, alarmType);
    }
    
    hideSystemAlarm(systemName) {
        const alarm = this.alarms.get(systemName);
        if (alarm) {
            this.scene.remove(alarm);
            this.alarms.delete(systemName);
        }
    }
    
    createAlarm(alarmType, position) {
        const alarm = new THREE.Group();
        alarm.position.copy(position);
        alarm.position.y += 15; // Above the system
        
        switch (alarmType) {
            case 'warning':
                return this.createWarningAlarm(alarm);
            case 'error':
                return this.createErrorAlarm(alarm);
            case 'maintenance':
                return this.createMaintenanceAlarm(alarm);
            default:
                return this.createInfoAlarm(alarm);
        }
    }
    
    createWarningAlarm(alarm) {
        // Warning light
        const lightGeometry = new THREE.SphereGeometry(1, 8, 6);
        const lightMaterial = new THREE.MeshBasicMaterial({
            color: 0xf39c12,
            transparent: true,
            opacity: 0.8
        });
        
        const light = new THREE.Mesh(lightGeometry, lightMaterial);
        alarm.add(light);
        
        // Warning symbol
        const symbolGeometry = new THREE.BoxGeometry(0.2, 1.5, 0.2);
        const symbolMaterial = new THREE.MeshBasicMaterial({ color: 0xf39c12 });
        
        const symbol1 = new THREE.Mesh(symbolGeometry, symbolMaterial);
        symbol1.position.set(0, 0, 0);
        alarm.add(symbol1);
        
        const symbol2 = new THREE.Mesh(symbolGeometry, symbolMaterial);
        symbol2.position.set(0, 0, 0);
        symbol2.rotation.z = Math.PI / 4;
        alarm.add(symbol2);
        
        return alarm;
    }
    
    createErrorAlarm(alarm) {
        // Error light
        const lightGeometry = new THREE.SphereGeometry(1.2, 8, 6);
        const lightMaterial = new THREE.MeshBasicMaterial({
            color: 0xe17055,
            transparent: true,
            opacity: 0.9
        });
        
        const light = new THREE.Mesh(lightGeometry, lightMaterial);
        alarm.add(light);
        
        // X symbol
        const symbolGeometry = new THREE.BoxGeometry(0.2, 1.5, 0.2);
        const symbolMaterial = new THREE.MeshBasicMaterial({ color: 0xe17055 });
        
        const symbol1 = new THREE.Mesh(symbolGeometry, symbolMaterial);
        symbol1.position.set(0, 0, 0);
        symbol1.rotation.z = Math.PI / 4;
        alarm.add(symbol1);
        
        const symbol2 = new THREE.Mesh(symbolGeometry, symbolMaterial);
        symbol2.position.set(0, 0, 0);
        symbol2.rotation.z = -Math.PI / 4;
        alarm.add(symbol2);
        
        return alarm;
    }
    
    createMaintenanceAlarm(alarm) {
        // Maintenance light
        const lightGeometry = new THREE.SphereGeometry(1, 8, 6);
        const lightMaterial = new THREE.MeshBasicMaterial({
            color: 0x00d4aa,
            transparent: true,
            opacity: 0.8
        });
        
        const light = new THREE.Mesh(lightGeometry, lightMaterial);
        alarm.add(light);
        
        // Wrench symbol
        const wrenchGeometry = new THREE.BoxGeometry(1.5, 0.2, 0.2);
        const wrenchMaterial = new THREE.MeshBasicMaterial({ color: 0x00d4aa });
        
        const wrench = new THREE.Mesh(wrenchGeometry, wrenchMaterial);
        wrench.position.set(0, 0, 0);
        alarm.add(wrench);
        
        return alarm;
    }
    
    createInfoAlarm(alarm) {
        // Info light
        const lightGeometry = new THREE.SphereGeometry(0.8, 8, 6);
        const lightMaterial = new THREE.MeshBasicMaterial({
            color: 0x0984e3,
            transparent: true,
            opacity: 0.7
        });
        
        const light = new THREE.Mesh(lightGeometry, lightMaterial);
        alarm.add(light);
        
        // Info symbol (i)
        const symbolGeometry = new THREE.SphereGeometry(0.3, 8, 6);
        const symbolMaterial = new THREE.MeshBasicMaterial({ color: 0x0984e3 });
        
        const symbol = new THREE.Mesh(symbolGeometry, symbolMaterial);
        symbol.position.set(0, 0, 0);
        alarm.add(symbol);
        
        return alarm;
    }
    
    startAlarmAnimation(alarm, alarmType) {
        const animate = () => {
            if (!this.alarms.has(alarm.name)) return;
            
            // Pulse animation
            const time = Date.now() * 0.005;
            const scale = 1 + Math.sin(time * 3) * 0.2;
            alarm.scale.setScalar(scale);
            
            // Color pulse
            alarm.traverse((child) => {
                if (child.material && child.material.color) {
                    const hue = (time * 0.1) % 1;
                    child.material.color.setHSL(hue, 0.8, 0.6);
                }
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    startFlowAnimation(flowName, startPosition, endPosition) {
        const flow = this.flowAnimations.get(flowName);
        if (!flow) return;
        
        // Create path between positions
        flow.path = this.createFlowPath(startPosition, endPosition);
        flow.currentIndex = 0;
        flow.isActive = true;
        
        // Show flow ball
        flow.ball.visible = true;
        flow.ball.position.copy(flow.path[0]);
    }
    
    stopFlowAnimation(flowName) {
        const flow = this.flowAnimations.get(flowName);
        if (flow) {
            flow.isActive = false;
            flow.ball.visible = false;
        }
    }
    
    createFlowPath(start, end) {
        const path = [];
        const steps = 20;
        
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const point = new THREE.Vector3();
            point.lerpVectors(start, end, t);
            
            // Add some curve to the path
            point.y += Math.sin(t * Math.PI) * 5;
            
            path.push(point);
        }
        
        return path;
    }
    
    showMaintenanceIndicator(systemName, indicatorType) {
        const system = this.models.models.get(systemName);
        if (!system) return;
        
        const indicator = this.maintenanceAnimations.get(indicatorType);
        if (indicator) {
            indicator.indicator.position.copy(system.position);
            indicator.indicator.position.y += 20;
            indicator.indicator.visible = true;
            indicator.isActive = true;
        }
    }
    
    hideMaintenanceIndicator(indicatorType) {
        const indicator = this.maintenanceAnimations.get(indicatorType);
        if (indicator) {
            indicator.indicator.visible = false;
            indicator.isActive = false;
        }
    }
    
    // Update method called from main loop
    update(deltaTime) {
        if (!this.isInitialized) return;
        
        // Update particle systems
        this.updateParticleSystems(deltaTime);
        
        // Update flow animations
        this.updateFlowAnimations(deltaTime);
        
        // Update maintenance animations
        this.updateMaintenanceAnimations(deltaTime);
    }
    
    updateParticleSystems(deltaTime) {
        this.particles.forEach((system, key) => {
            const positions = system.particles.geometry.attributes.position.array;
            const velocities = system.velocities;
            const lifetimes = system.lifetimes;
            
            for (let i = 0; i < system.count; i++) {
                const i3 = i * 3;
                
                // Update lifetime
                lifetimes[i] -= deltaTime * 0.001;
                
                if (lifetimes[i] <= 0) {
                    // Reset particle
                    lifetimes[i] = Math.random() * 5 + 2;
                    positions[i3] = (Math.random() - 0.5) * 20;
                    positions[i3 + 1] = Math.random() * 10;
                    positions[i3 + 2] = (Math.random() - 0.5) * 20;
                } else {
                    // Update position
                    positions[i3] += velocities[i3] * deltaTime * 0.001;
                    positions[i3 + 1] += velocities[i3 + 1] * deltaTime * 0.001;
                    positions[i3 + 2] += velocities[i3 + 2] * deltaTime * 0.001;
                    
                    // Add some randomness
                    velocities[i3] += (Math.random() - 0.5) * 0.01;
                    velocities[i3 + 1] += (Math.random() - 0.5) * 0.01;
                    velocities[i3 + 2] += (Math.random() - 0.5) * 0.01;
                    
                    // Limit velocity
                    const speed = Math.sqrt(
                        velocities[i3] ** 2 + 
                        velocities[i3 + 1] ** 2 + 
                        velocities[i3 + 2] ** 2
                    );
                    
                    if (speed > 0.2) {
                        const factor = 0.2 / speed;
                        velocities[i3] *= factor;
                        velocities[i3 + 1] *= factor;
                        velocities[i3 + 2] *= factor;
                    }
                }
            }
            
            // Update geometry
            system.particles.geometry.attributes.position.needsUpdate = true;
        });
    }
    
    updateFlowAnimations(deltaTime) {
        this.flowAnimations.forEach((flow, key) => {
            if (!flow.isActive || flow.path.length === 0) return;
            
            // Move flow ball along path
            flow.currentIndex += flow.speed * deltaTime * 0.001;
            
            if (flow.currentIndex >= flow.path.length - 1) {
                // Reset to start
                flow.currentIndex = 0;
            }
            
            // Interpolate position
            const index = Math.floor(flow.currentIndex);
            const nextIndex = Math.min(index + 1, flow.path.length - 1);
            const t = flow.currentIndex - index;
            
            const currentPos = flow.path[index];
            const nextPos = flow.path[nextIndex];
            
            flow.ball.position.lerpVectors(currentPos, nextPos, t);
        });
    }
    
    updateMaintenanceAnimations(deltaTime) {
        this.maintenanceAnimations.forEach((indicator, key) => {
            if (!indicator.isActive) return;
            
            switch (indicator.animationType) {
                case 'pulse':
                    // Pulse animation
                    const time = Date.now() * 0.005;
                    const scale = 1 + Math.sin(time * 2) * 0.1;
                    indicator.indicator.scale.setScalar(scale);
                    break;
                    
                case 'rotate':
                    // Rotation animation
                    indicator.indicator.rotation.y += deltaTime * 0.001;
                    break;
                    
                case 'bounce':
                    // Bounce animation
                    const bounceTime = Date.now() * 0.003;
                    const bounce = Math.abs(Math.sin(bounceTime)) * 2;
                    indicator.indicator.position.y += bounce;
                    break;
            }
        });
    }
    
    // Performance optimization
    setAnimationSpeed(speed) {
        this.animationSpeed = speed;
    }
    
    // Cleanup
    destroy() {
        // Remove all alarms
        this.alarms.forEach((alarm) => {
            this.scene.remove(alarm);
        });
        this.alarms.clear();
        
        // Remove all particles
        this.particles.forEach((system) => {
            this.scene.remove(system.particles);
            system.particles.geometry.dispose();
            system.particles.material.dispose();
        });
        this.particles.clear();
        
        // Remove all flow animations
        this.flowAnimations.forEach((flow) => {
            this.scene.remove(flow.ball);
            flow.ball.geometry.dispose();
            flow.ball.material.dispose();
        });
        this.flowAnimations.clear();
        
        // Remove all maintenance animations
        this.maintenanceAnimations.forEach((indicator) => {
            this.scene.remove(indicator.indicator);
            indicator.indicator.geometry.dispose();
            indicator.indicator.material.dispose();
        });
        this.maintenanceAnimations.clear();
        
        // Dispose particle materials
        Object.values(this.particleMaterials).forEach(material => {
            material.dispose();
        });
        
        console.log('🎭 Factory animations destroyed');
    }
}

// Make globally accessible
window.FactoryAnimations = FactoryAnimations;