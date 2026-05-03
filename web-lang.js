// ==========================================
// ЛИНГВИСТИЧЕСКИЙ ЦЕНТР (WEB ВЕРСИЯ)
// ==========================================

const i18n = { 
    en: { nav_chat: "Chat", nav_voice: "Voice Chat", nav_conf: "Conference", nav_prof: "Profession", nav_contacts: "Contacts", nav_archive: "Archive", search_ph: "Search users...", global_chat: "Global Chat" },
    ru: { nav_chat: "Чат", nav_voice: "Голосовой", nav_conf: "Конференция", nav_prof: "Профессии", nav_contacts: "Контакты", nav_archive: "Архив", search_ph: "Поиск...", global_chat: "Глобальный Чат" },
    az: { nav_chat: "Çat", nav_voice: "Səsli Çat", nav_conf: "Konfrans", nav_prof: "Peşələr", nav_contacts: "Əlaqələr", nav_archive: "Arxiv", search_ph: "Axtarış...", global_chat: "Qlobal Çat" },
    de: { nav_chat: "Chat", nav_voice: "Sprachchat", nav_conf: "Konferenz", nav_prof: "Berufe", nav_contacts: "Kontakte", nav_archive: "Archiv", search_ph: "Suchen...", global_chat: "Globaler Chat" },
    tr: { nav_chat: "Sohbet", nav_voice: "Sesli Sohbet", nav_conf: "Konferans", nav_prof: "Meslekler", nav_contacts: "Kişiler", nav_archive: "Arşiv", search_ph: "Ara...", global_chat: "Küresel Sohbet" },
    ar: { nav_chat: "محادثة", nav_voice: "صوت", nav_conf: "مؤتمر", nav_prof: "المهن", nav_contacts: "جهات الاتصال", nav_archive: "أرشيف", search_ph: "بحث...", global_chat: "الدردشة العالمية" },
    it: { nav_chat: "Chat", nav_voice: "Voce", nav_conf: "Conferenza", nav_prof: "Professioni", nav_contacts: "Contatti", nav_archive: "Archivio", search_ph: "Cerca...", global_chat: "Chat Globale" },
    es: { nav_chat: "Chat", nav_voice: "Voz", nav_conf: "Conferencia", nav_prof: "Profesiones", nav_contacts: "Contactos", nav_archive: "Archivo", search_ph: "Buscar...", global_chat: "Chat Global" },
    fr: { nav_chat: "Chat", nav_voice: "Voix", nav_conf: "Conférence", nav_prof: "Professions", nav_contacts: "Contacts", nav_archive: "Archives", search_ph: "Rechercher...", global_chat: "Chat Global" },
    pt: { nav_chat: "Chat", nav_voice: "Voz", nav_conf: "Conferência", nav_prof: "Profissões", nav_contacts: "Contatos", nav_archive: "Arquivo", search_ph: "Buscar...", global_chat: "Chat Global" },
    ja: { nav_chat: "チャット", nav_voice: "音声", nav_conf: "会議", nav_prof: "職業", nav_contacts: "連絡先", nav_archive: "アーカイブ", search_ph: "検索...", global_chat: "グローバルチャット" },
    zh: { nav_chat: "聊天", nav_voice: "语音", nav_conf: "会议", nav_prof: "职业", nav_contacts: "联系人", nav_archive: "档案", search_ph: "搜索...", global_chat: "全球聊天" }
};

// Умное определение языка (как в мобилке)
window.getSmartLang = function(userProfile) {
    if (!userProfile) return navigator.language ? navigator.language.slice(0, 2) : 'en'; 
    
    let phone = (userProfile.phone || "").replace(/\s+/g, '');
    let flag = userProfile.flagCode || "un";
    let langPref = userProfile.langCode;

    if (langPref && langPref !== 'auto' && langPref !== 'un') return langPref;
    
    if (phone.startsWith('+7')) return 'ru';
    if (phone.startsWith('+994')) return 'az';
    if (phone.startsWith('+39')) return 'it';
    if (phone.startsWith('+49')) return 'de';
    if (phone.startsWith('+33')) return 'fr';
    if (phone.startsWith('+81')) return 'ja';
    if (phone.startsWith('+34')) return 'es';
    if (phone.startsWith('+86')) return 'zh';
    if (phone.startsWith('+351')) return 'pt';
    if (phone.startsWith('+1') || phone.startsWith('+44')) return 'en';
    if (phone.startsWith('+971')) return 'ar';

    const flagToLang = { 'ru': 'ru', 'az': 'az', 'it': 'it', 'de': 'de', 'fr': 'fr', 'jp': 'ja', 'es': 'es', 'cn': 'zh', 'pt': 'pt', 'gb': 'en', 'us': 'en', 'ae': 'ar', 'tr': 'tr' };
    if (flagToLang[flag]) return flagToLang[flag];
    
    return navigator.language ? navigator.language.slice(0, 2) : 'en';
};

// Главная функция перевода (работает с data-i18n)
window.applySystemLanguage = function() { 
    let savedLang = localStorage.getItem('hf_app_lang') || 'auto';
    let activeLang = savedLang;

    if (savedLang === 'auto') {
        if (window.myProfileInfo) {
            activeLang = window.getSmartLang(window.myProfileInfo);
        } else {
            let sysLang = navigator.language.slice(0, 2);
            activeLang = i18n[sysLang] ? sysLang : 'en';
        }
    }
    
    window.appLang = activeLang;
    const dict = i18n[window.appLang] || i18n['en']; 
    
    document.querySelectorAll('[data-i18n]').forEach(el => { 
        const key = el.getAttribute('data-i18n'); 
        if(dict[key]) el.innerText = dict[key]; 
    }); 
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if(dict[key]) el.placeholder = dict[key];
    });

    // Синхронизируем селект языка, если он есть в веб-интерфейсе
    const langSelect = document.getElementById('app-lang-select'); 
    if(langSelect) langSelect.value = savedLang; 
};

// Смена языка вручную
window.changeAppLanguage = function(langCode) { 
    localStorage.setItem('hf_app_lang', langCode); 
    window.applySystemLanguage(); 
};
