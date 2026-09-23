// POST /api/attachments/delete
// Body: { path }
// Remove um arquivo do Supabase Storage. So funciona com a service role
// key (nunca exposta ao navegador), por isso passa por aqui em vez de o
// frontend chamar o Supabase direto.
const { verifyFirebaseToken } = require('../_lib/verifyFirebaseToken');
const { supabaseAdmin, BUCKET } = require('../_lib/supabaseAdmin');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method-not-allowed' });
    return;
  }

  try {
    await verifyFirebaseToken(req);
  } catch (err) {
    res.status(401).json({ error: 'not-authenticated' });
    return;
  }

  const path = (req.body || {}).path;
  if (!path || typeof path !== 'string' || !path.startsWith('jobs/')) {
    res.status(400).json({ error: 'invalid-path' });
    return;
  }

  const { error } = await supabaseAdmin.storage.from(BUCKET).remove([path]);
  if (error) {
    console.error('remove falhou:', error);
    res.status(500).json({ error: 'delete-failed' });
    return;
  }

  res.status(200).json({ ok: true });
};
