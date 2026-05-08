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
