const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const newsRoutes = require('./routes/newsRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }, // Allow all origins for socket connections
});
app.set('io',io);
// Handle socket.io connections
io.on('connection', (socket) => {
  console.log('Client connected');

  // Listen for disconnections
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  // You can add more socket event listeners here if needed
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/news', newsRoutes); // Pass the socket.io instance to newsRoutes

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
