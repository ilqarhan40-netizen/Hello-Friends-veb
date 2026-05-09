// ==========================================
// ФАЙЛ: web-chat.js
// Назначение: Ядро чата для ВЕБ-версии (Отправка, Отрисовка, Глобальный Веер Переводов, Корзина, Архив)
// ==========================================

window.currentRoomId = 'global';
window.currentTargetUser = null;
window.isGeminiWaiting = false;
window.activeChatListener = null;

// 1. ПЕРЕКЛЮЧЕНИЕ КОМНАТ ВЕБ-ЧАТА (Исправляет ID: undefined)
window.switchWebChat = function(targetId) {
    if (window.activeChatListener) {
        firebase.database().ref(window.currentRoomId).off("child_added", window.activeChatListener);
    }
    
    const chatMessages = document.getElementById('chat-messages'); 
    if (chatMessages) chatMessages.innerHTML = '';
    
    window.currentTargetUser = null; 
    let headerName = "Group Chat"; 
    let headerStatus = "🌍 All members";
    let avatarImg = "";

    if (targetId === 'global') {
        window.currentRoomId = "global"; 
    } else if (targetId === 'ai') {
        window.currentRoomId = "private_ai_bot"; 
        headerName = "AI Assistant";
        headerStatus = "🤖 Powered by Gemini";
        avatarImg = "https://ui-avatars.com/api/?name=AI&background=6b21a8&color=fff";
    } else {
        const targetUser = window.participants.find(p => String(p.id) === String(targetId));
        if(targetUser) {
            window.currentTargetUser = targetUser;
            let id1 = String(window.myProfileInfo ? window.myProfileInfo.id : 'guest'); 
            let id2 = String(targetUser.id);
            window.currentRoomId = (id1 < id2) ? ("private_" + id1 + "_" + id2) : ("private_" + id2 + "_" + id1);
            
            headerName = (targetUser.name || 'User').split(' ')[0];
            headerStatus = `${targetUser.flag || '🌐'} Encrypted Room`;
            avatarImg = targetUser.photo || 'https://ui-avatars.com/api/?name=U';
        }
    }

    const hName = document.getElementById('chat-header-name');
    const hStatus = document.getElementById('chat-header-status');
    const hAvatar = document.getElementById('chat-header-avatar');
    
    if (hName) hName.innerText = headerName;
    if (hStatus) hStatus.innerText = headerStatus; 
    
    if (hAvatar) {
        if (avatarImg) {
            hAvatar.innerHTML = '';
            hAvatar.style.backgroundImage = `url('${avatarImg}')`;
            hAvatar.className = `w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md cursor-pointer hover:scale-105 transition-transform text-2xl bg-cover bg-center shrink-0 border border-gray-200`;
        } else {
            hAvatar.style.backgroundImage = 'none';
            hAvatar.innerHTML = "🌍";
            hAvatar.className = `w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md cursor-pointer hover:scale-105 transition-transform text-2xl bg-gradient-to-r from-blue-500 to-purple-500 shrink-0`;
        }
    }

    const mText = document.getElementById('top-chat-marquee');
    if(mText) {
        if(window.currentRoomId === 'global') mText.innerText = "🌍 Global Chat • AI Translation System Active...";
        else mText.innerText = `🔒 Secure Room • AI Translation Active...`;
    }
    
    window.activeChatListener = firebase.database().ref(window.currentRoomId).on("child_added", window.handleNewMessage);
};

// 2. ОТПРАВКА СООБЩЕНИЯ (FIREBASE + GEMINI)
window.sendFirebaseMsg = async function() {
    const inputField = document.getElementById('chat-input') || document.getElementById('web-chat-input');
    if (!inputField) return;

    const rawText = inputField.value.trim(); 
    if (!rawText) return;
    
    if (window.currentRoomId === 'private_ai_bot' && window.isGeminiWaiting) return; 
    
    inputField.value = '';

    let targetDbRoom = window.currentRoomId || 'global';
    let myActiveLang = window.appLang || 'en';
    if (myActiveLang === 'auto') myActiveLang = window.getSmartLang(window.myProfileInfo);

    let safeId = window.myProfileInfo ? window.myProfileInfo.id : 'guest';
    let safeName = window.myUsername || 'User';
    let safePhoto = window.myProfileInfo ? window.myProfileInfo.photo : 'https://ui-avatars.com/api/?name=U';
    let activeFlag = window.myProfileInfo ? window.myProfileInfo.flag : '🌐';
    let activeFlagCode = window.myProfileInfo ? window.myProfileInfo.flagCode : 'un';

    let myBaseText = rawText;
    
    // УМНЫЙ ПРЕ-ПЕРЕВОД (SMART TYPING)
    try {
        const res1 = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${myActiveLang.substring(0,2)}&dt=t&q=${encodeURIComponent(rawText)}`);
        const data1 = await res1.json();
        if (data1 && data1[0] && data1[0][0][0]) {
            myBaseText = data1[0][0][0]; 
        }
    } catch (e) { console.error("Auto-translation error", e); }

    let targetSendLang = window.currentTargetUser ? window.getSmartLang(window.currentTargetUser) : myActiveLang;
    let textToShip = myBaseText;

    if (targetSendLang !== myActiveLang && targetDbRoom !== 'global' && targetDbRoom !== 'private_ai_bot') {
        try {
            const res2 = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${myActiveLang.substring(0,2)}&tl=${targetSendLang.substring(0,2)}&dt=t&q=${encodeURIComponent(myBaseText)}`);
            const data2 = await res2.json();
            if (data2 && data2[0] && data2[0][0][0]) textToShip = data2[0][0][0];
        } catch (e) {}
    }

    try {
        firebase.database().ref(targetDbRoom).push({
            userId: safeId, name: safeName, text: textToShip || "Error", originalText: myBaseText || "Error",
            sessionId: window.mySessionId || 'sess', timestamp: firebase.database.ServerValue.TIMESTAMP,
            photo: safePhoto, flag: activeFlag, flagCode: activeFlagCode, langCode: myActiveLang
        });
    } catch(err) { console.error("Firebase send error:", err); }

    const chatMsgs = document.getElementById('chat-messages'); 
    if (chatMsgs) setTimeout(() => { chatMsgs.scrollTop = chatMsgs.scrollHeight; }, 100); 

    if (targetDbRoom === 'private_ai_bot') {
        window.isGeminiWaiting = true;
        const GEMINI_API_KEY = "AIzaSyB51d72XWcV5AGgLVM1UOg61eCYir78PkY"; 
        fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, { 
            method: 'POST', headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ contents: [{ parts: [{ text: "Reply in the exact same language: " + rawText }] }] }) 
        }).then(res => res.json()).then(data => { 
            let replyText = data.candidates[0].content.parts[0].text; 
            firebase.database().ref(targetDbRoom).push({ 
                name: "AI Assistant", text: replyText, sessionId: "ai-bot-session", 
                timestamp: firebase.database.ServerValue.TIMESTAMP, userId: 'ai', 
                langCode: 'en', flag: '🤖', photo: 'https://ui-avatars.com/api/?name=AI&background=6b21a8&color=fff' 
            }); 
        }).finally(() => { setTimeout(() => { window.isGeminiWaiting = false; }, 2000); });
    }
};

// 3. ПРИЕМ И ОТРИСОВКА (ВЕБ-ДИЗАЙН БАББЛОВ И ВЕЕР ПЕРЕВОДОВ)
window.handleNewMessage = async function(snapshot) {
    const data = snapshot.val(); 
    if(!data) return; 
    
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;

    const isMe = data.sessionId === window.mySessionId || data.userId === (window.myProfileInfo ? window.myProfileInfo.id : 'guest');
    const isAI = data.userId === "ai" || data.sessionId === "ai-bot-session";
    let p = isMe ? window.myProfileInfo : (isAI ? { id: 'ai', name: 'AI Assistant', photo: 'https://ui-avatars.com/api/?name=AI&background=6b21a8&color=fff', flag: '🤖' } : (window.participants.find(part => part.id === data.userId) || { id: data.userId, photo: data.photo || 'https://ui-avatars.com/api/?name=U', langCode: data.langCode || 'en', flag: data.flag || '🌐', name: data.name || 'User' }));
    
    let senderDisplayName = isMe ? window.myUsername || "Me" : (p.name || 'User').split(' ')[0];

    const messageGroup = document.createElement('div'); 
    messageGroup.className = "flex flex-col w-full mt-4 mb-2";

    let bubbleStyle = isMe 
        ? "bg-indigo-600 text-white rounded-l-2xl rounded-tr-2xl" 
        : "bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700 rounded-r-2xl rounded-tl-2xl";
    
    let alignment = isMe ? "justify-end" : "justify-start";
    let avatarHtml = `<img src="${p.photo || data.photo}" class="w-10 h-10 rounded-full object-cover border-2 border-gray-300 dark:border-slate-600 shadow-sm shrink-0 cursor-pointer hover:scale-105 transition" onclick="window.openUserProfile('${p.id}')">`;

    let bubbleContent = data.text;
    let myReadLang = window.appLang === 'auto' ? window.getSmartLang(window.myProfileInfo) : window.appLang;
    let senderLang = data.langCode || 'auto'; 

    // ПЕРЕВОД ПРИВАТНОГО ЧАТА (ОБРАТНЫЙ)
    if (data.originalText && window.currentRoomId !== 'global') {
        if (!isMe && !isAI && senderLang.substring(0,2) !== myReadLang.substring(0,2)) {
            try {
                const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${senderLang.substring(0,2)}&tl=${myReadLang.substring(0,2)}&dt=t&q=${encodeURIComponent(data.originalText)}`);
                const resData = await res.json();
                let finalTrans = (resData && resData[0] && resData[0][0]) ? resData[0][0][0] : data.originalText;
                
                bubbleContent = `<div>${data.originalText}</div><div class="mt-2 pt-2 border-t border-opacity-20 ${isMe ? 'border-white' : 'border-gray-300 dark:border-slate-500'} text-[0.8rem] ${isMe ? 'text-indigo-100' : 'text-indigo-500 dark:text-indigo-400'} font-bold">➔ ${finalTrans}</div>`;
            } catch(e) {}
        }
    }

    messageGroup.innerHTML = `
        <div class="flex w-full ${alignment} gap-2">
            ${!isMe ? avatarHtml : ''}
            <div class="flex flex-col max-w-[70%]">
                <span class="text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-1 ${isMe ? 'text-right' : 'text-left'}">${senderDisplayName} ${p.flag || '🌐'}</span>
                <div class="p-3 shadow-sm text-sm ${bubbleStyle}">
                    ${bubbleContent}
                </div>
            </div>
            ${isMe ? avatarHtml : ''}
        </div>
    `;

    // ГЛОБАЛЬНЫЙ ЧАТ: ВЕЕР ПЕРЕВОДОВ
    if (window.currentRoomId === 'global' && !isAI) {
         let targetUsers = []; 
         let neededLangs = new Set(); 
         
         if (myReadLang && myReadLang !== 'un' && myReadLang.substring(0,2) !== senderLang.substring(0,2)) {
             targetUsers.push({ code: myReadLang.substring(0,2), flag: (window.myProfileInfo ? window.myProfileInfo.flag : '🌐'), photo: (window.myProfileInfo ? window.myProfileInfo.photo : '') });
             neededLangs.add(myReadLang.substring(0,2));
         }

         window.participants.filter(part => part.id !== 'ai').forEach(member => {
             let memberLang = window.getSmartLang(member);
             if (memberLang && memberLang !== 'un' && memberLang.substring(0,2) !== senderLang.substring(0,2)) {
                 targetUsers.push({ code: memberLang.substring(0,2), flag: member.flag, photo: member.photo });
                 neededLangs.add(memberLang.substring(0,2));
             }
         });

         if (targetUsers.length > 0) {
             try {
                 let transCache = {};
                 const fetchPromises = Array.from(neededLangs).map(langCode => 
                     fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${senderLang}&tl=${langCode}&dt=t&q=${encodeURIComponent(data.originalText || data.text)}`)
                     .then(res => res.json())
                     .then(resData => { transCache[langCode] = resData[0][0][0]; })
                     .catch(e => { transCache[langCode] = data.originalText || data.text; }) 
                 );
                 
                 await Promise.all(fetchPromises);

                 const transContainer = document.createElement('div');
                 transContainer.className = `flex flex-col gap-2 mt-2 w-full ${isMe ? 'items-end pr-14' : 'items-start pl-14'}`;

                 targetUsers.forEach(u => {
                     let translatedText = transCache[u.code] || data.originalText || data.text;
                     const rowClass = isMe ? 'flex-row-reverse' : 'flex-row'; 
                     const radiusClass = isMe ? 'rounded-tr-sm rounded-l-2xl rounded-br-2xl' : 'rounded-tl-sm rounded-r-2xl rounded-bl-2xl';
                     transContainer.innerHTML += `<div class="flex items-end gap-2 max-w-[85%] ${rowClass}">
                        <div class="relative shrink-0"><img src="${u.photo}" class="w-5 h-5 rounded-full object-cover border border-gray-300"><span class="absolute -bottom-1 -right-1 text-[8px] bg-white rounded-full leading-none shadow-sm">${u.flag}</span></div>
                        <div class="bg-indigo-50 border border-indigo-100 dark:bg-slate-800 dark:border-slate-700 text-gray-800 dark:text-gray-200 ${radiusClass} px-3 py-1.5 text-[11px] font-medium shadow-sm">${translatedText}</div>
                     </div>`;
                 });
                 
                 messageGroup.appendChild(transContainer); 
             } catch (e) {}
         }
    }

    chatMessages.appendChild(messageGroup); 
    chatMessages.scrollTop = chatMessages.scrollHeight;
};

// 4. ПРИВЯЗКИ И ВОЛШЕБНАЯ ПАЛОЧКА
window.applyAiMagic = function() {
    const wandBtn = document.getElementById('magic-wand-btn');
    const chatInput = document.getElementById('chat-input') || document.getElementById('web-chat-input');
    if(!chatInput) return;
    
    const text = chatInput.value.trim();
    if(!text) return alert("Please type some text first for the AI to improve!");
    
    if(wandBtn) wandBtn.classList.add('animate-spin');
    chatInput.disabled = true;
    chatInput.value = "✨ AI is rewriting your message...";
    
    setTimeout(() => {
        if(wandBtn) wandBtn.classList.remove('animate-spin');
        chatInput.disabled = false;
        chatInput.value = "Good afternoon! Could you please provide an update on the project? Thank you!";
        chatInput.focus();
    }, 1500);
};


// ==========================================
// ЛОГИКА КОРЗИНЫ (SMART TRASH)
// ==========================================
window.openTrashModal = function() {
    if (typeof window.closeDropdown === 'function') window.closeDropdown();
    const tm = document.getElementById('trash-modal');
    if (tm) {
        tm.classList.remove('hidden');
        tm.classList.add('flex'); 
    }
};

window.closeTrashModal = function() { 
    const tm = document.getElementById('trash-modal');
    if (tm) {
        tm.classList.add('hidden'); 
        tm.classList.remove('flex');
    }
};

window.smartArchive = function() {
    if (window.currentRoomId === 'global') {
        alert("Global Chat cannot be archived.");
        return;
    }
    // Вызываем модалку архива вместо простого тоста
    window.closeTrashModal();
    window.openArchiveModal();
};

window.actionClearHistory = function() {
    if (window.currentRoomId === 'global') {
        alert("You cannot clear the Global Chat.");
        return;
    }
    if(confirm("Clear all messages in this chat?")) {
        const chatMsgs = document.getElementById('chat-messages'); 
        if(chatMsgs) chatMsgs.innerHTML = ''; 
        
        if(window.currentRoomId) { 
            firebase.database().ref(window.currentRoomId).remove().catch(e => console.error(e)); 
        }
        
        if (typeof window.showToast === 'function') window.showToast("Chat Cleared", "Message history deleted", "", "");
        window.closeTrashModal();
    }
};

window.actionDeleteForever = function() {
    if (window.currentRoomId === 'global') {
        alert("You cannot delete the Global Chat.");
        return;
    }
    if(confirm("WARNING: Delete this chat forever? This cannot be undone.")) {
        const chatMsgs = document.getElementById('chat-messages'); 
        if(chatMsgs) chatMsgs.innerHTML = '';
        
        if(window.currentRoomId) { 
            firebase.database().ref(window.currentRoomId).remove().catch(e => console.error(e)); 
        }
        
        if (typeof window.showToast === 'function') window.showToast("Deleted Forever", "Room destroyed", "", "");
        window.closeTrashModal();
        
        if (typeof window.switchWebChat === 'function') { 
            window.switchWebChat('global'); 
        }
    }
};

// ==========================================
// ЛОГИКА АРХИВА (CLOUD-SPEICHER)
// ==========================================
window.openArchiveModal = function() {
    if (typeof window.closeDropdown === 'function') window.closeDropdown();
    const am = document.getElementById('archive-modal');
    if (am) {
        am.classList.remove('hidden');
        am.classList.add('flex');
        window.switchArchiveTab('mail'); // Сразу открываем вкладку почты
    }
};

window.closeArchiveModal = function() {
    const am = document.getElementById('archive-modal');
    if (am) {
        am.classList.add('hidden');
        am.classList.remove('flex');
    }
};

window.switchArchiveTab = function(tabName) {
    const tabs = ['docs', 'media', 'mail'];
    
    // Переключаем стили кнопок
    tabs.forEach(t => {
        const btn = document.getElementById('tab-' + t);
        if (!btn) return;
        const icon = btn.querySelector('i');

        if (t === tabName) {
            btn.className = `flex-1 flex flex-col items-center justify-center py-3 bg-white dark:bg-slate-800 rounded-2xl text-green-500 dark:text-green-400 font-bold text-xs transition border border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.2)]`;
            icon.classList.remove('text-gray-300', 'dark:text-gray-500');
        } else {
            btn.className = `flex-1 flex flex-col items-center justify-center py-3 bg-gray-50 dark:bg-slate-800 rounded-2xl text-gray-400 font-bold text-xs transition border border-transparent hover:bg-gray-100 dark:hover:bg-slate-700`;
            icon.classList.add('text-gray-300', 'dark:text-gray-500');
        }
    });

    // Отрисовываем контент внутри
    const contentBox = document.getElementById('archive-content');
    if (!contentBox) return;

    if (tabName === 'mail') {
        contentBox.innerHTML = `
            <!-- Письмо 1 -->
            <div class="flex items-center justify-between p-3 rounded-2xl border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 cursor-pointer transition" onclick="alert('Открытие письма...')">
                <div class="flex items-center gap-3 overflow-hidden w-full">
                    <div class="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-green-500/50 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                        <i class="fa-solid fa-envelope text-green-500 dark:text-green-400 text-xl"></i>
                    </div>
                    <div class="flex-1 overflow-hidden">
                        <div class="flex justify-between items-center w-full">
                            <span class="text-[11px] font-bold text-green-600 dark:text-green-400">GOOGLE GEMINI</span>
                            <span class="text-[9px] text-gray-400 shrink-0 ml-2">08:51 AM</span>
                        </div>
                        <p class="text-xs text-gray-600 dark:text-gray-300 mt-1 truncate">You're now using Gemini on web</p>
                    </div>
                </div>
                <button onclick="event.stopPropagation(); alert('Меню 3 точки')" class="text-gray-400 hover:text-gray-600 dark:hover:text-white px-2 h-full flex items-center shrink-0">
                    <i class="fa-solid fa-ellipsis-vertical text-lg"></i>
                </button>
            </div>
            
            <!-- Письмо 2 -->
            <div class="flex items-center justify-between p-3 rounded-2xl border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 cursor-pointer transition" onclick="alert('Открытие письма...')">
                <div class="flex items-center gap-3 overflow-hidden w-full">
                    <div class="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-green-500/50 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                        <i class="fa-solid fa-envelope text-green-500 dark:text-green-400 text-xl"></i>
                    </div>
                    <div class="flex-1 overflow-hidden">
                        <div class="flex justify-between items-center w-full">
                            <span class="text-[11px] font-bold text-green-600 dark:text-green-400">GOOGLE ONE</span>
                            <span class="text-[9px] text-gray-400 shrink-0 ml-2">07:54 AM</span>
                        </div>
                        <p class="text-xs text-gray-600 dark:text-gray-300 mt-1 truncate">hello, поздравляем с переходом...</p>
                    </div>
                </div>
                <button onclick="event.stopPropagation(); alert('Меню 3 точки')" class="text-gray-400 hover:text-gray-600 dark:hover:text-white px-2 h-full flex items-center shrink-0">
                    <i class="fa-solid fa-ellipsis-vertical text-lg"></i>
                </button>
            </div>
        `;
    } else if (tabName === 'docs') {
        contentBox.innerHTML = `
            <div class="flex flex-col items-center justify-center h-40 text-gray-400">
                <i class="fa-solid fa-folder-open text-3xl mb-2 opacity-50"></i>
                <p class="text-xs font-bold uppercase tracking-wider">No documents yet</p>
            </div>
        `;
    } else {
        contentBox.innerHTML = `
            <div class="flex flex-col items-center justify-center h-40 text-gray-400">
                <i class="fa-solid fa-photo-film text-3xl mb-2 opacity-50"></i>
                <p class="text-xs font-bold uppercase tracking-wider">No media files yet</p>
            </div>
        `;
    }
};

// ==========================================
// СТАРТ ПРИЛОЖЕНИЯ (ЭТО ДОЛЖНО БЫТЬ В САМОМ НИЗУ, ОДИН РАЗ)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const sendBtn = document.getElementById('chat-send-btn');
    if (sendBtn) sendBtn.addEventListener('click', window.sendFirebaseMsg);

    const chatInput = document.getElementById('chat-input') || document.getElementById('web-chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') { e.preventDefault(); window.sendFirebaseMsg(); }
        });
    }

    // Запускаем глобальную комнату при старте
    setTimeout(() => { window.switchWebChat('global'); }, 2000);
});
