// ==========================================
// HELLO FRIENDS - TRANSLATION & LANGUAGE ENGINE
// Файл: js/web-lang.js
// Назначение: Google Translate API, Глобальный язык, Автономные языки комнат
// ==========================================

// Глобальный язык приложения (интерфейс)
window.currentAppLang = 'en';

// Автономные языки для каждой отдельной комнаты/видеочата
// Сохраняет выбор пользователя для каждого юзера индивидуально
window.roomLanguages = {};

// --- БАЗОВЫЙ ДВИЖОК ПЕРЕВОДА (Google Translate API) ---
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

// --- СМЕНА ЯЗЫКА ВСЕЙ ЭКОСИСТЕМЫ (Из шапки "три точки") ---
window.changeAppLanguage = function(langCode) {
    if (langCode === 'auto') {
        langCode = navigator.language.split('-')[0]; // Берем системный язык браузера
    }
    window.currentAppLang = langCode;
    console.log("Global ecosystem language changed to:", langCode);
    
    // В будущем сюда можно добавить функцию, которая пробежится по всем атрибутам data-i18n
    // и моментально переведет все кнопки на сайте.
    
    if(typeof window.closeDropdown === 'function') window.closeDropdown();
};

// --- СМЕНА АВТОНОМНОГО ЯЗЫКА ДЛЯ КОНКРЕТНОГО ЗВОНКА/ЧАТА (Из сетки 6-ти фреймов) ---
window.setPersonalLang = function(langCode) {
    // Если мы кликали по сетке звонка, у нас сохранился слот
    const targetSlot = window.currentLangSlot || 'default';
    
    // Сохраняем выбранный язык для этого конкретного окна
    window.roomLanguages[targetSlot] = langCode;
    
    // Визуальное обновление (если это видеоконференция)
    updateConfFlagAndLanguage(targetSlot, langCode);

    if(typeof window.closePersonalLangModal === 'function') window.closePersonalLangModal();
};

// Функция-помощник: обновить флаг и текст на экране звонка после выбора языка
function updateConfFlagAndLanguage(slot, langCode) {
    const flags = {
        'en': '🇬🇧', 'ru': '🇷🇺', 'az': '🇦🇿', 'tr': '🇹🇷', 'de': '🇩🇪',
        'it': '🇮🇹', 'es': '🇪🇸', 'fr': '🇫🇷', 'pt': '🇵🇹', 'ar': '🇦🇪',
        'ja': '🇯🇵', 'zh': '🇨🇳'
    };
    
    // Если это твое собственное окно (You)
    if (slot === 'user') {
        const localFlag = document.getElementById('local-lang-flag');
        const speakerMarquee = document.getElementById('conf-speaker-marquee');
        if (localFlag) localFlag.innerText = flags[langCode] || '🌍';
        if (speakerMarquee) speakerMarquee.innerText = `${flags[langCode] || '🌍'} Ready to speak...`;
    } 
    // Если это собеседник (Remote)
    else {
        // Логика обновления флагов для других окон сетки (реализуется в web-chat.js)
        console.log(`Slot ${slot} updated to ${langCode}`);
    }
}

// Переопределение функции открытия модалки языков, чтобы запомнить, для кого меняем язык
window.openPersonalLangModal = function(slotId) {
    window.currentLangSlot = slotId; // Запоминаем, по чьей карточке кликнули (например, 'user' или 'remote1')
    
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
