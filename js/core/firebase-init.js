// ==========================================
// ИНИЦИАЛИЗАЦИЯ БАЗЫ ДАННЫХ FIREBASE
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyBtIJPFKNNUn1XW5b44tdomXTPHNI2Px40",
    authDomain: "hello-friends-p8p3i7.firebaseapp.com",
    databaseURL: "https://hello-friends-p8p3i7-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "hello-friends-p8p3i7",
    storageBucket: "hello-friends-p8p3i7.firebasestorage.app"
};

// Защита от двойной инициализации
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Делаем базу глобально доступной для всех скриптов
window.db = firebase.database();
