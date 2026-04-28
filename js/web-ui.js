// ==========================================
// 1. ПАНЕЛИ И МЕНЮ
// ==========================================
window.closeDropdown = function() {
    const menu = document.getElementById('menu-panel');
    const actions = document.getElementById('actions-panel');
    if (menu) { menu.classList.add('opacity-0', 'scale-95'); setTimeout(() => menu.classList.add('hidden'), 200); }
    if (actions) { actions.classList.add('opacity-0', 'scale-95'); setTimeout(() => actions.classList.add('hidden'), 200); }
};

window.togglePanel = function(panelId) {
    const panel = document.getElementById(panelId);
    ['menu-panel', 'actions-panel'].forEach(id => {
        if (id !== panelId) {
            const p = document.getElementById(id);
            if (p) p.classList.add('opacity-0', 'scale-95', 'hidden');
        }
    });
    if (panel.classList.contains('hidden')) {
        panel.classList.remove('hidden');
        setTimeout(() => panel.classList.remove('opacity-0', 'scale-95'), 10);
    } else {
        panel.classList.add('opacity-0', 'scale-95');
        setTimeout(() => panel.classList.add('hidden'), 200);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('header-menu-btn')?.addEventListener('click', (e) => { e.stopPropagation(); window.togglePanel('menu-panel'); });
    document.getElementById('actions-btn')?.addEventListener('click', (e) => { e.stopPropagation(); window.togglePanel('actions-panel'); });
    document.addEventListener('click', () => { window.closeDropdown(); });

    const themeToggleBtn = document.getElementById('menu-theme-toggle');
    const htmlTag = document.documentElement;
    themeToggleBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        htmlTag.classList.toggle('dark');
        const isDark = htmlTag.classList.contains('dark');
        themeToggleBtn.innerHTML = isDark ? '<i class="fa-solid fa-sun w-6 text-yellow-400"></i> Light Theme' : '<i class="fa-solid fa-moon w-6 text-indigo-500"></i> Dark Theme';
    });

    // Навигация
    const navLinks = document.querySelectorAll('.nav-link');
    const pageSections = document.querySelectorAll('.page-section');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-target');
            navLinks.forEach(l => { l.classList.remove('active'); l.classList.add('text-gray-700', 'dark:text-gray-300'); });
            this.classList.add('active'); this.classList.remove('text-gray-700', 'dark:text-gray-300');
            pageSections.forEach(sec => sec.classList.remove('active'));
            const targetSection = document.getElementById(target);
            if (targetSection) targetSection.classList.add('active');
        });
    });
});

// ==========================================
// 2. МОДАЛЬНЫЕ ОКНА И ДЕЙСТВИЯ
// ==========================================
window.triggerImportExport = function() { document.getElementById('import-export-input').click(); window.closeDropdown(); };

window.openLocationModal = function() {
    window.closeDropdown();
    const modal = document.getElementById('location-modal');
    modal.classList.remove('hidden'); modal.classList.add('flex');
    setTimeout(() => { modal.classList.remove('opacity-0'); modal.querySelector('div').classList.remove('scale-95'); }, 10);
    const mapContainer = document.getElementById('location-map');
    mapContainer.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-2xl text-indigo-500 mb-2"></i><span>Detecting location...</span>';
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude; const lon = position.coords.longitude;
                mapContainer.innerHTML = `<iframe width="100%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.01}%2C${lat-0.01}%2C${lon+0.01}%2C${lat+0.01}&amp;layer=mapnik&amp;marker=${lat}%2C${lon}" style="border-radius: 8px;"></iframe>`;
            },
            (error) => { mapContainer.innerHTML = '<span class="text-red-400">Failed to get location. Allow access.</span>'; }
        );
    } else { mapContainer.innerHTML = 'Geolocation is not supported.'; }
};
window.closeLocationModal = function() {
    const modal = document.getElementById('location-modal');
    modal.classList.add('opacity-0'); modal.querySelector('div').classList.add('scale-95');
    setTimeout(() => { modal.classList.add('hidden'); modal.classList.remove('flex'); }, 300);
};

window.openEmailModal = function() {
    window.closeDropdown();
    const modal = document.getElementById('email-modal');
    modal.classList.remove('hidden'); modal.classList.add('flex');
    setTimeout(() => { modal.classList.remove('opacity-0'); modal.querySelector('div').classList.remove('scale-95'); }, 10);
};
window.closeEmailModal = function() {
    const modal = document.getElementById('email-modal');
    modal.classList.add('opacity-0'); modal.querySelector('div').classList.add('scale-95');
    setTimeout(() => { modal.classList.add('hidden'); modal.classList.remove('flex'); }, 300);
};
window.sendEmailForm = function(e) {
    e.preventDefault();
    const to = document.getElementById('email-to-input').value;
    const subject = document.getElementById('email-subject-input').value;
    const msg = document.getElementById('email-message-input').value;
    const archiveList = document.getElementById('archive-list');
    const emptyMsg = document.getElementById('empty-archive-msg');
    if (emptyMsg) emptyMsg.style.display = 'none';

    const emailCard = document.createElement('div');
    emailCard.className = 'p-4 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 shadow-sm mb-3';
    emailCard.innerHTML = `
        <div class="flex justify-between items-center mb-2 border-b dark:border-slate-700 pb-2">
            <span class="font-bold text-indigo-600 dark:text-indigo-400"><i class="fa-solid fa-paper-plane mr-1"></i> To: ${to}</span>
            <span class="text-xs text-gray-500 font-medium">${new Date().toLocaleString()}</span>
        </div>
        <h4 class="font-bold mb-1 text-gray-800 dark:text-gray-200">Subject: ${subject}</h4>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">${msg}</p>
    `;
    archiveList.prepend(emailCard);
    alert('Email sent and saved to Archive!');
    window.closeEmailModal(); e.target.reset(); document.querySelector('.nav-link[data-target="archive"]').click();
};

window.openBankTransferModal = function() {
    window.closeDropdown();
    const recipientSelect = document.getElementById('transfer-recipient');
    if (window.currentRoomId && window.currentRoomId !== 'global' && window.currentRoomId !== 'me' && window.currentRoomId !== 'ai') {
        recipientSelect.value = window.currentRoomId;
    }
    const modal = document.getElementById('transfer-modal');
    modal.classList.remove('hidden'); modal.classList.add('flex');
    setTimeout(() => { modal.classList.remove('opacity-0'); modal.querySelector('div').classList.remove('scale-95'); }, 10);
};
window.closeBankTransferModal = function() {
    const modal = document.getElementById('transfer-modal');
    modal.classList.add('opacity-0'); modal.querySelector('div').classList.add('scale-95');
    setTimeout(() => { modal.classList.add('hidden'); modal.classList.remove('flex'); }, 300);
};
window.sendMoney = function(e) {
    e.preventDefault();
    const amount = document.getElementById('transfer-amount').value;
    const recipientId = document.getElementById('transfer-recipient').value;
    const recipient = window.profilesData ? window.profilesData[recipientId] : null;
    const recipientName = recipient ? recipient.name.replace(' (You)', '').split(' ')[0] : 'User';

    const btn = document.getElementById('submit-transfer-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
    btn.style.opacity = '0.8';
    
    setTimeout(() => {
        btn.innerHTML = originalText; btn.style.opacity = '1';
        window.closeBankTransferModal(); e.target.reset();
        
        const receiptText = `💳 [BANK TRANSFER] <br>Sent: <b>$${amount}</b> to ${recipientName}.<br>Fee applied: <b>$0.01</b>.<br>Status: <span style="color: #4ade80;">Completed ✅</span>`;
        if (window.db && window.currentRoomId) {
            window.db.ref(window.currentRoomId).push({ name: window.myUsername, text: receiptText, sessionId: window.mySessionId, timestamp: firebase.database.ServerValue.TIMESTAMP });
        }

        const archiveList = document.getElementById('archive-list');
        document.getElementById('empty-archive-msg').style.display = 'none';

        const card = document.createElement('div');
        card.className = 'p-4 border border-green-500/50 rounded-lg bg-green-50 dark:bg-green-900/10 shadow-sm relative overflow-hidden mb-3 font-sans';
        card.innerHTML = `
            <div class="absolute top-0 right-0 bg-green-500/20 text-green-600 dark:text-green-400 text-[0.7rem] px-3 py-1 rounded-bl-lg font-bold tracking-wider">SUCCESS</div>
            <div class="flex items-center gap-2 mb-2 border-b border-green-200 dark:border-green-800/50 pb-2">
                <i class="fa-solid fa-money-bill-transfer text-green-600 dark:text-green-400 text-xl"></i>
                <span class="font-bold text-gray-800 dark:text-white text-sm">Transfer to ${recipientName}</span>
            </div>
            <h4 class="font-bold text-3xl text-green-600 dark:text-green-400 mb-1">$${amount} <span class="text-xs text-gray-500 dark:text-gray-400 font-normal">(-$0.01 fee)</span></h4>
            <p class="text-[0.75rem] text-gray-500 dark:text-gray-400">${new Date().toLocaleString()}</p>
        `;
        archiveList.prepend(card);
        alert(`Success! $${amount} sent to ${recipientName} with a $0.01 fee.`);
        document.querySelector('.nav-link[data-target="archive"]').click(); 
    }, 1500); 
};

window.openTrashModal = function() {
    window.closeDropdown();
    const modal = document.getElementById('trash-modal');
    modal.classList.remove('hidden'); modal.classList.add('flex');
    setTimeout(() => { modal.classList.remove('opacity-0'); modal.querySelector('div').classList.remove('scale-95'); }, 10);
};
window.closeTrashModal = function() {
    const modal = document.getElementById('trash-modal');
    modal.classList.add('opacity-0'); modal.querySelector('div').classList.add('scale-95');
    setTimeout(() => { modal.classList.add('hidden'); modal.classList.remove('flex'); }, 300);
};
window.smartAction = function(action, isConf = false) {
    if (action === 'archive') alert('Saved to Archive!');
    if (action === 'clear' || action === 'delete') {
        if (isConf) {
            const spk = document.getElementById('conf-speaker-marquee');
            if(spk) spk.innerHTML = '🇦🇿 Chat Cleared';
            document.querySelectorAll('.conf-listener-marquee').forEach(m => m.innerHTML = m.getAttribute('data-flag') + ' Chat Cleared');
        } else if (window.db && window.currentRoomId) { 
            window.db.ref(window.currentRoomId).remove().then(() => window.clearChatScreen()); 
        }
    }
    window.closeTrashModal();
};

// ==========================================
// 3. ПОИСК И АВТОРИЗАЦИЯ
// ==========================================
window.openSearchModal = function() {
    window.closeDropdown();
    const modal = document.getElementById('search-modal');
    if (modal) {
        modal.classList.remove('hidden'); modal.classList.add('flex');
        setTimeout(() => { modal.classList.remove('opacity-0'); modal.querySelector('div').classList.remove('scale-95'); }, 10);
    }
};
window.closeSearchModal = function() {
    const modal = document.getElementById('search-modal');
    if (modal) {
        modal.classList.add('opacity-0'); modal.querySelector('div').classList.add('scale-95');
        setTimeout(() => { modal.classList.add('hidden'); modal.classList.remove('flex'); window.resetGlobalSearch(); }, 300);
    }
};
window.handleSmartSearch = function(text, type = 'text') {
    const input = document.getElementById('global-search-input');
    if (type === 'text') { input.value = text; window.performLiveSearch(); } 
    else if (type === 'transfer') { window.closeSearchModal(); setTimeout(window.openBankTransferModal, 350); } 
    else if (type === 'email') { window.closeSearchModal(); setTimeout(window.openEmailModal, 350); } 
    else if (type === 'web') { input.value = text; document.getElementById('search-results-area').innerHTML = ''; window.doGoogleSearch(); }
};
window.performLiveSearch = function() {
    const query = document.getElementById('global-search-input').value.toLowerCase().trim();
    const resultsArea = document.getElementById('search-results-area');
    const frame = document.getElementById('search-result-frame');
    const suggestions = document.getElementById('search-suggestions');
    const clearBtn = document.getElementById('clear-search-btn');
    
    if(frame) frame.classList.add('hidden');
    if (query.length === 0) {
        resultsArea.innerHTML = '';
        if(suggestions) suggestions.style.display = 'block';
        if(clearBtn) clearBtn.classList.add('hidden');
        return;
    }
    
    if(clearBtn) clearBtn.classList.remove('hidden');
    if(suggestions) suggestions.style.display = 'none';

    let html = ''; let found = false;
    if(window.profilesData) {
        Object.keys(window.profilesData).forEach(id => {
            const p = window.profilesData[id];
            if (p.name.toLowerCase().includes(query) || (p.profession||'').toLowerCase().includes(query) || (p.country||'').toLowerCase().includes(query)) {
                found = true;
                html += `
                    <div class="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:border-indigo-500 transition-colors shadow-sm mb-2" onclick="window.closeSearchModal(); setTimeout(() => window.openAvatarModal('${id}', 'cv'), 300);">
                        <div class="flex items-center gap-4">
                            <img src="${p.photo||p.img||'https://ui-avatars.com/api/?name=U'}" class="w-12 h-12 rounded-full object-cover border border-gray-300 dark:border-gray-600 bg-white">
                            <div class="flex flex-col">
                                <span class="text-gray-900 dark:text-white text-sm font-bold">${p.name.replace(' (You)', '')} ${p.flagEmoji||p.flag||'🌐'}</span>
                                <span class="text-indigo-500 dark:text-indigo-400 text-xs">${p.profession||p.prof||'User'} | ${p.country||'Global'}</span>
                            </div>
                        </div>
                        <i class="fa-solid fa-chevron-right text-gray-400 pr-2"></i>
                    </div>`;
            }
        });
    }
    if (!found) html = `<p class="text-sm text-gray-500 dark:text-gray-400 text-center mt-6">No internal results. Click 'Search Web' below.</p>`;
    resultsArea.innerHTML = html;
};
window.resetGlobalSearch = function() {
    const input = document.getElementById('global-search-input');
    if(input) input.value = '';
    window.performLiveSearch();
};
window.doGoogleSearch = function() {
    const q = document.getElementById('global-search-input').value;
    if(q.trim() === '') return alert('Enter search query first');
    const searchUrl = 'https://www.google.com/search?igu=1&q=' + encodeURIComponent(q);
    const iframe = document.getElementById('search-result-frame');
    const resultsArea = document.getElementById('search-results-area');
    const suggestions = document.getElementById('search-suggestions');
    const clearBtn = document.getElementById('clear-search-btn');
    if(suggestions) suggestions.style.display = 'none';
    if(resultsArea) resultsArea.innerHTML = '';
    if(clearBtn) clearBtn.classList.remove('hidden');
    iframe.src = searchUrl; iframe.classList.remove('hidden');
};

window.openAvatarModal = function(id, mode = 'cv') {
    const p = window.profilesData ? window.profilesData[id] : null;
    if(!p) return;
    document.getElementById('modal-avatar-img').src = p.photo || p.img || 'https://ui-avatars.com/api/?name=U';
    document.getElementById('modal-avatar-name').innerText = p.name.replace(' (You)', '');
    document.getElementById('modal-avatar-country').innerText = p.country || 'Global';
    document.getElementById('modal-avatar-flag').src = p.flagUrl || `https://flagcdn.com/w20/${p.flagCode||'un'}.png`;
    document.getElementById('modal-avatar-prof').innerText = p.profession || p.prof || 'User';
    document.getElementById('modal-avatar-langs').innerText = p.profileLangs || p.langs || 'Auto';
    document.getElementById('modal-avatar-pop').innerText = p.pop || 'N/A';
    document.getElementById('modal-avatar-seas').innerText = p.seas || 'N/A';
    document.getElementById('modal-avatar-desc').innerHTML = p.desc || '';
    
    const actionButtons = document.getElementById('modal-action-buttons');
    const profRow = document.getElementById('modal-prof-row');

    if (mode === 'chat' || id === 'ai') {
        actionButtons.style.display = 'none'; profRow.style.display = 'none'; 
    } else {
        actionButtons.style.display = 'flex'; profRow.style.display = 'flex'; 
        document.getElementById('modal-chat-btn').onclick = () => { window.closeAvatarModal(); document.querySelector('.nav-link[data-target="chat"]').click(); window.switchWebChat(id === 'me' ? 'me' : id); };
    }
    const modal = document.getElementById('avatar-modal');
    modal.classList.remove('hidden'); modal.classList.add('flex');
    setTimeout(() => { modal.classList.remove('opacity-0'); modal.querySelector('div').classList.remove('scale-95'); }, 10);
};

window.openActiveChatProfile = function() {
    if(window.currentRoomId === 'global') return alert("This is a group chat. Select a specific user to view their profile.");
    window.openAvatarModal(window.currentRoomId, 'chat');
};

window.closeAvatarModal = function() {
    const modal = document.getElementById('avatar-modal');
    modal.classList.add('opacity-0'); modal.querySelector('div').classList.add('scale-95');
    setTimeout(() => { modal.classList.add('hidden'); modal.classList.remove('flex'); }, 300);
};

window.openAuthModal = function() { 
    window.closeDropdown(); 
    const modal = document.getElementById('auth-modal');
    modal.classList.remove('hidden'); modal.classList.add('flex');
    setTimeout(() => { modal.classList.remove('opacity-0'); modal.querySelector('div').classList.remove('scale-95'); }, 10);
};
window.closeAuthModal = function() {
    const modal = document.getElementById('auth-modal');
    modal.classList.add('opacity-0'); modal.querySelector('div').classList.add('scale-95');
    setTimeout(() => { modal.classList.add('hidden'); modal.classList.remove('flex'); }, 300);
};
window.switchAuthTab = function(type) {
    const tabEmail = document.getElementById('tab-email');
    const tabPhone = document.getElementById('tab-phone');
    const formEmail = document.getElementById('auth-email-form');
    const formPhone = document.getElementById('auth-phone-form');
    if(type === 'email') {
        tabEmail.classList.replace('bg-gray-100', 'bg-indigo-600'); tabEmail.classList.replace('text-gray-500', 'text-white');
        tabPhone.classList.replace('bg-indigo-600', 'bg-gray-100'); tabPhone.classList.replace('text-white', 'text-gray-500');
        formEmail.classList.remove('hidden'); formPhone.classList.add('hidden');
    } else {
        tabPhone.classList.replace('bg-gray-100', 'bg-indigo-600'); tabPhone.classList.replace('text-gray-500', 'text-white');
        tabEmail.classList.replace('bg-indigo-600', 'bg-gray-100'); tabEmail.classList.replace('text-white', 'text-gray-500');
        formPhone.classList.remove('hidden'); formEmail.classList.add('hidden');
    }
};
window.switchTestUser = function() {
    const newUser = prompt("Log in as (enter name):", "Ilgar");
    if(newUser) { localStorage.setItem('hf_test_user', newUser.trim()); location.reload(); }
};
