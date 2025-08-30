/**
 * Professional 3D Hydrogen Production Visualization
 * Advanced Three.js visualization with realistic electrolyzer simulation
 * Based on real industrial electrolyzer design
 */

class ProfessionalHydrogenVisualization {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        
        // 3D Objects - Industrial Electrolyzer Components
        this.electrolyzer = {
            tank: null,
            stack: null,
            cells: [],
            electrodes: {
                cathodes: [],
                anodes: []
            },
            membranes: [],
            gasCollectors: {
                hydrogen: null,
                oxygen: null
            },
            piping: {
                waterInlet: null,
                hydrogenOutlet: null,
                oxygenOutlet: null
            },
            instrumentation: {
                temperatureSensors: [],
                pressureSensors: [],
                flowMeters: []
            }
        };
        
        // Dynamic particle systems
        this.particleSystems = {
            h2Bubbles: [],
            o2Bubbles: [],
            electrons: [],
            waterMolecules: [],
            steamParticles: [],
            electricArcs: []
        };
        
        // Animation and physics properties
        this.animationProperties = {
            isAnimating: false,
            bubbleGenerationRate: 1.0,
            electronFlowRate: 1.0,
            temperatureEffects: true,
            pressureEffects: true,
            electricalActivity: true,
            currentDensityVisualization: true
        };
        
        // Visual parameters (linked to simulation)
        this.visualParameters = {
            temperature: 25,        // °C
            pressure: 1,            // bar
            currentDensity: 1.0,    // A/cm²
            voltage: 1.8,           // V
            efficiency: 75,         // %
            h2Production: 0,        // Nm³/hr
            powerInput: 0           // kW
        };
        
        // Material definitions for realistic appearance
        this.materials = {
            electrolyzer: null,
            electrodes: {
                cathode: null,
                anode: null
            },
            electrolyte: null,
            membrane: null,
            piping: null,
            insulation: null,
            particles: {
                hydrogen: null,
                oxygen: null,
                water: null,
                steam: null
            }
        };
        
        // Lighting setup for industrial appearance
        this.lighting = {
            ambient: null,
            directional: null,
            point: [],
            spot: []
        };
        
        // Performance optimization
        this.performanceSettings = {
            particleCount: {
                h2Bubbles: 100,
                o2Bubbles: 50,
                electrons: 200,
                waterMolecules: 150
            },
            renderQuality: 'high', // low, medium, high, ultra
            shadowQuality: 'medium',
            antialiasing: true
        };
        
        this.init();
    }
    
    init() {
        try {
            console.log('🏭 Initializing professional 3D visualization...');
            
            if (typeof THREE === 'undefined') {
                throw new Error('Three.js library not loaded');
            }
            
            this.setupScene();
            this.setupCamera();
            this.setupRenderer();
            this.setupControls();
            this.createMaterials();
            this.createElectrolyzer();
            this.createParticleSystems();
            this.setupLighting();
            this.setupPostProcessing();
            this.animate();
            this.handleResize();
            
            console.log('✅ Professional visualization initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize professional visualization:', error);
            this.showFallbackMessage();
        }
    }
    
    showFallbackMessage() {
        if (this.container) {
            this.container.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #2c3e50; text-align: center; padding: 2rem; background: linear-gradient(135deg, #f5f7fa, #c3cfe2);">
                    <div>
                        <h3>🏭 Professional 3D Visualization</h3>
                        <p>The advanced 3D visualization could not be loaded.</p>
                        <p>Please ensure you have a modern browser with WebGL 2.0 support.</p>
                        <div style="margin-top: 20px; padding: 15px; background: rgba(52, 152, 219, 0.1); border-radius: 10px;">
                            <strong>System Requirements:</strong><br>
                            • WebGL 2.0 compatible browser<br>
                            • Hardware acceleration enabled<br>
                            • Three.js library loaded
                        </div>
                    </div>
                </div>
            `;
        }
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x263238); // Industrial dark blue-gray
        this.scene.fog = new THREE.Fog(0x263238, 50, 300);
        
        // Add environment map for realistic reflections
        this.createEnvironmentMap();
    }
    
    createEnvironmentMap() {
        // Create a simple environment map for reflections
        const loader = new THREE.CubeTextureLoader();
        // For now, use a simple color - in production, load actual HDRI
        const envMap = new THREE.CubeTexture();
        envMap.format = THREE.RGBFormat;
        this.scene.environment = envMap;
    }
    
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            60, // Slightly narrower FOV for industrial feel
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        
        // Position camera for optimal electrolyzer viewing
        this.camera.position.set(25, 15, 25);
        this.camera.lookAt(0, 0, 0);
    }
    
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: this.performanceSettings.antialiasing,
            alpha: false,
            powerPreference: "high-performance"
        });
        
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit for performance
        
        // Advanced rendering settings
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        
        // Enable advanced features if available
        if (this.renderer.capabilities.isWebGL2) {
            console.log('✅ WebGL 2.0 detected - enabling advanced features');
        }
        
        this.container.appendChild(this.renderer.domElement);
    }
    
    setupControls() {
        try {
            if (typeof THREE.OrbitControls !== 'undefined') {
                this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
                this.controls.enableDamping = true;
                this.controls.dampingFactor = 0.05;
                this.controls.maxDistance = 100;
                this.controls.minDistance = 10;
                this.controls.maxPolarAngle = Math.PI * 0.8; // Prevent going under the floor
                this.controls.target.set(0, 5, 0); // Focus on electrolyzer center
                console.log('✅ Professional camera controls initialized');
            } else {
                this.setupBasicControls();
            }
        } catch (error) {
            console.warn('⚠️ Advanced controls failed, using basic controls:', error);
            this.setupBasicControls();
        }
    }
    
    setupBasicControls() {
        // Simplified camera controls
        let isMouseDown = false;
        let mouseX = 0, mouseY = 0;
        let cameraRadius = 35;
        let cameraTheta = 0;
        let cameraPhi = Math.PI / 4;
        
        const canvas = this.renderer.domElement;
        
        canvas.addEventListener('mousedown', (event) => {
            isMouseDown = true;
            mouseX = event.clientX;
            mouseY = event.clientY;
        });
        
        canvas.addEventListener('mouseup', () => isMouseDown = false);
        canvas.addEventListener('mouseleave', () => isMouseDown = false);
        
        canvas.addEventListener('mousemove', (event) => {
            if (isMouseDown) {
                const deltaX = event.clientX - mouseX;
                const deltaY = event.clientY - mouseY;
                
                cameraTheta += deltaX * 0.01;
                cameraPhi = Math.max(0.1, Math.min(Math.PI - 0.1, cameraPhi + deltaY * 0.01));
                
                this.updateCameraPosition(cameraRadius, cameraTheta, cameraPhi);
                
                mouseX = event.clientX;
                mouseY = event.clientY;
            }
        });
        
        canvas.addEventListener('wheel', (event) => {
            cameraRadius = Math.max(10, Math.min(100, cameraRadius + event.deltaY * 0.01));
            this.updateCameraPosition(cameraRadius, cameraTheta, cameraPhi);
            event.preventDefault();
        });
    }
    
    updateCameraPosition(radius, theta, phi) {
        this.camera.position.x = radius * Math.sin(phi) * Math.cos(theta);
        this.camera.position.y = radius * Math.cos(phi) + 5;
        this.camera.position.z = radius * Math.sin(phi) * Math.sin(theta);
        this.camera.lookAt(0, 5, 0);
    }
    
    createMaterials() {
        // Industrial electrolyzer tank material
        this.materials.electrolyzer = new THREE.MeshPhysicalMaterial({
            color: 0x34495e,
            metalness: 0.8,
            roughness: 0.2,
            clearcoat: 0.1,
            clearcoatRoughness: 0.1
        });
        
        // Electrode materials
        this.materials.electrodes.cathode = new THREE.MeshPhysicalMaterial({
            color: 0x8e44ad,
            metalness: 0.9,
            roughness: 0.1,
            emissive: 0x8e44ad,
            emissiveIntensity: 0.1
        });
        
        this.materials.electrodes.anode = new THREE.MeshPhysicalMaterial({
            color: 0xe67e22,
            metalness: 0.9,
            roughness: 0.1,
            emissive: 0xe67e22,
            emissiveIntensity: 0.1
        });
        
        // Electrolyte solution
        this.materials.electrolyte = new THREE.MeshPhysicalMaterial({
            color: 0x3498db,
            transparent: true,
            opacity: 0.4,
            transmission: 0.9,
            thickness: 2,
            roughness: 0,
            ior: 1.33 // Water refractive index
        });
        
        // Membrane material
        this.materials.membrane = new THREE.MeshPhysicalMaterial({
            color: 0xf8f9fa,
            transparent: true,
            opacity: 0.6,
            transmission: 0.5,
            thickness: 0.1,
            roughness: 0.3
        });
        
        // Particle materials
        this.materials.particles.hydrogen = new THREE.MeshBasicMaterial({
            color: 0x3498db,
            transparent: true,
            opacity: 0.8
        });
        
        this.materials.particles.oxygen = new THREE.MeshBasicMaterial({
            color: 0xe74c3c,
            transparent: true,
            opacity: 0.8
        });
        
        this.materials.particles.water = new THREE.MeshBasicMaterial({
            color: 0x74b9ff,
            transparent: true,
            opacity: 0.6
        });
        
        // Piping material
        this.materials.piping = new THREE.MeshPhysicalMaterial({
            color: 0x7f8c8d,
            metalness: 0.7,
            roughness: 0.3
        });
    }
    
    createElectrolyzer() {
        console.log('🏭 Creating industrial electrolyzer...');
        
        // Main electrolyzer vessel
        this.createElectrolyzerTank();
        
        // Electrolysis stack with multiple cells
        this.createElectrolysisStack();
        
        // Gas collection systems
        this.createGasCollectors();
        
        // Piping and connections
        this.createPipingSystem();
        
        // Instrumentation
        this.createInstrumentation();
        
        // Support structure
        this.createSupportStructure();
        
        console.log('✅ Industrial electrolyzer created');
    }
    
    createElectrolyzerTank() {
        // Main pressure vessel
        const tankGeometry = new THREE.CylinderGeometry(12, 12, 20, 32);
        this.electrolyzer.tank = new THREE.Mesh(tankGeometry, this.materials.electrolyzer);
        this.electrolyzer.tank.position.y = 10;
        this.electrolyzer.tank.castShadow = true;
        this.electrolyzer.tank.receiveShadow = true;
        this.scene.add(this.electrolyzer.tank);
        
        // Tank end caps
        const capGeometry = new THREE.CylinderGeometry(12.5, 12.5, 1, 32);
        const topCap = new THREE.Mesh(capGeometry, this.materials.electrolyzer);
        topCap.position.y = 20.5;
        this.scene.add(topCap);
        
        const bottomCap = new THREE.Mesh(capGeometry, this.materials.electrolyzer);
        bottomCap.position.y = -0.5;
        this.scene.add(bottomCap);
        
        // Electrolyte solution
        const electrolyteGeometry = new THREE.CylinderGeometry(11.5, 11.5, 18, 32);
        const electrolyte = new THREE.Mesh(electrolyteGeometry, this.materials.electrolyte);
        electrolyte.position.y = 10;
        this.scene.add(electrolyte);
    }
    
    createElectrolysisStack() {
        const cellCount = 12;
        const cellSpacing = 1.5;
        const startY = 2;
        
        for (let i = 0; i < cellCount; i++) {
            const cellY = startY + (i * cellSpacing);
            
            // Create cell assembly
            const cellGroup = new THREE.Group();
            
            // Cathode (negative electrode)
            const cathodeGeometry = new THREE.BoxGeometry(20, 0.2, 8);
            const cathode = new THREE.Mesh(cathodeGeometry, this.materials.electrodes.cathode);
            cathode.position.set(0, cellY - 0.3, 0);
            cathode.castShadow = true;
            cellGroup.add(cathode);
            this.electrolyzer.electrodes.cathodes.push(cathode);
            
            // Anode (positive electrode)
            const anodeGeometry = new THREE.BoxGeometry(20, 0.2, 8);
            const anode = new THREE.Mesh(anodeGeometry, this.materials.electrodes.anodes);
            anode.position.set(0, cellY + 0.3, 0);
            anode.castShadow = true;
            cellGroup.add(anode);
            this.electrolyzer.electrodes.anodes.push(anode);
            
            // Membrane separator
            const membraneGeometry = new THREE.BoxGeometry(20, 0.05, 8);
            const membrane = new THREE.Mesh(membraneGeometry, this.materials.membrane);
            membrane.position.set(0, cellY, 0);
            cellGroup.add(membrane);
            this.electrolyzer.membranes.push(membrane);
            
            // Cell frame
            const frameGeometry = new THREE.BoxGeometry(21, 1, 9);
            const frameMaterial = new THREE.MeshPhysicalMaterial({
                color: 0x2c3e50,
                metalness: 0.5,
                roughness: 0.5
            });
            const frame = new THREE.Mesh(frameGeometry, frameMaterial);
            frame.position.set(0, cellY, 0);
            cellGroup.add(frame);
            
            this.electrolyzer.cells.push(cellGroup);
            this.scene.add(cellGroup);
        }
    }
    
    createGasCollectors() {
        // Hydrogen collector (cathode side)
        const h2CollectorGeometry = new THREE.CylinderGeometry(2, 2, 15, 16);
        const h2CollectorMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x3498db,
            metalness: 0.8,
            roughness: 0.2
        });
        this.electrolyzer.gasCollectors.hydrogen = new THREE.Mesh(h2CollectorGeometry, h2CollectorMaterial);
        this.electrolyzer.gasCollectors.hydrogen.position.set(-15, 10, 0);
        this.electrolyzer.gasCollectors.hydrogen.rotation.z = Math.PI / 2;
        this.scene.add(this.electrolyzer.gasCollectors.hydrogen);
        
        // Oxygen collector (anode side)
        const o2CollectorGeometry = new THREE.CylinderGeometry(1.5, 1.5, 15, 16);
        const o2CollectorMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xe74c3c,
            metalness: 0.8,
            roughness: 0.2
        });
        this.electrolyzer.gasCollectors.oxygen = new THREE.Mesh(o2CollectorGeometry, o2CollectorMaterial);
        this.electrolyzer.gasCollectors.oxygen.position.set(15, 10, 0);
        this.electrolyzer.gasCollectors.oxygen.rotation.z = Math.PI / 2;
        this.scene.add(this.electrolyzer.gasCollectors.oxygen);
    }
    
    createPipingSystem() {
        // Water inlet pipe
        const waterInletGeometry = new THREE.CylinderGeometry(0.5, 0.5, 8, 16);
        this.electrolyzer.piping.waterInlet = new THREE.Mesh(waterInletGeometry, this.materials.piping);
        this.electrolyzer.piping.waterInlet.position.set(0, -5, -15);
        this.electrolyzer.piping.waterInlet.rotation.x = Math.PI / 2;
        this.scene.add(this.electrolyzer.piping.waterInlet);
        
        // Hydrogen outlet pipe
        const h2OutletGeometry = new THREE.CylinderGeometry(0.8, 0.8, 10, 16);
        this.electrolyzer.piping.hydrogenOutlet = new THREE.Mesh(h2OutletGeometry, this.materials.piping);
        this.electrolyzer.piping.hydrogenOutlet.position.set(-15, 18, 0);
        this.scene.add(this.electrolyzer.piping.hydrogenOutlet);
        
        // Oxygen outlet pipe
        const o2OutletGeometry = new THREE.CylinderGeometry(0.6, 0.6, 10, 16);
        this.electrolyzer.piping.oxygenOutlet = new THREE.Mesh(o2OutletGeometry, this.materials.piping);
        this.electrolyzer.piping.oxygenOutlet.position.set(15, 18, 0);
        this.scene.add(this.electrolyzer.piping.oxygenOutlet);
    }
    
    createInstrumentation() {
        // Temperature sensors
        for (let i = 0; i < 3; i++) {
            const sensorGeometry = new THREE.BoxGeometry(0.5, 0.5, 2);
            const sensorMaterial = new THREE.MeshPhysicalMaterial({
                color: 0xf39c12,
                metalness: 0.7,
                roughness: 0.3
            });
            const sensor = new THREE.Mesh(sensorGeometry, sensorMaterial);
            sensor.position.set(13, 5 + i * 5, 0);
            this.electrolyzer.instrumentation.temperatureSensors.push(sensor);
            this.scene.add(sensor);
        }
        
        // Pressure sensors
        for (let i = 0; i < 2; i++) {
            const gaugeGeometry = new THREE.CylinderGeometry(1, 1, 0.3, 16);
            const gaugeMaterial = new THREE.MeshPhysicalMaterial({
                color: 0x2ecc71,
                metalness: 0.5,
                roughness: 0.4
            });
            const gauge = new THREE.Mesh(gaugeGeometry, gaugeMaterial);
            gauge.position.set(-13, 8 + i * 8, 0);
            gauge.rotation.z = Math.PI / 2;
            this.electrolyzer.instrumentation.pressureSensors.push(gauge);
            this.scene.add(gauge);
        }
    }
    
    createSupportStructure() {
        // Base platform
        const platformGeometry = new THREE.CylinderGeometry(18, 18, 2, 32);
        const platformMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x34495e,
            metalness: 0.6,
            roughness: 0.8
        });
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.position.y = -2;
        platform.receiveShadow = true;
        this.scene.add(platform);
        
        // Support legs
        for (let i = 0; i < 4; i++) {
            const legGeometry = new THREE.CylinderGeometry(1, 1, 8, 16);
            const leg = new THREE.Mesh(legGeometry, platformMaterial);
            const angle = (i / 4) * Math.PI * 2;
            leg.position.set(Math.cos(angle) * 15, -6, Math.sin(angle) * 15);
            leg.castShadow = true;
            this.scene.add(leg);
        }
    }
    
    createParticleSystems() {
        console.log('🫧 Creating particle systems...');
        
        // Initialize particle arrays
        this.initializeHydrogenBubbles();
        this.initializeOxygenBubbles();
        this.initializeElectrons();
        this.initializeWaterMolecules();
        
        console.log('✅ Particle systems created');
    }
    
    initializeHydrogenBubbles() {
        const bubbleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        
        for (let i = 0; i < this.performanceSettings.particleCount.h2Bubbles; i++) {
            const bubble = new THREE.Mesh(bubbleGeometry, this.materials.particles.hydrogen);
            
            // Start from cathode areas
            bubble.position.set(
                (Math.random() - 0.5) * 20,
                2 + Math.random() * 15,
                (Math.random() - 0.5) * 8
            );
            
            // Add physics properties
            bubble.userData = {
                velocity: new THREE.Vector3(0, 0.02 + Math.random() * 0.03, 0),
                life: Math.random() * 100 + 50,
                maxLife: 150,
                size: 0.1 + Math.random() * 0.15
            };
            
            bubble.scale.setScalar(bubble.userData.size);
            this.particleSystems.h2Bubbles.push(bubble);
            this.scene.add(bubble);
        }
    }
    
    initializeOxygenBubbles() {
        const bubbleGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        
        for (let i = 0; i < this.performanceSettings.particleCount.o2Bubbles; i++) {
            const bubble = new THREE.Mesh(bubbleGeometry, this.materials.particles.oxygen);
            
            // Start from anode areas
            bubble.position.set(
                (Math.random() - 0.5) * 20,
                2 + Math.random() * 15,
                (Math.random() - 0.5) * 8
            );
            
            bubble.userData = {
                velocity: new THREE.Vector3(0, 0.015 + Math.random() * 0.025, 0),
                life: Math.random() * 100 + 50,
                maxLife: 150,
                size: 0.08 + Math.random() * 0.12
            };
            
            bubble.scale.setScalar(bubble.userData.size);
            this.particleSystems.o2Bubbles.push(bubble);
            this.scene.add(bubble);
        }
    }
    
    initializeElectrons() {
        const electronGeometry = new THREE.SphereGeometry(0.02, 6, 6);
        const electronMaterial = new THREE.MeshBasicMaterial({
            color: 0xf1c40f,
            emissive: 0xf39c12,
            emissiveIntensity: 0.5
        });
        
        for (let i = 0; i < this.performanceSettings.particleCount.electrons; i++) {
            const electron = new THREE.Mesh(electronGeometry, electronMaterial);
            
            electron.position.set(
                (Math.random() - 0.5) * 25,
                2 + Math.random() * 15,
                (Math.random() - 0.5) * 10
            );
            
            electron.userData = {
                velocity: new THREE.Vector3((Math.random() - 0.5) * 0.1, 0, 0),
                life: Math.random() * 200 + 100,
                maxLife: 300,
                originalEmissive: 0.5
            };
            
            this.particleSystems.electrons.push(electron);
            this.scene.add(electron);
        }
    }
    
    initializeWaterMolecules() {
        for (let i = 0; i < this.performanceSettings.particleCount.waterMolecules; i++) {
            const molecule = this.createWaterMolecule();
            this.particleSystems.waterMolecules.push(molecule);
            this.scene.add(molecule);
        }
    }
    
    createWaterMolecule() {
        const molecule = new THREE.Group();
        
        // Oxygen atom (larger, blue)
        const oxygenGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        const oxygenMaterial = new THREE.MeshBasicMaterial({ color: 0x3498db });
        const oxygen = new THREE.Mesh(oxygenGeometry, oxygenMaterial);
        molecule.add(oxygen);
        
        // Hydrogen atoms (smaller, white)
        const hydrogenGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const hydrogenMaterial = new THREE.MeshBasicMaterial({ color: 0xecf0f1 });
        
        const h1 = new THREE.Mesh(hydrogenGeometry, hydrogenMaterial);
        h1.position.set(0.2, 0.1, 0);
        molecule.add(h1);
        
        const h2 = new THREE.Mesh(hydrogenGeometry, hydrogenMaterial);
        h2.position.set(-0.2, 0.1, 0);
        molecule.add(h2);
        
        // Position randomly
        molecule.position.set(
            (Math.random() - 0.5) * 20,
            Math.random() * 18 + 1,
            (Math.random() - 0.5) * 8
        );
        
        molecule.userData = {
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.01,
                (Math.random() - 0.5) * 0.02
            ),
            rotationSpeed: (Math.random() - 0.5) * 0.02
        };
        
        return molecule;
    }
    
    setupLighting() {
        // Ambient lighting for overall scene illumination
        this.lighting.ambient = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(this.lighting.ambient);
        
        // Main directional light (simulating industrial lighting)
        this.lighting.directional = new THREE.DirectionalLight(0xffffff, 1.0);
        this.lighting.directional.position.set(30, 40, 20);
        this.lighting.directional.castShadow = true;
        
        // Configure shadow properties
        this.lighting.directional.shadow.mapSize.width = 2048;
        this.lighting.directional.shadow.mapSize.height = 2048;
        this.lighting.directional.shadow.camera.near = 0.5;
        this.lighting.directional.shadow.camera.far = 100;
        this.lighting.directional.shadow.camera.left = -50;
        this.lighting.directional.shadow.camera.right = 50;
        this.lighting.directional.shadow.camera.top = 50;
        this.lighting.directional.shadow.camera.bottom = -50;
        this.lighting.directional.shadow.bias = -0.0001;
        
        this.scene.add(this.lighting.directional);
        
        // Point lights for electrodes (dynamic based on electrical activity)
        this.electrolyzer.electrodes.cathodes.forEach((cathode, index) => {
            const light = new THREE.PointLight(0x8e44ad, 0.5, 5);
            light.position.copy(cathode.position);
            this.lighting.point.push(light);
            this.scene.add(light);
        });
        
        this.electrolyzer.electrodes.anodes.forEach((anode, index) => {
            const light = new THREE.PointLight(0xe67e22, 0.5, 5);
            light.position.copy(anode.position);
            this.lighting.point.push(light);
            this.scene.add(light);
        });
        
        // Industrial overhead lighting
        for (let i = 0; i < 4; i++) {
            const spotLight = new THREE.SpotLight(0xffffff, 0.8, 50, Math.PI / 6, 0.3);
            const angle = (i / 4) * Math.PI * 2;
            spotLight.position.set(Math.cos(angle) * 25, 35, Math.sin(angle) * 25);
            spotLight.target.position.set(0, 10, 0);
            spotLight.castShadow = true;
            this.lighting.spot.push(spotLight);
            this.scene.add(spotLight);
            this.scene.add(spotLight.target);
        }
    }
    
    setupPostProcessing() {
        // Advanced post-processing effects can be added here
        // For now, we'll keep it simple but professional
        console.log('🎨 Post-processing setup complete');
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.animationProperties.isAnimating) {
            this.updateParticleSystems();
            this.updateElectricalEffects();
            this.updateTemperatureEffects();
            this.updateInstrumentation();
        }
        
        if (this.controls && this.controls.update) {
            this.controls.update();
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    updateParticleSystems() {
        // Update hydrogen bubbles
        this.particleSystems.h2Bubbles.forEach(bubble => {
            bubble.position.add(bubble.userData.velocity);
            bubble.userData.life--;
            
            // Buoyancy and random motion
            bubble.userData.velocity.y += 0.001;
            bubble.userData.velocity.x += (Math.random() - 0.5) * 0.002;
            bubble.userData.velocity.z += (Math.random() - 0.5) * 0.002;
            
            // Fade out over time
            const alpha = bubble.userData.life / bubble.userData.maxLife;
            bubble.material.opacity = alpha * 0.8;
            
            // Reset when life expires or reaches top
            if (bubble.userData.life <= 0 || bubble.position.y > 25) {
                bubble.position.set(
                    (Math.random() - 0.5) * 20,
                    2 + Math.random() * 3,
                    (Math.random() - 0.5) * 8
                );
                bubble.userData.life = bubble.userData.maxLife;
                bubble.userData.velocity.set(0, 0.02 + Math.random() * 0.03, 0);
            }
        });
        
        // Update oxygen bubbles (similar but slower)
        this.particleSystems.o2Bubbles.forEach(bubble => {
            bubble.position.add(bubble.userData.velocity);
            bubble.userData.life--;
            
            bubble.userData.velocity.y += 0.0008;
            bubble.userData.velocity.x += (Math.random() - 0.5) * 0.001;
            bubble.userData.velocity.z += (Math.random() - 0.5) * 0.001;
            
            const alpha = bubble.userData.life / bubble.userData.maxLife;
            bubble.material.opacity = alpha * 0.8;
            
            if (bubble.userData.life <= 0 || bubble.position.y > 25) {
                bubble.position.set(
                    (Math.random() - 0.5) * 20,
                    2 + Math.random() * 3,
                    (Math.random() - 0.5) * 8
                );
                bubble.userData.life = bubble.userData.maxLife;
                bubble.userData.velocity.set(0, 0.015 + Math.random() * 0.025, 0);
            }
        });
        
        // Update electrons (flow from anode to cathode)
        this.particleSystems.electrons.forEach(electron => {
            electron.position.add(electron.userData.velocity);
            electron.userData.life--;
            
            // Electric field simulation
            electron.userData.velocity.x += (Math.random() - 0.5) * 0.005;
            
            // Pulsing emissive effect
            const pulse = Math.sin(Date.now() * 0.01 + electron.position.x) * 0.3 + 0.5;
            electron.material.emissiveIntensity = electron.userData.originalEmissive * pulse;
            
            if (electron.userData.life <= 0) {
                electron.position.set(
                    (Math.random() - 0.5) * 25,
                    2 + Math.random() * 15,
                    (Math.random() - 0.5) * 10
                );
                electron.userData.life = electron.userData.maxLife;
            }
        });
        
        // Update water molecules
        this.particleSystems.waterMolecules.forEach(molecule => {
            molecule.position.add(molecule.userData.velocity);
            molecule.rotation.y += molecule.userData.rotationSpeed;
            
            // Brownian motion
            molecule.userData.velocity.x += (Math.random() - 0.5) * 0.001;
            molecule.userData.velocity.y += (Math.random() - 0.5) * 0.001;
            molecule.userData.velocity.z += (Math.random() - 0.5) * 0.001;
            
            // Keep within bounds
            if (molecule.position.y > 20 || molecule.position.y < 1) {
                molecule.userData.velocity.y *= -0.5;
            }
            if (Math.abs(molecule.position.x) > 11) {
                molecule.userData.velocity.x *= -0.5;
            }
            if (Math.abs(molecule.position.z) > 4) {
                molecule.userData.velocity.z *= -0.5;
            }
        });
    }
    
    updateElectricalEffects() {
        // Update electrode lighting based on current density
        const intensity = this.visualParameters.currentDensity * 0.5;
        
        this.lighting.point.forEach((light, index) => {
            if (index < this.electrolyzer.electrodes.cathodes.length) {
                // Cathode lights (purple)
                light.intensity = intensity * (0.5 + Math.sin(Date.now() * 0.005) * 0.2);
            } else {
                // Anode lights (orange)
                light.intensity = intensity * (0.5 + Math.cos(Date.now() * 0.005) * 0.2);
            }
        });
        
        // Update electrode material emissive intensity
        this.electrolyzer.electrodes.cathodes.forEach(cathode => {
            cathode.material.emissiveIntensity = intensity * (0.1 + Math.sin(Date.now() * 0.003) * 0.05);
        });
        
        this.electrolyzer.electrodes.anodes.forEach(anode => {
            anode.material.emissiveIntensity = intensity * (0.1 + Math.cos(Date.now() * 0.003) * 0.05);
        });
    }
    
    updateTemperatureEffects() {
        // Visual temperature effects
        if (this.visualParameters.temperature > 60) {
            // Add heat shimmer effect or steam particles
            const steamCount = Math.floor((this.visualParameters.temperature - 60) / 5);
            // Implementation would add steam particles here
        }
        
        // Update electrolyte opacity based on temperature
        const tempFactor = Math.max(0.3, Math.min(0.6, 0.4 + (this.visualParameters.temperature - 25) / 100));
        // Apply to electrolyte material if it exists
    }
    
    updateInstrumentation() {
        // Animate pressure gauges
        this.electrolyzer.instrumentation.pressureSensors.forEach((gauge, index) => {
            const pressure = this.visualParameters.pressure + Math.sin(Date.now() * 0.001 + index) * 0.1;
            gauge.rotation.y = (pressure / 30) * Math.PI; // Scale to gauge range
        });
        
        // Temperature sensor indicators
        this.electrolyzer.instrumentation.temperatureSensors.forEach((sensor, index) => {
            const temp = this.visualParameters.temperature + Math.sin(Date.now() * 0.002 + index) * 2;
            const hue = Math.max(0.6, Math.min(1, 1 - (temp - 20) / 80)); // Blue to red
            sensor.material.color.setHSL(hue * 0.6, 0.8, 0.5);
        });
    }
    
    // Public interface methods
    startAnimation() {
        this.animationProperties.isAnimating = true;
        console.log('🎬 Professional visualization started');
    }
    
    stopAnimation() {
        this.animationProperties.isAnimating = false;
        console.log('⏹️ Professional visualization stopped');
    }
    
    updateParameters(parameters) {
        Object.assign(this.visualParameters, parameters);
        
        // Update particle generation rates
        this.animationProperties.bubbleGenerationRate = parameters.h2Production / 100;
        this.animationProperties.electronFlowRate = parameters.currentDensity;
        
        console.log('📊 Visualization parameters updated:', parameters);
    }
    
    setQuality(quality) {
        this.performanceSettings.renderQuality = quality;
        
        switch (quality) {
            case 'low':
                this.performanceSettings.particleCount = {
                    h2Bubbles: 50,
                    o2Bubbles: 25,
                    electrons: 100,
                    waterMolecules: 75
                };
                break;
            case 'medium':
                this.performanceSettings.particleCount = {
                    h2Bubbles: 75,
                    o2Bubbles: 35,
                    electrons: 150,
                    waterMolecules: 100
                };
                break;
            case 'high':
                this.performanceSettings.particleCount = {
                    h2Bubbles: 100,
                    o2Bubbles: 50,
                    electrons: 200,
                    waterMolecules: 150
                };
                break;
            case 'ultra':
                this.performanceSettings.particleCount = {
                    h2Bubbles: 150,
                    o2Bubbles: 75,
                    electrons: 300,
                    waterMolecules: 200
                };
                break;
        }
        
        console.log(`🎨 Visualization quality set to: ${quality}`);
    }
    
    handleResize() {
        window.addEventListener('resize', () => {
            if (this.camera && this.renderer && this.container) {
                this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
            }
        });
    }
    
    dispose() {
        console.log('🧹 Disposing professional visualization...');
        
        // Dispose of geometries, materials, and textures
        this.scene.traverse((object) => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
        
        // Dispose renderer
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        // Dispose controls
        if (this.controls && this.controls.dispose) {
            this.controls.dispose();
        }
        
        console.log('✅ Professional visualization disposed');
    }
}

// Make globally accessible
window.ProfessionalHydrogenVisualization = ProfessionalHydrogenVisualization;

