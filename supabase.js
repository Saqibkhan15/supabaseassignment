 

  import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://grkpkydwlbmlafatdtpo.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdya3BreWR3bGJtbGFmYXRkdHBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0OTAwMzcsImV4cCI6MjA1MjA2NjAzN30.LX24Dk5r3zJKg4TS9x-HgADFB8Pz0R1BuyeIPEIF7AM';

export const supabaseconfig = createClient(supabaseUrl, supabaseKey);
