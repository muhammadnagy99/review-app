const express = require('express');
const Review = require('../models/review');
const router = express.Router();

/**
 * @desc    Get all reviews
 * @route   GET /api/reviews
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find();
        res.status(200).json({ success: true, data: reviews });
    } catch (err) {
        console.error('Error fetching reviews:', err);
        res.status(500).json({ success: false, error: 'Error fetching reviews' });
    }
});

/**
 * @desc    Get a single review by ID
 * @route   GET /api/reviews/:id
 * @access  Public
 */
router.get('/:id', async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ success: false, error: 'Review not found' });
        }
        res.status(200).json({ success: true, data: review });
    } catch (err) {
        console.error('Error fetching review:', err);
        res.status(500).json({ success: false, error: 'Error fetching review' });
    }
});

/**
 * @desc    Create a new review
 * @route   POST /api/reviews
 * @access  Public
 */
router.post('/', async (req, res) => {
    try {
        const review = await Review.create(req.body);
        res.status(201).json({ success: true, data: review });
    } catch (err) {
        console.error('Error creating review:', err);
        res.status(400).json({ success: false, error: 'Error creating review' });
    }
});

/**
 * @desc    Update a review by ID
 * @route   PUT /api/reviews/:id
 * @access  Public
 */
router.put('/:id', async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!review) {
            return res.status(404).json({ success: false, error: 'Review not found' });
        }
        res.status(200).json({ success: true, data: review });
    } catch (err) {
        console.error('Error updating review:', err);
        res.status(400).json({ success: false, error: 'Error updating review' });
    }
});

/**
 * @desc    Delete a review by ID
 * @route   DELETE /api/reviews/:id
 * @access  Public
 */
/**
 * @desc    Delete a review by ID
 * @route   DELETE /api/reviews/:id
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) {
            return res.status(404).json({ success: false, error: 'Review not found' });
        }
        res.status(200).json({ success: true, message: 'Review deleted successfully' });
    } catch (err) {
        console.error('Error deleting review:', err);
        res.status(400).json({ success: false, error: 'Error deleting review' });
    }
});

module.exports = router;