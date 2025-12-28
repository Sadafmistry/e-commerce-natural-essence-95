-- Add payment_method column to orders table
ALTER TABLE public.orders 
ADD COLUMN payment_method text NOT NULL DEFAULT 'cod';

-- Update existing orders to have proper status values
UPDATE public.orders SET status = 'order_placed' WHERE status IN ('pending', 'paid');

-- Add a comment explaining the payment_method values
COMMENT ON COLUMN public.orders.payment_method IS 'Payment method: prepaid or cod (not alterable after order creation)';