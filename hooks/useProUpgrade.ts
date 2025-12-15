import { useState } from "react";
import { toast } from "sonner";

// Razorpay global declaration - Razorpay is a payment gateway for India
// This allows us to access the Razorpay object globally after the script loads
declare global {
  interface Window {
    Razorpay: any;
  }
}

/**
 * Custom hook for handling Pro subscription upgrades using Razorpay
 *
 * This hook provides functionality to:
 * - Create Razorpay payment orders
 * - Load the Razorpay checkout script
 * - Handle payment success/failure
 * - Show loading states and notifications
 *
 * @returns {Object} Hook functions and state
 * @returns {function} handleProUpgrade - Function to initiate the Pro upgrade payment
 * @returns {boolean} paymentLoading - Loading state during payment processing
 */
export function useProUpgrade() {
  const [paymentLoading, setPaymentLoading] = useState(false);

  /**
   * Initiates the Pro subscription upgrade payment process
   *
   * This function:
   * 1. Sets loading state
   * 2. Creates a Razorpay order via API
   * 3. Loads the Razorpay checkout script if not already loaded
   * 4. Opens the Razorpay payment modal
   * 5. Handles payment success/failure
   */
  const handleProUpgrade = async () => {
    setPaymentLoading(true);
    try {
      // Amount for Pro subscription: ₹499 = 49900 paise (Razorpay works in paise)
      const amount = 49900;

      // Step 1: Create Razorpay order via our API endpoint
      // This is required before opening the payment modal
      const res = await fetch('/api/subscription/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency: 'INR' }),
      });

      if (!res.ok) {
        throw new Error('Failed to create payment order');
      }

      // Extract order details from API response
      const { orderId, key } = await res.json();

      // Step 2: Load Razorpay checkout script dynamically
      // This script provides the Razorpay() constructor and payment modal
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        // Wait for script to load before proceeding
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      // Step 3: Configure Razorpay payment options
      const options = {
        key: key, // Razorpay Key ID from environment variables
        amount: amount, // Amount in paise
        currency: 'INR', // Currency (Indian Rupees)
        name: 'FinTrack Pro', // Your app/brand name shown in payment modal
        description: 'Upgrade to Pro features', // Description shown to user
        order_id: orderId, // Unique order ID from Razorpay
        handler: function (response: any) {
          // Step 4: Handle successful payment
          // This callback is called when payment is completed successfully
          console.log('Payment successful:', response);
          toast.success('Payment successful! Welcome to Pro.');

          // TODO: Here you would typically:
          // 1. Update user's subscription status in your database
          // 2. Grant Pro features to the user
          // 3. Send confirmation email
          // 4. Update UI to show Pro features
        },
        prefill: {
          // Optional: Pre-fill user details in payment form
          // You can get this from user context/state
          // email: user.email,
          // name: user.fullName,
        },
        theme: {
          color: '#059669', // Theme color for payment modal (emerald-600)
        },
      };

      // Step 5: Create and open Razorpay payment modal
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      // Handle any errors during the payment process
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      // Always reset loading state
      setPaymentLoading(false);
    }
  };

  return { handleProUpgrade, paymentLoading };
}