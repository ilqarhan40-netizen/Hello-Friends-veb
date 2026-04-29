// ==========================================
// HELLO FRIENDS - WEB AUTHENTICATION
// Файл: js/web/web-auth.js
// Назначение: Защитный экран, вход по Google, SMS, Email
// ==========================================

// --- 1. GOOGLE AUTH (ЗАЩИТНЫЙ ЭКРАН) ---
window.signInWithGoogle = function() {
    const lockScreen = document.getElementById('security-lock');
    const appWrapper = document.getElementById('app-wrapper');
    const spinner = document.getElementById('auth-spinner');
    const loginBox = document.getElementById('auth-login-box');

    if(loginBox && spinner) {
        loginBox.classList.add('hidden');
        loginBox.classList.remove('flex');
        spinner.classList.remove('hidden');
        spinner.classList.add('flex');
    }

    // Имитация успешного входа
    setTimeout(() => {
        if(lockScreen) lockScreen.classList.add('opacity-0');
        setTimeout(() => {
            if(lockScreen) lockScreen.classList.add('hidden');
            if(appWrapper) appWrapper.classList.remove('opacity-0');
        }, 500);
    }, 800);
};

window.signOutGoogle = function() {
    const lockScreen = document.getElementById('security-lock');
    const appWrapper = document.getElementById('app-wrapper');
    const spinner = document.getElementById('auth-spinner');
    const loginBox = document.getElementById('auth-login-box');

    if(appWrapper) appWrapper.classList.add('opacity-0');
    if(lockScreen) lockScreen.classList.remove('hidden');
    
    if(spinner && loginBox) {
        spinner.classList.add('hidden');
        spinner.classList.remove('flex');
        loginBox.classList.remove('hidden');
        loginBox.classList.add('flex');
    }
    
    setTimeout(() => {
        if(lockScreen) lockScreen.classList.remove('opacity-0');
    }, 50);
    
    if(typeof window.closeDropdown === 'function') window.closeDropdown();
};

// При загрузке страницы: показываем кнопку входа через 1 сек
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const spinner = document.getElementById('auth-spinner');
        const loginBox = document.getElementById('auth-login-box');
        if(spinner && loginBox) {
            spinner.classList.add('hidden');
            spinner.classList.remove('flex');
            loginBox.classList.remove('hidden');
            loginBox.classList.add('flex');
        }
    }, 1000);
});

// --- 2. AUTH MODAL (SMS / EMAIL) ---
window.openAuthModal = function() { 
    if(typeof window.closeDropdown === 'function') window.closeDropdown(); 
    const modal = document.getElementById('auth-modal');
    if(modal) {
        modal.classList.remove('hidden'); modal.classList.add('flex');
        setTimeout(() => { modal.classList.remove('opacity-0'); modal.querySelector('div').classList.remove('scale-95'); }, 10);
    }
}

window.closeAuthModal = function() {
    const modal = document.getElementById('auth-modal');
    if(modal) {
        modal.classList.add('opacity-0'); modal.querySelector('div').classList.add('scale-95');
        setTimeout(() => { modal.classList.add('hidden'); modal.classList.remove('flex'); }, 300);
    }
}

window.switchAuthTab = function(type) {
    const tabEmail = document.getElementById('tab-email');
    const tabPhone = document.getElementById('tab-phone');
    const formEmail = document.getElementById('auth-email-form');
    const formPhone = document.getElementById('auth-phone-form');
    
    if(!tabEmail || !tabPhone || !formEmail || !formPhone) return;

    if(type === 'email') {
        tabEmail.classList.replace('bg-gray-100', 'bg-indigo-600'); 
        tabEmail.classList.replace('text-gray-500', 'text-white');
        tabPhone.classList.replace('bg-indigo-600', 'bg-gray-100'); 
        tabPhone.classList.replace('text-white', 'text-gray-500');
        formEmail.classList.remove('hidden'); 
        formPhone.classList.add('hidden');
    } else {
        tabPhone.classList.replace('bg-gray-100', 'bg-indigo-600'); 
        tabPhone.classList.replace('text-gray-500', 'text-white');
        tabEmail.classList.replace('bg-indigo-600', 'bg-gray-100'); 
        tabEmail.classList.replace('text-white', 'text-gray-500');
        formPhone.classList.remove('hidden'); 
        formEmail.classList.add('hidden');
    }
};

window.sendPhoneCode = function() {
    const phoneInput = document.getElementById('auth-phone-input');
    if(!phoneInput) return;
    const phoneNumber = phoneInput.value.trim();
    if(!phoneNumber) return alert('Please enter phone');
    
    const btn = document.getElementById('auth-phone-send-btn');
    if(btn) btn.innerText = 'Sending...';
    
    if(window.recaptchaVerifier) window.recaptchaVerifier.clear();
    document.getElementById('recaptcha-container').innerHTML = '';
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', { 'size': 'invisible' });
    
    firebase.auth().signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier)
        .then((confirmationResult) => {
            window.confirmationResult = confirmationResult;
            if(btn) btn.innerText = 'SMS Sent!';
            const codeSection = document.getElementById('auth-code-section');
            if(codeSection) codeSection.classList.remove('hidden');
        }).catch((error) => { alert('Error: ' + error.message); });
};

window.verifyPhoneCode = function() {
    const codeInput = document.getElementById('auth-code-input');
    if(!codeInput) return;
    const code = codeInput.value;
    if(code.length === 6 && window.confirmationResult) {
        window.confirmationResult.confirm(code).then(() => { 
            alert('Logged in!'); 
            window.closeAuthModal(); 
        }).catch(e => alert('Verification failed: ' + e.message));
    }
};

window.loginWithEmail = function() {
    const emailInput = document.getElementById('auth-email-input');
    const passInput = document.getElementById('auth-email-password');
    if(!emailInput || !passInput) return;
    
    const email = emailInput.value.trim();
    const password = passInput.value.trim();
    if(!email || !password) return alert('Enter email and password');
    
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => { alert('Logged in!'); window.closeAuthModal(); })
        .catch(() => {
            // Если аккаунта нет, пытаемся зарегистрировать
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(() => { alert('Registered!'); window.closeAuthModal(); })
                .catch(e => alert('Error: ' + e.message));
        });
};

window.switchTestUser = function() {
    const newUser = prompt("Log in as (enter name):", "Ilgar");
    if(newUser) { 
        localStorage.setItem('hf_test_user', newUser.trim()); 
        location.reload(); 
    }
};
