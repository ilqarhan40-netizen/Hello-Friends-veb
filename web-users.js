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
// ЛОГИКА ОКОН ПРОФИЛЯ
// ==========================================

window.openUserProfile = function(userId) {
    const user = window.participants.find(u => u.id === userId);
    if(!user) return;

    // Подготовка PNG флага для анкеты профиля
    let flagText = user.flagCode || user.flag || 'un';
    let fCode = flagText.replace(/[^a-zA-Z]/g, '').toLowerCase();
    if(!fCode || fCode.length !== 2) fCode = 'un';

    // 1. Заполняем Левую Панель (Анкета)
    document.getElementById('modal-user-photo').src = user.photo || 'https://ui-avatars.com/api/?name=U';
    document.getElementById('modal-user-name').innerText = user.name || 'User';
    // Добавляем PNG флаг в анкету рядом со страной
    document.getElementById('modal-user-country').innerHTML = `<img src="https://flagcdn.com/w40/${fCode}.png" class="w-5 h-auto rounded-sm"> <span class="font-medium">${user.country || 'Azerbaijan'}</span>`;
    document.getElementById('modal-user-langs').innerText = user.languages || 'Azerbaijani, Russian, English';
    document.getElementById('modal-user-pop').innerText = user.population || '~10.1M';
    document.getElementById('modal-user-seas').innerText = user.seas || 'Caspian Sea';
    document.getElementById('modal-user-about').innerText = user.about || 'Azerbaijan is a country in the South Caucasus region of Eurasia.';

    // 2. Назначаем действия на Правой Панели (Кнопки)
    document.getElementById('btn-priv-chat').onclick = () => { window.closeUserProfile(); window.switchWebChat(userId); };
    document.getElementById('btn-voice-msg').onclick = () => { alert('Voice Msg feature coming soon!'); };
    document.getElementById('btn-app-audio').onclick = () => { window.closeUserProfile(); window.startWebCall(userId, 'voice'); };
    document.getElementById('btn-app-video').onclick = () => { window.closeUserProfile(); window.openConference(); };
    document.getElementById('btn-phone-call').onclick = () => { alert('Calling ' + (user.phone || 'Hidden') + ' via Phone'); };

    // 3. Показываем панели и запускаем анимацию выезда
    const overlay = document.getElementById('web-profile-overlay');
    const leftPanel = document.getElementById('profile-left-panel');
    const rightPanel = document.getElementById('profile-right-panel');

    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
    
    setTimeout(() => {
        leftPanel.classList.remove('-translate-x-full');
        rightPanel.classList.remove('translate-x-full');
    }, 50);
};

window.closeUserProfile = function() {
    const overlay = document.getElementById('web-profile-overlay');
    const leftPanel = document.getElementById('profile-left-panel');
    const rightPanel = document.getElementById('profile-right-panel');

    leftPanel.classList.add('-translate-x-full');
    rightPanel.classList.add('translate-x-full');

    setTimeout(() => {
        overlay.classList.remove('flex');
        overlay.classList.add('hidden');
    }, 300);
};
