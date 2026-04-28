// ==========================================
// 1. ИНИЦИАЛИЗАЦИЯ И ДАННЫЕ ПРОФИЛЕЙ
// ==========================================
window.aiBot = { id: 'ai', name: 'AI Assistant', photo: 'https://ui-avatars.com/api/?name=AI&background=6b21a8&color=fff', profession: 'Super Intelligence', email: 'ai@hf.com', phone: 'API', flag: '🤖', flagCode: 'un', langCode: 'en', country: 'Cloud Server', desc: 'Powered by Gemini & ChatGPT.', profileLangs: 'All 12 languages' };

// Оставляем только ИИ, реальные юзеры подтянутся из Firebase
window.profilesData = { 'ai': window.aiBot };
window.participants = [];

window.myProfileInfo = { id: 'guest', name: 'User', photo: 'https://ui-avatars.com/api/?name=U&background=00a884&color=fff', flag: '🌐', flagCode: 'un', langCode: 'en' };
window.myUsername = localStorage.getItem('hf_test_user') || "Ilgar";
window.mySessionId = Math.random().toString(36).substring(2, 15);
window.currentRoomId = 'global';
window.isMarqueeEnabled = true;
window.activeChatListener = null;
window.isGeminiWaiting = false;

// ==========================================
// 2. УМНОЕ ОПРЕДЕЛЕНИЕ 12 ЯЗЫКОВ
// ==========================================
window.getSmartLang = function(userData) {
    if (!userData) return navigator.language ? navigator.language.slice(0, 2) : 'en'; 
    let rawPhone = typeof userData === 'object' ? userData.phone : userData;
    let flag = (typeof userData === 'object' && userData.flagCode) ? userData.flagCode : "un";
    let langPref = typeof userData === 'object' ? userData.langCode : null;

    if (langPref && langPref !== 'auto' && langPref !== 'un') return langPref;
    let phone = (rawPhone !== null && rawPhone !== undefined) ? String(rawPhone).replace(/\s+/g, '') : "";
    
    // Поддержка 12 языков из мобильной версии
    if (phone.startsWith('+7')) return 'ru';
    if (phone.startsWith('+994')) return 'az';
    if (phone.startsWith('+39')) return 'it';
    if (phone.startsWith('+49')) return 'de';
    if (phone.startsWith('+33')) return 'fr';
    if (phone.startsWith('+81')) return 'ja';
    if (phone.startsWith('+34')) return 'es';
    if (phone.startsWith('+86')) return 'zh';
    if (phone.startsWith('+351')) return 'pt';
    if (phone.startsWith('+90')) return 'tr';
    if (phone.startsWith('+971')) return 'ar';
    if (phone.startsWith('+1') || phone.startsWith('+44')) return 'en';

    const flagToLang = { 'ru':'ru', 'az':'az', 'it':'it', 'de':'de', 'fr':'fr', 'jp':'ja', 'es':'es', 'cn':'zh', 'pt':'pt', 'tr':'tr', 'ae':'ar', 'gb':'en', 'us':'en' };
    if (flagToLang[flag]) return flagToLang[flag];
    return navigator.language ? navigator.language.slice(0, 2) : 'en';
};

// ==========================================
// 3. ПОДГРУЗКА РЕАЛЬНЫХ ПОЛЬЗОВАТЕЛЕЙ ИЗ БАЗЫ
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    let activeUserId = localStorage.getItem('hf_active_user');
    if (window.db) {
        window.db.ref('users').on('value', (snapshot) => {
            const data = snapshot.val();
            let realUsers = [];
            window.profilesData = { 'ai': window.aiBot };

            if (data) {
                if (activeUserId && data[activeUserId]) {
                    window.myProfileInfo = { ...window.myProfileInfo, ...data[activeUserId] };
                    window.myUsername = window.myProfileInfo.name ? window.myProfileInfo.name.split(' ')[0] : "Ilgar";
                    window.profilesData['me'] = { ...window.myProfileInfo, id: 'me' };
                }
                Object.values(data).forEach(u => {
                    if(u.id && u.isDeleted !== true) {
                        realUsers.push(u);
                        window.profilesData[u.id] = u; 
                    }
                });
            }
            window.participants = [window.aiBot, ...realUsers.filter(c => c.id !== window.myProfileInfo?.id && !c.id.startsWith('guest'))];
            if(window.renderChatParticipants) window.renderChatParticipants();
            if(window.generateProfessionGrid) window.generateProfessionGrid();
        });
    }
});

// ==========================================
// 4. ЛОГИКА ОТПРАВКИ И ПЕРЕВОДОВ ЧАТА
// ==========================================
window.translateText = async function(text, targetLang) {
    try {
        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
        const data = await res.json();
        return data[0][0][0];
    } catch (e) { return `[${targetLang}] ${text}`; }
}

window.sendFirebaseMsg = async function() {
    const chatInput = document.getElementById('chat-input');
    if (!chatInput || !window.db) return;
    const rawText = chatInput.value.trim(); 
    if (!rawText) return;
    if (window.currentRoomId === 'ai' && window.isGeminiWaiting) return;
    chatInput.value = '';

    let myActiveLang = window.getSmartLang(window.myProfileInfo);
    let targetSendLang = myActiveLang;
    
    if (window.currentRoomId !== 'global' && window.currentRoomId !== 'me' && window.currentRoomId !== 'ai') {
        const targetUser = window.profilesData[window.currentRoomId];
        if(targetUser) targetSendLang = window.getSmartLang(targetUser);
    }

    let textToShip = rawText;
    if (targetSendLang !== myActiveLang && window.currentRoomId !== 'global') {
        try {
            const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetSendLang}&dt=t&q=${encodeURIComponent(rawText)}`);
            const data = await res.json();
            if (data && data[0] && data[0][0][0]) textToShip = data[0][0][0];
        } catch (e) { console.error("Translate Error", e); }
    }

    window.db.ref(window.currentRoomId).push({
        userId: window.myProfileInfo.id || 'guest', name: window.myUsername,
        text: textToShip, originalText: rawText, sessionId: window.mySessionId, timestamp: firebase.database.ServerValue.TIMESTAMP,
        photo: window.myProfileInfo.photo || 'https://ui-avatars.com/api/?name=U', flag: window.myProfileInfo.flag || '🌐', langCode: myActiveLang
    });

    if (window.currentRoomId !== 'global' && window.currentRoomId !== 'me' && window.currentRoomId !== 'ai') {
        if(window.sendPushToUser) window.sendPushToUser(window.currentRoomId, window.myUsername, textToShip);
    }

    // Логика ИИ бота
    if (window.currentRoomId === 'ai') {
        window.isGeminiWaiting = true;
        const GEMINI_API_KEY = "AIzaSyB51d72XWcV5AGgLVM1UOg61eCYir78PkY"; 
        fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, { 
            method: 'POST', headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ contents: [{ parts: [{ text: "Reply in exactly the language requested or inferred: " + rawText }] }] }) 
        }).then(res => res.json()).then(data => { 
            window.db.ref(window.currentRoomId).push({ 
                name: "AI Assistant", text: data.candidates[0].content.parts[0].text, sessionId: "ai-bot-session", 
                timestamp: firebase.database.ServerValue.TIMESTAMP, userId: 'ai', langCode: 'en', flag: '🤖', photo: window.aiBot.photo 
            }); 
        }).finally(() => { setTimeout(() => { window.isGeminiWaiting = false; }, 2000); });
    }
};

window.handleNewMessage = async function(snapshot) {
    const data = snapshot.val();
    if(!data) return;
    const isMe = data.sessionId === window.mySessionId || data.userId === window.myProfileInfo?.id;
    const isAI = data.userId === "ai" || data.sessionId === "ai-bot-session";
    let p = isMe ? window.myProfileInfo : (isAI ? window.aiBot : (window.profilesData[data.userId] || { id: data.userId, name: data.name, photo: data.photo || 'https://ui-avatars.com/api/?name=U', langCode: data.langCode || 'en', flag: data.flag || '🌐' }));
    
    const chatMessages = document.getElementById('chat-messages');
    const msgWrapper = document.createElement('div');
    msgWrapper.className = `flex items-end gap-2 mb-4 w-full ${isMe ? 'self-end flex-row-reverse' : 'self-start'}`;
    
    let bubbleContent = data.originalText || data.text;
    let bubbleClasses = isMe ? 'bg-indigo-600 text-white rounded-br-none' : (isAI ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-none rounded-bl-none shadow-lg' : 'bg-white dark:bg-slate-700 text-gray-800 dark:text-white border border-gray-200 dark:border-slate-600 rounded-bl-none');
    
    // Адаптация медиа, чеков и локаций под веб-верстку
    if (data.mediaUrl) {
        bubbleContent = data.mediaType === 'video' ? `<video src="${data.mediaUrl}" controls class="max-w-[250px] rounded-lg mt-1 border border-gray-300 dark:border-slate-600"></video>` : `<img src="${data.mediaUrl}" class="max-w-[250px] rounded-lg mt-1 cursor-pointer border border-gray-300 dark:border-slate-600" onclick="window.openFullscreenImage(this.src)">`; 
        bubbleClasses = `bg-gray-100 dark:bg-slate-800 p-2 border border-gray-200 dark:border-slate-700 ${isMe ? 'rounded-br-none' : 'rounded-bl-none'}`;
    } else if (data.isTransfer) { 
        bubbleClasses = `bg-white dark:bg-slate-800 border border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)] !p-0 overflow-hidden ${isMe ? 'rounded-br-none' : 'rounded-bl-none'}`; 
        bubbleContent = `<div class="flex flex-col items-center p-5 min-w-[220px]"><div class="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-white mb-3 shadow-lg"><i class="fa-solid fa-check text-3xl"></i></div><span class="text-3xl font-bold text-gray-900 dark:text-white mb-1">$${data.amount}</span><span class="text-xs text-gray-500">To: ${data.recName}</span></div>`; 
    } else if (data.isLocation) {
        bubbleClasses = `bg-white dark:bg-slate-800 border border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] !p-0 overflow-hidden ${isMe ? 'rounded-br-none' : 'rounded-bl-none'}`; 
        bubbleContent = `<div class="flex flex-col w-[250px]"><iframe width="100%" height="150" frameborder="0" scrolling="no" src="${data.embedLink}" style="pointer-events: none;"></iframe><a href="${data.mapLink}" target="_blank" class="bg-gray-100 dark:bg-slate-900 p-3 text-center text-sm text-blue-600 dark:text-blue-400 font-bold hover:bg-gray-200 dark:hover:bg-slate-800 transition flex items-center justify-center gap-2"><i class="fa-solid fa-map-location-dot"></i> Open in Maps</a></div>`; 
    }

    msgWrapper.innerHTML = `
        <img src="${p.photo}" class="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-slate-700 shadow-sm bg-white shrink-0" onclick="window.openAvatarModal('${isMe ? 'me' : p.id}')">
        <div class="flex flex-col" style="max-width: 75%;" id="msg-${snapshot.key}">
            <div class="p-3 rounded-xl shadow-sm ${bubbleClasses}">
                <p class="font-bold text-xs mb-1 ${isMe ? 'text-indigo-200 text-right' : 'text-indigo-500 text-left'}">${(p.name || 'User').replace(' (You)', '')} <span class="text-[10px] ml-1 opacity-70">${data.flag || '🌐'}</span></p>
                <div class="text-sm break-words leading-relaxed">${bubbleContent}</div>
                ${data.originalText && data.text !== data.originalText && !data.mediaUrl && !data.isTransfer && !data.isLocation ? `<div class="mt-2 pt-2 border-t ${isMe ? 'border-indigo-500/50' : 'border-gray-200 dark:border-slate-600'} text-[0.7rem] opacity-90 text-green-400 font-bold">➔ ${data.text}</div>` : ''}
            </div>
        </div>
    `;
    if(chatMessages) { chatMessages.appendChild(msgWrapper); chatMessages.scrollTop = chatMessages.scrollHeight; }
};

window.switchWebChat = function(userId) {
    if (window.activeChatListener) { window.db.ref(window.currentRoomId).off("child_added", window.activeChatListener); }
    window.currentRoomId = userId;
    const nameEl = document.getElementById('chat-header-name');
    const statusEl = document.getElementById('chat-header-status');
    const avatarEl = document.getElementById('chat-header-avatar');
    if(avatarEl) avatarEl.classList.remove('bg-gradient-to-r', 'from-purple-500', 'to-indigo-600');
    
    if(userId === 'global') {
        if(nameEl) nameEl.innerText = 'Group Chat'; if(statusEl) statusEl.innerHTML = '🌍 All members'; if(avatarEl) { avatarEl.innerHTML = '🌍'; avatarEl.style.backgroundImage = 'none'; }
    } else if (userId === 'ai') {
        if(nameEl) nameEl.innerText = 'AI Assistant'; if(statusEl) statusEl.innerHTML = `🤖 Online`; if(avatarEl) { avatarEl.innerHTML = '🤖'; avatarEl.style.backgroundImage = 'none'; avatarEl.classList.add('bg-gradient-to-r', 'from-purple-500', 'to-indigo-600'); }
    } else if (userId === 'me') {
        if(nameEl) nameEl.innerText = 'Saved Messages'; if(statusEl) statusEl.innerHTML = `<span class="text-xs">${window.myProfileInfo?.flag || '🌐'}</span> You`; if(avatarEl) { avatarEl.innerHTML = ''; avatarEl.style.backgroundImage = `url('${window.myProfileInfo?.photo}')`; }
    } else {
        const p = window.profilesData[userId];
        if(!p) return;
        if(nameEl) nameEl.innerText = p.name.replace(' (You)', ''); if(statusEl) statusEl.innerHTML = `<span class="text-xs">${p.flag || '🌐'}</span> Online`; if(avatarEl) { avatarEl.innerHTML = ''; avatarEl.style.backgroundImage = `url('${p.photo}')`; }
    }
    const chatMessages = document.getElementById('chat-messages');
    if(chatMessages) chatMessages.innerHTML = '';
    window.activeChatListener = window.db.ref(window.currentRoomId).on("child_added", window.handleNewMessage);
};

window.clearChatScreen = function() {
    const chatMessages = document.getElementById('chat-messages');
    if(chatMessages) chatMessages.innerHTML = '';
};

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('chat-send-btn')?.addEventListener('click', window.sendFirebaseMsg);
    document.getElementById('chat-input')?.addEventListener('keypress', e => { if(e.key === 'Enter') window.sendFirebaseMsg(); });
});
