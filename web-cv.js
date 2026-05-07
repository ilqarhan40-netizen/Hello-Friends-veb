// ==========================================
// АВТОНОМНАЯ ЗОНА: WEB CV (Строгий дизайн и интеграция модалок)
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
        if (!user.name || uid === 'ai') return;
        
        const cv = user.cv || {};
        const role = cv.role || cv.profession || 'Professional';
        const isMe = window.myProfileInfo && window.myProfileInfo.id === uid;
        
        const btnAction = isMe ? `openEditCVModal()` : `openDetailedCV('${uid}')`;
        const btnText = isMe ? `<i class="fa-solid fa-pen-to-square"></i> <span data-i18n="edit_cv">Edit CV</span>` : `<span data-i18n="view_cv">View CV</span>`;
        const btnClass = isMe ? `bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20` : `bg-gray-50 hover:bg-gray-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-600`;

        html += `
            <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl p-6 flex flex-col items-center relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div onclick="${btnAction}" class="relative w-24 h-24 rounded-full border-4 border-gray-50 dark:border-slate-700 shadow-sm mb-4 cursor-pointer overflow-hidden transform group-hover:scale-105 transition-transform">
                    <img src="${user.photo || 'https://ui-avatars.com/api/?name=U'}" class="w-full h-full object-cover">
                </div>
                <h3 class="font-bold text-gray-900 dark:text-white text-lg text-center w-full truncate">${user.name.split(' ')[0]}</h3>
                <p class="text-xs text-indigo-500 dark:text-indigo-400 mb-5 font-bold uppercase tracking-wide text-center w-full truncate flex items-center justify-center gap-1.5">
                    <img src="https://flagcdn.com/w20/${user.flagCode || 'un'}.png" class="w-3 rounded-sm shadow-sm"> ${role}
                </p>
                <button onclick="${btnAction}" class="w-full font-bold text-xs py-3 rounded-xl transition-colors flex items-center justify-center gap-2 ${btnClass} uppercase tracking-wider cursor-pointer">
                    ${btnText}
                </button>
            </div>
        `;
    });

    html += `</div>`;
    cvContainer.innerHTML = html;
    if(typeof window.applySystemLanguage === 'function') window.applySystemLanguage();
};

// ==========================================
// 2. ОТКРЫТИЕ РЕЗЮМЕ (ДЕТАЛЬНЫЙ ПРОСМОТР - СВЕТЛЫЙ WEB ДИЗАЙН)
// ==========================================
window.openDetailedCV = function(uid) {
    if(typeof window.closeDropdown === 'function') window.closeDropdown();
    const user = window.appUsers ? window.appUsers[uid] : (window.participants ? window.participants.find(u => u.id === uid) : null);
    if (!user) return;
    
    const cv = user.cv || {};
    const wrapper = document.getElementById('cv-modals-wrapper') || document.body;
    let fCode = (user.flagCode || 'un').toLowerCase();

    let modalContainer = document.getElementById('detailed-cv-modal');
    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'detailed-cv-modal';
        modalContainer.className = 'fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[999999] flex justify-center items-center p-4 transition-opacity animate-fade-in pointer-events-auto overflow-y-auto';
        wrapper.appendChild(modalContainer);
        modalContainer.addEventListener('click', (e) => { if (e.target === modalContainer) modalContainer.remove(); });
    }

    modalContainer.innerHTML = `
        <div class="bg-white dark:bg-slate-800 w-full max-w-3xl rounded-[2rem] shadow-2xl relative p-8 md:p-12 border border-gray-100 dark:border-slate-700 pointer-events-auto my-auto" onclick="event.stopPropagation()">
            <button onclick="document.getElementById('detailed-cv-modal').remove()" class="absolute top-6 right-6 text-gray-300 hover:text-red-500 text-3xl cursor-pointer p-2 transition-colors outline-none">&times;</button>
            
            <div class="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10 border-b border-gray-50 dark:border-slate-700/50 pb-10 text-center md:text-left">
                <div class="w-36 h-36 rounded-full border-4 border-white dark:border-slate-700 shadow-lg overflow-hidden shrink-0 bg-gray-50">
                    <img src="${user.photo || 'https://ui-avatars.com/api/?name=U'}" class="w-full h-full object-cover">
                </div>
                <div class="flex flex-col justify-center items-center md:items-start pt-2">
                    <h2 class="text-4xl font-black text-gray-900 dark:text-white tracking-tight">${user.name}</h2>
                    <p class="text-indigo-600 dark:text-indigo-400 font-bold mt-1 uppercase tracking-widest text-sm">${cv.profession || cv.role || 'Professional'}</p>
                    <div class="mt-4 flex items-center gap-2 bg-gray-50 dark:bg-slate-900 px-5 py-2 rounded-full border border-gray-200 dark:border-slate-700 shadow-sm w-fit">
                        <img src="https://flagcdn.com/w20/${fCode}.png" class="w-4 rounded-sm shadow-sm">
                        <span class="text-xs font-black text-gray-600 dark:text-gray-300 uppercase">${user.country || 'Global'}</span>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 mb-10 text-sm">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 shadow-sm border border-blue-100 dark:border-blue-800/30 text-xl"><i class="fa-solid fa-phone"></i></div>
                    <div><p class="text-gray-400 font-black uppercase text-[10px] mb-0.5 tracking-widest" data-i18n="phone">Phone</p><p class="text-gray-900 dark:text-white font-bold text-base">${user.phone || '-'}</p></div>
                </div>
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-500 shadow-sm border border-purple-100 dark:border-purple-800/30 text-xl"><i class="fa-solid fa-envelope"></i></div>
                    <div><p class="text-gray-400 font-black uppercase text-[10px] mb-0.5 tracking-widest" data-i18n="email">Email</p><p class="text-gray-900 dark:text-white font-bold text-base truncate max-w-[200px]">${user.email || '-'}</p></div>
                </div>
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-500 shadow-sm border border-amber-100 dark:border-amber-800/30 text-xl"><i class="fa-solid fa-language"></i></div>
                    <div><p class="text-gray-400 font-black uppercase text-[10px] mb-0.5 tracking-widest" data-i18n="languages">Languages</p><p class="text-gray-900 dark:text-white font-bold text-base">${cv.languages || user.profileLangs || '-'}</p></div>
                </div>
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-500 shadow-sm border border-green-100 dark:border-green-800/30 text-xl"><i class="fa-solid fa-briefcase"></i></div>
                    <div><p class="text-gray-400 font-black uppercase text-[10px] mb-0.5 tracking-widest" data-i18n="experience">Experience</p><p class="text-gray-900 dark:text-white font-bold text-base">${cv.experience || '-'}</p></div>
                </div>
                <div class="flex items-center gap-4 md:col-span-2">
                    <div class="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-500 shadow-sm border border-indigo-100 dark:border-indigo-800/30 text-xl"><i class="fa-solid fa-graduation-cap"></i></div>
                    <div><p class="text-gray-400 font-black uppercase text-[10px] mb-0.5 tracking-widest" data-i18n="education">Education</p><p class="text-gray-900 dark:text-white font-bold text-base">${cv.education || '-'}</p></div>
                </div>
            </div>

            <div class="space-y-6 mb-12 border-t border-gray-50 dark:border-slate-700/50 pt-10">
                <div>
                    <p class="text-indigo-500 font-black uppercase text-[11px] mb-3 tracking-[0.2em] flex items-center gap-2"><i class="fa-solid fa-user-tag"></i> <span data-i18n="about_me">About Professional</span></p>
                    <p class="text-gray-600 dark:text-gray-300 leading-relaxed text-sm font-medium italic">"${cv.about || user.about || '-'}"</p>
                </div>
                ${cv.skills ? `
                <div>
                    <p class="text-indigo-500 font-black uppercase text-[11px] mb-3 tracking-[0.2em] flex items-center gap-2"><i class="fa-solid fa-star"></i> <span data-i18n="skills">Core Competencies</span></p>
                    <p class="text-gray-600 dark:text-gray-300 text-sm font-medium leading-relaxed">${cv.skills}</p>
                </div>` : ''}
            </div>

            <div class="flex gap-4 w-full">
                <button onclick="document.getElementById('detailed-cv-modal').remove(); if(typeof window.actionPrivateChatFromCV === 'function') window.actionPrivateChatFromCV('${uid}')" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition shadow-xl shadow-blue-500/30 cursor-pointer flex items-center justify-center gap-3 uppercase text-xs tracking-widest">
                    <i class="fa-solid fa-message text-base"></i> <span data-i18n="chat">Chat</span>
                </button>
                <button onclick="if('${user.phone}') { document.getElementById('detailed-cv-modal').remove(); window.actionSMSFromCV('${uid}'); } else alert('No phone specified');" class="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-2xl transition shadow-xl shadow-emerald-500/30 cursor-pointer flex items-center justify-center gap-3 uppercase text-xs tracking-widest">
                    <i class="fa-solid fa-comment-sms text-base"></i> <span data-i18n="sms">SMS</span>
                </button>
                <button onclick="if('${user.email}') { document.getElementById('detailed-cv-modal').remove(); window.actionEmailFromCV('${uid}'); } else alert('No email specified');" class="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-black py-4 rounded-2xl transition shadow-xl shadow-indigo-500/30 cursor-pointer flex items-center justify-center gap-3 uppercase text-xs tracking-widest">
                    <i class="fa-solid fa-envelope text-base"></i> <span data-i18n="email_btn">Email</span>
                </button>
            </div>
        </div>
    `;
    if(typeof window.applySystemLanguage === 'function') window.applySystemLanguage();
};

// ==========================================
// 4. ФОРМА РЕДАКТИРОВАНИЯ (ТЁМНО-ЗЕЛЕНАЯ, 12 СТРАН, УМНАЯ ЛОГИКА)
// ==========================================
window.openEditCVModal = function() {
    if (!window.myProfileInfo) return alert("Пожалуйста, авторизуйтесь!");
    
    const user = window.myProfileInfo;
    const cv = user.cv || {};
    const wrapper = document.getElementById('cv-modals-wrapper');

    const countries = [
        { code: 'az', flag: '🇦🇿', name: 'Azerbaijan', dial: '+994' },
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

    let currentCode = user.flagCode || 'az';
    let optionsHtml = countries.map(c => 
        `<option value="${c.code}" data-dial="${c.dial}" data-flag="${c.flag}" ${currentCode === c.code ? 'selected' : ''}>${c.flag} ${c.name}</option>`
    ).join('');

    let modalContainer = document.getElementById('edit-cv-modal');
    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'edit-cv-modal';
        modalContainer.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-[100000] flex justify-center items-center p-4 overflow-y-auto animate-fade-in pointer-events-auto';
        wrapper.appendChild(modalContainer);
    }

    modalContainer.innerHTML = `
        <div class="bg-[#1a2332] w-full max-w-2xl rounded-[2.5rem] p-8 border border-slate-700 relative text-white pointer-events-auto shadow-2xl my-auto" onclick="event.stopPropagation()">
            <button onclick="document.getElementById('edit-cv-modal').remove()" class="absolute top-6 right-6 w-10 h-10 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-full flex items-center justify-center cursor-pointer transition-all border border-red-500/30 shadow-lg outline-none">&times;</button>
            
            <div class="flex flex-col items-center mb-10 text-center">
                <div class="w-24 h-24 rounded-full border-2 border-emerald-400 p-1 mb-4 shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                    <img src="${user.photo || 'https://ui-avatars.com/api/?name=U'}" class="w-full h-full rounded-full object-cover">
                </div>
                <h3 class="text-2xl font-black tracking-tight" data-i18n="edit_pro_cv">Professional CV</h3>
                <p class="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">${user.name}</p>
            </div>

            <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block" data-i18n="profession">Profession</label>
                        <input type="text" id="cv-input-prof" value="${cv.profession || cv.role || ''}" class="w-full bg-[#202b3d] border border-slate-600 rounded-2xl px-5 py-4 outline-none focus:border-emerald-400 text-sm font-bold shadow-inner text-white">
                    </div>
                    <div>
                        <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block" data-i18n="languages">Languages</label>
                        <input type="text" id="cv-input-langs" value="${cv.languages || user.profileLangs || ''}" class="w-full bg-[#202b3d] border border-slate-600 rounded-2xl px-5 py-4 outline-none focus:border-emerald-400 text-sm font-bold shadow-inner text-white">
                    </div>
                </div>

                <div>
                    <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block" data-i18n="cv_country">Country</label>
                    <div class="relative">
                        <select id="cv-input-country" onchange="window.updateCVPhonePrefix(this)" class="w-full bg-[#202b3d] border border-slate-600 rounded-2xl pl-14 pr-5 py-4 outline-none focus:border-emerald-400 text-sm font-bold appearance-none cursor-pointer shadow-inner text-white">
                            ${optionsHtml}
                        </select>
                        <span class="absolute left-5 top-1/2 -translate-y-1/2 text-xl" id="cv-flag-display">${user.flag || '🌍'}</span>
                        <i class="fa-solid fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"></i>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label class="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2 block" data-i18n="phone">Phone Number</label>
                        <input type="text" id="cv-input-phone" value="${user.phone || ''}" class="w-full bg-[#202b3d] border border-slate-600 rounded-2xl px-5 py-4 outline-none focus:border-emerald-400 text-sm font-bold shadow-inner text-white">
                    </div>
                    <div>
                        <label class="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2 block" data-i18n="email">Email Address</label>
                        <input type="email" id="cv-input-email" value="${user.email || ''}" class="w-full bg-[#202b3d] border border-slate-600 rounded-2xl px-5 py-4 outline-none focus:border-emerald-400 text-sm font-bold shadow-inner text-white">
                    </div>
                </div>

                <div class="hidden">
                    <input type="text" id="cv-input-role" value="${cv.role || ''}">
                </div>

                <div>
                    <label class="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2 block" data-i18n="skills">Core Competencies</label>
                    <input type="text" id="cv-input-skills" value="${cv.skills || ''}" class="w-full bg-[#202b3d] border border-slate-600 rounded-2xl px-5 py-4 outline-none focus:border-emerald-400 text-sm font-bold shadow-inner text-white">
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label class="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2 block" data-i18n="experience">Experience</label>
                        <input type="text" id="cv-input-exp" value="${cv.experience || ''}" class="w-full bg-[#202b3d] border border-slate-600 rounded-2xl px-5 py-4 outline-none focus:border-emerald-400 text-sm font-bold shadow-inner text-white">
                    </div>
                    <div>
                        <label class="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2 block" data-i18n="education">Education</label>
                        <input type="text" id="cv-input-edu" value="${cv.education || ''}" class="w-full bg-[#202b3d] border border-slate-600 rounded-2xl px-5 py-4 outline-none focus:border-emerald-400 text-sm font-bold shadow-inner text-white">
                    </div>
                </div>

                <div>
                    <label class="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2 block" data-i18n="about_me">About Me</label>
                    <textarea id="cv-input-about" rows="3" class="w-full bg-[#202b3d] border border-slate-600 rounded-2xl px-5 py-4 outline-none focus:border-emerald-400 resize-none text-sm font-bold shadow-inner text-white">${cv.about || user.about || ''}</textarea>
                </div>
            </div>

            <button onclick="saveWebCVData(this)" class="w-full mt-8 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-black py-5 rounded-[1.5rem] transition shadow-[0_10px_30px_rgba(16,185,129,0.3)] uppercase tracking-widest text-xs cursor-pointer" data-i18n="save_cv">Save CV</button>
        </div>
    `;

    if (typeof window.applySystemLanguage === 'function') window.applySystemLanguage();
};

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

window.saveWebCVData = function(btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

    const selectEl = document.getElementById('cv-input-country');
    const selectedOption = selectEl.options[selectEl.selectedIndex];

    const profVal = document.getElementById('cv-input-prof').value.trim();
    
    const cvData = {
        role: profVal,
        profession: profVal,
        languages: document.getElementById('cv-input-langs').value.trim(),
        skills: document.getElementById('cv-input-skills').value.trim(),
        experience: document.getElementById('cv-input-exp').value.trim(),
        education: document.getElementById('cv-input-edu').value.trim(),
        about: document.getElementById('cv-input-about').value.trim()
    };

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
            Object.assign(window.myProfileInfo, rootData);
            document.getElementById('edit-cv-modal').remove();
            
            if (window.appUsers) {
                window.appUsers[window.myProfileInfo.id] = window.myProfileInfo;
                window.renderProfessionSection(window.appUsers);
            }
        }).catch(err => {
            alert("Error saving: " + err.message);
            btn.disabled = false;
            btn.innerText = 'Save CV';
        });
    } else {
        // Fallback if no firebase
        document.getElementById('edit-cv-modal').remove();
    }
};

// ==========================================
// 5. Обработчики кнопок связи
// ==========================================
window.actionPrivateChatFromCV = function(uid) {
    document.getElementById('detailed-cv-modal')?.remove();
    document.getElementById('combined-avatar-modal')?.remove();
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
        document.getElementById('combined-avatar-modal')?.remove();
        if(typeof window.openEmailModal === 'function') window.openEmailModal();
        setTimeout(() => {
            const emailInput = document.getElementById('email-to-input');
            if (emailInput) emailInput.value = user.email;
        }, 100);
    } else { alert("Email not specified."); }
};

window.actionExternalCall = function(uid) {
    let phoneToCall = null;
    if (uid === 'me' && window.myProfileInfo) phoneToCall = window.myProfileInfo.phone;
    else if (window.appUsers && window.appUsers[uid]) phoneToCall = window.appUsers[uid].phone;
    if (phoneToCall) { window.location.href = `tel:${phoneToCall}`; document.getElementById('combined-avatar-modal')?.remove(); } 
    else { alert("Номер телефона не указан."); }
};

window.actionVoiceRoom = function(uid) { 
    document.getElementById('combined-avatar-modal')?.remove(); 
    if(typeof window.openVoiceChat === 'function') window.openVoiceChat(); 
};

window.actionVideoConf = function(uid) { 
    document.getElementById('combined-avatar-modal')?.remove(); 
    if(typeof window.openConference === 'function') window.openConference(); 
};

window.actionSendEmail = function(uid) { 
    document.getElementById('combined-avatar-modal')?.remove(); 
    const u = window.appUsers ? window.appUsers[uid] : null;
    if(u && u.email) {
        if(typeof window.openEmailModal === 'function') window.openEmailModal();
        setTimeout(() => { const el = document.getElementById('email-to-input'); if(el) el.value = u.email; }, 100);
    } else {
        alert("Email не указан.");
    }
};
