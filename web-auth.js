// ==========================================
// AUTHENTICATION & СЕКЬЮРИТИ (WEB)
// ==========================================

window.addEventListener('load', () => {
    const splash = document.getElementById('welcome-splash');
    setTimeout(() => {
        if (splash) {
            splash.style.opacity = '0';
            setTimeout(() => { 
                splash.style.display = 'none'; 
                checkAuthUI(); 
            }, 700);
        }
    }, 2000);
});

function checkAuthUI() {
    const lock = document.getElementById('security-lock');
    const loginBox = document.getElementById('auth-login-box');
    const spinner = document.getElementById('auth-spinner');

    setTimeout(() => {
        if (lock && lock.style.display !== 'none' && spinner && !spinner.classList.contains('hidden')) {
            spinner.classList.add('hidden');
            if (loginBox) { 
                loginBox.classList.remove('hidden'); 
                loginBox.style.display = 'flex'; 
            }
        }
    }, 5000);
}

window.myProfileInfo = null;
window.myUsername = "Guest";
window.isGuest = true;
window.mySessionId = 'web_' + Date.now();

firebase.auth().onAuthStateChanged((user) => {
    const spinner = document.getElementById('auth-spinner');
    const loginBox = document.getElementById('auth-login-box');
    const securityLock = document.getElementById('security-lock');
    const appWrapper = document.getElementById('app-wrapper');

    if (user) {
        window.isGuest = false;
        
        firebase.database().ref('users/' + user.uid).once('value').then((snapshot) => {
            if (snapshot.exists()) {
                window.myProfileInfo = snapshot.val();
                window.myUsername = window.myProfileInfo.name ? window.myProfileInfo.name.split(' ')[0] : "User";
            } else {
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

            if (typeof window.applySystemLanguage === 'function') window.applySystemLanguage();

            if (securityLock) securityLock.style.opacity = '0';
            setTimeout(() => {
                if (securityLock) securityLock.style.display = 'none';
                if (appWrapper) {
                    appWrapper.style.display = 'flex';
                    setTimeout(() => appWrapper.style.opacity = '1', 50); 
                }
            }, 500);
        });

    } else {
        window.isGuest = true;
        
        if (spinner) spinner.classList.add('hidden');
        if (loginBox) {
            loginBox.classList.remove('hidden');
            loginBox.style.display = 'flex';
        }
    }
});

window.signInWithGoogle = function() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).catch(error => {
        console.error("Ошибка входа:", error);
        alert(error.message);
    });
};

window.signOutGoogle = function() {
    firebase.auth().signOut().then(() => {
        location.reload(); 
    });
};
// ==========================================
// ЛОГИКА ВХОДА ПО EMAIL И ПАРОЛЮ
// ==========================================

window.signInWithEmail = function() {
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    
    if (!email || !password) return alert("Введите Email и Пароль!");
    
    // Показываем спиннер загрузки
    document.getElementById('auth-login-box').classList.add('hidden');
    document.getElementById('auth-spinner').classList.remove('hidden');
    
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("Успешный вход по Email:", userCredential.user);
            // Приложение само перекинет в чат благодаря onAuthStateChanged
        })
        .catch((error) => {
            // Возвращаем окно обратно при ошибке
            document.getElementById('auth-spinner').classList.add('hidden');
            document.getElementById('auth-login-box').classList.remove('hidden');
            document.getElementById('auth-login-box').classList.add('flex');
            
            let msg = "Ошибка входа. ";
            if(error.code === 'auth/user-not-found') msg += "Аккаунт с такой почтой не найден.";
            else if(error.code === 'auth/wrong-password') msg += "Неверный пароль.";
            else msg += error.message;
            alert(msg);
        });
};

window.registerWithEmail = function() {
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    
    if (!email || !password) return alert("Введите Email и Пароль для регистрации!");
    if (password.length < 6) return alert("Пароль должен содержать минимум 6 символов!");
    
    // Показываем спиннер загрузки
    document.getElementById('auth-login-box').classList.add('hidden');
    document.getElementById('auth-spinner').classList.remove('hidden');
    
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("Успешная регистрация:", userCredential.user);
            alert("Аккаунт успешно создан! Добро пожаловать.");
        })
        .catch((error) => {
            // Возвращаем окно обратно при ошибке
            document.getElementById('auth-spinner').classList.add('hidden');
            document.getElementById('auth-login-box').classList.remove('hidden');
            document.getElementById('auth-login-box').classList.add('flex');
            
            let msg = "Ошибка регистрации. ";
            if(error.code === 'auth/email-already-in-use') msg += "Эта почта уже зарегистрирована.";
            else if(error.code === 'auth/invalid-email') msg += "Неправильный формат почты (Email).";
            else msg += error.message;
            alert(msg);
        });
};
