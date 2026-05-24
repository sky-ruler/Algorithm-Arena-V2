const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { logger } = require('../utils/logger');
const { env } = require('./env');
const User = require('../src/features/users/User.model');
const Clan = require('../src/features/clans/Clan.model');

let io;

const extractBearerToken = (socket) => {
  const handshakeToken = socket.handshake?.auth?.token;
  if (typeof handshakeToken === 'string' && handshakeToken.trim()) {
    return handshakeToken.trim();
  }

  const headerAuth = socket.handshake?.headers?.authorization;
  if (typeof headerAuth === 'string' && headerAuth.startsWith('Bearer ')) {
    return headerAuth.split(' ')[1];
  }

  return null;
};

const resolveSocketUserId = async (socket) => {
  const token = extractBearerToken(socket);
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.id).select('_id status').lean();
    if (!user || user.status === 'Banned') return null;
    return user._id.toString();
  } catch {
    return null;
  }
};

const isValidClanId = (clanId) => typeof clanId === 'string' && /^[a-f\d]{24}$/i.test(clanId);

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: env.CORS_ORIGINS,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    logger.info('New client connected', { socketId: socket.id });
    const socketUserIdPromise = resolveSocketUserId(socket);

    socket.on('join_clan', async (clanId) => {
      const socketUserId = await socketUserIdPromise;
      if (!socketUserId) {
        socket.emit('clan_join_denied', { message: 'Authentication required to join clan channels' });
        logger.warn('Socket join_clan denied: unauthenticated', { socketId: socket.id, clanId });
        return;
      }

      if (!isValidClanId(clanId)) {
        socket.emit('clan_join_denied', { message: 'Invalid clan id' });
        logger.warn('Socket join_clan denied: invalid clan id', { socketId: socket.id, clanId, userId: socketUserId });
        return;
      }

      const clan = await Clan.findOne({
        _id: clanId,
        $or: [{ members: socketUserId }, { chief: socketUserId }],
      })
        .select('_id')
        .lean();

      if (!clan) {
        socket.emit('clan_join_denied', { message: 'Not authorized for this clan channel' });
        logger.warn('Socket join_clan denied: not a clan member', { socketId: socket.id, clanId, userId: socketUserId });
        return;
      }

      socket.join(`clan_${clanId}`);
      logger.info('Client joined clan room', { socketId: socket.id, clanId, userId: socketUserId });
    });

    socket.on('leave_clan', (clanId) => {
      socket.leave(`clan_${clanId}`);
      logger.info('Client left clan room', { socketId: socket.id, clanId });
    });

    socket.on('disconnect', () => {
      logger.info('Client disconnected', { socketId: socket.id });
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

const emitEvent = (event, data) => {
  if (io) {
    io.emit(event, data);
    logger.info('Socket event emitted', { event, data });
  }
};

const emitToRoom = (room, event, data) => {
  if (io) {
    io.to(room).emit(event, data);
    logger.info(`Socket event emitted to room ${room}`, { event, data });
  }
};

module.exports = { initSocket, getIO, emitEvent, emitToRoom };
