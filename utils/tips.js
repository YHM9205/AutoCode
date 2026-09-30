const TIPS = [
    'If the check engine light is flashing, stop driving. It usually means a misfire that can damage the catalytic converter.',
    'Ask the garage to give you back the old part they replaced. It shows the work was really done.',
    'A loose fuel cap can turn on the check engine light. Tighten it before paying for a scan.',
    'Get the price in writing before any repair starts, and ask them to call you before adding anything.',
    'Change the oil every 10,000 km or 6 months, whichever comes first.',
    'Temperature in the red? Pull over, turn the engine off, and never open the radiator cap while it is hot.',
    'Grinding brakes mean metal on metal. Get them checked this week, not next month.',
    'A second opinion costs you one visit. A wrong repair can cost you the whole car.',
    'Batteries in Gulf heat last about 2 to 3 years. Test yours before summer.',
    'Check tire pressure once a month while the tires are cold. The right numbers are on the driver door frame.'
];

const randomTip = () => TIPS[Math.floor(Math.random() * TIPS.length)];

module.exports = { randomTip };
