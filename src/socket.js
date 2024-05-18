import { io } from 'socket.io-client';
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://10.0.0.54:3000';

export const socket = io(URL);