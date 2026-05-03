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
// ==========================================
// КОНФЕРЕНЦИЯ НА 6 ОКОН (WEB ВЕРСИЯ)
// ==========================================

window.initConference = function() {
    const confGrid = document.getElementById('conference-grid');
    if (!confGrid) return;

    // Жесткая сетка для веба: 3 колонки (или 2 на средних экранах)
    confGrid.className = "grid grid-cols-2 md:grid-cols-3 gap-4 w-full h-full p-4";

    let myReadLang = window.appLang || 'en'; 
    let myReadFlag = window.myProfileInfo ? (window.myProfileInfo.flag || '🌐') : '🌐';

    // Окно 1: Твоя камера (Локальная)
    let confHtml = `
    <div class="relative bg-slate-900 dark:bg-black rounded-2xl overflow-hidden border-4 border-indigo-500 shadow-xl h-[30vh] md:h-[40vh]">
        <video id="web-my-live-video" class="w-full h-full object-cover mirror-video" autoplay playsinline muted></video>
        <div class="absolute bottom-3 left-3 bg-black/70 backdrop-blur px-3 py-1 rounded-lg text-white text-sm font-bold shadow">${window.myUsername} (Me)</div>
        <div class="absolute top-3 right-3 shadow-lg"><img src="https://flagcdn.com/w40/${window.myProfileInfo?.flagCode || 'un'}.png" class="w-8 rounded border border-gray-600"></div>
        <div class="absolute bottom-0 left-0 w-full bg-black/80 px-2 py-1 text-[10px] text-indigo-400 font-bold truncate">➔ [AUTO] Защищенный канал...</div>
    </div>`;

    // Окна 2-6: Слоты для остальных (Пустые посадочные места)
    for (let i = 1; i <= 5; i++) {
        confHtml += `
        <div class="relative bg-gray-100 dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-300 dark:border-slate-700 h-[30vh] md:h-[40vh] flex flex-col items-center justify-center shadow-md transition" id="conf-slot-${i}">
            <i class="fa-solid fa-user-astronaut text-6xl text-gray-300 dark:text-slate-600 mb-2"></i>
            <span class="text-gray-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">Ожидание...</span>
            <video id="web-remote-video-${i}" class="absolute inset-0 w-full h-full object-cover hidden" autoplay playsinline></video>
            <div id="conf-name-${i}" class="absolute bottom-3 left-3 bg-black/70 backdrop-blur px-3 py-1 rounded-lg text-white text-sm font-bold shadow hidden">User</div>
            <div id="conf-flag-${i}" class="absolute top-3 right-3 shadow-lg hidden"><img src="" class="w-8 rounded border border-gray-600"></div>
            <div class="absolute bottom-0 left-0 w-full bg-black/80 px-2 py-1 text-[10px] text-yellow-400 font-bold truncate hidden" id="conf-marquee-${i}"></div>
        </div>`;
    }

    confGrid.innerHTML = confHtml;

    // Включаем твою камеру для первого окна
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
            window.myConfStream = stream;
            const myVideo = document.getElementById('web-my-live-video');
            if (myVideo) myVideo.srcObject = stream;
        }).catch(e => console.log("Камера для конференции заблокирована", e));
};
