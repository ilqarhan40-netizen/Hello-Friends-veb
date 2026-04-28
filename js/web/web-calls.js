// ==========================================
// 1. УПРАВЛЕНИЕ ОКНАМИ ЗВОНКОВ И КОНФЕРЕНЦИЙ
// ==========================================
window.openConference = function() { 
    if(window.closeDropdown) window.closeDropdown(); 
    const overlay = document.getElementById('conference-overlay');
    if(overlay) overlay.style.display = 'flex'; 
};

window.openVoiceChat = function() { 
    if(window.closeDropdown) window.closeDropdown(); 
    const overlay = document.getElementById('voice-overlay');
    if(overlay) overlay.style.display = 'flex'; 
};

window.closeCalls = function() { 
    const confOverlay = document.getElementById('conference-overlay');
    const voiceOverlay = document.getElementById('voice-overlay');
    if(confOverlay) confOverlay.style.display = 'none'; 
    if(voiceOverlay) voiceOverlay.style.display = 'none'; 
};

window.openPhoneChoiceModal = function() { 
    if(window.closeDropdown) window.closeDropdown(); 
    const modal = document.getElementById('phone-choice-modal');
    if(modal) {
        modal.classList.remove('hidden'); 
        modal.classList.add('flex');
    }
};

window.closePhoneChoiceModal = function() { 
    const modal = document.getElementById('phone-choice-modal');
    if(modal) {
        modal.classList.add('hidden'); 
        modal.classList.remove('flex');
    }
};

window.startInAppCall = function() { 
    window.closePhoneChoiceModal(); 
    setTimeout(() => { window.openVoiceChat(); }, 300); 
};

window.startExternalCall = function() { 
    window.closePhoneChoiceModal(); 
    window.location.href = "tel:+994501234567"; 
};

// ==========================================
// 2. ЛОГИКА ПЕРЕВОДА В РЕАЛЬНОМ ВРЕМЕНИ (СС)
// ==========================================
window.isVrMarqueeEnabled = true;

window.toggleVrCC = function() {
    window.isVrMarqueeEnabled = !window.isVrMarqueeEnabled;
    const btn = document.getElementById('vr-cc-btn');
    const marqueeBox = document.getElementById('vr-marquee-container');
    
    if(window.isVrMarqueeEnabled) {
        btn?.classList.remove('bg-gray-600', 'text-gray-300');
        btn?.classList.add('bg-indigo-600', 'dark:bg-[#00C4CC]', 'text-white', 'dark:text-black');
        if(marqueeBox && marqueeBox.innerText !== '') marqueeBox.style.display = 'block';
    } else {
        btn?.classList.remove('bg-indigo-600', 'dark:bg-[#00C4CC]', 'text-white', 'dark:text-black');
        btn?.classList.add('bg-gray-600', 'text-gray-300');
        if(marqueeBox) marqueeBox.style.display = 'none';
    }
};

window.isConfCCEnabled = true;

window.toggleConfCC = function() {
    window.isConfCCEnabled = !window.isConfCCEnabled;
    const btn = document.getElementById('conf-cc-btn');
    
    if (window.isConfCCEnabled) {
        if (btn) {
            btn.classList.remove('bg-gray-600', 'text-gray-300');
            btn.classList.add('bg-indigo-600', 'dark:bg-[#00C4CC]', 'text-white', 'dark:text-black');
        }
        document.querySelectorAll('#conference-overlay .translation-bar').forEach(bar => bar.style.display = 'flex');
    } else {
        if (btn) {
            btn.classList.remove('bg-indigo-600', 'dark:bg-[#00C4CC]', 'text-white', 'dark:text-black');
            btn.classList.add('bg-gray-600', 'text-gray-300');
        }
        document.querySelectorAll('#conference-overlay .translation-bar').forEach(bar => bar.style.display = 'none');
    }
};

// ==========================================
// 3. ИНИЦИАЛИЗАЦИЯ МИКРОФОНОВ И КАМЕР
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // Включение/выключение камеры визуально (кнопка)
    document.getElementById('conf-cam-btn')?.addEventListener('click', function() {
        this.classList.toggle('bg-indigo-600');
        this.classList.toggle('dark:bg-[#00C4CC]');
        this.classList.toggle('bg-gray-600');
        this.classList.toggle('text-black');
        this.classList.toggle('text-white');
    });

    // Обработка микрофона для Конференции с бегущей строкой перевода
    window.sendConfMessage = async function(voiceText = null) {
        const confInput = document.getElementById('conf-text-input');
        if(!confInput && !voiceText) return;
        
        const text = typeof voiceText === 'string' ? voiceText : confInput.value.trim();
        if(!text) return;
        if(confInput) confInput.value = '';

        const speakerMarquee = document.getElementById('conf-speaker-marquee');
        let myFlag = window.myProfileInfo?.flag || '🌐';
        if(speakerMarquee) speakerMarquee.innerHTML = `${myFlag} You: ${text}`;

        document.querySelectorAll('.conf-listener-marquee').forEach(async (m) => {
            const lang = m.getAttribute('data-lang');
            const flag = m.getAttribute('data-flag');
            try {
                // Функция translateText берется из web-chat.js
                let translated = window.translateText ? await window.translateText(text, lang) : text;
                m.innerHTML = `➔ ${flag} <span class="text-green-400 font-bold">${translated}</span>`;
            } catch(e) {
                m.innerHTML = `${flag} Error...`;
            }
        });
    };

    document.getElementById('conf-send-btn')?.addEventListener('click', () => window.sendConfMessage());
    document.getElementById('conf-text-input')?.addEventListener('keypress', e => { if(e.key === 'Enter') window.sendConfMessage(); });

    // Инициализация голосового ввода (если браузер поддерживает)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        const confMicBtn = document.getElementById('main-conf-mic-btn');
        if (confMicBtn) {
            let confRec = new SpeechRecognition();
            confRec.continuous = false; 
            confRec.interimResults = false;
            
            confRec.onstart = () => { confMicBtn.classList.add('text-red-500', 'animate-pulse'); };
            confRec.onend = () => { confMicBtn.classList.remove('text-red-500', 'animate-pulse'); };
            confRec.onerror = () => { confMicBtn.classList.remove('text-red-500', 'animate-pulse'); };
            confRec.onresult = (e) => { window.sendConfMessage(e.results[0][0].transcript); };
            
            confMicBtn.addEventListener('click', () => { 
                confRec.lang = document.getElementById('global-mic-lang')?.value || window.myProfileInfo?.langCode || 'en-US'; 
                try { confRec.start(); } catch(e){} 
            });
        }
    }
});
