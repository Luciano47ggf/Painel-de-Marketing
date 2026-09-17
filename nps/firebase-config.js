// =====================================================================
// CONFIGURAÇÃO DO FIREBASE — formulário público de NPS (Vinuta)
// Mesmo projeto Firebase do painel principal
// =====================================================================

const firebaseConfig = {
  apiKey: "AIzaSyA46O-u6ormVql_kq4V_AE4Sv__zmu6PpU",
  authDomain: "painel-de-marketing-64559.firebaseapp.com",
  projectId: "painel-de-marketing-64559",
  storageBucket: "painel-de-marketing-64559.firebasestorage.app",
  messagingSenderId: "881119877039",
  appId: "1:881119877039:web:8b446b9b003c233ad5c15a"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
