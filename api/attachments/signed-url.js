// POST /api/attachments/signed-url
// Body: { path }
// Gera uma URL assinada e temporaria para abrir/baixar um anexo privado do
// Supabase Storage. Usada tanto para o botao "Abrir" quanto para as
// miniaturas de imagem.
const { verifyFirebaseToken } = require('../_lib/verifyFirebaseToken');
const { supabaseAdmin, BUCKET } = require('../_lib/supabaseAdmin');

const EXPIRES_IN_SECONDS = 60;

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

  const { data, error } = await supabaseAdmin.storage.from(BUCKET).createSignedUrl(path, EXPIRES_IN_SECONDS);
  if (error) {
    console.error('createSignedUrl falhou:', error);
    res.status(500).json({ error: 'signed-url-failed' });
    return;
  }

  res.status(200).json({ url: data.signedUrl });
};
