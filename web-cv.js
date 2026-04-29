// ==========================================
// Файл: web-cv.js
// Назначение: База пользователей, Сетка талантов, Слайдер фото, Профили
// ==========================================

window.profilesData = {
    'me': { name: 'Ilgar (You)', email: 'ilgar@hellofriends.com', phone: '+994 50 123 4567', country: 'Azerbaijan', img: 'https://images.unsplash.com/photo-1557862921-37829c790f19?w=400', flag: 'https://flagcdn.com/w40/az.png', flagEmoji: '🇦🇿', desc: 'Azerbaijan is a country in the South Caucasus region of Eurasia.', prof: 'CEO & Founder', langs: 'Azerbaijani, Russian, English', pop: '~10.1M', seas: 'Caspian Sea', langCode: 'az' },
    'ai': { name: 'Dual AI Co-Pilot', email: 'ai@hellofriends.com', phone: 'API-Driven', country: 'Cloud Server', img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400', flag: 'https://flagcdn.com/w40/un.png', flagEmoji: '🤖', desc: 'Powered by Google Gemini & OpenAI ChatGPT. Ask me anything!', prof: 'Super Intelligence', langs: 'All languages', pop: 'Infinite', seas: 'Data Oceans', langCode: 'en' },
    'klaus': { name: 'Klaus', email: 'klaus@hellofriends.com', phone: '+491761234567', country: 'Germany', img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400', flag: 'https://flagcdn.com/w40/de.png', flagEmoji: '🇩🇪', desc: 'Germany is a country in Central Europe, known for its rich history.', prof: 'Senior Engineer', langs: 'German, English', pop: '~84M', seas: 'Baltic Sea, North Sea', langCode: 'de' },
    'marinella': { name: 'Marinella', email: 'marinella@hellofriends.com', phone: '+393331234567', country: 'Italy', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', flag: 'https://flagcdn.com/w40/it.png', flagEmoji: '🇮🇹', desc: 'Italy is a country in Southern Europe, famous for art and cuisine.', prof: 'Marketing Director', langs: 'Italian, English', pop: '~59M', seas: 'Mediterranean, Adriatic', langCode: 'it' },
    'john': { name: 'John', email: 'john@hellofriends.com', phone: '+447700900077', country: 'United Kingdom', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', flag: 'https://flagcdn.com/w40/gb.png', flagEmoji: '🇬🇧', desc: 'The United Kingdom is an island nation in northwestern Europe.', prof: 'Lead Designer', langs: 'English', pop: '~67M', seas: 'North Sea, Atlantic Ocean', langCode: 'en' }
};

window.generateAvatarSlider = function() {
    const slider = document.getElementById('rhombus-slider');
    if (!slider) return;
    let html = '';
    ['klaus', 'marinella', 'john', 'me'].forEach(id => {
        const p = profilesData[id];
        html += `
            <div class="relative group cursor-pointer shrink-0" onclick="openAvatarActionsModal('${id}')">
                <img src="${p.img}" class="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-lg group-hover:scale-105 transition-transform duration-300">
                <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10 shadow whitespace-nowrap">${p.name.replace(' (You)', '')}</div>
            </div>`;
    });
    slider.innerHTML = html;
};

window.openAvatarActionsModal = function(id) {
    if(typeof window.closeDropdown === 'function') window.closeDropdown();
    const p = profilesData[id];
    if(p) {
        document.getElementById('action-modal-avatar').src = p.img;
        document.getElementById('action-modal-name').innerText = p.name.replace(' (You)', '');
        document.getElementById('action-modal-country').innerText = `${p.flagEmoji} ${p.country}`;
        window.currentActionUserId = id; 
    }
    const modal = document.getElementById('avatar-actions-modal');
    if (modal) { modal.classList.remove('hidden'); modal.classList.add('flex'); setTimeout(() => { modal.classList.remove('opacity-0'); modal.querySelector('div').classList.remove('scale-95'); }, 10); }
};

window.generateProfessionGrid = function() {
    const grid = document.getElementById('web-profession-list');
    if(!grid) return;
    let html = '';
    ['me', 'klaus', 'marinella', 'john'].forEach(id => {
        const p = profilesData[id];
        html += `
            <div class="bg-gray-50 dark:bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
                <div class="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 border-b dark:border-slate-700 pb-6">
                    <img src="${p.img}" class="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-indigo-100 dark:border-slate-700 shadow-md">
                    <div class="text-center md:text-left">
                        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">${p.name.replace(' (You)', '')}</h3>
                        <p class="text-indigo-600 dark:text-indigo-400 font-semibold mb-3">${p.prof}</p>
                        <div class="flex flex-wrap justify-center md:justify-start gap-2"><span class="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-full">Pro</span></div>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-sm">
                    <div class="flex flex-col"><span class="text-gray-500 dark:text-gray-400 font-medium mb-1"><i class="fa-solid fa-briefcase w-5 text-indigo-500"></i> Profession</span><span class="font-semibold text-gray-800 dark:text-gray-200 text-base">${p.prof}</span></div>
                    <div class="flex flex-col"><span class="text-gray-500 dark:text-gray-400 font-medium mb-1"><i class="fa-solid fa-language w-5 text-indigo-500"></i> Languages</span><span class="font-semibold text-gray-800 dark:text-gray-200 text-base">${p.langs}</span></div>
                    <div class="flex flex-col"><span class="text-gray-500 dark:text-gray-400 font-medium mb-1"><i class="fa-solid fa-globe w-5 text-indigo-500"></i> Country</span><span class="font-semibold text-gray-800 dark:text-gray-200 text-base flex items-center gap-2"><img src="${p.flag}" class="h-4 rounded-sm"> ${p.country}</span></div>
                    <div class="flex flex-col"><span class="text-gray-500 dark:text-gray-400 font-medium mb-1"><i class="fa-solid fa-users w-5 text-indigo-500"></i> Population</span><span class="font-semibold text-gray-800 dark:text-gray-200 text-base">${p.pop}</span></div>
                    <div class="flex flex-col"><span class="text-gray-500 dark:text-gray-400 font-medium mb-1"><i class="fa-solid fa-water w-5 text-indigo-500"></i> Seas</span><span class="font-semibold text-gray-800 dark:text-gray-200 text-base">${p.seas}</span></div>
                    <div class="flex flex-col"><span class="text-gray-500 dark:text-gray-400 font-medium mb-1"><i class="fa-solid fa-phone w-5 text-indigo-500"></i> Phone</span><span class="font-semibold text-gray-800 dark:text-gray-200 text-base">${p.phone}</span></div>
                </div>
                <div class="mt-8 border-t dark:border-slate-700 pt-6 flex gap-3 flex-wrap">
                    <button onclick="document.querySelector('.nav-link[data-target=\\'chat\\']').click(); if(typeof switchWebChat === 'function') switchWebChat('${id === 'me' ? 'me' : id}');" class="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-md"><i class="fa-solid fa-comment"></i> Chat</button>
                    <button onclick="window.location.href='sms:${p.phone.replace(/\s+/g, '')}'" class="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors shadow-md"><i class="fa-solid fa-comment-sms"></i> SMS</button>
                    <button onclick="if(typeof openEmailModal === 'function') { openEmailModal(); document.getElementById('email-to-input').value = '${p.email}'; }" class="flex-1 md:flex-none flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"><i class="fa-solid fa-paper-plane"></i> Email</button>
                </div>
            </div>`;
    });
    grid.innerHTML = html;
};

window.openAvatarModal = function(id, mode = 'cv') {
    const p = profilesData[id];
    if(!p) return;
    
    document.getElementById('modal-avatar-img').src = p.img;
    document.getElementById('modal-avatar-name').innerText = p.name.replace(' (You)', '');
    document.getElementById('modal-avatar-country').innerText = p.country;
    document.getElementById('modal-avatar-flag').src = p.flag;
    document.getElementById('modal-avatar-prof').innerText = p.prof;
    document.getElementById('modal-avatar-langs').innerText = p.langs;
    document.getElementById('modal-avatar-pop').innerText = p.pop;
    document.getElementById('modal-avatar-seas').innerText = p.seas;
    document.getElementById('modal-avatar-desc').innerHTML = p.desc;
    
    const actionButtons = document.getElementById('modal-action-buttons');
    const profRow = document.getElementById('modal-prof-row');

    if (mode === 'chat' || id === 'ai') {
        actionButtons.style.display = 'none'; profRow.style.display = 'none'; 
    } else {
        actionButtons.style.display = 'flex'; profRow.style.display = 'flex'; 
        document.getElementById('modal-chat-btn').onclick = () => { window.closeAvatarModal(); document.querySelector('.nav-link[data-target="chat"]').click(); if(typeof switchWebChat === 'function') switchWebChat(id === 'me' ? 'me' : id); };
    }
    
    if(typeof window.closeDropdown === 'function') window.closeDropdown();
    const modal = document.getElementById('avatar-modal');
    if(modal) { modal.classList.remove('hidden'); modal.classList.add('flex'); setTimeout(() => { modal.classList.remove('opacity-0'); modal.querySelector('div').classList.remove('scale-95'); }, 10); }
};

window.closeAvatarModal = function() {
    const modal = document.getElementById('avatar-modal');
    if(modal) { modal.classList.add('opacity-0'); modal.querySelector('div').classList.add('scale-95'); setTimeout(() => { modal.classList.add('hidden'); modal.classList.remove('flex'); }, 300); }
}

window.openActiveChatProfile = function() {
    if(typeof currentRoomId !== 'undefined') {
        if(currentRoomId === 'global') return alert("This is a group chat. Select a specific user from the list above to view their profile.");
        openAvatarModal(currentRoomId, 'chat');
    }
};

document.addEventListener('DOMContentLoaded', () => { generateProfessionGrid(); generateAvatarSlider(); });

window.actionPrivateChat = function() { closeAvatarActionsModal(); document.querySelector('.nav-link[data-target="chat"]')?.click(); if(typeof switchWebChat === 'function' && window.currentActionUserId) switchWebChat(window.currentActionUserId); }
window.actionVoiceRoom = function() { closeAvatarActionsModal(); if(typeof startInAppCall === 'function') startInAppCall(); }
window.actionVideoConf = function() { closeAvatarActionsModal(); if(typeof openConference === 'function') openConference(); }
window.actionSendEmail = function() { closeAvatarActionsModal(); if(typeof openEmailModal === 'function') { openEmailModal(); if(window.currentActionUserId) document.getElementById('email-to-input').value = profilesData[window.currentActionUserId].email; } }
window.actionCellularCall = function() { closeAvatarActionsModal(); if(typeof startExternalCall === 'function') startExternalCall(); }
