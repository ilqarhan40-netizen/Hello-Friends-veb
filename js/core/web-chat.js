// ==========================================
// 1. ДИНАМИЧЕСКИЕ ДАННЫЕ ПРОФИЛЕЙ (ИЗ БАЗЫ FIREBASE)
// ==========================================
window.aiBot = { id: 'ai', name: 'Dual AI Co-Pilot', photo: 'https://ui-avatars.com/api/?name=AI&background=6b21a8&color=fff', profession: 'Super Intelligence', email: 'ai@hf.com', phone: 'API', flag: '🤖', flagCode: 'un', langCode: 'en', country: 'Cloud Server', desc: 'Powered by Gemini & ChatGPT.', profileLangs: 'All languages' };

window.profilesData = {};
window.participants = [];
window.myProfileInfo = { id: 'guest', name: 'User', photo: 'https://ui-avatars.com/api/?name=U&background=00a884&color=fff', flag: '🌐', flagCode: 'un', langCode: 'en' };
window.myUsername = localStorage.getItem('hf_test_user') || "User";

// ПРОСЛУШКА FIREBASE ДЛЯ РЕАЛЬНЫХ ПОЛЬЗОВАТЕЛЕЙ
document.addEventListener('DOMContentLoaded', () => {
    let activeUserId = localStorage.getItem('hf_active_user');
    
    if (window.db) {
        window.db.ref('users').on('value', (snapshot) => {
            const data = snapshot.val();
            let realUsers = [];
            window.profilesData = { 'ai': window.aiBot };

            if (data) {
                // Обновляем себя
                if (activeUserId && data[activeUserId]) {
                    window.myProfileInfo = { ...window.myProfileInfo, ...data[activeUserId] };
                    window.myUsername = window.myProfileInfo.name ? window.myProfileInfo.name.split(' ')[0] : "User";
                    window.profilesData['me'] = { ...window.myProfileInfo, id: 'me' };
                }

                // Обновляем остальных
                Object.values(data).forEach(u => {
                    if(u.id && u.isDeleted !== true) {
                        realUsers.push(u);
                        window.profilesData[u.id] = u; // Записываем в словарь по ID
                    }
                });
            }

            // Формируем финальный список участников
            window.participants = [window.aiBot, ...realUsers.filter(c => c.id !== window.myProfileInfo?.id && !c.id.startsWith('guest'))];
            
            // Перерисовываем интерфейс с новыми данными
            window.renderChatParticipants();
            window.generateProfessionGrid();
        });
    }
});

// ==========================================
// 2. ОТРИСОВКА ИНТЕРФЕЙСА С РЕАЛЬНЫМИ ЛЮДЬМИ
// ==========================================

// Отрисовка аватарок над чатом
window.renderChatParticipants = function() {
    const container = document.getElementById('chat-participants-list');
    if (!container) return;

    let html = `
        <div onclick="window.switchWebChat('global')" class="participant-avatar flex flex-col items-center text-center w-20 md:w-24 cursor-pointer group">
            <div class="rhombus-avatar bg-indigo-500 mb-2 flex justify-center items-center text-white text-3xl font-bold group-hover:scale-110 transition-transform shadow-md">🌍</div>
            <p class="font-semibold text-sm text-indigo-500">Group</p>
        </div>
        
        <div onclick="window.switchWebChat('ai')" class="participant-avatar flex flex-col items-center text-center w-20 md:w-24 cursor-pointer group">
            <div class="rhombus-avatar bg-gradient-to-r from-purple-500 to-indigo-600 mb-2 flex justify-center items-center text-white text-3xl font-bold group-hover:scale-110 transition-transform shadow-lg border-2 border-purple-300">🤖</div>
            <p class="font-bold text-sm text-purple-600 dark:text-purple-400">AI Assistant</p>
        </div>

        <div onclick="window.switchWebChat('me')" class="participant-avatar flex flex-col items-center text-center w-20 md:w-24 cursor-pointer group">
            <img src="${window.myProfileInfo?.photo || 'https://ui-avatars.com/api/?name=U'}" class="rhombus-avatar mb-2 group-hover:scale-110 transition-transform duration-300 shadow-md border-2 border-indigo-400 object-cover bg-white">
            <p class="font-semibold text-sm">${window.myUsername} (You)</p>
            <div class="flex items-center gap-1.5 mt-1"><span class="text-xs">${window.myProfileInfo?.flag || '🌐'}</span><p class="text-xs text-gray-500">Saved</p></div>
        </div>
    `;

    window.participants.forEach(p => {
        if (p.id === 'ai') return; // AI уже добавлен
        let pName = (p.name || 'User').split(' ')[0];
        let pFlag = p.flag || '🌐';
        let pCountry = p.country || 'Global';
        let pPhoto = p.photo || 'https://ui-avatars.com/api/?name=U';

        html += `
            <div onclick="window.switchWebChat('${p.id}')" class="participant-avatar flex flex-col items-center text-center w-20 md:w-24 cursor-pointer group">
                <img src="${pPhoto}" class="rhombus-avatar mb-2 group-hover:scale-110 transition-transform duration-300 shadow-md object-cover bg-white border border-gray-200">
                <p class="font-semibold text-sm">${pName}</p>
                <div class="flex items-center gap-1.5 mt-1"><span class="text-xs">${pFlag}</span><p class="text-xs text-gray-500 truncate max-w-[65px]">${pCountry}</p></div>
            </div>
        `;
    });

    container.innerHTML = html;
};

// Отрисовка сетки профессий (Global Talents)
window.generateProfessionGrid = function() {
    const grid = document.getElementById('web-profession-list');
    if(!grid) return;
    
    let html = '';
    const usersToDisplay = [window.profilesData['me'], ...window.participants.filter(p => p.id !== 'ai')];

    usersToDisplay.forEach(p => {
        if(!p) return;
        let pName = p.id === 'me' ? window.myUsername : (p.name || 'User').split(' ')[0];
        let pProf = p.profession || 'Talent';
        let pLangs = p.profileLangs || p.langCode || 'Auto';
        let pFlag = p.flag || '🌐';
        let pCountry = p.country || 'Global';
        let pPop = p.pop || 'N/A';
        let pSeas = p.seas || 'N/A';
        let pPhone = p.phone || 'Hidden';
        let pEmail = p.email || '';
        let targetChatId = p.id === 'me' ? 'me' : p.id;

        html += `
            <div class="bg-gray-50 dark:bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
                <div class="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 border-b dark:border-slate-700 pb-6">
                    <img src="${p.photo || 'https://ui-avatars.com/api/?name=U'}" class="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-indigo-100 dark:border-slate-700 shadow-md bg-white">
                    <div class="text-center md:text-left">
                        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">${pName}</h3>
                        <p class="text-indigo-600 dark:text-indigo-400 font-semibold mb-3">${pProf}</p>
                        <div class="flex flex-wrap justify-center md:justify-start gap-2">
                            <span class="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-full">Pro Network</span>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-sm">
                    <div class="flex flex-col"><span class="text-gray-500 dark:text-gray-400 font-medium mb-1"><i class="fa-solid fa-briefcase w-5 text-indigo-500"></i> Profession</span><span class="font-semibold text-gray-800 dark:text-gray-200 text-base">${pProf}</span></div>
                    <div class="flex flex-col"><span class="text-gray-500 dark:text-gray-400 font-medium mb-1"><i class="fa-solid fa-language w-5 text-indigo-500"></i> Languages</span><span class="font-semibold text-gray-800 dark:text-gray-200 text-base">${pLangs}</span></div>
                    <div class="flex flex-col"><span class="text-gray-500 dark:text-gray-400 font-medium mb-1"><i class="fa-solid fa-globe w-5 text-indigo-500"></i> Country</span><span class="font-semibold text-gray-800 dark:text-gray-200 text-base flex items-center gap-2">${pFlag} ${pCountry}</span></div>
                    <div class="flex flex-col"><span class="text-gray-500 dark:text-gray-400 font-medium mb-1"><i class="fa-solid fa-users w-5 text-indigo-500"></i> Population</span><span class="font-semibold text-gray-800 dark:text-gray-200 text-base">${pPop}</span></div>
                    <div class="flex flex-col"><span class="text-gray-500 dark:text-gray-400 font-medium mb-1"><i class="fa-solid fa-water w-5 text-indigo-500"></i> Seas</span><span class="font-semibold text-gray-800 dark:text-gray-200 text-base">${pSeas}</span></div>
                    <div class="flex flex-col"><span class="text-gray-500 dark:text-gray-400 font-medium mb-1"><i class="fa-solid fa-phone w-5 text-indigo-500"></i> Phone</span><span class="font-semibold text-gray-800 dark:text-gray-200 text-base">${pPhone}</span></div>
                </div>
                <div class="mt-8 border-t dark:border-slate-700 pt-6 flex gap-3 flex-wrap">
                    <button onclick="document.querySelector('.nav-link[data-target=\\'chat\\']').click(); window.switchWebChat('${targetChatId}');" class="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-md"><i class="fa-solid fa-comment"></i> Chat</button>
                    <button onclick="window.location.href='sms:${pPhone.replace(/\s+/g, '')}'" class="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors shadow-md"><i class="fa-solid fa-comment-sms"></i> SMS</button>
                    <button onclick="if(typeof window.openEmailModal === 'function') window.openEmailModal(); document.getElementById('email-to-input').value = '${pEmail}';" class="flex-1 md:flex-none flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"><i class="fa-solid fa-paper-plane"></i> Email</button>
                </div>
            </div>`;
    });
    grid.innerHTML = html;
};

// ==========================================
// 3. ОБЩИЕ ФУНКЦИИ ЧАТА (ЭМОДЗИ, ПЕРЕВОД)
// ==========================================
window.translateText = async function(text, targetLang) {
    try {
        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
        const data = await res.json();
        return data[0][0][0];
    } catch (e) { return `[${targetLang}] ${text}`; }
}

document.addEventListener('DOMContentLoaded', () => {
    const emojiBtn = document.getElementById('emoji-toggle-btn');
    const emojiPicker = document.getElementById('emoji-picker');
    const chatInput = document.getElementById('chat-input');

    if(emojiBtn && emojiPicker) {
        emojiBtn.addEventListener('click', (e) => { e.stopPropagation(); emojiPicker.classList.toggle('hidden'); });
        document.body.addEventListener('click', () => { emojiPicker.classList.add('hidden'); });
        emojiPicker.addEventListener('click', (e) => e.stopPropagation());
    }
    
    window.insertEmoji = function(emoji) {
        if(chatInput) { chatInput.value += emoji; chatInput.focus(); }
        if(emojiPicker) emojiPicker.classList.add('hidden');
    };
});

window.mySessionId = Math.random().toString(36).substring(2, 15);
window.currentRoomId = 'global';
window.isMarqueeEnabled = true;
window.activeChatListener = null;

window.toggleMarquee = function() {
    window.isMarqueeEnabled = !window.isMarqueeEnabled;
    const btn = document.getElementById('marquee-toggle-btn');
    const marqueeBox = document.getElementById('web-marquee-box');
    if(window.isMarqueeEnabled) {
        if(btn) btn.classList.replace('text-gray-400', 'text-indigo-500');
        if(marqueeBox) marqueeBox.style.display = 'flex';
    } else {
        if(btn) btn.classList.replace('text-indigo-500', 'text-gray-400');
        if(marqueeBox) marqueeBox.style.display = 'none';
    }
};

window.sendFirebaseMsg = function() {
    const chatInput = document.getElementById('chat-input');
    if(!chatInput || !window.db) return;
    
    const text = chatInput.value.trim();
    if(!text) return;
    
    window.db.ref(window.currentRoomId).push({ 
        name: window.myUsername, text: text, sessionId: window.mySessionId, timestamp: firebase.database.ServerValue.TIMESTAMP 
    });
    chatInput.value = '';

    if(window.currentRoomId === 'ai') {
        setTimeout(() => {
            const aiReply = "Hello! 🤖 **Hello Friends** is a revolutionary Super-App. I am ready to assist you in any language!";
            window.db.ref(window.currentRoomId).push({ 
                name: "AI Co-Pilot", text: aiReply, sessionId: "ai-bot-session", timestamp: firebase.database.ServerValue.TIMESTAMP 
            });
        }, 1500);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('chat-send-btn')?.addEventListener('click', window.sendFirebaseMsg);
    document.getElementById('chat-input')?.addEventListener('keypress', e => { if(e.key === 'Enter') window.sendFirebaseMsg(); });
});

window.handleNewMessage = async function(snapshot) {
    const data = snapshot.val();
    if(!data) return;
    
    const isMe = data.sessionId === window.mySessionId || data.name === window.myUsername;
    const isAI = data.sessionId === "ai-bot-session";
    
    // Ищем пользователя в реальной базе
    let p = window.profilesData[data.name === window.myUsername ? 'me' : Object.keys(window.profilesData).find(key => window.profilesData[key].name === data.name)] 
            || { name: data.name, photo: 'https://ui-avatars.com/api/?name=U', flag: '🌐' };

    if (isAI) p = window.aiBot;
    
    const chatMessages = document.getElementById('chat-messages');
    const msgWrapper = document.createElement('div');
    msgWrapper.className = `flex items-end gap-2 mb-4 w-full ${isMe ? 'self-end flex-row-reverse' : 'self-start'}`;
    
    const avatarHtml = `<img src="${p.photo}" class="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-slate-700 shadow-sm bg-white">`;
    const msgId = 'msg-' + snapshot.key;

    let targetLangs = [];
    if (window.currentRoomId === 'global') {
        if (isMe) targetLangs = [{code: 'de', flag: '🇩🇪'}, {code: 'it', flag: '🇮🇹'}, {code: 'en', flag: '🇬🇧'}];
        else targetLangs = [{code: 'az', flag: '🇦🇿'}];
    } else if (window.currentRoomId !== 'me' && window.currentRoomId !== 'ai') {
        if (isMe) {
            const roomUser = window.profilesData[window.currentRoomId];
            if(roomUser) targetLangs = [{code: roomUser.langCode || 'en', flag: roomUser.flag || '🌐'}];
        } else targetLangs = [{code: window.myProfileInfo.langCode || 'en', flag: window.myProfileInfo.flag || '🌐'}];
    }

    let displayedText = data.text;
    let isReceipt = displayedText.includes('💳 [BANK TRANSFER]');

    const bubbleClasses = isMe 
        ? (isReceipt ? 'bg-green-600 text-white rounded-br-none' : 'bg-indigo-600 text-white rounded-br-none') 
        : (isAI ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-none rounded-bl-none shadow-lg' 
           : (isReceipt ? 'bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100 border border-green-500/50 rounded-bl-none' : 'bg-white dark:bg-slate-700 text-gray-800 dark:text-white border border-gray-200 dark:border-slate-600 rounded-bl-none'));
    
    const senderNameClasses = isMe ? 'text-indigo-200 text-right' : (isAI ? 'text-purple-200 text-left' : 'text-indigo-500 text-left');

    const bubbleHtml = `
        <div class="flex flex-col" style="max-width: 75%;" id="${msgId}">
            <div class="p-3 rounded-xl shadow-sm ${bubbleClasses}">
                <p class="font-bold text-xs mb-1 ${senderNameClasses}">${(p.name || 'User').replace(' (You)', '')}</p>
                <p class="text-sm break-words">${displayedText}</p>
                ${targetLangs.length > 0 && !isReceipt && !isAI ? `<div class="mt-2 pt-1 border-t ${isMe ? 'border-indigo-500/50' : 'border-gray-200 dark:border-slate-600'} text-[0.65rem] opacity-90" id="trans-box-${msgId}"><i class="fa-solid fa-spinner fa-spin"></i> Translating...</div>` : ''}
            </div>
        </div>
    `;

    msgWrapper.innerHTML = avatarHtml + bubbleHtml;
    if(chatMessages) { chatMessages.appendChild(msgWrapper); chatMessages.scrollTop = chatMessages.scrollHeight; }

    if (targetLangs.length > 0 && !isReceipt && !isAI) {
        try {
            const topMarquee = document.getElementById('top-chat-marquee');
            if(topMarquee && window.isMarqueeEnabled) topMarquee.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-indigo-400"></i> Translating...`;
            
            const fetchPromises = targetLangs.map(lang => window.translateText(data.text, lang.code).then(trans => ({flag: lang.flag, text: trans, code: lang.code})));
            const translations = await Promise.all(fetchPromises);

            const transBoxEl = document.getElementById(`trans-box-${msgId}`);
            if(transBoxEl) {
                let html = ''; let topMarqueeStr = [];
                translations.forEach(t => {
                    html += `<div class="mt-1">${t.flag} ${t.text}</div>`;
                    topMarqueeStr.push(`${t.flag} <b>${t.code.toUpperCase()}:</b> ${t.text}`);
                });
                transBoxEl.innerHTML = html;
                if (window.isMarqueeEnabled && topMarquee) {
                    topMarquee.innerHTML = `<span style="color: #4ade80;">[New Message]</span> <b>${p.name.replace(' (You)', '')}:</b> ${data.text} &nbsp;&nbsp;➔&nbsp;&nbsp; ${topMarqueeStr.join(' &nbsp;&nbsp;•&nbsp;&nbsp; ')}`;
                }
            }
        } catch (e) { console.error("Translate Error", e); }
    }
};

window.switchWebChat = function(userId) {
    if (window.activeChatListener) { window.db.ref(window.currentRoomId).off("child_added", window.activeChatListener); }
    window.currentRoomId = userId;
    
    const nameEl = document.getElementById('chat-header-name');
    const statusEl = document.getElementById('chat-header-status');
    const avatarEl = document.getElementById('chat-header-avatar');
    const topMarquee = document.getElementById('top-chat-marquee');
    
    if(avatarEl) avatarEl.classList.remove('bg-gradient-to-r', 'from-purple-500', 'to-indigo-600');
    
    if(userId === 'global') {
        if(nameEl) nameEl.innerText = 'Group Chat'; 
        if(statusEl) statusEl.innerHTML = '🌍 All members'; 
        if(avatarEl) { avatarEl.innerHTML = '🌍'; avatarEl.style.backgroundImage = 'none'; }
        if(topMarquee) topMarquee.innerHTML = 'Waiting for messages to translate...';
        if(window.showToast) window.showToast(null, true);
    } else if (userId === 'ai') {
        const p = window.profilesData['ai'];
        if(nameEl) nameEl.innerText = 'AI Assistant'; 
        if(statusEl) statusEl.innerHTML = `🤖 Online`; 
        if(avatarEl) { avatarEl.innerHTML = '🤖'; avatarEl.style.backgroundImage = 'none'; avatarEl.classList.add('bg-gradient-to-r', 'from-purple-500', 'to-indigo-600'); }
        if(topMarquee) topMarquee.innerHTML = 'AI Co-Pilot is ready to help you!';
        if(window.showToast) window.showToast(p, false);
    } else {
        const p = window.profilesData[userId];
        if(!p) return;
        if(nameEl) nameEl.innerText = p.name.replace(' (You)', ''); 
        if(statusEl) statusEl.innerHTML = `<span class="text-xs">${p.flag || '🌐'}</span> Online`; 
        if(avatarEl) { avatarEl.innerHTML = ''; avatarEl.style.backgroundImage = `url('${p.photo}')`; }
        if(topMarquee) topMarquee.innerHTML = `Private chat with ${p.name.replace(' (You)', '')}. Waiting for messages...`;
        if(window.showToast) window.showToast(p, false);
    }
    
    if(window.clearChatScreen) window.clearChatScreen(true);
    window.activeChatListener = window.db.ref(window.currentRoomId).on("child_added", window.handleNewMessage);
};

window.applyAiMagic = function() {
    const chatInput = document.getElementById('chat-input');
    const wandBtn = document.getElementById('magic-wand-btn');
    if(!chatInput || !wandBtn) return;

    const text = chatInput.value.trim();
    if(!text) return alert("Please type some text first for the AI to improve!");
    
    wandBtn.classList.add('animate-spin');
    chatInput.disabled = true;
    chatInput.value = "✨ AI is rewriting your message...";
    
    setTimeout(() => {
        wandBtn.classList.remove('animate-spin');
        chatInput.disabled = false;
        chatInput.value = "Good afternoon! Could you please provide an update on the project? Thank you!";
        chatInput.focus();
    }, 1500);
};
