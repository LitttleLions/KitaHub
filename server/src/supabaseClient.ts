import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://eraghkejpujijvdsyuox.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyYWdoa2VqcHVqaWp2ZHN5dW94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MzU0NDQsImV4cCI6MjA1ODUxMTQ0NH0.6YhBcBhvSwtNiU1UKzm3BUKpNBB-xb_CJTcZ1UEC4NI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
