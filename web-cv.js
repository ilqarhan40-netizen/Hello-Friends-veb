
// ==========================================
// ФАЙЛ: web-cv.js
// Назначение: Биржа труда (Profession), Отрисовка CV, Модалки просмотра и редактирования
// ==========================================

// 1. Создаем контейнеры для модальных окон при загрузке
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('cv-modals-wrapper')) {
        const modalsContainer = document.createElement('div');
        modalsContainer.id = 'cv-modals-wrapper';
        document.body.appendChild(modalsContainer);
    }
});

// 2. ГЕНЕРАЦИЯ ГЛАВНОЙ СЕТКИ ПРОФЕССИЙ
window.renderProfessionSection = function(usersObj) {
    const cvContainer = document.getElementById('profession');
    if (!cvContainer) return;

    let html = `
        <div class="max-w-6xl mx-auto p-4 md:p-6">
            <div class="flex justify-between items-center mb-8">
                <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Professional Community</h2>
                <button onclick="openEditCVModal()" class="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-600/20 dark:hover:bg-indigo-600/40 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/50 px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm">
                    <i class="fa-solid fa-pen-to-square"></i> Edit Profile
                </button>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
    `;

    Object.keys(usersObj).forEach(uid => {
        const user = usersObj[uid];
        if (!user.name) return;
        
        const cv = user.cv || {};
        const role = cv.role || 'Professional';
        
        // Карточка в стиле веб
        html += `
            <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl p-6 flex flex-col items-center relative overflow-hidden group hover:shadow-xl hover:border-indigo-500/50 transition-all duration-300">
                <div onclick="openDetailedCV('${uid}')" class="relative w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-gray-50 dark:border-slate-700 shadow-sm mb-4 cursor-pointer overflow-hidden transform group-hover:scale-105 transition-transform">
                    <img src="${user.photo || 'https://ui-avatars.com/api/?name=U'}" class="w-full h-full object-cover">
                </div>
                
                <h3 class="font-bold text-gray-900 dark:text-white text-lg text-center w-full truncate">${user.name.split(' ')[0]}</h3>
                <p class="text-xs text-indigo-500 dark:text-indigo-400 mb-5 font-medium uppercase tracking-wide text-center w-full truncate">${role}</p>
                
                <button onclick="openDetailedCV('${uid}')" class="w-full bg-gray-50 hover:bg-gray-100 dark:bg-slate-700/50 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 font-semibold text-sm py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 transition-colors">
                    View CV
                </button>
            </div>
        `;
    });

    html += `</div></div>`;
    cvContainer.innerHTML = html;
};

// 3. ПРОСМОТР ЧУЖОГО CV (Модалка со смарт-кнопками)
window.openDetailedCV = function(uid) {
    const user = window.appUsers[uid];
    if (!user) return;
    const cv = user.cv || {};
    const wrapper = document.getElementById('cv-modals-wrapper') || document.body;
    
    let modalContainer = document.getElementById('detailed-cv-modal');
    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'detailed-cv-modal';
        modalContainer.className = 'fixed inset-0 bg-gray-900/70 backdrop-blur-sm z-[10000] flex justify-center items-center p-4 transition-opacity';
        wrapper.appendChild(modalContainer);
    }

    modalContainer.innerHTML = `
        <div class="bg-[#1e293b] w-full max-w-2xl rounded-3xl border border-[#334155] shadow-2xl overflow-hidden relative animate-fade-in" onclick="event.stopPropagation()">
            <div class="p-6 md:p-8 bg-gradient-to-b from-[#1e3a8a]/60 to-[#1e293b] border-b border-[#334155]">
                <div class="flex items-center gap-6">
                    <img src="${user.photo || 'https://ui-avatars.com/api/?name=U'}" class="w-24 h-24 rounded-full border-4 border-white/10 shadow-lg object-cover">
                    <div>
                        <h2 class="text-2xl md:text-3xl font-bold text-white mb-1 flex items-center gap-2">
                            ${user.name} <span class="bg-indigo-500 text-white text-[10px] uppercase px-2 py-0.5 rounded-full">Pro</span>
                        </h2>
                        <p class="text-blue-400 font-semibold md:text-lg">${cv.role || 'Professional'}</p>
                    </div>
                </div>
            </div>

            <div class="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8">
                <div>
                    <p class="text-gray-400 text-xs flex items-center gap-2 mb-1"><i class="fa-solid fa-briefcase"></i> Profession</p>
                    <p class="text-white font-semibold text-sm">${cv.profession || 'Not specified'}</p>
                </div>
                <div>
                    <p class="text-gray-400 text-xs flex items-center gap-2 mb-1"><i class="fa-solid fa-language"></i> Languages</p>
                    <p class="text-white font-semibold text-sm">${cv.languages || user.profileLangs || 'Not specified'}</p>
                </div>
                <div>
                    <p class="text-gray-400 text-xs flex items-center gap-2 mb-1"><i class="fa-solid fa-phone"></i> Phone Number</p>
                    <p class="text-white font-semibold text-sm">${user.phone || 'Hidden'}</p>
                </div>
                <div>
                    <p class="text-gray-400 text-xs flex items-center gap-2 mb-1"><i class="fa-solid fa-envelope"></i> Email Address</p>
                    <p class="text-white font-semibold text-sm">${user.email || 'Hidden'}</p>
                </div>
            </div>

            <div class="px-6 md:px-8 pb-6 space-y-4">
                ${cv.about ? `
                <div class="bg-[#0f172a]/80 p-4 rounded-xl border border-[#334155]">
                    <h4 class="text-gray-400 text-[10px] mb-2 uppercase font-bold tracking-wider">About Profession</h4>
                    <p class="text-gray-200 text-xs leading-relaxed">${cv.about}</p>
                </div>` : ''}
                ${cv.skills ? `
                <div class="bg-[#0f172a]/80 p-4 rounded-xl border border-[#334155]">
                    <h4 class="text-gray-400 text-[10px] mb-2 uppercase font-bold tracking-wider">Work Skills</h4>
                    <p class="text-blue-300 text-xs font-medium">${cv.skills}</p>
                </div>` : ''}
            </div>

            <!-- СМАРТ КНОПКИ -->
            <div class="p-6 bg-[#0f172a] border-t border-[#334155] flex gap-3">
                <button onclick="actionPrivateChatFromCV('${uid}')" class="flex-1 bg-[#3b82f6] hover:bg-blue-600 text-white font-bold py-2.5 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2"><i class="fa-solid fa-comment"></i> Chat</button>
                <button onclick="actionSMSFromCV('${uid}')" class="flex-1 bg-[#22c55e] hover:bg-green-600 text-white font-bold py-2.5 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2"><i class="fa-solid fa-comment-sms"></i> SMS</button>
                <button onclick="actionEmailFromCV('${uid}')" class="flex-1 bg-[#8b5cf6] hover:bg-purple-600 text-white font-bold py-2.5 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2"><i class="fa-solid fa-paper-plane"></i> Email</button>
            </div>
            
            <button onclick="document.getElementById('detailed-cv-modal').remove()" class="absolute top-4 right-4 text-gray-400 hover:text-white bg-black/20 hover:bg-black/40 rounded-full w-8 h-8 flex items-center justify-center transition-colors"><i class="fa-solid fa-times"></i></button>
        </div>
    `;
};

window.actionPrivateChatFromCV = function(uid) {
    document.getElementById('detailed-cv-modal')?.remove();
    if(typeof window.switchWebChat === 'function') window.switchWebChat(uid);
    const chatNavLink = document.querySelector('.nav-link[data-target="chat"]');
    if(chatNavLink) chatNavLink.click();
};

window.actionSMSFromCV = function(uid) {
    const user = window.appUsers[uid];
    if (user && user.phone) {
        window.location.href = `sms:${user.phone}`;
        document.getElementById('detailed-cv-modal')?.remove();
    } else {
        alert("Пользователь не указал номер телефона.");
    }
};

window.actionEmailFromCV = function(uid) {
    const user = window.appUsers[uid];
    if (user && user.email) {
        document.getElementById('detailed-cv-modal')?.remove();
        if(typeof window.openEmailModal === 'function') window.openEmailModal();
        setTimeout(() => {
            const emailInput = document.getElementById('email-to-input');
            if (emailInput) emailInput.value = user.email;
        }, 100);
    } else {
        alert("Пользователь не указал Email.");
    }
};

// 4. РЕДАКТИРОВАНИЕ СВОЕГО CV (С умным телефоном и email)
window.openEditCVModal = function() {
    if (!window.myProfileInfo) return alert("Пожалуйста, авторизуйтесь!");
    const user = window.myProfileInfo;
    const cv = user.cv || {};
    
    let phoneVal = user.phone || "";
    if (!phoneVal && user.flagCode) {
        const prefixes = { 'az': '+994', 'ru': '+7', 'de': '+49', 'it': '+39', 'gb': '+44', 'en': '+44', 'tr': '+90', 'es': '+34', 'fr': '+33', 'pt': '+351', 'ar': '+971', 'zh': '+86', 'hi': '+91' };
        phoneVal = prefixes[user.flagCode] || '+';
    }
    
    let modal = document.getElementById('edit-cv-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'edit-cv-modal';
        modal.className = 'fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[10000] flex justify-center items-center p-4';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="bg-[#1e293b] w-full max-w-lg rounded-[2rem] shadow-2xl p-6 md:p-8 relative border border-[#334155] animate-fade-in" onclick="event.stopPropagation()">
            <button onclick="document.getElementById('edit-cv-modal').remove()" class="absolute top-4 right-4 text-gray-400 hover:text-white bg-black/20 hover:bg-red-500 rounded-full w-8 h-8 flex items-center justify-center transition-colors z-50"><i class="fa-solid fa-times"></i></button>
            
            <h3 class="text-2xl font-bold text-white mb-6">Professional CV</h3>
            
            <div class="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <div>
                    <label class="block text-[10px] font-bold text-indigo-400 uppercase mb-1">Role / Title</label>
                    <input type="text" id="cv-edit-role" value="${cv.role || ''}" placeholder="e.g. CEO & Founder" class="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors">
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-indigo-400 uppercase mb-1">Profession</label>
                    <input type="text" id="cv-edit-prof" value="${cv.profession || ''}" class="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors">
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#0f172a]/50 p-4 rounded-xl border border-[#334155]/50">
                    <div>
                        <label class="block text-[10px] font-bold text-indigo-400 uppercase mb-1">Work Phone (Auto Prefix)</label>
                        <input type="text" id="cv-edit-phone" value="${phoneVal}" class="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500 transition-colors">
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-indigo-400 uppercase mb-1">Work Email</label>
                        <input type="email" id="cv-edit-email" value="${user.email || ''}" class="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500 transition-colors">
                    </div>
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-indigo-400 uppercase mb-1">Languages (Work)</label>
                    <input type="text" id="cv-edit-lang" value="${cv.languages || user.profileLangs || ''}" class="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors">
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-indigo-400 uppercase mb-1">Work Skills</label>
                    <input type="text" id="cv-edit-skills" value="${cv.skills || ''}" placeholder="e.g. Management, IT, Design" class="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors">
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-indigo-400 uppercase mb-1">About Profession</label>
                    <textarea id="cv-edit-about" rows="3" class="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-3 text-white outline-none resize-none focus:border-indigo-500 transition-colors">${cv.about || ''}</textarea>
                </div>
            </div>
            
            <div class="mt-6 flex justify-end gap-3">
                <button onclick="document.getElementById('edit-cv-modal').remove()" class="px-5 py-3 rounded-xl font-bold text-gray-400 hover:bg-slate-700 transition-colors">Cancel</button>
                <button onclick="saveCVData(this)" class="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-colors flex items-center gap-2"><i class="fa-solid fa-save"></i> Save CV</button>
            </div>
        </div>
    `;
};

window.saveCVData = function(btn) {
    if (!window.myProfileInfo) return;
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...'; }
    
    const cvData = {
        role: document.getElementById('cv-edit-role').value.trim(),
        profession: document.getElementById('cv-edit-prof').value.trim(),
        languages: document.getElementById('cv-edit-lang').value.trim(),
        about: document.getElementById('cv-edit-about').value.trim(),
        skills: document.getElementById('cv-edit-skills').value.trim()
    };
    
    const phoneData = document.getElementById('cv-edit-phone').value.trim();
    const emailData = document.getElementById('cv-edit-email').value.trim();
    
    if (window.firebase) {
        const updates = {};
        updates['users/' + window.myProfileInfo.id + '/cv'] = cvData;
        updates['users/' + window.myProfileInfo.id + '/phone'] = phoneData;
        updates['users/' + window.myProfileInfo.id + '/email'] = emailData;

        firebase.database().ref().update(updates)
        .then(() => {
            window.myProfileInfo.cv = cvData;
            window.myProfileInfo.phone = phoneData;
            window.myProfileInfo.email = emailData;
            document.getElementById('edit-cv-modal').remove();
            if(typeof window.renderProfessionSection === 'function') window.renderProfessionSection(window.appUsers);
        })
        .catch(e => {
            alert("Error saving CV: " + e.message);
            if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-save"></i> Save CV'; }
        });
    }
};
