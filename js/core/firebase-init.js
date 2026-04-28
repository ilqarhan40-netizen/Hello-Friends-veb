// Инициализация базы данных Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBtIJPFKNNUn1XW5b44tdomXTPHNI2Px40",
    authDomain: "hello-friends-p8p3i7.firebaseapp.com",
    databaseURL: "https://hello-friends-p8p3i7-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "hello-friends-p8p3i7",
    storageBucket: "hello-friends-p8p3i7.firebasestorage.app"
};

// Проверяем, не запущена ли уже база (защита от ошибок)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Глобальная переменная db, доступная для всех остальных скриптов
window.db = firebase.database();
