import { createClient } from '@supabase/supabase-js';

// As credenciais abaixo devem ser substituídas pelas suas chaves Supabase
const supabaseUrl = 'https://chess-master.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96Y3VvZmNoam5sb3lpbmVsc3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ2OTkyNjIsImV4cCI6MjA0MDI3NTI2Mn0.a9l25zFbfA8jShDoZ1c2rKB-OMHeaj85OheGYKQ287Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
