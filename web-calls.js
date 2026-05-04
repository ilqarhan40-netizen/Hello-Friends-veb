// ==========================================
// ГЕНЕРАТОР КОНТАКТОВ И ПРОФИЛЕЙ (WEB ВЕРСИЯ)
// ==========================================

window.participants = [];

setTimeout(() => {
    firebase.database().ref('users').on('value', (snapshot) => {
        const data = snapshot.val();
        if (!data) return;

        let myId = window.myProfileInfo ? window.myProfileInfo.id : 'guest';
        window.participants = Object.values(data).filter(u => u.id && u.id !== 'ai' && u.id !== myId);

        if(typeof window.renderContactsList === 'function') window.renderContactsList();
        if(typeof window.renderCVList === 'function') window.renderCVList();
    });
}, 2000);

window.renderContactsList = function() {
    const topBar = document.getElementById('top-users-horizontal-bar');
    // Ищем контейнер по обоим возможным ID (чтобы точно сработало)
    const contactsList = document.getElementById('web-contacts-list') || document.getElementById('footer-contacts-container');

    if (!window.participants || window.participants.length === 0) return;

    // --- 1. ГОРИЗОНТАЛЬНАЯ ЛЕНТА В ЧАТЕ (СВЕРХУ) ---
    if (topBar) {
        topBar.innerHTML = '';
        window.participants.forEach(user => {
            let userName = (user.name || 'User').split(' ')[0];
            let userPhoto = user.photo || 'https://ui-avatars.com/api/?name=U';

            // Умные PNG флаги
            let flagText = user.flagCode || user.flag || 'un';
            let fCode = flagText.replace(/[^a-zA-Z]/g, '').toLowerCase();
            if(!fCode || fCode.length !== 2) fCode = 'un';
            let flagUrl = `https://flagcdn.com/w40/${fCode}.png`;

            let div = document.createElement('div');
            div.className = "flex flex-col items-center shrink-0 cursor-pointer w-16 mx-2 hover:scale-105 transition";
            
            // ВАЖНО: Открываем профиль, а не старый switchChatRoom
            div.onclick = () => {
                if (typeof window.openUserProfile === 'function') window.openUserProfile(user.id);
            };

            div.innerHTML = `
                <div class="relative mb-1">
                    <img src="${userPhoto}" class="w-12 h-12 rounded-full object-cover border-2 border-indigo-500 dark:border-[#00faad] shadow-md">
                    <img src="${flagUrl}" class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full object-cover border border-white dark:border-slate-800 shadow-sm">
                </div>
                <span class="text-[10px] text-gray-800 dark:text-gray-200 font-bold truncate w-full text-center">${userName}</span>
            `;
            topBar.appendChild(div);
        });
    }

    // --- 2. КАРТОЧКИ В РАЗДЕЛЕ "КОНТАКТЫ" ---
    if (contactsList) {
        contactsList.innerHTML = '';
        window.participants.forEach(user => {
            let userName = (user.name || 'User').split(' ')[0];
            let userPhoto = user.photo || 'https://ui-avatars.com/api/?name=U';
            let phoneStr = user.phone || 'Hidden';

            // Умные PNG флаги
            let flagText = user.flagCode || user.flag || 'un';
            let fCode = flagText.replace(/[^a-zA-Z]/g, '').toLowerCase();
            if(!fCode || fCode.length !== 2) fCode = 'un';
            let flagUrl = `https://flagcdn.com/w40/${fCode}.png`;

            let card = document.createElement('div');
            card.className = "bg-white dark:bg-slate-800 rounded-xl p-4 flex items-center justify-between border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-shadow mb-3";

            card.innerHTML = `
                <div class="flex items-center gap-4 cursor-pointer w-full" onclick="if(typeof window.openUserProfile === 'function') window.openUserProfile('${user.id}')">
                    <div class="relative">
                        <img src="${userPhoto}" class="w-14 h-14 rounded-full object-cover border-2 border-indigo-500">
                        <img src="${flagUrl}" class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm">
                    </div>
                    <div class="flex flex-col">
                        <span class="text-gray-900 dark:text-white font-bold text-lg">${userName}</span>
                        <span class="text-gray-500 dark:text-gray-400 text-sm"><i class="fa-solid fa-phone text-indigo-500 text-xs mr-1"></i> ${phoneStr}</span>
                    </div>
                </div>
                <div class="flex gap-2 shrink-0">
                    <button onclick="if(typeof window.startWebCall === 'function') window.startWebCall('${user.id}', 'voice')" class="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 text-indigo-600 dark:text-[#00C4CC] flex items-center justify-center hover:bg-indigo-100 transition shadow"><i class="fa-solid fa-phone"></i></button>
                    <button onclick="if(typeof window.openConference === 'function') window.openConference()" class="w-10 h-10 rounded-full bg-indigo-600 dark:bg-[#00C4CC] text-white dark:text-black flex items-center justify-center hover:scale-105 transition shadow-md"><i class="fa-solid fa-video"></i></button>
                </div>
            `;
            contactsList.appendChild(card);
        });
    }
};

// ==========================================
// ЛОГИКА ОКОН ПРОФИЛЯ
// ==========================================
window.openUserProfile = function(userId) {
    const user = window.participants.find(u => u.id === userId);
    if(!user) return;

    let flagText = user.flagCode || user.flag || 'un';
    let fCode = flagText.replace(/[^a-zA-Z]/g, '').toLowerCase();
    if(!fCode || fCode.length !== 2) fCode = 'un';

    // Заполняем Левую Панель (Анкета)
    const photoEl = document.getElementById('modal-user-photo');
    if (photoEl) photoEl.src = user.photo || 'https://ui-avatars.com/api/?name=U';
    
    const nameEl = document.getElementById('modal-user-name');
    if (nameEl) nameEl.innerText = user.name || 'User';

    const countryEl = document.getElementById('modal-user-country');
    if (countryEl) countryEl.innerHTML = `<img src="https://flagcdn.com/w40/${fCode}.png" class="w-5 h-auto rounded-sm border border-gray-300 dark:border-slate-700"> <span class="font-medium">${user.country || 'Azerbaijan'}</span>`;

    const langsEl = document.getElementById('modal-user-langs');
    if (langsEl) langsEl.innerText = user.profileLangs || user.languages || 'Azerbaijani, Russian, English';

    const popEl = document.getElementById('modal-user-pop');
    if (popEl) popEl.innerText = user.population || '~10.1M';

    const seasEl = document.getElementById('modal-user-seas');
    if (seasEl) seasEl.innerText = user.seas || 'Caspian Sea';

    const aboutEl = document.getElementById('modal-user-about');
    if (aboutEl) aboutEl.innerText = user.about || 'Azerbaijan is a country in the South Caucasus region of Eurasia.';

    // Назначаем кнопки на Правой Панели
    const btnChat = document.getElementById('btn-priv-chat');
    if (btnChat) btnChat.onclick = () => { window.closeUserProfile(); if(typeof window.switchWebChat === 'function') window.switchWebChat(userId); };

    const btnVoice = document.getElementById('btn-voice-msg');
    if (btnVoice) btnVoice.onclick = () => { alert('Voice Msg feature coming soon!'); };

    const btnAudio = document.getElementById('btn-app-audio');
    if (btnAudio) btnAudio.onclick = () => { window.closeUserProfile(); if(typeof window.startWebCall === 'function') window.startWebCall(userId, 'voice'); };

    const btnVideo = document.getElementById('btn-app-video');
    if (btnVideo) btnVideo.onclick = () => { window.closeUserProfile(); if(typeof window.openConference === 'function') window.openConference(); };

    const btnPhone = document.getElementById('btn-phone-call');
    if (btnPhone) btnPhone.onclick = () => { alert('Calling ' + (user.phone || 'Hidden') + ' via Phone'); };

    // Анимация выезда панелей
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
        }, 300);
    }
};
