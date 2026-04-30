// ==========================================
// ИНИЦИАЛИЗАЦИЯ БАЗЫ ДАННЫХ FIREBASE (Обновленный ключ)
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyCVFkMsqelcnjjeIwGnAKmn1CFhDGc7kR0",
  authDomain: "hello-friends-p8p3i7.firebaseapp.com",
  databaseURL: "https://hello-friends-p8p3i7-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "hello-friends-p8p3i7",
  storageBucket: "hello-friends-p8p3i7.firebasestorage.app",
  messagingSenderId: "518434765438",
  appId: "1:518434765438:web:78a3e7f7bc4ad32dd1362f"
};

// Защита от двойной инициализации
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Делаем базу глобально доступной для всех скриптов
window.db = firebase.database();
