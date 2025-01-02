const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'ticket-verification',
  brokers: ['localhost:9092'],
});

module.exports = kafka;
