import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import userRoutes from "./routes/users"; 

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes); 

// Create HTTP + WebSocket server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
