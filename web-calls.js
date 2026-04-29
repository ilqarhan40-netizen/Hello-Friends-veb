// ==========================================
// Файл: web-calls.js
// Назначение: Управление видео и аудио звонками, перевод в звонках
// ==========================================

window.openConference = function() { 
    if(typeof window.closeDropdown === 'function') window.closeDropdown(); 
    const overlay = document.getElementById('conference-overlay');
    if(overlay) overlay.style.display = 'flex'; 
};

window.openVoiceChat = function() { 
    if(typeof window.closeDropdown === 'function') window.closeDropdown(); 
    const overlay = document.getElementById('voice-overlay');
    if(overlay) overlay.style.display = 'flex'; 
};

window.closeCalls = function() { 
    const confOverlay = document.getElementById('conference-overlay'); const voiceOverlay = document.getElementById('voice-overlay');
    if(confOverlay) confOverlay.style.display = 'none'; 
    if(voiceOverlay) voiceOverlay.style.display = 'none'; 
};

window.openPhoneChoiceModal = function() { 
    if(typeof window.closeDropdown === 'function') window.closeDropdown(); 
    const modal = document.getElementById('phone-choice-modal');
    if(modal) { modal.classList.remove('hidden'); modal.classList.add('flex'); }
};

window.closePhoneChoiceModal = function() { 
    const modal = document.getElementById('phone-choice-modal');
    if(modal) { modal.classList.add('hidden'); modal.classList.remove('flex'); }
};

window.startInAppCall = function() { window.closePhoneChoiceModal(); setTimeout(() => { window.openVoiceChat(); }, 300); };
window.startExternalCall = function() { window.closePhoneChoiceModal(); window.location.href = "tel:+994501234567"; };

window.isVrMarqueeEnabled = true;
window.toggleVrCC = function() {
    window.isVrMarqueeEnabled = !window.isVrMarqueeEnabled;
    const btn = document.getElementById('vr-cc-btn'); const marqueeBox = document.getElementById('vr-marquee-container');
    if(window.isVrMarqueeEnabled) {
        btn?.classList.remove('bg-gray-600', 'text-gray-300'); btn?.classList.add('bg-indigo-600', 'dark:bg-[#00C4CC]', 'text-white', 'dark:text-black');
        if(marqueeBox && marqueeBox.innerText !== '') marqueeBox.style.display = 'block';
    } else {
        btn?.classList.remove('bg-indigo-600', 'dark:bg-[#00C4CC]', 'text-white', 'dark:text-black'); btn?.classList.add('bg-gray-600', 'text-gray-300');
        if(marqueeBox) marqueeBox.style.display = 'none';
    }
};

window.isConfCCEnabled = true;
window.toggleConfCC = function() {
    window.isConfCCEnabled = !window.isConfCCEnabled;
    const btn = document.getElementById('conf-cc-btn');
    if (window.isConfCCEnabled) {
        btn?.classList.remove('bg-gray-600', 'text-gray-300'); btn?.classList.add('bg-indigo-600', 'dark:bg-[#00C4CC]', 'text-white', 'dark:text-black');
        document.querySelectorAll('#conference-overlay .translation-bar').forEach(bar => bar.style.display = 'flex');
    } else {
        btn?.classList.remove('bg-indigo-600', 'dark:bg-[#00C4CC]', 'text-white', 'dark:text-black'); btn?.classList.add('bg-gray-600', 'text-gray-300');
        document.querySelectorAll('#conference-overlay .translation-bar').forEach(bar => bar.style.display = 'none');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('conf-cam-btn')?.addEventListener('click', function() {
        this.classList.toggle('bg-indigo-600'); this.classList.toggle('dark:bg-[#00C4CC]');
        this.classList.toggle('bg-gray-600'); this.classList.toggle('text-black'); this.classList.toggle('text-white');
    });

    window.sendConfMessage = async function(voiceText = null) {
        const confInput = document.getElementById('conf-text-input');
        if(!confInput && !voiceText) return;
        
        const text = typeof voiceText === 'string' ? voiceText : confInput.value.trim();
        if(!text) return;
        if(confInput) confInput.value = '';

        const speakerMarquee = document.getElementById('conf-speaker-marquee');
        const me = window.profilesData ? window.profilesData['me'] : null;
        let myFlag = me ? me.flagEmoji : '🌐';
        
        if(speakerMarquee) speakerMarquee.innerHTML = `${myFlag} You: ${text}`;

        document.querySelectorAll('.conf-listener-marquee').forEach(async (m) => {
            const lang = m.getAttribute('data-lang'); const flag = m.getAttribute('data-flag');
            try {
                let translated = (typeof window.translateText === 'function') ? await window.translateText(text, lang) : text;
                m.innerHTML = `➔ ${flag} <span class="text-green-400 font-bold">${translated}</span>`;
            } catch(e) { m.innerHTML = `${flag} Error...`; }
        });
    };

    document.getElementById('conf-send-btn')?.addEventListener('click', () => window.sendConfMessage());
    document.getElementById('conf-text-input')?.addEventListener('keypress', e => { if(e.key === 'Enter') window.sendConfMessage(); });

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        const confMicBtn = document.getElementById('main-conf-mic-btn');
        if (confMicBtn) {
            let confRec = new SpeechRecognition();
            confRec.continuous = false; confRec.interimResults = false;
            confRec.onstart = () => { confMicBtn.classList.add('text-red-500', 'animate-pulse'); };
            confRec.onend = () => { confMicBtn.classList.remove('text-red-500', 'animate-pulse'); };
            confRec.onerror = () => { confMicBtn.classList.remove('text-red-500', 'animate-pulse'); };
            confRec.onresult = (e) => { window.sendConfMessage(e.results[0][0].transcript); };
            confMicBtn.addEventListener('click', () => { 
                const me = window.profilesData ? window.profilesData['me'] : null;
                confRec.lang = document.getElementById('global-mic-lang')?.value || (me ? me.langCode : 'en-US'); 
                try { confRec.start(); } catch(e){} 
            });
        }

        const vrMicBtn = document.getElementById('vr-mic-btn');
        const vrPulse = document.getElementById('vr-pulse');
        const vrInput = document.getElementById('vr-text-input');
        if (vrMicBtn) {
            let vrRec = new SpeechRecognition();
            vrRec.continuous = false; vrRec.interimResults = false;
            vrRec.onstart = () => { vrMicBtn.classList.replace('bg-gray-200', 'bg-red-500'); vrMicBtn.classList.replace('dark:bg-slate-700', 'dark:bg-red-500'); if(vrPulse) vrPulse.classList.remove('hidden'); if(vrInput) vrInput.placeholder = "Listening..."; };
            vrRec.onend = () => { vrMicBtn.classList.replace('bg-red-500', 'bg-gray-200'); vrMicBtn.classList.replace('dark:bg-red-500', 'dark:bg-slate-700'); if(vrPulse) vrPulse.classList.add('hidden'); if(vrInput) vrInput.placeholder = "Type message or click mic..."; };
            vrRec.onerror = () => { vrMicBtn.classList.replace('bg-red-500', 'bg-gray-200'); vrMicBtn.classList.replace('dark:bg-red-500', 'dark:bg-slate-700'); if(vrPulse) vrPulse.classList.add('hidden'); };
            vrRec.onresult = (e) => { if(vrInput) vrInput.value = e.results[0][0].transcript; window.sendVRMessage(); };
            vrMicBtn.addEventListener('click', () => { vrRec.lang = 'az-AZ'; try { vrRec.start(); } catch(e){} });
        }
    }
});

window.sendVRMessage = async function() {
    const vrInput = document.getElementById('vr-text-input');
    if(!vrInput) return;
    const text = vrInput.value.trim();
    if (!text) return;
    vrInput.value = '';

    if (!window.isVrMarqueeEnabled) return; 
    const vrMarqueeContainer = document.getElementById('vr-marquee-container');
    const vrMarqueeText = document.getElementById('vr-marquee-text');
    if(vrMarqueeContainer) vrMarqueeContainer.style.display = 'block';
    if(vrMarqueeText) vrMarqueeText.innerHTML = `🌍 Translating...`;

    try {
        let translated = typeof window.translateText === 'function' ? await window.translateText(text, 'it') : text; 
        if(vrMarqueeText) vrMarqueeText.innerHTML = `<span class="text-indigo-600 dark:text-white font-normal">You:</span> 🇮🇹 ${translated} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span class="text-indigo-600 dark:text-white font-normal">You:</span> 🇮🇹 ${translated}`;
    } catch(e) { if(vrMarqueeText) vrMarqueeText.innerHTML = "Translation error"; }
};

document.getElementById('vr-send-btn')?.addEventListener('click', window.sendVRMessage);
document.getElementById('vr-text-input')?.addEventListener('keypress', e => { if(e.key === 'Enter') window.sendVRMessage(); });
