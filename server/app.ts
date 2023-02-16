import {Session} from "../models/Session";
import {Socket} from "socket.io";

const express = require('express');
const app = express();
const http = require('http');
const httpServer = http.createServer(app);
const {Server} = require("socket.io");

httpServer.listen(3000, () => {
    console.log('listening on *:3000');
});

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["POST"]
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');

    welcomeUser(socket);

    socket.on('send-nickname', (nickname: string) => {
        socket.nickname = nickname;
    });

    socket.on('create-room', (room: string) => {
        createRoom(socket, room);
    });

    /*
    socket.on('join-room', (room) => {
        // Unirse a la sala
        socket.join(room);
    });

    socket.on('send', (room, username, message) => {
        io.to(room).emit('sended', username, message);
    });
     */
});

function welcomeUser(socket: Socket) {
    // Enviar session al nuevo cliente
    let room = socket.id;
    let rooms = [...io.sockets.adapter.rooms.keys()].reverse();

    let session = new Session(room, rooms);
    io.to(socket.id).emit('welcome-user', session);

    // Avisar de la nueva room a todos los clientes
    socket.broadcast.emit('new-room', socket.id);
}

function createRoom(socket: Socket, room: string) {
    console.log(`room ${room} was created`);

    // Enviar notificación
    io.emit('new-room', room);

    // Unirse a la sala
    socket.join(room);
}