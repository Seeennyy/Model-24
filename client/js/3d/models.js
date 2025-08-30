// Factory 3D Models
// Dependencies loaded via CDN: Three.js

class FactoryModels {
    constructor() {
        this.group = new THREE.Group();
        this.materials = {};
        this.systems = {};
        // Expose a Map-like view for animations that expect models map
        this.models = new Map();
        this.isInitialized = false;
    }

    async init() {
        try {
            console.log('🏗️ Initializing factory models...');
            
            this.setupMaterials();
            this.createWaterSystem();
            this.createElectrolysisSystem();
            this.createPurificationSystem();
            this.createCompressionSystem();
            this.createStorageSystem();
            this.createPowerSystem();
            this.createPipingAndConnections();
            this.setupSystemPositions();
            
            this.isInitialized = true;
            console.log('✅ Factory models initialized successfully!');
            
        } catch (error) {
            console.error('❌ Failed to initialize factory models:', error);
            throw error;
        }
    }

    setupMaterials() {
        // Base materials
        this.materials.metal = new THREE.MeshStandardMaterial({
            color: 0x8a8a8a,
            metalness: 0.7,
            roughness: 0.3
        });
        
        this.materials.plastic = new THREE.MeshStandardMaterial({
            color: 0x4a90e2,
            metalness: 0.1,
            roughness: 0.8
        });
        
        this.materials.glass = new THREE.MeshStandardMaterial({
            color: 0x87ceeb,
            metalness: 0.0,
            roughness: 0.1,
            transparent: true,
            opacity: 0.6
        });
        
        this.materials.warning = new THREE.MeshStandardMaterial({
            color: 0xffa500,
            metalness: 0.3,
            roughness: 0.7,
            emissive: 0x332200
        });
        
        this.materials.error = new THREE.MeshStandardMaterial({
            color: 0xff4444,
            metalness: 0.3,
            roughness: 0.7,
            emissive: 0x330000
        });
        
        this.materials.success = new THREE.MeshStandardMaterial({
            color: 0x44ff44,
            metalness: 0.3,
            roughness: 0.7,
            emissive: 0x003300
        });
    }

    createWaterSystem() {
        const waterGroup = new THREE.Group();
        waterGroup.name = 'waterSystem';
        
        // Water intake tank
        const tankGeometry = new THREE.CylinderGeometry(5, 5, 8, 8);
        const tank = new THREE.Mesh(tankGeometry, this.materials.metal);
        tank.position.set(-40, 4, 0);
        tank.castShadow = true;
        tank.receiveShadow = true;
        tank.userData.isEquipment = true;
        tank.userData.system = 'water';
        tank.userData.type = 'intake_tank';
        waterGroup.add(tank);
        
        // Water treatment unit
        const treatmentGeometry = new THREE.BoxGeometry(6, 4, 6);
        const treatment = new THREE.Mesh(treatmentGeometry, this.materials.plastic);
        treatment.position.set(-30, 2, 0);
        treatment.castShadow = true;
        treatment.receiveShadow = true;
        treatment.userData.isEquipment = true;
        treatment.userData.system = 'water';
        treatment.userData.type = 'treatment_unit';
        waterGroup.add(treatment);
        
        // Pumps
        const pumpGeometry = new THREE.CylinderGeometry(1, 1, 3, 8);
        const pump1 = new THREE.Mesh(pumpGeometry, this.materials.metal);
        pump1.position.set(-35, 1.5, 5);
        pump1.castShadow = true;
        pump1.userData.isEquipment = true;
        pump1.userData.system = 'water';
        pump1.userData.type = 'pump';
        waterGroup.add(pump1);
        
        const pump2 = new THREE.Mesh(pumpGeometry, this.materials.metal);
        pump2.position.set(-25, 1.5, -5);
        pump2.castShadow = true;
        pump2.userData.isEquipment = true;
        pump2.userData.system = 'water';
        pump2.userData.type = 'pump';
        waterGroup.add(pump2);
        
        this.systems.water = waterGroup;
        this.models.set('water', waterGroup);
        this.group.add(waterGroup);
    }

    createElectrolysisSystem() {
        const electrolysisGroup = new THREE.Group();
        electrolysisGroup.name = 'electrolysisSystem';
        
        // Main electrolysis stack
        const stackGeometry = new THREE.BoxGeometry(8, 12, 4);
        const stack = new THREE.Mesh(stackGeometry, this.materials.metal);
        stack.position.set(0, 6, 0);
        stack.castShadow = true;
        stack.receiveShadow = true;
        stack.userData.isEquipment = true;
        stack.userData.system = 'electrolysis';
        stack.userData.type = 'main_stack';
        electrolysisGroup.add(stack);
        
        // Individual cells (represented as smaller boxes)
        for (let i = 0; i < 5; i++) {
            const cellGeometry = new THREE.BoxGeometry(1.5, 10, 3);
            const cell = new THREE.Mesh(cellGeometry, this.materials.glass);
            cell.position.set(-3 + i * 1.5, 5, 0);
            cell.castShadow = true;
            cell.userData.isEquipment = true;
            cell.userData.system = 'electrolysis';
            cell.userData.type = 'cell';
            cell.userData.cellIndex = i;
            electrolysisGroup.add(cell);
        }
        
        // Thermal management system
        const thermalGeometry = new THREE.BoxGeometry(6, 3, 6);
        const thermal = new THREE.Mesh(thermalGeometry, this.materials.metal);
        thermal.position.set(0, 1.5, 8);
        thermal.castShadow = true;
        thermal.receiveShadow = true;
        thermal.userData.isEquipment = true;
        thermal.userData.system = 'electrolysis';
        thermal.userData.type = 'thermal_management';
        electrolysisGroup.add(thermal);
        
        this.systems.electrolysis = electrolysisGroup;
        this.models.set('electrolysis', electrolysisGroup);
        this.group.add(electrolysisGroup);
    }

    createPurificationSystem() {
        const purificationGroup = new THREE.Group();
        purificationGroup.name = 'purificationSystem';
        
        // Gas separator
        const separatorGeometry = new THREE.CylinderGeometry(3, 3, 6, 8);
        const separator = new THREE.Mesh(separatorGeometry, this.materials.metal);
        separator.position.set(20, 3, 0);
        separator.castShadow = true;
        separator.receiveShadow = true;
        separator.userData.isEquipment = true;
        separator.userData.system = 'purification';
        separator.userData.type = 'gas_separator';
        purificationGroup.add(separator);
        
        // Purification columns
        const columnGeometry = new THREE.CylinderGeometry(1.5, 1.5, 8, 8);
        const column1 = new THREE.Mesh(columnGeometry, this.materials.plastic);
        column1.position.set(25, 4, 5);
        column1.castShadow = true;
        column1.userData.isEquipment = true;
        column1.userData.system = 'purification';
        column1.userData.type = 'purification_column';
        purificationGroup.add(column1);
        
        const column2 = new THREE.Mesh(columnGeometry, this.materials.plastic);
        column2.position.set(25, 4, -5);
        column2.castShadow = true;
        column2.userData.isEquipment = true;
        column2.userData.system = 'purification';
        column2.userData.type = 'purification_column';
        purificationGroup.add(column2);
        
        this.systems.purification = purificationGroup;
        this.models.set('purification', purificationGroup);
        this.group.add(purificationGroup);
    }

    createCompressionSystem() {
        const compressionGroup = new THREE.Group();
        compressionGroup.name = 'compressionSystem';
        
        // Compressor units
        const compressorGeometry = new THREE.BoxGeometry(4, 3, 4);
        const compressor1 = new THREE.Mesh(compressorGeometry, this.materials.metal);
        compressor1.position.set(40, 1.5, 10);
        compressor1.castShadow = true;
        compressor1.receiveShadow = true;
        compressor1.userData.isEquipment = true;
        compressor1.userData.system = 'compression';
        compressor1.userData.type = 'compressor';
        compressionGroup.add(compressor1);
        
        const compressor2 = new THREE.Mesh(compressorGeometry, this.materials.metal);
        compressor2.position.set(40, 1.5, -10);
        compressor2.castShadow = true;
        compressor2.receiveShadow = true;
        compressor2.userData.isEquipment = true;
        compressor2.userData.system = 'compression';
        compressor2.userData.type = 'compressor';
        compressionGroup.add(compressor2);
        
        // Pressure vessels
        const vesselGeometry = new THREE.CylinderGeometry(2, 2, 6, 8);
        const vessel = new THREE.Mesh(vesselGeometry, this.materials.metal);
        vessel.position.set(50, 3, 0);
        vessel.castShadow = true;
        vessel.receiveShadow = true;
        vessel.userData.isEquipment = true;
        vessel.userData.system = 'compression';
        vessel.userData.type = 'pressure_vessel';
        compressionGroup.add(vessel);
        
        this.systems.compression = compressionGroup;
        this.models.set('compression', compressionGroup);
        this.group.add(compressionGroup);
    }

    createStorageSystem() {
        const storageGroup = new THREE.Group();
        storageGroup.name = 'storageSystem';
        
        // Storage tanks
        const tankGeometry = new THREE.CylinderGeometry(6, 6, 10, 8);
        const tank1 = new THREE.Mesh(tankGeometry, this.materials.metal);
        tank1.position.set(60, 5, 15);
        tank1.castShadow = true;
        tank1.receiveShadow = true;
        tank1.userData.isEquipment = true;
        tank1.userData.system = 'storage';
        tank1.userData.type = 'storage_tank';
        storageGroup.add(tank1);
        
        const tank2 = new THREE.Mesh(tankGeometry, this.materials.metal);
        tank2.position.set(60, 5, -15);
        tank2.castShadow = true;
        tank2.receiveShadow = true;
        tank2.userData.isEquipment = true;
        tank2.userData.system = 'storage';
        tank2.userData.type = 'storage_tank';
        storageGroup.add(tank2);
        
        // Loading/unloading station
        const stationGeometry = new THREE.BoxGeometry(8, 2, 4);
        const station = new THREE.Mesh(stationGeometry, this.materials.metal);
        station.position.set(70, 1, 0);
        station.castShadow = true;
        station.receiveShadow = true;
        station.userData.isEquipment = true;
        station.userData.system = 'storage';
        station.userData.type = 'loading_station';
        storageGroup.add(station);
        
        this.systems.storage = storageGroup;
        this.models.set('storage', storageGroup);
        this.group.add(storageGroup);
    }

    createPowerSystem() {
        const powerGroup = new THREE.Group();
        powerGroup.name = 'powerSystem';
        
        // Transformer
        const transformerGeometry = new THREE.BoxGeometry(3, 4, 3);
        const transformer = new THREE.Mesh(transformerGeometry, this.materials.metal);
        transformer.position.set(-20, 2, 20);
        transformer.castShadow = true;
        transformer.receiveShadow = true;
        transformer.userData.isEquipment = true;
        transformer.userData.system = 'power';
        transformer.userData.type = 'transformer';
        powerGroup.add(transformer);
        
        // Switchgear
        const switchgearGeometry = new THREE.BoxGeometry(4, 2, 2);
        const switchgear = new THREE.Mesh(switchgearGeometry, this.materials.metal);
        switchgear.position.set(-15, 1, 20);
        switchgear.castShadow = true;
        switchgear.receiveShadow = true;
        switchgear.userData.isEquipment = true;
        switchgear.userData.system = 'power';
        switchgear.userData.type = 'switchgear';
        powerGroup.add(switchgear);
        
        // Control panel
        const panelGeometry = new THREE.BoxGeometry(2, 3, 1);
        const panel = new THREE.Mesh(panelGeometry, this.materials.plastic);
        panel.position.set(-25, 1.5, 20);
        panel.castShadow = true;
        panel.userData.isEquipment = true;
        panel.userData.system = 'power';
        panel.userData.type = 'control_panel';
        powerGroup.add(panel);
        
        this.systems.power = powerGroup;
        this.models.set('power', powerGroup);
        this.group.add(powerGroup);
    }

    createPipingAndConnections() {
        // Create basic piping between systems
        this.createPiping();
        
        // Add connection points
        this.addConnectionPoints();
    }

    createPiping() {
        // Water to electrolysis
        this.createPipe(-30, 0, 0, 0, 0, 0, 0x0088ff);
        
        // Electrolysis to purification
        this.createPipe(4, 0, 0, 20, 0, 0, 0x00ff88);
        
        // Purification to compression
        this.createPipe(26, 0, 0, 40, 0, 0, 0x00ff88);
        
        // Compression to storage
        this.createPipe(50, 0, 0, 60, 0, 0, 0x00ff88);
        
        // Power connections
        this.createPipe(-20, 0, 20, 0, 0, 0, 0xffaa00);
    }

    createPipe(startX, startY, startZ, endX, endY, endZ, color) {
        const pipeGeometry = new THREE.CylinderGeometry(0.3, 0.3, 
            Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2) + Math.pow(endZ - startZ, 2)), 8);
        
        const pipeMaterial = new THREE.MeshStandardMaterial({ color: color });
        const pipe = new THREE.Mesh(pipeGeometry, pipeMaterial);
        
        // Position and rotate pipe
        pipe.position.set((startX + endX) / 2, (startY + endY) / 2, (startZ + endZ) / 2);
        
        const direction = new THREE.Vector3(endX - startX, endY - startY, endZ - startZ);
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
        pipe.setRotationFromQuaternion(quaternion);
        
        pipe.castShadow = true;
        this.group.add(pipe);
    }

    addConnectionPoints() {
        // Add connection points at system boundaries
        const connectionGeometry = new THREE.SphereGeometry(0.5, 8, 6);
        const connectionMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
        
        const connections = [
            { x: 0, y: 0, z: 0, system: 'electrolysis' },
            { x: 20, y: 0, z: 0, system: 'purification' },
            { x: 40, y: 0, z: 0, system: 'compression' },
            { x: 60, y: 0, z: 0, system: 'storage' }
        ];
        
        connections.forEach(conn => {
            const connection = new THREE.Mesh(connectionGeometry, connectionMaterial);
            connection.position.set(conn.x, conn.y, conn.z);
            connection.userData.isConnection = true;
            connection.userData.system = conn.system;
            this.group.add(connection);
        });
    }

    setupSystemPositions() {
        // Store system positions for camera focusing
        this.systemPositions = {
            water: new THREE.Vector3(-35, 0, 0),
            electrolysis: new THREE.Vector3(0, 0, 0),
            purification: new THREE.Vector3(20, 0, 0),
            compression: new THREE.Vector3(40, 0, 0),
            storage: new THREE.Vector3(60, 0, 0),
            power: new THREE.Vector3(-20, 0, 20)
        };
    }

    getSystemPosition(systemName) {
        return this.systemPositions[systemName];
    }

    setSystemStatus(systemName, status) {
        const system = this.systems[systemName];
        if (!system) return;
        
        // Update visual status based on system status
        this.updateSystemVisualStatus(system, status);
    }

    updateSystemVisualStatus(system, status) {
        system.traverse((child) => {
            if (child.material && child.userData.isEquipment) {
                switch (status) {
                    case 'running':
                        child.material = this.materials.success;
                        break;
                    case 'warning':
                        child.material = this.materials.warning;
                        break;
                    case 'error':
                        child.material = this.materials.error;
                        break;
                    case 'maintenance':
                        child.material = this.materials.warning;
                        break;
                    default:
                        child.material = this.materials.metal;
                }
            }
        });
    }

    update(deltaTime) {
        if (!this.isInitialized) return;
        
        // Animate running equipment
        this.animateRunningEquipment(deltaTime);
    }

    animateRunningEquipment(deltaTime) {
        // Add subtle animations for running equipment
        this.group.traverse((child) => {
            if (child.userData.isEquipment && child.userData.system) {
                // Add subtle rotation or scaling for running systems
                if (Math.random() < 0.01) { // 1% chance per frame
                    child.rotation.y += 0.01;
                }
            }
        });
    }

    destroy() {
        // Dispose of geometries and materials
        this.group.traverse((child) => {
            if (child.geometry) {
                child.geometry.dispose();
            }
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(material => material.dispose());
                } else {
                    child.material.dispose();
                }
            }
        });
        
        // Clear the group
        this.group.clear();
        this.isInitialized = false;
    }
}

// Make globally accessible
window.FactoryModels = FactoryModels;
