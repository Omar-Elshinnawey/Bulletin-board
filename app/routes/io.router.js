module.exports = function(io) {
    io.on('connection', (socket) => {
        socket.on('join', (data) => {
            socket.join(data.groupId);

            socket.to(data.groupId).emit('joined', data.nickname);
        });

        socket.on('leave', (data) => {
            socket.leave(data.groupId);

            socket.to(data.groupId).emit('left', data.nickname);
        });
    });
}