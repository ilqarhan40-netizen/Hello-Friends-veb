// ==========================================
// ФАЙЛ: web-cv.js
// Назначение: Сетка профессий, Адаптивный просмотр CV, Редактирование CV, Модалка Аватара
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('cv-modals-wrapper')) {
        const modalsContainer = document.createElement('div');
        modalsContainer.id = 'cv-modals-wrapper';
        document.body.appendChild(modalsContainer);
    }
});

// ==========================================
// 1. ОТРИСОВКА СЕТКИ (Адаптивный дизайн)
// ==========================================
window.renderProfessionSection = function(usersObj) {
    const cvContainer = document.getElementById('web-profession-list');
    if (!cvContainer) return;

    let html = '';

    Object.keys(usersObj).forEach(uid => {
        const user = usersObj[uid];
        if (!user.name || uid === 'ai') return;
        
        const cv = user.cv || {};
        const role = cv.role || cv.profession || 'Professional';
        const isMe = window.myProfileInfo && window.myProfileInfo.id === uid;
        
        const btnAction = isMe ? `openEditCVModal()` : `openDetailedCV('${uid}')`;
        const btnText = isMe ? `<i class="fa-solid fa-pen-to-square"></i> <span data-i18n="edit_cv">Edit CV</span>` : `<span data-i18n="view_cv">View CV</span>`;
        
        // Стили кнопок (Светлая/Темная тема)
        const btnClass = isMe 
            ? `bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20 dark:bg-[#00faad] dark:hover:bg-[#00df9a] dark:text-gray-900` 
            : `bg-gray-50 hover:bg-gray-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-600`;

        let flagText = user.flagCode || user.flag || 'un';
        let fCode = flagText.replace(/[^a-zA-Z]/g, '').toLowerCase();
        if(!fCode || fCode.length !== 2) fCode = 'un';

        html += `
            <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl p-6 flex flex-col items-center relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div onclick="${btnAction}" class="relative w-24 h-24 rounded-full border-4 border-gray-50 dark:border-slate-700 shadow-sm mb-4 cursor-pointer overflow-hidden transform group-hover:scale-105 transition-transform bg-gray-100 dark:bg-slate-900">
                    <img src="${user.photo || 'https://ui-avatars.com/api/?name=U'}" class="w-full h-full object-cover">
                </div>
                <h3 class="font-bold text-gray-900 dark:text-white text-lg text-center w-full truncate">
                    ${user.name.split(' ')[0]}
                </h3>
                <p class="text-xs text-indigo-500 dark:text-[#00faad] mb-5 font-bold uppercase tracking-wide text-center w-full truncate flex items-center justify-center gap-1.5 pt-1">
                    <img src="https://flagcdn.com/w20/${fCode}.png" class="w-3.5 rounded-sm shadow-sm opacity-90"> ${role}
                </p>
                <button onclick="${btnAction}" class="w-full font-bold text-xs py-3 rounded-xl transition-colors flex items-center justify-center gap-2 ${btnClass} uppercase tracking-wider cursor-pointer mt-auto">
                    ${btnText}
                </button>
            </div>
        `;
    });

    cvContainer.innerHTML = html;
    
    if (typeof window.applySystemLanguage === 'function') {
        window.applySystemLanguage();
    }
};

// ==========================================
// 2. ОТКРЫТИЕ РЕЗЮМЕ (Структура по скрину + Адаптивность)
// ==========================================
window.openDetailedCV = function(uid) {
    if (typeof window.closeDropdown === 'function') window.closeDropdown();
    
    const user = window.appUsers ? window.appUsers[uid] : (window.participants ? window.participants.find(u => u.id === uid) : null);
    if (!user) return;
    
    const cv = user.cv || {};
    const wrapper = document.getElementById('cv-modals-wrapper') || document.body;
    
    let flagText = user.flagCode || user.flag || 'un';
    let fCode = flagText.replace(/[^a-zA-Z]/g, '').toLowerCase();
    if(!fCode || fCode.length !== 2) fCode = 'un';
    if(fCode === 'en') fCode = 'gb';

    const autoFacts = typeof window.getCountryFacts === 'function' ? window.getCountryFacts(fCode) : { country: 'Global', pop: '-', seas: '-', about: '-' };

    let modalContainer = document.getElementById('detailed-cv-modal');
    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'detailed-cv-modal';
        modalContainer.className = 'fixed inset-0 bg-gray-900/60 dark:bg-gray-900/80 backdrop-blur-sm z-[999999] flex justify-center items-center p-4 transition-opacity animate-fade-in pointer-events-auto overflow-y-auto';
        wrapper.appendChild(modalContainer);
        modalContainer.addEventListener('click', (e) => { 
            if (e.target === modalContainer) modalContainer.remove(); 
        });
    }

    modalContainer.innerHTML = `
        <div class="bg-white dark:bg-[#121c25] w-full max-w-3xl rounded-[2.5rem] shadow-2xl relative p-6 md:p-12 border border-gray-200 dark:border-white/10 pointer-events-auto overflow-hidden my-auto animate-fade-in" onclick="event.stopPropagation()">
            
            <button onclick="document.getElementById('detailed-cv-modal').remove()" class="absolute top-4 right-4 md:top-6 md:right-6 text-gray-400 hover:text-red-500 dark:text-red-500 dark:hover:text-white w-10 h-10 bg-gray-100 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500 rounded-full flex items-center justify-center cursor-pointer transition-all outline-none z-50">&times;</button>
            
            <div class="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 mb-8 border-b border-gray-200 dark:border-white/10 pb-8 text-center md:text-left">
                <div class="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-emerald-500 dark:border-[#00faad] p-1 shadow-lg overflow-hidden shrink-0 bg-gray-50 dark:bg-gray-900">
                    <img src="${user.photo || 'https://ui-avatars.com/api/?name=U'}" class="w-full h-full rounded-full object-cover">
                </div>

                <div class="flex flex-col justify-center items-center md:items-start pt-2">
                    <h2 class="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">${user.name}</h2>
                    <p class="text-emerald-600 dark:text-[#00faad] font-bold mt-1 uppercase tracking-widest text-sm">
                        ${cv.profession || cv.role || 'Professional'}
                    </p>
                    
                    <div class="mt-4 flex items-center gap-2 bg-gray-100 dark:bg-white/5 px-5 py-2 rounded-full border border-gray-200 dark:border-white/10 shadow-sm w-fit">
                        <img src="https://flagcdn.com/w20/${fCode}.png" class="w-4 rounded-sm shadow-sm">
                        <span class="text-xs font-black text-gray-600 dark:text-gray-300 uppercase">${user.country || autoFacts.country}</span>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8 text-sm font-medium">
                <div class="flex items-center gap-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 md:p-5 shadow-inner transition-colors hover:bg-gray-100 dark:hover:bg-white/10">
                    <div class="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-[#00faad] shadow-sm border border-teal-200 dark:border-teal-800/30 text-xl shrink-0">
                        <i class="fa-solid fa-phone"></i>
                    </div>
                    <div class="overflow-hidden">
                        <p class="text-gray-500 dark:text-gray-400 font-black uppercase text-[10px] mb-0.5 tracking-widest" data-i18n="cv_phone_header">Business Phone</p>
                        <p class="text-emerald-600 dark:text-[#00faad] text-base font-bold truncate">${user.phone || '-'}</p>
                    </div>
                </div>
                
                <div class="flex items-center gap-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 md:p-5 shadow-inner transition-colors hover:bg-gray-100 dark:hover:bg-white/10">
                    <div class="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 shadow-sm border border-blue-200 dark:border-blue-800/30 text-xl shrink-0">
                        <i class="fa-solid fa-envelope"></i>
                    </div>
                    <div class="overflow-hidden">
                        <p class="text-gray-500 dark:text-gray-400 font-black uppercase text-[10px] mb-0.5 tracking-widest" data-i18n="cv_email_header">Business Email</p>
                        <p class="text-gray-900 dark:text-white text-base font-bold truncate">${user.email || '-'}</p>
                    </div>
                </div>
            </div>

            <div class="space-y-4 md:space-y-6 mb-10 border-t border-gray-200 dark:border-white/10 pt-8">
                <div class="bg-gray-50 dark:bg-white/5 p-4 md:p-5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-inner">
                    <p class="text-indigo-500 dark:text-[#00faad] font-black uppercase text-[11px] mb-3 tracking-[0.2em] flex items-center gap-2">
                        <i class="fa-solid fa-language"></i> <span data-i18n="cv_langs">Languages</span>
                    </p>
                    <p class="text-gray-800 dark:text-gray-300 font-bold leading-relaxed text-sm">
                        ${cv.languages || user.profileLangs || '-'}
                    </p>
                </div>
                
                <div class="bg-gray-50 dark:bg-white/5 p-4 md:p-5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-inner">
                    <p class="text-indigo-500 dark:text-[#00faad] font-black uppercase text-[11px] mb-3 tracking-[0.2em] flex items-center gap-2">
                        <i class="fa-solid fa-briefcase"></i> <span data-i18n="cv_exp">Experience</span>
                    </p>
                    <p class="text-gray-800 dark:text-gray-300 font-bold leading-relaxed text-sm">
                        ${cv.experience || '-'}
                    </p>
                </div>
                
                <div class="bg-gray-50 dark:bg-white/5 p-4 md:p-5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-inner">
                    <p class="text-indigo-500 dark:text-[#00faad] font-black uppercase text-[11px] mb-3 tracking-[0.2em] flex items-center gap-2">
                        <i class="fa-solid fa-graduation-cap"></i> <span data-i18n="cv_edu">Education</span>
                    </p>
                    <p class="text-gray-800 dark:text-gray-300 font-bold leading-relaxed text-sm">
                        ${cv.education || '-'}
                    </p>
                </div>

                <div class="bg-gray-50 dark:bg-white/5 p-4 md:p-5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-inner">
                    <p class="text-indigo-500 dark:text-[#00faad] font-black uppercase text-[11px] mb-3 tracking-[0.2em] flex items-center gap-2">
                        <i class="fa-solid fa-user-tag"></i> <span data-i18n="cv_about">About Me</span>
                    </p>
                    <p class="text-gray-700 dark:text-gray-300 font-medium italic text-sm leading-relaxed">
                        "${cv.about || user.about || autoFacts.about}"
                    </p>
                </div>
            </div>

            <div class="flex gap-3 md:gap-4 w-full mt-auto">
                <button onclick="document.getElementById('detailed-cv-modal').remove(); if(typeof window.switchWebChat === 'function') window.switchWebChat('${uid}'); document.querySelector('.nav-link[data-target=\\'chat\\']')?.click();" class="flex-1 bg-emerald-500 hover:bg-emerald-600 dark:bg-[#00faad] dark:hover:bg-[#00df9a] text-white dark:text-gray-900 font-extrabold py-3.5 md:py-4 rounded-xl md:rounded-2xl transition shadow-lg cursor-pointer flex items-center justify-center gap-2 uppercase text-[10px] md:text-xs tracking-widest group">
                    <i class="fa-solid fa-message text-sm md:text-base group-hover:scale-110 transition pointer-events-none"></i> <span class="pointer-events-none" data-i18n="chat">Chat</span>
                </button>
                <button onclick="if('${user.phone}') { document.getElementById('detailed-cv-modal').remove(); window.actionSMSFromCV('${uid}'); } else alert('No phone specified');" class="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-700 dark:text-gray-300 dark:hover:text-white font-black py-3.5 md:py-4 rounded-xl md:rounded-2xl transition border border-gray-200 dark:border-white/10 cursor-pointer flex items-center justify-center gap-2 uppercase text-[10px] md:text-xs tracking-widest group">
                    <i class="fa-solid fa-comment-sms text-sm md:text-base group-hover:scale-110 transition pointer-events-none"></i> <span class="pointer-events-none" data-i18n="sms">SMS</span>
                </button>
                <button onclick="if('${user.email}') { document.getElementById('detailed-cv-modal').remove(); window.actionEmailFromCV('${uid}'); } else alert('No email specified');" class="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-700 dark:text-gray-300 dark:hover:text-white font-black py-3.5 md:py-4 rounded-xl md:rounded-2xl transition border border-gray-200 dark:border-white/10 cursor-pointer flex items-center justify-center gap-2 uppercase text-[10px] md:text-xs tracking-widest group">
                    <i class="fa-solid fa-envelope text-sm md:text-base group-hover:scale-110 transition pointer-events-none"></i> <span class="pointer-events-none" data-i18n="email_btn">Email</span>
                </button>
            </div>
        </div>
    `;
    
    if (typeof window.applySystemLanguage === 'function') {
        window.applySystemLanguage();
    }
};

// ==========================================
// 3. ФОРМА РЕДАКТИРОВАНИЯ (Адаптивная)
// ==========================================
window.openEditCVModal = function() {
    if (!window.myProfileInfo) return alert("Please authorize first!");
    
    const user = window.myProfileInfo;
    const cv = user.cv || {};
    const wrapper = document.getElementById('cv-modals-wrapper') || document.body;

  const countries = [
        { code: 'az', flag: '🇦🇿', name: 'Azerbaijan', dial: '+994' },
        { code: 'kz', flag: '🇰🇿', name: 'Kazakhstan', dial: '+7' }, // <-- ДОБАВИЛИ КАЗАХСТАН
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
    let optionsHtml = countries.map(c => {
        let selected = currentCode === c.code ? 'selected' : '';
        return `<option value="${c.code}" data-dial="${c.dial}" data-flag="${c.flag}" ${selected}>${c.flag} ${c.name}</option>`;
    }).join('');

    let modalContainer = document.getElementById('edit-cv-modal');
    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'edit-cv-modal';
        modalContainer.className = 'fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[100000] flex justify-center items-center p-4 overflow-y-auto animate-fade-in pointer-events-auto';
        wrapper.appendChild(modalContainer);
    }

    modalContainer.innerHTML = `
        <div class="bg-white dark:bg-[#1a2332] w-full max-w-2xl rounded-[2.5rem] p-8 border border-gray-200 dark:border-slate-700 relative pointer-events-auto shadow-2xl my-auto transition-colors" onclick="event.stopPropagation()">
            <button onclick="document.getElementById('edit-cv-modal').remove()" class="absolute top-6 right-6 w-10 h-10 bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-500 dark:bg-red-500/20 dark:hover:bg-red-500 dark:text-red-500 dark:hover:text-white rounded-full flex items-center justify-center cursor-pointer transition-all border border-transparent dark:border-red-500/30 shadow-sm outline-none">&times;</button>
            
            <div class="flex flex-col items-center mb-10 text-center">
                <div class="w-24 h-24 rounded-full border-2 border-emerald-500 dark:border-emerald-400 p-1 mb-4 shadow-[0_0_20px_rgba(16,185,129,0.2)] dark:shadow-[0_0_20px_rgba(52,211,153,0.3)] bg-gray-50 dark:bg-transparent">
                    <img src="${user.photo || 'https://ui-avatars.com/api/?name=U'}" class="w-full h-full rounded-full object-cover">
                </div>
                <h3 class="text-2xl font-black tracking-tight text-gray-900 dark:text-white" data-i18n="edit_pro_cv">Professional CV</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-widest font-bold">${user.name}</p>
            </div>

            <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block" data-i18n="profession">Profession</label>
                        <input type="text" id="cv-input-prof" value="${cv.profession || cv.role || ''}" class="w-full bg-gray-50 dark:bg-[#202b3d] border border-gray-300 dark:border-slate-600 rounded-2xl px-5 py-4 outline-none focus:border-emerald-500 dark:focus:border-emerald-400 text-sm font-bold shadow-inner text-gray-900 dark:text-white transition-colors">
                    </div>
                    <div>
                        <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block" data-i18n="languages">Languages</label>
                        <input type="text" id="cv-input-langs" value="${cv.languages || user.profileLangs || ''}" class="w-full bg-gray-50 dark:bg-[#202b3d] border border-gray-300 dark:border-slate-600 rounded-2xl px-5 py-4 outline-none focus:border-emerald-500 dark:focus:border-emerald-400 text-sm font-bold shadow-inner text-gray-900 dark:text-white transition-colors">
                    </div>
                </div>

                <div>
                    <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block" data-i18n="cv_country">Country</label>
                    <div class="relative">
                        <select id="cv-input-country" onchange="window.updateCVPhonePrefix(this)" class="w-full bg-gray-50 dark:bg-[#202b3d] border border-gray-300 dark:border-slate-600 rounded-2xl pl-14 pr-5 py-4 outline-none focus:border-emerald-500 dark:focus:border-emerald-400 text-sm font-bold appearance-none cursor-pointer shadow-inner text-gray-900 dark:text-white transition-colors">
                            ${optionsHtml}
                        </select>
                        <span class="absolute left-5 top-1/2 -translate-y-1/2 text-xl" id="cv-flag-display">${user.flag || '🌍'}</span>
                        <i class="fa-solid fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"></i>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label class="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2 block" data-i18n="phone">Phone Number</label>
                        <input type="text" id="cv-input-phone" value="${user.phone || ''}" class="w-full bg-gray-50 dark:bg-[#202b3d] border border-gray-300 dark:border-slate-600 rounded-2xl px-5 py-4 outline-none focus:border-emerald-500 dark:focus:border-emerald-400 text-sm font-bold shadow-inner text-gray-900 dark:text-white transition-colors">
                    </div>
                    <div>
                        <label class="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2 block" data-i18n="email">Email Address</label>
                        <input type="email" id="cv-input-email" value="${user.email || ''}" class="w-full bg-gray-50 dark:bg-[#202b3d] border border-gray-300 dark:border-slate-600 rounded-2xl px-5 py-4 outline-none focus:border-emerald-500 dark:focus:border-emerald-400 text-sm font-bold shadow-inner text-gray-900 dark:text-white transition-colors">
                    </div>
                </div>

                <div>
                    <label class="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2 block" data-i18n="skills">Core Competencies</label>
                    <input type="text" id="cv-input-skills" value="${cv.skills || ''}" class="w-full bg-gray-50 dark:bg-[#202b3d] border border-gray-300 dark:border-slate-600 rounded-2xl px-5 py-4 outline-none focus:border-emerald-500 dark:focus:border-emerald-400 text-sm font-bold shadow-inner text-gray-900 dark:text-white transition-colors">
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label class="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2 block" data-i18n="experience">Experience</label>
                        <input type="text" id="cv-input-exp" value="${cv.experience || ''}" class="w-full bg-gray-50 dark:bg-[#202b3d] border border-gray-300 dark:border-slate-600 rounded-2xl px-5 py-4 outline-none focus:border-emerald-500 dark:focus:border-emerald-400 text-sm font-bold shadow-inner text-gray-900 dark:text-white transition-colors">
                    </div>
                    <div>
                        <label class="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2 block" data-i18n="education">Education</label>
                        <input type="text" id="cv-input-edu" value="${cv.education || ''}" class="w-full bg-gray-50 dark:bg-[#202b3d] border border-gray-300 dark:border-slate-600 rounded-2xl px-5 py-4 outline-none focus:border-emerald-500 dark:focus:border-emerald-400 text-sm font-bold shadow-inner text-gray-900 dark:text-white transition-colors">
                    </div>
                </div>

                <div>
                    <label class="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2 block" data-i18n="about_me">About Me</label>
                    <textarea id="cv-input-about" rows="3" class="w-full bg-gray-50 dark:bg-[#202b3d] border border-gray-300 dark:border-slate-600 rounded-2xl px-5 py-4 outline-none focus:border-emerald-500 dark:focus:border-emerald-400 resize-none text-sm font-bold shadow-inner text-gray-900 dark:text-white transition-colors">${cv.about || user.about || ''}</textarea>
                </div>
            </div>

            <button onclick="saveWebCVData(this)" class="w-full mt-8 bg-emerald-500 hover:bg-emerald-600 dark:bg-[#00faad] dark:hover:bg-[#00df9a] text-white dark:text-slate-900 font-black py-5 rounded-[1.5rem] transition shadow-lg dark:shadow-[0_10px_30px_rgba(0,250,173,0.2)] uppercase tracking-widest text-xs cursor-pointer" data-i18n="save_cv">Save CV</button>
        </div>
    `;

    if (typeof window.applySystemLanguage === 'function') {
        window.applySystemLanguage();
    }
};

// ==========================================
// 4. СДВОЕННАЯ МОДАЛКА АВАТАРА (Адаптивная)
// ==========================================
window.openAvatarModal = function(uid) {
    if (typeof window.closeDropdown === 'function') window.closeDropdown();
    
    const user = window.appUsers ? window.appUsers[uid] : null;
    let uData = user;
    
    if (uid === 'ai') {
        uData = { 
            id: 'ai', name: 'AI Assistant', photo: './ai-avatar.jpg', flagCode: 'gb', country: 'Digital World', profileLangs: 'English', phone: '000-AI-000', email: 'ai@hellofriends.app', cv: { profession: 'AI Bot', about: 'I am your intelligent assistant.' } 
        };
    }
    
    if (uid === 'me' && window.myProfileInfo) {
        uData = window.myProfileInfo;
    }
    
    if (!uData) return;
    
    const cv = uData.cv || {};
    let fCode = (uData.flagCode || uData.flag || 'un').replace(/[^a-zA-Z]/g, '').toLowerCase();
    if (!fCode || fCode.length !== 2) fCode = 'un';

    const smartInfo = typeof window.getCountryFacts === 'function' ? window.getCountryFacts(fCode) : { country: 'Global', pop: '-', seas: '-', about: '-' };
    
    let modalContainer = document.getElementById('combined-avatar-modal');
    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'combined-avatar-modal';
        modalContainer.className = 'fixed inset-0 bg-gray-900/60 dark:bg-gray-900/80 backdrop-blur-sm z-[999999] flex justify-center items-center p-4 transition-opacity animate-fade-in pointer-events-auto';
        document.body.appendChild(modalContainer);
        modalContainer.addEventListener('click', (e) => { 
            if (e.target === modalContainer) modalContainer.remove(); 
        });
    }

    modalContainer.innerHTML = `
        <div class="bg-white dark:bg-[#1e293b] w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden relative flex flex-col md:flex-row pointer-events-auto border border-gray-200 dark:border-slate-700 transition-colors" onclick="event.stopPropagation()">
            <button onclick="document.getElementById('combined-avatar-modal').remove()" class="absolute top-4 right-4 text-gray-400 hover:text-red-500 z-[9999] text-3xl outline-none cursor-pointer p-2">&times;</button>
            
            <div class="w-full md:w-1/2 p-8 bg-gray-50 dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 relative z-10 transition-colors">
                <div class="flex flex-col items-center mb-6">
                    <img src="${uData.photo || 'https://ui-avatars.com/api/?name=U'}" class="w-24 h-24 rounded-full object-cover border-4 border-indigo-500 dark:border-[#00faad] shadow-md mb-4 bg-white dark:bg-transparent">
                    <h3 class="text-2xl font-bold text-gray-900 dark:text-white">${uData.name.replace(' (You)', '')}</h3>
                </div>
                
                <div class="space-y-4 text-sm mt-4 text-gray-800 dark:text-gray-200">
                    <p class="flex items-center gap-2"><i class="fa-solid fa-globe text-indigo-500 dark:text-indigo-400 w-4"></i> <b class="text-gray-500" data-i18n="country">Country:</b> <img src="https://flagcdn.com/w20/${fCode}.png" class="w-4 rounded-sm shadow-sm"> ${smartInfo.country}</p>
                    <p class="flex items-center gap-2"><i class="fa-solid fa-briefcase text-indigo-500 dark:text-indigo-400 w-4"></i> <b class="text-gray-500" data-i18n="profession">Profession:</b> <span class="font-semibold">${cv.profession || cv.role || '-'}</span></p>
                    <p class="flex items-center gap-2"><i class="fa-solid fa-language text-indigo-500 dark:text-indigo-400 w-4"></i> <b class="text-gray-500" data-i18n="languages">Languages:</b> <span class="truncate font-semibold">${uData.profileLangs || cv.languages || '-'}</span></p>
                    <p class="flex items-center gap-2"><i class="fa-solid fa-users text-indigo-500 dark:text-indigo-400 w-4"></i> <b class="text-gray-500" data-i18n="population">Population:</b> <span class="font-semibold">${smartInfo.pop}</span></p>
                    <p class="flex items-center gap-2"><i class="fa-solid fa-water text-indigo-500 dark:text-indigo-400 w-4"></i> <b class="text-gray-500" data-i18n="seas">Seas:</b> <span class="truncate font-semibold">${smartInfo.seas}</span></p>
                </div>
                
                <div class="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <p class="text-xs text-gray-500 mb-1" data-i18n="about_me">About:</p>
                    <p class="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">${cv.about || uData.about || smartInfo.about}</p>
                </div>
            </div>
            
            <div class="w-full md:w-1/2 p-8 flex flex-col justify-center bg-gray-100 dark:bg-[#1e293b] text-gray-900 dark:text-white relative z-10 transition-colors">
                <div class="grid grid-cols-2 gap-3 w-full">
                    <button onclick="document.getElementById('combined-avatar-modal').remove(); if(typeof window.switchWebChat === 'function') { window.switchWebChat('${uid}'); document.querySelector('.nav-link[data-target=\\'chat\\']')?.click(); }" class="flex flex-col items-center justify-center p-3.5 bg-white dark:bg-slate-800 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors border border-gray-200 dark:border-slate-700 shadow-sm cursor-pointer group">
                        <i class="fa-solid fa-message text-xl mb-2 text-indigo-500 group-hover:scale-110 transition pointer-events-none"></i>
                        <span class="text-xs font-bold pointer-events-none" data-i18n="action_chat">Private Chat</span>
                    </button>
                    
                    <button onclick="document.getElementById('combined-avatar-modal').remove(); if(typeof window.actionVoiceRoom === 'function') window.actionVoiceRoom('${uid}');" class="flex flex-col items-center justify-center p-3.5 bg-white dark:bg-slate-800 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors border border-gray-200 dark:border-slate-700 shadow-sm cursor-pointer group">
                        <i class="fa-solid fa-phone text-xl mb-2 text-green-500 group-hover:scale-110 transition pointer-events-none"></i>
                        <span class="text-xs font-bold pointer-events-none" data-i18n="action_voice">Voice Room</span>
                    </button>
                    
                    <button onclick="document.getElementById('combined-avatar-modal').remove(); if(typeof window.actionVideoConf === 'function') window.actionVideoConf('${uid}');" class="flex flex-col items-center justify-center p-3.5 bg-white dark:bg-slate-800 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors border border-gray-200 dark:border-slate-700 shadow-sm cursor-pointer group">
                        <i class="fa-solid fa-video text-xl mb-2 text-blue-500 group-hover:scale-110 transition pointer-events-none"></i>
                        <span class="text-xs font-bold pointer-events-none" data-i18n="action_video">Video Conf</span>
                    </button>
                    
                    <button onclick="document.getElementById('combined-avatar-modal').remove(); if(typeof window.actionSendEmail === 'function') window.actionSendEmail('${uid}');" class="flex flex-col items-center justify-center p-3.5 bg-white dark:bg-slate-800 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors border border-gray-200 dark:border-slate-700 shadow-sm cursor-pointer group">
                        <i class="fa-solid fa-envelope text-xl mb-2 text-red-500 group-hover:scale-110 transition pointer-events-none"></i>
                        <span class="text-xs font-bold pointer-events-none" data-i18n="action_email">Send Email</span>
                    </button>
                    
                    <button onclick="if('${uData.phone}') { document.getElementById('combined-avatar-modal').remove(); window.actionExternalCall('${uid}'); } else alert('No phone number');" class="col-span-2 flex items-center justify-center gap-3 p-4 bg-indigo-600 dark:bg-indigo-500 text-white rounded-2xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors shadow-md mt-1 cursor-pointer group">
                        <i class="fa-solid fa-mobile-screen-button text-lg pointer-events-none group-hover:scale-110 transition"></i>
                        <span class="text-sm font-bold tracking-wide pointer-events-none" data-i18n="action_cellular">Cellular Call</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    if (typeof window.applySystemLanguage === 'function') {
        window.applySystemLanguage(); 
    }
};

// ==========================================
// 5. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ И ОБРАБОТЧИКИ
// ==========================================
window.updateCVPhonePrefix = function(selectEl) {
    const opt = selectEl.options[selectEl.selectedIndex];
    const phoneInput = document.getElementById('cv-input-phone');
    
    if (phoneInput) { 
        phoneInput.value = opt.getAttribute('data-dial') + " "; 
        phoneInput.focus(); 
    }
    
    const flagDisplay = document.getElementById('cv-flag-display');
    if (flagDisplay) {
        flagDisplay.innerText = opt.getAttribute('data-flag');
    }
};

window.saveWebCVData = function(btn) {
    if (!window.firebase || !window.myProfileInfo) return;
    
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

    const rootData = {
        phone: document.getElementById('cv-input-phone').value.trim(),
        email: document.getElementById('cv-input-email').value.trim(),
        profileLangs: cvData.languages,
        country: selectedOption.text.trim().replace(/^[\uD83C][\uDDE6-\uDDFF][\uD83C][\uDDE6-\uDDFF]\s*/, '').replace('🌍 ', ''),
        flagCode: selectEl.value,
        flag: selectedOption.getAttribute('data-flag'),
        cv: cvData
    };

    firebase.database().ref('users/' + window.myProfileInfo.id).update(rootData).then(() => {
        Object.assign(window.myProfileInfo, rootData);
        document.getElementById('edit-cv-modal').remove();
        
        if (window.appUsers) { 
            window.appUsers[window.myProfileInfo.id] = window.myProfileInfo; 
            window.renderProfessionSection(window.appUsers); 
        }
    }).catch(err => { 
        alert("Error: " + err.message); 
        btn.disabled = false; 
        btn.innerHTML = 'Save CV'; 
    });
};

window.actionPrivateChatFromCV = function(uid) {
    document.getElementById('detailed-cv-modal')?.remove();
    if (typeof window.switchWebChat === 'function') window.switchWebChat(uid);
    document.querySelector('.nav-link[data-target="chat"]')?.click();
};

window.actionSMSFromCV = function(uid) {
    const user = window.appUsers ? window.appUsers[uid] : null;
    if (user && user.phone) { 
        window.location.href = `sms:${user.phone}`; 
        document.getElementById('detailed-cv-modal')?.remove(); 
    } else { 
        alert("Phone number not specified."); 
    }
};

window.actionEmailFromCV = function(uid) {
    const user = window.appUsers ? window.appUsers[uid] : null;
    if (user && user.email) {
        document.getElementById('detailed-cv-modal')?.remove();
        if (typeof window.openEmailModal === 'function') window.openEmailModal();
        setTimeout(() => { 
            const el = document.getElementById('email-to-input'); 
            if (el) el.value = user.email; 
        }, 100);
    } else { 
        alert("Email not specified."); 
    }
};

window.actionExternalCall = function(uid) {
    let phoneToCall = null;
    if (uid === 'me' && window.myProfileInfo) {
        phoneToCall = window.myProfileInfo.phone;
    } else if (window.appUsers && window.appUsers[uid]) {
        phoneToCall = window.appUsers[uid].phone;
    }
    
    if (phoneToCall) { 
        window.location.href = `tel:${phoneToCall}`; 
        document.getElementById('combined-avatar-modal')?.remove(); 
    } else { 
        alert("Phone number not specified."); 
    }
};

window.actionVoiceRoom = function(uid) { 
    document.getElementById('combined-avatar-modal')?.remove(); 
    if (typeof window.openVoiceChat === 'function') window.openVoiceChat(); 
};

window.actionVideoConf = function(uid) { 
    document.getElementById('combined-avatar-modal')?.remove(); 
    if (typeof window.openConference === 'function') window.openConference(); 
};

window.actionSendEmail = function(uid) { 
    document.getElementById('combined-avatar-modal')?.remove(); 
    const u = window.appUsers ? window.appUsers[uid] : null;
    if (u && u.email) {
        if (typeof window.openEmailModal === 'function') window.openEmailModal();
        setTimeout(() => { 
            const el = document.getElementById('email-to-input'); 
            if (el) el.value = u.email; 
        }, 100);
    } else {
        alert("Email not specified.");
    }
};
