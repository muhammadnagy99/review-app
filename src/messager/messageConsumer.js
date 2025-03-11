const amqp = require('amqplib');
const { handleMessage } = require('./messageHandlers');

let channel;

const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URI);
        channel = await connection.createChannel();

        const queueName = 'zokhrof.interiordesigner.reviews.q';

        // Declare queue explicitly (idempotent operation)
        await channel.assertQueue(queueName, {
            durable: true, // recommended to persist messages
        });

        // Start consuming messages
        channel.consume(queueName, async (msg) => {
            if (msg !== null) {
                const routingKey = msg.fields.routingKey;
                const messageContent = JSON.parse(msg.content.toString());
                const replyQueue = msg.properties.replyTo;
                const correlationId = msg.properties.correlationId;

                console.debug(`Received message: ${JSON.stringify(messageContent)}`);
                console.debug(`Routing Key: ${routingKey}`);
                console.debug(`Reply Queue: ${replyQueue}`);
                console.debug(`Correlation ID: ${correlationId}`);

                try {
                    await handleMessage(routingKey, messageContent, replyQueue, channel, correlationId);
                } catch (error) {
                    console.error("Error processing message:", error);

                    if (replyQueue) {
                        channel.sendToQueue(replyQueue, Buffer.from(JSON.stringify({ 
                            status: 'error', 
                            message: error.message 
                        })), { correlationId });
                    }
                }

                channel.ack(msg);
            }
        });

        console.log(`Waiting for messages in '${queueName}'.`);

        connection.on('close', () => {
            console.error('RabbitMQ connection closed. Attempting to reconnect...');
            setTimeout(connectRabbitMQ, 5000);
        });

        connection.on('error', (error) => {
            console.error('RabbitMQ connection error:', error);
        });

    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
        setTimeout(connectRabbitMQ, 5000);
    }
};

module.exports = connectRabbitMQ;
