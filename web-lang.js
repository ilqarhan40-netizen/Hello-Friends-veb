window.i18n = { 
    en: { nav_chat: "Chat", nav_voice: "Voice Chat", nav_conf: "Conference", nav_prof: "Profession", nav_contacts: "Contacts", nav_archive: "Archive", search_ph: "Search...", global_chat: "Global Chat", welcome_title: "Welcome to Hello Friends!", global_network: "Global Smart Network", creator_badge: "Hello Friends Creator", menu: "Settings", profile: "Profile", my_profile: "My Profile", complete_reg: "Complete Registration", full_name: "Full Name", wallet: "Wallet", email_store: "Email Store", theme: "Change Theme", logout: "Logout", action_chat: "Private Chat", action_voice: "Voice Room", action_video: "Video Conf", action_email: "Send Email", action_cellular: "Cellular Call", cv_prof: "Profession", cv_langs: "LANGUAGES", country: "Country", cv_country: "Country", phone: "Phone Number", cv_phone_header: "BUSINESS PHONE", email: "Email Address", cv_email_header: "BUSINESS EMAIL", cv_exp: "EXPERIENCE", cv_edu: "EDUCATION", skills: "CORE COMPETENCIES", cv_about: "ABOUT ME", edit_cv: "Edit My CV", view_cv: "View CV", edit_pro_cv: "Professional CV", cv_role: "Main Role", save_cv: "Save CV", save_profile: "Save Profile", select_room_lang: "Room Language", cancel: "Cancel", population: "Population", seas: "Seas", chat: "Chat", sms: "SMS", email_btn: "Email", purchase: "Purchase Now" },
    ru: { nav_chat: "Чат", nav_voice: "Голосовой", nav_conf: "Конференция", nav_prof: "Профессии", nav_contacts: "Контакты", nav_archive: "Архив", search_ph: "Поиск...", global_chat: "Глобальный Чат", welcome_title: "Добро пожаловать в Hello Friends!", global_network: "Глобальная Смарт-Сеть", creator_badge: "Создатель Hello Friends", menu: "Настройки", profile: "Профиль", my_profile: "Мой Профиль", complete_reg: "Регистрация", full_name: "Полное имя", wallet: "Кошелек", email_store: "Почтовый Магазин", theme: "Сменить Тему", logout: "Выйти", action_chat: "Личный Чат", action_voice: "Голосовая Комната", action_video: "Видеосвязь", action_email: "Написать Email", action_cellular: "Сотовый Звонок", cv_prof: "Профессия", cv_langs: "ЯЗЫКИ", country: "Страна", cv_country: "Страна", phone: "Телефон", cv_phone_header: "РАБОЧИЙ ТЕЛЕФОН", email: "Email", cv_email_header: "РАБОЧАЯ ПОЧТА", cv_exp: "ОПЫТ РАБОТЫ", cv_edu: "ОБРАЗОВАНИЕ", skills: "НАВЫКИ", cv_about: "ОБО МНЕ", edit_cv: "Редактировать CV", view_cv: "Смотреть CV", edit_pro_cv: "Профессиональное CV", cv_role: "Должность", save_cv: "Сохранить CV", save_profile: "Сохранить", select_room_lang: "Язык комнаты", cancel: "Отмена", population: "Население", seas: "Моря", chat: "Чат", sms: "СМС", email_btn: "Почта", purchase: "Купить" },
    de: { nav_chat: "Chat", nav_voice: "Sprachchat", nav_conf: "Konferenz", nav_prof: "Berufe", nav_contacts: "Kontakte", nav_archive: "Archiv", search_ph: "Suchen...", global_chat: "Globaler Chat", welcome_title: "Willkommen bei Hello Friends!", global_network: "Globales Smart-Netzwerk", creator_badge: "Hello Friends Schöpfer", menu: "Einstellungen", profile: "Profil", my_profile: "Mein Profil", complete_reg: "Registrierung abschließen", full_name: "Vollständiger Name", wallet: "Brieftasche", email_store: "E-Mail-Shop", theme: "Thema ändern", logout: "Abmelden", action_chat: "Privater Chat", action_voice: "Sprachraum", action_video: "Videokonferenz", action_email: "E-Mail senden", action_cellular: "Handyanruf", cv_prof: "Beruf", cv_langs: "SPRACHEN", country: "Land", cv_country: "Land", phone: "Telefonnummer", cv_phone_header: "GESCHÄFTSTELEFON", email: "E-Mail", cv_email_header: "GESCHÄFTS-E-MAIL", cv_exp: "BERUFSERFAHRUNG", cv_edu: "BILDUNG", skills: "KOMPETENZEN", cv_about: "ÜBER MICH", edit_cv: "Lebenslauf bearbeiten", view_cv: "Lebenslauf ansehen", edit_pro_cv: "Professioneller Lebenslauf", cv_role: "Rolle", save_cv: "Speichern", save_profile: "Profil speichern", select_room_lang: "Raumsprache", cancel: "Abbrechen", population: "Bevölkerung", seas: "Meere", chat: "Chat", sms: "SMS", email_btn: "E-Mail", purchase: "Kaufen" }
};

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
