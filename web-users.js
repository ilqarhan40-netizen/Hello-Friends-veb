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
    const topHorizontalBar = document.getElementById('top-users-horizontal-bar'); 
    const footerContacts = document.getElementById('footer-contacts-container'); 

    if (!window.participants || window.participants.length === 0) return;

    const usersList = window.participants;

    if (topHorizontalBar) {
        topHorizontalBar.innerHTML = '';
        usersList.forEach(user => {
            let userName = (user.name || 'User').split(' ')[0];
            let userPhoto = user.photo || 'https://ui-avatars.com/api/?name=U';
            
            // 🔥 Умный парсинг флага: превращаем буквы (AZ, DE, GB) в PNG картинку
            let flagText = user.flagCode || user.flag || 'un';
            // Очищаем от лишнего и переводим в нижний регистр (DE -> de)
            let fCode = flagText.replace(/[^a-zA-Z]/g, '').toLowerCase();
            if(!fCode || fCode.length !== 2) fCode = 'un'; // Заглушка, если код пустой
            let flagUrl = `https://flagcdn.com/w40/${fCode}.png`;

            let avatarItem = document.createElement('div');
            avatarItem.className = "flex flex-col items-center shrink-0 cursor-pointer hover:opacity-80 hover:scale-105 transition w-16 mx-2"; 
            
            avatarItem.onclick = () => window.openUserProfile(user.id);
            
            avatarItem.innerHTML = `
                <div class="relative mb-1">
                    <img src="${userPhoto}" class="w-12 h-12 rounded-full object-cover border-2 border-indigo-500 dark:border-[#00faad] shadow-md">
                    <!-- 🔥 ТЕПЕРЬ ЗДЕСЬ PNG ФЛАГ 🔥 -->
                    <img src="${flagUrl}" class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full object-cover border border-white dark:border-slate-800 shadow-sm">
                </div>
                <span class="text-[10px] text-gray-800 dark:text-gray-200 font-bold truncate w-full text-center">${userName}</span>
            `;
            topHorizontalBar.appendChild(avatarItem);
        });
    }

    if (footerContacts) {
        footerContacts.innerHTML = '';
        usersList.forEach(user => {
            let userName = (user.name || 'User').split(' ')[0];
            let userPhoto = user.photo || 'https://ui-avatars.com/api/?name=U';

            let footerItem = document.createElement('div');
            footerItem.className = "flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 p-2 rounded-lg transition";
            
            footerItem.onclick = () => window.openUserProfile(user.id);
            
            footerItem.innerHTML = `
                <img src="${userPhoto}" class="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-slate-600">
                <span class="text-xs font-bold text-gray-700 dark:text-gray-300">${userName}</span>
                <div class="ml-auto flex gap-1">
                    <button onclick="event.stopPropagation(); window.startWebCall('${user.id}', 'voice')" class="text-indigo-500 hover:text-indigo-700 p-1"><i class="fa-solid fa-phone"></i></button>
                    <button onclick="event.stopPropagation(); window.openConference()" class="text-[#00faad] hover:text-green-400 p-1"><i class="fa-solid fa-video"></i></button>
                </div>
            `;
            footerContacts.appendChild(footerItem);
        });
    }
};

// ==========================================
// ЛОГИКА ОКОН ПРОФИЛЯ (Полная база на 12+ стран)
// ==========================================

window.openUserProfile = function(userId) {
    const user = window.participants.find(u => u.id === userId);
    if(!user) return;

    // Подготовка PNG флага
    let flagText = user.flagCode || user.flag || 'un';
    let fCode = flagText.replace(/[^a-zA-Z]/g, '').toLowerCase();
    if(!fCode || fCode.length !== 2) fCode = 'un';
    if(fCode === 'en') fCode = 'gb'; // Фикс английского флага

    // 🔥 ПОЛНАЯ БАЗА СТРАН (Под твои 12 языков)
    const countryInfoDB = {
        'az': { country: 'Azerbaijan', pop: '~10.1M', seas: 'Caspian Sea', about: 'Azerbaijan is a country in the South Caucasus region of Eurasia.' },
        'it': { country: 'Italy', pop: '~59M', seas: 'Mediterranean, Adriatic', about: 'Italy is a country in Southern Europe, famous for art and cuisine.' },
        'de': { country: 'Germany', pop: '~83M', seas: 'North Sea, Baltic Sea', about: 'Germany is a country in Central Europe, known for its strong economy and history.' },
        'gb': { country: 'United Kingdom', pop: '~67M', seas: 'Atlantic Ocean, North Sea', about: 'The UK is an island nation in northwestern Europe.' },
        'us': { country: 'USA', pop: '~335M', seas: 'Atlantic, Pacific', about: 'The United States is a country primarily located in North America.' },
        'ru': { country: 'Russia', pop: '~144M', seas: 'Arctic Ocean, Pacific Ocean', about: 'Russia is the largest country in the world, spanning Eastern Europe and Northern Asia.' },
        'tr': { country: 'Turkey', pop: '~85M', seas: 'Mediterranean, Black Sea', about: 'Turkey is a transcontinental country located mainly on the Anatolian Peninsula.' },
        'fr': { country: 'France', pop: '~68M', seas: 'Mediterranean, Atlantic', about: 'France is a country in Western Europe known for its culture and history.' },
        'es': { country: 'Spain', pop: '~47M', seas: 'Mediterranean, Atlantic', about: 'Spain is a country in Southwestern Europe, known for its diverse geography and cultures.' },
        'pt': { country: 'Portugal', pop: '~10M', seas: 'Atlantic Ocean', about: 'Portugal is a southern European country on the Iberian Peninsula.' },
        'jp': { country: 'Japan', pop: '~125M', seas: 'Pacific Ocean, Sea of Japan', about: 'Japan is an island country in East Asia.' },
        'cn': { country: 'China', pop: '~1.4B', seas: 'Yellow Sea, East China Sea', about: 'China is a country in East Asia and the world\'s second-most populous country.' },
        'ae': { country: 'UAE', pop: '~9.4M', seas: 'Persian Gulf, Gulf of Oman', about: 'The United Arab Emirates is a country in Western Asia at the southeast end of the Arabian Peninsula.' }
    };

    // Берем данные из базы стран (или пустые, если страны нет в списке)
    const defaultInfo = countryInfoDB[fCode] || { country: 'Global', pop: '', seas: '', about: '' };

    // 1. Заполняем Левую Панель (Анкета)
    const photoEl = document.getElementById('modal-user-photo');
    if (photoEl) photoEl.src = user.photo || 'https://ui-avatars.com/api/?name=U';
    
    const nameEl = document.getElementById('modal-user-name');
    if (nameEl) nameEl.innerText = user.name || 'User';
    
    const countryEl = document.getElementById('modal-user-country');
    if (countryEl) countryEl.innerHTML = `<img src="https://flagcdn.com/w40/${fCode}.png" class="w-5 h-auto rounded-sm border border-gray-200 dark:border-slate-700"> <span class="font-medium">${user.country || defaultInfo.country}</span>`;
    
    const langsEl = document.getElementById('modal-user-langs');
    if (langsEl) langsEl.innerText = user.languages || user.profileLangs || '';
    
    const popEl = document.getElementById('modal-user-pop');
    if (popEl) popEl.innerText = user.population || defaultInfo.pop;
    
    const seasEl = document.getElementById('modal-user-seas');
    if (seasEl) seasEl.innerText = user.seas || defaultInfo.seas;
    
    const aboutEl = document.getElementById('modal-user-about');
    if (aboutEl) aboutEl.innerText = user.about || defaultInfo.about;

    // 2. Назначаем действия на Правой Панели (Кнопки)
    const btnPrivChat = document.getElementById('btn-priv-chat');
    if (btnPrivChat) btnPrivChat.onclick = () => { window.closeUserProfile(); if(typeof window.switchWebChat === 'function') window.switchWebChat(userId); };
    
    const btnVoiceMsg = document.getElementById('btn-voice-msg');
    if (btnVoiceMsg) btnVoiceMsg.onclick = () => { alert('Voice Msg feature coming soon!'); };
    
    const btnAppAudio = document.getElementById('btn-app-audio');
    if (btnAppAudio) btnAppAudio.onclick = () => { window.closeUserProfile(); if(typeof window.startWebCall === 'function') window.startWebCall(userId, 'voice'); };
    
    const btnAppVideo = document.getElementById('btn-app-video');
    if (btnAppVideo) btnAppVideo.onclick = () => { window.closeUserProfile(); if(typeof window.openConference === 'function') window.openConference(); };
    
    const btnPhoneCall = document.getElementById('btn-phone-call');
    if (btnPhoneCall) btnPhoneCall.onclick = () => { alert('Calling ' + (user.phone || 'Hidden') + ' via Phone'); };

    // 3. Показываем панели и запускаем анимацию выезда
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
