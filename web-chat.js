// ==========================================
// Файл: web-chat.js
// Назначение: База данных Firebase, Умный чат, Переводы (12 языков) и Корзина
// ==========================================

const db = firebase.database();
const mySessionId = Math.random().toString(36).substring(2, 15);
window.currentRoomId = 'global';
let isMarqueeEnabled = true;
let activeChatListener = null;

// --- ФУНКЦИЯ ПЕРЕВОДА (Google API) ---
window.translateText = async function(text, targetLangCode) {
    try {
        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLangCode}&dt=t&q=${encodeURIComponent(text)}`);
        const data = await res.json();
        return data[0][0][0];
    } catch (e) {
        console.error("Translation error:", e);
        return text;
    }
};

// --- УПРАВЛЕНИЕ ЭМОДЗИ ---
document.addEventListener('DOMContentLoaded', () => {
    const emojiBtn = document.getElementById('emoji-toggle-btn');
    const emojiPicker = document.getElementById('emoji-picker');
    if(emojiBtn && emojiPicker) {
        emojiBtn.addEventListener('click', (e) => { e.stopPropagation(); emojiPicker.classList.toggle('hidden'); });
        document.body.addEventListener('click', () => { emojiPicker.classList.add('hidden'); });
        emojiPicker.addEventListener('click', (e) => e.stopPropagation());
    }
    const vrEmojiBtn = document.getElementById('vr-emoji-toggle-btn');
    if(vrEmojiBtn) vrEmojiBtn.addEventListener('click', (e) => { e.stopPropagation(); document.getElementById('vr-emoji-picker')?.classList.toggle('hidden'); });
});

window.insertEmoji = function(emoji) { const chatInput = document.getElementById('chat-input'); if(chatInput) { chatInput.value += emoji; chatInput.focus(); } document.getElementById('emoji-picker')?.classList.add('hidden'); };
window.insertVrEmoji = function(emoji) { const vrInput = document.getElementById('vr-text-input'); if(vrInput) { vrInput.value += emoji; vrInput.focus(); } document.getElementById('vr-emoji-picker')?.classList.add('hidden'); };

// --- ПЕРЕКЛЮЧЕНИЕ КОМНАТ (Используем реальные данные из appUsers) ---
window.switchWebChat = function(userId) {
    if (activeChatListener) { db.ref(window.currentRoomId).off("child_added", activeChatListener); }
    window.currentRoomId = userId;
    
    const nameEl = document.getElementById('chat-header-name'); const statusEl = document.getElementById('chat-header-status');
    const avatarEl = document.getElementById('chat-header-avatar'); const topMarquee = document.getElementById('top-chat-marquee');
    if(!nameEl || !avatarEl) return;
    
    avatarEl.classList.remove('bg-gradient-to-r', 'from-purple-500', 'to-indigo-600');
    
    if(userId === 'global') {
        nameEl.innerText = 'Group Chat'; statusEl.innerHTML = '🌍 All members'; avatarEl.innerHTML = '🌍'; avatarEl.style.backgroundImage = 'none';
        if(topMarquee) topMarquee.innerHTML = 'Waiting for messages to translate...';
        showToast(null, true);
    } else if (userId === 'ai') {
        nameEl.innerText = 'AI Assistant'; statusEl.innerHTML = `🤖 Online`; avatarEl.innerHTML = '🤖'; avatarEl.style.backgroundImage = 'none'; avatarEl.classList.add('bg-gradient-to-r', 'from-purple-500', 'to-indigo-600');
        if(topMarquee) topMarquee.innerHTML = 'AI Co-Pilot is ready to help you!';
        showToast({ name: 'AI Assistant', flagEmoji: '🤖', img: 'https://ui-avatars.com/api/?name=AI' }, false);
    } else if (userId === 'me' || (window.myProfileInfo && userId === window.myProfileInfo.id)) {
        const p = window.myProfileInfo;
        nameEl.innerText = 'Saved Messages'; statusEl.innerHTML = `<img src="${p.flag}" class="w-4 h-3 rounded-sm inline"> You`; avatarEl.innerHTML = ''; avatarEl.style.backgroundImage = `url('${p.photo}')`;
        if(topMarquee) topMarquee.innerHTML = 'Saved Messages. Translation inactive.';
        showToast({ name: p.name, flagEmoji: p.flag, img: p.photo }, false);
    } else {
        const p = window.appUsers ? window.appUsers[userId] : null;
        if(p) {
            nameEl.innerText = p.name.replace(' (You)', ''); statusEl.innerHTML = `<img src="${p.flag}" class="w-4 h-3 rounded-sm inline"> Online`; avatarEl.innerHTML = ''; avatarEl.style.backgroundImage = `url('${p.photo}')`;
            if(topMarquee) topMarquee.innerHTML = `Private chat with ${p.name.replace(' (You)', '')}. Waiting for messages...`;
            showToast({ name: p.name, flagEmoji: p.flag, img: p.photo }, false);
        }
    }
    window.clearChatScreen(true);
    activeChatListener = db.ref(window.currentRoomId).on("child_added", handleNewMessage);
};

function showToast(profile, isGroup) {
    const toast = document.getElementById('toast-notification');
    if (!toast) return;
    const tImg = document.getElementById('toast-img'); const tIconWrap = document.getElementById('toast-icon-wrap');
    const tFlag = document.getElementById('toast-flag'); const tName = document.getElementById('toast-name');

    if (isGroup) { tImg.style.display = 'none'; tIconWrap.style.display = 'flex'; tIconWrap.innerHTML = '🌍'; tFlag.innerText = '🌍'; tName.innerText = 'Group Chat'; } 
    else {
        tImg.src = profile.img; tImg.style.display = 'block'; tIconWrap.style.display = 'none';
        if(profile.flagEmoji === '🤖') { tImg.style.display = 'none'; tIconWrap.style.display = 'flex'; tIconWrap.innerHTML = '🤖'; }
        tFlag.innerHTML = profile.flagEmoji === '🤖' ? '🤖' : `<img src="${profile.flagEmoji}" class="w-6 rounded-sm shadow-sm">`;
        tName.innerText = profile.name.replace(' (You)', '');
    }
    toast.classList.add('show');
    if (window.toastTimeout) clearTimeout(window.toastTimeout);
    window.toastTimeout = setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

window.toggleMarquee = function() {
    isMarqueeEnabled = !isMarqueeEnabled;
    const btn = document.getElementById('marquee-toggle-btn'); const marqueeBox = document.getElementById('web-marquee-box');
    if(isMarqueeEnabled) { btn.classList.replace('text-gray-400', 'text-indigo-500'); if(marqueeBox) marqueeBox.style.display = 'flex'; } 
    else { btn.classList.replace('text-indigo-500', 'text-gray-400'); if(marqueeBox) marqueeBox.style.display = 'none'; }
};

// --- ОТПРАВКА СООБЩЕНИЯ (Сохраняем реальные данные профиля) ---
window.sendFirebaseMsg = function() {
    const chatInput = document.getElementById('chat-input');
    if(!chatInput || !window.myProfileInfo) return;
    const text = chatInput.value.trim();
    if(!text) return;
    
    const p = window.myProfileInfo;
    
    db.ref(window.currentRoomId).push({ 
        userId: p.id,
        name: p.name, 
        photo: p.photo || 'https://ui-avatars.com/api/?name=U',
        flag: p.flag || '🌍',
        langCode: p.flagCode || 'en',
        text: text, 
        sessionId: mySessionId, 
        timestamp: firebase.database.ServerValue.TIMESTAMP 
    });
    chatInput.value = '';

    if(window.currentRoomId === 'ai') {
        setTimeout(() => {
            const aiReply = "Hello! 🤖 **Hello Friends** is a revolutionary Super-App. It eliminates language barriers with real-time translation, combines professional networking, and features a built-in 1-cent bank transfer system. It's the ultimate ecosystem for global business!";
            db.ref(window.currentRoomId).push({ userId: 'ai', name: "AI Co-Pilot", photo: 'https://ui-avatars.com/api/?name=AI', flag: '🤖', text: aiReply, sessionId: "ai-bot-session", timestamp: firebase.database.ServerValue.TIMESTAMP });
        }, 1500);
    }
};

document.getElementById('chat-send-btn')?.addEventListener('click', window.sendFirebaseMsg);
document.getElementById('chat-input')?.addEventListener('keypress', e => { if(e.key === 'Enter') window.sendFirebaseMsg(); });

// --- ПРИЕМ СООБЩЕНИЙ И ПЕРЕВОД ---
async function handleNewMessage(snapshot) {
    const data = snapshot.val();
    if(!data) return;
    
    const isMe = data.sessionId === mySessionId || (window.myProfileInfo && data.userId === window.myProfileInfo.id);
    const isAI = data.userId === "ai" || data.sessionId === "ai-bot-session";
    
    const msgWrapper = document.createElement('div');
    msgWrapper.className = `flex items-end gap-2 mb-4 w-full ${isMe ? 'self-end flex-row-reverse' : 'self-start'}`;
    
    const avatarHtml = `<img src="${data.photo}" class="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-slate-700 cursor-pointer hover:scale-110 transition-transform shadow-sm" onclick="if(typeof openAvatarModal === 'function') openAvatarModal('${data.userId}', 'chat')" title="Profile: ${data.name}">`;
    const msgId = 'msg-' + snapshot.key;

    let targetLangs = [];
    if (window.currentRoomId === 'global') {
        if (isMe) targetLangs = [{code: 'de', flag: '🇩🇪'}, {code: 'it', flag: '🇮🇹'}, {code: 'en', flag: '🇬🇧'}];
        else {
            let userLang = 'en';
            if (window.myProfileInfo && window.myProfileInfo.phone && typeof window.getLangFromPrefix === 'function') {
                userLang = window.getLangFromPrefix(window.myProfileInfo.phone);
            }
            targetLangs = [{code: userLang, flag: '🌍'}];
        }
    } else if (window.currentRoomId !== 'me' && window.currentRoomId !== 'ai') {
        if (isMe) {
            const roomUser = window.appUsers ? window.appUsers[window.currentRoomId] : null;
            if(roomUser) targetLangs = [{code: roomUser.flagCode || 'en', flag: roomUser.flag || '🌍'}];
        } else {
            let userLang = window.myProfileInfo ? (typeof window.getLangFromPrefix === 'function' ? window.getLangFromPrefix(window.myProfileInfo.phone) : 'en') : 'en';
            targetLangs = [{code: userLang, flag: '🌍'}];
        }
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
                <p class="font-bold text-xs mb-1 ${senderNameClasses}">${data.name.replace(' (You)', '')}</p>
                <p class="text-sm break-words">${displayedText}</p>
                ${targetLangs.length > 0 && !isReceipt && !isAI ? `<div class="mt-2 pt-1 border-t ${isMe ? 'border-indigo-500/50' : 'border-gray-200 dark:border-slate-600'} text-[0.65rem] opacity-90" id="trans-box-${msgId}"><i class="fa-solid fa-spinner fa-spin"></i> Translating...</div>` : ''}
            </div>
        </div>
    `;

    msgWrapper.innerHTML = avatarHtml + bubbleHtml;
    const chatMessages = document.getElementById('chat-messages');
    if(chatMessages) { chatMessages.appendChild(msgWrapper); chatMessages.scrollTop = chatMessages.scrollHeight; }

    const topMarquee = document.getElementById('top-chat-marquee');
    if (targetLangs.length > 0 && !isReceipt && !isAI && typeof window.translateText === 'function') {
        try {
            if(topMarquee && isMarqueeEnabled) topMarquee.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-indigo-400"></i> Translating...`;
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
                if (isMarqueeEnabled && topMarquee) topMarquee.innerHTML = `<span style="color: #4ade80;">[New Message]</span> <b>${data.name.replace(' (You)', '')}:</b> ${data.text} &nbsp;&nbsp;➔&nbsp;&nbsp; ${topMarqueeStr.join(' &nbsp;&nbsp;•&nbsp;&nbsp; ')}`;
            }
        } catch (e) { console.error("Translate Error", e); }
    }
}

// --- УМНЫЙ МИКРОФОН (Авто-язык) ---
document.addEventListener('DOMContentLoaded', () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const chatMicBtn = document.getElementById('main-chat-mic-btn');
    const chatInput = document.getElementById('chat-input');
    if (chatMicBtn && SpeechRecognition) {
        let chatRec = new SpeechRecognition();
        chatRec.continuous = false; chatRec.interimResults = false;
        chatRec.onstart = () => { chatMicBtn.classList.add('text-red-500', 'animate-pulse'); if(chatInput) chatInput.placeholder = "Listening..."; };
        chatRec.onend = () => { chatMicBtn.classList.remove('text-red-500', 'animate-pulse'); if(chatInput) chatInput.placeholder = "Type message or click mic..."; };
        chatRec.onerror = () => { chatMicBtn.classList.remove('text-red-500', 'animate-pulse'); };
        chatRec.onresult = (e) => { if(chatInput) { chatInput.value = e.results[0][0].transcript; window.sendFirebaseMsg(); } };
        
        chatMicBtn.addEventListener('click', () => { 
            let micLang = 'en-US';
            if (window.currentAppLang === 'auto' && window.myProfileInfo && window.myProfileInfo.phone && typeof window.getLangFromPrefix === 'function') {
                micLang = window.getLangFromPrefix(window.myProfileInfo.phone);
            } else if (window.currentAppLang !== 'auto') {
                micLang = window.currentAppLang;
            }
            chatRec.lang = micLang; 
            try { chatRec.start(); } catch(e){} 
        });
    }
});

// --- СМАРТ-ДЕЙСТВИЯ (Корзина, Очистка, ИИ) ---
window.clearChatScreen = function(skipMarquee = false) {
    const chatMessages = document.getElementById('chat-messages'); const topMarquee = document.getElementById('top-chat-marquee');
    if(chatMessages) chatMessages.innerHTML = '';
    if(!skipMarquee && topMarquee) topMarquee.innerHTML = 'Chat cleared. Waiting for new messages...';
};

window.smartAction = function(action, isConf = false) {
    if (action === 'archive') alert('Saved to Archive!');
    if (action === 'clear' || action === 'delete') {
        if (isConf) {
            const spk = document.getElementById('conf-speaker-marquee');
            if(spk) spk.innerHTML = '🇦🇿 Chat Cleared';
            document.querySelectorAll('.conf-listener-marquee').forEach(m => m.innerHTML = m.getAttribute('data-flag') + ' Chat Cleared');
        } else { db.ref(window.currentRoomId).remove().then(() => window.clearChatScreen()); }
    }
    if(typeof window.closeTrashModal === 'function') window.closeTrashModal();
};

window.applyAiMagic = function() {
    const wandBtn = document.getElementById('magic-wand-btn'); const chatInput = document.getElementById('chat-input');
    if(!chatInput) return;
    const text = chatInput.value.trim();
    if(!text) return alert("Please type some text first for the AI to improve!");
    
    if(wandBtn) wandBtn.classList.add('animate-spin');
    chatInput.disabled = true; chatInput.value = "✨ AI is rewriting your message...";
    
    setTimeout(() => {
        if(wandBtn) wandBtn.classList.remove('animate-spin');
        chatInput.disabled = false; chatInput.value = "Good afternoon! Could you please provide an update on the project? Thank you!"; chatInput.focus();
    }, 1500);
};
