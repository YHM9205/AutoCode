// Super owner > admin / moderator (staff) > normal users
const STAFF_ROLES = ['moderator', 'admin'];
const ASSIGNABLE_ROLES = ['user', 'owner', 'technician', 'moderator', 'admin'];

const isSuperOwner = (user) => user.role === 'superowner';
const isStaff = (user) => STAFF_ROLES.includes(user.role);

// true when the user can open Agent Control
const canControlAgent = (user) => {
    if (isSuperOwner(user)) return true;
    if (!isStaff(user)) return false;
    if (user.agentAccess === 'permanent') return true;
    return user.agentAccess === 'temporary' && user.agentAccessUntil > new Date();
};

module.exports = { STAFF_ROLES, ASSIGNABLE_ROLES, isSuperOwner, isStaff, canControlAgent };
