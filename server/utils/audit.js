const AuditLog = require('../models/AuditLog');
const { logger } = require('./logger');

const logAudit = async ({ action, actorId, targetType, targetId, metadata }) => {
  try {
    await AuditLog.create({
      action,
      actorId,
      targetType,
      targetId,
      metadata,
    });
  } catch (error) {
    logger.warn('Failed to write audit log', { error, action, actorId, targetType, targetId });
  }
};

module.exports = { logAudit };

