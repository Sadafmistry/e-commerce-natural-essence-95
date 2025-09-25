import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PaymentOptions {
  amount: number;
  orderId: string;
  currency?: string;
  name?: string;
  description?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
}

interface UseRazorpayReturn {
  isLoading: boolean;
  processPayment: (options: PaymentOptions) => Promise<boolean>;
}

export const useRazorpay = (): UseRazorpayReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const processPayment = async (options: PaymentOptions): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Load Razorpay script dynamically
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.body.appendChild(script);

      await new Promise((resolve) => {
        script.onload = resolve;
      });

      // Get Razorpay key from edge function
      const { data: keyData, error: keyError } = await supabase.functions.invoke('get-razorpay-key');
      
      if (keyError) {
        throw new Error('Failed to get payment configuration');
      }

      const razorpayOptions = {
        key: keyData.key,
        amount: options.amount * 100, // Convert to paise
        currency: options.currency || 'INR',
        order_id: options.orderId,
        name: options.name || 'Natural Essence',
        description: options.description || 'Natural Body Scrubs',
        prefill: options.prefill || {},
        theme: {
          color: options.theme?.color || '#8B7355'
        },
        handler: async (response: any) => {
          try {
            // Verify payment with edge function
            const { error: verifyError } = await supabase.functions.invoke('verify-payment', {
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            });

            if (verifyError) {
              throw new Error('Payment verification failed');
            }

            toast({
              title: "Payment Successful!",
              description: "Your order has been placed successfully.",
            });
            
            return true;
          } catch (error) {
            console.error('Payment verification error:', error);
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support if money was deducted.",
              variant: "destructive",
            });
            return false;
          }
        },
        modal: {
          ondismiss: () => {
            toast({
              title: "Payment Cancelled",
              description: "Your payment was cancelled.",
              variant: "destructive",
            });
          }
        }
      };

      const rzp = new (window as any).Razorpay(razorpayOptions);
      rzp.open();
      
      return true;
    } catch (error) {
      console.error('Payment processing error:', error);
      toast({
        title: "Payment Failed",
        description: "Unable to process payment. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    processPayment,
  };
};