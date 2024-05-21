import { io } from 'socket.io-client';
const URL = 'https://multivar-server.onrender.com/';

export const socket = io(URL, {
    autoConnect: false,
    transports: ['websocket', 'polling', 'flashsocket']
});