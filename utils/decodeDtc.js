const SYSTEMS = { P: 'Powertrain', B: 'Body', C: 'Chassis', U: 'Network' };

const P_AREAS = {
    '0': 'Fuel, air metering and emissions',
    '1': 'Fuel and air metering',
    '2': 'Fuel injector circuit',
    '3': 'Ignition system or misfire',
    '4': 'Auxiliary emission controls',
    '5': 'Vehicle speed and idle control',
    '6': 'Computer output circuit',
    '7': 'Transmission',
    '8': 'Transmission',
    '9': 'Transmission',
    A: 'Hybrid propulsion',
    B: 'Hybrid propulsion',
    C: 'Hybrid propulsion'
};

const decodeDtc = (code) => {
    const system = SYSTEMS[code[0]];
    const type = code[1] === '0' || (code[0] === 'P' && code[1] === '2')
        ? 'Generic code'
        : 'Manufacturer specific code';
    const area = code[0] === 'P' ? P_AREAS[code[2]] : null;
    return [system, area, type].filter(Boolean).join(' - ');
};

module.exports = decodeDtc;
