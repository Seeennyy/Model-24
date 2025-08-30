// 3D Scene Manager
// Dependencies loaded via CDN: Three.js, OrbitControls

class Scene3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.factoryModels = null;
        this.factoryAnimations = null;
        this.selectedEquipment = null;
        this.isInitialized = false;
    }

    async init() {
        try {
            console.log('🎨 Initializing 3D scene...');
            
            this.setupScene();
            this.setupCamera();
            this.setupRenderer();
            this.setupControls();
            this.setupLighting();
            this.setupEventListeners();
            
            // Check if FactoryModels class is available
            if (typeof FactoryModels === 'undefined') {
                throw new Error('FactoryModels class not found. Check if models.js is loaded.');
            }
            
            console.log('🏗️ Creating factory models...');
            // Initialize factory models and animations
            this.factoryModels = new FactoryModels();
            console.log('🏗️ Factory models instance created:', this.factoryModels);
            
            await this.factoryModels.init();
            console.log('🏗️ Factory models initialized, group:', this.factoryModels.group);
            
            // Check if FactoryAnimations class is available
            if (typeof FactoryAnimations === 'undefined') {
                throw new Error('FactoryAnimations class not found. Check if animations.js is loaded.');
            }
            
            console.log('🎭 Creating factory animations...');
            this.factoryAnimations = new FactoryAnimations(this.scene, this.factoryModels);
            console.log('🎭 Factory animations instance created:', this.factoryAnimations);
            
            await this.factoryAnimations.init();
            console.log('🎭 Factory animations initialized');
            
            // Add models to scene
            if (this.factoryModels && this.factoryModels.group) {
                this.scene.add(this.factoryModels.group);
                console.log('✅ Models added to scene');
            } else {
                throw new Error('Factory models group is null or undefined');
            }
            
            this.isInitialized = true;
            console.log('✅ 3D scene initialized successfully!');
            
        } catch (error) {
            console.error('❌ Failed to initialize 3D scene:', error);
            console.error('Error details:', {
                FactoryModels: typeof FactoryModels,
                FactoryAnimations: typeof FactoryAnimations,
                factoryModels: this.factoryModels,
                factoryAnimations: this.factoryAnimations
            });
            throw error;
        }
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);
        this.scene.fog = new THREE.Fog(0x1a1a2e, 100, 500);
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75, // FOV
            window.innerWidth / window.innerHeight, // Aspect ratio
            0.1, // Near
            1000 // Far
        );
        
        // Set initial camera position
        this.camera.position.set(50, 30, 50);
        this.camera.lookAt(0, 0, 0);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        
        // Size renderer to viewport element, not full window
        const viewport = document.getElementById('viewport');
        const width = viewport ? viewport.clientWidth : window.innerWidth;
        const height = viewport ? viewport.clientHeight : window.innerHeight;
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        
        // Add renderer to DOM
        const viewportEl = document.getElementById('viewport');
        if (viewportEl) {
            viewportEl.appendChild(this.renderer.domElement);
        }
    }

    setupControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 10;
        this.controls.maxDistance = 200;
        this.controls.maxPolarAngle = Math.PI / 2;
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 100, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        directionalLight.shadow.camera.left = -100;
        directionalLight.shadow.camera.right = 100;
        directionalLight.shadow.camera.top = 100;
        directionalLight.shadow.camera.bottom = -100;
        this.scene.add(directionalLight);
        
        // Point lights for equipment
        const pointLight1 = new THREE.PointLight(0x00ff88, 0.5, 50);
        pointLight1.position.set(20, 10, 20);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0x0088ff, 0.5, 50);
        pointLight2.position.set(-20, 10, -20);
        this.scene.add(pointLight2);
    }

    setupEventListeners() {
        // Mouse events
        this.renderer.domElement.addEventListener('click', (event) => this.onMouseClick(event));
        this.renderer.domElement.addEventListener('mousemove', (event) => this.onMouseMove(event));
        
        // Window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    onMouseClick(event) {
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);
        
        const intersects = raycaster.intersectObjects(this.scene.children, true);
        
        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            const equipment = this.findEquipmentParent(clickedObject);
            
            if (equipment) {
                this.selectEquipment(equipment);
            }
        }
    }

    onMouseMove(event) {
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);
        
        const intersects = raycaster.intersectObjects(this.scene.children, true);
        
        if (intersects.length > 0) {
            const hoveredObject = intersects[0].object;
            const equipment = this.findEquipmentParent(hoveredObject);
            
            if (equipment && equipment !== this.selectedEquipment) {
                this.highlightEquipment(equipment);
            }
        } else {
            this.clearHighlights();
        }
    }

    findEquipmentParent(object) {
        let current = object;
        while (current && !current.userData.isEquipment) {
            current = current.parent;
        }
        return current;
    }

    selectEquipment(equipment) {
        if (this.selectedEquipment === equipment) return;
        
        // Clear previous selection
        this.clearHighlights();
        
        // Select new equipment
        this.selectedEquipment = equipment;
        this.highlightEquipment(equipment);
        
        // Trigger equipment selection event
        this.onEquipmentSelected(equipment);
    }

    highlightEquipment(equipment) {
        if (!equipment) return;
        
        // Add highlight material
        const highlightMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });
        
        equipment.userData.highlightMaterial = highlightMaterial;
        equipment.material = highlightMaterial;
    }

    clearHighlights() {
        if (this.selectedEquipment && this.selectedEquipment.userData.originalMaterial) {
            this.selectedEquipment.material = this.selectedEquipment.userData.originalMaterial;
        }
        
        this.selectedEquipment = null;
    }

    onEquipmentSelected(equipment) {
        console.log('Selected equipment:', equipment.name);
        
        // Update UI with equipment details
        const event = new CustomEvent('equipmentSelected', {
            detail: { equipment: equipment }
        });
        window.dispatchEvent(event);
    }

    resetCamera() {
        this.camera.position.set(50, 30, 50);
        this.camera.lookAt(0, 0, 0);
        this.controls.reset();
    }

    setTopView() {
        this.animateCameraTo(new THREE.Vector3(0, 100, 0), new THREE.Vector3(0, 0, 0));
    }

    setSideView() {
        this.animateCameraTo(new THREE.Vector3(100, 0, 0), new THREE.Vector3(0, 0, 0));
    }

    setIsometricView() {
        this.animateCameraTo(new THREE.Vector3(50, 50, 50), new THREE.Vector3(0, 0, 0));
    }

    animateCameraTo(position, target) {
        const duration = 1000; // 1 second
        const startPosition = this.camera.position.clone();
        const startTarget = this.controls.target.clone();
        
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = this.easeInOutCubic(progress);
            
            this.camera.position.lerpVectors(startPosition, position, easeProgress);
            this.controls.target.lerpVectors(startTarget, target, easeProgress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    focusOnSystem(systemName) {
        const position = this.factoryModels.getSystemPosition(systemName);
        if (position) {
            this.animateCameraTo(position, new THREE.Vector3(0, 0, 0));
        }
    }

    update(deltaTime) {
        if (!this.isInitialized) return;
        
        // Update controls
        if (this.controls) {
            this.controls.update();
        }
        
        // Update factory models
        if (this.factoryModels) {
            this.factoryModels.update(deltaTime);
        }
        
        // Update animations
        if (this.factoryAnimations) {
            this.factoryAnimations.update(deltaTime);
        }
    }

    render() {
        if (!this.isInitialized) return;
        
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        if (!this.camera || !this.renderer) return;
        
        const viewport = document.getElementById('viewport');
        const width = viewport ? viewport.clientWidth : window.innerWidth;
        const height = viewport ? viewport.clientHeight : window.innerHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    setSystemStatus(systemName, status) {
        if (this.factoryModels) {
            this.factoryModels.setSystemStatus(systemName, status);
        }
    }

    showSystemAlarm(systemName, alarmType) {
        if (this.factoryAnimations) {
            this.factoryAnimations.showSystemAlarm(systemName, alarmType);
        }
    }

    hideSystemAlarm(systemName) {
        if (this.factoryAnimations) {
            this.factoryAnimations.hideSystemAlarm(systemName);
        }
    }

    destroy() {
        // Remove event listeners
        if (this.renderer && this.renderer.domElement) {
            this.renderer.domElement.removeEventListener('click', this.onMouseClick);
            this.renderer.domElement.removeEventListener('mousemove', this.onMouseMove);
        }
        
        window.removeEventListener('resize', this.onWindowResize);
        
        // Dispose of Three.js objects
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        if (this.factoryModels) {
            this.factoryModels.destroy();
        }
        
        if (this.factoryAnimations) {
            this.factoryAnimations.destroy();
        }
        
        this.isInitialized = false;
    }
}

// Make globally accessible
window.Scene3D = Scene3D;
