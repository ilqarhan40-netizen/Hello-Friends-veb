// ==========================================
// Файл: webjs/web-ui.js
// Назначение: Меню, Вкладки, Базовые модальные окна, Тема, Главный Профиль, Звонки, Поиск
// ==========================================

window.closeDropdown = function() {
    const menu = document.getElementById('menu-panel');
    const actions = document.getElementById('actions-panel');
    if (menu) { menu.classList.add('opacity-0', 'scale-95'); setTimeout(() => menu.classList.add('hidden'), 200); }
    if (actions) { actions.classList.add('opacity-0', 'scale-95'); setTimeout(() => actions.classList.add('hidden'), 200); }
};

window.togglePanel = function(panelId) {
    const panel = document.getElementById(panelId);
    if (!panel) return;
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
        panel.classList.add('opacity-0', 'scale-95');
        setTimeout(() => panel.classList.add('hidden'), 200);
    }
};

document.getElementById('header-menu-btn')?.addEventListener('click', (e) => { e.stopPropagation(); window.togglePanel('menu-panel'); });
document.getElementById('actions-btn')?.addEventListener('click', (e) => { e.stopPropagation(); window.togglePanel('actions-panel'); });
document.addEventListener('click', () => { window.closeDropdown(); });

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
};

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        window.switchTab(this.getAttribute('data-target'));
    });
});

function openModal(modalId) {
    window.closeDropdown();
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden'); modal.classList.add('flex');
        setTimeout(() => { modal.classList.remove('opacity-0'); modal.querySelector('div')?.classList.remove('scale-95'); }, 10);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('opacity-0'); modal.querySelector('div')?.classList.add('scale-95');
        setTimeout(() => { modal.classList.add('hidden'); modal.classList.remove('flex'); }, 300);
    }
}

// --- МОДАЛЬНЫЕ ОКНА ---
window.openTrashModal = () => openModal('trash-modal');
window.closeTrashModal = () => closeModal('trash-modal');
window.openEmailModal = () => openModal('email-modal');
window.closeEmailModal = () => closeModal('email-modal');
window.openPersonalLangModal = () => openModal('personal-lang-modal');
window.closePersonalLangModal = () => closeModal('personal-lang-modal');
window.openBankTransferModal = () => openModal('transfer-modal');
window.closeBankTransferModal = () => closeModal('transfer-modal');
window.openSearchModal = () => openModal('search-modal');
window.closeSearchModal = () => { closeModal('search-modal'); if(typeof window.resetGlobalSearch === 'function') window.resetGlobalSearch(); };

// Функция для Почты из меню (Три точки)
window.openEmailStore = () => openModal('email-modal');

// --- ЛОГИКА ВКЛАДОК КОШЕЛЬКА ---
window.switchTransferTab = function(tab) {
    const btnCard = document.getElementById('tab-card');
    const btnIntl = document.getElementById('tab-intl');
    const formCard = document.getElementById('form-card');
    const formIntl = document.getElementById('form-intl');
    if(!btnCard) return;

    if (tab === 'card') {
        btnCard.className = "flex-1 py-2 bg-emerald-500 text-white text-sm font-bold transition";
        btnIntl.className = "flex-1 py-2 bg-gray-100 dark:bg-slate-900 text-gray-500 dark:text-gray-400 text-sm font-bold transition";
        formCard.classList.remove('hidden');
        formIntl.classList.add('hidden');
    } else {
        btnIntl.className = "flex-1 py-2 bg-blue-600 text-white text-sm font-bold transition";
        btnCard.className = "flex-1 py-2 bg-gray-100 dark:bg-slate-900 text-gray-500 dark:text-gray-400 text-sm font-bold transition";
        formIntl.classList.remove('hidden');
        formCard.classList.add('hidden');
    }
};

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

const themeToggleBtn = document.getElementById('menu-theme-toggle');
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const htmlTag = document.documentElement;
        htmlTag.classList.toggle('dark');
        themeToggleBtn.innerHTML = htmlTag.classList.contains('dark') ? '<i class="fa-solid fa-sun w-6 text-yellow-400"></i> Light Theme' : '<i class="fa-solid fa-moon w-6 text-indigo-500"></i> Dark Theme';
        window.closeDropdown();
    });
}
window.triggerImportExport = () => { document.getElementById('import-export-input')?.click(); window.closeDropdown(); };

// ==========================================
// ГЛАВНЫЙ ПРОФИЛЬ 
// ==========================================
window.openMyProfile = function() {
    if (!window.myProfileInfo) return alert("Пожалуйста, авторизуйтесь!");
    if(typeof window.closeDropdown === 'function') window.closeDropdown(); 
    
    const user = window.myProfileInfo;
    const cv = user.cv || {}; 
    
    let modal = document.getElementById('profile-modal-container');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'profile-modal-container';
        modal.className = 'fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[10000] flex justify-center items-center p-4 transition-opacity';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="bg-white dark:bg-slate-800 w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden relative flex flex-col border border-gray-200 dark:border-slate-700 animate-fade-in" onclick="event.stopPropagation()">
            <button onclick="document.getElementById('profile-modal-container').remove()" class="absolute top-4 right-4 w-8 h-8 bg-gray-100 dark:bg-slate-700 hover:bg-red-500 hover:text-white text-gray-500 dark:text-gray-300 rounded-full flex items-center justify-center transition-colors z-50"><i class="fa-solid fa-xmark"></i></button>

            <!-- Шапка профиля -->
            <div class="pt-8 pb-2 flex flex-col items-center justify-center relative">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-1">My Profile</h2>
                <p class="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">Complete Registration</p>
                
                <div class="relative w-24 h-24 rounded-full p-1 border-2 border-[#10b981] mb-2 cursor-pointer group" onclick="document.getElementById('attachment-input').click()">
                    <img src="${user.photo || 'https://ui-avatars.com/api/?name=U'}" class="w-full h-full rounded-full object-cover">
                    <div class="absolute bottom-0 right-0 w-7 h-7 bg-[#10b981] rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center text-white text-xs"><i class="fa-solid fa-camera"></i></div>
                </div>
            </div>

            <!-- Форма профиля -->
            <div class="p-6 pt-2 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-[10px] font-bold text-[#10b981] uppercase mb-1">Full Name</label>
                        <input type="text" id="prof-name" value="${user.name || ''}" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:border-[#10b981]">
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-[#10b981] uppercase mb-1">Country</label>
                        <input type="text" id="prof-country" value="${user.country || ''}" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:border-[#10b981]">
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-[10px] font-bold text-[#10b981] uppercase mb-1">Phone Number</label>
                        <input type="text" id="prof-phone" value="${user.phone || ''}" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:border-[#10b981]">
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-[#10b981] uppercase mb-1">Languages</label>
                        <input type="text" id="prof-langs" value="${user.profileLangs || cv.languages || ''}" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:border-[#10b981]">
                    </div>
                </div>

                <div>
                    <label class="block text-[10px] font-bold text-[#10b981] uppercase mb-1">Email</label>
                    <input type="email" id="prof-email" value="${user.email || ''}" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:border-[#10b981]">
                </div>

                <div class="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-slate-900/50 p-3 rounded-xl border border-gray-200 dark:border-slate-700/50">
                    <div>
                        <label class="block text-[10px] font-bold text-[#10b981] uppercase mb-1">Population</label>
                        <input type="text" id="prof-pop" value="${user.population || ''}" class="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl px-3 py-2 text-gray-900 dark:text-white outline-none focus:border-[#10b981]">
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-[#10b981] uppercase mb-1">Seas</label>
                        <input type="text" id="prof-seas" value="${user.seas || ''}" class="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl px-3 py-2 text-gray-900 dark:text-white outline-none focus:border-[#10b981]">
                    </div>
                </div>

                <div>
                    <label class="block text-[10px] font-bold text-[#10b981] uppercase mb-1">About Me</label>
                    <textarea id="prof-about" rows="2" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:border-[#10b981] resize-none">${cv.about || ''}</textarea>
                </div>
                
                <button onclick="saveProfileData(this)" class="mt-2 w-full bg-[#10b981] hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all">Speichern (Save)</button>
            </div>
        </div>
    `;
};

window.saveProfileData = function(btn) {
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...'; }
    const data = {
        name: document.getElementById('prof-name').value.trim(),
        country: document.getElementById('prof-country').value.trim(),
        phone: document.getElementById('prof-phone').value.trim(),
        profileLangs: document.getElementById('prof-langs').value.trim(),
        email: document.getElementById('prof-email').value.trim(),
        population: document.getElementById('prof-pop').value.trim(),
        seas: document.getElementById('prof-seas').value.trim()
    };
    if (window.firebase) {
        firebase.database().ref('users/' + window.myProfileInfo.id).update(data).then(() => {
            firebase.database().ref('users/' + window.myProfileInfo.id + '/cv').update({
                languages: data.profileLangs, about: document.getElementById('prof-about').value.trim()
            });
            Object.assign(window.myProfileInfo, data);
            document.getElementById('profile-modal-container').remove();
            if(typeof window.renderMainScreenAvatars === 'function') window.renderMainScreenAvatars(window.appUsers);
            if(typeof window.renderContactsList === 'function') window.renderContactsList(); 
        }).catch(err => {
            alert("Error: " + err.message);
            if (btn) { btn.disabled = false; btn.innerHTML = 'Speichern (Save)'; }
        });
    }
};

// ==========================================
// СЕТКА ВИДЕОКОНФЕРЕНЦИИ И ЗВОНКИ (Исправлены дубликаты и флаг GB)
// ==========================================
window.openConference = function() {
    if(typeof window.closeDropdown === 'function') window.closeDropdown();
    const overlay = document.getElementById('conference-overlay');
    const grid = document.getElementById('conference-grid');
    
    if(overlay) overlay.style.display = 'flex';
    
    if (grid && window.participants) {
        grid.innerHTML = ''; 
        
        // Фильтруем от дубликатов по ID
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
            if(fCode === 'en') fCode = 'gb'; // Исправление английского флага
            
            let card = document.createElement('div');
            card.className = "user-card relative aspect-video bg-gray-900 rounded-xl overflow-hidden border border-gray-700 shadow-lg";
            card.innerHTML = `
                <img src="${user.photo || 'https://ui-avatars.com/api/?name=U'}" class="w-full h-full object-cover opacity-80">
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

// ==========================================
// ЛОГИКА ПОИСКОВИКА (ЛУПА)
// ==========================================
window.performLiveSearch = function() {
    const input = document.getElementById('global-search-input');
    const clearBtn = document.getElementById('clear-search-btn');
    if (input && input.value.length > 0) {
        clearBtn.classList.remove('hidden');
    } else {
        clearBtn.classList.add('hidden');
    }
};

window.resetGlobalSearch = function() {
    const input = document.getElementById('global-search-input');
    const clearBtn = document.getElementById('clear-search-btn');
    const frame = document.getElementById('search-result-frame');
    
    if (input) input.value = '';
    if (clearBtn) clearBtn.classList.add('hidden');
    if (frame) {
        frame.src = 'about:blank';
        frame.classList.add('hidden');
    }
};

window.handleSmartSearch = function(query, type) {
    const input = document.getElementById('global-search-input');
    const clearBtn = document.getElementById('clear-search-btn');
    const frame = document.getElementById('search-result-frame');
    
    if (input && query) {
        input.value = query;
        clearBtn.classList.remove('hidden');
    }
    
    if (type === 'transfer') {
        window.closeSearchModal();
        window.openBankTransferModal();
    } else if (type === 'email') {
        window.closeSearchModal();
        window.openEmailStore();
    } else if (type === 'web' || type === 'text') {
        if (frame) {
            frame.classList.remove('hidden');
            let searchUrl = query ? 'https://en.wikipedia.org/wiki/' + encodeURIComponent(query) : 'https://en.wikipedia.org';
            frame.src = searchUrl;
        }
    }
};

window.doGoogleSearch = function() {
    const input = document.getElementById('global-search-input');
    if (input && input.value) {
        window.open('https://www.google.com/search?q=' + encodeURIComponent(input.value), '_blank');
    }
};
