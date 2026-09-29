
const WMI = {
    JTH: 'Lexus', JTJ: 'Lexus', '2T2': 'Lexus',
    JT: 'Toyota', '4T': 'Toyota', '5T': 'Toyota', '2T': 'Toyota',
    JN: 'Nissan', '1N': 'Nissan', '3N': 'Nissan', '5N1': 'Nissan',
    JH4: 'Other', JH: 'Honda', '1HG': 'Honda', '2HG': 'Honda', '5FN': 'Honda', '5J6': 'Honda',
    KMH: 'Hyundai', KM8: 'Hyundai', '5NP': 'Hyundai', '5NM': 'Hyundai',
    KNA: 'Kia', KND: 'Kia', '5XY': 'Kia',
    JA: 'Mitsubishi', JMY: 'Mitsubishi', ML3: 'Mitsubishi',
    JM: 'Mazda',
    '1F': 'Ford', '2F': 'Ford', '3F': 'Ford', WF0: 'Ford',
    '1GT': 'GMC', '2GT': 'GMC', '3GT': 'GMC', '1GK': 'GMC', '1GD': 'GMC',
    '1G1': 'Chevrolet', '1GC': 'Chevrolet', '1GN': 'Chevrolet', '2G1': 'Chevrolet', '3G1': 'Chevrolet', '3GN': 'Chevrolet', KL: 'Chevrolet',
    '1B3': 'Dodge', '1D3': 'Dodge', '1D7': 'Dodge', '2B3': 'Dodge', '2C3': 'Dodge', '3D7': 'Dodge',
    '1J4': 'Jeep', '1J8': 'Jeep', '1C4': 'Jeep',
    WBA: 'BMW', WBS: 'BMW', WBX: 'BMW', WBY: 'BMW', '5UX': 'BMW', '5YM': 'BMW',
    WDB: 'Mercedes-Benz', WDC: 'Mercedes-Benz', WDD: 'Mercedes-Benz', WDF: 'Mercedes-Benz', W1K: 'Mercedes-Benz', W1N: 'Mercedes-Benz', '4JG': 'Mercedes-Benz', '55S': 'Mercedes-Benz',
    WAU: 'Audi', WA1: 'Audi', WUA: 'Audi',
    WVW: 'Volkswagen', WVG: 'Volkswagen', WV1: 'Volkswagen', WV2: 'Volkswagen', '3VW': 'Volkswagen', '1VW': 'Volkswagen',
    WP0: 'Porsche', WP1: 'Porsche',
    SAL: 'Land Rover'
};

const COUNTRIES = {
    1: 'USA', 4: 'USA', 5: 'USA', 2: 'Canada', 3: 'Mexico', 6: 'Australia', 9: 'Brazil',
    J: 'Japan', K: 'South Korea', L: 'China', M: 'India', S: 'United Kingdom',
    V: 'France / Spain', W: 'Germany', Y: 'Sweden / Finland', Z: 'Italy'
};

const VALUES = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
    J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
    S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9
};
const WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

const YEAR_CODES = 'ABCDEFGHJKLMNPRSTVWXY123456789';

const checkDigit = (vin) => {
    const sum = [...vin].reduce((total, char, i) => {
        const value = /\d/.test(char) ? Number(char) : VALUES[char];
        return total + value * WEIGHTS[i];
    }, 0);
    const rest = sum % 11;
    return rest === 10 ? 'X' : String(rest);
};

const getMake = (vin) => {
    const prefix = [3, 2].map((n) => vin.slice(0, n)).find((p) => WMI[p]);
    return prefix ? WMI[prefix] : null;
};

const getYear = (vin, northAmerican) => {
    const index = YEAR_CODES.indexOf(vin[9]);
    if (index < 0) return null;
    const first = 1980 + index;
    if (northAmerican) return /[A-Z]/.test(vin[6]) ? first + 30 : first;
    return first + 30 <= new Date().getFullYear() + 1 ? first + 30 : first;
};

const decodeVin = (input) => {
    const vin = String(input || '').trim().toUpperCase();
    if (vin.length !== 17) return { valid: false, error: 'A VIN has exactly 17 characters' };
    if (/[IOQ]/.test(vin)) return { valid: false, error: 'A VIN never uses the letters I, O or Q' };
    if (!/^[A-Z0-9]{17}$/.test(vin)) return { valid: false, error: 'A VIN only has letters and numbers' };

    const northAmerican = /^[1-5]/.test(vin);
    const expected = checkDigit(vin);
    if (northAmerican && vin[8] !== expected) {
        return { valid: false, error: `This VIN is not valid, check for a typo (check digit should be ${expected})` };
    }

    return {
        valid: true,
        vin,
        make: getMake(vin),
        year: getYear(vin, northAmerican),
        country: COUNTRIES[vin[0]] || null,
        checked: vin[8] === expected
    };
};

module.exports = decodeVin;
