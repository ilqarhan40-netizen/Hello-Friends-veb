// ==========================================
// ГЕНЕРАТОР КОНТАКТОВ И АВАТАРОК (WEB ВЕРСИЯ)
// ==========================================

window.participants = [];

// Ждем 2 секунды (пока пройдет авторизация), затем качаем базу юзеров
setTimeout(() => {
    firebase.database().ref('users').on('value', (snapshot) => {
        const data = snapshot.val();
        if (!data) return;
        
        // Убираем бота AI и самого себя из списка
        let myId = window.myProfileInfo ? window.myProfileInfo.id : 'guest';
        window.participants = Object.values(data).filter(u => u.id && u.id !== 'ai' && u.id !== myId);
        
        // Команда на отрисовку
        if(typeof window.renderContactsList === 'function') window.renderContactsList();
        if(typeof window.renderCVList === 'function') window.renderCVList();
    });
}, 2000); 

window.renderContactsList = function() {
    // Ищем контейнеры в твоем HTML
    const topBar = document.getElementById('top-users-horizontal-bar'); // Верхняя лента в Чате
    const contactsList = document.getElementById('web-contacts-list');  // Раздел "Контакты"

    if (!window.participants || window.participants.length === 0) return;

    // 1. РИСУЕМ КРУГЛЫЕ АВАТАРКИ В ЧАТЕ (СВЕРХУ)
    if (topBar) {
        topBar.innerHTML = '';
        window.participants.forEach(user => {
            let userPhoto = user.photo || 'https://ui-avatars.com/api/?name=U';
            let userName = (user.name || 'User').split(' ')[0];
            let flag = user.flag || '🌐';

            let div = document.createElement('div');
            div.className = "flex flex-col items-center shrink-0 cursor-pointer w-16 mx-2 hover:scale-105 transition";
            div.onclick = () => window.switchChatRoom(user.id);
            // Вот они, твои круглые аватарки! (w-12 h-12 rounded-full)
            div.innerHTML = `
                <div class="relative mb-1">
                    <img src="${userPhoto}" class="w-12 h-12 rounded-full object-cover border-2 border-indigo-500 dark:border-[#00faad] shadow-md">
                    <span class="absolute -bottom-1 -right-1 text-[10px] bg-white dark:bg-slate-800 rounded-full px-1 shadow border border-gray-200 dark:border-slate-700 leading-none">${flag}</span>
                </div>
                <span class="text-[10px] text-gray-800 dark:text-gray-200 font-bold truncate w-full text-center">${userName}</span>
            `;
            topBar.appendChild(div);
        });
    }

    // 2. РИСУЕМ ТВОИ ЛЮБИМЫЕ КАРТОЧКИ В РАЗДЕЛЕ "КОНТАКТЫ"
    if (contactsList) {
        contactsList.innerHTML = '';
        window.participants.forEach(user => {
            let userPhoto = user.photo || 'https://ui-avatars.com/api/?name=U';
            let userName = (user.name || 'User').split(' ')[0];
            let flag = user.flag || '🌐';
            let phoneStr = user.phone || 'Hidden'; 

            let card = document.createElement('div');
            card.className = "bg-white dark:bg-slate-800 rounded-xl p-4 flex items-center justify-between border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-shadow mb-3";
            card.innerHTML = `
                <div class="flex items-center gap-4 cursor-pointer w-full" onclick="window.switchChatRoom('${user.id}')">
                    <div class="relative">
                        <!-- И здесь круглые аватарки! (w-14 h-14 rounded-full) -->
                        <img src="${userPhoto}" class="w-14 h-14 rounded-full object-cover border-2 border-indigo-500">
                        <span class="absolute -bottom-1 -right-1 text-sm bg-white dark:bg-slate-800 rounded-full px-1 shadow">${flag}</span>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-gray-900 dark:text-white font-bold text-lg">${userName}</span>
                        <span class="text-gray-500 dark:text-gray-400 text-sm"><i class="fa-solid fa-phone text-indigo-500 text-xs mr-1"></i> ${phoneStr}</span>
                    </div>
                </div>
                <div class="flex gap-2 shrink-0">
                    <button onclick="window.startWebCall('${user.id}', 'voice')" class="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 text-indigo-600 dark:text-[#00C4CC] flex items-center justify-center hover:bg-indigo-100 transition shadow"><i class="fa-solid fa-phone"></i></button>
                    <button onclick="window.startWebCall('${user.id}', 'video')" class="w-10 h-10 rounded-full bg-indigo-600 dark:bg-[#00C4CC] text-white dark:text-black flex items-center justify-center hover:scale-105 transition shadow-md"><i class="fa-solid fa-video"></i></button>
                </div>
            `;
            contactsList.appendChild(card);
        });
    }
};

// Заглушка для кнопок звонка (чтобы не выдавало ошибку при клике)
window.startWebCall = function(targetId, type) {
    if (type === 'video') window.openConference();
    else alert('Voice call started for: ' + targetId);
};
