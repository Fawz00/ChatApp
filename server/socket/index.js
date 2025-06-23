const socketIo = require('socket.io');

const connectedUsers = new Map();

let io;

const initSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true,
    }
  });

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('register', (userId) => {
      connectedUsers.set(userId, socket.id);
    });

    socket.on('disconnect', () => {
      for (const [userId, sockId] of connectedUsers.entries()) {
        if (sockId === socket.id) {
          connectedUsers.delete(userId);
          break;
        }
      }
    });
  });
};

const sendSocketNotification = (userId, notifData) => {
  const socketId = connectedUsers.get(userId.toString());
  if (socketId && io) {
    io.to(socketId).emit('notification', notifData);
  }
};

module.exports = {
  initSocket,
  sendSocketNotification,
  connectedUsers
};
