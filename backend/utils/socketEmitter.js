let io = null;

export const setIO = (socketIO) => {
  io = socketIO;
};

export const emitToAll = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};

export const emitToAdmin = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
}; 