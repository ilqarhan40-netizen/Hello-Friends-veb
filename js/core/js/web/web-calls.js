// ==========================================
// 1. УПРАВЛЕНИЕ ОКНАМИ ЗВОНКОВ
// ==========================================
window.openPhoneChoiceModal = function() {
    if(window.closeDropdown) window.closeDropdown();
    const modal = document.getElementById('phone-choice-modal');
    if(!modal) return;
    modal.classList.remove('hidden'); modal.classList.add('flex');
    setTimeout(() => { modal.classList.remove('opacity-0'); modal.querySelector('div').classList.remove('scale-95'); }, 10);
};

window.closePhoneChoiceModal = function() {
    const modal = document.getElementById('phone-choice-modal');
    if(!modal) return;
    modal.classList.add('opacity-0'); modal.querySelector('div').classList.add('scale-95');
    setTimeout(() => { modal.classList.add('hidden'); modal.classList.remove('flex'); }, 300);
};

window.startInAppCall = function() { 
    window.closePhoneChoiceModal(); 
    setTimeout(() => { window.openVoiceChat(); }, 300); 
};

window.startExternalCall = function() { 
    window.closePhoneChoiceModal(); 
    window.location.href = "tel:+994501234567"; 
};

window.openConference = function() { 
    if(window.closeDropdown) window.closeDropdown(); 
    document.getElementById('conference-overlay').style.display = 'flex'; 
};

window.openVoiceChat = function() { 
    if(window.closeDropdown) window.closeDropdown(); 
    document.getElementById('voice-overlay').style.display = 'flex'; 
};

window.closeCalls = function() { 
    document.getElementById('conference-overlay').style.display = 'none'; 
    document.getElementById('voice-overlay').style.display = 'none'; 
};


// ==========================================
// 2. ГОЛОСОВАЯ КОМНАТА (VOICE ROOM)
// ==========================================
window.isVrMarqueeEnabled = true;

window.toggleVrCC = function() {
    window.isVrMarqueeEnabled = !window.isVrMarqueeEnabled;
    const btn = document.getElementById('vr-cc-btn');
    const marqueeBox = document.getElementById('vr-marquee-container');
    
    if(window.isVrMarqueeEnabled) {
        btn.classList.remove('bg-gray-600', 'text-gray-300');
        btn.classList.add('bg-indigo-600', 'dark:bg-[#00C4CC]', 'text-white', 'dark:text-black');
        if(marqueeBox && marqueeBox.innerText !== '') marqueeBox.style.display = 'block';
    } else {
        btn.classList.remove('bg-indigo-600', 'dark:bg-[#00C4CC]', 'text-white', 'dark:text-black');
        btn.classList.add('bg-gray-600', 'text-gray-300');
        if(marqueeBox) marqueeBox.style.display = 'none';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const vrMicBtn = document.getElementById('vr-mic-btn');
    const vrInput = document.getElementById('vr-text-input');
    const vrSendBtn = document.getElementById('vr-send-btn');
    const vrPulse = document.getElementById('vr-pulse');
    const vrMarqueeContainer = document.getElementById('vr-marquee-container');
    const vrMarqueeText = document.getElementById('vr-marquee-text');

    let vrRec = null;
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
        let SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        vrRec = new SR();
        vrRec.continuous = false;
        vrRec.interimResults = false;

        vrRec.onstart = () => {
            vrMicBtn.classList.replace('bg-gray-200', 'bg-red-500');
            vrMicBtn.classList.replace('dark:bg-slate-700', 'dark:bg-red-500');
            vrPulse.classList.remove('hidden');
            vrInput.placeholder = "Listening...";
        };
        vrRec.onend = () => {
            vrMicBtn.classList.replace('bg-red-500', 'bg-gray-200');
            vrMicBtn.classList.replace('dark:bg-red-500', 'dark:bg-slate-700');
            vrPulse.classList.add('hidden');
            vrInput.placeholder = "Type message or click mic...";
        };
        vrRec.onerror = (e) => {
            vrMicBtn.classList.replace('bg-red-500', 'bg-gray-200');
            vrMicBtn.classList.replace('dark:bg-red-500', 'dark:bg-slate-700');
            vrPulse.classList.add('hidden');
        };
        vrRec.onresult = (e) => {
            vrInput.value = e.results[0][0].transcript;
            window.sendVRMessage();
        };
    }

    if(vrMicBtn) {
        vrMicBtn.addEventListener('click', () => {
            if (vrRec) {
                vrRec.lang = document.getElementById('global-mic-lang').value || 'en-US'; 
                try { vrRec.start(); } catch(e){}
            } else { alert("Mic not supported in this browser."); }
        });
    }

    window.sendVRMessage = async function() {
        if(!vrInput) return;
        const text = vrInput.value.trim();
        if (!text) return;
        vrInput.value = '';

        if (!window.isVrMarqueeEnabled) return; 

        if(vrMarqueeContainer) vrMarqueeContainer.style.display = 'block';
        if(vrMarqueeText) vrMarqueeText.innerHTML = `🌍 Translating...`;

        try {
            // Используем функцию translateText из web-chat.js
            let translated = await window.translateText(text, 'it'); 
            if(vrMarqueeText) vrMarqueeText.innerHTML = `<span class="text-indigo-600 dark:text-white font-normal">You:</span> 🇮🇹 ${translated} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span class="text-indigo-600 dark:text-white font-normal">You:</span> 🇮🇹 ${translated}`;
        } catch(e) {
            if(vrMarqueeText) vrMarqueeText.innerHTML = "Translation error";
        }
    };

    vrSendBtn?.addEventListener('click', window.sendVRMessage);
    vrInput?.addEventListener('keypress', e => { if(e.key === 'Enter') window.sendVRMessage(); });
});


// ==========================================
// 3. ВИДЕОКОНФЕРЕНЦИЯ С ПЕРЕВОДОМ
// ==========================================
window.isConfCCEnabled = true;

window.toggleConfCC = function() {
    window.isConfCCEnabled = !window.isConfCCEnabled;
    const btn = document.getElementById('conf-cc-btn');
    
    if (window.isConfCCEnabled) {
        if (btn) {
            btn.classList.remove('bg-gray-600', 'text-gray-300');
            btn.classList.add('bg-indigo-600', 'dark:bg-[#00C4CC]', 'text-white', 'dark:text-black');
        }
        document.querySelectorAll('#conference-overlay .translation-bar').forEach(bar => {
            bar.style.display = 'flex';
        });
    } else {
        if (btn) {
            btn.classList.remove('bg-indigo-600', 'dark:bg-[#00C4CC]', 'text-white', 'dark:text-black');
            btn.classList.add('bg-gray-600', 'text-gray-300');
        }
        document.querySelectorAll('#conference-overlay .translation-bar').forEach(bar => {
            bar.style.display = 'none';
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const mainConfMicBtn = document.getElementById('main-conf-mic-btn');
    const confInput = document.getElementById('conf-text-input');
    const confSendBtn = document.getElementById('conf-send-btn');
    const speakerMarquee = document.getElementById('conf-speaker-marquee');
    const listenerMarquees = document.querySelectorAll('.conf-listener-marquee');

    let confRec = null;
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
        let SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        confRec = new SR();
        confRec.continuous = false;
        confRec.interimResults = false;

        confRec.onstart = () => {
            mainConfMicBtn.classList.replace('bg-gray-200', 'bg-red-500');
            mainConfMicBtn.classList.replace('dark:bg-gray-700', 'dark:bg-red-600');
            mainConfMicBtn.classList.add('animate-pulse');
        };
        confRec.onend = () => {
            mainConfMicBtn.classList.replace('bg-red-500', 'bg-gray-200');
            mainConfMicBtn.classList.replace('dark:bg-red-600', 'dark:bg-gray-700');
            mainConfMicBtn.classList.remove('animate-pulse');
        };
        confRec.onerror = (e) => {
            mainConfMicBtn.classList.replace('bg-red-500', 'bg-gray-200');
            mainConfMicBtn.classList.replace('dark:bg-red-600', 'dark:bg-gray-700');
            mainConfMicBtn.classList.remove('animate-pulse');
        };
        confRec.onresult = (e) => {
            const text = e.results[0][0].transcript;
            window.sendConfMessage(text); 
        };
    }

    if(mainConfMicBtn) {
        mainConfMicBtn.addEventListener('click', () => {
            if (confRec) {
                confRec.lang = document.getElementById('global-mic-lang').value || 'en-US'; 
                try { confRec.start(); } catch(e){}
            } else { alert("Mic not supported in this browser."); }
        });
    }

    document.getElementById('conf-cam-btn')?.addEventListener('click', function() {
        this.classList.toggle('bg-indigo-600');
        this.classList.toggle('dark:bg-[#00C4CC]');
        this.classList.toggle('bg-gray-600');
        this.classList.toggle('text-black');
        this.classList.toggle('text-white');
    });

    window.sendConfMessage = async function(voiceText = null) {
        if(!confInput) return;
        const text = typeof voiceText === 'string' ? voiceText : confInput.value.trim();
        if(!text) return;
        confInput.value = '';

        if(speakerMarquee) speakerMarquee.innerHTML = `🇦🇿 You: ${text}`;

        listenerMarquees.forEach(async (m) => {
            const lang = m.getAttribute('data-lang');
            const flag = m.getAttribute('data-flag');
            try {
                let translated = await window.translateText(text, lang);
                m.innerHTML = `➔ ${flag} <span class="text-green-400 font-bold">${translated}</span>`;
            } catch(e) {
                m.innerHTML = `${flag} Error...`;
            }
        });
    };

    confSendBtn?.addEventListener('click', () => window.sendConfMessage());
    confInput?.addEventListener('keypress', e => { if(e.key === 'Enter') window.sendConfMessage(); });
});
