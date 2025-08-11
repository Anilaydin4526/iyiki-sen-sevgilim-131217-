import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rrgbotdjzoditymnxyym.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyZ2JvdGRqem9kaXR5bW54eXltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3NTE5NjYsImV4cCI6MjA2NzMyNzk2Nn0.3MkSdhKpuBJ3yL951Kbd78G5m0BvQDxAM_DIq2AUFqo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 