import { defineStore } from 'pinia';
import { io, Socket } from "socket.io-client";
import { ref } from 'vue';

export const useSocketStore = defineStore('socket', () => {
  const messages = ref<string[]>([]);
  const socket = io('http://localhost:3000');

  socket.on('connect', () => console.log('Connected to server'));

  socket.on('message', (msg: string) => {
    messages.value.push(msg);
  });

  const sendMessage = (msg: string) => {
    socket.emit('message', msg);
  };

  return { messages, sendMessage };
});
