const Razorpay = require('razorpay');
const { razorpayKey } = require('../utils/razorpayUtils');
const Payment = require('../model/payment');
const User = require('../model/user');

const razorpay = new Razorpay(razorpayKey);

exports.createPayment = async (req, res) => {
    try {
        const { email, amount, currency } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency: currency,
            payment_capture: 1,
        });

        const newPayment = new Payment({
            userid: user._id,
            orderId: order.id,
            amount: amount,
            currency: currency,
            PaymentId: order.id,
            status: 'pending',
        });
        await newPayment.save();

        res.json({ orderId: order.id, message: 'Payment order created successfully' });
    } catch (error) {
        console.error('Error creating payment order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.verifyPayment = async (req, res) => {
    try {
        const { orderId, razorpay_payment_id } = req.body;

        const payment = await Payment.findOne({ orderId });
        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }
        if (payment.status === 'confirmed') {
            return res.status(400).json({ error: 'Payment already confirmed' });
        }

        const captureResponse = await razorpay.payments.capture(razorpay_payment_id, payment.amount * 100);
        if (captureResponse.status === 'captured') {
            payment.status = 'confirmed';
            payment.razorpay_payment_id = razorpay_payment_id;
            await payment.save();
            return res.json({ status: 'success', message: 'Payment confirmed successfully' });
        } else {
            return res.status(500).json({ error: 'Failed to confirm payment' });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
