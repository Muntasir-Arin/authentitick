require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { authRouter, ticketRouter } = require('./src/routes/authRoutes');
const startGrpcServer = require('./src/grpcServer');

const app = express();
app.use(express.json());
app.use('/auth', authRouter);
app.use('/tickets', ticketRouter);

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`HTTP server running on port ${PORT}`));

startGrpcServer();
