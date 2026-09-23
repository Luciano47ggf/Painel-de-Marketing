// Valida o ID token do Firebase Auth enviado pelo frontend, sem precisar de
// uma service account do Firebase Admin. O token e um JWT assinado pelo
// Google; validamos a assinatura contra as chaves publicas do
// "securetoken" e conferimos issuer/audience/expiracao. O project id do
// Firebase nao e segredo (ja esta no bundle do frontend), por isso pode
// viver como constante aqui ou ser sobrescrito por env var se precisar.
const { createRemoteJWKSet, jwtVerify } = require('jose');

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'painel-de-marketing-64559';

const JWKS = createRemoteJWKSet(
  new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com')
);

async function verifyFirebaseToken(req) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'] || '';
  const match = /^Bearer\s+(.+)$/i.exec(authHeader);
  if (!match) {
    throw new Error('missing-token');
  }

  const token = match[1];
  const { payload } = await jwtVerify(token, JWKS, {
    issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
    audience: FIREBASE_PROJECT_ID,
  });

  if (!payload.sub) {
    throw new Error('invalid-token');
  }

  return { uid: payload.sub, email: payload.email || null };
}

module.exports = { verifyFirebaseToken };
