import { io } from 'socket.io-client';
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://172.16.5.4:3000';

export const socket = io(URL);