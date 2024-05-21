import { io } from 'socket.io-client';
const URL = process.env.NODE_ENV === 'production' ? undefined : 'https://multivar-server.onrender.com/';

export const socket = io(URL, {
    autoConnect:false
});