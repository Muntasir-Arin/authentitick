const express = require('express');
const { register, login } = require('../controllers/authController');
const { uploadTickets } = require('../controllers/ticketController');
const multer = require('../config/multer');

const authRouter = express.Router();
authRouter.post('/register', register);
authRouter.post('/login', login);

const ticketRouter = express.Router();
ticketRouter.post('/upload/:eventId', multer.single('file'), uploadTickets);

module.exports = { authRouter, ticketRouter };
