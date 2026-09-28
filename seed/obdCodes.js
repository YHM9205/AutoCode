// Run once: node seed/obdCodes.js
require('dotenv').config();
const mongoose = require('mongoose');
const ObdCode = require('../models/ObdCode');

const codes = [
    { code: 'P0217', name: 'Engine overheat condition', problem: 'Engine coolant temperature too high', solution: 'Stop and let the engine cool, check coolant, fan and thermostat', severity: 'stop' },
    { code: 'P0524', name: 'Engine oil pressure too low', problem: 'Oil pressure below safe level', solution: 'Stop the engine, check oil level and oil pump', severity: 'stop' },
    { code: 'P0300', name: 'Random/multiple cylinder misfire', problem: 'Engine misfiring on several cylinders', solution: 'Check spark plugs, coils and fuel injectors', severity: 'soon' },
    { code: 'P0171', name: 'System too lean (bank 1)', problem: 'Too much air or too little fuel', solution: 'Check vacuum leaks, MAF sensor and fuel pressure', severity: 'soon' },
    { code: 'P0101', name: 'MAF sensor range/performance', problem: 'Mass air flow reading out of range', solution: 'Clean or replace the MAF sensor, check air filter', severity: 'soon' },
    { code: 'P0700', name: 'Transmission control system malfunction', problem: 'Transmission module reported a fault', solution: 'Scan the transmission module for the detailed code', severity: 'soon' },
    { code: 'P0420', name: 'Catalyst efficiency below threshold (bank 1)', problem: 'Catalytic converter not working efficiently', solution: 'Check O2 sensors and exhaust leaks, then the converter', severity: 'drive' },
    { code: 'P0128', name: 'Coolant below thermostat temperature', problem: 'Engine takes too long to warm up', solution: 'Replace the thermostat', severity: 'drive' },
    { code: 'P0442', name: 'EVAP small leak detected', problem: 'Small leak in the fuel vapor system', solution: 'Check the gas cap and EVAP hoses', severity: 'drive' },
    { code: 'P0455', name: 'EVAP large leak detected', problem: 'Large leak in the fuel vapor system', solution: 'Check the gas cap first, then EVAP hoses and purge valve', severity: 'drive' }
];

(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    for (const c of codes) {
        await ObdCode.updateOne({ code: c.code }, { $set: { ...c, category: c.code[0] } }, { upsert: true });
    }
    console.log(`Seeded ${codes.length} codes`);
    await mongoose.disconnect();
})();
