"use client";

import { useState, FormEvent } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Link from 'next/link';

// Load Stripe with your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!stripe || !elements) {
      setError('Stripe has not loaded correctly.');
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Card element not found.');
      setLoading(false);
      return;
    }

    try {
      // Create a Payment Intent on the server
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 1000 }), // Amount in cents (e.g., $10.00)
      });
      const { clientSecret } = await response.json();

      // Confirm the payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        setError(result.error.message || 'An error occurred during payment.');
      } else if (result.paymentIntent?.status === 'succeeded') {
        alert('Payment successful!');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-4xl mb-6 tracking-wider uppercase">CyberWorld Payment</h1>
      <div className="bg-[#2a2a2a] p-6 rounded-lg border-2 border-[#00ff00] shadow-[0_0_10px_#00ff00,0_0_20px_#00ff00] w-full max-w-sm">
        <div className="mb-3 text-xs text-[#00ff00]/70">
          Enter your payment details to join CyberWorld.
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 text-xs uppercase">Card Details</label>
            <div className="p-2 bg-[#1a1a1a] border border-[#00ff00] rounded-sm">
              <CardElement
                options={{
                  style: {
                    base: {
                      color: '#00ff00',
                      fontFamily: '"Courier New", monospace',
                      fontSize: '14px',
                      '::placeholder': {
                        color: '#00ff00',
                        opacity: 0.5,
                      },
                    },
                    invalid: {
                      color: '#ff0000',
                    },
                  },
                }}
              />
            </div>
          </div>
          {error && (
            <div className="mb-3 text-red-500 text-xs">{error}</div>
          )}
          <button
            type="submit"
            disabled={loading || !stripe || !elements}
            className="w-full p-2 bg-[#00ff00] text-[#1a1a1a] font-bold rounded-sm hover:bg-[#00cc00] transition disabled:opacity-50 uppercase text-sm"
          >
            {loading ? 'Processing...' : 'Pay $10'}
          </button>
        </form>
        <div className="mt-3 text-center">
          <Link href="/" className="text-[#00ff00] hover:underline text-xs">
            Back to Home
          </Link>
        </div>
      </div>
    </>
  );
};

export default function Payment() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}