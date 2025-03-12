const reviewService = require('../services/reviewService');
const messageHandlers = require('../messager/messageHandlers');

// Create a new review
exports.createReview = async (req, res) => {
    console.log('Incoming request body:', req.body);
    try {
        const review = await reviewService.createReview(req.body);
        console.log('Review created successfully:', review);
        res.status(201).json(review);
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(400).json({ message: error.message });
    }
};

// Get all reviews with optional filters
exports.getReviews = async (req, res) => {
    const { serviceId, userId, reviewType } = req.query;
    const filter = {};

    if (serviceId) filter.serviceId = serviceId;
    if (userId) filter.$or = [{ clientId: userId }, { providerId: userId }];
    if (reviewType) filter.reviewType = reviewType;

    try {
        const reviews = await reviewService.getReviews(filter);
        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Error fetching reviews.', error: error.message });
    }
};

// Update an existing review
exports.updateReview = async (req, res) => {
    try {
        const updatedReview = await reviewService.updateReview(req.params.id, req.body);
        console.log('Review updated successfully:', updatedReview);
        res.status(200).json(updatedReview);
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(400).json({ message: error.message });
    }
};

// Delete a review
exports.deleteReview = async (req, res) => {
    try {
        await reviewService.deleteReview(req.params.id);
        console.log('Review deleted successfully:', req.params.id);
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(400).json({ message: error.message });
    }
};

// Handle incoming messages from RabbitMQ
exports.handleMessage = async (req, res) => {
    try {
        const { routingKey, messageContent, replyQueue, correlationId } = req.body;

        // Ensure required fields are present
        if (!routingKey || !messageContent || !replyQueue || !correlationId) {
            return res.status(400).json({ success: false, message: 'Missing required fields in request body' });
        }

        // Get the RabbitMQ channel from the app context
        const rabbitMQChannel = req.app.get('rabbitMQChannel');
        if (!rabbitMQChannel) {
            return res.status(500).json({ success: false, message: 'RabbitMQ channel not available' });
        }

        // Process the message
        await messageHandlers.handleMessage(routingKey, messageContent, replyQueue, rabbitMQChannel, correlationId);
        res.status(200).json({ success: true, message: 'Message processed successfully' });
    } catch (error) {
        console.error('Error processing message:', error);
        res.status(500).json({ success: false, message: 'Failed to process message', error: error.message });
    }
};