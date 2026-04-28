// ==========================================
// 1. ЛОГИКА ОТКРЫТИЯ И СОХРАНЕНИЯ РЕЗЮМЕ
// ==========================================
window.openCvEditModal = function() {
    if (window.closeDropdown) window.closeDropdown();
    
    const p = window.myProfileInfo || {};
    
    // Заполняем поля резюме
    document.getElementById('cv-edit-name').value = p.name || window.myUsername || '';
    document.getElementById('cv-edit-profession').value = p.profession || '';
    document.getElementById('cv-edit-langs').value = p.profileLangs || p.langCode || '';
    document.getElementById('cv-edit-country').value = p.country || '';
    document.getElementById('cv-edit-phone').value = p.phone || '';
    document.getElementById('cv-edit-email').value = p.email || '';
    document.getElementById('cv-edit-competencies').value = p.competencies || '';
    document.getElementById('cv-edit-experience').value = p.experience || '';
    document.getElementById('cv-edit-education').value = p.education || '';
    document.getElementById('cv-edit-about').value = p.desc || '';

    const modal = document.getElementById('cv-edit-modal');
    if(modal) {
        modal.classList.remove('hidden'); modal.classList.add('flex');
        setTimeout(() => { modal.classList.remove('opacity-0'); modal.querySelector('div').classList.remove('scale-95'); }, 10);
    }
};

window.closeCvEditModal = function() {
    const modal = document.getElementById('cv-edit-modal');
    if(modal) {
        modal.classList.add('opacity-0'); modal.querySelector('div').classList.add('scale-95');
        setTimeout(() => { modal.classList.add('hidden'); modal.classList.remove('flex'); }, 300);
    }
};

window.saveCvData = function(e) {
    e.preventDefault();
    const btn = document.getElementById('save-cv-btn');
    const origText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
    
    // Собираем данные ТОЛЬКО из полей резюме
    const newData = {
        name: document.getElementById('cv-edit-name').value.trim(),
        profession: document.getElementById('cv-edit-profession').value.trim(),
        profileLangs: document.getElementById('cv-edit-langs').value.trim(),
        country: document.getElementById('cv-edit-country').value.trim(),
        phone: document.getElementById('cv-edit-phone').value.trim(),
        email: document.getElementById('cv-edit-email').value.trim(),
        competencies: document.getElementById('cv-edit-competencies').value.trim(),
        experience: document.getElementById('cv-edit-experience').value.trim(),
        education: document.getElementById('cv-edit-education').value.trim(),
        desc: document.getElementById('cv-edit-about').value.trim(),
    };

    window.myProfileInfo = { ...window.myProfileInfo, ...newData };
    window.myUsername = window.myProfileInfo.name;
    if (window.profilesData) window.profilesData['me'] = { ...window.myProfileInfo, id: 'me' };

    if (window.db && window.myProfileInfo.id && window.myProfileInfo.id !== 'guest') {
        window.db.ref('users/' + window.myProfileInfo.id).update(newData)
        .then(() => {
            btn.innerHTML = 'Saved!';
            setTimeout(() => { btn.innerHTML = origText; window.closeCvEditModal(); window.generateProfessionGrid(); }, 1000);
        }).catch(err => {
            console.error(err); btn.innerHTML = 'Error';
            setTimeout(() => { btn.innerHTML = origText; }, 2000);
        });
    } else {
        setTimeout(() => { btn.innerHTML = origText; window.closeCvEditModal(); window.generateProfessionGrid(); }, 500);
    }
};

// ==========================================
// 2. ОТРИСОВКА CV В ВЕБ-ДИЗАЙНЕ
// ==========================================
window.generateProfessionGrid = function() {
    const grid = document.getElementById('web-profession-list');
    if(!grid) return;
    let html = '';
    
    const usersToDisplay = [window.profilesData['me'], ...window.participants.filter(p => p.id !== 'ai')];
    
    usersToDisplay.forEach(p => {
        if(!p) return;
        const isMe = p.id === 'me' || p.id === window.myProfileInfo?.id;
        let pName = isMe ? window.myUsername : (p.name || 'User').split(' ')[0];
        
        html += `
            <div class="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm relative">
                
                ${isMe ? `<button onclick="window.openCvEditModal()" class="absolute top-6 right-6 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold py-2 px-4 rounded-lg text-sm transition"><i class="fa-solid fa-pen mr-2"></i>Edit</button>` : ''}

                <div class="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6 pb-6 border-b border-gray-100 dark:border-slate-800">
                    <img src="${p.photo || 'https://ui-avatars.com/api/?name=U'}" class="w-24 h-24 rounded-full object-cover shadow-sm bg-gray-50">
                    <div class="text-center md:text-left mt-2">
                        <h3 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center md:justify-start gap-2">${pName} ${isMe ? '<span class="bg-indigo-100 text-indigo-600 text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">You</span>' : ''}</h3>
                        <p class="text-indigo-500 font-medium mb-1">${p.profession || 'Profession not set'}</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8 text-sm mb-6 pb-6 border-b border-gray-100 dark:border-slate-800">
                    <div class="flex flex-col"><span class="text-gray-400 font-medium mb-1 flex items-center gap-2"><i class="fa-solid fa-briefcase w-4 text-indigo-400"></i> Profession</span><span class="font-semibold text-gray-800 dark:text-gray-200">${p.profession || '-'}</span></div>
                    <div class="flex flex-col"><span class="text-gray-400 font-medium mb-1 flex items-center gap-2"><i class="fa-solid fa-language w-4 text-indigo-400"></i> Languages</span><span class="font-semibold text-gray-800 dark:text-gray-200">${p.profileLangs || p.langCode || '-'}</span></div>
                    <div class="flex flex-col"><span class="text-gray-400 font-medium mb-1 flex items-center gap-2"><i class="fa-solid fa-globe w-4 text-indigo-400"></i> Location</span><span class="font-semibold text-gray-800 dark:text-gray-200">${p.flag || '🌐'} ${p.country || '-'}</span></div>
                    <div class="flex flex-col"><span class="text-gray-400 font-medium mb-1 flex items-center gap-2"><i class="fa-solid fa-phone w-4 text-indigo-400"></i> Phone</span><span class="font-semibold text-gray-800 dark:text-gray-200">${p.phone || '-'}</span></div>
                    ${p.pop ? `<div class="flex flex-col"><span class="text-gray-400 font-medium mb-1 flex items-center gap-2"><i class="fa-solid fa-users w-4 text-indigo-400"></i> Population</span><span class="font-semibold text-gray-800 dark:text-gray-200">${p.pop}</span></div>` : ''}
                    ${p.seas ? `<div class="flex flex-col"><span class="text-gray-400 font-medium mb-1 flex items-center gap-2"><i class="fa-solid fa-water w-4 text-indigo-400"></i> Seas/Oceans</span><span class="font-semibold text-gray-800 dark:text-gray-200">${p.seas}</span></div>` : ''}
                </div>

                <div class="flex flex-col gap-4 text-sm mb-6">
                    ${p.competencies ? `<div class="flex flex-col"><span class="text-gray-400 font-medium mb-1">Core Competencies</span><p class="text-gray-800 dark:text-gray-200 leading-relaxed">${p.competencies}</p></div>` : ''}
                    ${p.experience || p.education ? `
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-100 dark:border-slate-700">
                        ${p.experience ? `<div class="flex flex-col"><span class="text-gray-400 font-medium mb-1 text-xs uppercase tracking-wider">Experience</span><span class="font-semibold text-gray-800 dark:text-gray-200">${p.experience}</span></div>` : ''}
                        ${p.education ? `<div class="flex flex-col"><span class="text-gray-400 font-medium mb-1 text-xs uppercase tracking-wider">Education</span><span class="font-semibold text-gray-800 dark:text-gray-200">${p.education}</span></div>` : ''}
                    </div>` : ''}
                    ${p.desc ? `<div class="flex flex-col"><span class="text-gray-400 font-medium mb-1">About Me</span><p class="text-gray-800 dark:text-gray-200 leading-relaxed">${p.desc}</p></div>` : ''}
                </div>

                <div class="flex gap-3 mt-auto pt-2">
                    ${!isMe ? `<button onclick="document.querySelector('.nav-link[data-target=\\'chat\\']').click(); window.switchWebChat('${p.id}');" class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition shadow-sm"><i class="fa-solid fa-comment mr-2"></i>Chat</button>` : ''}
                    ${!isMe && p.phone ? `<button onclick="window.location.href='sms:${p.phone.replace(/\s+/g, '')}'" class="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition shadow-sm"><i class="fa-solid fa-comment-sms mr-2"></i>SMS</button>` : ''}
                    ${!isMe && p.email ? `<button onclick="window.openEmailModal()" class="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg transition shadow-sm"><i class="fa-solid fa-envelope mr-2"></i>Email</button>` : ''}
                </div>
            </div>`;
    });
    grid.innerHTML = html;
};
