// ==========================================
// АВТОНОМНАЯ ЗОНА: WEB CV (Строгий дизайн по скринам)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('cv-modals-wrapper')) {
        const modalsContainer = document.createElement('div');
        modalsContainer.id = 'cv-modals-wrapper';
        document.body.appendChild(modalsContainer);
    }
});

// 1. Отрисовка сетки карточек CV (Только для ПК)
window.renderProfessionSection = function(usersObj) {
    const cvContainer = document.getElementById('web-profession-list');
    if (!cvContainer) return;

    let html = `<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">`;

    Object.keys(usersObj).forEach(uid => {
        const user = usersObj[uid];
        if (!user.name) return;
        
        const cv = user.cv || {};
        const role = cv.role || 'Professional';
        
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

    html += `</div>`;
    cvContainer.innerHTML = html;
};

// 2. ОТКРЫТИЕ РЕЗЮМЕ (ТОЧНАЯ КОПИЯ 4-ГО СКРИНА БЕЗ МОРЕЙ И НАСЕЛЕНИЯ)
window.openDetailedCV = function(uid) {
    const user = window.appUsers[uid];
    if (!user) return;
    const cv = user.cv || {};
    const wrapper = document.getElementById('cv-modals-wrapper');
    
    let modalContainer = document.getElementById('detailed-cv-modal');
    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'detailed-cv-modal';
        modalContainer.className = 'fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[10000] flex justify-center items-center p-4 transition-opacity';
        wrapper.appendChild(modalContainer);
    }

    modalContainer.innerHTML = `
        <div class="bg-white dark:bg-[#1e293b] w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden relative border border-gray-200 dark:border-slate-700 animate-fade-in" onclick="event.stopPropagation()">
            
            <!-- Шапка: Аватар, Имя, Бейдж Pro -->
            <div class="p-8 pb-6 border-b border-gray-100 dark:border-slate-700/50 flex items-center gap-6">
                <div class="w-24 h-24 md:w-28 md:h-28 rounded-full bg-blue-50 dark:bg-slate-800 flex items-center justify-center border-4 border-white dark:border-slate-700 shadow-sm shrink-0">
                    <img src="${user.photo || 'https://ui-avatars.com/api/?name=U'}" class="w-full h-full rounded-full object-cover">
                </div>
                <div class="flex flex-col">
                    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        ${user.name.split(' ')[0]} 
                        <span class="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] md:text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">Pro</span>
                    </h2>
                    <p class="text-blue-600 dark:text-blue-400 font-medium text-base md:text-lg mt-1">${cv.role || 'Professional'}</p>
                </div>
            </div>

            <!-- Сетка информации: Профессия, Языки, Страна, Телефон -->
            <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                <div>
                    <p class="text-gray-400 dark:text-gray-500 text-xs font-bold mb-1.5 flex items-center gap-2"><i class="fa-solid fa-briefcase text-indigo-400"></i> Profession</p>
                    <p class="text-gray-800 dark:text-gray-200 font-semibold">${cv.profession || '-'}</p>
                </div>
                <div>
                    <p class="text-gray-400 dark:text-gray-500 text-xs font-bold mb-1.5 flex items-center gap-2"><i class="fa-solid fa-language text-indigo-400"></i> Languages</p>
                    <p class="text-gray-800 dark:text-gray-200 font-semibold">${cv.languages || user.profileLangs || '-'}</p>
                </div>
                <div>
                    <p class="text-gray-400 dark:text-gray-500 text-xs font-bold mb-1.5 flex items-center gap-2"><i class="fa-solid fa-globe text-indigo-400"></i> Country</p>
                    <p class="text-gray-800 dark:text-gray-200 font-semibold flex items-center gap-2">
                        <img src="https://flagcdn.com/w20/${user.flagCode || 'az'}.png" class="h-3.5 rounded-sm shadow-sm"> ${user.country || 'Global'}
                    </p>
                </div>
                <div>
                    <p class="text-gray-400 dark:text-gray-500 text-xs font-bold mb-1.5 flex items-center gap-2"><i class="fa-solid fa-phone text-indigo-400"></i> Phone</p>
                    <p class="text-gray-800 dark:text-gray-200 font-semibold">${user.phone || 'Not Specified'}</p>
                </div>
                
                ${cv.experience ? `
                <div>
                    <p class="text-gray-400 dark:text-gray-500 text-xs font-bold mb-1.5 flex items-center gap-2"><i class="fa-solid fa-clock-rotate-left text-indigo-400"></i> Experience</p>
                    <p class="text-gray-800 dark:text-gray-200 font-semibold">${cv.experience}</p>
                </div>` : ''}
                
                ${cv.education ? `
                <div>
                    <p class="text-gray-400 dark:text-gray-500 text-xs font-bold mb-1.5 flex items-center gap-2"><i class="fa-solid fa-graduation-cap text-indigo-400"></i> Education</p>
                    <p class="text-gray-800 dark:text-gray-200 font-semibold">${cv.education}</p>
                </div>` : ''}
            </div>

            <!-- Дополнительная информация (Скиллы и О себе) -->
            <div class="px-8 pb-2 space-y-5">
                ${cv.skills ? `
                <div>
                    <p class="text-gray-400 dark:text-gray-500 text-[10px] font-bold mb-2 uppercase tracking-wider">Core Competencies</p>
                    <p class="text-gray-800 dark:text-gray-200 text-sm leading-relaxed bg-gray-50 dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-700/50">${cv.skills}</p>
                </div>` : ''}
                ${cv.about ? `
                <div>
                    <p class="text-gray-400 dark:text-gray-500 text-[10px] font-bold mb-2 uppercase tracking-wider">Professional Summary</p>
                    <p class="text-gray-800 dark:text-gray-200 text-sm leading-relaxed bg-gray-50 dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-700/50">${cv.about}</p>
                </div>` : ''}
            </div>

            <!-- Кнопки связи (Цвета как на 4-м скрине) -->
            <div class="p-8 flex gap-3 md:gap-4 flex-wrap">
                <button onclick="actionPrivateChatFromCV('${uid}')" class="flex-1 min-w-[100px] px-4 py-3 bg-[#4285F4] hover:bg-blue-600 text-white font-bold rounded-xl shadow-md transition-all flex justify-center items-center gap-2 text-sm"><i class="fa-solid fa-comment"></i> Chat</button>
                <button onclick="actionSMSFromCV('${uid}')" class="flex-1 min-w-[100px] px-4 py-3 bg-[#34A853] hover:bg-green-600 text-white font-bold rounded-xl shadow-md transition-all flex justify-center items-center gap-2 text-sm"><i class="fa-solid fa-comment-sms"></i> SMS</button>
                <button onclick="actionEmailFromCV('${uid}')" class="flex-1 min-w-[100px] px-4 py-3 bg-[#8b5cf6] hover:bg-purple-600 text-white font-bold rounded-xl shadow-md transition-all flex justify-center items-center gap-2 text-sm"><i class="fa-solid fa-envelope"></i> Email</button>
            </div>
            
            <button onclick="document.getElementById('detailed-cv-modal').remove()" class="absolute top-6 right-6 text-gray-400 hover:text-red-500 text-2xl transition-colors"><i class="fa-solid fa-xmark"></i></button>
        </div>
    `;
};

// 3. ФОРМА РЕДАКТИРОВАНИЯ (УМНАЯ ЛОГИКА СТРАН + МУЛЬТИЯЗЫЧНОСТЬ)
window.openEditCVModal = function() {
    if (!window.myProfileInfo) return alert("Пожалуйста, авторизуйтесь!");
    
    const user = window.myProfileInfo;
    const cv = user.cv || {};
    const wrapper = document.getElementById('cv-modals-wrapper');

    // База стран для выпадающего списка
    const countries = [
        { code: 'az', flag: '🇦🇿', name: 'Azerbaijan', dial: '+994' },
        { code: 'ru', flag: '🇷🇺', name: 'Russia', dial: '+7' },
        { code: 'de', flag: '🇩🇪', name: 'Germany', dial: '+49' },
        { code: 'it', flag: '🇮🇹', name: 'Italy', dial: '+39' },
        { code: 'gb', flag: '🇬🇧', name: 'United Kingdom', dial: '+44' },
        { code: 'tr', flag: '🇹🇷', name: 'Turkey', dial: '+90' },
        { code: 'es', flag: '🇪🇸', name: 'Spain', dial: '+34' },
        { code: 'fr', flag: '🇫🇷', name: 'France', dial: '+33' },
        { code: 'ae', flag: '🇦🇪', name: 'UAE', dial: '+971' },
        { code: 'cn', flag: '🇨🇳', name: 'China', dial: '+86' },
        { code: 'jp', flag: '🇯🇵', name: 'Japan', dial: '+81' },
        { code: 'us', flag: '🇺🇸', name: 'USA', dial: '+1' }
    ];

    let currentCode = user.flagCode || 'az';
    let optionsHtml = countries.map(c => 
        `<option value="${c.code}" data-dial="${c.dial}" data-flag="${c.flag}" ${currentCode === c.code ? 'selected' : ''}>${c.flag} ${c.name}</option>`
    ).join('');

    let modalContainer = document.getElementById('edit-cv-modal');
    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'edit-cv-modal';
        modalContainer.className = 'fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[10000] flex justify-center items-center p-4 overflow-y-auto';
        wrapper.appendChild(modalContainer);
    }

    modalContainer.innerHTML = `
        <div class="bg-white dark:bg-[#1e293b] w-full max-w-2xl rounded-3xl shadow-2xl p-6 md:p-8 my-auto border border-gray-200 dark:border-slate-700 relative animate-fade-in">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <i class="fa-solid fa-user-pen text-indigo-500"></i> <span data-i18n="cv_edit_title">Edit CV & Contacts</span>
                </h3>
                <button onclick="document.getElementById('edit-cv-modal').remove()" class="text-gray-400 hover:text-red-500 text-2xl transition">&times;</button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <!-- Умная страна -->
                <div>
                    <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1" data-i18n="cv_country">Country</label>
                    <div class="relative">
                        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-xl" id="cv-flag-display">${user.flag || '🌍'}</span>
                        <select id="cv-input-country" onchange="window.updateCVPhonePrefix(this)" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl pl-12 pr-4 py-3 text-gray-900 dark:text-white outline-none focus:border-indigo-500 appearance-none cursor-pointer">
                            ${optionsHtml}
                        </select>
                        <i class="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
                    </div>
                </div>

                <!-- Телефон -->
                <div>
                    <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1" data-i18n="cv_phone">Phone Number</label>
                    <input type="text" id="cv-input-phone" value="${user.phone || ''}" class="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:border-indigo-500 font-medium">
                </div>

                <!-- Email -->
                <div>
                    <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1" data-i18n="cv_email">Email Address</label>
                    <input type="email" id="cv-input-email" value="${user.email || ''}" class="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:border-indigo-500">
                </div>

                <!-- Role -->
                <div>
                    <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1" data-i18n="cv_role">Main Role</label>
                    <input type="text" id="cv-input-role" value="${cv.role || ''}" placeholder="e.g. CEO, Author" class="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:border-indigo-500">
                </div>

                <!-- Profession -->
                <div>
                    <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1" data-i18n="cv_prof">Profession</label>
                    <input type="text" id="cv-input-prof" value="${cv.profession || ''}" placeholder="Design, IT..." class="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:border-indigo-500">
                </div>

                <!-- Languages -->
                <div>
                    <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1" data-i18n="cv_langs">Languages</label>
                    <input type="text" id="cv-input-langs" value="${cv.languages || user.profileLangs || ''}" placeholder="AZ, RU, ENG" class="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:border-indigo-500">
                </div>

                <!-- Experience -->
                <div>
                    <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1" data-i18n="cv_exp">Experience</label>
                    <input type="text" id="cv-input-exp" value="${cv.experience || ''}" placeholder="2000 - 2026" class="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:border-indigo-500">
                </div>

                <!-- Education -->
                <div>
                    <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1" data-i18n="cv_edu">Education</label>
                    <input type="text" id="cv-input-edu" value="${cv.education || ''}" placeholder="IT University" class="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:border-indigo-500">
                </div>
            </div>

            <div class="space-y-5 mb-6">
                <!-- Skills -->
                <div>
                    <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1" data-i18n="cv_skills">Core Competencies</label>
                    <input type="text" id="cv-input-skills" value="${cv.skills || ''}" placeholder="JavaScript, Design..." class="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:border-indigo-500">
                </div>
                
                <!-- About Me -->
                <div>
                    <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1" data-i18n="cv_about">About Me</label>
                    <textarea id="cv-input-about" rows="3" class="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:border-indigo-500 resize-none" placeholder="Professional summary...">${cv.about || ''}</textarea>
                </div>
            </div>

            <button onclick="saveWebCVData(this)" class="w-full bg-[#00C4CC] hover:bg-[#00aeb5] text-white font-bold py-4 rounded-xl shadow-lg transition-colors text-lg uppercase tracking-wider" data-i18n="cv_save_btn">Save CV</button>
        </div>
    `;

    // Запускаем твой глобальный переводчик сразу после генерации окна!
    if (typeof window.applySystemLanguage === 'function') {
        window.applySystemLanguage();
    }
};
// Функция смены префикса телефона при смене страны в форме CV
window.updateCVPhonePrefix = function(selectEl) {
    const selectedOption = selectEl.options[selectEl.selectedIndex];
    const dialCode = selectedOption.getAttribute('data-dial');
    const flagIcon = selectedOption.getAttribute('data-flag');
    
    const phoneInput = document.getElementById('cv-input-phone');
    if (phoneInput) { 
        phoneInput.value = dialCode + " "; 
        phoneInput.focus(); 
    }
    
    const flagDisplay = document.getElementById('cv-flag-display');
    if (flagDisplay) flagDisplay.innerText = flagIcon;
};

// СОХРАНЕНИЕ ВСЕХ ДАННЫХ (и в корень юзера, и в CV)
window.saveWebCVData = function(btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

    const selectEl = document.getElementById('cv-input-country');
    const selectedOption = selectEl.options[selectEl.selectedIndex];

    // Данные для объекта CV
    const cvData = {
        role: document.getElementById('cv-input-role').value.trim(),
        profession: document.getElementById('cv-input-prof').value.trim(),
        languages: document.getElementById('cv-input-langs').value.trim(),
        skills: document.getElementById('cv-input-skills').value.trim(),
        experience: document.getElementById('cv-input-exp').value.trim(),
        education: document.getElementById('cv-input-edu').value.trim(),
        about: document.getElementById('cv-input-about').value.trim()
    };

    // Основные контактные данные
    const phoneVal = document.getElementById('cv-input-phone').value.trim();
    const emailVal = document.getElementById('cv-input-email').value.trim();
    
    const rootData = {
        phone: phoneVal,
        email: emailVal,
        profileLangs: cvData.languages,
        country: selectedOption.text.trim().replace(/^[\uD83C][\uDDE6-\uDDFF][\uD83C][\uDDE6-\uDDFF]\s*/, '').replace('🌍 ', ''),
        flagCode: selectEl.value,
        flag: selectedOption.getAttribute('data-flag'),
        cv: cvData
    };

    if (window.firebase && window.myProfileInfo) {
        firebase.database().ref('users/' + window.myProfileInfo.id).update(rootData).then(() => {
            // Обновляем локальные данные, чтобы не перезагружать страницу
            Object.assign(window.myProfileInfo, rootData);
            document.getElementById('edit-cv-modal').remove();
            
            if (window.appUsers) {
                window.appUsers[window.myProfileInfo.id] = window.myProfileInfo;
                window.renderProfessionSection(window.appUsers);
            }
        }).catch(err => {
            alert("Error saving: " + err.message);
            btn.disabled = false;
            btn.innerText = 'Save CV (Lebenslauf speichern)';
        });
    }
};

// 4. Перехватчики кнопок связи
window.actionPrivateChatFromCV = function(uid) {
    document.getElementById('detailed-cv-modal')?.remove();
    if(typeof window.switchWebChat === 'function') window.switchWebChat(uid);
    document.querySelector('.nav-link[data-target="chat"]')?.click();
};

window.actionSMSFromCV = function(uid) {
    const user = window.appUsers[uid];
    if (user && user.phone) {
        window.location.href = `sms:${user.phone}`;
        document.getElementById('detailed-cv-modal')?.remove();
    } else { alert("Phone number not specified."); }
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
    } else { alert("Email not specified."); }
};
