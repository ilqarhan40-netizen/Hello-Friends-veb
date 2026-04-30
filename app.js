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
