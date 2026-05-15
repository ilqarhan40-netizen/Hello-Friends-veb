// ==========================================
// ФАЙЛ: web-users.js
// Назначение: Загрузка пользователей, Генератор контактов, Боковая шторка профиля
// ==========================================

window.participants = [];
window.appUsers = {};

// 1. ЗАГРУЗКА ДАННЫХ ИЗ FIREBASE
setTimeout(() => {
    if (typeof firebase !== 'undefined' && firebase.database) {
        firebase.database().ref('users').on('value', (snapshot) => {
            const data = snapshot.val();
            if (!data) return;
            
            let myId = window.myProfileInfo ? window.myProfileInfo.id : 'guest';
            window.appUsers = data;
            window.participants = Object.values(data).filter(u => u.id && u.id !== 'ai' && u.id !== myId);
            
            if(typeof window.renderContactsList === 'function') window.renderContactsList();
            if(typeof window.renderProfessionSection === 'function') window.renderProfessionSection(window.appUsers);
        });
    }
}, 2000);

// ФУНКЦИЯ ПОИСКА В КОНТАКТАХ
window.filterContacts = function(query) {
    const q = query.toLowerCase().trim();
    const container = document.getElementById('footer-contacts-container');
    if (!container) return;
    const items = container.querySelectorAll('.contact-card');
    
    items.forEach(item => {
        const name = item.getAttribute('data-name').toLowerCase();
        const phone = item.getAttribute('data-phone').toLowerCase();
        if (name.includes(q) || phone.includes(q)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
};

// 2. ОТРИСОВКА СПИСКОВ КОНТАКТОВ
window.renderContactsList = function() {
    const topHorizontalBar = document.getElementById('top-users-horizontal-bar'); 
    const footerContacts = document.getElementById('footer-contacts-container'); 

    if (!window.participants || window.participants.length === 0) {
        if (topHorizontalBar) topHorizontalBar.innerHTML = '';
        if (footerContacts) footerContacts.innerHTML = '';
        return;
    }

    if (topHorizontalBar) {
        topHorizontalBar.innerHTML = '';
        window.participants.forEach(user => {
            let userName = (user.name || 'User').split(' ')[0];
            let userPhoto = user.photo || 'https://ui-avatars.com/api/?name=U';
            
            let flagText = user.flagCode || user.flag || 'un';
            let fCode = flagText.replace(/[^a-zA-Z]/g, '').toLowerCase();
            if(!fCode || fCode.length !== 2) fCode = 'un'; 
            if(fCode === 'en') fCode = 'gb';
            let flagUrl = `https://flagcdn.com/w40/${fCode}.png`;

            let avatarItem = document.createElement('div');
            avatarItem.className = "flex flex-col items-center shrink-0 cursor-pointer hover:opacity-80 hover:scale-105 transition w-16 mx-2 group"; 
            avatarItem.onclick = () => window.openUserProfile(user.id);
            avatarItem.innerHTML = `
                <div class="relative mb-1">
                    <img src="${userPhoto}" class="w-12 h-12 rounded-full object-cover border-2 border-indigo-500 dark:border-[#00faad] shadow-md group-hover:shadow-lg transition-all">
                    <img src="${flagUrl}" class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full object-cover border border-white dark:border-slate-800 shadow-sm">
                </div>
                <span class="text-[10px] text-gray-800 dark:text-gray-200 font-bold truncate w-full text-center group-hover:text-indigo-600 dark:group-hover:text-[#00faad] transition-colors">${userName}</span>
            `;
            topHorizontalBar.appendChild(avatarItem);
        });
    }

    if (footerContacts) {
        footerContacts.innerHTML = '';
        window.participants.forEach(user => {
            let userName = (user.name || 'User').split(' ')[0];
            let userPhoto = user.photo || 'https://ui-avatars.com/api/?name=U';
            let userPhone = user.phone || '';

            let footerItem = document.createElement('div');
            footerItem.className = "contact-card flex items-center gap-3 cursor-pointer bg-gray-50 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 p-3 rounded-2xl transition-colors shadow-sm";
            footerItem.setAttribute('data-name', userName);
            footerItem.setAttribute('data-phone', userPhone);
            footerItem.onclick = () => window.openUserProfile(user.id);
            footerItem.innerHTML = `
                <img src="${userPhoto}" class="w-10 h-10 rounded-full object-cover border-2 border-indigo-100 dark:border-slate-600">
                <div class="flex flex-col overflow-hidden">
                    <span class="text-sm font-bold text-gray-700 dark:text-gray-200 truncate">${userName}</span>
                    <span class="text-[10px] text-gray-500 truncate">${userPhone || '-'}</span>
                </div>
                <div class="ml-auto flex gap-2">
                    <button onclick="event.stopPropagation(); if('${userPhone}') { window.location.href='tel:${userPhone}'; } else { alert('Phone not specified'); }" class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center hover:bg-green-200 dark:hover:bg-green-800/50 transition" title="Call"><i class="fa-solid fa-phone text-xs"></i></button>
                    <button onclick="event.stopPropagation(); if(typeof window.openConference==='function') window.openConference()" class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-200 dark:hover:bg-blue-800/50 transition" title="Video"><i class="fa-solid fa-video text-xs"></i></button>
                </div>
            `;
            footerContacts.appendChild(footerItem);
        });
    }
};

// 3. ОТКРЫТИЕ ШТОРКИ ПРОФИЛЯ
window.openUserProfile = function(userId) {
    const user = window.appUsers ? window.appUsers[userId] : window.participants.find(u => u.id === userId);
    if(!user) return;

    let flagText = user.flagCode || user.flag || 'un';
    let fCode = flagText.replace(/[^a-zA-Z]/g, '').toLowerCase();
    if(!fCode || fCode.length !== 2) fCode = 'un';
    if(fCode === 'en') fCode = 'gb';

    const smartInfo = typeof window.getCountryFacts === 'function' ? window.getCountryFacts(fCode) : { country: 'Global', pop: '-', seas: '-', about: '-' };

    const photoEl = document.getElementById('modal-user-photo');
    if (photoEl) photoEl.src = user.photo || 'https://ui-avatars.com/api/?name=U';
    
    const nameEl = document.getElementById('modal-user-name');
    if (nameEl) nameEl.innerText = user.name || 'User';
    
    const countryEl = document.getElementById('modal-user-country');
    if (countryEl) countryEl.innerHTML = `<img src="https://flagcdn.com/w20/${fCode}.png" class="w-4 h-auto rounded-sm border border-gray-200 shadow-sm"> <span class="font-medium">${user.country || smartInfo.country}</span>`;
    
    const langsEl = document.getElementById('modal-user-langs');
    if (langsEl) langsEl.innerText = user.languages || user.profileLangs || '-';
    
    const popEl = document.getElementById('modal-user-pop');
    if (popEl) popEl.innerText = smartInfo.pop;
    
    const seasEl = document.getElementById('modal-user-seas');
    if (seasEl) seasEl.innerText = smartInfo.seas;
    
    const aboutEl = document.getElementById('modal-user-about');
    if (aboutEl) {
        let userAbout = user.cv ? user.cv.about : user.about;
        aboutEl.innerText = userAbout || smartInfo.about;
    }

    // --- ПРИВЯЗКА КНОПОК ---
    const btnPrivChat = document.getElementById('btn-priv-chat');
    if (btnPrivChat) btnPrivChat.onclick = () => { 
        window.closeUserProfile(); 
        if(typeof window.switchWebChat === 'function') window.switchWebChat(userId); 
    };
    
    // МИКРОФОН (Мгновенное закрытие профиля -> Меню 3 функции)
    const btnVoiceMsg = document.getElementById('btn-voice-msg');
    if (btnVoiceMsg) btnVoiceMsg.onclick = () => { 
        const overlay = document.getElementById('web-profile-overlay');
        if (overlay) { overlay.classList.remove('flex'); overlay.classList.add('hidden'); overlay.style.display = 'none'; }
        window.currentTargetUser = user; 
        if(typeof window.openMicMenu === 'function') window.openMicMenu(); 
    };
    
    const btnAppAudio = document.getElementById('btn-app-audio');
    if (btnAppAudio) btnAppAudio.onclick = () => { 
        const overlay = document.getElementById('web-profile-overlay');
        if (overlay) { overlay.classList.remove('flex'); overlay.classList.add('hidden'); overlay.style.display = 'none'; }
        window.currentTargetUser = user; 
        if(typeof window.startVoiceCall === 'function') window.startVoiceCall(); 
    };
    
    const btnAppVideo = document.getElementById('btn-app-video');
    if (btnAppVideo) btnAppVideo.onclick = () => { 
        window.closeUserProfile(); 
        window.currentTargetUser = user;
        if(typeof window.openConference === 'function') window.openConference(); 
    };

    // СДВОЕННАЯ МОДАЛКА ЗВОНКОВ
    const btnExtCall = document.getElementById('btn-ext-call');
    if (btnExtCall) btnExtCall.onclick = () => { 
        const overlay = document.getElementById('web-profile-overlay');
        if (overlay) { overlay.classList.remove('flex'); overlay.classList.add('hidden'); overlay.style.display = 'none'; }
        window.currentTargetUser = user; 
        if(typeof window.openCallMenu === 'function') window.openCallMenu(); 
    };

    const btnFullCv = document.getElementById('btn-full-cv');
    if (btnFullCv) {
        btnFullCv.onclick = () => { 
            window.closeUserProfile(); 
            setTimeout(() => { if(typeof window.openDetailedCV === 'function') window.openDetailedCV(userId); }, 300);
        };
    }

    const overlay = document.getElementById('web-profile-overlay');
    const leftPanel = document.getElementById('profile-left-panel');
    const rightPanel = document.getElementById('profile-right-panel');

    if (overlay && leftPanel && rightPanel) {
        overlay.classList.remove('hidden');
        overlay.classList.add('flex');
        setTimeout(() => {
            leftPanel.classList.remove('-translate-x-full');
            rightPanel.classList.remove('translate-x-full');
        }, 50);
    }
    if (typeof window.applySystemLanguage === 'function') window.applySystemLanguage();
};

window.closeUserProfile = function() {
    const overlay = document.getElementById('web-profile-overlay');
    const leftPanel = document.getElementById('profile-left-panel');
    const rightPanel = document.getElementById('profile-right-panel');
    
    if (overlay && leftPanel && rightPanel) {
        leftPanel.classList.add('-translate-x-full');
        rightPanel.classList.add('translate-x-full');
        setTimeout(() => {
            overlay.classList.remove('flex');
            overlay.classList.add('hidden');
            overlay.style.display = '';
        }, 300); 
    }
};
