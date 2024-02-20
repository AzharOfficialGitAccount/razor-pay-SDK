const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    PaymentId: {
        type: String,
        default: "PaymentId"
    },
    orderId: String,
    amount: Number,
    currency: String,
    razorpay_payment_id: String,
    status: {
        type: String,
        enum: ['pending', 'failed', 'confirmed', 'Authorized'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Payment', paymentSchema);
