
// ==========================================
// ФАЙЛ: web-users.js
// Модальная карточка профиля (Инфо + Действия)
// ==========================================

window.openAvatarModal = function(uid) {
    if (!window.appUsers || !window.appUsers[uid]) return;

    const user = window.appUsers[uid];
    const cv = user.cv || {};
    
    // Проверка на создателя по номеру телефона
    const isCreator = user.phone === "+994503398020" || (cv.role && cv.role.toLowerCase().includes('creator'));
    
    let modal = document.getElementById('unified-user-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'unified-user-modal';
        modal.className = 'fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[10000] flex justify-center items-center p-4 transition-opacity';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="bg-white dark:bg-slate-800 w-full max-w-sm rounded-[2rem] shadow-2xl relative flex flex-col overflow-hidden animate-fade-in" onclick="event.stopPropagation()">
            
            <button onclick="document.getElementById('unified-user-modal').remove()" class="absolute top-4 right-4 w-8 h-8 bg-gray-100 dark:bg-slate-700 hover:bg-red-500 hover:text-white text-gray-500 dark:text-gray-300 rounded-full flex items-center justify-center transition-colors z-50">
                <i class="fa-solid fa-xmark"></i>
            </button>

            <!-- ШАПКА: Аватар и Имя -->
            <div class="flex flex-col items-center pt-8 pb-4">
                <img src="${user.photo || 'https://ui-avatars.com/api/?name=U'}" class="w-24 h-24 rounded-full object-cover shadow-md mb-3 border-2 border-gray-100 dark:border-slate-700">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">${user.name}</h3>
                <p class="text-[10px] text-gray-400 font-mono mt-1">ID: ${uid.substring(0, 10)}...</p>
                
                <!-- Блок Создателя -->
                ${isCreator ? 
                    `<div class="mt-3 flex flex-col items-center">
                        <p class="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">Creator app</p>
                        <p class="text-xs font-bold text-gray-800 dark:text-white">HELLO FRIENDS</p>
                    </div>` 
                    : ''
                }
            </div>

            <!-- ИНФО-БЛОК (Страна, Языки, Население, Моря) -->
            <div class="px-6 py-4 bg-gray-50 dark:bg-slate-900/50 m-4 mt-0 rounded-2xl border border-gray-100 dark:border-slate-700 space-y-3">
                <div class="flex items-center text-sm">
                    <i class="fa-solid fa-earth-americas w-6 text-indigo-400"></i>
                    <span class="text-gray-500 mr-2">Country:</span>
                    <img src="https://flagcdn.com/w20/${user.flagCode || 'az'}.png" class="rounded-sm shadow-sm mr-1 w-4" onerror="this.style.display='none'">
                    <span class="font-semibold text-gray-800 dark:text-gray-200">${user.country || 'Not specified'}</span>
                </div>
                <div class="flex items-center text-sm">
                    <i class="fa-solid fa-language w-6 text-blue-400"></i>
                    <span class="text-gray-500 mr-2">Languages:</span>
                    <span class="font-semibold text-gray-800 dark:text-gray-200">${cv.languages || user.profileLangs || '-'}</span>
                </div>
                <div class="flex items-center text-sm">
                    <i class="fa-solid fa-users w-6 text-green-400"></i>
                    <span class="text-gray-500 mr-2">Population:</span>
                    <span class="font-semibold text-gray-800 dark:text-gray-200">${user.population || '-'}</span>
                </div>
                <div class="flex items-center text-sm">
                    <i class="fa-solid fa-water w-6 text-cyan-400"></i>
                    <span class="text-gray-500 mr-2">Seas:</span>
                    <span class="font-semibold text-gray-800 dark:text-gray-200">${user.seas || '-'}</span>
                </div>
                
                ${cv.about ? `
                <div class="pt-3 mt-3 border-t border-gray-200 dark:border-slate-700">
                    <p class="text-[10px] text-gray-400 font-bold mb-1">About:</p>
                    <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">${cv.about}</p>
                </div>` : ''}
            </div>

            <!-- СЕТКА КНОПОК ДЕЙСТВИЙ -->
            <div class="px-4 pb-6 grid grid-cols-2 gap-2">
                <button onclick="actionPrivateChat('${uid}')" class="flex flex-col items-center justify-center p-3 bg-slate-800 dark:bg-slate-700 hover:bg-indigo-600 rounded-xl transition-colors text-white shadow-sm">
                    <i class="fa-solid fa-lock text-green-400 text-lg mb-1"></i>
                    <span class="text-xs font-bold">Private Chat</span>
                </button>
                <button onclick="actionVoiceRoom('${uid}')" class="flex flex-col items-center justify-center p-3 bg-slate-800 dark:bg-slate-700 hover:bg-green-600 rounded-xl transition-colors text-white shadow-sm">
                    <i class="fa-solid fa-microphone text-indigo-400 text-lg mb-1"></i>
                    <span class="text-xs font-bold">Voice Msg</span>
                </button>
                <button onclick="actionAppAudio('${uid}')" class="flex flex-col items-center justify-center p-3 bg-slate-800 dark:bg-slate-700 hover:bg-blue-600 rounded-xl transition-colors text-white shadow-sm">
                    <i class="fa-solid fa-headset text-gray-300 text-lg mb-1"></i>
                    <span class="text-xs font-bold">App Audio</span>
                </button>
                <button onclick="actionAppVideo('${uid}')" class="flex flex-col items-center justify-center p-3 bg-slate-800 dark:bg-slate-700 hover:bg-rose-600 rounded-xl transition-colors text-white shadow-sm">
                    <i class="fa-solid fa-video text-rose-400 text-lg mb-1"></i>
                    <span class="text-xs font-bold">App Video</span>
                </button>
                <button onclick="actionCellularCall('${uid}')" class="col-span-2 flex items-center justify-center gap-2 p-3 bg-slate-800 dark:bg-slate-700 hover:bg-emerald-600 rounded-xl transition-colors text-white shadow-sm mt-1">
                    <span class="text-xs font-bold">Phone Call</span>
                </button>
            </div>
        </div>
    `;

    modal.onclick = function(e) { if(e.target === modal) modal.remove(); };
};

// Функции-роутеры кнопок
window.actionPrivateChat = function(uid) {
    document.getElementById('unified-user-modal')?.remove();
    if(typeof window.switchWebChat === 'function') window.switchWebChat(uid);
    const chatNavLink = document.querySelector('.nav-link[data-target="chat"]');
    if(chatNavLink) chatNavLink.click();
};

window.actionVoiceRoom = function(uid) {
    document.getElementById('unified-user-modal')?.remove();
    alert('Voice message feature coming soon!');
};

window.actionAppAudio = function(uid) {
    document.getElementById('unified-user-modal')?.remove();
    if(typeof window.openVoiceChat === 'function') window.openVoiceChat();
};

window.actionAppVideo = function(uid) {
    document.getElementById('unified-user-modal')?.remove();
    if(typeof window.openConference === 'function') window.openConference();
};

window.actionCellularCall = function(uid) {
    const user = window.appUsers[uid];
    if (user && user.phone) {
        window.location.href = `tel:${user.phone}`;
        document.getElementById('unified-user-modal')?.remove();
    } else {
        alert("This user has not linked a phone number.");
    }
};
