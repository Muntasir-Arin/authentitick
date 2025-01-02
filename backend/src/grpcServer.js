const grpc = require('@grpc/grpc-js');
const ticketProto = require('./config/grpc');
const Ticket = require('./models/ticket');
const Event = require('./models/event');
const { sendMessage } = require('./services/kafkaProducer');

const verifyTicket = async (call, callback) => {
  try {
    const { ticketCode, eventId } = call.request;

    const event = await Event.findById(eventId);
    if (!event) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: 'Event not found.',
      });
    }

    const ticket = await Ticket.findOne({ code: ticketCode, eventId });
    if (!ticket) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: 'Ticket not found or invalid.',
      });
    }

    if (ticket.status === 'used') {
      return callback({
        code: grpc.status.ALREADY_EXISTS,
        message: 'Ticket already used.',
      });
    }

    ticket.status = 'used';
    await ticket.save();

    await sendMessage('ticket-verification', {
      ticketCode,
      eventId,
      status: 'used',
      timestamp: new Date().toISOString(),
    });

    callback(null, {
      success: true,
      message: 'Ticket verified successfully.',
    });
  } catch (error) {
    console.error('Error verifying ticket:', error);
    callback({
      code: grpc.status.INTERNAL,
      message: 'An internal error occurred.',
    });
  }
};

const startGrpcServer = () => {
  const server = new grpc.Server();
  server.addService(ticketProto.TicketService.service, { verifyTicket });
  const PORT = process.env.GRPC_PORT || 50051;
  server.bindAsync(
    `0.0.0.0:${PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      if (error) {
        console.error('Failed to start gRPC server:', error);
        process.exit(1);
      }
      console.log(`gRPC server running on port ${port}`);
      server.start();
    }
  );
};

module.exports = startGrpcServer;
