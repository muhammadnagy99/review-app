const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    serviceId: { type: String, required: true },
    clientId: { type: String, required: true },
    providerId: { type: String, required: true },
    reviewType: { type: String, enum: ['client', 'provider'], required: true },
    comment: { type: String, maxLength: 500, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Review', reviewSchema);