const reviewService = require('../services/reviewService');

// Handler for adding a review
const handleAddReview = async (messageContent, replyQueue, channel, correlationId) => {
    try {
        const review = await reviewService.createReview(messageContent);
        console.log("Review saved to database:", review);

        // Send success response back to the reply queue
        channel.sendToQueue(
            replyQueue,
            Buffer.from(JSON.stringify({ status: 'success', review })),
            { correlationId }
        );
    } catch (error) {
        console.error("Error saving review to database:", error);

        // Send error response back to the reply queue
        channel.sendToQueue(
            replyQueue,
            Buffer.from(JSON.stringify({ status: 'error', message: error.message })),
            { correlationId }
        );
    }
};

// Handler for fetching reviews
const handleGetReviews = async (messageContent, replyQueue, channel, correlationId) => {
    try {
        const reviews = await reviewService.getReviews(messageContent);
        console.log("Fetched reviews based on filter:", reviews);

        // Send success response back to the reply queue
        channel.sendToQueue(
            replyQueue,
            Buffer.from(JSON.stringify({ status: 'success', reviews })),
            { correlationId }
        );
    } catch (error) {
        console.error("Error fetching reviews:", error);

        // Send error response back to the reply queue
        channel.sendToQueue(
            replyQueue,
            Buffer.from(JSON.stringify({ status: 'error', message: error.message })),
            { correlationId }
        );
    }
};

// Main message handler to route messages based on the routing key
const handleMessage = async (routingKey, messageContent, replyQueue, channel, correlationId) => {
    try {
        switch (routingKey) {
            case 'Zokhrof.Interiordesigner.Projects.AddReview':
                await handleAddReview(messageContent, replyQueue, channel, correlationId);
                break;
            case 'Zokhrof.Interiordesigner.Projects.GetReviews':
                await handleGetReviews(messageContent, replyQueue, channel, correlationId);
                break;
            default:
                console.warn(`Unhandled routing key: ${routingKey}`);

                // Send error response for unhandled routing keys
                channel.sendToQueue(
                    replyQueue,
                    Buffer.from(JSON.stringify({ status: 'error', message: 'Unhandled routing key' })),
                    { correlationId }
                );
                break;
        }
    } catch (error) {
        console.error("Error in handleMessage:", error);

        // Send error response if something goes wrong in the main handler
        channel.sendToQueue(
            replyQueue,
            Buffer.from(JSON.stringify({ status: 'error', message: error.message })),
            { correlationId }
        );
    }
};

module.exports = {
    handleMessage,
};