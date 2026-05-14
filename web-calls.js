// ==========================================
// Файл: web-calls.js
// Назначение: Сетка видеоконференции и логика звонков
// ==========================================

// --- 1. ОТКРЫТИЕ СЕТКИ И ГЕНЕРАЦИЯ ПОЛЬЗОВАТЕЛЕЙ (Твой оригинальный код) ---
window.openConference = function() {
    if(typeof window.closeDropdown === 'function') window.closeDropdown();
    const overlay = document.getElementById('conference-overlay');
    const grid = document.getElementById('conference-grid');
    
    if(overlay) overlay.style.display = 'flex';
    
    if (grid && window.participants) {
        grid.innerHTML = ''; 
        
        let allUsers = [window.myProfileInfo, ...window.participants].filter(Boolean);
        let uniqueUsers = [];
        let seen = new Set();
        
        allUsers.forEach(u => {
            if (u.id && !seen.has(u.id)) {
                seen.add(u.id);
                uniqueUsers.push(u);
            }
        });
        
        // Берем 6 уникальных юзеров
        let activeUsers = uniqueUsers.slice(0, 6);
        
        activeUsers.forEach(user => {
            let flagText = user.flagCode || user.flag || 'un';
            let fCode = flagText.replace(/[^a-zA-Z]/g, '').toLowerCase();
            if(!fCode || fCode.length !== 2) fCode = 'un';
            if(fCode === 'en') fCode = 'gb'; 
            
            let card = document.createElement('div');
            card.className = "user-card relative aspect-video bg-gray-900 rounded-xl overflow-hidden border border-gray-700 shadow-lg";
            
            card.innerHTML = `
                <img src="${user.photo || 'https://ui-avatars.com/api/?name=U'}" class="absolute inset-0 w-full h-full object-cover opacity-80">
                <div class="absolute top-3 left-3 bg-black/60 px-2 py-1 rounded text-white text-xs font-bold">${(user.name || 'User').split(' ')[0]}</div>
                <img src="https://flagcdn.com/w40/${fCode}.png" class="absolute top-3 right-3 w-6 h-auto rounded shadow">
                <div class="absolute bottom-3 left-3 right-3 bg-black/60 rounded h-6 overflow-hidden flex items-center">
                    <span class="inline-block pl-[100%] animate-[scroll-text_12s_linear_infinite] text-[10px] text-white whitespace-nowrap font-mono">Waiting for voice translation...</span>
                </div>
            `;
            grid.appendChild(card);
        });
    }
};

window.openVoiceChat = function() {
    if(typeof window.closeDropdown === 'function') window.closeDropdown();
    const overlay = document.getElementById('voice-overlay');
    if(overlay) overlay.style.display = 'flex';
};

window.closeCalls = function() {
    const confOverlay = document.getElementById('conference-overlay');
    const voiceOverlay = document.getElementById('voice-overlay');
    if(confOverlay) confOverlay.style.display = 'none';
    if(voiceOverlay) voiceOverlay.style.display = 'none';
};

// --- 2. ЛОГИКА ВИДЕОКОНФЕРЕНЦИИ (МИКРОФОН, ОТПРАВКА, СУБТИТРЫ) ---

// Отправка сообщения из Видеоконференции
window.sendConfMessage = function() {
    const confInput = document.getElementById('conf-text-input');
    if (!confInput || !confInput.value.trim()) return;

    const text = confInput.value.trim();

    // Добавляем текст в бегущую строку конференции (CC)
    const marquee = document.getElementById('conf-marquee');
    if (marquee) {
        marquee.innerText = `Me: ${text} • ` + marquee.innerText;
    }

    // Дублируем текст в основной чат (если нужно для истории)
    const mainChatInput = document.getElementById('chat-input') || document.getElementById('web-chat-input');
    if (mainChatInput) {
        mainChatInput.value = text;
        if (typeof window.sendFirebaseMsg === 'function') window.sendFirebaseMsg(); 
    }
    
    // Очищаем поле
    confInput.value = ''; 
};

// Вкл/Выкл Микрофона (С распознаванием речи)
window.toggleConfMic = function(btn) {
    const icon = btn.querySelector('i');
    
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
        return alert('Голосовой ввод не поддерживается в твоем браузере.');
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    // Язык распознавания берем из настроек или авто
    recognition.lang = window.chatLang && window.chatLang !== 'auto' ? window.chatLang : 'ru-RU'; 
    recognition.interimResults = false;

    // Визуально включаем микрофон (красный цвет записи)
    icon.classList.replace('fa-microphone', 'fa-microphone-slash');
    btn.classList.replace('bg-gray-200', 'bg-red-500');
    btn.classList.remove('dark:bg-gray-700');
    btn.classList.add('text-white');

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        const confInput = document.getElementById('conf-text-input');
        if (confInput) {
            confInput.value = transcript;
            window.sendConfMessage(); // Сразу кидаем сказанное в бегущую строку
        }
    };

    recognition.onspeechend = function() {
        recognition.stop();
        icon.classList.replace('fa-microphone-slash', 'fa-microphone');
        btn.classList.replace('bg-red-500', 'bg-gray-200');
        btn.classList.add('dark:bg-gray-700');
        btn.classList.remove('text-white');
    };

    recognition.onerror = function() {
        recognition.stop();
        icon.classList.replace('fa-microphone-slash', 'fa-microphone');
        btn.classList.replace('bg-red-500', 'bg-gray-200');
        btn.classList.add('dark:bg-gray-700');
        btn.classList.remove('text-white');
    };

    recognition.start();
};

// Вкл/Выкл Камеры (визуально)
window.toggleConfCam = function(btn) {
    const icon = btn.querySelector('i');
    if (icon.classList.contains('fa-video')) {
        icon.classList.replace('fa-video', 'fa-video-slash');
        btn.classList.remove('bg-indigo-600', 'dark:bg-[#00C4CC]');
        btn.classList.add('bg-red-500');
    } else {
        icon.classList.replace('fa-video-slash', 'fa-video');
        btn.classList.remove('bg-red-500');
        btn.classList.add('bg-indigo-600', 'dark:bg-[#00C4CC]');
    }
};

// Вкл/Выкл CC (Бегущая строка перевода)
window.toggleConfCC = function(btn) {
    const marqueeContainer = document.getElementById('conf-marquee-container');
    const isActive = btn.classList.contains('bg-indigo-600') || btn.classList.contains('dark:bg-[#00C4CC]');

    if (isActive) {
        // ВЫКЛЮЧАЕМ
        btn.classList.remove('bg-indigo-600', 'dark:bg-[#00C4CC]', 'dark:text-black');
        btn.classList.add('bg-gray-400', 'text-white');
        if (marqueeContainer) marqueeContainer.classList.add('hidden');
    } else {
        // ВКЛЮЧАЕМ
        btn.classList.remove('bg-gray-400', 'text-white');
        btn.classList.add('bg-indigo-600', 'dark:bg-[#00C4CC]', 'dark:text-black');
        if (marqueeContainer) {
            marqueeContainer.classList.remove('hidden');
            marqueeContainer.classList.add('flex');
        }
    }
};

// Закрытие комнаты (кнопка с красной трубкой)
window.closeConferenceRoom = function() {
    const confModal = document.getElementById('conference-overlay');
    if (confModal) confModal.style.display = 'none';
};

// ==========================================
// ЛОГИКА ВЫБОРА ТИПА ЗВОНКА (ИЗ ПРОФИЛЯ)
// ==========================================

// Открыть меню выбора
window.openCallMenu = function() {
    const m = document.getElementById('call-menu-modal');
    if (m) { 
        m.classList.remove('hidden'); 
        m.classList.add('flex'); 
    }
};

// 1. Звонок внутри приложения
window.startInAppCall = function() {
    window.closeModal('call-menu-modal');
    // Перекидываем сразу в Голосовую комнату (встроенная функция)
    if (typeof window.startVoiceCall === 'function') {
        window.startVoiceCall();
    } else {
        alert("Голосовая комната недоступна.");
    }
};

// 2. Звонок на внешний номер
window.startExternalCall = function() {
    window.closeModal('call-menu-modal');
    // Тут пока заглушка, потом прикрутим API для GSM-звонков
    alert("Инициирован звонок на внешний номер (GSM)!");
};
