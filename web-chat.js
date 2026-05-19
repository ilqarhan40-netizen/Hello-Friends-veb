// ==========================================
// ФАЙЛ: web-chat.js (ОБНОВЛЕННЫЙ И ИСПРАВЛЕННЫЙ)
// ==========================================

window.chatLang = window.chatLang || 'auto';
window.currentRoomId = 'global';
window.currentTargetUser = null;
window.isGeminiWaiting = false;
window.activeChatListener = null;
window.isMarqueeActive = true; 
window.joinedRoomTime = Date.now(); // Фиксатор времени для бегущей строки

// 0. ФУНКЦИЯ ВКЛ/ВЫКЛ БЕГУЩЕЙ СТРОКИ
window.toggleMarquee = function() {
    window.isMarqueeActive = !window.isMarqueeActive;
    const mContainer = document.getElementById('marquee-container');
    if (mContainer) {
        mContainer.style.display = window.isMarqueeActive ? 'flex' : 'none';
    }
};

window.toggleVrCC = function() {
    const vrMarquee = document.getElementById('vr-marquee');
    if (vrMarquee && vrMarquee.parentElement) {
        vrMarquee.parentElement.style.display = vrMarquee.parentElement.style.display === 'none' ? 'flex' : 'none';
    }
};

// ==========================================
// 1. ПЕРЕКЛЮЧЕНИЕ КОМНАТ 
// ==========================================
window.switchWebChat = function(targetId) {
    if (window.activeChatListener) {
        firebase.database().ref(window.currentRoomId).off("child_added", window.activeChatListener);
    }
    
    const chatMessages = document.getElementById('chat-messages'); 
    if (chatMessages) chatMessages.innerHTML = '';
    
    window.currentTargetUser = null; 
    window.joinedRoomTime = Date.now(); // Обновляем время при входе в новую комнату
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
        // ВЕРНУЛИ КЛИК ПРОФИЛЯ НА ВЕРХНЮЮ АВАТАРКУ
        hAvatar.onclick = function(e) {
            e.stopPropagation();
            if (window.currentTargetUser && typeof window.openUserProfile === 'function') {
                window.openUserProfile(window.currentTargetUser.id);
            }
        };
    }

    const btnContainer = document.getElementById('header-buttons-container');
    if (btnContainer) {
        const oldBtn = document.getElementById('dyn-global-btn');
        if (oldBtn) oldBtn.remove();
        
        if (targetId !== 'global') {
            const gBtn = document.createElement('button');
            gBtn.id = 'dyn-global-btn';
            gBtn.onclick = () => window.switchWebChat('global');
            gBtn.className = "bg-indigo-100 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-slate-600 px-3 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 shadow-sm ml-2";
            gBtn.innerHTML = `<i class="fa-solid fa-earth-americas text-xs"></i> Global`;
            btnContainer.appendChild(gBtn);
        }
    }

    const mText = document.getElementById('top-chat-marquee');
    if(mText) {
        mText.innerHTML = (window.currentRoomId === 'global') ? "🌍 Global Chat • Waiting for messages..." : "🔒 Secure Room • Waiting for messages...";
    }
    
    window.activeChatListener = firebase.database().ref(window.currentRoomId).on("child_added", window.handleNewMessage);
};

// ==========================================
// 2. ОТПРАВКА СООБЩЕНИЯ 
// ==========================================
window.sendFirebaseMsg = async function() {
    const inputField = document.getElementById('chat-input') || document.getElementById('web-chat-input');
    if (!inputField) return;

    const rawText = inputField.value.trim(); 
    if (!rawText) return;
    
    if (window.currentRoomId === 'private_ai_bot' && window.isGeminiWaiting) return; 
    
    inputField.value = '';

    let targetDbRoom = window.currentRoomId || 'global';
    
    // ПОЛНОСТЬЮ ОТВЯЗАНО ОТ appLang (МЕНЮ +)
    let cL = window.chatLang || 'auto';
    let myActiveLang = cL === 'auto' ? (window.myProfileInfo ? window.getSmartLang(window.myProfileInfo) : 'en') : cL;
    if (!myActiveLang || typeof myActiveLang !== 'string') myActiveLang = 'en';

    let safeId = window.myProfileInfo ? window.myProfileInfo.id : 'guest';
    let safeName = window.myUsername || 'User';
    let safePhoto = window.myProfileInfo ? window.myProfileInfo.photo : 'https://ui-avatars.com/api/?name=U';
    let activeFlag = window.myProfileInfo ? window.myProfileInfo.flag : '🌐';
    let activeFlagCode = window.myProfileInfo ? window.myProfileInfo.flagCode : 'un';

    let myBaseText = rawText;
    let safeLangCode = myActiveLang.substring(0, 2);
    
    try {
        const res1 = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${safeLangCode}&dt=t&q=${encodeURIComponent(rawText)}`);
        const data1 = await res1.json();
        if (data1 && data1[0] && data1[0][0][0]) {
            myBaseText = data1[0][0][0]; 
        }
    } catch (e) { console.error("Auto-translation error", e); }

    let targetSendLang = window.currentTargetUser ? window.getSmartLang(window.currentTargetUser) : myActiveLang;
    let textToShip = myBaseText;

    if (targetSendLang !== myActiveLang && targetDbRoom !== 'global' && targetDbRoom !== 'private_ai_bot') {
        try {
            const res2 = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${safeLangCode}&tl=${targetSendLang.substring(0,2)}&dt=t&q=${encodeURIComponent(myBaseText)}`);
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
                langCode: 'en', flag: '🤖', flagCode: 'us', photo: 'https://ui-avatars.com/api/?name=AI&background=6b21a8&color=fff' 
            }); 
        }).finally(() => { setTimeout(() => { window.isGeminiWaiting = false; }, 2000); });
    }
};

// ==========================================
// 3. ПРИЕМ И ОТРИСОВКА (С ПЕРЕВОДОМ В БЕГУЩЕЙ СТРОКЕ)
// ==========================================
window.handleNewMessage = async function(snapshot) {
    const data = snapshot.val(); 
    if(!data) return; 
    
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;

    const isMe = data.sessionId === window.mySessionId || data.userId === (window.myProfileInfo ? window.myProfileInfo.id : 'guest');
    const isAI = data.userId === "ai" || data.sessionId === "ai-bot-session";
    let p = isMe ? window.myProfileInfo : (isAI ? { id: 'ai', name: 'AI Assistant', photo: 'https://ui-avatars.com/api/?name=AI&background=6b21a8&color=fff', flagCode: 'us' } : (window.participants.find(part => part.id === data.userId) || { id: data.userId, photo: data.photo || 'https://ui-avatars.com/api/?name=U', langCode: data.langCode || 'en', flag: data.flag || '🌐', flagCode: data.flagCode || 'un', name: data.name || 'User' }));
    
    let senderDisplayName = isMe ? window.myUsername || "Me" : (p.name || 'User').split(' ')[0];
    let safeFlagCode = p.flagCode ? p.flagCode.toLowerCase() : 'un';
    let flagImgHtml = `<img src="https://flagcdn.com/w20/${safeFlagCode}.png" class="inline-block w-4 h-3 rounded-[2px] ml-1 shadow-sm object-cover" style="vertical-align: middle;">`;

    // ПОЛНОСТЬЮ ОТВЯЗАНО ОТ appLang (МЕНЮ +)
    let cL = window.chatLang || 'auto';
    let myReadLang = cL === 'auto' ? (window.myProfileInfo ? window.getSmartLang(window.myProfileInfo) : 'en') : cL;
    if (!myReadLang || typeof myReadLang !== 'string') myReadLang = 'en';
    let myLangCode = myReadLang.substring(0, 2);
    
    let textForMarquee = data.originalText || data.text;
    
    if (!isMe && myLangCode !== (data.langCode || '').substring(0,2)) {
        try {
            const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${myLangCode}&dt=t&q=${encodeURIComponent(textForMarquee)}`);
            const tData = await res.json();
            if (tData && tData[0] && tData[0][0][0]) textForMarquee = tData[0][0][0];
        } catch(e){}
    }
// 🌟 БЕГУЩАЯ СТРОКА: пускаем только свежие сообщения
    let isNewMessage = (data.timestamp || 0) > (window.joinedRoomTime - 5000); 
    if (isNewMessage) {
        let spanMsg = `<span class="mx-4 inline-flex items-center gap-1"><span class="text-indigo-600 dark:text-indigo-400 font-black tracking-wide">${flagImgHtml} ${senderDisplayName}:</span> <span class="text-gray-800 dark:text-gray-200 font-semibold ml-1">${textForMarquee.substring(0, 80)}</span></span>`;
        
        // 1. Обновление в основном чате
        const mText = document.getElementById('top-chat-marquee');
        if (mText) {
            let currentText = mText.innerHTML.replace('🌍 Global Chat • Waiting for messages...', '').replace('🔒 Secure Room • Waiting for messages...', '');
            mText.innerHTML = spanMsg + currentText;
        }

     // 2. Обновление в Голосовой комнате (VR)
        const vrMarquee = document.getElementById('web-vr-marquee'); // <--- ИЗМЕНИЛИ ID ЗДЕСЬ
        if(vrMarquee) {
            vrMarquee.innerHTML = spanMsg + vrMarquee.innerHTML;
        }

        // 3. Обновление в Видеоконференции (Conf)
        const confMarquee = document.getElementById('conf-marquee');
        if(confMarquee) {
            confMarquee.innerHTML = spanMsg + confMarquee.innerHTML;
        }
    }

    // --- Дальше идет стандартная логика пузырей чата ---
    const messageGroup = document.createElement('div'); 
    messageGroup.className = "flex flex-col w-full mt-4 mb-2";

    let bubbleStyle = isMe 
        ? "bg-indigo-600 text-white rounded-l-2xl rounded-tr-2xl" 
        : "bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700 rounded-r-2xl rounded-tl-2xl";
    
    let alignment = isMe ? "justify-end" : "justify-start";
    let avatarHtml = `<img src="${p.photo || data.photo}" class="w-10 h-10 rounded-full object-cover border-2 border-gray-300 dark:border-slate-600 shadow-sm shrink-0 cursor-pointer hover:scale-105 transition" onclick="event.stopPropagation(); if(typeof window.openChatLangModal === 'function') window.openChatLangModal('${senderDisplayName}')">`;
    let bubbleContent = data.text;
    let senderLang = data.langCode || 'auto'; 

    if (window.currentRoomId !== 'global' && !isAI) {
        let orig = data.originalText || data.text; 
        let trans = data.text; 
        
        if (orig !== trans) {
            let mainText, subText;
            if (isMe) { mainText = orig; subText = trans; } 
            else { mainText = trans; subText = orig; }

            let dividerColor = isMe ? 'border-white/30 text-indigo-200' : 'border-gray-300 dark:border-slate-500 text-indigo-500 dark:text-indigo-400';
            bubbleContent = `
                <div class="text-[0.95rem] leading-relaxed">${mainText}</div>
                <div class="mt-1.5 pt-1.5 border-t ${dividerColor} text-[0.75rem] font-bold tracking-wide opacity-90">➔ ${subText}</div>
            `;
        } else {
            bubbleContent = `<div class="text-[0.95rem] leading-relaxed">${orig}</div>`;
        }
    }

    messageGroup.innerHTML = `
        <div class="flex w-full ${alignment} gap-2">
            ${!isMe ? avatarHtml : ''}
            <div class="flex flex-col max-w-[70%]">
                <span class="text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-1 flex items-center ${isMe ? 'justify-end' : 'justify-start'}">${senderDisplayName} ${flagImgHtml}</span>
                <div class="p-3 shadow-sm text-sm ${bubbleStyle}">
                    ${bubbleContent}
                </div>
            </div>
            ${isMe ? avatarHtml : ''}
        </div>
    `;

    if (window.currentRoomId === 'global' && !isAI) {
         let targetUsers = []; 
         let neededLangs = new Set(); 
         
         if (myReadLang && myReadLang !== 'un' && myLangCode !== senderLang.substring(0,2)) {
             targetUsers.push({ code: myLangCode, flagCode: (window.myProfileInfo ? window.myProfileInfo.flagCode : 'un'), photo: (window.myProfileInfo ? window.myProfileInfo.photo : '') });
             neededLangs.add(myLangCode);
         }

         window.participants.filter(part => part.id !== 'ai').forEach(member => {
             let memberLang = window.getSmartLang(member);
             if (memberLang && memberLang !== 'un' && memberLang.substring(0,2) !== senderLang.substring(0,2)) {
                 targetUsers.push({ code: memberLang.substring(0,2), flagCode: member.flagCode, photo: member.photo });
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
                     let uFlag = `<img src="https://flagcdn.com/w20/${(u.flagCode || 'un').toLowerCase()}.png" class="absolute -bottom-1 -right-1 w-3 h-2 rounded-[1px] shadow-sm object-cover">`;
                     transContainer.innerHTML += `<div class="flex items-end gap-2 max-w-[85%] ${rowClass}">
                        <div class="relative shrink-0"><img src="${u.photo}" class="w-5 h-5 rounded-full object-cover border border-gray-300">${uFlag}</div>
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

// ==========================================
// 4. КОРЗИНА И FIREBASE АРХИВ
// ==========================================
window.openTrashModal = function() {
    if (typeof window.closeDropdown === 'function') window.closeDropdown();
    const tm = document.getElementById('trash-modal');
    if (tm) { tm.classList.remove('hidden'); tm.classList.add('flex'); }
};

window.closeTrashModal = function() { 
    const tm = document.getElementById('trash-modal');
    if (tm) { tm.classList.add('hidden'); tm.classList.remove('flex'); }
};

window.smartArchive = function() {
    if (!window.currentRoomId || window.currentRoomId === 'global') {
        alert("Global Chat cannot be archived.");
        return;
    }

    let myId = window.myProfileInfo ? window.myProfileInfo.id : 'guest';
    let targetArchiveRef = firebase.database().ref('user_archives/' + myId + '/docs');

    firebase.database().ref(window.currentRoomId).once('value').then(snapshot => {
        let msgs = snapshot.val();
        if (!msgs) {
            alert("Chat is empty!");
            window.closeTrashModal();
            return;
        }

        let chatContent = "CHAT EXPORT:\n------------------------\n\n";
        Object.values(msgs).forEach(m => {
            let timeStr = m.timestamp ? new Date(m.timestamp).toLocaleTimeString() : "";
            chatContent += `[${timeStr}] ${m.name}: ${m.originalText || m.text}\n`;
        });

        let docMeta = {
            sender: window.currentTargetUser ? window.currentTargetUser.name : 'System',
            email: 'encrypted-chat@local',
            time: new Date().toLocaleDateString(),
            title: "Chat Backup: " + (window.currentTargetUser ? window.currentTargetUser.name : 'User'),
            body: chatContent,
            icon: 'fa-file-lines',
            color: 'text-blue-500'
        };

        targetArchiveRef.push(docMeta).then(() => {
            firebase.database().ref(window.currentRoomId).remove();
            window.closeTrashModal();
            window.openArchiveModal(); 
        });
    });
};

window.actionClearHistory = function() {
    if(confirm("Clear all messages in this chat?")) {
        const chatMsgs = document.getElementById('chat-messages'); 
        if(chatMsgs) chatMsgs.innerHTML = ''; 
        if(window.currentRoomId) firebase.database().ref(window.currentRoomId).remove().catch(e => console.error(e)); 
        window.closeTrashModal();
    }
};

window.actionDeleteForever = function() {
    if(confirm("WARNING: Delete this chat forever? This cannot be undone.")) {
        const chatMsgs = document.getElementById('chat-messages'); 
        if(chatMsgs) chatMsgs.innerHTML = '';
        if(window.currentRoomId) firebase.database().ref(window.currentRoomId).remove().catch(e => console.error(e)); 
        window.closeTrashModal();
        if (typeof window.switchWebChat === 'function') window.switchWebChat('global'); 
    }
};

// ==========================================
// 5. ЖИВОЙ АРХИВ
// ==========================================
window.archiveData = { mail: [], docs: [], media: [] };
window.currentArchiveTab = 'mail';

window.loadFirebaseArchive = function(callback) {
    let myId = window.myProfileInfo ? window.myProfileInfo.id : 'guest';
    
    firebase.database().ref('user_archives/' + myId).once('value').then(snapshot => {
        let dbData = snapshot.val() || {};
        
        window.archiveData.mail = dbData.mail ? Object.keys(dbData.mail).map(k => ({...dbData.mail[k], id: k})) : [];
        window.archiveData.docs = dbData.docs ? Object.keys(dbData.docs).map(k => ({...dbData.docs[k], id: k})) : [];
        window.archiveData.media = dbData.media ? Object.keys(dbData.media).map(k => ({...dbData.media[k], id: k})) : [];
        
        if (window.archiveData.mail.length === 0) {
            window.archiveData.mail.push({
                id: 'sys_msg_1', sender: 'SYSTEM SETUP', email: 'cloud@firebase.app', time: 'Now',
                title: "Firebase Archive Active", body: "Ваш облачный архив успешно подключен к базе данных. Сюда будут поступать ваши системные письма и бэкапы чатов.", icon: 'fa-server', color: 'text-green-500'
            });
        }
        
        if (callback) callback();
    });
};

window.openArchiveModal = function() {
    if (typeof window.closeDropdown === 'function') window.closeDropdown();
    const am = document.getElementById('archive-modal');
    if (am) {
        window.loadFirebaseArchive(() => {
            am.classList.remove('hidden');
            am.classList.add('flex');
            window.switchArchiveTab(window.currentArchiveTab); 
        });
    }
};

window.closeArchiveModal = function() {
    const am = document.getElementById('archive-modal');
    if (am) { am.classList.add('hidden'); am.classList.remove('flex'); }
};

window.switchArchiveTab = function(tabName) {
    window.currentArchiveTab = tabName;
    const tabs = ['docs', 'media', 'mail'];
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
    window.renderArchiveList(); 
};

window.renderArchiveList = function() {
    const contentBox = document.getElementById('archive-content');
    if (!contentBox) return;

    const items = window.archiveData[window.currentArchiveTab];
    if (!items || items.length === 0) {
        let emptyIcon = window.currentArchiveTab === 'docs' ? 'fa-folder-open' : 'fa-photo-film';
        if(window.currentArchiveTab === 'mail') emptyIcon = 'fa-envelope-open';
        contentBox.innerHTML = `
            <div class="flex flex-col items-center justify-center h-40 text-gray-400 animate-fade-in">
                <i class="fa-solid ${emptyIcon} text-3xl mb-2 opacity-50"></i>
                <p class="text-xs font-bold uppercase tracking-wider">No items yet</p>
            </div>
        `;
        return;
    }

    let html = '';
    [...items].reverse().forEach(item => {
        html += `
            <div class="relative flex items-center justify-between p-3 rounded-2xl border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 cursor-pointer transition animate-fade-in" onclick="window.readArchiveItem('${item.id}')">
                <div class="flex items-center gap-3 overflow-hidden w-full">
                    <div class="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-green-500/50 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                        <i class="fa-solid ${item.icon || 'fa-file'} ${item.color || 'text-green-500'} text-xl"></i>
                    </div>
                    <div class="flex-1 overflow-hidden">
                        <div class="flex justify-between items-center w-full">
                            <span class="text-[11px] font-bold text-green-600 dark:text-green-400">${item.sender || 'Unknown'}</span>
                            <span class="text-[9px] text-gray-400 shrink-0 ml-2">${item.time || ''}</span>
                        </div>
                        <p class="text-xs text-gray-600 dark:text-gray-300 mt-1 truncate">${item.title || 'No Subject'}</p>
                    </div>
                </div>
                <button onclick="event.stopPropagation(); window.toggleArchiveMenu('${item.id}')" class="text-gray-400 hover:text-gray-600 dark:hover:text-white px-2 h-full flex items-center shrink-0 relative z-10">
                    <i class="fa-solid fa-ellipsis-vertical text-lg"></i>
                </button>
                <div id="menu-${item.id}" class="absolute right-8 top-10 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-xl rounded-xl w-32 hidden flex-col z-20 overflow-hidden">
                    <button onclick="event.stopPropagation(); window.archiveAction('copy', '${item.id}')" class="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition"><i class="fa-solid fa-copy text-blue-500 w-4"></i> Copy Text</button>
                    <button onclick="event.stopPropagation(); window.archiveAction('delete', '${item.id}')" class="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"><i class="fa-solid fa-trash w-4"></i> Delete</button>
                </div>
            </div>
        `;
    });
    contentBox.innerHTML = html;
};

window.toggleArchiveMenu = function(id) {
    document.querySelectorAll('[id^="menu-"]').forEach(el => el.classList.add('hidden')); 
    const menu = document.getElementById('menu-' + id);
    if (menu) menu.classList.toggle('hidden');
};

document.addEventListener('click', function(e) {
    if (!e.target.closest('[id^="menu-"]') && !e.target.closest('.fa-ellipsis-vertical')) {
        document.querySelectorAll('[id^="menu-"]').forEach(el => el.classList.add('hidden'));
    }
});

window.archiveAction = function(action, id) {
    window.toggleArchiveMenu(id); 
    const items = window.archiveData[window.currentArchiveTab];
    const itemIndex = items.findIndex(i => i.id === id);
    if (itemIndex === -1) return;
    
    if (action === 'delete') {
        if(confirm("Удалить из облака навсегда?")) {
            let myId = window.myProfileInfo ? window.myProfileInfo.id : 'guest';
            if (id !== 'sys_msg_1') {
                firebase.database().ref('user_archives/' + myId + '/' + window.currentArchiveTab + '/' + id).remove();
            }
            items.splice(itemIndex, 1);
            window.renderArchiveList(); 
        }
    } else if (action === 'copy') {
        navigator.clipboard.writeText(items[itemIndex].body).then(() => alert("Текст скопирован!"));
    }
};

window.readArchiveItem = function(id) {
    const items = window.archiveData[window.currentArchiveTab];
    const item = items.find(i => i.id === id);
    if(!item) return;

    const contentBox = document.getElementById('archive-content');
    contentBox.innerHTML = `
        <div class="flex flex-col h-full animate-fade-in">
            <button onclick="window.renderArchiveList()" class="self-start flex items-center gap-2 text-green-500 font-bold text-xs mb-4 hover:text-green-600 transition">
                <i class="fa-solid fa-arrow-left"></i> Назад
            </button>
            <div class="flex justify-between items-start mb-2">
                <h3 class="text-sm font-bold text-gray-800 dark:text-white leading-tight pr-4">${item.title}</h3>
                <button onclick="event.stopPropagation(); window.toggleArchiveMenu('read-${item.id}')" class="text-gray-400 hover:text-gray-600 dark:hover:text-white relative">
                    <i class="fa-solid fa-ellipsis-vertical text-lg"></i>
                </button>
                <div id="menu-read-${item.id}" class="absolute right-5 top-12 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-xl rounded-xl w-32 hidden flex-col z-20 overflow-hidden">
                    <button onclick="window.archiveAction('copy', '${item.id}')" class="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700"><i class="fa-solid fa-copy text-blue-500 w-4"></i> Copy Text</button>
                    <button onclick="window.archiveAction('delete', '${item.id}'); window.renderArchiveList();" class="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><i class="fa-solid fa-trash w-4"></i> Delete</button>
                </div>
            </div>
            <div class="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-slate-700 pb-3">
                <div class="flex flex-col"><span class="text-[11px] text-gray-500 dark:text-gray-400">${item.sender || 'System'} &lt;${item.email || ''}&gt;</span></div>
                <span class="text-[9px] text-gray-400">${item.time || ''}</span>
            </div>
            <div class="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap leading-relaxed overflow-y-auto pb-4 font-mono text-[11px] bg-gray-50 dark:bg-slate-800/50 p-3 rounded-xl border border-gray-100 dark:border-slate-700">
                ${item.body}
            </div>
        </div>
    `;
};

// ==========================================
// 6. ОСТАЛЬНЫЕ МЕНЮ И КОНФЕРЕНЦИЯ
// ==========================================
window.applyAiMagic = function() {
    const chatInput = document.getElementById('chat-input') || document.getElementById('web-chat-input');
    if(!chatInput) return;
    const text = chatInput.value.trim();
    if(!text) return alert("Type some text first for the AI!");
    chatInput.disabled = true;
    chatInput.value = "✨ AI is rewriting...";
    setTimeout(() => {
        chatInput.disabled = false;
        chatInput.value = "Good afternoon! Could you please provide an update? Thank you!";
        chatInput.focus();
    }, 1500);
};

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) { modal.classList.add('hidden'); modal.classList.remove('flex'); }
};

window.openQrModal = function() {
    if (typeof window.closeDropdown === 'function') window.closeDropdown();
    const m = document.getElementById('qr-modal');
    if (m) { m.classList.remove('hidden'); m.classList.add('flex'); }
};

window.openGuideModal = function() {
    if (typeof window.closeDropdown === 'function') window.closeDropdown();
    const m = document.getElementById('guide-modal');
    if (m) { m.classList.remove('hidden'); m.classList.add('flex'); }
};

window.openSecurityModal = function() {
    if (typeof window.closeDropdown === 'function') window.closeDropdown();
    const m = document.getElementById('security-modal');
    if (m) { m.classList.remove('hidden'); m.classList.add('flex'); }
};

window.openBlacklistModal = function() {
    if (typeof window.closeDropdown === 'function') window.closeDropdown();
    const m = document.getElementById('blacklist-modal');
    if (m) { m.classList.remove('hidden'); m.classList.add('flex'); }
};

window.openLangModal = function() {
    if (typeof window.closeDropdown === 'function') window.closeDropdown();
    const m = document.getElementById('lang-modal');
    if (m) { m.classList.remove('hidden'); m.classList.add('flex'); }
};

window.unblockUser = function(elementId) {
    const el = document.getElementById(elementId);
    if (el) el.remove(); 
    alert("User Unblocked!");
};

window.blockUser = function() {
    if (window.currentRoomId === 'global' || window.currentRoomId === 'private_ai_bot') {
        alert("You can only block users in a private chat.");
        return;
    }
    if (confirm("Block this user? They will be added to your Blacklist.")) {
        window.openBlacklistModal(); 
    }
};

window.openConference = function() {
    if (typeof window.closeDropdown === 'function') window.closeDropdown();
    const confModal = document.getElementById('conference-overlay');
    if (confModal) {
        confModal.style.display = 'flex';
    } else {
        alert("Модалка видеоконференции не найдена!");
    }
};

// ==========================================
// ВХОД И ВЫХОД ИЗ ГОЛОСОВОЙ КОМНАТЫ (WEB)
// ==========================================

// Новая функция отбоя (красная трубка)
window.leaveWebVoiceRoom = function() {
    if (typeof window.switchTab === 'function') window.switchTab(0);
    if (typeof window.switchWebChat === 'function') window.switchWebChat('global');
    else if (typeof window.switchChatRoom === 'function') window.switchChatRoom('global');
    window.closeVoiceRoom();
};

window.closeVoiceRoom = function() {
    const vr = document.getElementById('voice-room-modal');
    if (vr) { vr.classList.add('hidden'); vr.classList.remove('flex'); }
};

window.startVoiceCall = function() {
    window.closeModal('mic-menu-modal'); 
    const vr = document.getElementById('voice-room-modal');
    if (!vr) return;

    let myName = window.myUsername || "Me";
    let myPhoto = window.myProfileInfo ? window.myProfileInfo.photo : 'https://ui-avatars.com/api/?name=Me';
    let myFlagCode = window.myProfileInfo ? (window.myProfileInfo.flagCode || 'un').toLowerCase() : 'un';
    
    document.getElementById('voice-me-name').innerText = myName;
    document.getElementById('voice-me-avatar').src = myPhoto;
    document.getElementById('voice-me-flag').src = `https://flagcdn.com/w20/${myFlagCode}.png`;

    let partnerName = window.currentTargetUser ? window.currentTargetUser.name.split(' ')[0] : "Partner";
    let partnerPhoto = window.currentTargetUser ? window.currentTargetUser.photo : 'https://ui-avatars.com/api/?name=U';
    let partnerFlagCode = window.currentTargetUser ? (window.currentTargetUser.flagCode || 'un').toLowerCase() : 'un';

    if (window.currentRoomId === 'private_ai_bot') {
        partnerName = "Gemini AI";
        partnerPhoto = "https://ui-avatars.com/api/?name=AI&background=6b21a8&color=fff";
        partnerFlagCode = "us";
    }

    document.getElementById('voice-partner-name').innerText = partnerName;
    
    const vPartnerAvatar = document.getElementById('voice-partner-avatar');
    if (vPartnerAvatar) {
        vPartnerAvatar.src = partnerPhoto;
        vPartnerAvatar.style.cursor = "pointer";
        vPartnerAvatar.onclick = function(e) {
            e.stopPropagation();
            if(typeof window.openChatLangModal === 'function') window.openChatLangModal();
        };
    }
    
    document.getElementById('voice-partner-flag').src = `https://flagcdn.com/w20/${partnerFlagCode}.png`;

    vr.classList.remove('hidden');
    vr.classList.add('flex');
};

window.openVoiceRoomDirectly = function() {
    const vr = document.getElementById('voice-room-modal');
    if (!vr) return;

    let myName = window.myUsername || "Me";
    let myPhoto = window.myProfileInfo ? window.myProfileInfo.photo : 'https://ui-avatars.com/api/?name=Me';
    let myFlagCode = window.myProfileInfo ? (window.myProfileInfo.flagCode || 'un').toLowerCase() : 'un';
    
    document.getElementById('voice-me-name').innerText = myName;
    document.getElementById('voice-me-avatar').src = myPhoto;
    document.getElementById('voice-me-flag').src = `https://flagcdn.com/w20/${myFlagCode}.png`;

    let partnerName = window.currentTargetUser ? window.currentTargetUser.name.split(' ')[0] : "Waiting...";
    let partnerPhoto = window.currentTargetUser ? window.currentTargetUser.photo : 'https://ui-avatars.com/api/?name=Waiting';
    let partnerFlagCode = window.currentTargetUser ? (window.currentTargetUser.flagCode || 'un').toLowerCase() : 'un';

    if (window.currentRoomId === 'global') {
        partnerName = "Global Room";
        partnerPhoto = "https://ui-avatars.com/api/?name=Global&background=4f46e5&color=fff";
        partnerFlagCode = "un";
    }

    document.getElementById('voice-partner-name').innerText = partnerName;
    
    const vPartnerAvatar = document.getElementById('voice-partner-avatar');
    if (vPartnerAvatar) {
        vPartnerAvatar.src = partnerPhoto;
        vPartnerAvatar.style.cursor = "pointer";
        vPartnerAvatar.onclick = function(e) {
            e.stopPropagation();
            if(typeof window.openChatLangModal === 'function') window.openChatLangModal();
        };
    }

    document.getElementById('voice-partner-flag').src = `https://flagcdn.com/w20/${partnerFlagCode}.png`;

    vr.classList.remove('hidden');
    vr.classList.add('flex');
};

// ==========================================
// ЛОГИКА ВНУТРИ ГОЛОСОВОЙ КОМНАТЫ (РАЗДЕЛЕННЫЕ МИРЫ - WEB)
// ==========================================

window.updateWebVrMarquee = function(newText) {
    const marquee = document.getElementById('web-vr-marquee');
    if (!marquee) return;

    let currentText = marquee.innerText;
    if (currentText.includes("Waiting")) currentText = ""; 

    marquee.innerText = newText + " • " + currentText;
};

// МИР 1: КЛАВИАТУРА И ФОТО-АВАТАР (Умный перевод сообщений Google API)
window.sendVrMessage = async function() {
    const input = document.getElementById('vr-chat-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    input.value = ''; 

    let targetLang = 'en';

    // ЛОГИКА ЯЗЫКА: Смотрим в панель Аватара (chatLang)
    if (window.chatLang && window.chatLang !== 'auto') {
        targetLang = window.chatLang.substring(0, 2);
    } else {
        if (window.currentTargetUser) {
            targetLang = typeof window.getSmartLang === 'function' 
                ? window.getSmartLang(window.currentTargetUser).substring(0, 2) 
                : (window.currentTargetUser.flagCode || 'en').substring(0, 2);
        }
    }

    window.updateWebVrMarquee(`Я: ${text} (перевожу...)`);

    try {
        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
        const data = await res.json();
        if (data && data[0] && data[0][0][0]) {
            const translated = data[0][0][0];
            window.updateWebVrMarquee(`Я: ${text} ➔ Перевод: ${translated}`);
        } else {
            window.updateWebVrMarquee(`Я: ${text}`);
        }
    } catch (e) {
        window.updateWebVrMarquee(`Я: ${text}`);
    }
};

// СТРОГО: ГОЛОС В ТЕКСТ ТОЛЬКО ДЛЯ ГОЛОСОВОЙ КОМНАТЫ
window.startVrDictation = function() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Ваш браузер не поддерживает голосовой ввод.");

    const recognition = new SpeechRecognition();
    
    let micLang = 'en-US';
    if (typeof window.getSmartMicLang === 'function') {
        micLang = window.getSmartMicLang();
    } else if (window.myProfileInfo && typeof window.getSmartLang === 'function') {
        const code = window.getSmartLang(window.myProfileInfo).substring(0,2);
        const mapLocales = { 'en': 'en-US', 'ru': 'ru-RU', 'az': 'az-AZ', 'de': 'de-DE', 'tr': 'tr-TR', 'kk': 'kk-KZ', 'es': 'es-ES' };
        micLang = mapLocales[code] || 'en-US';
    }
    
    recognition.lang = micLang; 
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    const vrInput = document.getElementById('vr-chat-input');
    const vrMicBtn = document.getElementById('vr-mic-btn');

    recognition.onstart = function() {
        if (vrInput) vrInput.placeholder = "🎤 Говорите...";
        if (vrMicBtn) vrMicBtn.classList.add('text-red-500'); // Кнопка краснеет во время записи
    };

    recognition.onresult = function(event) {
        const speechResult = event.results[0][0].transcript;
        if (vrInput) {
            vrInput.value = speechResult;
            window.sendVrMessage(); // Сразу отправляем текст в бегущую строку с переводом
        }
    };

    recognition.onerror = recognition.onend = function() {
        if (vrInput) vrInput.placeholder = "Type message or click mic...";
        if (vrMicBtn) vrMicBtn.classList.remove('text-red-500');
    };

    recognition.start();
};

// ==========================================
// 8. ГОЛОСОВАЯ КОМНАТА И МИКРОФОН (ОРИГИНАЛЬНАЯ ВЕРСИЯ)
// ==========================================

window.currentMicLang = 'auto'; // Умное автоопределение по умолчанию

// Функция автоопределения нужного языка (Для меню микрофона)
window.getSmartMicLang = function() {
    if (window.currentMicLang !== 'auto') return window.currentMicLang; 

    let detectLang = window.appLang || 'auto';
    if (detectLang === 'auto' && window.myProfileInfo) {
        detectLang = typeof window.getSmartLang === 'function' ? window.getSmartLang(window.myProfileInfo) : (window.myProfileInfo.langCode || 'en');
    }
    detectLang = detectLang.toLowerCase().substring(0, 2);

    const mapLocales = {
        'en': 'en-US', 'ru': 'ru-RU', 'az': 'az-AZ', 'de': 'de-DE',
        'tr': 'tr-TR', 'ar': 'ar-SA', 'it': 'it-IT', 'es': 'es-ES',
        'fr': 'fr-FR', 'pt': 'pt-PT', 'ja': 'ja-JP', 'zh': 'zh-CN',
        'kk': 'kk-KZ' 
    };

    return mapLocales[detectLang] || 'en-US'; 
};

// Установка языка вручную из модалки "Mic Lang" (из кнопки +)
window.setMicLang = function(langCode) {
    window.currentMicLang = langCode;
    window.closeModal('lang-modal');
};

// Открыть меню выбора языка микрофона (из кнопки +)
window.openLangModal = function() {
    if (typeof window.closeDropdown === 'function') window.closeDropdown();
    const m = document.getElementById('lang-modal');
    if (m) { m.classList.remove('hidden'); m.classList.add('flex'); }
};

// Открыть меню выбора действий микрофона (в чате)
window.openMicMenu = function() {
    if (window.currentRoomId === 'global') {
        alert("В Global Chat звонки отключены. Перейдите в приватный чат.");
        return;
    }
    const m = document.getElementById('mic-menu-modal');
    if (m) { m.classList.remove('hidden'); m.classList.add('flex'); }
};

// Диктовка текста для главного чата (не комнаты)
window.startDictation = function() {
    window.closeModal('mic-menu-modal');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Ваш браузер не поддерживает голосовой ввод.");

    const recognition = new SpeechRecognition();
    recognition.lang = window.getSmartMicLang(); 
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    const chatInput = document.getElementById('chat-input') || document.getElementById('web-chat-input');

    recognition.onstart = function() {
        if (chatInput) {
            chatInput.placeholder = `🎤 Listening (${recognition.lang})...`;
            chatInput.classList.add('bg-red-50', 'dark:bg-red-900/20');
        }
    };

    recognition.onresult = function(event) {
        const speechResult = event.results[0][0].transcript;
        if (chatInput) {
            chatInput.value = speechResult;
            chatInput.placeholder = "Type message or click mic...";
            chatInput.classList.remove('bg-red-50', 'dark:bg-red-900/20');
            chatInput.focus();
        }
    };

    recognition.onerror = recognition.onend = function() {
        if (chatInput) {
            chatInput.placeholder = "Type message or click mic...";
            chatInput.classList.remove('bg-red-50', 'dark:bg-red-900/20');
        }
    };

    recognition.start();
};
// КНОПКА СС
window.toggleVrCC = function() {
    const ccContainer = document.getElementById('vr-cc-container');
    if (ccContainer) ccContainer.classList.toggle('hidden');
};
// ==========================================
// ЛОГИКА МЕНЮ СКРЕПКИ (DATEI ANHÄNGEN)
// ==========================================
window.openAttachmentModal = function() {
    if (typeof window.closeDropdown === 'function') window.closeDropdown();
    const m = document.getElementById('attachment-modal');
    if (m) { m.classList.remove('hidden'); m.classList.add('flex'); }
};

window.triggerPhotoUpload = function() {
    window.closeModal('attachment-modal');
    const input = document.getElementById('attachment-input');
    if (input) {
        input.accept = "image/*"; 
        input.click();
    }
};

window.triggerDocUpload = function() {
    window.closeModal('attachment-modal');
    const input = document.getElementById('attachment-input');
    if (input) {
        input.accept = ".pdf, .doc, .docx, .txt, application/pdf"; 
        input.click();
    }
};

window.openLocationFromAttachment = function() {
    window.closeModal('attachment-modal');
    if (typeof window.openLocationModal === 'function') {
        window.openLocationModal(); 
    } else {
        alert("Модалка локации не найдена.");
    }
};

// ==========================================
// ЛОГИКА ПОИСКА (ГЛОБАЛЬНАЯ ЛУПА OMNI-SEARCH)
// ==========================================
window.openSearchModal = function() {
    if (typeof window.closeDropdown === 'function') window.closeDropdown();
    const sm = document.getElementById('search-modal');
    if (sm) { 
        sm.classList.remove('hidden'); 
        sm.classList.add('flex'); 
        setTimeout(() => sm.classList.remove('opacity-0'), 10); 
    }
};

window.closeSearchModal = function() {
    const sm = document.getElementById('search-modal');
    if (sm) { 
        sm.classList.add('opacity-0'); 
        setTimeout(() => { sm.classList.add('hidden'); sm.classList.remove('flex'); }, 300); 
    }
};

window.performLiveSearch = function() {
    const input = document.getElementById('global-search-input').value.toLowerCase();
    const clearBtn = document.getElementById('clear-search-btn');
    const suggestions = document.getElementById('search-suggestions');
    const resultsArea = document.getElementById('search-results-area');

    if (input.length > 0) {
        if(clearBtn) clearBtn.classList.remove('hidden');
        if(suggestions) suggestions.classList.add('hidden');
        if(resultsArea) resultsArea.classList.remove('hidden');
        
        let html = `<div class="p-3 bg-gray-50 dark:bg-slate-700 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200">🔍 Поиск: "${input}"...</div>`;
        
        const foundUsers = window.participants ? window.participants.filter(u => u.name && u.name.toLowerCase().includes(input)) : [];
        if (foundUsers.length > 0) {
            html += `<div class="mt-3 text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-2">Найдено в контактах:</div>`;
            foundUsers.forEach(u => {
                let safeFlagCode = u.flagCode ? u.flagCode.toLowerCase() : 'un';
                html += `
                <div onclick="window.closeSearchModal(); window.switchWebChat('${u.id}')" class="flex items-center gap-3 p-2 hover:bg-blue-50 dark:hover:bg-slate-600 rounded-xl cursor-pointer transition border border-transparent hover:border-blue-100">
                    <div class="relative shrink-0">
                        <img src="${u.photo}" class="w-10 h-10 rounded-full object-cover border border-gray-200">
                        <img src="https://flagcdn.com/w20/${safeFlagCode}.png" class="absolute -bottom-1 -right-1 w-4 h-3 rounded-[2px] shadow-sm object-cover">
                    </div>
                    <div>
                        <div class="text-xs font-bold dark:text-white">${u.name}</div>
                        <div class="text-[10px] text-gray-500">Нажмите, чтобы открыть чат</div>
                    </div>
                </div>`;
            });
        } else {
            html += `<div class="mt-4 text-xs text-gray-500 text-center">В контактах совпадений не найдено.</div>`;
        }
        if(resultsArea) resultsArea.innerHTML = html;
    } else {
        if(clearBtn) clearBtn.classList.add('hidden');
        if(suggestions) suggestions.classList.remove('hidden');
        if(resultsArea) resultsArea.classList.add('hidden');
    }
};

window.resetGlobalSearch = function() {
    const input = document.getElementById('global-search-input');
    if (input) input.value = '';
    window.performLiveSearch();
};

window.handleSmartSearch = function(query, type) {
    const input = document.getElementById('global-search-input');
    if (type === 'transfer') {
        window.closeSearchModal();
        if(typeof window.openBankTransferModal === 'function') window.openBankTransferModal();
        else alert("Открытие перевода денег...");
    } else if (type === 'email') {
        window.closeSearchModal();
        if(typeof window.openEmailModal === 'function') window.openEmailModal();
        else alert("Открытие почты...");
    } else {
        if (input) input.value = query;
        window.performLiveSearch();
    }
};

window.doGoogleSearch = function() {
    const query = document.getElementById('global-search-input').value;
    if (!query) return alert("Введите текст для поиска");
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
};

// ==========================================
// 7. СТАРТ ПРИЛОЖЕНИЯ
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

    setTimeout(() => { window.switchWebChat('global'); }, 2000);
});
