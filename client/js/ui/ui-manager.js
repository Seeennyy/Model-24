// UI Manager
// Dependencies loaded via CDN: None

class UIManager {
    constructor(app = null) {
        this.app = app;
        this.isInitialized = false;
    }
    
    async init() {
        this.isInitialized = true;
        console.log('✅ UIManager initialized');
    }
    
    destroy() {
        this.isInitialized = false;
    }
}

// Make globally accessible
window.UIManager = UIManager;