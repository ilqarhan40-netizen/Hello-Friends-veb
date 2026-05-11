// ==========================================
// Файл: web-ui.js
// Назначение: Меню, Вкладки, Базовые модальные окна, Тема, Главный Профиль, Поиск (Лупа), Кошелек, Почта, Аватар
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

// --- БАЗОВЫЕ МОДАЛЬНЫЕ ОКНА ---
window.openTrashModal = () => openModal('trash-modal');
window.closeTrashModal = () => closeModal('trash-modal');
window.openPersonalLangModal = () => openModal('personal-lang-modal');
window.closePersonalLangModal = () => closeModal('personal-lang-modal');

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
// УМНАЯ ГЕО-БАЗА: РАСШИРЕННОЕ ОПИСАНИЕ СТРАН (13 СТРАН)
// ==========================================
window.getCountryFacts = function(fCode) {
    const db = {
        'az': { country: 'Azerbaijan', pop: '~10.14 M', seas: 'Caspian Sea', about: 'Azerbaijan is known as the "Land of Fire." It features a unique blend of ancient history and modern architecture.' },
        'kz': { country: 'Kazakhstan', pop: '~20.0 M', seas: 'Caspian Sea, Aral Sea', about: 'The largest country in Central Asia, known for its vast steppes and modern development.' },
        'ru': { country: 'Russia', pop: '~144.5 M', seas: 'Arctic, Pacific, Baltic, Black, Caspian', about: 'The largest country in the world, spanning eleven time zones.' },
        'de': { country: 'Germany', pop: '~83.2 M', seas: 'North Sea, Baltic Sea', about: 'Germany is a major European power with a diverse geography.' },
        'it': { country: 'Italy', pop: '~58.9 M', seas: 'Mediterranean, Adriatic, Ionian', about: 'Italy is famous for its Renaissance culture and stunning coastal landscapes.' },
        'gb': { country: 'United Kingdom', pop: '~67.3 M', seas: 'Atlantic Ocean, North Sea', about: 'An island country consisting of Great Britain and Northern Ireland.' },
        'tr': { country: 'Turkey', pop: '~85.3 M', seas: 'Mediterranean, Aegean, Black Sea', about: 'Turkey is unique for its transcontinental location.' },
        'es': { country: 'Spain', pop: '~47.7 M', seas: 'Mediterranean Sea, Atlantic Ocean', about: 'Spain occupies most of the Iberian Peninsula.' },
        'fr': { country: 'France', pop: '~67.9 M', seas: 'Mediterranean, Atlantic', about: 'France features diverse coasts and a rich cultural history.' },
        'us': { country: 'USA', pop: '~333.3 M', seas: 'Atlantic, Pacific, Arctic', about: 'A vast country spanning the North American continent.' },
        'ae': { country: 'UAE', pop: '~9.4 M', seas: 'Persian Gulf, Gulf of Oman', about: 'The UAE is known for its modern architecture and desert landscapes.' },
        'cn': { country: 'China', pop: '~1.41 B', seas: 'Yellow Sea, East China Sea, South China Sea', about: 'China has a long coastline along the Pacific marginal seas.' },
        'jp': { country: 'Japan', pop: '~125.1 M', seas: 'Pacific Ocean, Sea of Japan', about: 'An island nation in the Pacific Ocean with mountainous territory.' }
    };
    return db[fCode] || { country: 'Global', pop: 'Unknown', seas: 'International Waters', about: 'No additional data.' };
};

// ==========================================
// ГЛАВНЫЙ ПРОФИЛЬ (Форма редактирования с Умной Гео-Локацией)
// ==========================================
window.openMyProfile = function() {
    if (!window.myProfileInfo) return alert("Please authorize first!");
    if(typeof window.closeDropdown === 'function') window.closeDropdown(); 
    
    const user = window.myProfileInfo;
    const cv = user.cv || {}; 

    // СПИСОК ВСЕХ 13 СТРАН С PNG ФЛАГАМИ (FLAGCDN)
  const countries = [
        { code: 'az', flag: '🇦🇿', name: 'Azerbaijan', dial: '+994' },
        { code: 'kz', flag: '🇰🇿', name: 'Kazakhstan', dial: '+7' },
        { code: 'ru', flag: '🇷🇺', name: 'Russia', dial: '+7' },
        { code: 'de', flag: '🇩🇪', name: 'Germany', dial: '+49' },
        { code: 'it', flag: '🇮🇹', name: 'Italy', dial: '+39' },
        { code: 'gb', flag: '🇬🇧', name: 'United Kingdom', dial: '+44' },
        { code: 'tr', flag: '🇹🇷', name: 'Turkey', dial: '+90' },
        { code: 'es', flag: '🇪🇸', name: 'Spain', dial: '+34' },
        { code: 'fr', flag: '🇫🇷', name: 'France', dial: '+33' },
        { code: 'us', flag: '🇺🇸', name: 'USA', dial: '+1' },
        { code: 'ae', flag: '🇦🇪', name: 'UAE', dial: '+971' },
        { code: 'cn', flag: '🇨🇳', name: 'China', dial: '+86' },
        { code: 'jp', flag: '🇯🇵', name: 'Japan', dial: '+81' }
    ];
    let currentCode = user.flagCode || 'gb';
    let optionsHtml = countries.map(c => `<option value="${c.code}" data-dial="${c.dial}" data-flag="${c.flag}" ${currentCode === c.code ? 'selected' : ''}>${c.flag} ${c.name}</option>`).join('');
    
    const startGeo = window.getCountryFacts(currentCode);

    let modal = document.getElementById('profile-modal-container');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'profile-modal-container';
        modal.className = 'fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[10000] flex justify-center items-center p-4 transition-opacity';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="bg-white dark:bg-slate-800 w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden relative flex flex-col border border-gray-200 dark:border-slate-700 animate-fade-in transition-colors" onclick="event.stopPropagation()">
            <button onclick="document.getElementById('profile-modal-container').remove()" class="absolute top-4 right-4 w-8 h-8 bg-gray-100 dark:bg-slate-700 hover:bg-red-500 hover:text-white text-gray-500 dark:text-gray-300 rounded-full flex items-center justify-center transition-colors z-50 cursor-pointer"><i class="fa-solid fa-xmark"></i></button>

            <div class="pt-8 pb-2 flex flex-col items-center justify-center relative">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-1" data-i18n="my_profile">My Profile</h2>
                <p class="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4" data-i18n="complete_reg">Complete Registration</p>
                
                <div class="relative w-24 h-24 rounded-full p-1 border-2 border-[#10b981] mb-2 cursor-pointer group" onclick="document.getElementById('attachment-input')?.click()">
                    <img src="${user.photo || 'https://ui-avatars.com/api/?name=U'}" class="w-full h-full rounded-full object-cover">
                    <div class="absolute bottom-0 right-0 w-7 h-7 bg-[#10b981] rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center text-white text-xs transition-colors"><i class="fa-solid fa-camera"></i></div>
                </div>
            </div>

            <div class="p-6 pt-2 space-y-4 max-h-[65vh] overflow-y-auto custom-scrollbar">
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-[10px] font-bold text-[#10b981] uppercase mb-1" data-i18n="full_name">Full Name</label>
                        <input type="text" id="prof-name" value="${user.name || ''}" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:border-[#10b981] font-medium transition-colors">
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-[#10b981] uppercase mb-1" data-i18n="profession">Profession</label>
                        <input type="text" id="prof-role" value="${cv.profession || cv.role || ''}" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:border-[#10b981] font-medium transition-colors">
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-[10px] font-bold text-[#10b981] uppercase mb-1" data-i18n="country">Country</label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm" id="prof-flag-display">${user.flag || '🌍'}</span>
                            <select id="prof-country-select" onchange="window.updateProfileGeo(this)" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl pl-9 pr-3 py-2.5 text-gray-900 dark:text-white outline-none focus:border-[#10b981] appearance-none cursor-pointer text-sm font-medium transition-colors">
                                ${optionsHtml}
                            </select>
                            <i class="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
                        </div>
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-[#10b981] uppercase mb-1" data-i18n="phone">Phone Number</label>
                        <input type="text" id="prof-phone" value="${user.phone || ''}" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:border-[#10b981] font-medium transition-colors">
                    </div>
                </div>

                <div class="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800/30 transition-colors">
                    <p class="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-2"><i class="fa-solid fa-robot"></i> Smart Geo Data</p>
                    <div class="space-y-1 text-xs text-gray-600 dark:text-gray-300">
                        <p><b data-i18n="population">Population:</b> <span id="smart-pop">${startGeo.pop}</span></p>
                        <p><b data-i18n="seas">Seas:</b> <span id="smart-seas">${startGeo.seas}</span></p>
                        <p class="mt-2 text-[10px] italic text-gray-500 dark:text-gray-400" id="smart-about">${startGeo.about}</p>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-[10px] font-bold text-[#10b981] uppercase mb-1" data-i18n="email">Email</label>
                        <input type="email" id="prof-email" value="${user.email || ''}" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:border-[#10b981] font-medium transition-colors">
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-[#10b981] uppercase mb-1" data-i18n="languages">Languages</label>
                        <input type="text" id="prof-langs" value="${user.profileLangs || cv.languages || ''}" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:border-[#10b981] font-medium transition-colors">
                    </div>
                </div>

                <div>
                    <label class="block text-[10px] font-bold text-[#10b981] uppercase mb-1" data-i18n="about_me">About Me</label>
                    <textarea id="prof-about" rows="3" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:border-[#10b981] resize-none font-medium text-sm transition-colors">${cv.about || user.about || ''}</textarea>
                </div>
                
                <button onclick="saveProfileData(this)" class="mt-2 w-full bg-[#10b981] hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all cursor-pointer uppercase text-xs tracking-wider" data-i18n="save_profile">Save Profile</button>
            </div>
        </div>
    `;
    if(typeof window.applySystemLanguage === 'function') window.applySystemLanguage();
};

window.updateProfileGeo = function(sel) {
    const opt = sel.options[sel.selectedIndex];
    const dial = opt.getAttribute('data-dial');
    const flag = opt.getAttribute('data-flag');
    const code = sel.value;

    const phoneInput = document.getElementById('prof-phone');
    if (phoneInput) { phoneInput.value = dial + " "; phoneInput.focus(); }
    const flagDisplay = document.getElementById('prof-flag-display');
    if (flagDisplay) flagDisplay.innerText = flag;

    const geo = window.getCountryFacts(code);
    document.getElementById('smart-pop').innerText = geo.pop;
    document.getElementById('smart-seas').innerText = geo.seas;
    document.getElementById('smart-about').innerText = geo.about;
};

window.saveProfileData = function(btn) {
    if(!window.firebase || !window.myProfileInfo) return;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
    
    const sel = document.getElementById('prof-country-select');
    const opt = sel.options[sel.selectedIndex];

    const data = {
        name: document.getElementById('prof-name').value.trim(),
        country: opt.text.trim().replace(/^[\uD83C][\uDDE6-\uDDFF][\uD83C][\uDDE6-\uDDFF]\s*/, ''),
        flagCode: sel.value,
        flag: opt.getAttribute('data-flag'),
        phone: document.getElementById('prof-phone').value.trim(),
        profileLangs: document.getElementById('prof-langs').value.trim(),
        email: document.getElementById('prof-email').value.trim(),
        about: document.getElementById('prof-about').value.trim() 
    };

    firebase.database().ref('users/' + window.myProfileInfo.id).update(data).then(() => {
        const profession = document.getElementById('prof-role').value.trim();
        firebase.database().ref('users/' + window.myProfileInfo.id + '/cv').update({
            languages: data.profileLangs, about: data.about, profession: profession, role: profession
        });
        
        Object.assign(window.myProfileInfo, data);
        if(!window.myProfileInfo.cv) window.myProfileInfo.cv = {};
        window.myProfileInfo.cv.profession = profession;
        
        document.getElementById('profile-modal-container').remove();
        if(typeof window.renderContactsList === 'function') window.renderContactsList();
        if(typeof window.renderProfessionSection === 'function') window.renderProfessionSection(window.appUsers);
    }).catch(err => {
        alert("Error: " + err.message);
        btn.disabled = false;
        btn.innerHTML = 'Save Profile';
    });
};

// ==========================================
// КОШЕЛЕК / БАНК
// ==========================================
window.openBankTransferModal = function() {
    window.closeDropdown();
    const oldModal = document.getElementById('transfer-modal');
    if (oldModal) oldModal.remove();

    let modal = document.createElement('div');
    modal.id = 'transfer-modal';
    modal.className = 'fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[10000] flex justify-center items-center p-4 animate-fade-in';
    document.body.appendChild(modal);

    modal.innerHTML = `
        <div class="bg-white dark:bg-[#1a2634] w-full max-w-sm rounded-3xl shadow-2xl p-6 relative border border-gray-200 dark:border-gray-700/50 transition-colors duration-300" onclick="event.stopPropagation()">
            <button onclick="closeBankTransferModal()" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white bg-gray-100 dark:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center transition"><i class="fa-solid fa-xmark"></i></button>
            
            <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 rounded-full bg-teal-100 dark:bg-[#00C4CC]/20 flex justify-center items-center text-teal-600 dark:text-[#00C4CC] text-xl dark:shadow-[0_0_15px_rgba(0,196,204,0.3)]"><i class="fa-solid fa-wallet"></i></div>
                <h2 class="text-xl font-bold text-gray-900 dark:text-white" data-i18n="wallet">Wallet</h2>
            </div>
            
            <div class="flex bg-gray-100 dark:bg-[#0f172a] rounded-lg p-1 mb-6 border border-gray-200 dark:border-gray-700">
                <button onclick="switchTransferTab('card')" id="tab-card" class="flex-1 py-2 bg-teal-500 dark:bg-[#00C4CC] text-white dark:text-gray-900 text-sm font-bold rounded-md shadow transition">💳 Card-to-Card</button>
                <button onclick="switchTransferTab('intl')" id="tab-intl" class="flex-1 py-2 bg-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-bold transition">🌍 International</button>
            </div>
            
            <form id="form-card" class="space-y-3" onsubmit="alert('Success!'); closeBankTransferModal(); return false;">
                <div class="bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white flex items-center gap-3 transition-colors">
                    <i class="fa-brands fa-cc-visa text-blue-500 text-xl"></i> <span class="font-medium text-sm">My Visa •••• 4242</span>
                </div>
                <input type="text" placeholder="Select Recipient" class="w-full bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 outline-none text-gray-900 dark:text-white text-sm focus:border-teal-500 dark:focus:border-[#00C4CC] transition-colors">
                <input type="number" placeholder="Amount ($)" class="w-full bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 outline-none text-gray-900 dark:text-white text-sm focus:border-teal-500 dark:focus:border-[#00C4CC] transition-colors" oninput="document.getElementById('w-amt1').innerText = '$'+(this.value||'0.00'); document.getElementById('w-tot1').innerText = '$'+((parseFloat(this.value)||0)+0.01).toFixed(2)">
                
                <div class="bg-gray-50 dark:bg-[#0f172a] p-4 rounded-xl border border-gray-200 dark:border-gray-700 mt-4 shadow-inner transition-colors">
                    <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1"><span>Amount:</span> <span id="w-amt1">$0.00</span></div>
                    <div class="flex justify-between text-xs text-red-500 dark:text-red-400 mb-2"><span>HF Network Fee:</span> <span>$0.01</span></div>
                    <div class="flex justify-between text-sm font-bold text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-700 pt-2"><span>Total:</span> <span id="w-tot1" class="text-teal-600 dark:text-[#00C4CC]">$0.00</span></div>
                </div>
                <button type="submit" class="w-full bg-teal-500 dark:bg-[#00C4CC] text-white dark:text-gray-900 font-bold py-3.5 rounded-xl hover:bg-teal-600 dark:hover:bg-[#00aeb5] transition-all mt-4 shadow-md">Send Money</button>
            </form>

            <form id="form-intl" class="space-y-3 hidden" onsubmit="alert('Success!'); closeBankTransferModal(); return false;">
                <div class="relative">
                    <select class="w-full bg-gray-50 dark:bg-[#0f172a] border border-teal-500 dark:border-[#00C4CC] rounded-xl px-4 py-3 outline-none text-gray-900 dark:text-white text-sm appearance-none shadow-[0_0_10px_rgba(20,184,166,0.2)] dark:shadow-[0_0_10px_rgba(0,196,204,0.2)] transition-colors">
                        <option>🟡 Western Union</option>
                        <option>👑 Zolotaya Korona (Korona)</option>
                        <option>🔴 MoneyGram</option>
                        <option>🏦 SWIFT Bank Transfer</option>
                    </select>
                    <i class="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                </div>
                <input type="text" placeholder="Recipient Details" class="w-full bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 outline-none text-gray-900 dark:text-white text-sm focus:border-teal-500 dark:focus:border-[#00C4CC] transition-colors">
                <input type="number" placeholder="Amount ($)" class="w-full bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 outline-none text-gray-900 dark:text-white text-sm focus:border-teal-500 dark:focus:border-[#00C4CC] transition-colors" oninput="document.getElementById('w-amt2').innerText = '$'+(this.value||'0.00'); document.getElementById('w-tot2').innerText = '$'+((parseFloat(this.value)||0)+0.01).toFixed(2)">
                
                <div class="bg-gray-50 dark:bg-[#0f172a] p-4 rounded-xl border border-gray-200 dark:border-gray-700 mt-4 shadow-inner transition-colors">
                    <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1"><span>Amount:</span> <span id="w-amt2">$0.00</span></div>
                    <div class="flex justify-between text-xs text-red-500 dark:text-red-400 mb-2"><span>HF Network Fee:</span> <span>$0.01</span></div>
                    <div class="flex justify-between text-sm font-bold text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-700 pt-2"><span>Total:</span> <span id="w-tot2" class="text-teal-600 dark:text-[#00C4CC]">$0.00</span></div>
                </div>
                <button type="submit" class="w-full bg-gray-600 dark:bg-gray-600 text-white font-bold py-3.5 rounded-xl hover:bg-gray-700 dark:hover:bg-gray-500 transition-all mt-4 shadow-md">Send International</button>
            </form>
        </div>
    `;
    modal.addEventListener('click', (e) => { if(e.target===modal) closeBankTransferModal(); });
    if(typeof window.applySystemLanguage === 'function') window.applySystemLanguage();
};

window.closeBankTransferModal = function() {
    const modal = document.getElementById('transfer-modal');
    if (modal) {
        modal.querySelector('div').classList.add('scale-95', 'opacity-0');
        setTimeout(() => modal.remove(), 300);
    }
};

window.switchTransferTab = function(tab) {
    const btnCard = document.getElementById('tab-card');
    const btnIntl = document.getElementById('tab-intl');
    const formCard = document.getElementById('form-card');
    const formIntl = document.getElementById('form-intl');
    if(!btnCard) return;

    const activeClass = "flex-1 py-2 bg-teal-500 dark:bg-[#00C4CC] text-white dark:text-gray-900 text-sm font-bold rounded-md shadow transition";
    const inactiveClass = "flex-1 py-2 bg-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-bold transition";

    if (tab === 'card') {
        btnCard.className = activeClass;
        btnIntl.className = inactiveClass;
        formCard.classList.remove('hidden');
        formIntl.classList.add('hidden');
    } else {
        btnIntl.className = activeClass;
        btnCard.className = inactiveClass;
        formIntl.classList.remove('hidden');
        formCard.classList.add('hidden');
    }
};

// ==========================================
// ПОЧТА: СОЗДАТЬ ПИСЬМО (Compose Email)
// ==========================================
window.openEmailModal = function() {
    if(typeof window.closeDropdown === 'function') window.closeDropdown();
    
    let oldModal = document.getElementById('email-compose-modal');
    if (oldModal) oldModal.remove();

    let modal = document.createElement('div');
    modal.id = 'email-compose-modal';
    modal.className = 'fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100000] flex justify-center items-center p-4 transition-opacity animate-fade-in pointer-events-auto';
    document.body.appendChild(modal);

    modal.innerHTML = `
        <div class="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl shadow-2xl p-6 md:p-8 relative border border-gray-200 dark:border-slate-700 pointer-events-auto transition-colors" onclick="event.stopPropagation()">
            <button onclick="document.getElementById('email-compose-modal').remove()" class="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl z-50 cursor-pointer outline-none">&times;</button>
            
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <i class="fa-solid fa-envelope-open-text text-indigo-500 dark:text-indigo-400"></i> Compose Email
            </h3>
            
            <div class="space-y-4">
                <div>
                    <label class="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 tracking-wider">To</label>
                    <input type="email" id="email-to-input" placeholder="recipient@example.com" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-indigo-500 transition-colors shadow-inner">
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 tracking-wider">Subject</label>
                    <input type="text" id="email-subject-input" placeholder="Enter subject..." class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-indigo-500 transition-colors shadow-inner">
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 tracking-wider">Message</label>
                    <textarea id="email-body-input" rows="4" placeholder="Write your message here..." class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-indigo-500 resize-none transition-colors shadow-inner"></textarea>
                </div>
                
                <button onclick="window.sendEmailAction(this)" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-colors flex justify-center items-center gap-2 mt-2 cursor-pointer">
                    <i class="fa-solid fa-paper-plane"></i> Send Email
                </button>
            </div>
        </div>
    `;
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    if(typeof window.applySystemLanguage === 'function') window.applySystemLanguage();
};

window.sendEmailAction = function(btn) {
    const to = document.getElementById('email-to-input').value.trim();
    const subject = document.getElementById('email-subject-input').value.trim();
    const body = document.getElementById('email-body-input').value.trim();
    
    if(!to) return alert('Please enter recipient email.');
    
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
    
    setTimeout(() => {
        window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        document.getElementById('email-compose-modal').remove();
    }, 500);
};

// ==========================================
// EMAIL СТОР (Корпоративная Почта)
// ==========================================
window.openEmailStore = function() {
    window.closeDropdown();
    const oldModal = document.getElementById('store-modal-container');
    if (oldModal) oldModal.remove();

    let modal = document.createElement('div');
    modal.id = 'store-modal-container';
    modal.className = 'fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[10000] flex justify-center items-center p-4 animate-fade-in';
    document.body.appendChild(modal);

    modal.innerHTML = `
        <div class="bg-white dark:bg-slate-800 w-full max-w-sm rounded-3xl shadow-2xl p-8 relative border border-gray-200 dark:border-slate-700 transition-colors duration-300" onclick="event.stopPropagation()">
            <button onclick="closeEmailStore()" class="absolute top-4 right-4 w-8 h-8 bg-gray-100 dark:bg-slate-700 rounded-full flex justify-center items-center text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors"><i class="fa-solid fa-xmark"></i></button>
            
            <div class="flex flex-col items-center mb-6 text-center">
                <div class="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4"><i class="fa-solid fa-store text-3xl text-indigo-500 dark:text-indigo-400"></i></div>
                <h2 class="text-xl font-bold text-gray-900 dark:text-white" data-i18n="email_store">Corporate Email</h2>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Stand out with a professional email address.</p>
            </div>
            
            <div class="flex items-center bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl overflow-hidden mb-6 shadow-inner focus-within:border-indigo-500 dark:focus-within:border-indigo-500 transition-colors">
                <input type="text" placeholder="ceo, sales..." class="w-full bg-transparent px-4 py-3 outline-none text-gray-900 dark:text-white text-sm">
                <span class="text-gray-500 dark:text-gray-400 text-sm pr-4 pl-3 py-3 bg-gray-100 dark:bg-slate-800 border-l border-gray-200 dark:border-slate-700 font-medium transition-colors">@hellofriends.app</span>
            </div>
            
            <div class="flex justify-between items-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50 mb-6 transition-colors">
                <div class="flex flex-col">
                    <span class="text-sm font-bold text-indigo-900 dark:text-indigo-300">Premium Plan</span>
                    <span class="text-[10px] text-indigo-600 dark:text-indigo-400">Lifetime Domain & Hosting</span>
                </div>
                <span class="text-xl font-black text-indigo-600 dark:text-indigo-400">$0.01</span>
            </div>
            
            <button onclick="alert('Redirecting to payment gateway...'); closeEmailStore();" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg flex justify-center items-center gap-2" data-i18n="purchase"><i class="fa-solid fa-cart-shopping"></i> Purchase Now</button>
        </div>
    `;
    modal.addEventListener('click', (e) => { if (e.target === modal) closeEmailStore(); });
    if(typeof window.applySystemLanguage === 'function') window.applySystemLanguage();
};

window.closeEmailStore = function() {
    const modal = document.getElementById('store-modal-container');
    if (modal) {
        modal.querySelector('div').classList.add('scale-95', 'opacity-0');
        setTimeout(() => modal.remove(), 300);
    }
};

// ==========================================
// ЛОГИКА ПОИСКОВИКА (ЛУПА) И ЖИВОЙ ПОИСК
// ==========================================
window.openSearchModal = function() {
    if(typeof window.closeDropdown === 'function') window.closeDropdown();
    
    const oldSearch = document.getElementById('search-modal');
    if (oldSearch && !oldSearch.innerHTML.includes('global-search-input')) {
        oldSearch.remove(); 
    }

    const modal = document.getElementById('search-modal');
    if (modal) {
        modal.classList.remove('hidden'); modal.classList.add('flex');
        setTimeout(() => { modal.classList.remove('opacity-0'); modal.querySelector('div').classList.remove('scale-95'); }, 10);
    }
};

window.closeSearchModal = function() {
    const modal = document.getElementById('search-modal');
    if (modal) {
        modal.classList.add('opacity-0'); modal.querySelector('div').classList.add('scale-95');
        setTimeout(() => { modal.classList.add('hidden'); modal.classList.remove('flex'); window.resetGlobalSearch(); }, 300);
    }
};

window.handleSmartSearch = function(text, type = 'text') {
    const input = document.getElementById('global-search-input');
    if (type === 'text') { 
        if(input) input.value = text; 
        window.performLiveSearch(); 
    } 
    else if (type === 'transfer') { 
        window.closeSearchModal(); setTimeout(window.openBankTransferModal, 350); 
    } 
    else if (type === 'email') { 
        window.closeSearchModal(); setTimeout(window.openEmailStore, 350);
    } 
    else if (type === 'web') { 
        if(input) input.value = text; 
        window.doGoogleSearch(); 
    }
};

window.performLiveSearch = function() {
    const input = document.getElementById('global-search-input');
    const query = input ? input.value.toLowerCase().trim() : '';
    const resultsArea = document.getElementById('search-results-area');
    const frame = document.getElementById('search-result-frame');
    const suggestions = document.getElementById('search-suggestions');
    const clearBtn = document.getElementById('clear-search-btn');
    
    if(frame) frame.classList.add('hidden');
    
    if (query.length === 0) {
        if(resultsArea) { resultsArea.innerHTML = ''; resultsArea.classList.add('hidden'); }
        if(suggestions) suggestions.style.display = 'block';
        if(clearBtn) clearBtn.classList.add('hidden');
        return;
    }
    
    if(clearBtn) clearBtn.classList.remove('hidden');
    if(suggestions) suggestions.style.display = 'none';
    if(resultsArea) resultsArea.classList.remove('hidden');

    let html = ''; let found = false;
    
    let allUsers = [];
    if (window.myProfileInfo) allUsers.push(window.myProfileInfo);
    if (window.appUsers) {
        Object.keys(window.appUsers).forEach(id => allUsers.push(window.appUsers[id]));
    } else if (window.participants) {
        allUsers = [...allUsers, ...window.participants];
    }
    
    let uniqueUsers = []; let seen = new Set();
    allUsers.forEach(u => {
        if (u && u.id && !seen.has(u.id) && (u.name || u.id === 'ai')) {
            seen.add(u.id); uniqueUsers.push(u);
        }
    });

    uniqueUsers.forEach(p => {
        const name = p.name || 'AI Assistant';
        const prof = p.profession || p.prof || (p.cv && p.cv.profession) || (p.cv && p.cv.role) || 'Member';
        const country = p.country || '';
        const langs = p.languages || p.profileLangs || (p.cv && p.cv.languages) || '';
        
        if (name.toLowerCase().includes(query) || prof.toLowerCase().includes(query) || country.toLowerCase().includes(query) || langs.toLowerCase().includes(query)) {
            found = true;
            let flagText = p.flagCode || p.flag || 'un';
            let fCode = flagText.replace(/[^a-zA-Z]/g, '').toLowerCase();
            if(!fCode || fCode.length !== 2) fCode = 'un';
            if(fCode === 'en') fCode = 'gb';
            let shortCode = fCode.toUpperCase();
            let photo = p.photo || 'https://ui-avatars.com/api/?name=U';

            html += `
                <div class="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm mb-2" onclick="closeSearchModal(); setTimeout(() => { if(typeof window.openLupeCV === 'function') window.openLupeCV('${p.id}'); }, 300);">
                    <div class="flex items-center gap-4 w-full overflow-hidden pointer-events-none">
                        <img src="${photo}" class="w-10 h-10 rounded-full object-cover shadow-sm border border-gray-200 dark:border-slate-600 shrink-0">
                        <div class="flex flex-col flex-grow overflow-hidden">
                            <span class="text-gray-900 dark:text-white text-sm font-bold flex items-center gap-2">
                                ${name.split(' ')[0]} 
                                <span class="text-[10px] text-gray-500 uppercase font-bold">${shortCode}</span>
                            </span>
                            <span class="text-indigo-500 dark:text-indigo-400 text-xs truncate">${prof} | ${country}</span>
                        </div>
                    </div>
                    <i class="fa-solid fa-chevron-right text-gray-400 pr-2 shrink-0 pointer-events-none"></i>
                </div>`;
        }
    });
    
    if (!found) html = `<p class="text-sm text-gray-500 dark:text-gray-400 text-center mt-6 font-medium">No matches found.</p>`;
    if(resultsArea) resultsArea.innerHTML = html;
};

window.resetGlobalSearch = function() {
    const input = document.getElementById('global-search-input');
    if(input) input.value = '';
    window.performLiveSearch();
};

window.doGoogleSearch = function() {
    const input = document.getElementById('global-search-input');
    const q = input ? input.value : '';
    if(q.trim() === '') return alert('Enter search query first');
    
    const searchUrl = 'https://www.google.com/search?igu=1&q=' + encodeURIComponent(q);
    const iframe = document.getElementById('search-result-frame');
    const resultsArea = document.getElementById('search-results-area');
    const suggestions = document.getElementById('search-suggestions');
    const clearBtn = document.getElementById('clear-search-btn');
    
    if(suggestions) suggestions.style.display = 'none';
    if(resultsArea) { resultsArea.innerHTML = ''; resultsArea.classList.add('hidden'); }
    if(clearBtn) clearBtn.classList.remove('hidden');
    
    if(iframe) { iframe.src = searchUrl; iframe.classList.remove('hidden'); }
};

// ==========================================
// МОДАЛКА ЛУПЫ (Из поиска: 5 полей инфо, 3 кнопки внизу) - Адаптировано под Тёмную тему
// ==========================================
window.openLupeCV = function(uid) {
    if(typeof window.closeDropdown === 'function') window.closeDropdown();
    
    let user = null;
    if (uid === 'ai') {
        user = { 
            id: 'ai', name: 'AI Assistant', photo: './ai-avatar.jpg', flagCode: 'gb', country: 'Digital World', profileLangs: 'All',
            cv: { role: 'AI Bot', profession: 'AI Assistant', about: 'I am your intelligent assistant.' } 
        };
    } else {
        user = window.appUsers ? window.appUsers[uid] : (window.participants ? window.participants.find(u => u.id === uid) : null);
    }
    
    if (!user) return;

    const cv = user.cv || {};
    const wrapper = document.body;

    let flagText = user.flagCode || user.flag || 'un';
    let fCode = flagText.replace(/[^a-zA-Z]/g, '').toLowerCase();
    if(!fCode || fCode.length !== 2) fCode = 'un';

    const autoFacts = typeof window.getCountryFacts === 'function' ? window.getCountryFacts(fCode) : { country: 'Global', pop: '-', seas: '-', about: '-' };

    let modalContainer = document.getElementById('lupe-cv-modal');
    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'lupe-cv-modal';
        modalContainer.className = 'fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[999999] flex justify-center items-center p-4 transition-opacity animate-fade-in pointer-events-auto';
        wrapper.appendChild(modalContainer);
        modalContainer.addEventListener('click', (e) => { if (e.target === modalContainer) modalContainer.remove(); });
    }

    modalContainer.innerHTML = `
        <div class="bg-white dark:bg-slate-800 w-full max-w-[340px] rounded-3xl shadow-2xl relative p-6 flex flex-col items-center pointer-events-auto border border-gray-200 dark:border-slate-700 transition-colors duration-300" onclick="event.stopPropagation()">
            <button onclick="document.getElementById('lupe-cv-modal').remove()" class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white text-xl z-50 cursor-pointer p-2 outline-none transition-colors">&times;</button>

            <div class="w-20 h-20 rounded-full p-1 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 shadow-sm mb-3">
                <img src="${user.photo || 'https://ui-avatars.com/api/?name=U'}" class="w-full h-full rounded-full object-cover">
            </div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">${user.name.split(' ')[0]}</h2>

            <div class="w-full space-y-3 text-sm text-gray-600 dark:text-gray-300 font-medium mb-6 px-2">
                <div class="flex items-center">
                    <i class="fa-solid fa-globe text-indigo-500 dark:text-indigo-400 w-6 text-center text-lg"></i>
                    <span class="w-24 text-gray-400 dark:text-gray-500 ml-2" data-i18n="country">Country:</span>
                    <span class="flex items-center gap-2 text-gray-900 dark:text-white font-bold truncate"><img src="https://flagcdn.com/w20/${fCode}.png" class="w-4 rounded-sm shadow-sm"> ${autoFacts.country}</span>
                </div>
                <div class="flex items-center">
                    <i class="fa-solid fa-briefcase text-indigo-500 dark:text-indigo-400 w-6 text-center text-lg"></i>
                    <span class="w-24 text-gray-400 dark:text-gray-500 ml-2" data-i18n="profession">Profession:</span>
                    <span class="text-gray-900 dark:text-white font-bold truncate">${cv.profession || cv.role || 'Member'}</span>
                </div>
                <div class="flex items-center">
                    <i class="fa-solid fa-language text-indigo-500 dark:text-indigo-400 w-6 text-center text-lg"></i>
                    <span class="w-24 text-gray-400 dark:text-gray-500 ml-2" data-i18n="languages">Languages:</span>
                    <span class="text-gray-900 dark:text-white font-bold truncate">${cv.languages || user.profileLangs || '-'}</span>
                </div>
                <div class="flex items-center">
                    <i class="fa-solid fa-users text-indigo-500 dark:text-indigo-400 w-6 text-center text-lg"></i>
                    <span class="w-24 text-gray-400 dark:text-gray-500 ml-2" data-i18n="population">Population:</span>
                    <span class="text-gray-900 dark:text-white font-bold">${autoFacts.pop}</span>
                </div>
                <div class="flex items-center">
                    <i class="fa-solid fa-water text-indigo-500 dark:text-indigo-400 w-6 text-center text-lg"></i>
                    <span class="w-24 text-gray-400 dark:text-gray-500 ml-2" data-i18n="seas">Seas:</span>
                    <span class="text-gray-900 dark:text-white font-bold truncate">${autoFacts.seas}</span>
                </div>
            </div>

            <div class="w-full text-left mb-6 border-t border-gray-200 dark:border-slate-700 pt-3 px-2">
                <p class="text-xs text-gray-400 dark:text-gray-500 mb-1" data-i18n="about_me">About:</p>
                <p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">${cv.about || user.about || autoFacts.about}</p>
            </div>

            <div class="w-full flex justify-between gap-2 mt-auto">
                <button onclick="document.getElementById('lupe-cv-modal').remove(); if(typeof window.switchWebChat === 'function') { window.switchWebChat('${uid}'); document.querySelector('.nav-link[data-target=\\'chat\\']')?.click(); }" class="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-[11px] font-bold py-2.5 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"><i class="fa-solid fa-comment pointer-events-none"></i> <span class="pointer-events-none" data-i18n="chat">Chat</span></button>
                <button onclick="if('${user.phone}') { document.getElementById('lupe-cv-modal').remove(); window.location.href='sms:${user.phone}'; } else alert('No phone number');" class="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold py-2.5 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"><i class="fa-solid fa-comment-sms pointer-events-none"></i> <span class="pointer-events-none" data-i18n="sms">SMS</span></button>
                <button onclick="if('${user.email}') { document.getElementById('lupe-cv-modal').remove(); window.location.href='mailto:${user.email}'; } else alert('No email address');" class="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white text-[11px] font-bold py-2.5 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"><i class="fa-solid fa-envelope pointer-events-none"></i> <span class="pointer-events-none" data-i18n="email_btn">Email</span></button>
            </div>
        </div>
    `;
    if(typeof window.applySystemLanguage === 'function') window.applySystemLanguage();
};

// ==========================================
// МОДАЛКА АВАТАРА (Сдвоенная панель профиля, Адаптировано под Тёмную тему)
// ==========================================
window.openAvatarModal = function(uid) {
    if(typeof window.closeDropdown === 'function') window.closeDropdown();
    const user = window.appUsers ? window.appUsers[uid] : null;
    let uData = user;
    
    if (uid === 'ai') uData = { id: 'ai', name: 'AI Assistant', photo: './ai-avatar.jpg', flagCode: 'gb', country: 'Digital World', profileLangs: 'English', phone: '000-AI-000', email: 'ai@hellofriends.app', cv: { profession: 'AI Bot', about: 'I am your intelligent assistant.' } };
    if (uid === 'me' && window.myProfileInfo) uData = window.myProfileInfo;
    if (!uData) return;
    
    const cv = uData.cv || {};
    let flagText = uData.flagCode || uData.flag || 'un';
    let fCode = flagText.replace(/[^a-zA-Z]/g, '').toLowerCase();
    if(!fCode || fCode.length !== 2) fCode = 'un';

    const smartInfo = typeof window.getCountryFacts === 'function' ? window.getCountryFacts(fCode) : { country: 'Global', pop: '-', seas: '-', about: '-' };
    
    let modalContainer = document.getElementById('combined-avatar-modal');
    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'combined-avatar-modal';
        modalContainer.className = 'fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[999999] flex justify-center items-center p-4 transition-opacity animate-fade-in pointer-events-auto';
        document.body.appendChild(modalContainer);
        modalContainer.addEventListener('click', (e) => { if(e.target === modalContainer) modalContainer.remove(); });
    }

    modalContainer.innerHTML = `
        <div class="bg-white dark:bg-slate-800 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden relative flex flex-col md:flex-row pointer-events-auto border border-gray-200 dark:border-slate-700 transition-colors duration-300" onclick="event.stopPropagation()">
            
            <button onclick="document.getElementById('combined-avatar-modal').remove()" class="absolute top-4 right-4 text-gray-400 hover:text-red-500 z-[9999] text-3xl outline-none cursor-pointer p-2 transition-colors">&times;</button>
            
            <div class="w-full md:w-1/2 p-8 bg-gray-50 dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 relative z-10 transition-colors">
                <div class="flex flex-col items-center mb-6">
                    <img src="${uData.photo || 'https://ui-avatars.com/api/?name=U'}" class="w-24 h-24 rounded-full object-cover border-4 border-indigo-500 shadow-md mb-4 bg-white dark:bg-slate-800">
                    <h3 class="text-2xl font-bold text-gray-900 dark:text-white">${uData.name.replace(' (You)', '')}</h3>
                </div>
                <div class="space-y-4 text-sm mt-4 text-gray-800 dark:text-gray-200">
                    <p class="flex items-center gap-2"><i class="fa-solid fa-globe text-indigo-500 dark:text-indigo-400 w-4"></i> <b class="text-gray-500 dark:text-gray-400" data-i18n="country">Country:</b> <img src="https://flagcdn.com/w20/${fCode}.png" class="w-4 rounded-sm shadow-sm"> ${smartInfo.country}</p>
                    <p class="flex items-center gap-2"><i class="fa-solid fa-briefcase text-indigo-500 dark:text-indigo-400 w-4"></i> <b class="text-gray-500 dark:text-gray-400" data-i18n="profession">Profession:</b> <span class="font-semibold">${cv.profession || cv.role || '-'}</span></p>
                    <p class="flex items-center gap-2"><i class="fa-solid fa-language text-indigo-500 dark:text-indigo-400 w-4"></i> <b class="text-gray-500 dark:text-gray-400" data-i18n="languages">Languages:</b> <span class="truncate font-semibold">${uData.profileLangs || cv.languages || '-'}</span></p>
                    <p class="flex items-center gap-2"><i class="fa-solid fa-users text-indigo-500 dark:text-indigo-400 w-4"></i> <b class="text-gray-500 dark:text-gray-400" data-i18n="population">Population:</b> <span class="font-semibold">${smartInfo.pop}</span></p>
                    <p class="flex items-center gap-2"><i class="fa-solid fa-water text-indigo-500 dark:text-indigo-400 w-4"></i> <b class="text-gray-500 dark:text-gray-400" data-i18n="seas">Seas:</b> <span class="truncate font-semibold">${smartInfo.seas}</span></p>
                </div>
                <div class="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-1" data-i18n="about_me">About:</p>
                    <p class="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">${cv.about || uData.about || smartInfo.about}</p>
                </div>
            </div>
            
            <div class="w-full md:w-1/2 p-8 flex flex-col justify-center bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white relative z-10 transition-colors">
                <div class="grid grid-cols-2 gap-3 w-full">
                    <button onclick="document.getElementById('combined-avatar-modal').remove(); if(typeof window.switchWebChat === 'function') window.switchWebChat('${uid}'); document.querySelector('.nav-link[data-target=\\'chat\\']')?.click();" class="flex flex-col items-center justify-center p-3.5 bg-white dark:bg-slate-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors border border-gray-200 dark:border-slate-600 cursor-pointer shadow-sm group">
                        <i class="fa-solid fa-message text-xl mb-2 text-indigo-500 dark:text-indigo-400 group-hover:scale-110 transition pointer-events-none"></i>
                        <span class="text-xs font-bold pointer-events-none" data-i18n="action_chat">Private Chat</span>
                    </button>
                    <button onclick="document.getElementById('combined-avatar-modal').remove(); if(typeof window.openVoiceChat === 'function') window.openVoiceChat();" class="flex flex-col items-center justify-center p-3.5 bg-white dark:bg-slate-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors border border-gray-200 dark:border-slate-600 cursor-pointer shadow-sm group">
                        <i class="fa-solid fa-phone text-xl mb-2 text-green-500 dark:text-green-400 group-hover:scale-110 transition pointer-events-none"></i>
                        <span class="text-xs font-bold pointer-events-none" data-i18n="action_voice">Voice Room</span>
                    </button>
                    <button onclick="document.getElementById('combined-avatar-modal').remove(); if(typeof window.openConference === 'function') window.openConference();" class="flex flex-col items-center justify-center p-3.5 bg-white dark:bg-slate-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors border border-gray-200 dark:border-slate-600 cursor-pointer shadow-sm group">
                        <i class="fa-solid fa-video text-xl mb-2 text-blue-500 dark:text-blue-400 group-hover:scale-110 transition pointer-events-none"></i>
                        <span class="text-xs font-bold pointer-events-none" data-i18n="action_video">Video Conf</span>
                    </button>
                    <button onclick="document.getElementById('combined-avatar-modal').remove(); if(typeof window.openEmailModal === 'function') { window.openEmailModal(); setTimeout(() => { const el = document.getElementById('email-to-input'); if(el) el.value = '${uData.email || ''}'; }, 100); } else window.location.href='mailto:${uData.email || ''}';" class="flex flex-col items-center justify-center p-3.5 bg-white dark:bg-slate-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors border border-gray-200 dark:border-slate-600 cursor-pointer shadow-sm group">
                        <i class="fa-solid fa-envelope text-xl mb-2 text-red-500 dark:text-red-400 group-hover:scale-110 transition pointer-events-none"></i>
                        <span class="text-xs font-bold pointer-events-none" data-i18n="action_email">Send Email</span>
                    </button>
                    <button onclick="if('${uData.phone}') { document.getElementById('combined-avatar-modal').remove(); window.location.href='tel:${uData.phone}'; } else alert('No phone number');" class="col-span-2 flex items-center justify-center gap-3 p-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-2xl transition-colors shadow-md mt-1 cursor-pointer group">
                        <i class="fa-solid fa-mobile-screen-button text-lg pointer-events-none group-hover:scale-110 transition"></i>
                        <span class="text-sm font-bold tracking-wide pointer-events-none" data-i18n="action_cellular">Cellular Call</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    if(typeof window.applySystemLanguage === 'function') window.applySystemLanguage(); 
};
