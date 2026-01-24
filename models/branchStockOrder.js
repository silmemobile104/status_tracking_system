const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BranchStockOrderSchema = new Schema({
    orderDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    expectedDate: {
        type: Date,
        // Optional: can be null if not known initially
    },
    orderName: {
        type: String, // e.g., "Order for March"
        required: true
    },
    items: [{
        productName: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        trackingNumber: {
            type: String,
            default: ''
        }
    }],
    branch: {
        type: String,
        required: true // The target branch
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    companyId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'shipped', 'arrived', 'canceled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('BranchStockOrder', BranchStockOrderSchema);
