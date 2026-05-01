// --- 3. ИЗОЛИРОВАННОЕ ПРОФЕССИОНАЛЬНОЕ CV И СМАРТ-КНОПКИ ---

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
        <div class="bg-[#1e293b] w-full max-w-2xl rounded-3xl border border-[#334155] shadow-2xl overflow-hidden relative" onclick="event.stopPropagation()">
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

            <!-- ИНФОРМАЦИЯ: Только Профессия, Языки и Контакты -->
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
            
            <button onclick="window.closeCVModals()" class="absolute top-4 right-4 text-gray-400 hover:text-white bg-black/20 hover:bg-black/40 rounded-full w-8 h-8 flex items-center justify-center transition-colors"><i class="fa-solid fa-times"></i></button>
        </div>
    `;
};

// --- ФУНКЦИИ-ПЕРЕХВАТЧИКИ ДЛЯ КНОПОК CV ---
window.actionPrivateChatFromCV = function(uid) {
    window.closeCVModals();
    if(typeof window.switchWebChat === 'function') window.switchWebChat(uid);
    const chatNavLink = document.querySelector('.nav-link[data-target="chat"]');
    if(chatNavLink) chatNavLink.click();
};

window.actionSMSFromCV = function(uid) {
    const user = window.appUsers[uid];
    if (user && user.phone) {
        window.location.href = `sms:${user.phone}`;
        window.closeCVModals();
    } else {
        alert("Пользователь не указал номер телефона.");
    }
};

window.actionEmailFromCV = function(uid) {
    const user = window.appUsers[uid];
    if (user && user.email) {
        window.closeCVModals();
        if(typeof window.openEmailModal === 'function') window.openEmailModal();
        setTimeout(() => {
            const emailInput = document.getElementById('email-to-input');
            if (emailInput) emailInput.value = user.email;
        }, 100);
    } else {
        alert("Пользователь не указал Email.");
    }
};

// --- РЕДАКТИРОВАНИЕ CV (Убрали Моря и Население) ---
window.openEditCVModal = function() {
    if (!window.myProfileInfo) return alert("Пожалуйста, авторизуйтесь!");
    const cv = window.myProfileInfo.cv || {};
    const wrapper = document.getElementById('cv-modals-wrapper') || document.body;
    
    let modal = document.getElementById('edit-cv-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'edit-cv-modal';
        modal.className = 'fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[10000] flex justify-center items-center p-4';
        wrapper.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl shadow-2xl p-6 relative" onclick="event.stopPropagation()">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Professional CV</h3>
            <div class="space-y-4">
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Role / Title</label>
                    <input type="text" id="cv-edit-role" value="${cv.role || ''}" placeholder="e.g. CEO & Founder" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-2 text-gray-900 dark:text-white outline-none">
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Profession</label>
                    <input type="text" id="cv-edit-prof" value="${cv.profession || ''}" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-2 text-gray-900 dark:text-white outline-none">
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Languages (Work)</label>
                    <input type="text" id="cv-edit-lang" value="${cv.languages || ''}" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-2 text-gray-900 dark:text-white outline-none">
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">About Profession</label>
                    <textarea id="cv-edit-about" rows="3" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-2 text-gray-900 dark:text-white outline-none resize-none">${cv.about || ''}</textarea>
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Work Skills</label>
                    <input type="text" id="cv-edit-skills" value="${cv.skills || ''}" placeholder="e.g. Management, IT, Design" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-2 text-gray-900 dark:text-white outline-none">
                </div>
            </div>
            <div class="mt-6 flex justify-end gap-3">
                <button onclick="window.closeCVModals()" class="px-5 py-2.5 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">Cancel</button>
                <button onclick="saveCVData()" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-colors"><i class="fa-solid fa-save"></i> Save CV</button>
            </div>
        </div>
    `;
};

window.saveCVData = function() {
    const cvData = {
        role: document.getElementById('cv-edit-role').value.trim(),
        profession: document.getElementById('cv-edit-prof').value.trim(),
        languages: document.getElementById('cv-edit-lang').value.trim(),
        about: document.getElementById('cv-edit-about').value.trim(),
        skills: document.getElementById('cv-edit-skills').value.trim()
    };
    
    if (window.firebase) {
        firebase.database().ref('users/' + window.myProfileInfo.id + '/cv').set(cvData)
        .then(() => {
            window.myProfileInfo.cv = cvData;
            window.closeCVModals();
            if(typeof window.renderProfessionSection === 'function') window.renderProfessionSection(window.appUsers);
        })
        .catch(e => alert("Ошибка сохранения CV: " + e.message));
    }
};

window.closeCVModals = function() {
    const detailedModal = document.getElementById('detailed-cv-modal');
    const editModal = document.getElementById('edit-cv-modal');
    if (detailedModal) detailedModal.remove();
    if (editModal) editModal.remove();
};
