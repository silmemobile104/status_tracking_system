const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StockRequestItemSchema = new Schema({
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 }
});

const StockRequestSchema = new Schema({
    companyId: { type: String, required: true },
    branch: { type: String, required: true },
    title: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [StockRequestItemSchema],
    note: { type: String, default: '' },
    status: {
        type: String,
        enum: ['pending', 'processing', 'received'],
        default: 'pending'
    },
    expectedArrivalDate: { type: Date },
    requestedDate: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StockRequest', StockRequestSchema);
