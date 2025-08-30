// Chart Manager
// Dependencies loaded via CDN: Chart.js

class ChartManager {
    constructor() {
        this.isInitialized = false;
        this.chart = null;
    }
    
    async init() {
        console.log('📊 Initializing Chart Manager...');
        
        // Initialize chart after a short delay to ensure DOM is ready
        setTimeout(() => {
            this.initializeChart();
        }, 1000);
        
        this.isInitialized = true;
        console.log('✅ Chart Manager initialized');
    }
    
    initializeChart() {
        // Initialize simple production chart
        const chartCanvas = document.getElementById('system-performance-chart');
        if (chartCanvas) {
            this.chart = new Chart(chartCanvas, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Production Rate (Nm³/hr)',
                        data: [],
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Production Rate Over Time',
                            color: '#2c3e50',
                            font: {
                                size: 16,
                                weight: 'bold'
                            }
                        },
                        legend: {
                            position: 'top',
                            labels: {
                                color: '#2c3e50',
                                usePointStyle: true
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Time',
                                color: '#7f8c8d'
                            },
                            ticks: {
                                color: '#7f8c8d'
                            },
                            grid: {
                                color: 'rgba(127, 140, 141, 0.1)'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Production Rate (Nm³/hr)',
                                color: '#7f8c8d'
                            },
                            ticks: {
                                color: '#7f8c8d'
                            },
                            grid: {
                                color: 'rgba(127, 140, 141, 0.1)'
                            }
                        }
                    }
                }
            });
        }
        
        console.log('📊 Chart initialized');
    }
    
    updateChart() {
        if (!this.isInitialized || !this.chart) return;
        
        const currentTime = new Date().toLocaleTimeString();
        
        // Get current production rate
        const productionRateElement = document.getElementById('production-rate');
        let productionRate = 0;
        if (productionRateElement) {
            const rateText = productionRateElement.textContent;
            productionRate = parseFloat(rateText) || 0;
        }
        
        // Add new data point
        this.chart.data.labels.push(currentTime);
        this.chart.data.datasets[0].data.push(productionRate);
        
        // Keep only last 10 data points
        if (this.chart.data.labels.length > 10) {
            this.chart.data.labels.shift();
            this.chart.data.datasets[0].data.shift();
        }
        
        this.chart.update('none');
        console.log('📊 Chart updated with production rate:', productionRate);
    }
    
    destroy() {
        if (this.chart && this.chart.destroy) {
            this.chart.destroy();
        }
        this.chart = null;
        this.isInitialized = false;
    }
}

// Make globally accessible
window.ChartManager = ChartManager;