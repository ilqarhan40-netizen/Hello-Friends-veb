// ==========================================
// Файл: web-calls.js
// Назначение: Сетка видеоконференции и голосовые звонки
// ==========================================

window.openConference = function() {
    if(typeof window.closeDropdown === 'function') window.closeDropdown();
    const overlay = document.getElementById('conference-overlay');
    const grid = document.getElementById('conference-grid');
    
    if(overlay) overlay.style.display = 'flex';
    
    if (grid && window.participants) {
        grid.innerHTML = ''; 
        
        let allUsers = [window.myProfileInfo, ...window.participants].filter(Boolean);
        let uniqueUsers = [];
        let seen = new Set();
        
        allUsers.forEach(u => {
            if (u.id && !seen.has(u.id)) {
                seen.add(u.id);
                uniqueUsers.push(u);
            }
        });
        
        // Берем 6 уникальных юзеров
        let activeUsers = uniqueUsers.slice(0, 6);
        
        activeUsers.forEach(user => {
            let flagText = user.flagCode || user.flag || 'un';
            let fCode = flagText.replace(/[^a-zA-Z]/g, '').toLowerCase();
            if(!fCode || fCode.length !== 2) fCode = 'un';
            if(fCode === 'en') fCode = 'gb'; 
            
            let card = document.createElement('div');
            card.className = "user-card relative aspect-video bg-gray-900 rounded-xl overflow-hidden border border-gray-700 shadow-lg";
            
            card.innerHTML = `
                <img src="${user.photo || 'https://ui-avatars.com/api/?name=U'}" class="absolute inset-0 w-full h-full object-cover opacity-80">
                <div class="absolute top-3 left-3 bg-black/60 px-2 py-1 rounded text-white text-xs font-bold">${(user.name || 'User').split(' ')[0]}</div>
                <img src="https://flagcdn.com/w40/${fCode}.png" class="absolute top-3 right-3 w-6 h-auto rounded shadow">
                <div class="absolute bottom-3 left-3 right-3 bg-black/60 rounded h-6 overflow-hidden flex items-center">
                    <span class="inline-block pl-[100%] animate-[scroll-text_12s_linear_infinite] text-[10px] text-white whitespace-nowrap font-mono">Waiting for voice translation...</span>
                </div>
            `;
            grid.appendChild(card);
        });
    }
};

window.openVoiceChat = function() {
    if(typeof window.closeDropdown === 'function') window.closeDropdown();
    const overlay = document.getElementById('voice-overlay');
    if(overlay) overlay.style.display = 'flex';
};

window.closeCalls = function() {
    const confOverlay = document.getElementById('conference-overlay');
    const voiceOverlay = document.getElementById('voice-overlay');
    if(confOverlay) confOverlay.style.display = 'none';
    if(voiceOverlay) voiceOverlay.style.display = 'none';
};
