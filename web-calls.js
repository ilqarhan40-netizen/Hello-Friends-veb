// ==========================================
// Файл: web-calls.js
// Назначение: Сетка видеоконференции, Голосовая комната, Меню звонков, Скрепка
// ==========================================

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

window.closeCalls = function() {
    const confOverlay = document.getElementById('conference-overlay');
    const voiceOverlay = document.getElementById('voice-room-modal');
    if(confOverlay) confOverlay.style.display = 'none';
    if(voiceOverlay) {
        voiceOverlay.classList.remove('flex');
        voiceOverlay.classList.add('hidden');
    }
};

window.sendConfMessage = function() {
    const confInput = document.getElementById('conf-text-input');
    if (!confInput || !confInput.value.trim()) return;
    const text = confInput.value.trim();
    const marquee = document.getElementById('conf-marquee');
    if (marquee) marquee.innerText = `Me: ${text} • ` + marquee.innerText;
    const mainChatInput = document.getElementById('chat-input') || document.getElementById('web-chat-input');
    if (mainChatInput) {
        mainChatInput.value = text;
        if (typeof window.sendFirebaseMsg === 'function') window.sendFirebaseMsg(); 
    }
    confInput.value = ''; 
};

window.toggleConfMic = function(btn) {
    const icon = btn.querySelector('i');
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) return alert('Голосовой ввод не поддерживается.');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = window.chatLang && window.chatLang !== 'auto' ? window.chatLang : 'ru-RU'; 
    recognition.interimResults = false;

    icon.classList.replace('fa-microphone', 'fa-microphone-slash');
    btn.classList.replace('bg-gray-200', 'bg-red-500');
    btn.classList.remove('dark:bg-gray-700');
    btn.classList.add('text-white');

    recognition.onresult = function(event) {
        const confInput = document.getElementById('conf-text-input');
        if (confInput) {
            confInput.value = event.results[0][0].transcript;
            window.sendConfMessage(); 
        }
    };
    recognition.onspeechend = recognition.onerror = function() {
        recognition.stop();
        icon.classList.replace('fa-microphone-slash', 'fa-microphone');
        btn.classList.replace('bg-red-500', 'bg-gray-200');
        btn.classList.add('dark:bg-gray-700');
        btn.classList.remove('text-white');
    };
    recognition.start();
};

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

window.toggleConfCC = function(btn) {
    const marqueeContainer = document.getElementById('conf-marquee-container');
    const isActive = btn.classList.contains('bg-indigo-600') || btn.classList.contains('dark:bg-[#00C4CC]');
    if (isActive) {
        btn.classList.remove('bg-indigo-600', 'dark:bg-[#00C4CC]', 'dark:text-black');
        btn.classList.add('bg-gray-400', 'text-white');
        if (marqueeContainer) marqueeContainer.classList.add('hidden');
    } else {
        btn.classList.remove('bg-gray-400', 'text-white');
        btn.classList.add('bg-indigo-600', 'dark:bg-[#00C4CC]', 'dark:text-black');
        if (marqueeContainer) {
            marqueeContainer.classList.remove('hidden');
            marqueeContainer.classList.add('flex');
        }
    }
};

window.closeConferenceRoom = function() {
    const confModal = document.getElementById('conference-overlay');
    if (confModal) confModal.style.display = 'none';
};

// ==========================================
// ЛОГИКА ВЫБОРА ЗВОНКА И СДВОЕННАЯ МОДАЛКА
// ==========================================
window.openCallMenu = function() {
    const m = document.getElementById('call-menu-modal');
    if (m) {
        m.style.zIndex = '999999';
        m.classList.remove('hidden'); 
        m.classList.add('flex'); 
    } else {
        alert("Окно call-menu-modal не найдено!");
    }
};

window.startVoiceCall = function() {
    if(typeof window.closeDropdown === 'function') window.closeDropdown();
    window.closeModal('call-menu-modal'); 
    const voiceRoom = document.getElementById('voice-room-modal');
    if(voiceRoom) {
        voiceRoom.classList.remove('hidden');
        voiceRoom.classList.add('flex');
        voiceRoom.style.display = 'flex';
    } else {
        alert("Окно voice-room-modal не найдено!");
    }
};

window.startInAppCall = window.startVoiceCall;
window.openVoiceChat = window.startVoiceCall;
window.openVoiceRoomDirectly = window.startVoiceCall;

window.startExternalCall = function() {
    window.closeModal('call-menu-modal');
    alert("Инициирован звонок на внешний номер (GSM)!");
};

// ==========================================
// МЕНЮ МИКРОФОНА (3 ФУНКЦИИ) И ДИКТОВКА
// ==========================================
window.openMicMenu = function() {
    const m = document.getElementById('mic-menu-modal');
    if (m) {
        m.style.zIndex = '999999';
        m.classList.remove('hidden');
        m.classList.add('flex');
    } else {
        alert("Окно mic-menu-modal не найдено!");
    }
};

window.startDictation = function() {
    window.closeModal('mic-menu-modal');
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) return alert('Голосовой ввод не поддерживается.');
    const rec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    rec.lang = window.chatLang && window.chatLang !== 'auto' ? window.chatLang : 'ru-RU';
    const inp = document.getElementById('chat-input');
    if (inp) inp.placeholder = "🎤 Говорите...";
    
    rec.onresult = e => { if(inp) inp.value = (inp.value + " " + e.results[0][0].transcript).trim(); };
    rec.onspeechend = () => { rec.stop(); if(inp) inp.placeholder = "Type message or click mic..."; };
    rec.start();
};

// ==========================================
// СКРЕПКА (МЕНЮ ВЛОЖЕНИЙ) И БАЗОВОЕ ЗАКРЫТИЕ
// ==========================================
window.openAttachmentModal = function() {
    const m = document.getElementById('attachment-modal');
    if (m) {
        m.style.zIndex = '999999';
        m.classList.remove('hidden');
        m.classList.add('flex');
    }
};

window.closeModal = window.closeModal || function(modalId) {
    const m = document.getElementById(modalId);
    if (m) {
        m.style.display = '';
        m.classList.remove('flex');
        m.classList.add('hidden');
    }
};
