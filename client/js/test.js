// Simple test file to verify JavaScript loading
console.log('🧪 Test.js loaded successfully');

// Test class definition
class TestClass {
    constructor() {
        this.name = 'TestClass';
        console.log('✅ TestClass constructor called');
    }
    
    test() {
        console.log('✅ TestClass.test() method called');
        return 'Test successful';
    }
}

// Make it globally available
window.TestClass = TestClass;

// Test efficiency calculation
function testEfficiencyCalculation() {
    console.log('🧪 Testing efficiency calculation...');
    
    // Test with 1 power unit
    const powerUnits = 1;
    const powerKw = powerUnits * 300; // 300 kW per unit
    const production = powerUnits * 60; // 60 Nm³/hr per unit
    const theoreticalEnergy = production * 3.54; // kWh/Nm³ H2 (theoretical - corrected value)
    const electricalEfficiency = (theoreticalEnergy / powerKw) * 100;
    
    console.log(`Power: ${powerKw} kW`);
    console.log(`Production: ${production} Nm³/hr`);
    console.log(`Theoretical Energy: ${theoreticalEnergy} kWh`);
    console.log(`Electrical Efficiency: ${electricalEfficiency.toFixed(1)}%`);
    
    // Test overall efficiency with simplified calculation
    const overallEfficiency = electricalEfficiency * 0.95;
    
    console.log(`Overall Efficiency: ${overallEfficiency.toFixed(1)}%`);
    
    if (overallEfficiency >= 60 && overallEfficiency <= 80) {
        console.log('✅ Efficiency is in realistic range (60-80%)');
    } else {
        console.log('❌ Efficiency is outside realistic range');
    }
}

// Run the test
testEfficiencyCalculation();

console.log('✅ TestClass made globally available');
console.log('✅ Test.js completed successfully');
