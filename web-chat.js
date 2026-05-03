// ==========================================
// ЧАТ-ДВИЖОК И ПЕРЕВОДЧИК (WEB ВЕРСИЯ)
// ==========================================

window.sendFirebaseMsg = async function() {
    // В вебе инпут обычно один глобальный или зависит от активной вкладки
    const inputField = document.getElementById('chat-input') || document.getElementById('web-chat-input');
    if (!inputField) return;

    const rawText = inputField.value.trim(); 
    if (!rawText) return;
    inputField.value = '';

    let targetDbRoom = window.currentRoomId || 'global';
    let myActiveLang = window.appLang || 'en';

    let safeId = window.myProfileInfo ? window.myProfileInfo.id : 'guest';
    let safeName = window.myUsername || 'User';
    let safePhoto = window.myProfileInfo ? window.myProfileInfo.photo : 'https://ui-avatars.com/api/?name=U';
    let activeFlag = window.myProfileInfo ? window.myProfileInfo.flag : '🌐';
    let activeFlagCode = window.myProfileInfo ? window.myProfileInfo.flagCode : 'un';

    // Базовый текст (переводим на СВОЙ язык для истории, если нужно, иначе оставляем как есть)
    let myBaseText = rawText;
    let targetSendLang = window.currentTargetUser ? window.getSmartLang(window.currentTargetUser) : myActiveLang;
    let textToShip = myBaseText;

    // Если языки не совпадают — переводим перед отправкой в базу
    if (targetSendLang !== myActiveLang && targetDbRoom !== 'global') {
        try {
            const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${myActiveLang}&tl=${targetSendLang}&dt=t&q=${encodeURIComponent(myBaseText)}`);
            const data = await res.json();
            if (data && data[0] && data[0][0][0]) textToShip = data[0][0][0];
        } catch (e) { console.error("Translation error", e); }
    }

    try {
        firebase.database().ref(targetDbRoom).push({
            userId: safeId, name: safeName, text: textToShip, originalText: myBaseText,
            sessionId: window.mySessionId || 'sess', timestamp: firebase.database.ServerValue.TIMESTAMP,
            photo: safePhoto, flag: activeFlag, flagCode: activeFlagCode, langCode: myActiveLang
        });
    } catch(err) { console.error("Ошибка отправки", err); }

    // Прокрутка вниз
    const chatMsgs = document.getElementById('chat-messages'); 
    if (chatMsgs) setTimeout(() => { chatMsgs.scrollTop = chatMsgs.scrollHeight; }, 100); 
};

// Прием сообщений и отрисовка бабблов
window.handleNewMessage = async function(snapshot) {
    const data = snapshot.val(); 
    if(!data) return; 
    
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;

    const isMe = data.sessionId === window.mySessionId || data.userId === (window.myProfileInfo ? window.myProfileInfo.id : 'guest');
    let senderDisplayName = isMe ? window.myUsername : (data.name || 'User').split(' ')[0];

    const messageGroup = document.createElement('div'); 
    messageGroup.className = "flex w-full mt-4";
    
    // Веб-дизайн бабблов (Светлые/Темные)
    let bubbleStyle = isMe 
        ? "bg-indigo-600 text-white rounded-l-2xl rounded-tr-2xl" 
        : "bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700 rounded-r-2xl rounded-tl-2xl";
    
    let alignment = isMe ? "justify-end" : "justify-start";
    let avatarHtml = `<img src="${data.photo}" class="w-10 h-10 rounded-full object-cover border-2 border-gray-300 dark:border-slate-600 shadow-sm shrink-0 ${isMe ? 'ml-3' : 'mr-3'}">`;

    let bubbleContent = data.text;

    // Вставляем в DOM
    messageGroup.innerHTML = `
        <div class="flex w-full ${alignment}">
            ${!isMe ? avatarHtml : ''}
            <div class="flex flex-col max-w-[70%]">
                <span class="text-xs text-gray-500 mb-1 ${isMe ? 'text-right' : 'text-left'}">${senderDisplayName} ${data.flag || '🌐'}</span>
                <div class="p-3 shadow-sm ${bubbleStyle}">
                    ${bubbleContent}
                </div>
            </div>
            ${isMe ? avatarHtml : ''}
        </div>
    `;
    
    chatMessages.appendChild(messageGroup); 
    chatMessages.scrollTop = chatMessages.scrollHeight; 
};

// Привязываем Enter к отправке
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const activeId = document.activeElement ? document.activeElement.id : null;
        if (activeId === 'chat-input' || activeId === 'web-chat-input') { 
            window.sendFirebaseMsg(); 
        }
    }
});
