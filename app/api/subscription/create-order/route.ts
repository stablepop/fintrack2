import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Initialize Razorpay instance with test credentials
// Razorpay is India's leading payment gateway
// Key ID and Secret are obtained from Razorpay Dashboard
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!, // Your Razorpay Key ID (starts with rzp_test_ or rzp_live_)
  key_secret: process.env.RAZORPAY_KEY_SECRET!, // Your Razorpay Key Secret (keep this secure!)
});

/**
 * POST /api/subscription/create-order
 *
 * Creates a Razorpay order for Pro subscription payment
 *
 * This endpoint:
 * 1. Validates the payment amount
 * 2. Creates an order using Razorpay Orders API
 * 3. Returns order details needed for frontend payment
 *
 * @param {NextRequest} request - Contains amount and currency in JSON body
 * @returns {NextResponse} Order details or error response
 */
export async function POST(request: NextRequest) {
  try {
    // Extract payment details from request body
    const { amount, currency = 'INR' } = await request.json();

    // Validate amount - Razorpay requires minimum 100 paise (₹1)
    // Also prevents negative or zero amounts
    if (!amount || amount < 100) {
      return NextResponse.json(
        { error: 'Invalid amount. Minimum amount is ₹1.' },
        { status: 400 }
      );
    }

    // Step 1: Create Razorpay order
    // Orders API creates a payment order that can be used multiple times
    // This is required before accepting payment
    const options = {
      amount: amount, // Amount in paise (e.g., 49900 for ₹499)
      currency: currency, // Currency code (INR for Indian Rupees)
      receipt: `receipt_${Date.now()}`, // Unique receipt ID for your records
    };

    // Create the order using Razorpay Orders API
    const order = await razorpay.orders.create(options);

    // Step 2: Return order details to frontend
    // Frontend needs these details to initialize the payment modal
    return NextResponse.json({
      orderId: order.id, // Razorpay Order ID (starts with order_)
      amount: order.amount, // Amount in paise
      currency: order.currency, // Currency code
      key: process.env.RAZORPAY_KEY_ID, // Public Key ID (safe to share with frontend)
    });

  } catch (error) {
    // Handle any errors during order creation
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}