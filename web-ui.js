// ==========================================
// Файл: webjs/web-ui.js
// Назначение: Меню, Вкладки, Базовые модальные окна, Тема, Главный Профиль
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
// ГЛАВНЫЙ ПРОФИЛЬ (С Населением и Морями)
// ==========================================
window.openMyProfile = function() {
    if (!window.myProfileInfo) return alert("Пожалуйста, авторизуйтесь!");
    window.closeDropdown(); 
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
        <div class="bg-white dark:bg-slate-800 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden relative flex flex-col md:flex-row animate-fade-in" onclick="event.stopPropagation()">
            <button onclick="document.getElementById('profile-modal-container').remove()" class="absolute top-4 right-4 w-8 h-8 bg-gray-100 dark:bg-slate-700 hover:bg-red-500 hover:text-white text-gray-500 dark:text-gray-300 rounded-full flex items-center justify-center transition-colors z-50"><i class="fa-solid fa-xmark"></i></button>

            <!-- Левая колонка -->
            <div class="bg-gray-50 dark:bg-slate-900/50 p-8 flex flex-col items-center justify-center border-r border-gray-200 dark:border-slate-700 w-full md:w-1/3 relative">
                <div class="text-center mb-6"><h2 class="text-2xl font-bold text-gray-900 dark:text-white">Profile</h2></div>
                <div class="relative w-32 h-32 rounded-full p-1 border-2 border-indigo-500 mb-4 group cursor-pointer" onclick="document.getElementById('attachment-input').click()">
                    <img src="${user.photo || 'https://ui-avatars.com/api/?name=U'}" class="w-full h-full rounded-full object-cover border border-gray-200 dark:border-slate-700 bg-white">
                    <div class="absolute inset-1 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><i class="fa-solid fa-camera text-white text-3xl"></i></div>
                </div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">${user.name.split(' ')[0]}</h3>
            </div>

            <!-- Правая колонка -->
            <div class="p-8 w-full md:w-2/3 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label class="block text-[10px] font-bold text-indigo-500 uppercase mb-1">Name</label><input type="text" id="prof-name" value="${user.name || ''}" class="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-indigo-500"></div>
                    <div><label class="block text-[10px] font-bold text-indigo-500 uppercase mb-1">Country</label><input type="text" id="prof-country" value="${user.country || ''}" class="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-indigo-500"></div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-100 dark:bg-slate-900/50 p-4 rounded-xl border border-gray-200 dark:border-slate-700">
                    <div><label class="block text-[10px] font-bold text-indigo-500 uppercase mb-1">Population</label><input type="text" id="prof-pop" value="${user.population || ''}" class="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none"></div>
                    <div><label class="block text-[10px] font-bold text-indigo-500 uppercase mb-1">Seas</label><input type="text" id="prof-seas" value="${user.seas || ''}" class="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none"></div>
                </div>
                <button onclick="saveProfileData(this)" class="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all uppercase">Save Profile</button>
            </div>
        </div>
    `;
};

window.saveProfileData = function(btn) {
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...'; }
    const data = {
        name: document.getElementById('prof-name').value.trim(),
        country: document.getElementById('prof-country').value.trim(),
        population: document.getElementById('prof-pop').value.trim(),
        seas: document.getElementById('prof-seas').value.trim()
    };
    if (window.firebase) {
        firebase.database().ref('users/' + window.myProfileInfo.id).update(data).then(() => {
            Object.assign(window.myProfileInfo, data);
            document.getElementById('profile-modal-container').remove();
            
            // Если аватарки на главной странице уже отрисованы - обновляем их, чтобы показать новые данные
            if(typeof window.renderMainScreenAvatars === 'function') window.renderMainScreenAvatars(window.appUsers);
        }).catch(err => {
            alert("Error: " + err.message);
            if (btn) { btn.disabled = false; btn.innerHTML = 'Save Profile'; }
        });
    }
};
// ==========================================
// ГЛАВНЫЙ ПРОФИЛЬ (Точь-в-точь как на фото + Население и Моря)
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
        modal.className = 'fixed inset-0 bg-gray-900/90 backdrop-blur-sm z-[10000] flex justify-center items-center p-4 transition-opacity';
        document.body.appendChild(modal);
    }

    // Дизайн адаптирован под твой скриншот (темный фон, неоново-зеленая кнопка)
    modal.innerHTML = `
        <div class="bg-[#1e293b] w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden relative flex flex-col border border-[#334155] animate-fade-in" onclick="event.stopPropagation()">
            <button onclick="document.getElementById('profile-modal-container').remove()" class="absolute top-4 right-4 w-8 h-8 bg-black/20 hover:bg-red-500 hover:text-white text-gray-400 rounded-full flex items-center justify-center transition-colors z-50"><i class="fa-solid fa-xmark"></i></button>

            <!-- Шапка профиля -->
            <div class="pt-8 pb-2 flex flex-col items-center justify-center relative">
                <h2 class="text-xl font-bold text-white mb-1">My Profile</h2>
                <p class="text-[10px] text-gray-400 uppercase tracking-widest mb-4">Complete Registration</p>
                
                <div class="relative w-24 h-24 rounded-full p-1 border-2 border-[#10b981] mb-2 cursor-pointer group" onclick="document.getElementById('attachment-input').click()">
                    <img src="${user.photo || 'https://ui-avatars.com/api/?name=U'}" class="w-full h-full rounded-full object-cover">
                    <div class="absolute bottom-0 right-0 w-7 h-7 bg-[#10b981] rounded-full border-2 border-[#1e293b] flex items-center justify-center text-white text-xs"><i class="fa-solid fa-camera"></i></div>
                </div>
            </div>

            <!-- Форма профиля -->
            <div class="p-6 pt-2 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-[10px] font-bold text-[#10b981] uppercase mb-1">Full Name</label>
                        <input type="text" id="prof-name" value="${user.name || ''}" class="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-2.5 text-white outline-none focus:border-[#10b981]">
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-[#10b981] uppercase mb-1">Country</label>
                        <input type="text" id="prof-country" value="${user.country || ''}" class="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-2.5 text-white outline-none focus:border-[#10b981]">
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-[10px] font-bold text-[#10b981] uppercase mb-1">Phone Number</label>
                        <input type="text" id="prof-phone" value="${user.phone || ''}" class="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-2.5 text-white outline-none focus:border-[#10b981]">
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-[#10b981] uppercase mb-1">Languages</label>
                        <input type="text" id="prof-langs" value="${user.profileLangs || cv.languages || ''}" class="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-2.5 text-white outline-none focus:border-[#10b981]">
                    </div>
                </div>

                <div>
                    <label class="block text-[10px] font-bold text-[#10b981] uppercase mb-1">Email</label>
                    <input type="email" id="prof-email" value="${user.email || ''}" class="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-2.5 text-white outline-none focus:border-[#10b981]">
                </div>

                <!-- Новые поля: Население и Моря -->
                <div class="grid grid-cols-2 gap-4 bg-[#0f172a]/50 p-3 rounded-xl border border-[#334155]/50">
                    <div>
                        <label class="block text-[10px] font-bold text-[#10b981] uppercase mb-1">Population</label>
                        <input type="text" id="prof-pop" value="${user.population || ''}" class="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-white outline-none focus:border-[#10b981]">
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-[#10b981] uppercase mb-1">Seas</label>
                        <input type="text" id="prof-seas" value="${user.seas || ''}" class="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-white outline-none focus:border-[#10b981]">
                    </div>
                </div>

                <div>
                    <label class="block text-[10px] font-bold text-[#10b981] uppercase mb-1">About Me</label>
                    <textarea id="prof-about" rows="2" class="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-2.5 text-white outline-none focus:border-[#10b981] resize-none">${cv.about || ''}</textarea>
                </div>
                
                <button onclick="saveProfileData(this)" class="mt-2 w-full bg-[#10b981] hover:bg-[#059669] text-[#0f172a] font-bold py-3.5 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all">Speichern (Save)</button>
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
            // Синхронизируем с CV
            firebase.database().ref('users/' + window.myProfileInfo.id + '/cv').update({
                languages: data.profileLangs, about: document.getElementById('prof-about').value.trim()
            });
            Object.assign(window.myProfileInfo, data);
            document.getElementById('profile-modal-container').remove();
            if(typeof window.renderMainScreenAvatars === 'function') window.renderMainScreenAvatars(window.appUsers);
        }).catch(err => {
            alert("Error: " + err.message);
            if (btn) { btn.disabled = false; btn.innerHTML = 'Save'; }
        });
    }
};
