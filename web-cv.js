// --- АНКЕТА CV (Phone Auto-prefix & Email Sync) ---
window.openEditCVModal = function() {
    if (!window.myProfileInfo) return;
    const user = window.myProfileInfo;
    const cv = user.cv || {};
    
    let phoneVal = user.phone || "";
    if (!phoneVal && user.flagCode) {
        const prefixes = { 'az': '+994', 'ru': '+7', 'de': '+49', 'it': '+39', 'gb': '+44', 'tr': '+90', 'es': '+34', 'fr': '+33' };
        phoneVal = prefixes[user.flagCode] || '+';
    }
    
    let modal = document.getElementById('edit-cv-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'edit-cv-modal';
        modal.className = 'fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[10000] flex justify-center items-center p-4';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="bg-white dark:bg-slate-800 w-full max-w-lg rounded-[2rem] shadow-2xl p-6 relative" onclick="event.stopPropagation()">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Professional CV</h3>
            <div class="space-y-4">
                <div>
                    <label class="block text-xs font-bold text-indigo-500 uppercase mb-1">Work Phone (SMS/Call)</label>
                    <input type="text" id="cv-edit-phone" value="${phoneVal}" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500">
                </div>
                <div>
                    <label class="block text-xs font-bold text-indigo-500 uppercase mb-1">Work Email</label>
                    <input type="email" id="cv-edit-email" value="${user.email || ''}" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500">
                </div>
                <div>
                    <label class="block text-xs font-bold text-indigo-500 uppercase mb-1">Role</label>
                    <input type="text" id="cv-edit-role" value="${cv.role || ''}" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500">
                </div>
            </div>
            <div class="mt-6 flex justify-end gap-3">
                <button onclick="document.getElementById('edit-cv-modal').remove()" class="px-5 py-3 rounded-xl font-bold text-gray-400">Cancel</button>
                <button onclick="saveCVData(this)" class="bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl shadow-md flex items-center gap-2"><i class="fa-solid fa-save"></i> Save CV</button>
            </div>
        </div>
    `;
};

window.saveCVData = function(btn) {
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...'; }
    const cvData = { role: document.getElementById('cv-edit-role').value.trim() };
    const phoneData = document.getElementById('cv-edit-phone').value.trim();
    const emailData = document.getElementById('cv-edit-email').value.trim();
    
    const updates = {};
    updates['users/' + window.myProfileInfo.id + '/cv'] = cvData;
    updates['users/' + window.myProfileInfo.id + '/phone'] = phoneData;
    updates['users/' + window.myProfileInfo.id + '/email'] = emailData;

    firebase.database().ref().update(updates).then(() => {
        window.myProfileInfo.phone = phoneData;
        window.myProfileInfo.email = emailData;
        document.getElementById('edit-cv-modal').remove();
    });
};
