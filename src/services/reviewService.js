const Review = require('../models/review');

/**
 * Create a new review.
 * @param {Object} reviewData - The review data to create.
 * @returns {Promise<Object>} The created review.
 */
const createReview = async (reviewData) => {
    try {
        const review = new Review(reviewData);
        return await review.save();
    } catch (error) {
        console.error('Error creating review:', error);
        throw new Error('Error creating review');
    }
};

/**
 * Get all reviews based on a filter.
 * @param {Object} filter - The filter to apply.
 * @returns {Promise<Array>} The list of reviews.
 */
const getReviews = async (filter) => {
    try {
        return await Review.find(filter);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        throw new Error('Error fetching reviews');
    }
};

/**
 * Delete a review by ID.
 * @param {string} reviewId - The ID of the review to delete.
 * @returns {Promise<Object>} A success message.
 */
const deleteReview = async (reviewId) => {
    try {
        const deletedReview = await Review.findByIdAndDelete(reviewId);
        if (!deletedReview) {
            // noinspection ExceptionCaughtLocallyJS
            throw new Error('Review not found');
        }
        return { message: 'Review deleted successfully' };
    } catch (error) {
        console.error('Error deleting review:', error);
        throw new Error('Error deleting review');
    }
};

module.exports = {
    createReview,
    getReviews,
    deleteReview,
};