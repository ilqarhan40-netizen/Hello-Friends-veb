// ==========================================
// ГЕНЕРАТОР КОНТАКТОВ (WEB ВЕРСИЯ)
// ==========================================

window.renderContactsList = function(data) {
    const contactsContainer = document.getElementById('contacts-list');
    if (!contactsContainer) return;
    
    // Очищаем контейнер
    contactsContainer.innerHTML = '';
    
    // Берем участников из единого мозга (созданного в app.js)
    if (!window.participants || window.participants.length === 0) {
        contactsContainer.innerHTML = '<p class="text-gray-500 w-full text-center">Контаков пока нет...</p>';
        return;
    }

    // Исключаем бота и себя из общего списка
    const usersList = window.participants.filter(p => p.id !== 'ai' && p.id !== (window.myProfileInfo ? window.myProfileInfo.id : 'guest'));

    usersList.forEach(user => {
        let phoneStr = user.phone || 'Hidden'; 
        let userPhoto = user.photo || 'https://ui-avatars.com/api/?name=U';
        let userName = (user.name || 'User').split(' ')[0];
        let flag = user.flag || '🌐';

        // Веб-обертка: карточки, как ты любишь
        let card = document.createElement('div');
        card.className = "bg-white dark:bg-slate-800 rounded-xl p-4 flex items-center justify-between border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-shadow";
        card.innerHTML = `
            <div class="flex items-center gap-4 cursor-pointer w-full" onclick="window.switchChatRoom('${user.id}')">
                <div class="relative">
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
        contactsContainer.appendChild(card);
    });
};

// Заглушка для веб-звонков (подключим логику позже)
window.startWebCall = function(targetId, type) {
    // Эта функция свяжет кнопку звонка с веб-модалками
    console.log(`Начинаем звонок ${type} пользователю ${targetId} (Web UI)`);
};
