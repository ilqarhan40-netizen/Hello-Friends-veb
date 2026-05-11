window.i18n = { 
    en: { nav_chat: "Chat", nav_voice: "Voice Chat", nav_conf: "Conference", nav_prof: "Profession", nav_contacts: "Contacts", nav_archive: "Archive", search_ph: "Search...", global_chat: "Global Chat", welcome_title: "Welcome to Hello Friends!", global_network: "Global Smart Network", creator_badge: "Hello Friends Creator", menu: "Settings", profile: "Profile", my_profile: "My Profile", complete_reg: "Complete Registration", full_name: "Full Name", wallet: "Wallet", email_store: "Email Store", theme: "Change Theme", logout: "Logout", action_chat: "Private Chat", action_voice: "Voice Room", action_video: "Video Conf", action_email: "Send Email", action_cellular: "Cellular Call", cv_prof: "Profession", cv_langs: "LANGUAGES", country: "Country", cv_country: "Country", phone: "Phone Number", cv_phone_header: "BUSINESS PHONE", email: "Email Address", cv_email_header: "BUSINESS EMAIL", cv_exp: "EXPERIENCE", cv_edu: "EDUCATION", skills: "CORE COMPETENCIES", cv_about: "ABOUT ME", edit_cv: "Edit My CV", view_cv: "View CV", edit_pro_cv: "Professional CV", cv_role: "Main Role", save_cv: "Save CV", save_profile: "Save Profile", select_room_lang: "Room Language", cancel: "Cancel", population: "Population", seas: "Seas", chat: "Chat", sms: "SMS", email_btn: "Email", purchase: "Purchase Now" },
    ru: { nav_chat: "Чат", nav_voice: "Голосовой", nav_conf: "Конференция", nav_prof: "Профессии", nav_contacts: "Контакты", nav_archive: "Архив", search_ph: "Поиск...", global_chat: "Глобальный Чат", welcome_title: "Добро пожаловать в Hello Friends!", global_network: "Глобальная Смарт-Сеть", creator_badge: "Создатель Hello Friends", menu: "Настройки", profile: "Профиль", my_profile: "Мой Профиль", complete_reg: "Регистрация", full_name: "Полное имя", wallet: "Кошелек", email_store: "Почтовый Магазин", theme: "Сменить Тему", logout: "Выйти", action_chat: "Личный Чат", action_voice: "Голосовая Комната", action_video: "Видеосвязь", action_email: "Написать Email", action_cellular: "Сотовый Звонок", cv_prof: "Профессия", cv_langs: "ЯЗЫКИ", country: "Страна", cv_country: "Страна", phone: "Телефон", cv_phone_header: "РАБОЧИЙ ТЕЛЕФОН", email: "Email", cv_email_header: "РАБОЧАЯ ПОЧТА", cv_exp: "ОПЫТ РАБОТЫ", cv_edu: "ОБРАЗОВАНИЕ", skills: "НАВЫКИ", cv_about: "ОБО МНЕ", edit_cv: "Редактировать CV", view_cv: "Смотреть CV", edit_pro_cv: "Профессиональное CV", cv_role: "Должность", save_cv: "Сохранить CV", save_profile: "Сохранить", select_room_lang: "Язык комнаты", cancel: "Отмена", population: "Население", seas: "Моря", chat: "Чат", sms: "СМС", email_btn: "Почта", purchase: "Купить" },
    de: { nav_chat: "Chat", nav_voice: "Sprachchat", nav_conf: "Konferenz", nav_prof: "Berufe", nav_contacts: "Kontakte", nav_archive: "Archiv", search_ph: "Suchen...", global_chat: "Globaler Chat", welcome_title: "Willkommen bei Hello Friends!", global_network: "Globales Smart-Netzwerk", creator_badge: "Hello Friends Schöpfer", menu: "Einstellungen", profile: "Profil", my_profile: "Mein Profil", complete_reg: "Registrierung abschließen", full_name: "Vollständiger Name", wallet: "Brieftasche", email_store: "E-Mail-Shop", theme: "Thema ändern", logout: "Abmelden", action_chat: "Privater Chat", action_voice: "Sprachraum", action_video: "Videokonferenz", action_email: "E-Mail senden", action_cellular: "Handyanruf", cv_prof: "Beruf", cv_langs: "SPRACHEN", country: "Land", cv_country: "Land", phone: "Telefonnummer", cv_phone_header: "GESCHÄFTSTELEFON", email: "E-Mail", cv_email_header: "GESCHÄFTS-E-MAIL", cv_exp: "BERUFSERFAHRUNG", cv_edu: "BILDUNG", skills: "KOMPETENZEN", cv_about: "ÜBER MICH", edit_cv: "Lebenslauf bearbeiten", view_cv: "Lebenslauf ansehen", edit_pro_cv: "Professioneller Lebenslauf", cv_role: "Rolle", save_cv: "Speichern", save_profile: "Profil speichern", select_room_lang: "Raumsprache", cancel: "Abbrechen", population: "Bevölkerung", seas: "Meere", chat: "Chat", sms: "SMS", email_btn: "E-Mail", purchase: "Kaufen" }
};

window.chatLang = 'auto'; // Отдельная переменная ТОЛЬКО для переводов в чате

window.getSmartLang = function(userProfile) {
    if (!userProfile) return navigator.language ? navigator.language.slice(0, 2) : 'en'; 
    let phone = (userProfile.phone || "").replace(/\s+/g, '');
    let flag = userProfile.flagCode || "un";
    let langPref = userProfile.langCode;

    if (langPref && langPref !== 'auto' && langPref !== 'un') return langPref;
    if (phone.startsWith('+7')) return 'ru';
    if (phone.startsWith('+994')) return 'az';
    if (phone.startsWith('+49')) return 'de';
    // Добавь остальные префиксы...
    const flagToLang = { 'ru': 'ru', 'az': 'az', 'de': 'de', 'gb': 'en', 'us': 'en' };
    if (flagToLang[flag]) return flagToLang[flag];
    return navigator.language ? navigator.language.slice(0, 2) : 'en';
};

window.applySystemLanguage = function() { 
    let savedLang = localStorage.getItem('hf_app_lang') || 'auto';
    let activeLang = savedLang;

    if (savedLang === 'auto') {
        if (window.myProfileInfo) activeLang = window.getSmartLang(window.myProfileInfo);
        else activeLang = navigator.language ? navigator.language.slice(0, 2) : 'en';
    }
    
    if (!window.i18n[activeLang]) activeLang = 'en';
    window.appLang = activeLang;
    const dict = window.i18n[window.appLang]; 
    
    document.querySelectorAll('[data-i18n]').forEach(el => { 
        const key = el.getAttribute('data-i18n'); 
        if(dict[key]) {
            const icon = el.querySelector('i'); 
            if (icon) { el.innerHTML = ''; el.appendChild(icon); el.innerHTML += ' ' + dict[key]; } 
            else { el.innerText = dict[key]; }
        } 
    }); 
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if(dict[key]) el.placeholder = dict[key];
    });

    const langSelect = document.getElementById('app-lang-select'); 
    if(langSelect) langSelect.value = savedLang; 
    
    document.documentElement.lang = activeLang;
    document.documentElement.dir = activeLang === 'ar' ? 'rtl' : 'ltr';
};

window.changeAppLanguage = function(langCode) { 
    localStorage.setItem('hf_app_lang', langCode); 
    window.applySystemLanguage(); 
    if(typeof window.closeDropdown === 'function') window.closeDropdown(); 
};

// ==========================================
// ЛОГИКА "ЯЗЫК ЧАТА" (12 ЯЗЫКОВ, БЕЗ БЛЮРА)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const chatLangModalHTML = `
    <div id="chat-lang-modal" class="fixed inset-0 bg-black/60 hidden items-center justify-center z-[10000] transition-opacity" onclick="if(event.target===this) window.closeChatLangModal()">
        <div class="bg-[#1a2235] w-[340px] rounded-3xl p-6 relative flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-white/5" onclick="event.stopPropagation()">
            <button onclick="window.closeChatLangModal()" class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/10 rounded-full text-gray-400 hover:text-white transition"><i class="fa-solid fa-xmark text-sm"></i></button>
            <div class="text-center mb-6">
                <h3 class="text-white font-bold text-xl flex justify-center items-center gap-2"><i class="fa-solid fa-language text-green-400"></i> Язык Чата</h3>
                <p class="text-green-500 text-[10px] font-black tracking-widest uppercase mt-2">Settings strictly for:</p>
                <p id="chat-lang-room-name" class="text-white font-bold text-sm flex justify-center items-center gap-2 mt-1"><i class="fa-regular fa-file-lines"></i> ROOM</p>
            </div>
            <div class="flex flex-col gap-2 overflow-y-auto max-h-[50vh] pr-1 custom-scrollbar">
                <button onclick="window.setChatLang('auto')" class="w-full py-3 px-4 bg-transparent border border-green-500 rounded-xl font-bold text-sm flex items-center gap-3 transition hover:bg-white/5"><i class="fa-solid fa-globe text-blue-400 text-lg w-6 text-center"></i><span class="text-white">Auto (Profile)</span></button>
                <button onclick="window.setChatLang('en')" class="w-full py-3 px-4 bg-transparent border border-white/10 rounded-xl font-bold text-sm flex items-center gap-3 transition hover:bg-white/5 text-white"><span class="text-gray-400 font-black w-6 text-center">GB</span> English</button>
                <button onclick="window.setChatLang('ru')" class="w-full py-3 px-4 bg-transparent border border-white/10 rounded-xl font-bold text-sm flex items-center gap-3 transition hover:bg-white/5 text-white"><span class="text-gray-400 font-black w-6 text-center">RU</span> Русский</button>
                <button onclick="window.setChatLang('az')" class="w-full py-3 px-4 bg-transparent border border-white/10 rounded-xl font-bold text-sm flex items-center gap-3 transition hover:bg-white/5 text-white"><span class="text-gray-400 font-black w-6 text-center">AZ</span> Azərbaycanca</button>
                <button onclick="window.setChatLang('de')" class="w-full py-3 px-4 bg-transparent border border-white/10 rounded-xl font-bold text-sm flex items-center gap-3 transition hover:bg-white/5 text-white"><span class="text-gray-400 font-black w-6 text-center">DE</span> Deutsch</button>
                <button onclick="window.setChatLang('tr')" class="w-full py-3 px-4 bg-transparent border border-white/10 rounded-xl font-bold text-sm flex items-center gap-3 transition hover:bg-white/5 text-white"><span class="text-gray-400 font-black w-6 text-center">TR</span> Türkçe</button>
                <button onclick="window.setChatLang('ar')" class="w-full py-3 px-4 bg-transparent border border-white/10 rounded-xl font-bold text-sm flex items-center gap-3 transition hover:bg-white/5 text-white"><span class="text-gray-400 font-black w-6 text-center">SA</span> العربية</button>
                <button onclick="window.setChatLang('es')" class="w-full py-3 px-4 bg-transparent border border-white/10 rounded-xl font-bold text-sm flex items-center gap-3 transition hover:bg-white/5 text-white"><span class="text-gray-400 font-black w-6 text-center">ES</span> Español</button>
                <button onclick="window.setChatLang('it')" class="w-full py-3 px-4 bg-transparent border border-white/10 rounded-xl font-bold text-sm flex items-center gap-3 transition hover:bg-white/5 text-white"><span class="text-gray-400 font-black w-6 text-center">IT</span> Italiano</button>
                <button onclick="window.setChatLang('fr')" class="w-full py-3 px-4 bg-transparent border border-white/10 rounded-xl font-bold text-sm flex items-center gap-3 transition hover:bg-white/5 text-white"><span class="text-gray-400 font-black w-6 text-center">FR</span> Français</button>
                <button onclick="window.setChatLang('pt')" class="w-full py-3 px-4 bg-transparent border border-white/10 rounded-xl font-bold text-sm flex items-center gap-3 transition hover:bg-white/5 text-white"><span class="text-gray-400 font-black w-6 text-center">PT</span> Português</button>
                <button onclick="window.setChatLang('ja')" class="w-full py-3 px-4 bg-transparent border border-white/10 rounded-xl font-bold text-sm flex items-center gap-3 transition hover:bg-white/5 text-white"><span class="text-gray-400 font-black w-6 text-center">JP</span> 日本語</button>
                <button onclick="window.setChatLang('zh')" class="w-full py-3 px-4 bg-transparent border border-white/10 rounded-xl font-bold text-sm flex items-center gap-3 transition hover:bg-white/5 text-white"><span class="text-gray-400 font-black w-6 text-center">CN</span> 中文</button>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', chatLangModalHTML);
});

window.openChatLangModal = function(partnerName) {
    if (typeof window.closeDropdown === 'function') window.closeDropdown();
    const m = document.getElementById('chat-lang-modal');
    if (m) {
        // Подставляем имя того, на чью аватарку нажали (например, GARRY)
        const roomNameEl = document.getElementById('chat-lang-room-name');
        if(roomNameEl && partnerName) {
            roomNameEl.innerHTML = `<i class="fa-regular fa-file-lines"></i> ${partnerName.toUpperCase()}`;
        }
        m.classList.remove('hidden'); m.classList.add('flex');
    }
};

window.closeChatLangModal = function() {
    const m = document.getElementById('chat-lang-modal');
    if (m) { m.classList.add('hidden'); m.classList.remove('flex'); }
};

window.setChatLang = function(langCode) {
    window.chatLang = langCode;
    window.closeChatLangModal();
};

const domObserver = new MutationObserver((mutations) => {
    let hasNewNodes = false;
    mutations.forEach((mutation) => { if (mutation.addedNodes.length > 0) hasNewNodes = true; });
    if (hasNewNodes) {
        domObserver.disconnect(); 
        window.applySystemLanguage(); 
        domObserver.observe(document.body, { childList: true, subtree: true }); 
    }
});

document.addEventListener('DOMContentLoaded', () => {
    window.applySystemLanguage(); 
    domObserver.observe(document.body, { childList: true, subtree: true }); 
});
