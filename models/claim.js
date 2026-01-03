const mongoose = require('mongoose');

const ClaimSchema = new mongoose.Schema({
    transferNumber: {
        type: String,
        required: true,
        trim: true
    },
    branch: {
        type: String,
        required: true
    },
    companyId: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productName: {
        type: String,
        required: true,
        trim: true
    },
    productCode: {
        type: String,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    problem: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Claim', ClaimSchema);
