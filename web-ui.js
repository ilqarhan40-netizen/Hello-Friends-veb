// ==========================================
// Файл: webjs/web-ui.js
// Назначение: Меню, Вкладки, Базовые модальные окна, Тема, Главный Профиль, Поиск, Кошелек, Почта
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
// УМНАЯ ГЕО-БАЗА: РАСШИРЕННОЕ ОПИСАНИЕ СТРАН
// ==========================================
window.getCountryFacts = function(fCode) {
    const db = {
        'az': { country: 'Azerbaijan', location: 'Caucasus, Eastern Europe / Western Asia', pop: '~10.14 M', seas: 'Caspian Sea', about: 'Azerbaijan is known as the "Land of Fire." It features a unique blend of ancient history and modern architecture.' },
        'ru': { country: 'Russia', location: 'Eastern Europe and Northern Asia', pop: '~144.5 M', seas: 'Arctic, Pacific, Atlantic, Baltic, Black, Caspian', about: 'The largest country in the world, spanning eleven time zones and two continents.' },
        'it': { country: 'Italy', location: 'Southern Europe, Mediterranean peninsula', pop: '~58.9 M', seas: 'Mediterranean, Adriatic, Ionian, Tyrrhenian', about: 'Italy is famous for its Renaissance culture and stunning coastal landscapes.' },
        'de': { country: 'Germany', location: 'Central Europe', pop: '~83.2 M', seas: 'North Sea, Baltic Sea', about: 'Germany is a major European power with a diverse geography ranging from the Alps to sandy northern shores.' },
        'gb': { country: 'United Kingdom', location: 'Northwestern Europe, Island nation', pop: '~67.3 M', seas: 'Atlantic Ocean, North Sea, English Channel', about: 'An island country consisting of Great Britain and Northern Ireland.' },
        'tr': { country: 'Turkey', location: 'Eurasia, bridging Europe and Asia', pop: '~85.3 M', seas: 'Mediterranean, Aegean, Black Sea, Marmara', about: 'Turkey is unique for its transcontinental location and historic crossroad of civilizations.' },
        'fr': { country: 'France', location: 'Western Europe', pop: '~67.9 M', seas: 'Mediterranean, Atlantic (Bay of Biscay), English Channel', about: 'France features diverse coasts, from the glamorous Riviera to the rugged Atlantic.' },
        'es': { country: 'Spain', location: 'Southwestern Europe, Iberian Peninsula', pop: '~47.7 M', seas: 'Mediterranean Sea, Atlantic Ocean', about: 'Spain occupies most of the Iberian Peninsula, deeply influenced by the Atlantic and Mediterranean.' },
        'us': { country: 'USA', location: 'North America', pop: '~333.3 M', seas: 'Atlantic, Pacific, Arctic Oceans; Gulf of Mexico', about: 'A vast country spanning the North American continent with immense geographic variety.' },
        'pt': { country: 'Portugal', location: 'Southwestern Europe, Iberian Peninsula', pop: '~10.3 M', seas: 'Atlantic Ocean', about: 'Portugal is defined by its long Atlantic coastline and maritime history.' },
        'ja': { country: 'Japan', location: 'East Asia, Archipelago', pop: '~125.1 M', seas: 'Pacific Ocean, Sea of Japan, East China Sea', about: 'An island nation in the Pacific Ocean with mountainous territory surrounded by sea.' },
        'cn': { country: 'China', location: 'East Asia', pop: '~1.41 B', seas: 'Yellow Sea, East China Sea, South China Sea', about: 'China has a long coastline along the Pacific\'s marginal seas, hosting busy ports.' },
        'ae': { country: 'UAE', location: 'Middle East, Arabian Peninsula', pop: '~9.4 M', seas: 'Persian Gulf, Gulf of Oman', about: 'The UAE is known for its modern architecture and dramatic desert-meets-sea landscapes.' }
    };
    return db[fCode] || { country: 'Global', location: 'Earth', pop: 'Unknown', seas: 'International Waters', about: 'No data available.' };
};

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

            <div class="pt-8 pb-2 flex flex-col items-center justify-center relative">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-1">My Profile</h2>
                <p class="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">Complete Registration</p>
                
                <div class="relative w-24 h-24 rounded-full p-1 border-2 border-[#10b981] mb-2 cursor-pointer group" onclick="document.getElementById('attachment-input').click()">
                    <img src="${user.photo || 'https://ui-avatars.com/api/?name=U'}" class="w-full h-full rounded-full object-cover">
                    <div class="absolute bottom-0 right-0 w-7 h-7 bg-[#10b981] rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center text-white text-xs"><i class="fa-solid fa-camera"></i></div>
                </div>
            </div>

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
                        <label class="block text-[10px] font-bold text-[#10b981] uppercase mb-1">Languages (Your Skills)</label>
                        <input type="text" id="prof-langs" value="${user.profileLangs || cv.languages || ''}" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:border-[#10b981]">
                    </div>
                </div>

                <div>
                    <label class="block text-[10px] font-bold text-[#10b981] uppercase mb-1">Email</label>
                    <input type="email" id="prof-email" value="${user.email || ''}" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:border-[#10b981]">
                </div>

                <div>
                    <label class="block text-[10px] font-bold text-[#10b981] uppercase mb-1">About Me</label>
                    <textarea id="prof-about" rows="3" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:border-[#10b981] resize-none">${cv.about || user.about || ''}</textarea>
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
        about: document.getElementById('prof-about').value.trim() 
    };
    if (window.firebase) {
        firebase.database().ref('users/' + window.myProfileInfo.id).update(data).then(() => {
            firebase.database().ref('users/' + window.myProfileInfo.id + '/cv').update({
                languages: data.profileLangs, about: data.about
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
// КОШЕЛЕК / БАНК (Темная/Светлая тема, Неон)
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
            <button onclick="closeEmailStore()" class="absolute top-4 right-4 w-8 h-8 bg-gray-100 dark:bg-slate-700 rounded-full flex justify-center items-center text-gray-500 hover:text-red-500 transition-colors"><i class="fa-solid fa-xmark"></i></button>
            
            <div class="flex flex-col items-center mb-6 text-center">
                <div class="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4"><i class="fa-solid fa-store text-3xl text-indigo-500"></i></div>
                <h2 class="text-xl font-bold text-gray-900 dark:text-white" data-i18n="email_store">Corporate Email</h2>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Stand out with a professional email address.</p>
            </div>
            
            <div class="flex items-center bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl overflow-hidden mb-6 shadow-inner focus-within:border-indigo-500 dark:focus-within:border-indigo-500 transition-colors">
                <input type="text" placeholder="ceo, sales..." class="w-full bg-transparent px-4 py-3 outline-none text-gray-900 dark:text-white text-sm">
                <span class="text-gray-500 dark:text-gray-400 text-sm pr-4 pl-3 py-3 bg-gray-100 dark:bg-slate-800 border-l border-gray-200 dark:border-slate-700 font-medium">@hellofriends.app</span>
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
        if (u && u.id && !seen.has(u.id) && u.id !== 'ai') {
            seen.add(u.id); uniqueUsers.push(u);
        }
    });

    uniqueUsers.forEach(p => {
        const name = p.name || 'User';
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
                <div class="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm mb-2" onclick="closeSearchModal(); setTimeout(() => { if(typeof window.openDetailedCV === 'function') window.openDetailedCV('${p.id}'); }, 300);">
                    <div class="flex items-center gap-4 w-full overflow-hidden">
                        <img src="${photo}" class="w-10 h-10 rounded-full object-cover shadow-sm border border-gray-200 dark:border-slate-600 shrink-0">
                        <div class="flex flex-col flex-grow overflow-hidden">
                            <span class="text-gray-900 dark:text-white text-sm font-bold flex items-center gap-2">
                                ${name.split(' ')[0]} 
                                <span class="text-[10px] text-gray-500 uppercase font-bold">${shortCode}</span>
                            </span>
                            <span class="text-indigo-500 dark:text-indigo-400 text-xs truncate">${prof} | ${country}</span>
                        </div>
                    </div>
                    <i class="fa-solid fa-chevron-right text-gray-400 pr-2 shrink-0"></i>
                </div>`;
        }
    });
    
    if (!found) html = `<p class="text-sm text-gray-500 dark:text-gray-400 text-center mt-6 font-medium">No real users found. Click 'Search Web' below.</p>`;
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
// МОДАЛКА АВАТАРА (Выезжающая)
// ==========================================
window.openAvatarModal = function(uid) {
    if(typeof window.closeDropdown === 'function') window.closeDropdown();
    const user = window.appUsers ? window.appUsers[uid] : null;
    let uData = user;
    
    if (uid === 'ai') uData = { id: 'ai', name: 'AI Assistant', photo: './ai-avatar.jpg', flagCode: 'gb', country: 'Digital World', profileLangs: 'English' };
    if (uid === 'me' && window.myProfileInfo) uData = window.myProfileInfo;
    if (!uData) return;
    
    const cv = uData.cv || {};
    let flagText = uData.flagCode || uData.flag || 'un';
    let fCode = flagText.replace(/[^a-zA-Z]/g, '').toLowerCase();
    if(!fCode || fCode.length !== 2) fCode = 'un';
    if(fCode === 'en') fCode = 'gb';

    const smartInfo = window.getCountryFacts(fCode);
    
    let modalContainer = document.getElementById('combined-avatar-modal');
    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'combined-avatar-modal';
        modalContainer.className = 'fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[10000] flex justify-center items-center p-4 transition-opacity animate-fade-in';
        document.body.appendChild(modalContainer);
        modalContainer.addEventListener('click', (e) => { if(e.target === modalContainer) modalContainer.remove(); });
    }

    modalContainer.innerHTML = `
        <div class="bg-white dark:bg-[#1e293b] w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden relative flex flex-col md:flex-row" onclick="event.stopPropagation()">
            <button onclick="document.getElementById('combined-avatar-modal').remove()" class="absolute top-4 right-4 text-gray-500 hover:text-red-500 z-50 text-2xl outline-none">&times;</button>
            
            <div class="w-full md:w-1/2 p-8 bg-gray-50 dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700">
                <div class="flex flex-col items-center mb-6">
                    <img src="${uData.photo || 'https://ui-avatars.com/api/?name=U'}" class="w-24 h-24 rounded-full object-cover border-4 border-indigo-500 shadow-md mb-4">
                    <h3 class="text-2xl font-bold text-gray-900 dark:text-white">${uData.name.replace(' (You)', '')}</h3>
                </div>
                <div class="space-y-4 text-sm mt-4 text-gray-800 dark:text-gray-200">
                    <p class="flex items-center gap-2"><i class="fa-solid fa-globe text-indigo-400 w-4"></i> <b class="text-gray-500">Country:</b> <img src="https://flagcdn.com/w20/${fCode}.png" class="w-4 rounded-sm"> ${smartInfo.country}</p>
                    <p class="flex items-center gap-2"><i class="fa-solid fa-map-location-dot text-indigo-400 w-4"></i> <b class="text-gray-500">Location:</b> <span class="truncate">${smartInfo.location}</span></p>
                    <p class="flex items-center gap-2"><i class="fa-solid fa-language text-indigo-400 w-4"></i> <b class="text-gray-500">Languages:</b> <span class="truncate">${uData.profileLangs || cv.languages || 'Not specified'}</span></p>
                    <p class="flex items-center gap-2"><i class="fa-solid fa-users text-indigo-400 w-4"></i> <b class="text-gray-500">Population:</b> ${smartInfo.pop}</p>
                    <p class="flex items-center gap-2"><i class="fa-solid fa-water text-indigo-400 w-4"></i> <b class="text-gray-500">Seas:</b> <span class="truncate">${smartInfo.seas}</span></p>
                </div>
                <div class="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <p class="text-xs text-gray-500 mb-1">About:</p>
                    <p class="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">${cv.about || uData.about || smartInfo.about}</p>
                </div>
            </div>
            
            <div class="w-full md:w-1/2 p-8 flex flex-col justify-center bg-[#1e293b] text-white">
                <div class="grid grid-cols-2 gap-3 w-full">
                    <button onclick="actionPrivateChatFromCV('${uid}')" class="flex flex-col items-center justify-center p-3.5 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-colors border border-slate-700">
                        <i class="fa-solid fa-message text-xl mb-2 text-indigo-500"></i>
                        <span class="text-xs font-bold" data-i18n="action_chat">Private Chat</span>
                    </button>
                    <button onclick="actionVoiceRoom('${uid}')" class="flex flex-col items-center justify-center p-3.5 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-colors border border-slate-700">
                        <i class="fa-solid fa-phone text-xl mb-2 text-green-500"></i>
                        <span class="text-xs font-bold" data-i18n="action_voice">Voice Room</span>
                    </button>
                    <button onclick="actionVideoConf('${uid}')" class="flex flex-col items-center justify-center p-3.5 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-colors border border-slate-700">
                        <i class="fa-solid fa-video text-xl mb-2 text-blue-500"></i>
                        <span class="text-xs font-bold" data-i18n="action_video">Video Conf</span>
                    </button>
                    <button onclick="actionSendEmail('${uid}')" class="flex flex-col items-center justify-center p-3.5 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-colors border border-slate-700">
                        <i class="fa-solid fa-envelope text-xl mb-2 text-red-500"></i>
                        <span class="text-xs font-bold" data-i18n="action_email">Send Email</span>
                    </button>
                    <button onclick="actionExternalCall('${uid}')" class="col-span-2 flex items-center justify-center gap-3 p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-colors shadow-md mt-1">
                        <i class="fa-solid fa-mobile-screen-button text-lg"></i>
                        <span class="text-sm font-bold tracking-wide" data-i18n="action_cellular">Cellular Call</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    if(typeof window.applySystemLanguage === 'function') window.applySystemLanguage(); 
};
