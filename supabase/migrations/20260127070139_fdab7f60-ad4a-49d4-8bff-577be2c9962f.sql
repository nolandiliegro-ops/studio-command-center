-- Add delivery columns to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS delivery_method text,
ADD COLUMN IF NOT EXISTS delivery_price numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS notes text;