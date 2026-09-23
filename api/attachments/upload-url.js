// POST /api/attachments/upload-url
// Body: { jobId, fileName, sizeBytes }
// Retorna uma URL assinada de upload do Supabase Storage. O arquivo em si
// vai direto do navegador para o Supabase (PUT na signedUrl) -- os bytes do
// arquivo nunca passam por esta funcao, so os metadados. Isso evita o
// limite de tamanho de corpo de requisicao das funcoes da Vercel.
const crypto = require('crypto');
const { verifyFirebaseToken } = require('../_lib/verifyFirebaseToken');
const { supabaseAdmin, BUCKET } = require('../_lib/supabaseAdmin');

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB por arquivo

function sanitizeFileName(name) {
  const safe = String(name || 'arquivo').trim().replace(/[^a-zA-Z0-9._-]/g, '_');
  return safe.slice(-120) || 'arquivo';
}

function sanitizeJobId(jobId) {
  return String(jobId || '').replace(/[^a-zA-Z0-9_-]/g, '');
}

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

  const body = req.body || {};
  const jobId = sanitizeJobId(body.jobId);
  const fileName = body.fileName;
  const sizeBytes = Number(body.sizeBytes) || 0;

  if (!jobId || !fileName) {
    res.status(400).json({ error: 'missing-fields' });
    return;
  }
  if (sizeBytes > MAX_SIZE) {
    res.status(400).json({ error: 'file-too-large' });
    return;
  }

  const path = `jobs/${jobId}/${crypto.randomUUID()}_${sanitizeFileName(fileName)}`;

  const { data, error } = await supabaseAdmin.storage.from(BUCKET).createSignedUploadUrl(path);
  if (error) {
    console.error('createSignedUploadUrl falhou:', error);
    res.status(500).json({ error: 'signed-url-failed' });
    return;
  }

  res.status(200).json({ path, token: data.token, signedUrl: data.signedUrl });
};
