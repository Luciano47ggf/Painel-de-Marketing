// Cliente Supabase com a service role key (SUPABASE_SECRET_KEY). So roda
// dentro das funcoes serverless em /api -- nunca e enviado ao navegador.
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
const BUCKET = process.env.SUPABASE_BUCKET || 'vinuta-anexos';

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error('SUPABASE_URL/SUPABASE_SECRET_KEY nao configurados nas variaveis de ambiente da Vercel.');
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

module.exports = { supabaseAdmin, BUCKET };
