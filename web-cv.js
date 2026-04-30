// Генерация аватаров для ГЛАВНОГО ЭКРАНА
// Принимает тот же массив реальных юзеров из БД, что и CV-модуль
window.renderMainScreenAvatars = function(realUsersArray, currentUserId) {
    const container = document.getElementById('main-chat-avatars');
    if (!container) return;

    // 1. Статичные системные комнаты (Global и AI)
    let html = `
        <!-- Global Group -->
        <div onclick="switchWebChat('global')" class="flex flex-col items-center text-center w-16 md:w-20 shrink-0 cursor-pointer group">
            <div class="w-14 h-14 md:w-16 md:h-16 rounded-full bg-indigo-500 mb-2 flex justify-center items-center text-white text-2xl font-bold group-active:scale-95 transition-transform shadow-md">🌍</div>
            <p class="font-bold text-xs text-indigo-500 truncate w-full">Global</p>
        </div>
        
        <!-- AI Assistant -->
        <div onclick="switchWebChat('ai')" class="flex flex-col items-center text-center w-16 md:w-20 shrink-0 cursor-pointer group">
            <div class="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-[#00d4ff] to-blue-500 mb-2 flex justify-center items-center text-white text-2xl font-bold group-active:scale-95 transition-transform shadow-md border-2 border-[#00d4ff]/30">🤖</div>
            <p class="font-bold text-xs text-[#00d4ff] truncate w-full">AI</p>
        </div>
    `;

    // 2. Реальные пользователи из базы (с функцией switchWebChat)
    realUsersArray.forEach(user => {
        const isMe = user.id === currentUserId;
        // Твой аватар выделяем неоновой рамкой, остальные — стандартной
        const borderClass = isMe ? 'border-2 border-[#00d4ff] shadow-[0_0_10px_rgba(0,212,255,0.4)]' : 'border border-gray-300 dark:border-slate-600';
        const nameToDisplay = isMe ? 'You' : (user.displayName || 'User');

        html += `
            <div onclick="switchWebChat('${user.id}')" class="flex flex-col items-center text-center w-16 md:w-20 shrink-0 cursor-pointer group relative">
                <img src="${user.photoURL || 'default-avatar.png'}" class="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover mb-2 group-active:scale-95 transition-transform shadow-md ${borderClass}">
                
                <!-- Зеленая точка онлайна -->
                <div class="absolute top-0 right-1 md:right-2 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-[#1e293b] rounded-full"></div>
                
                <p class="font-semibold text-xs text-gray-800 dark:text-gray-200 truncate w-full">${nameToDisplay}</p>
            </div>
        `;
    });

    container.innerHTML = html;
};
