// ==========================================
// Файл: web-lang.js
// Назначение: Google Translate API, Глобальный язык, Автономные языки комнат и Авто-определение
// ==========================================

window.currentAppLang = 'en';
window.roomLanguages = {};

window.translateText = async function(text, targetLang) {
    if (!text || !targetLang || targetLang === 'auto') return text;
    try {
        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
        const data = await res.json();
        return data[0][0][0];
    } catch (e) {
        console.error("Translation error:", e);
        return `[${targetLang}] ${text}`;
    }
};

window.changeAppLanguage = function(langCode) {
    if (langCode === 'auto') langCode = navigator.language.split('-')[0];
    window.currentAppLang = langCode;
    console.log("Global ecosystem language changed to:", langCode);
    if(typeof window.closeDropdown === 'function') window.closeDropdown();
};

window.setPersonalLang = function(langCode) {
    const targetSlot = window.currentLangSlot || 'default';
    window.roomLanguages[targetSlot] = langCode;
    updateConfFlagAndLanguage(targetSlot, langCode);
    if(typeof window.closePersonalLangModal === 'function') window.closePersonalLangModal();
};

function updateConfFlagAndLanguage(slot, langCode) {
    const flags = { 'en': '🇬🇧', 'ru': '🇷🇺', 'az': '🇦🇿', 'tr': '🇹🇷', 'de': '🇩🇪', 'it': '🇮🇹', 'es': '🇪🇸', 'fr': '🇫🇷', 'pt': '🇵🇹', 'ar': '🇦🇪', 'ja': '🇯🇵', 'zh': '🇨🇳' };
    if (slot === 'user') {
        const localFlag = document.getElementById('local-lang-flag');
        const speakerMarquee = document.getElementById('conf-speaker-marquee');
        if (localFlag) localFlag.innerText = flags[langCode] || '🌍';
        if (speakerMarquee) speakerMarquee.innerText = `${flags[langCode] || '🌍'} Ready to speak...`;
    }
}

window.openPersonalLangModal = function(slotId) {
    window.currentLangSlot = slotId; 
    if(typeof window.closeDropdown === 'function') window.closeDropdown();
    const modal = document.getElementById('personal-lang-modal');
    if (modal) { 
        modal.classList.remove('hidden'); 
        modal.classList.add('flex'); 
        setTimeout(() => { 
            modal.classList.remove('opacity-0'); 
            modal.querySelector('div').classList.remove('scale-95'); 
        }, 10); 
    }
};

// --- НОВАЯ ФУНКЦИЯ ДЛЯ УМНОГО ЧАТА ---
// Определяет язык для авто-перевода на основе префикса номера телефона
window.getLangFromPrefix = function(phone) {
    if (!phone) return 'en'; // По умолчанию английский
    if (phone.startsWith('+994')) return 'az';
    if (phone.startsWith('+7')) return 'ru';
    if (phone.startsWith('+49')) return 'de';
    if (phone.startsWith('+39')) return 'it';
    if (phone.startsWith('+44')) return 'en';
    if (phone.startsWith('+1')) return 'en';
    if (phone.startsWith('+90')) return 'tr';
    if (phone.startsWith('+34')) return 'es';
    if (phone.startsWith('+33')) return 'fr';
    if (phone.startsWith('+351')) return 'pt';
    if (phone.startsWith('+971')) return 'ar';
    if (phone.startsWith('+86')) return 'zh';
    if (phone.startsWith('+81')) return 'ja';
    return 'en'; // Если префикс неизвестен - ставим английский
};
