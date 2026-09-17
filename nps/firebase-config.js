// =====================================================================
// CONFIGURAÇÃO DO FIREBASE — formulário público de NPS (Vinuta)
// =====================================================================
// Este formulário usa o MESMO projeto Firebase do painel principal
// (index.html na raiz do projeto). Copie aqui EXATAMENTE os mesmos
// valores que você preencheu no objeto FIREBASE_CONFIG do painel.
//
// Este arquivo não carrega firebase-auth-compat.js de propósito: quem
// responde a avaliação não faz login, só precisa do Firestore.
// =====================================================================

const firebaseConfig = {
  apiKey: "COLE_AQUI",
  authDomain: "COLE_AQUI",
  projectId: "COLE_AQUI",
  storageBucket: "COLE_AQUI",
  messagingSenderId: "COLE_AQUI",
  appId: "COLE_AQUI"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
