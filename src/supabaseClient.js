import { createClient } from '@supabase/subabase-js';

const supabaseUrl = "https://randveunbtzgesxuowtd.supabase.co";
const subabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhbmR2ZXVuYnR6Z2VzeHVvd3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIwMTkxOTIsImV4cCI6MjAyNzU5NTE5Mn0.sy5OPAmKP1WimrKCK_YxMo901lYi2xi4xJEwh5xiWAw";

export const supabase = createClient(supabaseUrl, subabaseKey);