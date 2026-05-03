// ==========================================
// ГЕНЕРАТОР КОНТАКТОВ (WEB ВЕРСИЯ - ГОРИЗОНТАЛЬ И ФУТЕР)
// ==========================================

window.renderContactsList = function() {
    // ID контейнеров подставь свои, если они называются иначе
    const topHorizontalBar = document.getElementById('top-users-horizontal-bar'); 
    const footerContacts = document.getElementById('footer-contacts-container'); 

    if (!window.participants || window.participants.length === 0) return;

    // Исключаем бота и себя из списка живых людей
    const usersList = window.participants.filter(p => p.id !== 'ai' && p.id !== (window.myProfileInfo ? window.myProfileInfo.id : 'guest'));

    // --- 1. ГОРИЗОНТАЛЬНАЯ ЛЕНТА СВЕРХУ ---
    if (topHorizontalBar) {
        topHorizontalBar.innerHTML = '';
        usersList.forEach(user => {
            let userName = (user.name || 'User').split(' ')[0];
            let userPhoto = user.photo || 'https://ui-avatars.com/api/?name=U';
            let flag = user.flag || '🌐';

            let avatarItem = document.createElement('div');
            // shrink-0 обязателен для горизонтального скролла (flex-row overflow-x-auto)
            avatarItem.className = "flex flex-col items-center shrink-0 cursor-pointer hover:opacity-80 hover:scale-105 transition w-16 mx-2"; 
            
            // 🔥 ИСПРАВЛЕНО ЗДЕСЬ: switchWebChat вместо switchChatRoom 🔥
            avatarItem.onclick = () => window.switchWebChat(user.id); 
            
            avatarItem.innerHTML = `
                <div class="relative mb-1">
                    <img src="${userPhoto}" class="w-12 h-12 rounded-full object-cover border-2 border-indigo-500 dark:border-[#00faad] shadow-md">
                    <span class="absolute -bottom-1 -right-1 text-[10px] bg-white dark:bg-slate-800 rounded-full px-1 shadow border border-gray-200 dark:border-slate-700 leading-none">${flag}</span>
                </div>
                <span class="text-[10px] text-gray-800 dark:text-gray-200 font-bold truncate w-full text-center">${userName}</span>
            `;
            topHorizontalBar.appendChild(avatarItem);
        });
    }

    // --- 2. ОТДЕЛЬНЫЙ ФУТЕР КОНТАКТОВ ---
    if (footerContacts) {
        footerContacts.innerHTML = '';
        usersList.forEach(user => {
            let userName = (user.name || 'User').split(' ')[0];
            let userPhoto = user.photo || 'https://ui-avatars.com/api/?name=U';

            let footerItem = document.createElement('div');
            footerItem.className = "flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 p-2 rounded-lg transition";
            
            // 🔥 ИСПРАВЛЕНО ЗДЕСЬ: switchWebChat вместо switchChatRoom 🔥
            footerItem.onclick = () => window.switchWebChat(user.id); 
            
            footerItem.innerHTML = `
                <img src="${userPhoto}" class="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-slate-600">
                <span class="text-xs font-bold text-gray-700 dark:text-gray-300">${userName}</span>
                <div class="ml-auto flex gap-1">
                    <button onclick="event.stopPropagation(); window.startWebCall('${user.id}', 'voice')" class="text-indigo-500 hover:text-indigo-700 p-1"><i class="fa-solid fa-phone"></i></button>
                    <button onclick="event.stopPropagation(); window.startWebCall('${user.id}', 'video')" class="text-[#00faad] hover:text-green-400 p-1"><i class="fa-solid fa-video"></i></button>
                </div>
            `;
            footerContacts.appendChild(footerItem);
        });
    }
};

// Заглушка для веб-звонков (подключим логику позже)
window.startWebCall = function(targetId, type) {
    // Эта функция свяжет кнопку звонка с веб-модалками
    console.log(`Начинаем звонок ${type} пользователю ${targetId} (Web UI)`);
};
