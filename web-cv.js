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
        <div class="bg-white dark:bg-slate-800 w-full max-w-3xl rounded-3xl shadow-2xl relative p-8 md:p-10 border border-gray-100 dark:border-slate-700 pointer-events-auto my-auto" onclick="event.stopPropagation()">
            <button onclick="document.getElementById('detailed-cv-modal').remove()" class="absolute top-6 right-6 text-gray-400 hover:text-red-500 text-3xl cursor-pointer p-2 transition-colors outline-none">&times;</button>
            
            <div class="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8 border-b border-gray-100 dark:border-slate-700 pb-8 text-center md:text-left">
                <div class="w-32 h-32 rounded-full border-4 border-white dark:border-slate-700 shadow-md overflow-hidden shrink-0 bg-gray-50">
                    <img src="${user.photo || 'https://ui-avatars.com/api/?name=U'}" class="w-full h-full object-cover">
                </div>
                <div class="flex flex-col justify-center items-center md:items-start pt-2">
                    <h2 class="text-4xl font-bold text-gray-900 dark:text-white">${user.name}</h2>
                    <p class="text-indigo-600 dark:text-indigo-400 text-lg font-bold mt-1 uppercase tracking-widest">${cv.profession || cv.role || 'Professional'}</p>
                    <div class="mt-4 flex items-center gap-2 bg-gray-50 dark:bg-slate-900 px-4 py-1.5 rounded-full border border-gray-200 dark:border-slate-700 w-fit shadow-sm">
                        <img src="https://flagcdn.com/w20/${fCode}.png" class="w-4 rounded-sm shadow-sm">
                        <span class="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase">${user.country || 'Global'}</span>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 mb-10 text-sm">
                <div class="flex items-center gap-4">
                    <div class="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 shadow-sm border border-blue-100 dark:border-blue-800/30 text-lg"><i class="fa-solid fa-phone"></i></div>
                    <div><p class="text-gray-400 font-bold uppercase text-[10px] mb-0.5 tracking-widest" data-i18n="phone">Phone</p><p class="text-gray-900 dark:text-white font-bold text-base">${user.phone || '-'}</p></div>
                </div>
                <div class="flex items-center gap-4">
                    <div class="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-500 shadow-sm border border-purple-100 dark:border-purple-800/30 text-lg"><i class="fa-solid fa-envelope"></i></div>
                    <div><p class="text-gray-400 font-bold uppercase text-[10px] mb-0.5 tracking-widest" data-i18n="email">Email</p><p class="text-gray-900 dark:text-white font-bold text-base truncate max-w-[200px]">${user.email || '-'}</p></div>
                </div>
                <div class="flex items-center gap-4">
                    <div class="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-500 shadow-sm border border-amber-100 dark:border-amber-800/30 text-lg"><i class="fa-solid fa-language"></i></div>
                    <div><p class="text-gray-400 font-bold uppercase text-[10px] mb-0.5 tracking-widest" data-i18n="languages">Languages</p><p class="text-gray-900 dark:text-white font-bold text-base">${cv.languages || user.profileLangs || '-'}</p></div>
                </div>
                <div class="flex items-center gap-4">
                    <div class="w-11 h-11 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-500 shadow-sm border border-green-100 dark:border-green-800/30 text-lg"><i class="fa-solid fa-briefcase"></i></div>
                    <div><p class="text-gray-400 font-bold uppercase text-[10px] mb-0.5 tracking-widest" data-i18n="experience">Experience</p><p class="text-gray-900 dark:text-white font-bold text-base">${cv.experience || '-'}</p></div>
                </div>
                <div class="flex items-center gap-4 md:col-span-2">
                    <div class="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-500 shadow-sm border border-indigo-100 dark:border-indigo-800/30 text-lg"><i class="fa-solid fa-graduation-cap"></i></div>
                    <div><p class="text-gray-400 font-bold uppercase text-[10px] mb-0.5 tracking-widest" data-i18n="education">Education</p><p class="text-gray-900 dark:text-white font-bold text-base">${cv.education || '-'}</p></div>
                </div>
            </div>

            <div class="space-y-6 mb-10 border-t border-gray-100 dark:border-slate-700 pt-8">
                <div>
                    <p class="text-indigo-500 font-black uppercase text-[11px] mb-3 tracking-widest flex items-center gap-2"><i class="fa-solid fa-user-tag"></i> <span data-i18n="about_me">About Professional</span></p>
                    <p class="text-gray-600 dark:text-gray-300 leading-relaxed text-sm italic">"${cv.about || user.about || 'No description provided.'}"</p>
                </div>
                ${cv.skills ? `
                <div>
                    <p class="text-indigo-500 font-black uppercase text-[11px] mb-3 tracking-widest flex items-center gap-2"><i class="fa-solid fa-star"></i> <span data-i18n="skills">Core Skills</span></p>
                    <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">${cv.skills}</p>
                </div>` : ''}
            </div>

            <div class="flex gap-3 w-full">
                <button onclick="document.getElementById('detailed-cv-modal').remove(); if(typeof window.actionPrivateChatFromCV === 'function') window.actionPrivateChatFromCV('${uid}')" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition shadow-lg shadow-blue-500/20 cursor-pointer flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                    <i class="fa-solid fa-message text-base"></i> <span data-i18n="chat">Chat</span>
                </button>
                <button onclick="if('${user.phone}') { document.getElementById('detailed-cv-modal').remove(); window.location.href='sms:${user.phone}'; } else alert('No phone specified');" class="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl transition shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                    <i class="fa-solid fa-comment-sms text-base"></i> <span data-i18n="sms">SMS</span>
                </button>
                <button onclick="if('${user.email}') { document.getElementById('detailed-cv-modal').remove(); window.location.href='mailto:${user.email}'; } else alert('No email specified');" class="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 rounded-2xl transition shadow-lg shadow-indigo-500/20 cursor-pointer flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                    <i class="fa-solid fa-envelope text-base"></i> <span data-i18n="email_btn">Email</span>
                </button>
            </div>
        </div>
    `;
    if(typeof window.applySystemLanguage === 'function') window.applySystemLanguage();
};

// ==========================================
// 3. СДВОЕННАЯ МОДАЛКА АВАТАРА (СЕТКА НА 5 КНОПОК)
// ==========================================
window.openAvatarModal = function(uid) {
    if(typeof window.closeDropdown === 'function') window.closeDropdown();
    const user = window.appUsers ? window.appUsers[uid] : null;
    let uData = user;
    
    if (uid === 'ai') uData = { id: 'ai', name: 'AI Assistant', photo: './ai-avatar.jpg', flagCode: 'gb', country: 'Digital World', profileLangs: 'All', population: 'Infinite', seas: 'Data Lake', cv: { role: 'AI Bot', about: 'I am your intelligent assistant.' } };
    if (uid === 'me' && window.myProfileInfo) uData = window.myProfileInfo;
    
    if (!uData) return;
    const cv = uData.cv || {};
    
    let flagText = uData.flagCode || uData.flag || 'un';
    let fCode = flagText.replace(/[^a-zA-Z]/g, '').toLowerCase();
    if(!fCode || fCode.length !== 2) fCode = 'un';
    if(fCode === 'en') fCode = 'gb';

    const smartInfo = typeof window.getCountryFacts === 'function' ? window.getCountryFacts(fCode) : { country: 'Global', location: '-', pop: '-', seas: '-', about: '-' };

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
                    <p class="flex items-center gap-2"><i class="fa-solid fa-globe text-indigo-400 w-4"></i> <b class="text-gray-500" data-i18n="cv_country">Country:</b> <img src="https://flagcdn.com/w20/${fCode}.png" class="w-4 rounded-sm shadow-sm"> ${smartInfo.country}</p>
                    <p class="flex items-center gap-2"><i class="fa-solid fa-map-location-dot text-indigo-400 w-4"></i> <b class="text-gray-500">Location:</b> <span class="truncate">${smartInfo.location}</span></p>
                    <p class="flex items-center gap-2"><i class="fa-solid fa-language text-indigo-400 w-4"></i> <b class="text-gray-500" data-i18n="cv_langs">Languages:</b> <span class="truncate">${uData.profileLangs || cv.languages || 'Not specified'}</span></p>
                    <p class="flex items-center gap-2"><i class="fa-solid fa-users text-indigo-400 w-4"></i> <b class="text-gray-500" data-i18n="prof_pop">Population:</b> ${smartInfo.pop}</p>
                    <p class="flex items-center gap-2"><i class="fa-solid fa-water text-indigo-400 w-4"></i> <b class="text-gray-500" data-i18n="prof_seas">Seas:</b> <span class="truncate">${smartInfo.seas}</span></p>
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

// ==========================================
// 4. ФОРМА РЕДАКТИРОВАНИЯ (УМНАЯ ЛОГИКА СТРАН)
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
                <button onclick="document.getElementById('edit-cv-modal').remove()" class="text-gray-400 hover:text-red-500 text-2xl transition outline-none">&times;</button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
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

                <div>
                    <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1" data-i18n="cv_phone">Phone Number</label>
                    <input type="text" id="cv-input-phone" value="${user.phone || ''}" class="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:border-indigo-500 font-medium">
                </div>

                <div>
                    <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1" data-i18n="cv_email">Email Address</label>
                    <input type="email" id="cv-input-email" value="${user.email || ''}" class="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:border-indigo-500">
                </div>

                <div>
                    <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1" data-i18n="cv_role">Main Role</label>
                    <input type="text" id="cv-input-role" value="${cv.role || ''}" placeholder="e.g. CEO, Author" class="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:border-indigo-500">
                </div>

                <div>
                    <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1" data-i18n="cv_prof">Profession</label>
                    <input type="text" id="cv-input-prof" value="${cv.profession || ''}" placeholder="Design, IT..." class="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:border-indigo-500">
                </div>

                <div>
                    <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1" data-i18n="cv_langs">Languages</label>
                    <input type="text" id="cv-input-langs" value="${cv.languages || user.profileLangs || ''}" placeholder="AZ, RU, ENG" class="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:border-indigo-500">
                </div>

                <div>
                    <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1" data-i18n="cv_exp">Experience</label>
                    <input type="text" id="cv-input-exp" value="${cv.experience || ''}" placeholder="2000 - 2026" class="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:border-indigo-500">
                </div>

                <div>
                    <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1" data-i18n="cv_edu">Education</label>
                    <input type="text" id="cv-input-edu" value="${cv.education || ''}" placeholder="University" class="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:border-indigo-500">
                </div>
            </div>

            <div class="space-y-5 mb-6">
                <div>
                    <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1" data-i18n="cv_skills">Core Competencies</label>
                    <input type="text" id="cv-input-skills" value="${cv.skills || ''}" placeholder="JavaScript, Design..." class="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:border-indigo-500">
                </div>
                
                <div>
                    <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1" data-i18n="cv_about">About Me</label>
                    <textarea id="cv-input-about" rows="3" class="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:border-indigo-500 resize-none" placeholder="Professional summary...">${cv.about || ''}</textarea>
                </div>
            </div>

            <button onclick="saveWebCVData(this)" class="w-full bg-[#00C4CC] hover:bg-[#00aeb5] text-white font-bold py-4 rounded-xl shadow-lg transition-colors text-lg uppercase tracking-wider" data-i18n="cv_save_btn">Save CV</button>
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

    const cvData = {
        role: document.getElementById('cv-input-role').value.trim(),
        profession: document.getElementById('cv-input-prof').value.trim(),
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
