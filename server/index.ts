const express = require('express');
const app = express();
const http = require('http');
const httpServer = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["POST"]
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');

    // Enviar las rooms disponibles
    let rooms = [...io.sockets.adapter.rooms.keys()];
    io.emit('list-rooms', rooms);

    /*
    socket.on('create-room', (room) => {
        console.log(`room ${room} was created`);

        // Enviar notificación
        io.emit('created-room', room);

        // Unirse a la sala
        socket.join(room);
    });

    socket.on('join-room', (room) => {
        // Unirse a la sala
        socket.join(room);
    });

    socket.on('send', (room, username, message) => {
        io.to(room).emit('sended', username, message);
    });
     */
});

httpServer.listen(3000, () => {
    console.log('listening on *:3000');
});
