const SERVICES = {
    oil: { label: 'Oil change', km: 10000, months: 6 },
    airFilter: { label: 'Air filter', km: 20000, months: 12 },
    tires: { label: 'Tire rotation', km: 10000, months: 6 },
    brakeFluid: { label: 'Brake fluid', months: 24 },
    battery: { label: 'Battery check', months: 12 },
    transmission: { label: 'Transmission oil', km: 60000, months: 48 }
};

const DAY = 24 * 60 * 60 * 1000;

const addMonths = (date, months) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
};

const nextServices = (car, services) => {
    const now = new Date();
    return Object.entries(SERVICES).map(([type, rule]) => {
        const last = services
            .filter((s) => s.serviceType === type)
            .sort((a, b) => b.date - a.date)[0];
        if (!last) return null;

        const dueDate = addMonths(last.date, rule.months);
        const daysLeft = Math.round((dueDate - now) / DAY);
        const kmLeft = rule.km && last.mileage != null && car.mileage != null
            ? last.mileage + rule.km - car.mileage
            : null;

        const overdue = daysLeft < 0 || (kmLeft != null && kmLeft < 0);
        const soon = !overdue && (daysLeft <= 30 || (kmLeft != null && kmLeft <= 1000));
        return {
            type,
            label: rule.label,
            last,
            dueDate,
            daysLeft,
            kmLeft,
            status: overdue ? 'overdue' : soon ? 'soon' : 'ok'
        };
    })
        .filter(Boolean)
        .sort((a, b) => ['overdue', 'soon', 'ok'].indexOf(a.status) - ['overdue', 'soon', 'ok'].indexOf(b.status) || a.daysLeft - b.daysLeft);
};

const describeDue = (s) => {
    if (s.status === 'overdue') {
        if (s.kmLeft != null && s.kmLeft < 0) return `${Math.abs(s.kmLeft).toLocaleString()} km overdue`;
        return `${Math.abs(s.daysLeft)} days overdue`;
    }
    if (s.kmLeft != null && s.kmLeft <= 1000) return `due in ${s.kmLeft.toLocaleString()} km`;
    return s.daysLeft <= 60 ? `due in ${s.daysLeft} days` : `due ${s.dueDate.toLocaleDateString()}`;
};

module.exports = { SERVICES, nextServices, describeDue };
