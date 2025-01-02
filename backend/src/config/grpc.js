const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = path.join(__dirname, '../../proto/ticket.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const ticketProto = grpc.loadPackageDefinition(packageDefinition);

module.exports = ticketProto;
