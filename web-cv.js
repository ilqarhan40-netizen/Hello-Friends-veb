// ==========================================
// ФАЙЛ: web-cv.js 
// АНКЕТА CV (С умным телефоном и email, без морей/населения)
// ==========================================

window.openEditCVModal = function() {
    if (!window.myProfileInfo) return alert("Пожалуйста, авторизуйтесь!");
    const user = window.myProfileInfo;
    const cv = user.cv || {};
    
    // Умный префикс: определяем код страны по флагу, если номер еще не заполнен
    let phoneVal = user.phone || "";
    if (!phoneVal && user.flagCode) {
        const prefixes = { 'az': '+994', 'ru': '+7', 'de': '+49', 'it': '+39', 'gb': '+44', 'en': '+44', 'tr': '+90', 'es': '+34', 'fr': '+33' };
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
        <div class="bg-white dark:bg-slate-800 w-full max-w-lg rounded-[2rem] shadow-2xl p-6 md:p-8 relative" onclick="event.stopPropagation()">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Professional CV</h3>
            
            <div class="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <div>
                    <label class="block text-xs font-bold text-indigo-500 uppercase mb-1">Role / Title</label>
                    <input type="text" id="cv-edit-role" value="${cv.role || ''}" placeholder="e.g. CEO & Founder" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500">
                </div>
                
                <div>
                    <label class="block text-xs font-bold text-indigo-500 uppercase mb-1">Profession</label>
                    <input type="text" id="cv-edit-prof" value="${cv.profession || ''}" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500">
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-indigo-900/10 p-4 rounded-xl border border-indigo-500/20">
                    <div>
                        <label class="block text-[10px] font-bold text-indigo-500 uppercase mb-1">Work Phone (Auto Prefix)</label>
                        <input type="text" id="cv-edit-phone" value="${phoneVal}" class="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500">
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-indigo-500 uppercase mb-1">Work Email</label>
                        <input type="email" id="cv-edit-email" value="${user.email || ''}" class="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500">
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-bold text-indigo-500 uppercase mb-1">Languages (Work)</label>
                    <input type="text" id="cv-edit-lang" value="${cv.languages || user.profileLangs || ''}" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500">
                </div>
                
                <div>
                    <label class="block text-xs font-bold text-indigo-500 uppercase mb-1">Work Skills</label>
                    <input type="text" id="cv-edit-skills" value="${cv.skills || ''}" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500">
                </div>

                <div>
                    <label class="block text-xs font-bold text-indigo-500 uppercase mb-1">About Profession</label>
                    <textarea id="cv-edit-about" rows="3" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-white outline-none resize-none focus:border-indigo-500">${cv.about || ''}</textarea>
                </div>
            </div>
            
            <div class="mt-6 flex justify-end gap-3">
                <button onclick="document.getElementById('edit-cv-modal').remove()" class="px-5 py-3 rounded-xl font-bold text-gray-400 hover:bg-slate-700 transition-colors">Cancel</button>
                <button onclick="saveCVData(this)" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-colors flex items-center gap-2"><i class="fa-solid fa-save"></i> Save CV</button>
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
