// ==========================================
// ЗОЛОТОЙ СТАНДАРТ: ЕДИНЫЙ ФАЙЛ
// Блок 2: CORE-AUTH (Firebase Авторизация и Идентификация)
// ==========================================

window.myProfileInfo = null;

// Главная функция: вызывается, когда Firebase подтвердил вход
window.onUserAuthenticated = function(firebaseUser) {
    const userRef = firebase.database().ref('users/' + firebaseUser.uid);
    
    userRef.once('value').then((snapshot) => {
        let userData = snapshot.val();
        
        // Если пользователя еще нет в базе — создаем его
        if (!userData) {
            // Проверяем, не твой ли это номер (Магия распознавания)
            const isOwner = (firebaseUser.phoneNumber === "+994503398020");
            
            userData = {
                id: firebaseUser.uid,
                name: isOwner ? "Ilgar (Owner)" : (firebaseUser.displayName || "New User"),
                email: firebaseUser.email || "",
                photo: firebaseUser.photoURL || "https://ui-avatars.com/api/?name=" + (isOwner ? "I" : "U"),
                phone: firebaseUser.phoneNumber || "",
                country: isOwner ? "Azerbaijan" : "Unknown",
                flag: isOwner ? "🇦🇿" : "🌍",
                flagCode: isOwner ? "az" : "en",
                langCode: isOwner ? "az" : "en",
                profileLangs: isOwner ? "ru, az, en" : "en"
            };
            userRef.set(userData);
        }

        // Сохраняем в память нашего Единого Мозга
        window.myProfileInfo = userData;
        
        // Убираем экран блокировки
        const lockScreen = document.getElementById('security-lock');
        const appWrapper = document.getElementById('app-wrapper');
        if(lockScreen) lockScreen.classList.add('opacity-0');
        setTimeout(() => {
            if(lockScreen) lockScreen.classList.add('hidden');
            if(appWrapper) appWrapper.classList.remove('opacity-0');
            
            // Запускаем чат по умолчанию (Global)
            if (typeof window.switchWebChat === 'function') window.switchWebChat('global');
        }, 500);
    });
};

// Отслеживание состояния входа в реальном времени
firebase.auth().onAuthStateChanged((user) => {
    const spinner = document.getElementById('auth-spinner');
    const loginBox = document.getElementById('auth-login-box');
    
    if (user) {
        window.onUserAuthenticated(user);
    } else {
        // Если не авторизован — показываем окно входа
        if(spinner && loginBox) {
            spinner.classList.add('hidden'); spinner.classList.remove('flex');
            loginBox.classList.remove('hidden'); loginBox.classList.add('flex');
        }
        window.myProfileInfo = null;
    }
});

// --- Функции Входа и Выхода ---

window.signInWithGoogle = function() {
    const spinner = document.getElementById('auth-spinner');
    const loginBox = document.getElementById('auth-login-box');
    if(loginBox && spinner) {
        loginBox.classList.add('hidden'); loginBox.classList.remove('flex');
        spinner.classList.remove('hidden'); spinner.classList.add('flex');
    }
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).catch(err => {
        alert('Google Sign-In Error: ' + err.message);
        location.reload();
    });
};

window.signOutGoogle = function() {
    firebase.auth().signOut().then(() => {
        const lockScreen = document.getElementById('security-lock');
        const appWrapper = document.getElementById('app-wrapper');
        if(appWrapper) appWrapper.classList.add('opacity-0');
        if(lockScreen) {
            lockScreen.classList.remove('hidden');
            setTimeout(() => { lockScreen.classList.remove('opacity-0'); }, 50);
        }
        window.closeDropdown();
    });
};

// --- Вход по номеру телефона (SMS) ---
window.sendPhoneCode = function() {
    const phoneInput = document.getElementById('auth-phone-input');
    if(!phoneInput) return;
    const phoneNumber = phoneInput.value.trim();
    if(!phoneNumber) return alert('Пожалуйста, введите номер телефона');
    
    const btn = document.getElementById('auth-phone-send-btn');
    if(btn) btn.innerText = 'Отправка...';
    
    if(window.recaptchaVerifier) window.recaptchaVerifier.clear();
    document.getElementById('recaptcha-container').innerHTML = '';
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', { 'size': 'invisible' });
    
    firebase.auth().signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier)
        .then((confirmationResult) => {
            window.confirmationResult = confirmationResult;
            if(btn) btn.innerText = 'SMS Отправлено!';
            const codeSection = document.getElementById('auth-code-section');
            if(codeSection) codeSection.classList.remove('hidden');
        }).catch((error) => { 
            alert('Ошибка: ' + error.message); 
            if(btn) btn.innerText = 'Send SMS';
        });
};

window.verifyPhoneCode = function() {
    const codeInput = document.getElementById('auth-code-input');
    if(!codeInput) return;
    const code = codeInput.value;
    if(code.length === 6 && window.confirmationResult) {
        window.confirmationResult.confirm(code).then(() => { 
            window.closeAuthModal(); 
        }).catch(e => alert('Неверный код: ' + e.message));
    }
};

// Переключение вкладок в модалке авторизации (Phone / Email)
window.switchAuthTab = function(type) {
    const tabEmail = document.getElementById('tab-email'); const tabPhone = document.getElementById('tab-phone');
    const formEmail = document.getElementById('auth-email-form'); const formPhone = document.getElementById('auth-phone-form');
    if(!tabEmail || !tabPhone || !formEmail || !formPhone) return;

    if(type === 'email') {
        tabEmail.classList.replace('bg-gray-100', 'bg-indigo-600'); tabEmail.classList.replace('text-gray-500', 'text-white');
        tabPhone.classList.replace('bg-indigo-600', 'bg-gray-100'); tabPhone.classList.replace('text-white', 'text-gray-500');
        formEmail.classList.remove('hidden'); formPhone.classList.add('hidden');
    } else {
        tabPhone.classList.replace('bg-gray-100', 'bg-indigo-600'); tabPhone.classList.replace('text-gray-500', 'text-white');
        tabEmail.classList.replace('bg-indigo-600', 'bg-gray-100'); tabEmail.classList.replace('text-white', 'text-gray-500');
        formPhone.classList.remove('hidden'); formEmail.classList.add('hidden');
    }
};
