const express = require('express');
const { createReview, getReviews, updateReview, deleteReview } = require('../controllers/reviewController');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const review = await createReview(req.body);
        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const reviews = await getReviews(req.query);
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedReview = await updateReview(req.params.id, req.body);
        res.json(updatedReview);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await deleteReview(req.params.id);
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
