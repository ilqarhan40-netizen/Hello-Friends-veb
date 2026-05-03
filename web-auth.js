// ==========================================
// AUTHENTICATION & СЕКЬЮРИТИ (WEB)
// ==========================================

// 1. ЛОГИКА СТАРТОВОЙ ЗАСТАВКИ
window.addEventListener('load', () => {
    const splash = document.getElementById('welcome-splash');
    
    // Даем пользователю 2 секунды насладиться логотипом HF
    setTimeout(() => {
        if (splash) {
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.style.display = 'none';
                // Как только заставка ушла, проверяем, не зависла ли авторизация
                checkAuthUI(); 
            }, 700);
        }
    }, 2000);
});

// Функция для "подталкивания" интерфейса, если Firebase тупит
function checkAuthUI() {
    const lock = document.getElementById('security-lock');
    const loginBox = document.getElementById('auth-login-box');
    const spinner = document.getElementById('auth-spinner');

    // Если за 5 секунд после заставки мы так и не вошли — показываем кнопку входа
    setTimeout(() => {
        if (lock && lock.style.display !== 'none' && spinner && !spinner.classList.contains('hidden')) {
            spinner.classList.add('hidden');
            if (loginBox) loginBox.classList.remove('hidden');
        }
    }, 5000);
}

window.myProfileInfo = null;
window.myUsername = "Guest";
window.isGuest = true;
window.mySessionId = 'web_' + Date.now();

// Главный слушатель Firebase Auth
firebase.auth().onAuthStateChanged((user) => {
    const spinner = document.getElementById('auth-spinner');
    const loginBox = document.getElementById('auth-login-box');
    const securityLock = document.getElementById('security-lock');
    const appWrapper = document.getElementById('app-wrapper');

    if (user) {
        // 1. ПОЛЬЗОВАТЕЛЬ УЖЕ ВОШЕЛ
        window.isGuest = false;
        
        // Скачиваем его профиль из базы данных
        firebase.database().ref('users/' + user.uid).once('value').then((snapshot) => {
            if (snapshot.exists()) {
                window.myProfileInfo = snapshot.val();
                window.myUsername = window.myProfileInfo.name ? window.myProfileInfo.name.split(' ')[0] : "User";
            } else {
                // Если зашел впервые - создаем профиль
                window.myProfileInfo = {
                    id: user.uid,
                    name: user.displayName || "User",
                    photo: user.photoURL || 'https://ui-avatars.com/api/?name=U',
                    email: user.email || "",
                    phone: user.phoneNumber || "",
                    isOnline: true
                };
                firebase.database().ref('users/' + user.uid).set(window.myProfileInfo);
            }

            // Запускаем переводы языка, если мозг уже загрузился
            if (typeof window.applySystemLanguage === 'function') window.applySystemLanguage();

            // 2. ОТКРЫВАЕМ ПРИЛОЖЕНИЕ (Прячем замок)
            if (securityLock) securityLock.style.opacity = '0';
            setTimeout(() => {
                if (securityLock) securityLock.style.display = 'none';
                if (appWrapper) {
                    appWrapper.style.display = 'flex';
                    // Плавное появление интерфейса
                    setTimeout(() => appWrapper.style.opacity = '1', 50); 
                }
            }, 500);
        });

    } else {
        // 3. ПОЛЬЗОВАТЕЛЬ НЕ ВОШЕЛ (Гость)
        window.isGuest = true;
        
        // Прячем спиннер, показываем кнопку входа Google
        if (spinner) spinner.classList.add('hidden');
        if (loginBox) {
            loginBox.classList.remove('hidden');
            loginBox.style.display = 'flex';
        }
    }
});

// Функции кнопок входа и выхода (привязаны к твоему HTML)
window.signInWithGoogle = function() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).catch(error => {
        console.error("Ошибка входа:", error);
        alert(error.message);
    });
};

window.signOutGoogle = function() {
    firebase.auth().signOut().then(() => {
        location.reload(); // Перезагружаем страницу после выхода
    });
};
