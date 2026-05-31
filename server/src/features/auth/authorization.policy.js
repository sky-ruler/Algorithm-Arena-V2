const GLOBAL_OVERRIDE_ROLES = new Set(['admin', 'moderator']);
const CHIEF_ROLES = new Set(['clan-chief', 'admin']);

const isGlobalOverrideRole = (actor) => GLOBAL_OVERRIDE_ROLES.has(actor?.role);

const canAccessChiefScopedAction = (actor) => {
  if (!actor) return false;
  return CHIEF_ROLES.has(actor.role) || Boolean(actor.isChief);
};

const canAccessAdminOnlyAction = (actor) => actor?.role === 'admin';

module.exports = {
  GLOBAL_OVERRIDE_ROLES,
  CHIEF_ROLES,
  canAccessAdminOnlyAction,
  canAccessChiefScopedAction,
  isGlobalOverrideRole,
};