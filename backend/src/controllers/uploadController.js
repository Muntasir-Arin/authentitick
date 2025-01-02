const Ticket = require('../models/ticket');
const { parseExcel } = require('../utils/parseExcel');

const uploadTickets = async (req, res) => {
  const tickets = parseExcel(req.file.path);
  const eventId = req.params.eventId;

  await Ticket.insertMany(tickets.map((code) => ({ code, eventId })));
  res.json({ message: 'Tickets uploaded successfully.' });
};

module.exports = { uploadTickets };
