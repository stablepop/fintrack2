import { useState } from "react";
import { toast } from "sonner";

// Razorpay global declaration
declare global {
  interface Window {
    Razorpay: any;
  }
}

export function useProUpgrade() {
  const [paymentLoading, setPaymentLoading] = useState(false);

  const handleProUpgrade = async () => {
    setPaymentLoading(true);
    try {
      // Amount for Pro subscription: ₹499 = 49900 paise
      const amount = 49900;

      // Create Razorpay order
      const res = await fetch('/api/subscription/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency: 'INR' }),
      });

      if (!res.ok) {
        throw new Error('Failed to create payment order');
      }

      const { orderId, key } = await res.json();

      // Load Razorpay script if not loaded
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      // Initialize Razorpay checkout
      const options = {
        key: key,
        amount: amount,
        currency: 'INR',
        name: 'FinTrack Pro',
        description: 'Upgrade to Pro features',
        order_id: orderId,
        handler: function (response: any) {
          // Payment successful
          toast.success('Payment successful! Welcome to Pro.');
          // Here you would typically update user's subscription status in DB
          // For now, just show success
        },
        prefill: {
          // We can add user email/name here if available
        },
        theme: {
          color: '#059669', // emerald-600
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  return { handleProUpgrade, paymentLoading };
}