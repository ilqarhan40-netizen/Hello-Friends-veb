// ==========================================
// ЗОЛОТОЙ СТАНДАРТ: ЕДИНЫЙ ФАЙЛ
// Блок 1: ТРИ ТОЧКИ (Меню, Тема, Язык Экосистемы, Профиль)
// ==========================================

// 1. Управление выпадающими меню
window.closeDropdown = function() {
    const menu = document.getElementById('menu-panel');
    const actions = document.getElementById('actions-panel');
    if (menu) { menu.classList.add('opacity-0', 'scale-95'); setTimeout(() => menu.classList.add('hidden'), 200); }
    if (actions) { actions.classList.add('opacity-0', 'scale-95'); setTimeout(() => actions.classList.add('hidden'), 200); }
};

window.togglePanel = function(panelId) {
    const panel = document.getElementById(panelId);
    if (!panel) return;
    
    // Закрываем другие панели, если открываем новую
    ['menu-panel', 'actions-panel'].forEach(id => {
        if (id !== panelId) {
            const p = document.getElementById(id);
            if (p) p.classList.add('opacity-0', 'scale-95', 'hidden');
        }
    });
    
    if (panel.classList.contains('hidden')) {
        panel.classList.remove('hidden');
        setTimeout(() => panel.classList.remove('opacity-0', 'scale-95'), 10);
    } else {
        window.closeDropdown();
    }
};

// Слушатели для открытия меню
document.getElementById('header-menu-btn')?.addEventListener('click', (e) => { 
    e.stopPropagation(); 
    window.togglePanel('menu-panel'); 
});
// Клик в любом пустом месте закрывает меню
document.addEventListener('click', () => { window.closeDropdown(); });


// 2. Смена темы (Темная / Светлая) с сохранением в память
const themeToggleBtn = document.getElementById('menu-theme-toggle');
if (themeToggleBtn) {
    // Проверка при загрузке страницы: какую тему мы ставили в прошлый раз?
    if (localStorage.getItem('hf_theme') === 'dark') {
        document.documentElement.classList.add('dark');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun w-6 text-yellow-400"></i> <span data-i18n="theme">Light Theme</span>';
    }

    // Сам переключатель
    themeToggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const htmlTag = document.documentElement;
        htmlTag.classList.toggle('dark');
        
        const isDark = htmlTag.classList.contains('dark');
        localStorage.setItem('hf_theme', isDark ? 'dark' : 'light'); // Сохраняем навсегда
        
        // Не ломаем дизайн, меняем только иконку и текст
        themeToggleBtn.innerHTML = isDark 
            ? '<i class="fa-solid fa-sun w-6 text-yellow-400"></i> <span data-i18n="theme">Light Theme</span>' 
            : '<i class="fa-solid fa-moon w-6 text-indigo-500"></i> <span data-i18n="theme">Dark Theme</span>';
        
        window.closeDropdown();
    });
}


// 3. Смена языка экосистемы (Глобальный язык)
window.currentAppLang = localStorage.getItem('hf_ecosystem_lang') || 'auto';

window.changeAppLanguage = function(langCode) {
    if (langCode === 'auto') langCode = navigator.language.split('-')[0];
    window.currentAppLang = langCode;
    localStorage.setItem('hf_ecosystem_lang', langCode); // Сохраняем язык
    console.log("Global ecosystem language changed to:", langCode);
    window.closeDropdown();
};

// При загрузке страницы ставим select на тот язык, который был выбран ранее
document.addEventListener('DOMContentLoaded', () => {
    const langSelect = document.getElementById('app-lang-select');
    if (langSelect && localStorage.getItem('hf_ecosystem_lang')) {
        langSelect.value = localStorage.getItem('hf_ecosystem_lang');
    }
});


// 4. Профиль и Авторизация (Подготовка под CORE-AUTH)
window.openMyProfile = function() {
    window.closeDropdown();
    
    // Временно проверяем авторизацию. В будущем здесь будет привязка к Firebase Auth
    if (window.myProfileInfo && window.myProfileInfo.phone === "+994503398020") {
         console.log("Opening owner profile:", window.myProfileInfo.name);
         // Здесь вызовем функцию открытия модалки профиля владельца
    } else {
         // Если система тебя еще не узнала, требуем авторизацию
         console.log("Not authorized. Opening auth modal.");
         if(typeof window.openAuthModal === 'function') window.openAuthModal();
    }
};
// ==========================================
// ЗОЛОТОЙ СТАНДАРТ: ЕДИНЫЙ ФАЙЛ
// Блок 3: WEB-UI-SYNC (Вкладки, Модалки, Геолокация)
// ==========================================

// --- Переключение основных вкладок (Chat, Profession, Archive) ---
window.switchTab = function(tabName) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active', 'bg-indigo-600', 'text-white');
        link.classList.add('text-gray-700', 'dark:text-gray-300');
    });
    
    const activeBtn = document.querySelector(`.nav-link[data-target="${tabName}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active', 'bg-indigo-600', 'text-white');
        activeBtn.classList.remove('text-gray-700', 'dark:text-gray-300');
    }
    
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
    const targetSection = document.getElementById(tabName);
    if (targetSection) targetSection.classList.add('active');
    
    window.closeDropdown();
};

// Привязываем клики по навигации
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        window.switchTab(this.getAttribute('data-target'));
    });
});

// --- Универсальная логика Модальных окон ---
window.openModal = function(modalId) {
    window.closeDropdown();
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden'); 
        modal.classList.add('flex');
        setTimeout(() => { 
            modal.classList.remove('opacity-0'); 
            modal.querySelector('div')?.classList.remove('scale-95'); 
        }, 10);
    }
};

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('opacity-0'); 
        modal.querySelector('div')?.classList.add('scale-95');
        setTimeout(() => { 
            modal.classList.add('hidden'); 
            modal.classList.remove('flex'); 
        }, 300);
    }
};

// --- Быстрые вызовы модалок ---
window.openTrashModal = () => openModal('trash-modal');
window.closeTrashModal = () => closeModal('trash-modal');
window.openEmailModal = () => openModal('email-modal');
window.closeEmailModal = () => closeModal('email-modal');
window.openAvatarActionsModal = () => openModal('avatar-actions-modal');
window.closeAvatarActionsModal = () => closeModal('avatar-actions-modal');
window.openPersonalLangModal = () => openModal('personal-lang-modal');
window.closePersonalLangModal = () => closeModal('personal-lang-modal');
window.openBankTransferModal = () => openModal('transfer-modal');
window.closeBankTransferModal = () => closeModal('transfer-modal');
window.openSearchModal = () => openModal('search-modal');
window.closeSearchModal = () => { closeModal('search-modal'); if(typeof window.resetGlobalSearch === 'function') window.resetGlobalSearch(); };
window.openAuthModal = () => openModal('auth-modal');
window.closeAuthModal = () => closeModal('auth-modal');
window.openPhoneChoiceModal = () => openModal('phone-choice-modal');
window.closePhoneChoiceModal = () => closeModal('phone-choice-modal');

// --- Геолокация ---
window.openLocationModal = () => {
    openModal('location-modal');
    const mapContainer = document.getElementById('location-map');
    if(mapContainer) {
        mapContainer.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-2xl text-indigo-500 mb-2"></i><span>Detecting location...</span>';
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude; const lon = position.coords.longitude;
                    mapContainer.innerHTML = `<iframe width="100%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.01}%2C${lat-0.01}%2C${lon+0.01}%2C${lat+0.01}&amp;layer=mapnik&amp;marker=${lat}%2C${lon}" style="border-radius: 8px;"></iframe>`;
                },
                () => { mapContainer.innerHTML = '<span class="text-red-400">Failed to get location. Allow access.</span>'; }
            );
        } else { mapContainer.innerHTML = 'Geolocation is not supported.'; }
    }
};
window.closeLocationModal = () => closeModal('location-modal');

// --- Управление Оверлеями Звонков (Calls) ---
window.openConference = function() { 
    window.closeDropdown(); 
    const overlay = document.getElementById('conference-overlay');
    if(overlay) overlay.style.display = 'flex'; 
};

window.openVoiceChat = function() { 
    window.closeDropdown(); 
    const overlay = document.getElementById('voice-overlay');
    if(overlay) overlay.style.display = 'flex'; 
};

window.closeCalls = function() { 
    const confOverlay = document.getElementById('conference-overlay'); 
    const voiceOverlay = document.getElementById('voice-overlay');
    if(confOverlay) confOverlay.style.display = 'none'; 
    if(voiceOverlay) voiceOverlay.style.display = 'none'; 
};

window.startInAppCall = function() { window.closePhoneChoiceModal(); setTimeout(() => { window.openVoiceChat(); }, 300); };
window.startExternalCall = function() { window.closePhoneChoiceModal(); window.location.href = "tel:+994501234567"; };
// ==========================================
// ЗОЛОТОЙ СТАНДАРТ: ЕДИНЫЙ ФАЙЛ
// Блок 4: УМНЫЙ ЧАТ, БАЗА ДАННЫХ И ВЕЕРНЫЙ ПЕРЕВОД
// ==========================================

const db = firebase.database();
window.currentRoomId = 'global';
let isMarqueeEnabled = true;
let activeChatListener = null;
const mySessionId = Math.random().toString(36).substring(2, 15);

// --- 1. Переключение комнат чата ---
window.switchWebChat = function(userId) {
    if (!window.myProfileInfo) {
        console.warn("Пользователь не авторизован. Чат не загружен.");
        return;
    }

    if (activeChatListener) { db.ref(window.currentRoomId).off("child_added", activeChatListener); }
    window.currentRoomId = userId;
    
    const nameEl = document.getElementById('chat-header-name'); 
    const statusEl = document.getElementById('chat-header-status');
    const avatarEl = document.getElementById('chat-header-avatar'); 
    const topMarquee = document.getElementById('top-chat-marquee');
    
    if(!nameEl || !avatarEl) return;
    avatarEl.classList.remove('bg-gradient-to-r', 'from-purple-500', 'to-indigo-600');
    
    if(userId === 'global') {
        nameEl.innerText = 'Global Chat'; 
        statusEl.innerHTML = '🌍 Вся сеть'; 
        avatarEl.innerHTML = '🌍'; 
        avatarEl.style.backgroundImage = 'none';
        if(topMarquee) topMarquee.innerHTML = 'Ожидание новых сообщений...';
    } else if (userId === 'ai') {
        nameEl.innerText = 'AI Assistant'; 
        statusEl.innerHTML = `🤖 Online`; 
        avatarEl.innerHTML = '🤖'; 
        avatarEl.style.backgroundImage = 'none'; 
        avatarEl.classList.add('bg-gradient-to-r', 'from-purple-500', 'to-indigo-600');
        if(topMarquee) topMarquee.innerHTML = 'AI Co-Pilot готов помочь!';
    } else if (userId === window.myProfileInfo.id || userId === 'me') {
        nameEl.innerText = 'Saved Messages'; 
        statusEl.innerHTML = `<img src="${window.myProfileInfo.flag || 'https://flagcdn.com/w20/az.png'}" class="w-4 h-3 rounded-sm inline"> Вы`; 
        avatarEl.innerHTML = ''; 
        avatarEl.style.backgroundImage = `url('${window.myProfileInfo.photo}')`;
        if(topMarquee) topMarquee.innerHTML = 'Сохраненные сообщения. Перевод отключен.';
    } else {
        // Заглушка для приватных чатов (имя берем из базы или списка юзеров)
        nameEl.innerText = 'Private Chat'; 
        statusEl.innerHTML = `🔒 Encrypted`; 
        avatarEl.innerHTML = '👤'; 
        avatarEl.style.backgroundImage = 'none';
        if(topMarquee) topMarquee.innerHTML = `Приватный чат. Ждем сообщений...`;
    }
    
    window.clearChatScreen(true);
    // Слушаем новые сообщения
    activeChatListener = db.ref(window.currentRoomId).on("child_added", handleNewMessage);
};

// --- 2. Отправка сообщений ---
window.sendFirebaseMsg = function() {
    const chatInput = document.getElementById('chat-input');
    if(!chatInput || !window.myProfileInfo) return;
    
    const text = chatInput.value.trim();
    if(!text) return;
    
    const msgData = { 
        name: window.myProfileInfo.name,
        userId: window.myProfileInfo.id,
        text: text, 
        photo: window.myProfileInfo.photo,
        flag: window.myProfileInfo.flag,
        lang: window.myProfileInfo.langCode || 'az', // Передаем родной язык отправителя
        sessionId: mySessionId, 
        timestamp: firebase.database.ServerValue.TIMESTAMP 
    };

    db.ref(window.currentRoomId).push(msgData);
    chatInput.value = '';

    // Автоответ ИИ
    if(window.currentRoomId === 'ai') {
        setTimeout(() => {
            db.ref(window.currentRoomId).push({ 
                name: "AI Co-Pilot", 
                userId: "ai",
                text: "Привет! 🤖 Я готов проанализировать твои данные или помочь с переводом. Что нужно сделать?", 
                photo: "https://ui-avatars.com/api/?name=AI&background=0D8ABC&color=fff",
                flag: "🤖",
                sessionId: "ai-bot-session", 
                timestamp: firebase.database.ServerValue.TIMESTAMP 
            });
        }, 1500);
    }
};

// Привязка кнопок отправки
document.getElementById('chat-send-btn')?.addEventListener('click', window.sendFirebaseMsg);
document.getElementById('chat-input')?.addEventListener('keypress', e => { if(e.key === 'Enter') window.sendFirebaseMsg(); });

// --- 3. Получение сообщений и ВЕЕРНЫЙ ПЕРЕВОД ---
async function handleNewMessage(snapshot) {
    const data = snapshot.val();
    if(!data) return;
    
    const isMe = data.sessionId === mySessionId || data.userId === window.myProfileInfo.id;
    const isAI = data.userId === "ai" || data.sessionId === "ai-bot-session";
    const msgId = 'msg-' + snapshot.key;

    const msgWrapper = document.createElement('div');
    msgWrapper.className = `flex items-end gap-2 mb-4 w-full ${isMe ? 'self-end flex-row-reverse' : 'self-start'}`;
    
    const avatarHtml = `<img src="${data.photo || 'https://ui-avatars.com/api/?name=U'}" class="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-slate-700 shadow-sm">`;

    let bubbleClasses = isMe 
        ? 'bg-indigo-600 text-white rounded-br-none' 
        : (isAI ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-none rounded-bl-none shadow-lg' 
           : 'bg-white dark:bg-slate-700 text-gray-800 dark:text-white border border-gray-200 dark:border-slate-600 rounded-bl-none');
           
    if (data.text.includes('💳')) {
        bubbleClasses = isMe ? 'bg-green-600 text-white rounded-br-none' : 'bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100 border border-green-500/50 rounded-bl-none';
    }
    
    const senderNameClasses = isMe ? 'text-indigo-200 text-right' : (isAI ? 'text-purple-200 text-left' : 'text-indigo-500 text-left');

    msgWrapper.innerHTML = avatarHtml + `
        <div class="flex flex-col" style="max-width: 75%;" id="${msgId}">
            <div class="p-3 rounded-xl shadow-sm ${bubbleClasses}">
                <div class="flex justify-between items-center gap-4 mb-1">
                    <p class="font-bold text-xs ${senderNameClasses}">${data.flag || '🌍'} ${data.name.replace(' (Owner)', '')}</p>
                </div>
                <p class="text-sm break-words">${data.text}</p>
                <!-- Контейнер для веерных переводов -->
                <div class="hidden mt-2 pt-1 border-t border-gray-300/30 text-[0.7rem]" id="trans-container-${msgId}"></div>
            </div>
        </div>
    `;

    const chatMessages = document.getElementById('chat-messages');
    if(chatMessages) { chatMessages.appendChild(msgWrapper); chatMessages.scrollTop = chatMessages.scrollHeight; }

    // ЛОГИКА ВЕЕРНОГО ПЕРЕВОДА (Только для Глобал чата)
    if (window.currentRoomId === 'global' && !isAI && !data.text.includes('💳')) {
        // Хардкод тестовых слушателей (в будущем берем из базы онлайн-юзеров)
        let targetUsers = [
            { code: 'en', flag: '🇬🇧', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100' }, // John
            { code: 'de', flag: '🇩🇪', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100' }, // Klaus
            { code: 'it', flag: '🇮🇹', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' }  // Marinella
        ];
        
        let neededLangs = new Set(targetUsers.map(u => u.code));
        let senderLang = data.lang || 'auto';

        if (neededLangs.size > 0 && senderLang !== 'auto') {
            try {
                let transCache = {};
                // Запрашиваем переводы разом
                const fetchPromises = Array.from(neededLangs).map(langCode => 
                    fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${langCode}&dt=t&q=${encodeURIComponent(data.text)}`)
                    .then(res => res.json())
                    .then(resData => { transCache[langCode] = resData[0][0][0]; })
                );
                
                await Promise.all(fetchPromises);

                const transBox = document.getElementById(`trans-container-${msgId}`);
                if (transBox) {
                    transBox.classList.remove('hidden');
                    let marqueeStr = '';
                    
                    targetUsers.forEach(u => {
                        const translation = transCache[u.code] || data.text;
                        // Добавляем аватарку и перевод под сообщение
                        transBox.innerHTML += `
                            <div class="flex items-center gap-1 mt-1.5 opacity-90">
                                <img src="${u.photo}" class="w-4 h-4 rounded-full border border-white/30 object-cover">
                                <span>${u.flag} ${translation}</span>
                            </div>`;
                        marqueeStr += `${u.flag} ${translation}    `;
                    });

                    // Обновляем бегущую строку (Top Marquee)
                    const topMarquee = document.getElementById('top-chat-marquee');
                    if (isMarqueeEnabled && topMarquee) {
                        topMarquee.innerHTML = `<span class="text-green-500 font-bold">[Global]</span> <b>${data.name}:</b> ${marqueeStr}`;
                    }
                }
            } catch (e) { console.error("Ошибка веерного перевода:", e); }
        }
    }
}

// --- 4. Утилиты чата (Очистка, Умная корзина, ИИ) ---
window.toggleMarquee = function() {
    isMarqueeEnabled = !isMarqueeEnabled;
    const btn = document.getElementById('marquee-toggle-btn'); 
    const marqueeBox = document.getElementById('web-marquee-box');
    if(isMarqueeEnabled) { 
        btn.classList.replace('text-gray-400', 'text-indigo-500'); 
        if(marqueeBox) marqueeBox.style.display = 'flex'; 
    } else { 
        btn.classList.replace('text-indigo-500', 'text-gray-400'); 
        if(marqueeBox) marqueeBox.style.display = 'none'; 
    }
};

window.clearChatScreen = function(skipMarquee = false) {
    const chatMessages = document.getElementById('chat-messages'); 
    const topMarquee = document.getElementById('top-chat-marquee');
    if(chatMessages) chatMessages.innerHTML = '';
    if(!skipMarquee && topMarquee) topMarquee.innerHTML = 'Чат очищен. Ожидание сообщений...';
};

window.smartAction = function(action) {
    if (action === 'archive') {
        alert('Перенесено в архив!');
        // Здесь в будущем логика сохранения в локальную базу
    }
    if (action === 'clear' || action === 'delete') {
        if(window.currentRoomId) {
            db.ref(window.currentRoomId).remove().then(() => window.clearChatScreen());
        }
    }
    window.closeTrashModal();
};

window.applyAiMagic = function() {
    const wandBtn = document.getElementById('magic-wand-btn'); 
    const chatInput = document.getElementById('chat-input');
    if(!chatInput) return;
    const text = chatInput.value.trim();
    if(!text) return alert("Сначала напишите текст для улучшения!");
    
    if(wandBtn) wandBtn.classList.add('animate-spin');
    chatInput.disabled = true; 
    chatInput.value = "✨ AI переписывает...";
    
    // Имитация работы ИИ
    setTimeout(() => {
        if(wandBtn) wandBtn.classList.remove('animate-spin');
        chatInput.disabled = false; 
        chatInput.value = "Добрый день! Не могли бы вы предоставить статус по нашему проекту? Спасибо!"; 
        chatInput.focus();
    }, 1500);
};
// ==========================================
// ЗОЛОТОЙ СТАНДАРТ: ЕДИНЫЙ ФАЙЛ
// Блок 6: MIC-SMART (Автоопределение языка по префиксу/флагу)
// ==========================================

// 1. Умная функция определения языка по префиксу номера телефона
window.getLangFromPrefix = function(phoneNumber) {
    if (!phoneNumber) return 'en-US';
    
    // Определяем язык по коду страны
    if (phoneNumber.startsWith('+994')) return 'az-AZ';
    if (phoneNumber.startsWith('+7')) return 'ru-RU';
    if (phoneNumber.startsWith('+49')) return 'de-DE';
    if (phoneNumber.startsWith('+39')) return 'it-IT';
    if (phoneNumber.startsWith('+44')) return 'en-GB';
    if (phoneNumber.startsWith('+90')) return 'tr-TR';
    if (phoneNumber.startsWith('+34')) return 'es-ES';
    if (phoneNumber.startsWith('+33')) return 'fr-FR';
    
    return 'en-US'; // Язык по умолчанию
};

// 2. Определение языка текущей комнаты
window.detectRoomLanguage = function() {
    // Если мы в глобальном чате, микрофон должен слушать на нашем родном языке
    if (window.currentRoomId === 'global' && window.myProfileInfo) {
         return window.getLangFromPrefix(window.myProfileInfo.phone);
    } 
    // Если мы в приватном чате, подстраиваемся под собеседника (или говорим на своем)
    else if (window.currentRoomId !== 'global' && window.currentRoomId !== 'ai' && window.currentRoomId !== 'me') {
         // Для начала берем свой родной язык для диктовки
         if (window.myProfileInfo) return window.getLangFromPrefix(window.myProfileInfo.phone);
    }
    // Для ИИ и сохраненных сообщений можно использовать авто-язык системы
    return window.currentAppLang === 'auto' ? 'en-US' : window.currentAppLang;
};

// 3. Инициализация Умного Микрофона
document.addEventListener('DOMContentLoaded', () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
        const chatMicBtn = document.getElementById('main-chat-mic-btn');
        const chatInput = document.getElementById('chat-input');

        if (chatMicBtn) {
            let chatRec = new SpeechRecognition();
            chatRec.continuous = false; 
            chatRec.interimResults = false;

            chatRec.onstart = () => { 
                chatMicBtn.classList.add('text-red-500', 'animate-pulse'); 
                if(chatInput) chatInput.placeholder = "Слушаю..."; 
            };
            
            chatRec.onend = () => { 
                chatMicBtn.classList.remove('text-red-500', 'animate-pulse'); 
                if(chatInput) chatInput.placeholder = "Type message or click mic..."; 
            };
            
            chatRec.onerror = () => { 
                chatMicBtn.classList.remove('text-red-500', 'animate-pulse'); 
            };
            
            chatRec.onresult = (e) => { 
                if(chatInput) { 
                    chatInput.value = e.results[0][0].transcript; 
                    // Автоматическая отправка после диктовки
                    window.sendFirebaseMsg(); 
                } 
            };
            
            chatMicBtn.addEventListener('click', () => { 
                // Применяем автоопределение языка прямо перед запуском
                chatRec.lang = window.detectRoomLanguage(); 
                console.log("Microphone set to language:", chatRec.lang);
                try { chatRec.start(); } catch(e){} 
            });
        }
    }
});
// ==========================================
// ЗОЛОТОЙ СТАНДАРТ: ЕДИНЫЙ ФАЙЛ
// Блок 7: PROFESSIONAL COMMUNITY (Строгий WEB-дизайн)
// ==========================================

// 1. Создаем контейнеры для модальных окон
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('cv-modals-wrapper')) {
        const modalsContainer = document.createElement('div');
        modalsContainer.id = 'cv-modals-wrapper';
        document.body.appendChild(modalsContainer);
    }
});

// 2. Генерация Главной Сетки (Чистый веб-дизайн, поддержка темной/светлой темы)
window.renderProfessionSection = function(usersObj) {
    const cvContainer = document.getElementById('profession');
    if (!cvContainer) return;

    let html = `
        <div class="max-w-6xl mx-auto p-4 md:p-6">
            <div class="flex justify-between items-center mb-8">
                <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Professional Community</h2>
                <button onclick="openEditCVModal()" class="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-600/20 dark:hover:bg-indigo-600/40 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/50 px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm">
                    <i class="fa-solid fa-pen-to-square"></i> Edit Profile
                </button>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
    `;

    Object.keys(usersObj).forEach(uid => {
        const user = usersObj[uid];
        if (!user.name) return;
        
        const cv = user.cv || {};
        const role = cv.role || 'Professional';
        
        // Карточка в стиле веб (белая/темно-синяя в зависимости от темы)
        html += `
            <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl p-6 flex flex-col items-center relative overflow-hidden group hover:shadow-xl hover:border-indigo-500/50 transition-all duration-300">
                
                <div onclick="openDetailedCV('${uid}')" class="relative w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-gray-50 dark:border-slate-700 shadow-sm mb-4 cursor-pointer overflow-hidden transform group-hover:scale-105 transition-transform">
                    <img src="${user.photo || 'https://ui-avatars.com/api/?name=U'}" class="w-full h-full object-cover">
                </div>
                
                <h3 class="font-bold text-gray-900 dark:text-white text-lg text-center w-full truncate">${user.name.split(' ')[0]}</h3>
                <p class="text-xs text-indigo-500 dark:text-indigo-400 mb-5 font-medium uppercase tracking-wide text-center w-full truncate">${role}</p>
                
                <button onclick="openDetailedCV('${uid}')" class="w-full bg-gray-50 hover:bg-gray-100 dark:bg-slate-700/50 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 font-semibold text-sm py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 transition-colors">
                    View CV
                </button>
            </div>
        `;
    });

    html += `</div></div>`;
    cvContainer.innerHTML = html;
};

// 3. Открытие Детальной Анкеты (Как на твоем правом скрине: синий Pro-дизайн)
window.openDetailedCV = function(uid) {
    const user = window.appUsers[uid];
    if (!user) return;
    
    const cv = user.cv || {};
    const wrapper = document.getElementById('cv-modals-wrapper');
    
    wrapper.innerHTML = `
        <div id="detailed-cv-modal" class="fixed inset-0 bg-gray-900/70 backdrop-blur-sm z-50 flex justify-center items-center p-4" onclick="closeCVModals(event)">
            <div class="bg-[#1e293b] w-full max-w-2xl rounded-3xl border border-[#334155] shadow-2xl overflow-hidden relative" onclick="event.stopPropagation()">
                
                <!-- Шапка модалки -->
                <div class="p-6 md:p-8 bg-gradient-to-b from-[#1e3a8a]/60 to-[#1e293b] border-b border-[#334155]">
                    <div class="flex flex-col md:flex-row items-center gap-6">
                        <div class="relative">
                            <div class="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-40"></div>
                            <img src="${user.photo}" class="relative w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white/10 shadow-lg object-cover">
                        </div>
                        <div class="text-center md:text-left">
                            <h2 class="text-2xl md:text-3xl font-bold text-white mb-1 flex items-center justify-center md:justify-start gap-2">
                                ${user.name} <span class="bg-indigo-500 text-white text-[10px] uppercase px-2 py-0.5 rounded-full">Pro</span>
                            </h2>
                            <p class="text-blue-400 font-semibold text-base md:text-lg">${cv.role || 'Professional Member'}</p>
                        </div>
                    </div>
                </div>

                <!-- Информация (Сетка 2x3) -->
                <div class="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8">
                    <div>
                        <p class="text-gray-400 text-xs flex items-center gap-2 mb-1"><i class="fa-solid fa-briefcase"></i> Profession</p>
                        <p class="text-white font-semibold text-sm md:text-base">${cv.profession || 'Not specified'}</p>
                    </div>
                    <div>
                        <p class="text-gray-400 text-xs flex items-center gap-2 mb-1"><i class="fa-solid fa-language"></i> Languages</p>
                        <p class="text-white font-semibold text-sm md:text-base">${cv.languages || user.profileLangs || 'Not specified'}</p>
                    </div>
                    <div>
                        <p class="text-gray-400 text-xs flex items-center gap-2 mb-1"><i class="fa-solid fa-globe"></i> Country</p>
                        <p class="text-white font-semibold text-sm md:text-base flex items-center gap-2"><img src="https://flagcdn.com/w20/${user.flagCode || 'az'}.png" class="h-3 rounded-sm"> ${cv.country || user.country || 'Unknown'}</p>
                    </div>
                    <div>
                        <p class="text-gray-400 text-xs flex items-center gap-2 mb-1"><i class="fa-solid fa-users"></i> Population</p>
                        <p class="text-white font-semibold text-sm md:text-base">${cv.population || '~10.1M'}</p>
                    </div>
                    <div>
                        <p class="text-gray-400 text-xs flex items-center gap-2 mb-1"><i class="fa-solid fa-water"></i> Seas</p>
                        <p class="text-white font-semibold text-sm md:text-base">${cv.seas || 'Caspian Sea'}</p>
                    </div>
                    <div>
                        <p class="text-gray-400 text-xs flex items-center gap-2 mb-1"><i class="fa-solid fa-phone"></i> Phone</p>
                        <p class="text-white font-semibold text-sm md:text-base">${user.phone || 'Hidden'}</p>
                    </div>
                </div>

                <!-- Новые разделы: О себе и Навыки -->
                <div class="px-6 md:px-8 pb-6 space-y-4">
                    ${cv.about ? `
                    <div class="bg-[#0f172a]/80 p-4 rounded-xl border border-[#334155]">
                        <h4 class="text-gray-400 text-[10px] md:text-xs mb-2 uppercase font-bold tracking-wider">About Me</h4>
                        <p class="text-gray-200 text-xs md:text-sm leading-relaxed">${cv.about}</p>
                    </div>` : ''}
                    
                    ${cv.skills ? `
                    <div class="bg-[#0f172a]/80 p-4 rounded-xl border border-[#334155]">
                        <h4 class="text-gray-400 text-[10px] md:text-xs mb-2 uppercase font-bold tracking-wider">Work Skills</h4>
                        <p class="text-blue-300 text-xs md:text-sm font-medium">${cv.skills}</p>
                    </div>` : ''}
                </div>

                <!-- Кнопки действий -->
                <div class="p-6 bg-[#0f172a] border-t border-[#334155] flex flex-wrap gap-3">
                    <button onclick="actionPrivateChatFromCV('${uid}')" class="flex-1 bg-[#3b82f6] hover:bg-blue-600 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 text-sm md:text-base">
                        <i class="fa-solid fa-comment"></i> Chat
                    </button>
                    <button onclick="openPhoneChoiceModal()" class="flex-1 bg-[#22c55e] hover:bg-green-600 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 text-sm md:text-base">
                        <i class="fa-solid fa-comment-sms"></i> SMS
                    </button>
                    <button onclick="openEmailModal()" class="flex-1 bg-[#8b5cf6] hover:bg-purple-600 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 text-sm md:text-base">
                        <i class="fa-solid fa-paper-plane"></i> Email
                    </button>
                </div>
                
                <button onclick="closeCVModals()" class="absolute top-4 right-4 text-gray-400 hover:text-white bg-black/20 hover:bg-black/40 rounded-full w-8 h-8 flex items-center justify-center transition-colors">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
        </div>
    `;
};

// Переход в чат прямо из CV
window.actionPrivateChatFromCV = function(uid) {
    window.switchWebChat(uid);
    window.switchTab('chat');
    window.closeCVModals();
};

// 4. Форма Редактирования CV (Сохранение в Firebase)
window.openEditCVModal = function() {
    if (!window.myProfileInfo) return alert("Пожалуйста, авторизуйтесь!");
    
    const cv = window.myProfileInfo.cv || {};
    const wrapper = document.getElementById('cv-modals-wrapper');
    
    wrapper.innerHTML = `
        <div id="edit-cv-modal" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4" onclick="closeCVModals(event)">
            <div class="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl shadow-2xl p-6 relative" onclick="event.stopPropagation()">
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Profile</h3>
                
                <div class="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Role / Title</label>
                        <input type="text" id="cv-edit-role" value="${cv.role || ''}" placeholder="e.g. CEO & Founder" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Profession</label>
                        <input type="text" id="cv-edit-prof" value="${cv.profession || ''}" placeholder="e.g. Software Engineer" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Languages</label>
                        <input type="text" id="cv-edit-lang" value="${cv.languages || ''}" placeholder="e.g. Azerbaijani, English, Russian" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white outline-none">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Population</label>
                            <input type="text" id="cv-edit-pop" value="${cv.population || ''}" placeholder="e.g. ~10.1M" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white outline-none">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Seas</label>
                            <input type="text" id="cv-edit-seas" value="${cv.seas || ''}" placeholder="e.g. Caspian Sea" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white outline-none">
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">About Me</label>
                        <textarea id="cv-edit-about" rows="3" placeholder="Tell us about yourself..." class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white outline-none resize-none">${cv.about || ''}</textarea>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Work Skills</label>
                        <input type="text" id="cv-edit-skills" value="${cv.skills || ''}" placeholder="e.g. Management, JavaScript, Design" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white outline-none">
                    </div>
                </div>
                
                <div class="mt-6 flex justify-end gap-3">
                    <button onclick="closeCVModals()" class="px-5 py-2.5 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">Cancel</button>
                    <button onclick="saveCVData()" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-colors flex items-center gap-2">
                        <i class="fa-solid fa-save"></i> Save Profile
                    </button>
                </div>
            </div>
        </div>
    `;
};

// Сохранение данных в базу
window.saveCVData = function() {
    if (!window.myProfileInfo) return;
    
    const cvData = {
        role: document.getElementById('cv-edit-role').value.trim(),
        profession: document.getElementById('cv-edit-prof').value.trim(),
        languages: document.getElementById('cv-edit-lang').value.trim(),
        population: document.getElementById('cv-edit-pop').value.trim(),
        seas: document.getElementById('cv-edit-seas').value.trim(),
        about: document.getElementById('cv-edit-about').value.trim(),
        skills: document.getElementById('cv-edit-skills').value.trim()
    };
    
    db.ref('users/' + window.myProfileInfo.id + '/cv').set(cvData)
      .then(() => {
          window.myProfileInfo.cv = cvData;
          closeCVModals();
      })
      .catch(e => alert("Ошибка сохранения: " + e.message));
};

// Закрытие всех сгенерированных модалок
window.closeCVModals = function(e) {
    if (e && e.target.id !== 'detailed-cv-modal' && e.target.id !== 'edit-cv-modal') return;
    const wrapper = document.getElementById('cv-modals-wrapper');
    if (wrapper) wrapper.innerHTML = '';
};

// 5. Переопределяем слушатель базы из Блока 5
db.ref('users').on('value', snapshot => {
    if(snapshot.exists()) {
        window.appUsers = snapshot.val();
        if(window.myProfileInfo) {
            if(typeof window.renderMainScreenAvatars === 'function') {
                window.renderMainScreenAvatars(window.appUsers, window.myProfileInfo.id);
            }
            window.renderProfessionSection(window.appUsers);
        }
    }
});
// ==========================================
// ЗОЛОТОЙ СТАНДАРТ: ЕДИНЫЙ ФАЙЛ
// Блок 8: OMNI-SEARCH И УМНАЯ КОНФЕРЕНЦИЯ
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. АВТО-ГЕНЕРАЦИЯ МОДАЛКИ OMNI-SEARCH
    if (!document.getElementById('search-modal')) {
        const searchModalHtml = `
        <div id="search-modal" class="fixed inset-0 bg-gray-900/70 backdrop-blur-sm hidden items-center justify-center z-[10000] opacity-0 transition-opacity duration-300" onclick="if(event.target===this) closeSearchModal()">
            <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-2xl shadow-2xl transform scale-95 transition-transform duration-300 relative border border-gray-200 dark:border-slate-700 flex flex-col max-h-[85vh]" onclick="event.stopPropagation();">
                <button onclick="closeSearchModal()" class="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors bg-gray-100 dark:bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center"><i class="fa-solid fa-xmark"></i></button>
                <h2 class="text-xl font-bold mb-5 text-gray-800 dark:text-white flex items-center gap-2"><i class="fa-solid fa-globe text-indigo-500"></i> Global Omni-Search</h2>
                
                <div class="relative w-full shrink-0 mb-5">
                    <i class="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-indigo-500 text-lg"></i>
                    <input type="text" id="global-search-input" onkeyup="performLiveSearch()" placeholder="Search people, places, services..." class="w-full pl-12 pr-12 py-3.5 border-2 border-transparent focus:border-indigo-500 rounded-2xl bg-gray-50 dark:bg-slate-900 dark:text-white transition-colors text-lg outline-none shadow-inner">
                    <i class="fa-solid fa-circle-xmark absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hidden hover:text-red-500 transition text-xl" id="clear-search-btn" onclick="resetGlobalSearch()" title="Clear"></i>
                </div>
                
                <div class="w-full shrink-0 mb-2 overflow-y-auto custom-scrollbar pr-2" id="search-suggestions" style="max-height: 40vh;">
                    <p class="text-[10px] text-gray-500 dark:text-gray-400 font-bold mb-3 uppercase tracking-widest">🤝 People & Skills</p>
                    <div class="flex flex-wrap gap-2 mb-5">
                        <button onclick="handleSmartSearch('Engineer', 'text')" class="px-4 py-2 bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-500 hover:text-white transition-colors shadow-sm"><i class="fa-solid fa-laptop-code mr-1"></i> Engineer</button>
                        <button onclick="handleSmartSearch('Designer', 'text')" class="px-4 py-2 bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-500 hover:text-white transition-colors shadow-sm"><i class="fa-solid fa-palette mr-1"></i> Designer</button>
                        <button onclick="handleSmartSearch('Marketing', 'text')" class="px-4 py-2 bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-500 hover:text-white transition-colors shadow-sm"><i class="fa-solid fa-chart-line mr-1"></i> Marketing</button>
                    </div>
                    
                    <p class="text-[10px] text-gray-500 dark:text-gray-400 font-bold mb-3 uppercase tracking-widest">🌍 Places & Languages</p>
                    <div class="flex flex-wrap gap-2 mb-5">
                        <button onclick="handleSmartSearch('Germany', 'text')" class="px-4 py-2 bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-500 hover:text-white transition-colors shadow-sm">🇩🇪 Germany</button>
                        <button onclick="handleSmartSearch('Italy', 'text')" class="px-4 py-2 bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-500 hover:text-white transition-colors shadow-sm">🇮🇹 Italy</button>
                        <button onclick="handleSmartSearch('English', 'text')" class="px-4 py-2 bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-500 hover:text-white transition-colors shadow-sm">🗣️ English</button>
                    </div>
                    
                    <p class="text-[10px] text-gray-500 dark:text-gray-400 font-bold mb-3 uppercase tracking-widest">💳 Services & Actions</p>
                    <div class="flex flex-wrap gap-2 mb-5">
                        <button onclick="handleSmartSearch('', 'transfer')" class="px-4 py-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-xl text-sm font-medium text-green-700 dark:text-green-400 hover:bg-green-500 hover:text-white transition-colors shadow-sm"><i class="fa-solid fa-money-bill-transfer mr-1"></i> Send Money</button>
                        <button onclick="handleSmartSearch('', 'email')" class="px-4 py-2 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700 rounded-xl text-sm font-medium text-purple-700 dark:text-purple-400 hover:bg-purple-500 hover:text-white transition-colors shadow-sm"><i class="fa-solid fa-envelope mr-1"></i> Compose Email</button>
                    </div>
                    
                    <p class="text-[10px] text-gray-500 dark:text-gray-400 font-bold mb-3 uppercase tracking-widest">🌐 Web Queries</p>
                    <div class="flex flex-wrap gap-2">
                        <button onclick="handleSmartSearch('USD exchange rate', 'web')" class="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-xl text-sm font-medium text-blue-700 dark:text-blue-400 hover:bg-blue-500 hover:text-white transition-colors shadow-sm"><i class="fa-solid fa-rotate mr-1"></i> Exchange Rates</button>
                        <button onclick="handleSmartSearch('World News', 'web')" class="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-xl text-sm font-medium text-blue-700 dark:text-blue-400 hover:bg-blue-500 hover:text-white transition-colors shadow-sm"><i class="fa-solid fa-newspaper mr-1"></i> World News</button>
                    </div>
                </div>
                
                <div class="w-full flex-grow overflow-y-auto flex flex-col gap-2 pr-1 border-t border-gray-200 dark:border-slate-700 pt-4" id="search-results-area"></div>
                <iframe id="search-result-frame" class="w-full h-[40vh] mt-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white hidden shrink-0 shadow-inner" src="about:blank"></iframe>
                
                <button onclick="doGoogleSearch()" class="mt-4 w-full bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-600 py-3.5 rounded-xl font-bold transition-colors flex justify-center items-center gap-2 shadow-sm text-lg">
                    <span class="text-gray-600 dark:text-gray-300">Search Web:</span>
                    <span class="text-[#4285F4]">G</span><span class="text-[#EA4335]">o</span><span class="text-[#FBBC05]">o</span><span class="text-[#4285F4]">g</span><span class="text-[#34A853]">l</span><span class="text-[#EA4335]">e</span>
                </button>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', searchModalHtml);
    }

    // 2. АПГРЕЙД ФУТЕРА КОНФЕРЕНЦИИ (Добавляем Смайлы и Скрепку)
    const confOverlay = document.getElementById('conference-overlay');
    if (confOverlay) {
        // Ищем контейнер с инпутом в конференции
        const confInputContainer = confOverlay.querySelector('input#conf-text-input')?.parentElement;
        
        if (confInputContainer) {
            // Заменяем простой инпут на расширенный блок
            const upgradedInputHtml = `
                <div class="relative flex items-center">
                    <!-- Кнопка Эмодзи -->
                    <button onclick="toggleConfEmoji(event)" class="p-2 text-gray-500 hover:text-yellow-500 transition-colors">
                        <i class="fa-regular fa-face-smile text-xl"></i>
                    </button>
                    
                    <!-- Панель Эмодзи (Скрыта по умолчанию) -->
                    <div id="conf-emoji-picker" class="hidden absolute bottom-full left-0 mb-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-3 rounded-xl grid grid-cols-5 gap-3 text-2xl shadow-xl z-[100]">
                        ${['😀','😂','❤️','😍','👍','🔥','🎉','😢','😎','🤔'].map(e => `<span class="cursor-pointer hover:scale-125 transition-transform" onclick="insertConfEmoji('${e}')">${e}</span>`).join('')}
                    </div>

                    <input type="text" id="conf-text-input" placeholder="Message or mic..." class="bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white px-3 py-2.5 outline-none w-40 md:w-56 transition-colors rounded-lg">
                    
                    <!-- УМНАЯ СКРЕПКА (Экшен-меню) -->
                    <div class="relative ml-1">
                        <button onclick="toggleConfActions(event)" class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors text-gray-500 hover:text-indigo-500">
                            <i class="fa-solid fa-paperclip text-xl"></i>
                        </button>
                        
                        <!-- Выпадающее меню скрепки -->
                        <div id="conf-actions-panel" class="absolute bottom-full right-0 mb-3 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-2xl grid grid-cols-3 gap-2 hidden opacity-0 transform scale-95 z-[100] transition-all border border-gray-100 dark:border-slate-700 w-64 origin-bottom-right">
                            <button onclick="openLocationModal()" class="flex flex-col items-center justify-center p-3 text-gray-500 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 rounded-lg transition-colors"><i class="fa-solid fa-location-dot text-xl mb-1"></i><span class="text-[10px] font-medium">Location</span></button>
                            <button onclick="document.getElementById('attachment-input').click(); closeConfPanels();" class="flex flex-col items-center justify-center p-3 text-gray-500 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 rounded-lg transition-colors"><i class="fa-solid fa-file-arrow-up text-xl mb-1"></i><span class="text-[10px] font-medium">File</span></button>
                            <button onclick="openSearchModal()" class="flex flex-col items-center justify-center p-3 text-gray-500 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 rounded-lg transition-colors"><i class="fa-solid fa-magnifying-glass text-xl mb-1"></i><span class="text-[10px] font-medium">Search</span></button>
                            <button onclick="openTrashModal()" class="flex flex-col items-center justify-center p-3 text-gray-500 hover:bg-red-50 dark:hover:bg-slate-700 hover:text-red-600 rounded-lg transition-colors"><i class="fa-solid fa-trash text-xl mb-1"></i><span class="text-[10px] font-medium">Clear</span></button>
                            <button onclick="openBankTransferModal()" class="flex flex-col items-center justify-center p-3 text-gray-500 hover:bg-green-50 dark:hover:bg-slate-700 hover:text-green-600 rounded-lg transition-colors"><i class="fa-solid fa-money-bill-transfer text-xl mb-1"></i><span class="text-[10px] font-medium">Pay</span></button>
                            <button onclick="openEmailModal()" class="flex flex-col items-center justify-center p-3 text-gray-500 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 rounded-lg transition-colors"><i class="fa-solid fa-envelope text-xl mb-1"></i><span class="text-[10px] font-medium">Email</span></button>
                        </div>
                    </div>

                    <button id="conf-send-btn" class="text-indigo-600 dark:text-[#00C4CC] hover:scale-110 transition-transform ml-2 mr-2">
                        <i class="fa-solid fa-paper-plane text-xl"></i>
                    </button>
                </div>
            `;
            // Заменяем старый инпут и кнопку отправки на новый продвинутый блок
            const oldInput = document.getElementById('conf-text-input');
            const oldBtn = document.getElementById('conf-send-btn');
            if(oldInput && oldBtn) {
                oldInput.remove(); oldBtn.remove();
                confInputContainer.insertAdjacentHTML('afterbegin', upgradedInputHtml);
            }
        }
    }
});

// --- ЛОГИКА OMNI-SEARCH ---
window.openSearchModal = function() {
    window.closeDropdown();
    const modal = document.getElementById('search-modal');
    if (modal) {
        modal.classList.remove('hidden'); modal.classList.add('flex');
        setTimeout(() => { modal.classList.remove('opacity-0'); modal.querySelector('div').classList.remove('scale-95'); }, 10);
    }
}
window.closeSearchModal = function() {
    const modal = document.getElementById('search-modal');
    if (modal) {
        modal.classList.add('opacity-0'); modal.querySelector('div').classList.add('scale-95');
        setTimeout(() => { modal.classList.add('hidden'); modal.classList.remove('flex'); window.resetGlobalSearch(); }, 300);
    }
}
window.handleSmartSearch = function(text, type = 'text') {
    const input = document.getElementById('global-search-input');
    if (type === 'text') { input.value = text; window.performLiveSearch(); } 
    else if (type === 'transfer') { window.closeSearchModal(); setTimeout(window.openBankTransferModal, 350); } 
    else if (type === 'email') { window.closeSearchModal(); setTimeout(window.openEmailModal, 350); } 
    else if (type === 'web') { input.value = text; document.getElementById('search-results-area').innerHTML = ''; window.doGoogleSearch(); }
};
window.performLiveSearch = function() {
    const query = document.getElementById('global-search-input').value.toLowerCase().trim();
    const resultsArea = document.getElementById('search-results-area');
    const frame = document.getElementById('search-result-frame');
    const suggestions = document.getElementById('search-suggestions');
    const clearBtn = document.getElementById('clear-search-btn');
    
    if(frame) frame.classList.add('hidden');
    if (query.length === 0) {
        resultsArea.innerHTML = '';
        if(suggestions) suggestions.style.display = 'block';
        if(clearBtn) clearBtn.classList.add('hidden');
        return;
    }
    
    if(clearBtn) clearBtn.classList.remove('hidden');
    if(suggestions) suggestions.style.display = 'none';

    let html = ''; let found = false;
    // Поиск по живой базе Версии 1
    if(window.appUsers) {
        Object.keys(window.appUsers).forEach(id => {
            const p = window.appUsers[id];
            const cv = p.cv || {};
            const searchStr = `${p.name} ${cv.profession} ${p.country} ${cv.languages}`.toLowerCase();
            
            if (searchStr.includes(query)) {
                found = true;
                html += `
                    <div class="bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:border-indigo-500 transition-all shadow-sm mb-2" onclick="closeSearchModal(); setTimeout(() => openDetailedCV('${id}'), 300);">
                        <div class="flex items-center gap-4">
                            <img src="${p.photo || 'https://ui-avatars.com/api/?name=U'}" class="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-600 shadow-sm">
                            <div class="flex flex-col">
                                <span class="text-gray-900 dark:text-white text-sm font-bold">${p.name} ${p.flag || '🌍'}</span>
                                <span class="text-indigo-500 dark:text-indigo-400 text-xs font-medium">${cv.profession || 'User'} | ${p.country || 'Global'}</span>
                            </div>
                        </div>
                        <i class="fa-solid fa-chevron-right text-gray-400 pr-2"></i>
                    </div>`;
            }
        });
    }
    
    if (!found) html = `<p class="text-sm text-gray-500 dark:text-gray-400 text-center mt-6 font-medium">No internal results found. Click 'Search Web' below.</p>`;
    resultsArea.innerHTML = html;
};
window.resetGlobalSearch = function() {
    const input = document.getElementById('global-search-input');
    if(input) input.value = '';
    window.performLiveSearch();
};
window.doGoogleSearch = function() {
    const q = document.getElementById('global-search-input').value;
    if(q.trim() === '') return alert('Enter search query first');
    const searchUrl = 'https://www.google.com/search?igu=1&q=' + encodeURIComponent(q);
    const iframe = document.getElementById('search-result-frame');
    const resultsArea = document.getElementById('search-results-area');
    const suggestions = document.getElementById('search-suggestions');
    const clearBtn = document.getElementById('clear-search-btn');
    
    if(suggestions) suggestions.style.display = 'none';
    if(resultsArea) resultsArea.innerHTML = '';
    if(clearBtn) clearBtn.classList.remove('hidden');
    
    iframe.src = searchUrl; 
    iframe.classList.remove('hidden');
}

// --- ЛОГИКА ФУТЕРА КОНФЕРЕНЦИИ ---
window.toggleConfEmoji = function(e) {
    e.stopPropagation();
    const picker = document.getElementById('conf-emoji-picker');
    const actions = document.getElementById('conf-actions-panel');
    if(actions && !actions.classList.contains('hidden')) window.closeConfPanels();
    if(picker) picker.classList.toggle('hidden');
}
window.insertConfEmoji = function(emoji) {
    const input = document.getElementById('conf-text-input');
    if(input) { input.value += emoji; input.focus(); }
    document.getElementById('conf-emoji-picker')?.classList.add('hidden');
}
window.toggleConfActions = function(e) {
    e.stopPropagation();
    const actions = document.getElementById('conf-actions-panel');
    const picker = document.getElementById('conf-emoji-picker');
    if(picker && !picker.classList.contains('hidden')) picker.classList.add('hidden');
    
    if(actions) {
        if(actions.classList.contains('hidden')) {
            actions.classList.remove('hidden');
            setTimeout(() => actions.classList.remove('opacity-0', 'scale-95'), 10);
        } else {
            window.closeConfPanels();
        }
    }
}
window.closeConfPanels = function() {
    const actions = document.getElementById('conf-actions-panel');
    const picker = document.getElementById('conf-emoji-picker');
    if(picker) picker.classList.add('hidden');
    if(actions) {
        actions.classList.add('opacity-0', 'scale-95');
        setTimeout(() => actions.classList.add('hidden'), 200);
    }
}
// Закрываем менюшки конференции при клике по экрану
document.addEventListener('click', () => { if(window.closeConfPanels) window.closeConfPanels(); });
