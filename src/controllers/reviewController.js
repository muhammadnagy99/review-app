const reviewService = require('../services/reviewService');
const messageHandlers = require('../messager/messageHandlers');

exports.createReview = async (req, res) => {
    console.log('Incoming request body:', req.body);
    try {
        const review = await reviewService.createReview(req.body);
        res.status(201).json(review);
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(400).json({ message: error.message });
    }
};

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
        res.status(500).json({ message: 'Error fetching reviews.', error: error.message });
    }
};
exports.updateReview = async (req, res) => {
    try {
        const updatedReview = await reviewService.updateReview(req.params.id, req.body);
        res.status(200).json(updatedReview);
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(400).json({ message: error.message });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        await reviewService.deleteReview(req.params.id);
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(400).json({ message: error.message });
    }
};

exports.handleMessage = async (req, res) => {
    try {
        const { routingKey, messageContent, replyQueue, correlationId } = req.body;
        await messageHandlers.handleMessage(routingKey, messageContent, replyQueue, req.app.get('rabbitMQChannel'), correlationId);
        res.status(200).json({ success: true, message: 'Message processed successfully' });
    } catch (error) {
        console.error('Error processing message:', error);
        res.status(500).json({ success: false, message: 'Failed to process message', error: error.message });
    }
};
