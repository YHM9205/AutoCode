const PENALTY = { stop: 40, soon: 20, unknown: 15, drive: 5 };

const carHealth = (openLogs, services = []) => {
    const faults = openLogs.reduce((sum, log) => sum + (PENALTY[log.severity] || 10), 0);
    const late = services.filter((s) => s.status === 'overdue').length * 10;
    const score = Math.max(0, 100 - faults - late);

    if (openLogs.some((l) => l.severity === 'stop')) return { score, level: 'stop', text: 'Stop the car and get it checked' };
    if (score < 60) return { score, level: 'soon', text: 'Needs a workshop soon' };
    if (score < 90) return { score, level: 'watch', text: 'Keep an eye on it' };
    return { score, level: 'good', text: 'Your car is in good shape' };
};

module.exports = { carHealth };
