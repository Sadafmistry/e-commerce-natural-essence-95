-- Create order_status_history table to track status changes with timestamps
CREATE TABLE public.order_status_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

-- Users can view their own order status history
CREATE POLICY "Users can view their own order status history" 
ON public.order_status_history 
FOR SELECT 
USING (
  auth.uid() = (
    SELECT user_id FROM public.orders WHERE id = order_status_history.order_id
  )
);

-- Admins can view all order status history
CREATE POLICY "Admins can view all order status history" 
ON public.order_status_history 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can insert order status history
CREATE POLICY "Admins can insert order status history" 
ON public.order_status_history 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Allow service role to insert (for edge functions)
CREATE POLICY "Service role can insert order status history"
ON public.order_status_history
FOR INSERT
WITH CHECK (true);

-- Create function to auto-insert status history when order status changes
CREATE OR REPLACE FUNCTION public.track_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert initial status for new orders
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.order_status_history (order_id, status, changed_at)
    VALUES (NEW.id, NEW.status, NEW.created_at);
  END IF;
  
  -- Insert new status when order is updated
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.order_status_history (order_id, status, changed_at)
    VALUES (NEW.id, NEW.status, now());
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for tracking status changes
CREATE TRIGGER track_order_status
AFTER INSERT OR UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.track_order_status_change();

-- Backfill existing orders with their current status
INSERT INTO public.order_status_history (order_id, status, changed_at)
SELECT id, status, created_at FROM public.orders;