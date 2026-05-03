// ==========================================
// ЗОЛОТОЙ СТАНДАРТ: ЕДИНЫЙ ФАЙЛ
// Блок 1: ТРИ ТОЧКИ (Меню, Тема) + ГЛОБАЛЬНЫЙ ПЕРЕВОДЧИК ЭКОСИСТЕМЫ
// ==========================================

// --- 1. УПРАВЛЕНИЕ ВЫПАДАЮЩИМИ МЕНЮ ---
window.closeDropdown = function() {
    const menu = document.getElementById('menu-panel');
    const actions = document.getElementById('actions-panel');
    if (menu) { menu.classList.add('opacity-0', 'scale-95'); setTimeout(() => menu.classList.add('hidden'), 200); }
    if (actions) { actions.classList.add('opacity-0', 'scale-95'); setTimeout(() => actions.classList.add('hidden'), 200); }
};

window.togglePanel = function(panelId) {
    const panel = document.getElementById(panelId);
    if (!panel) return;
    
    // Закрываем другие панели, если открываем новую
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
        window.closeDropdown();
    }
};

// Слушатели для открытия меню
document.getElementById('header-menu-btn')?.addEventListener('click', (e) => { 
    e.stopPropagation(); 
    window.togglePanel('menu-panel'); 
});
// Клик в любом пустом месте закрывает меню
document.addEventListener('click', () => { window.closeDropdown(); });


// --- 2. СМЕНА ТЕМЫ (Темная / Светлая) ---
const themeToggleBtn = document.getElementById('menu-theme-toggle');
if (themeToggleBtn) {
    if (localStorage.getItem('hf_theme') === 'dark') {
        document.documentElement.classList.add('dark');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun w-6 text-yellow-400"></i> <span data-i18n="theme">Light Theme</span>';
    }

    themeToggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const htmlTag = document.documentElement;
        htmlTag.classList.toggle('dark');
        
        const isDark = htmlTag.classList.contains('dark');
        localStorage.setItem('hf_theme', isDark ? 'dark' : 'light');
        
        themeToggleBtn.innerHTML = isDark 
            ? '<i class="fa-solid fa-sun w-6 text-yellow-400"></i> <span data-i18n="theme">Light Theme</span>' 
            : '<i class="fa-solid fa-moon w-6 text-indigo-500"></i> <span data-i18n="theme">Dark Theme</span>';
        
        // После смены темы (если язык уже был переведен), текст может сброситься на английский.
        // Запускаем переводчик, чтобы вернуть нужный язык на кнопку:
        if (typeof window.applySystemLanguage === 'function') window.applySystemLanguage();
        
        window.closeDropdown();
    });
}


// --- 3. ГЛОБАЛЬНЫЙ СЛОВАРЬ (12 ЯЗЫКОВ) ---
window.appTranslations = {
    'en': { menu: "Settings", profile: "Profile", wallet: "Wallet", email_store: "Email Store", theme: "Change Theme", logout: "Logout", action_chat: "Private Chat", action_voice: "Voice Room", action_video: "App Video", action_email: "Send Email", action_cellular: "Phone Call", select_room_lang: "Room Language", cancel: "Cancel", save: "Save Profile", send: "Send Money", purchase: "Purchase Now", cv_edit_title: "Edit CV & Contacts", cv_country: "Country", cv_phone: "Phone Number", cv_email: "Email Address", cv_role: "Main Role", cv_prof: "Profession", cv_langs: "Languages", cv_exp: "Experience", cv_edu: "Education", cv_skills: "Core Competencies", cv_about: "About Me", cv_save_btn: "Save CV", prof_pop: "Population", prof_seas: "Seas", action_voice_msg: "Voice Msg", action_audio: "App Audio" },
    'ru': { menu: "Настройки", profile: "Мой Профиль", wallet: "Кошелек", email_store: "Email Стор", theme: "Сменить тему", logout: "Выйти", action_chat: "Личный чат", action_voice: "Голосовая", action_video: "App Видео", action_email: "Письмо", action_cellular: "Сотовый звонок", select_room_lang: "Язык комнаты", cancel: "Отмена", save: "Сохранить", send: "Отправить", purchase: "Купить", cv_edit_title: "Редактировать CV", cv_country: "Страна", cv_phone: "Номер телефона", cv_email: "Email адрес", cv_role: "Должность", cv_prof: "Профессия", cv_langs: "Языки", cv_exp: "Опыт работы", cv_edu: "Образование", cv_skills: "Ключевые навыки", cv_about: "О себе", cv_save_btn: "Сохранить CV", prof_pop: "Население", prof_seas: "Моря", action_voice_msg: "Голосовое", action_audio: "App Аудио" },
    'az': { menu: "Tənzimləmələr", profile: "Profilim", wallet: "Pul kisəsi", email_store: "Email Mağaza", theme: "Mövzunu dəyiş", logout: "Çıxış", action_chat: "Şəxsi Çat", action_voice: "Səsli Otaq", action_video: "App Video", action_email: "Email Göndər", action_cellular: "Mobil Zəng", select_room_lang: "Otaq Dili", cancel: "Ləğv et", save: "Yadda saxla", send: "Göndər", purchase: "Al", cv_edit_title: "CV-ni Yenilə", cv_country: "Ölkə", cv_phone: "Telefon", cv_email: "Email", cv_role: "Vəzifə", cv_prof: "Peşə", cv_langs: "Dillər", cv_exp: "İş təcrübəsi", cv_edu: "Təhsil", cv_skills: "Əsas bacarıqlar", cv_about: "Haqqımda", cv_save_btn: "CV-ni Saxla", prof_pop: "Əhali", prof_seas: "Dənizlər", action_voice_msg: "Səsli Mesaj", action_audio: "App Audio" },
    'de': { menu: "Einstellungen", profile: "Mein Profil", wallet: "Brieftasche", email_store: "E-Mail Shop", theme: "Design ändern", logout: "Abmelden", action_chat: "Privater Chat", action_voice: "Sprachraum", action_video: "App Video", action_email: "E-Mail senden", action_cellular: "Handyanruf", select_room_lang: "Raumsprache", cancel: "Abbrechen", save: "Speichern", send: "Geld senden", purchase: "Kaufen", cv_edit_title: "Lebenslauf bearbeiten", cv_country: "Land", cv_phone: "Telefonnummer", cv_email: "E-Mail", cv_role: "Rolle", cv_prof: "Beruf", cv_langs: "Sprachen", cv_exp: "Berufserfahrung", cv_edu: "Bildung", cv_skills: "Kernkompetenzen", cv_about: "Über mich", cv_save_btn: "Lebenslauf speichern", prof_pop: "Bevölkerung", prof_seas: "Meere", action_voice_msg: "Sprachnachricht", action_audio: "App Audio" },
    'it': { menu: "Impostazioni", profile: "Il mio Profilo", wallet: "Portafoglio", email_store: "Negozio Email", theme: "Cambia Tema", logout: "Esci", action_chat: "Chat Privata", action_voice: "Stanza Vocale", action_video: "App Video", action_email: "Invia Email", action_cellular: "Chiamata", select_room_lang: "Lingua Stanza", cancel: "Annulla", save: "Salva", send: "Invia Denaro", purchase: "Acquista", cv_edit_title: "Modifica CV", cv_country: "Paese", cv_phone: "Telefono", cv_email: "Email", cv_role: "Ruolo", cv_prof: "Professione", cv_langs: "Lingue", cv_exp: "Esperienza", cv_edu: "Istruzione", cv_skills: "Competenze", cv_about: "Su di me", cv_save_btn: "Salva CV", prof_pop: "Popolazione", prof_seas: "Mari", action_voice_msg: "Messaggio Vocale", action_audio: "App Audio" },
    'tr': { menu: "Ayarlar", profile: "Profilim", wallet: "Cüzdan", email_store: "E-posta Mağazası", theme: "Temayı Değiştir", logout: "Çıkış Yap", action_chat: "Özel Sohbet", action_voice: "Sesli Oda", action_video: "App Video", action_email: "E-posta Gönder", action_cellular: "Hücresel Arama", select_room_lang: "Oda Dili", cancel: "İptal", save: "Kaydet", send: "Gönder", purchase: "Satın Al", cv_edit_title: "CV Düzenle", cv_country: "Ülke", cv_phone: "Telefon", cv_email: "E-posta", cv_role: "Rol", cv_prof: "Meslek", cv_langs: "Diller", cv_exp: "Deneyim", cv_edu: "Eğitim", cv_skills: "Yetenekler", cv_about: "Hakkımda", cv_save_btn: "CV'yi Kaydet", prof_pop: "Nüfus", prof_seas: "Denizler", action_voice_msg: "Sesli Mesaj", action_audio: "App Ses" },
    'es': { menu: "Ajustes", profile: "Mi Perfil", wallet: "Billetera", email_store: "Tienda Email", theme: "Cambiar Tema", logout: "Salir", action_chat: "Chat Privado", action_voice: "Sala de Voz", action_video: "App Video", action_email: "Enviar Email", action_cellular: "Llamada celular", select_room_lang: "Idioma de sala", cancel: "Cancelar", save: "Guardar", send: "Enviar", purchase: "Comprar", cv_edit_title: "Editar CV", cv_country: "País", cv_phone: "Teléfono", cv_email: "Correo", cv_role: "Rol", cv_prof: "Profesión", cv_langs: "Idiomas", cv_exp: "Experiencia", cv_edu: "Educación", cv_skills: "Habilidades", cv_about: "Sobre mí", cv_save_btn: "Guardar CV", prof_pop: "Población", prof_seas: "Mares", action_voice_msg: "Mensaje de Voz", action_audio: "App Audio" },
    'fr': { menu: "Paramètres", profile: "Mon Profil", wallet: "Portefeuille", email_store: "Boutique Email", theme: "Changer de thème", logout: "Déconnexion", action_chat: "Chat Privé", action_voice: "Salon Vocal", action_video: "App Vidéo", action_email: "Envoyer Email", action_cellular: "Appel Mobile", select_room_lang: "Langue du salon", cancel: "Annuler", save: "Enregistrer", send: "Envoyer", purchase: "Acheter", cv_edit_title: "Modifier le CV", cv_country: "Pays", cv_phone: "Téléphone", cv_email: "E-mail", cv_role: "Rôle", cv_prof: "Profession", cv_langs: "Langues", cv_exp: "Expérience", cv_edu: "Éducation", cv_skills: "Compétences", cv_about: "À propos de moi", cv_save_btn: "Enregistrer le CV", prof_pop: "Population", prof_seas: "Mers", action_voice_msg: "Message Vocal", action_audio: "App Audio" },
    'pt': { menu: "Configurações", profile: "Meu Perfil", wallet: "Carteira", email_store: "Loja Email", theme: "Mudar Tema", logout: "Sair", action_chat: "Chat Privado", action_voice: "Sala de Voz", action_video: "App Vídeo", action_email: "Enviar Email", action_cellular: "Chamada", select_room_lang: "Idioma da Sala", cancel: "Cancelar", save: "Salvar", send: "Enviar", purchase: "Comprar", cv_edit_title: "Editar CV", cv_country: "País", cv_phone: "Telefone", cv_email: "Email", cv_role: "Cargo", cv_prof: "Profissão", cv_langs: "Idiomas", cv_exp: "Experiência", cv_edu: "Educação", cv_skills: "Habilidades", cv_about: "Sobre mim", cv_save_btn: "Salvar CV", prof_pop: "População", prof_seas: "Mares", action_voice_msg: "Mensagem de Voz", action_audio: "App Áudio" },
    'ar': { menu: "إعدادات", profile: "ملفي الشخصي", wallet: "محفظة", email_store: "متجر البريد", theme: "تغيير المظهر", logout: "خروج", action_chat: "دردشة خاصة", action_voice: "غرفة صوتية", action_video: "تطبيق فيديو", action_email: "إرسال بريد", action_cellular: "مكالمة خلوية", select_room_lang: "لغة الغرفة", cancel: "إلغاء", save: "حفظ", send: "إرسال", purchase: "شراء", cv_edit_title: "تعديل السيرة الذاتية", cv_country: "دولة", cv_phone: "رقم الهاتف", cv_email: "البريد الإلكتروني", cv_role: "دور", cv_prof: "مهنة", cv_langs: "اللغات", cv_exp: "خبرة", cv_edu: "تعليم", cv_skills: "مهارات", cv_about: "عني", cv_save_btn: "حفظ السيرة الذاتية", prof_pop: "تعداد السكان", prof_seas: "بحار", action_voice_msg: "رسالة صوتية", action_audio: "تطبيق صوتي" },
    'zh': { menu: "设置", profile: "我的主页", wallet: "钱包", email_store: "邮箱商店", theme: "更改主题", logout: "登出", action_chat: "私聊", action_voice: "语音室", action_video: "应用视频", action_email: "发送邮件", action_cellular: "拨打电话", select_room_lang: "房间语言", cancel: "取消", save: "保存", send: "发送金钱", purchase: "立即购买", cv_edit_title: "编辑简历", cv_country: "国家", cv_phone: "电话", cv_email: "电子邮件", cv_role: "角色", cv_prof: "职业", cv_langs: "语言", cv_exp: "经验", cv_edu: "教育", cv_skills: "技能", cv_about: "关于我", cv_save_btn: "保存简历", prof_pop: "人口", prof_seas: "海洋", action_voice_msg: "语音留言", action_audio: "应用音频" },
    'ja': { menu: "設定", profile: "マイプロフィール", wallet: "ウォレット", email_store: "メールストア", theme: "テーマ変更", logout: "ログアウト", action_chat: "プライベートチャット", action_voice: "ボイスルーム", action_video: "アプリビデオ", action_email: "メール送信", action_cellular: "電話をかける", select_room_lang: "ルームの言語", cancel: "キャンセル", save: "保存", send: "送金", purchase: "購入する", cv_edit_title: "履歴書と連絡先の編集", cv_country: "国", cv_phone: "電話番号", cv_email: "メールアドレス", cv_role: "役割", cv_prof: "職業", cv_langs: "言語", cv_exp: "経験", cv_edu: "教育", cv_skills: "スキル", cv_about: "自己紹介", cv_save_btn: "履歴書を保存", prof_pop: "人口", prof_seas: "海", action_voice_msg: "ボイスメッセージ", action_audio: "アプリオーディオ" }
};

// --- 4. ДВИЖОК ПЕРЕВОДА И АВТООПРЕДЕЛЕНИЯ ---
window.currentAppLang = localStorage.getItem('hf_ecosystem_lang') || 'auto';

window.getLangFromPrefix = function(phoneOrFlag) {
    if (!phoneOrFlag) return 'en';
    const codeMap = { 'az': 'az', 'ru': 'ru', 'de': 'de', 'it': 'it', 'gb': 'en', 'us': 'en', 'tr': 'tr', 'es': 'es', 'fr': 'fr', 'ae': 'ar', 'cn': 'zh', 'ja': 'ja', 'pt': 'pt' };
    if (codeMap[phoneOrFlag.toLowerCase()]) return codeMap[phoneOrFlag.toLowerCase()];

    if (phoneOrFlag.startsWith('+994')) return 'az';
    if (phoneOrFlag.startsWith('+7')) return 'ru';
    if (phoneOrFlag.startsWith('+49')) return 'de';
    if (phoneOrFlag.startsWith('+39')) return 'it';
    if (phoneOrFlag.startsWith('+44') || phoneOrFlag.startsWith('+1')) return 'en';
    if (phoneOrFlag.startsWith('+90')) return 'tr';
    if (phoneOrFlag.startsWith('+34')) return 'es';
    if (phoneOrFlag.startsWith('+33')) return 'fr';
    if (phoneOrFlag.startsWith('+351')) return 'pt';
    if (phoneOrFlag.startsWith('+971')) return 'ar';
    if (phoneOrFlag.startsWith('+86')) return 'zh';
    if (phoneOrFlag.startsWith('+81')) return 'ja';
    return 'en';
};

window.applySystemLanguage = function() {
    let langToApply = window.currentAppLang;
    if (langToApply === 'auto') {
        if (window.myProfileInfo && window.myProfileInfo.phone) {
            langToApply = window.getLangFromPrefix(window.myProfileInfo.phone);
        } else if (window.myProfileInfo && window.myProfileInfo.flagCode) {
            langToApply = window.getLangFromPrefix(window.myProfileInfo.flagCode);
        } else {
            let navLang = (navigator.language || navigator.userLanguage).split('-')[0];
            langToApply = window.appTranslations[navLang] ? navLang : 'en';
        }
    }
    if (!window.appTranslations[langToApply]) langToApply = 'en';
    const dict = window.appTranslations[langToApply];

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) el.innerHTML = dict[key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (dict[key]) el.placeholder = dict[key];
    });
};

// --- 5. СМЕНА ЯЗЫКА ИЗ МЕНЮ "ТРИ ТОЧКИ" ---
window.changeAppLanguage = function(langCode) {
    window.currentAppLang = langCode;
    localStorage.setItem('hf_ecosystem_lang', langCode);
    window.applySystemLanguage();
    window.closeDropdown();
};

// --- 6. ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ---
document.addEventListener('DOMContentLoaded', () => {
    const langSelect = document.getElementById('app-lang-select');
    if (langSelect) langSelect.value = window.currentAppLang;
    setTimeout(() => { window.applySystemLanguage(); }, 500);
});

// --- 1. ФИКС ТЕМНОЙ ТЕМЫ ДЛЯ МЕНЮ И СТИЛИ ПРОФИЛЯ ---
const profileStyles = document.createElement('style');
profileStyles.innerHTML = `
    .dark #app-lang-select option { background-color: #1e293b; color: white; }
    .dark #app-lang-select { color: white; background-color: transparent; }
    
    .avatar-upload-wrap { position: relative; cursor: pointer; display: inline-block; }
    .avatar-upload-wrap:hover .camera-overlay { opacity: 1; }
    .camera-overlay { 
        position: absolute; inset: 0; background: rgba(0,0,0,0.5); 
        border-radius: 50%; display: flex; align-items: center; justify-content: center; 
        opacity: 0; transition: 0.3s; color: white; font-size: 1.5rem;
    }
`;
document.head.appendChild(profileStyles);

// --- 2. ИЗОЛИРОВАННЫЙ ПРОФИЛЬ (Личные данные + География) ---
window.openMyProfile = function() {
    if (!window.myProfileInfo) return alert("Пожалуйста, авторизуйтесь!");
    window.closeDropdown(); 
    
    const user = window.myProfileInfo;
    
    let modal = document.getElementById('profile-modal-container');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'profile-modal-container';
        modal.className = 'fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[10000] flex justify-center items-center p-4 transition-opacity';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="bg-white dark:bg-slate-800 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden relative flex flex-col md:flex-row" onclick="event.stopPropagation()">
            <button onclick="document.getElementById('profile-modal-container').remove()" class="absolute top-4 right-4 w-8 h-8 bg-gray-100 dark:bg-slate-700 hover:bg-red-500 hover:text-white text-gray-500 dark:text-gray-300 rounded-full flex items-center justify-center transition-colors z-50"><i class="fa-solid fa-xmark"></i></button>

            <!-- Левая колонка: Фото и Статус -->
            <div class="bg-gray-50 dark:bg-slate-900/50 p-8 flex flex-col items-center border-r border-gray-200 dark:border-slate-700 w-full md:w-2/5 text-center relative">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6" data-i18n="profile">Profile</h2>
                
                <!-- Замена фото (Фотоаппарат) -->
                <div class="avatar-upload-wrap w-32 h-32 mb-4" onclick="document.getElementById('attachment-input').click()">
                    <img src="${user.photo || 'https://ui-avatars.com/api/?name=U'}" class="w-full h-full rounded-full object-cover border-4 border-indigo-500 shadow-md">
                    <div class="camera-overlay"><i class="fa-solid fa-camera"></i></div>
                </div>
                
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">${user.name}</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-slate-800 px-3 py-1 rounded-full"><i class="fa-solid fa-lock text-green-500"></i> Personal Info</p>

                <!-- Создатель -->
                <div class="mt-auto flex flex-col items-center gap-2 pt-8 border-t border-gray-200 dark:border-slate-700 w-full">
                   <img src="ilgar.jpg" class="w-6 h-6 rounded-full object-cover border border-indigo-500">
                    <div class="text-center">
                        <p class="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">Создатель Messenger</p>
                        <p class="text-xs font-bold text-gray-800 dark:text-white">HELLO FRIENDS</p>
                    </div>
                </div>
            </div>

            <!-- Правая колонка: Основные + География -->
            <div class="p-8 w-full md:w-3/5 flex flex-col justify-center space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">Имя пользователя</label>
                        <input type="text" id="prof-name" value="${user.name || ''}" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-indigo-500">
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">E-mail адрес</label>
                        <input type="email" id="prof-email" value="${user.email || ''}" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-indigo-500">
                    </div>
                </div>
                
                <div>
                    <label class="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">Номер телефона</label>
                    <div class="flex">
                        <span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-400 rounded-l-xl"><i class="fa-solid fa-phone"></i></span>
                        <input type="text" id="prof-phone" value="${user.phone || ''}" class="rounded-none rounded-r-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white block flex-1 min-w-0 w-full px-4 py-3 outline-none focus:border-indigo-500">
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">Население (Population)</label>
                        <input type="text" id="prof-pop" value="${user.population || ''}" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-indigo-500">
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">Моря (Seas)</label>
                        <input type="text" id="prof-seas" value="${user.seas || ''}" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-indigo-500">
                    </div>
                </div>

                <button onclick="saveProfileData()" class="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all" data-i18n="save">Сохранить Профиль</button>
            </div>
        </div>
    `;
    window.applySystemLanguage();
};

window.saveProfileData = function() {
    const btn = event.target; btn.disabled = true;
    const data = {
        name: document.getElementById('prof-name').value.trim(),
        email: document.getElementById('prof-email').value.trim(),
        phone: document.getElementById('prof-phone').value.trim(),
        population: document.getElementById('prof-pop').value.trim(),
        seas: document.getElementById('prof-seas').value.trim()
    };
    if (window.firebase) {
        firebase.database().ref('users/' + window.myProfileInfo.id).update(data).then(() => {
            Object.assign(window.myProfileInfo, data);
            document.getElementById('profile-modal-container').remove();
            if(typeof window.renderMainScreenAvatars === 'function') window.renderMainScreenAvatars(window.appUsers, window.myProfileInfo.id);
        });
    }
};

  // Главная функция: вызывается, когда Firebase подтвердил вход
window.onUserAuthenticated = function(firebaseUser) {
    const userRef = firebase.database().ref('users/' + firebaseUser.uid);
    
    userRef.once('value').then((snapshot) => {
        let userData = snapshot.val();
        
        // Если пользователя еще нет в базе — создаем его
        if (!userData) {
            const isOwner = (firebaseUser.phoneNumber === "+994503398020");
            
            userData = {
                id: firebaseUser.uid,
                name: isOwner ? "Ilgar (Owner)" : (firebaseUser.displayName || "New User"),
                email: firebaseUser.email || "",
                photo: firebaseUser.photoURL || "https://ui-avatars.com/api/?name=" + (isOwner ? "I" : "U"),
                phone: firebaseUser.phoneNumber || "",
                country: isOwner ? "Azerbaijan" : "Unknown",
                flag: isOwner ? "🇦🇿" : "🌍",
                flagCode: isOwner ? "az" : "en",
                langCode: isOwner ? "az" : "en",
                profileLangs: isOwner ? "ru, az, en" : "en"
            };
            userRef.set(userData);
        }

        // Сохраняем в память нашего Единого Мозга
        window.myProfileInfo = userData;
        
        // Сразу обновляем интерфейс, если другие блоки уже загружены
        if (window.appUsers && typeof window.renderMainScreenAvatars === 'function') {
            window.renderMainScreenAvatars(window.appUsers, userData.id);
        }
        
        // Убираем экран блокировки
        const lockScreen = document.getElementById('security-lock');
        const appWrapper = document.getElementById('app-wrapper');
        if(lockScreen) lockScreen.classList.add('opacity-0');
        setTimeout(() => {
            if(lockScreen) lockScreen.classList.add('hidden');
            if(appWrapper) appWrapper.classList.remove('opacity-0');
            
            // Запускаем чат по умолчанию (Global)
            if (typeof window.switchWebChat === 'function') window.switchWebChat('global');
        }, 500);
    });
};

// Отслеживание состояния входа в реальном времени
firebase.auth().onAuthStateChanged((user) => {
    const spinner = document.getElementById('auth-spinner');
    const loginBox = document.getElementById('auth-login-box');
    
    if (user) {
        window.onUserAuthenticated(user);
    } else {
        // Если не авторизован — показываем окно входа
        if(spinner && loginBox) {
            spinner.classList.add('hidden'); spinner.classList.remove('flex');
            loginBox.classList.remove('hidden'); loginBox.classList.add('flex');
        }
        window.myProfileInfo = null;
    }
});

// --- Функции Входа и Выхода ---

window.signInWithGoogle = function() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).catch(err => {
        alert('Google Sign-In Error: ' + err.message);
        location.reload();
    });
};

window.signOutGoogle = function() {
    firebase.auth().signOut().then(() => {
        location.reload(); // Перезагружаем для полной очистки сессии
    });
};

// --- Вход по номеру телефона (SMS) ---
window.sendPhoneCode = function() {
    const phoneInput = document.getElementById('auth-phone-input');
    if(!phoneInput) return;
    const phoneNumber = phoneInput.value.trim();
    if(!phoneNumber) return alert('Пожалуйста, введите номер телефона');
    
    const btn = document.getElementById('auth-phone-send-btn');
    if(btn) btn.innerText = 'Отправка...';
    
    if(window.recaptchaVerifier) window.recaptchaVerifier.clear();
    document.getElementById('recaptcha-container').innerHTML = '';
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', { 'size': 'invisible' });
    
    firebase.auth().signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier)
        .then((confirmationResult) => {
            window.confirmationResult = confirmationResult;
            if(btn) btn.innerText = 'SMS Отправлено!';
            const codeSection = document.getElementById('auth-code-section');
            if(codeSection) codeSection.classList.remove('hidden');
        }).catch((error) => { 
            alert('Ошибка: ' + error.message); 
            if(btn) btn.innerText = 'Send SMS';
        });
};

window.verifyPhoneCode = function() {
    const codeInput = document.getElementById('auth-code-input');
    if(!codeInput) return;
    const code = codeInput.value;
    if(code.length === 6 && window.confirmationResult) {
        window.confirmationResult.confirm(code).then(() => { 
            if(typeof window.closeAuthModal === 'function') window.closeAuthModal(); 
        }).catch(e => alert('Неверный код: ' + e.message));
    }
};

// Переключение вкладок в модалке авторизации (Phone / Email)
window.switchAuthTab = function(type) {
    const tabEmail = document.getElementById('tab-email'); const tabPhone = document.getElementById('tab-phone');
    const formEmail = document.getElementById('auth-email-form'); const formPhone = document.getElementById('auth-phone-form');
    if(!tabEmail || !tabPhone || !formEmail || !formPhone) return;

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
// ==========================================
// ЗОЛОТОЙ СТАНДАРТ: ЕДИНЫЙ ФАЙЛ
// Блок 3: WEB-UI-SYNC (Вкладки, Модалки, Геолокация)
// ==========================================

// --- Переключение основных вкладок (Chat, Profession, Archive) ---
window.switchTab = function(tabName) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active', 'bg-indigo-600', 'text-white');
        link.classList.add('text-gray-700', 'dark:text-gray-300');
    });
    
    const activeBtn = document.querySelector(`.nav-link[data-target="${tabName}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active', 'bg-indigo-600', 'text-white');
        activeBtn.classList.remove('text-gray-700', 'dark:text-gray-300');
    }
    
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
    const targetSection = document.getElementById(tabName);
    if (targetSection) targetSection.classList.add('active');
    
    window.closeDropdown();
};

// Привязываем клики по навигации
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        window.switchTab(this.getAttribute('data-target'));
    });
});

// --- Универсальная логика Модальных окон ---
window.openModal = function(modalId) {
    window.closeDropdown();
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden'); 
        modal.classList.add('flex');
        setTimeout(() => { 
            modal.classList.remove('opacity-0'); 
            modal.querySelector('div')?.classList.remove('scale-95'); 
        }, 10);
    }
};

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('opacity-0'); 
        modal.querySelector('div')?.classList.add('scale-95');
        setTimeout(() => { 
            modal.classList.add('hidden'); 
            modal.classList.remove('flex'); 
        }, 300);
    }
};

// --- Быстрые вызовы модалок ---
window.openTrashModal = () => openModal('trash-modal');
window.closeTrashModal = () => closeModal('trash-modal');
window.openEmailModal = () => openModal('email-modal');
window.closeEmailModal = () => closeModal('email-modal');
window.openAvatarActionsModal = () => openModal('avatar-actions-modal');
window.closeAvatarActionsModal = () => closeModal('avatar-actions-modal');
window.openPersonalLangModal = () => openModal('personal-lang-modal');
window.closePersonalLangModal = () => closeModal('personal-lang-modal');
window.openBankTransferModal = () => openModal('transfer-modal');
window.closeBankTransferModal = () => closeModal('transfer-modal');
window.openSearchModal = () => openModal('search-modal');
window.closeSearchModal = () => { closeModal('search-modal'); if(typeof window.resetGlobalSearch === 'function') window.resetGlobalSearch(); };
window.openAuthModal = () => openModal('auth-modal');
window.closeAuthModal = () => closeModal('auth-modal');
window.openPhoneChoiceModal = () => openModal('phone-choice-modal');
window.closePhoneChoiceModal = () => closeModal('phone-choice-modal');

// --- Геолокация ---
window.openLocationModal = () => {
    openModal('location-modal');
    const mapContainer = document.getElementById('location-map');
    if(mapContainer) {
        mapContainer.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-2xl text-indigo-500 mb-2"></i><span>Detecting location...</span>';
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude; const lon = position.coords.longitude;
                    mapContainer.innerHTML = `<iframe width="100%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.01}%2C${lat-0.01}%2C${lon+0.01}%2C${lat+0.01}&amp;layer=mapnik&amp;marker=${lat}%2C${lon}" style="border-radius: 8px;"></iframe>`;
                },
                () => { mapContainer.innerHTML = '<span class="text-red-400">Failed to get location. Allow access.</span>'; }
            );
        } else { mapContainer.innerHTML = 'Geolocation is not supported.'; }
    }
};
window.closeLocationModal = () => closeModal('location-modal');

// --- Управление Оверлеями Звонков (Calls) ---
window.openConference = function() { 
    window.closeDropdown(); 
    const overlay = document.getElementById('conference-overlay');
    if(overlay) overlay.style.display = 'flex'; 
};

window.openVoiceChat = function() { 
    window.closeDropdown(); 
    const overlay = document.getElementById('voice-overlay');
    if(overlay) overlay.style.display = 'flex'; 
};

window.closeCalls = function() { 
    const confOverlay = document.getElementById('conference-overlay'); 
    const voiceOverlay = document.getElementById('voice-overlay');
    if(confOverlay) confOverlay.style.display = 'none'; 
    if(voiceOverlay) voiceOverlay.style.display = 'none'; 
};

window.startInAppCall = function() { window.closePhoneChoiceModal(); setTimeout(() => { window.openVoiceChat(); }, 300); };
window.startExternalCall = function() { window.closePhoneChoiceModal(); window.location.href = "tel:+994501234567"; };

// ==========================================
// ЗОЛОТОЙ СТАНДАРТ: ЕДИНЫЙ ФАЙЛ
// Блок 5: ГЛАВНЫЙ ЭКРАН И АВАТАРЫ ИЗ БАЗЫ
// ==========================================

window.renderMainScreenAvatars = function(usersObj) {
    const container = document.getElementById('main-avatars-container');
    if (!container) return;

    // Сначала всегда добавляем иконки Global и AI
    let html = `
        <div onclick="switchWebChat('global')" class="flex flex-col items-center text-center w-20 md:w-24 cursor-pointer group">
            <div class="w-20 h-20 rounded-full bg-indigo-500 mb-2 flex justify-center items-center text-white text-3xl font-bold group-hover:scale-110 transition-transform shadow-md border-4 border-white dark:border-slate-800">🌍</div>
            <p class="font-semibold text-sm text-indigo-500">Group</p>
        </div>
        
        <div onclick="switchWebChat('ai')" class="flex flex-col items-center text-center w-20 md:w-24 cursor-pointer group">
            <div class="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 mb-2 flex justify-center items-center text-white text-3xl font-bold group-hover:scale-110 transition-transform shadow-lg border-4 border-purple-300">🤖</div>
            <p class="font-bold text-sm text-purple-600 dark:text-purple-400">AI Assistant</p>
        </div>
    `;

    // Теперь перебираем реальных пользователей из базы
    if (usersObj) {
        Object.keys(usersObj).forEach(uid => {
            const user = usersObj[uid];
            if (!user.name) return;

            // Если это ты сам (Saved Messages)
            if (window.myProfileInfo && uid === window.myProfileInfo.id) {
                html += `
                    <div onclick="switchWebChat('me')" class="flex flex-col items-center text-center w-20 md:w-24 cursor-pointer group">
                        <img src="${user.photo || 'https://ui-avatars.com/api/?name=I'}" class="w-20 h-20 rounded-full object-cover mb-2 group-hover:scale-110 transition-transform duration-300 shadow-md border-4 border-indigo-400">
                        <p class="font-semibold text-sm">${user.name.split(' ')[0]} (You)</p>
                        <div class="flex items-center gap-1.5 mt-1">
                            <img src="https://flagcdn.com/w20/${user.flagCode || 'az'}.png" class="h-3 rounded-sm">
                            <p class="text-[10px] text-gray-500">Saved</p>
                        </div>
                    </div>
                `;
            } else {
                // Остальные пользователи (КЛИК ПО НИМ ОТКРЫВАЕТ МЕНЮ ЗНАКОМСТВА)
                html += `
                    <div onclick="openAvatarModal('${uid}', 'cv')" class="flex flex-col items-center text-center w-20 md:w-24 cursor-pointer group relative">
                        <img src="${user.photo || 'https://ui-avatars.com/api/?name=U'}" class="w-20 h-20 rounded-full object-cover mb-2 group-hover:scale-110 transition-transform duration-300 shadow-md border-4 border-white dark:border-slate-800">
                        <div class="absolute bottom-6 right-2 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
                        <p class="font-semibold text-sm text-gray-800 dark:text-white">${user.name.split(' ')[0]}</p>
                        <div class="flex items-center gap-1.5 mt-1">
                            <img src="https://flagcdn.com/w20/${user.flagCode || 'de'}.png" class="h-3 rounded-sm">
                            <p class="text-[10px] text-gray-500">${user.country || 'Global'}</p>
                        </div>
                    </div>
                `;
            }
        });
    }

    container.innerHTML = html;
};

// ==========================================
// ИДЕАЛЬНЫЙ МОСТ: ОДИН МОЗГ, ДВА ТЕЛА
// ==========================================
firebase.database().ref('users').on('value', snapshot => {
    if(snapshot.exists()) {
        window.appUsers = snapshot.val();
        
        // 1. Мгновенно обновляем твой профиль в памяти сайта, если ты изменил его с мобилки
        if (window.myProfileInfo && window.myProfileInfo.id && window.appUsers[window.myProfileInfo.id]) {
            window.myProfileInfo = window.appUsers[window.myProfileInfo.id];
        }

        // 2. Перерисовываем Аватары и Сообщество (CV)
        if(typeof window.renderMainScreenAvatars === 'function') window.renderMainScreenAvatars(window.appUsers);
        if(typeof window.renderProfessionSection === 'function') window.renderProfessionSection(window.appUsers);
        
        // 3. Заставляем систему перевести новые карточки на лету!
        setTimeout(() => {
            if(typeof window.applySystemLanguage === 'function') window.applySystemLanguage();
        }, 100);
    }
});

// ==========================================
// ЗОЛОТОЙ СТАНДАРТ: ЕДИНЫЙ ФАЙЛ
// Блок 7: PROFESSIONAL COMMUNITY (Строгий WEB-дизайн)
// ==========================================

// 1. Создаем контейнеры для модальных окон
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('cv-modals-wrapper')) {
        const modalsContainer = document.createElement('div');
        modalsContainer.id = 'cv-modals-wrapper';
        document.body.appendChild(modalsContainer);
    }
});

// 2. Генерация Главной Сетки (Чистый веб-дизайн, поддержка темной/светлой темы)
window.renderProfessionSection = function(usersObj) {
    const cvContainer = document.getElementById('profession');
    if (!cvContainer) return;

    let html = `
        <div class="max-w-6xl mx-auto p-4 md:p-6">
            <div class="flex justify-between items-center mb-8">
                <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Professional Community</h2>
                <button onclick="openEditCVModal()" class="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-600/20 dark:hover:bg-indigo-600/40 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/50 px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm">
                    <i class="fa-solid fa-pen-to-square"></i> Edit Profile
                </button>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
    `;

    Object.keys(usersObj).forEach(uid => {
        const user = usersObj[uid];
        if (!user.name) return;
        
        const cv = user.cv || {};
        const role = cv.role || 'Professional';
        
        // Карточка в стиле веб
        html += `
            <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl p-6 flex flex-col items-center relative overflow-hidden group hover:shadow-xl hover:border-indigo-500/50 transition-all duration-300">
                
                <div onclick="openDetailedCV('${uid}')" class="relative w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-gray-50 dark:border-slate-700 shadow-sm mb-4 cursor-pointer overflow-hidden transform group-hover:scale-105 transition-transform">
                    <img src="${user.photo || 'https://ui-avatars.com/api/?name=U'}" class="w-full h-full object-cover">
                </div>
                
                <h3 class="font-bold text-gray-900 dark:text-white text-lg text-center w-full truncate">${user.name.split(' ')[0]}</h3>
                <p class="text-xs text-indigo-500 dark:text-indigo-400 mb-5 font-medium uppercase tracking-wide text-center w-full truncate">${role}</p>
                
                <button onclick="openDetailedCV('${uid}')" class="w-full bg-gray-50 hover:bg-gray-100 dark:bg-slate-700/50 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 font-semibold text-sm py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 transition-colors">
                    View CV
                </button>
            </div>
        `;
    });

    html += `</div></div>`;
    cvContainer.innerHTML = html;
};

// --- 3. ИЗОЛИРОВАННОЕ ПРОФЕССИОНАЛЬНОЕ CV И СМАРТ-КНОПКИ ---

window.openDetailedCV = function(uid) {
    const user = window.appUsers[uid];
    if (!user) return;
    const cv = user.cv || {};
    const wrapper = document.getElementById('cv-modals-wrapper') || document.body;
    
    let modalContainer = document.getElementById('detailed-cv-modal');
    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'detailed-cv-modal';
        modalContainer.className = 'fixed inset-0 bg-gray-900/70 backdrop-blur-sm z-[10000] flex justify-center items-center p-4 transition-opacity';
        wrapper.appendChild(modalContainer);
    }

    modalContainer.innerHTML = `
        <div class="bg-[#1e293b] w-full max-w-2xl rounded-3xl border border-[#334155] shadow-2xl overflow-hidden relative" onclick="event.stopPropagation()">
            <div class="p-6 md:p-8 bg-gradient-to-b from-[#1e3a8a]/60 to-[#1e293b] border-b border-[#334155]">
                <div class="flex items-center gap-6">
                    <img src="${user.photo || 'https://ui-avatars.com/api/?name=U'}" class="w-24 h-24 rounded-full border-4 border-white/10 shadow-lg object-cover">
                    <div>
                        <h2 class="text-2xl md:text-3xl font-bold text-white mb-1 flex items-center gap-2">
                            ${user.name} <span class="bg-indigo-500 text-white text-[10px] uppercase px-2 py-0.5 rounded-full">Pro</span>
                        </h2>
                        <p class="text-blue-400 font-semibold md:text-lg">${cv.role || 'Professional'}</p>
                    </div>
                </div>
            </div>

            <!-- ИНФОРМАЦИЯ: Только Профессия, Языки и Контакты -->
            <div class="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8">
                <div>
                    <p class="text-gray-400 text-xs flex items-center gap-2 mb-1"><i class="fa-solid fa-briefcase"></i> Profession</p>
                    <p class="text-white font-semibold text-sm">${cv.profession || 'Not specified'}</p>
                </div>
                <div>
                    <p class="text-gray-400 text-xs flex items-center gap-2 mb-1"><i class="fa-solid fa-language"></i> Languages</p>
                    <p class="text-white font-semibold text-sm">${cv.languages || user.profileLangs || 'Not specified'}</p>
                </div>
                <div>
                    <p class="text-gray-400 text-xs flex items-center gap-2 mb-1"><i class="fa-solid fa-phone"></i> Phone Number</p>
                    <p class="text-white font-semibold text-sm">${user.phone || 'Hidden'}</p>
                </div>
                <div>
                    <p class="text-gray-400 text-xs flex items-center gap-2 mb-1"><i class="fa-solid fa-envelope"></i> Email Address</p>
                    <p class="text-white font-semibold text-sm">${user.email || 'Hidden'}</p>
                </div>
            </div>

            <div class="px-6 md:px-8 pb-6 space-y-4">
                ${cv.about ? `
                <div class="bg-[#0f172a]/80 p-4 rounded-xl border border-[#334155]">
                    <h4 class="text-gray-400 text-[10px] mb-2 uppercase font-bold tracking-wider">About Profession</h4>
                    <p class="text-gray-200 text-xs leading-relaxed">${cv.about}</p>
                </div>` : ''}
                ${cv.skills ? `
                <div class="bg-[#0f172a]/80 p-4 rounded-xl border border-[#334155]">
                    <h4 class="text-gray-400 text-[10px] mb-2 uppercase font-bold tracking-wider">Work Skills</h4>
                    <p class="text-blue-300 text-xs font-medium">${cv.skills}</p>
                </div>` : ''}
            </div>

            <!-- СМАРТ КНОПКИ -->
            <div class="p-6 bg-[#0f172a] border-t border-[#334155] flex gap-3">
                <button onclick="actionPrivateChatFromCV('${uid}')" class="flex-1 bg-[#3b82f6] hover:bg-blue-600 text-white font-bold py-2.5 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2"><i class="fa-solid fa-comment"></i> Chat</button>
                <button onclick="actionSMSFromCV('${uid}')" class="flex-1 bg-[#22c55e] hover:bg-green-600 text-white font-bold py-2.5 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2"><i class="fa-solid fa-comment-sms"></i> SMS</button>
                <button onclick="actionEmailFromCV('${uid}')" class="flex-1 bg-[#8b5cf6] hover:bg-purple-600 text-white font-bold py-2.5 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2"><i class="fa-solid fa-paper-plane"></i> Email</button>
            </div>
            
            <button onclick="document.getElementById('detailed-cv-modal').remove()" class="absolute top-4 right-4 text-gray-400 hover:text-white bg-black/20 hover:bg-black/40 rounded-full w-8 h-8 flex items-center justify-center transition-colors"><i class="fa-solid fa-times"></i></button>
        </div>
    `;
};

// --- ФУНКЦИИ-ПЕРЕХВАТЧИКИ ДЛЯ КНОПОК CV ---
window.actionPrivateChatFromCV = function(uid) {
    document.getElementById('detailed-cv-modal')?.remove();
    if(typeof window.switchWebChat === 'function') window.switchWebChat(uid);
    const chatNavLink = document.querySelector('.nav-link[data-target="chat"]');
    if(chatNavLink) chatNavLink.click();
};

window.actionSMSFromCV = function(uid) {
    const user = window.appUsers[uid];
    if (user && user.phone) {
        window.location.href = `sms:${user.phone}`;
        document.getElementById('detailed-cv-modal')?.remove();
    } else {
        alert("Пользователь не указал номер телефона.");
    }
};

window.actionEmailFromCV = function(uid) {
    const user = window.appUsers[uid];
    if (user && user.email) {
        document.getElementById('detailed-cv-modal')?.remove();
        if(typeof window.openEmailModal === 'function') window.openEmailModal();
        setTimeout(() => {
            const emailInput = document.getElementById('email-to-input');
            if (emailInput) emailInput.value = user.email;
        }, 100);
    } else {
        alert("Пользователь не указал Email.");
    }
};


// ==========================================
// ЗОЛОТОЙ СТАНДАРТ: ЕДИНЫЙ ФАЙЛ
// Блок 8: OMNI-SEARCH И УМНАЯ КОНФЕРЕНЦИЯ
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. АВТО-ГЕНЕРАЦИЯ МОДАЛКИ OMNI-SEARCH
    if (!document.getElementById('search-modal')) {
        const searchModalHtml = `
        <div id="search-modal" class="fixed inset-0 bg-gray-900/70 backdrop-blur-sm hidden items-center justify-center z-[10000] opacity-0 transition-opacity duration-300" onclick="if(event.target===this) closeSearchModal()">
            <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-2xl shadow-2xl transform scale-95 transition-transform duration-300 relative border border-gray-200 dark:border-slate-700 flex flex-col max-h-[85vh]" onclick="event.stopPropagation();">
                <button onclick="closeSearchModal()" class="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors bg-gray-100 dark:bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center"><i class="fa-solid fa-xmark"></i></button>
                <h2 class="text-xl font-bold mb-5 text-gray-800 dark:text-white flex items-center gap-2"><i class="fa-solid fa-globe text-indigo-500"></i> Global Omni-Search</h2>
                
                <div class="relative w-full shrink-0 mb-5">
                    <i class="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-indigo-500 text-lg"></i>
                    <input type="text" id="global-search-input" onkeyup="performLiveSearch()" placeholder="Search people, places, services..." class="w-full pl-12 pr-12 py-3.5 border-2 border-transparent focus:border-indigo-500 rounded-2xl bg-gray-50 dark:bg-slate-900 dark:text-white transition-colors text-lg outline-none shadow-inner">
                    <i class="fa-solid fa-circle-xmark absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hidden hover:text-red-500 transition text-xl" id="clear-search-btn" onclick="resetGlobalSearch()" title="Clear"></i>
                </div>
                
                <div class="w-full shrink-0 mb-2 overflow-y-auto custom-scrollbar pr-2" id="search-suggestions" style="max-height: 40vh;">
                    <p class="text-[10px] text-gray-500 dark:text-gray-400 font-bold mb-3 uppercase tracking-widest">🤝 People & Skills</p>
                    <div class="flex flex-wrap gap-2 mb-5">
                        <button onclick="handleSmartSearch('Engineer', 'text')" class="px-4 py-2 bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-500 hover:text-white transition-colors shadow-sm"><i class="fa-solid fa-laptop-code mr-1"></i> Engineer</button>
                        <button onclick="handleSmartSearch('Designer', 'text')" class="px-4 py-2 bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-500 hover:text-white transition-colors shadow-sm"><i class="fa-solid fa-palette mr-1"></i> Designer</button>
                        <button onclick="handleSmartSearch('Marketing', 'text')" class="px-4 py-2 bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-500 hover:text-white transition-colors shadow-sm"><i class="fa-solid fa-chart-line mr-1"></i> Marketing</button>
                    </div>
                    
                    <p class="text-[10px] text-gray-500 dark:text-gray-400 font-bold mb-3 uppercase tracking-widest">🌍 Places & Languages</p>
                    <div class="flex flex-wrap gap-2 mb-5">
                        <button onclick="handleSmartSearch('Germany', 'text')" class="px-4 py-2 bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-500 hover:text-white transition-colors shadow-sm">🇩🇪 Germany</button>
                        <button onclick="handleSmartSearch('Italy', 'text')" class="px-4 py-2 bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-500 hover:text-white transition-colors shadow-sm">🇮🇹 Italy</button>
                        <button onclick="handleSmartSearch('English', 'text')" class="px-4 py-2 bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-500 hover:text-white transition-colors shadow-sm">🗣️ English</button>
                    </div>
                    
                    <p class="text-[10px] text-gray-500 dark:text-gray-400 font-bold mb-3 uppercase tracking-widest">💳 Services & Actions</p>
                    <div class="flex flex-wrap gap-2 mb-5">
                        <button onclick="handleSmartSearch('', 'transfer')" class="px-4 py-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-xl text-sm font-medium text-green-700 dark:text-green-400 hover:bg-green-500 hover:text-white transition-colors shadow-sm"><i class="fa-solid fa-money-bill-transfer mr-1"></i> Send Money</button>
                        <button onclick="handleSmartSearch('', 'email')" class="px-4 py-2 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700 rounded-xl text-sm font-medium text-purple-700 dark:text-purple-400 hover:bg-purple-500 hover:text-white transition-colors shadow-sm"><i class="fa-solid fa-envelope mr-1"></i> Compose Email</button>
                    </div>
                    
                    <p class="text-[10px] text-gray-500 dark:text-gray-400 font-bold mb-3 uppercase tracking-widest">🌐 Web Queries</p>
                    <div class="flex flex-wrap gap-2">
                        <button onclick="handleSmartSearch('USD exchange rate', 'web')" class="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-xl text-sm font-medium text-blue-700 dark:text-blue-400 hover:bg-blue-500 hover:text-white transition-colors shadow-sm"><i class="fa-solid fa-rotate mr-1"></i> Exchange Rates</button>
                        <button onclick="handleSmartSearch('World News', 'web')" class="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-xl text-sm font-medium text-blue-700 dark:text-blue-400 hover:bg-blue-500 hover:text-white transition-colors shadow-sm"><i class="fa-solid fa-newspaper mr-1"></i> World News</button>
                    </div>
                </div>
                
                <div class="w-full flex-grow overflow-y-auto flex flex-col gap-2 pr-1 border-t border-gray-200 dark:border-slate-700 pt-4" id="search-results-area"></div>
                <iframe id="search-result-frame" class="w-full h-[40vh] mt-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white hidden shrink-0 shadow-inner" src="about:blank"></iframe>
                
                <button onclick="doGoogleSearch()" class="mt-4 w-full bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-600 py-3.5 rounded-xl font-bold transition-colors flex justify-center items-center gap-2 shadow-sm text-lg">
                    <span class="text-gray-600 dark:text-gray-300">Search Web:</span>
                    <span class="text-[#4285F4]">G</span><span class="text-[#EA4335]">o</span><span class="text-[#FBBC05]">o</span><span class="text-[#4285F4]">g</span><span class="text-[#34A853]">l</span><span class="text-[#EA4335]">e</span>
                </button>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', searchModalHtml);
    }

    // 2. АПГРЕЙД ФУТЕРА КОНФЕРЕНЦИИ (Добавляем Смайлы и Скрепку)
    const confOverlay = document.getElementById('conference-overlay');
    if (confOverlay) {
        // Ищем контейнер с инпутом в конференции
        const confInputContainer = confOverlay.querySelector('input#conf-text-input')?.parentElement;
        
        if (confInputContainer) {
            // Заменяем простой инпут на расширенный блок
            const upgradedInputHtml = `
                <div class="relative flex items-center">
                    <!-- Кнопка Эмодзи -->
                    <button onclick="toggleConfEmoji(event)" class="p-2 text-gray-500 hover:text-yellow-500 transition-colors">
                        <i class="fa-regular fa-face-smile text-xl"></i>
                    </button>
                    
                    <!-- Панель Эмодзи (Скрыта по умолчанию) -->
                    <div id="conf-emoji-picker" class="hidden absolute bottom-full left-0 mb-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-3 rounded-xl grid grid-cols-5 gap-3 text-2xl shadow-xl z-[100]">
                        ${['😀','😂','❤️','😍','👍','🔥','🎉','😢','😎','🤔'].map(e => `<span class="cursor-pointer hover:scale-125 transition-transform" onclick="insertConfEmoji('${e}')">${e}</span>`).join('')}
                    </div>

                    <input type="text" id="conf-text-input" placeholder="Message or mic..." class="bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white px-3 py-2.5 outline-none w-40 md:w-56 transition-colors rounded-lg">
                    
                    <!-- УМНАЯ СКРЕПКА (Экшен-меню) -->
                    <div class="relative ml-1">
                        <button onclick="toggleConfActions(event)" class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors text-gray-500 hover:text-indigo-500">
                            <i class="fa-solid fa-paperclip text-xl"></i>
                        </button>
                        
                        <!-- Выпадающее меню скрепки -->
                        <div id="conf-actions-panel" class="absolute bottom-full right-0 mb-3 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-2xl grid grid-cols-3 gap-2 hidden opacity-0 transform scale-95 z-[100] transition-all border border-gray-100 dark:border-slate-700 w-64 origin-bottom-right">
                            <button onclick="openLocationModal()" class="flex flex-col items-center justify-center p-3 text-gray-500 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 rounded-lg transition-colors"><i class="fa-solid fa-location-dot text-xl mb-1"></i><span class="text-[10px] font-medium">Location</span></button>
                            <button onclick="document.getElementById('attachment-input').click(); closeConfPanels();" class="flex flex-col items-center justify-center p-3 text-gray-500 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 rounded-lg transition-colors"><i class="fa-solid fa-file-arrow-up text-xl mb-1"></i><span class="text-[10px] font-medium">File</span></button>
                            <button onclick="openSearchModal()" class="flex flex-col items-center justify-center p-3 text-gray-500 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 rounded-lg transition-colors"><i class="fa-solid fa-magnifying-glass text-xl mb-1"></i><span class="text-[10px] font-medium">Search</span></button>
                            <button onclick="openTrashModal()" class="flex flex-col items-center justify-center p-3 text-gray-500 hover:bg-red-50 dark:hover:bg-slate-700 hover:text-red-600 rounded-lg transition-colors"><i class="fa-solid fa-trash text-xl mb-1"></i><span class="text-[10px] font-medium">Clear</span></button>
                            <button onclick="openBankTransferModal()" class="flex flex-col items-center justify-center p-3 text-gray-500 hover:bg-green-50 dark:hover:bg-slate-700 hover:text-green-600 rounded-lg transition-colors"><i class="fa-solid fa-money-bill-transfer text-xl mb-1"></i><span class="text-[10px] font-medium">Pay</span></button>
                            <button onclick="openEmailModal()" class="flex flex-col items-center justify-center p-3 text-gray-500 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 rounded-lg transition-colors"><i class="fa-solid fa-envelope text-xl mb-1"></i><span class="text-[10px] font-medium">Email</span></button>
                        </div>
                    </div>

                    <button id="conf-send-btn" class="text-indigo-600 dark:text-[#00C4CC] hover:scale-110 transition-transform ml-2 mr-2">
                        <i class="fa-solid fa-paper-plane text-xl"></i>
                    </button>
                </div>
            `;
            // Заменяем старый инпут и кнопку отправки на новый продвинутый блок
            const oldInput = document.getElementById('conf-text-input');
            const oldBtn = document.getElementById('conf-send-btn');
            if(oldInput && oldBtn) {
                oldInput.remove(); oldBtn.remove();
                confInputContainer.insertAdjacentHTML('afterbegin', upgradedInputHtml);
            }
        }
    }
});

// --- ЛОГИКА OMNI-SEARCH ---
window.openSearchModal = function() {
    window.closeDropdown();
    const modal = document.getElementById('search-modal');
    if (modal) {
        modal.classList.remove('hidden'); modal.classList.add('flex');
        setTimeout(() => { modal.classList.remove('opacity-0'); modal.querySelector('div').classList.remove('scale-95'); }, 10);
    }
}
window.closeSearchModal = function() {
    const modal = document.getElementById('search-modal');
    if (modal) {
        modal.classList.add('opacity-0'); modal.querySelector('div').classList.add('scale-95');
        setTimeout(() => { modal.classList.add('hidden'); modal.classList.remove('flex'); window.resetGlobalSearch(); }, 300);
    }
}
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
    // Поиск по живой базе Версии 1
    if(window.appUsers) {
        Object.keys(window.appUsers).forEach(id => {
            const p = window.appUsers[id];
            const cv = p.cv || {};
            const searchStr = `${p.name} ${cv.profession} ${p.country} ${cv.languages}`.toLowerCase();
            
            if (searchStr.includes(query)) {
                found = true;
                html += `
                    <div class="bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:border-indigo-500 transition-all shadow-sm mb-2" onclick="closeSearchModal(); setTimeout(() => openDetailedCV('${id}'), 300);">
                        <div class="flex items-center gap-4">
                            <img src="${p.photo || 'https://ui-avatars.com/api/?name=U'}" class="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-600 shadow-sm">
                            <div class="flex flex-col">
                                <span class="text-gray-900 dark:text-white text-sm font-bold">${p.name} ${p.flag || '🌍'}</span>
                                <span class="text-indigo-500 dark:text-indigo-400 text-xs font-medium">${cv.profession || 'User'} | ${p.country || 'Global'}</span>
                            </div>
                        </div>
                        <i class="fa-solid fa-chevron-right text-gray-400 pr-2"></i>
                    </div>`;
            }
        });
    }
    
    if (!found) html = `<p class="text-sm text-gray-500 dark:text-gray-400 text-center mt-6 font-medium">No internal results found. Click 'Search Web' below.</p>`;
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
    
    iframe.src = searchUrl; 
    iframe.classList.remove('hidden');
}

// --- ЛОГИКА ФУТЕРА КОНФЕРЕНЦИИ ---
window.toggleConfEmoji = function(e) {
    e.stopPropagation();
    const picker = document.getElementById('conf-emoji-picker');
    const actions = document.getElementById('conf-actions-panel');
    if(actions && !actions.classList.contains('hidden')) window.closeConfPanels();
    if(picker) picker.classList.toggle('hidden');
}
window.insertConfEmoji = function(emoji) {
    const input = document.getElementById('conf-text-input');
    if(input) { input.value += emoji; input.focus(); }
    document.getElementById('conf-emoji-picker')?.classList.add('hidden');
}
window.toggleConfActions = function(e) {
    e.stopPropagation();
    const actions = document.getElementById('conf-actions-panel');
    const picker = document.getElementById('conf-emoji-picker');
    if(picker && !picker.classList.contains('hidden')) picker.classList.add('hidden');
    
    if(actions) {
        if(actions.classList.contains('hidden')) {
            actions.classList.remove('hidden');
            setTimeout(() => actions.classList.remove('opacity-0', 'scale-95'), 10);
        } else {
            window.closeConfPanels();
        }
    }
}
window.closeConfPanels = function() {
    const actions = document.getElementById('conf-actions-panel');
    const picker = document.getElementById('conf-emoji-picker');
    if(picker) picker.classList.add('hidden');
    if(actions) {
        actions.classList.add('opacity-0', 'scale-95');
        setTimeout(() => actions.classList.add('hidden'), 200);
    }
}
// Закрываем менюшки конференции при клике по экрану
document.addEventListener('click', () => { if(window.closeConfPanels) window.closeConfPanels(); });
// ==========================================
// ЗОЛОТОЙ СТАНДАРТ: ЕДИНЫЙ ФАЙЛ
// Блок 9: ЭКОСИСТЕМА (12 ЯЗЫКОВ) + WEB МОДАЛКИ (Профиль, Кошелек, Стор)
// ==========================================

// --- 1. ГЛОБАЛЬНЫЙ СЛОВАРЬ (12 Языков + Новые теги CV) ---
window.appTranslations = {
    'en': { menu: "Settings", profile: "Profile", wallet: "Wallet", email_store: "Email Store", theme: "Change Theme", logout: "Logout", action_chat: "Private Chat", action_voice: "Voice Room", action_video: "Video Conf", action_email: "Send Email", action_cellular: "Cellular Call", select_room_lang: "Room Language", cancel: "Cancel", save: "Save Profile", send: "Send Money", purchase: "Purchase Now", cv_edit_title: "Edit CV & Contacts", cv_country: "Country", cv_phone: "Phone Number", cv_email: "Email Address", cv_role: "Main Role", cv_prof: "Profession", cv_langs: "Languages", cv_exp: "Experience", cv_edu: "Education", cv_skills: "Core Competencies", cv_about: "About Me", cv_save_btn: "Save CV" },
    
    'ru': { menu: "Настройки", profile: "Мой Профиль", wallet: "Кошелек", email_store: "Email Стор", theme: "Сменить тему", logout: "Выйти", action_chat: "Личный чат", action_voice: "Голосовая", action_video: "Видео", action_email: "Письмо", action_cellular: "Сотовый звонок", select_room_lang: "Язык комнаты", cancel: "Отмена", save: "Сохранить", send: "Отправить", purchase: "Купить", cv_edit_title: "Редактировать CV", cv_country: "Страна", cv_phone: "Номер телефона", cv_email: "Email адрес", cv_role: "Должность", cv_prof: "Профессия", cv_langs: "Языки", cv_exp: "Опыт работы", cv_edu: "Образование", cv_skills: "Ключевые навыки", cv_about: "О себе", cv_save_btn: "Сохранить CV" },
    
    'az': { menu: "Tənzimləmələr", profile: "Profilim", wallet: "Pul kisəsi", email_store: "Email Mağaza", theme: "Mövzunu dəyiş", logout: "Çıxış", action_chat: "Şəxsi Çat", action_voice: "Səsli Otaq", action_video: "Video Zəng", action_email: "Email Göndər", action_cellular: "Mobil Zəng", select_room_lang: "Otaq Dili", cancel: "Ləğv et", save: "Yadda saxla", send: "Göndər", purchase: "Al", cv_edit_title: "CV-ni Yenilə", cv_country: "Ölkə", cv_phone: "Telefon", cv_email: "Email", cv_role: "Vəzifə", cv_prof: "Peşə", cv_langs: "Dillər", cv_exp: "İş təcrübəsi", cv_edu: "Təhsil", cv_skills: "Əsas bacarıqlar", cv_about: "Haqqımda", cv_save_btn: "CV-ni Saxla" },
    
    'de': { menu: "Einstellungen", profile: "Mein Profil", wallet: "Brieftasche", email_store: "E-Mail Shop", theme: "Design ändern", logout: "Abmelden", action_chat: "Privater Chat", action_voice: "Sprachraum", action_video: "Videoanruf", action_email: "E-Mail senden", action_cellular: "Handyanruf", select_room_lang: "Raumsprache", cancel: "Abbrechen", save: "Speichern", send: "Geld senden", purchase: "Kaufen", cv_edit_title: "Lebenslauf bearbeiten", cv_country: "Land", cv_phone: "Telefonnummer", cv_email: "E-Mail", cv_role: "Rolle", cv_prof: "Beruf", cv_langs: "Sprachen", cv_exp: "Berufserfahrung", cv_edu: "Bildung", cv_skills: "Kernkompetenzen", cv_about: "Über mich", cv_save_btn: "Lebenslauf speichern" },
    
    'it': { menu: "Impostazioni", profile: "Il mio Profilo", wallet: "Portafoglio", email_store: "Negozio Email", theme: "Cambia Tema", logout: "Esci", action_chat: "Chat Privata", action_voice: "Stanza Vocale", action_video: "Videochiamata", action_email: "Invia Email", action_cellular: "Chiamata", select_room_lang: "Lingua Stanza", cancel: "Annulla", save: "Salva", send: "Invia Denaro", purchase: "Acquista", cv_edit_title: "Modifica CV", cv_country: "Paese", cv_phone: "Telefono", cv_email: "Email", cv_role: "Ruolo", cv_prof: "Professione", cv_langs: "Lingue", cv_exp: "Esperienza", cv_edu: "Istruzione", cv_skills: "Competenze", cv_about: "Su di me", cv_save_btn: "Salva CV" },
    
    'tr': { menu: "Ayarlar", profile: "Profilim", wallet: "Cüzdan", email_store: "E-posta Mağazası", theme: "Temayı Değiştir", logout: "Çıkış Yap", action_chat: "Özel Sohbet", action_voice: "Sesli Oda", action_video: "Görüntülü", action_email: "E-posta Gönder", action_cellular: "Hücresel Arama", select_room_lang: "Oda Dili", cancel: "İptal", save: "Kaydet", send: "Gönder", purchase: "Satın Al", cv_edit_title: "CV Düzenle", cv_country: "Ülke", cv_phone: "Telefon", cv_email: "E-posta", cv_role: "Rol", cv_prof: "Meslek", cv_langs: "Diller", cv_exp: "Deneyim", cv_edu: "Eğitim", cv_skills: "Yetenekler", cv_about: "Hakkımda", cv_save_btn: "CV'yi Kaydet" },
    
    'es': { menu: "Ajustes", profile: "Mi Perfil", wallet: "Billetera", email_store: "Tienda Email", theme: "Cambiar Tema", logout: "Salir", action_chat: "Chat Privado", action_voice: "Sala de Voz", action_video: "Videollamada", action_email: "Enviar Email", action_cellular: "Llamada celular", select_room_lang: "Idioma de sala", cancel: "Cancelar", save: "Guardar", send: "Enviar", purchase: "Comprar", cv_edit_title: "Editar CV", cv_country: "País", cv_phone: "Teléfono", cv_email: "Correo", cv_role: "Rol", cv_prof: "Profesión", cv_langs: "Idiomas", cv_exp: "Experiencia", cv_edu: "Educación", cv_skills: "Habilidades", cv_about: "Sobre mí", cv_save_btn: "Guardar CV" },
    
    'fr': { menu: "Paramètres", profile: "Mon Profil", wallet: "Portefeuille", email_store: "Boutique Email", theme: "Changer de thème", logout: "Déconnexion", action_chat: "Chat Privé", action_voice: "Salon Vocal", action_video: "Appel Vidéo", action_email: "Envoyer Email", action_cellular: "Appel Mobile", select_room_lang: "Langue du salon", cancel: "Annuler", save: "Enregistrer", send: "Envoyer", purchase: "Acheter", cv_edit_title: "Modifier le CV", cv_country: "Pays", cv_phone: "Téléphone", cv_email: "E-mail", cv_role: "Rôle", cv_prof: "Profession", cv_langs: "Langues", cv_exp: "Expérience", cv_edu: "Éducation", cv_skills: "Compétences", cv_about: "À propos de moi", cv_save_btn: "Enregistrer le CV" },
    
    'pt': { menu: "Configurações", profile: "Meu Perfil", wallet: "Carteira", email_store: "Loja Email", theme: "Mudar Tema", logout: "Sair", action_chat: "Chat Privado", action_voice: "Sala de Voz", action_video: "Videochamada", action_email: "Enviar Email", action_cellular: "Chamada", select_room_lang: "Idioma da Sala", cancel: "Cancelar", save: "Salvar", send: "Enviar", purchase: "Comprar", cv_edit_title: "Editar CV", cv_country: "País", cv_phone: "Telefone", cv_email: "Email", cv_role: "Cargo", cv_prof: "Profissão", cv_langs: "Idiomas", cv_exp: "Experiência", cv_edu: "Educação", cv_skills: "Habilidades", cv_about: "Sobre mim", cv_save_btn: "Salvar CV" },
    
    'ar': { menu: "إعدادات", profile: "ملفي الشخصي", wallet: "محفظة", email_store: "متجر البريد", theme: "تغيير المظهر", logout: "خروج", action_chat: "دردشة خاصة", action_voice: "غرفة صوتية", action_video: "فيديو", action_email: "إرسال بريد", action_cellular: "مكالمة خلوية", select_room_lang: "لغة الغرفة", cancel: "إلغاء", save: "حفظ", send: "إرسال", purchase: "شراء", cv_edit_title: "تعديل السيرة الذاتية", cv_country: "دولة", cv_phone: "رقم الهاتف", cv_email: "البريد الإلكتروني", cv_role: "دور", cv_prof: "مهنة", cv_langs: "اللغات", cv_exp: "خبرة", cv_edu: "تعليم", cv_skills: "مهارات", cv_about: "عني", cv_save_btn: "حفظ السيرة الذاتية" },
    
    'zh': { menu: "设置", profile: "我的主页", wallet: "钱包", email_store: "邮箱商店", theme: "更改主题", logout: "登出", action_chat: "私聊", action_voice: "语音室", action_video: "视频会议", action_email: "发送邮件", action_cellular: "拨打电话", select_room_lang: "房间语言", cancel: "取消", save: "保存", send: "发送金钱", purchase: "立即购买", cv_edit_title: "编辑简历", cv_country: "国家", cv_phone: "电话", cv_email: "电子邮件", cv_role: "角色", cv_prof: "职业", cv_langs: "语言", cv_exp: "经验", cv_edu: "教育", cv_skills: "技能", cv_about: "关于我", cv_save_btn: "保存简历" },
    
    'ja': { menu: "設定", profile: "マイプロフィール", wallet: "ウォレット", email_store: "メールストア", theme: "テーマ変更", logout: "ログアウト", action_chat: "プライベートチャット", action_voice: "ボイスルーム", action_video: "ビデオ会議", action_email: "メール送信", action_cellular: "電話をかける", select_room_lang: "ルームの言語", cancel: "キャンセル", save: "保存", send: "送金", purchase: "購入する", cv_edit_title: "履歴書と連絡先の編集", cv_country: "国", cv_phone: "電話番号", cv_email: "メールアドレス", cv_role: "役割", cv_prof: "職業", cv_langs: "言語", cv_exp: "経験", cv_edu: "教育", cv_skills: "スキル", cv_about: "自己紹介", cv_save_btn: "履歴書を保存" }
};

// --- 2. ОПРЕДЕЛИТЕЛЬ ЯЗЫКА (12 зон) ---
window.getLangFromPrefix = function(phoneNumber) {
    if (!phoneNumber) return 'en';
    if (phoneNumber.startsWith('+994')) return 'az';
    if (phoneNumber.startsWith('+7')) return 'ru';
    if (phoneNumber.startsWith('+49')) return 'de';
    if (phoneNumber.startsWith('+39')) return 'it';
    if (phoneNumber.startsWith('+90')) return 'tr';
    if (phoneNumber.startsWith('+34')) return 'es';
    if (phoneNumber.startsWith('+33')) return 'fr';
    if (phoneNumber.startsWith('+351') || phoneNumber.startsWith('+55')) return 'pt';
    if (phoneNumber.startsWith('+971') || phoneNumber.startsWith('+966') || phoneNumber.startsWith('+20')) return 'ar';
    if (phoneNumber.startsWith('+86')) return 'zh';
    if (phoneNumber.startsWith('+91')) return 'hi';
    return 'en';
};

// --- 3. ГЛОБАЛЬНЫЙ ПЕРЕВОДЧИК ЭКОСИСТЕМЫ ---
window.applySystemLanguage = function() {
    let targetLang = 'en';
    if (window.currentAppLang === 'auto' && window.myProfileInfo && window.myProfileInfo.phone) {
        targetLang = window.getLangFromPrefix(window.myProfileInfo.phone);
    } else if (window.currentAppLang !== 'auto') {
        targetLang = window.currentAppLang.split('-')[0];
    }

    let dict = window.appTranslations[targetLang] || window.appTranslations['en'];

    // Ищем все элементы с атрибутом data-i18n и переводим их
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = dict[key];
            else el.innerText = dict[key];
        }
    });

    document.documentElement.lang = targetLang;
    document.documentElement.dir = targetLang === 'ar' ? 'rtl' : 'ltr';
    
    // Синхронизируем выпадающий список языков в шапке
    const select = document.getElementById('app-lang-select');
    if (select) select.value = window.currentAppLang;
};

// Перехват смены языка пользователем вручную
window.changeAppLanguage = function(langCode) {
    window.currentAppLang = langCode;
    localStorage.setItem('hf_ecosystem_lang', langCode);
    window.applySystemLanguage();
    window.closeDropdown();
};

// Авто-перевод при появлении новых элементов (БЕЗОПАСНАЯ ВЕРСИЯ)
const domObserver = new MutationObserver((mutations) => {
    let hasNewNodes = false;
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) hasNewNodes = true;
    });
    
    if (hasNewNodes) {
        domObserver.disconnect(); // 1. Выключаем следилку
        window.applySystemLanguage(); // 2. Переводим один раз
        domObserver.observe(document.body, { childList: true, subtree: true }); // 3. Включаем обратно
    }
});
domObserver.observe(document.body, { childList: true, subtree: true });

// --- 4. ПРОФИЛЬ (ДИЗАЙН С ФОТО + МОРЯ + НАСЕЛЕНИЕ + УМНЫЙ ФЛАГ) ---
window.openMyProfile = function() {
    if (!window.myProfileInfo) return alert("Пожалуйста, авторизуйтесь!");
    if (typeof window.closeDropdown === 'function') window.closeDropdown();
    
    const user = window.myProfileInfo;
    
    // База стран (12 эко-языков + Global)
    const countries = [
        { code: 'az', flag: '🇦🇿', name: 'Azerbaijan', dial: '+994' },
        { code: 'ru', flag: '🇷🇺', name: 'Russia', dial: '+7' },
        { code: 'de', flag: '🇩🇪', name: 'Germany', dial: '+49' },
        { code: 'it', flag: '🇮🇹', name: 'Italy', dial: '+39' },
        { code: 'gb', flag: '🇬🇧', name: 'UK', dial: '+44' },
        { code: 'tr', flag: '🇹🇷', name: 'Turkey', dial: '+90' },
        { code: 'es', flag: '🇪🇸', name: 'Spain', dial: '+34' },
        { code: 'fr', flag: '🇫🇷', name: 'France', dial: '+33' },
        { code: 'ae', flag: '🇦🇪', name: 'UAE', dial: '+971' },
        { code: 'cn', flag: '🇨🇳', name: 'China', dial: '+86' },
        { code: 'jp', flag: '🇯🇵', name: 'Japan', dial: '+81' },
        { code: 'us', flag: '🇺🇸', name: 'USA', dial: '+1' }
    ];

    let currentCode = user.flagCode || 'az';
    let optionsHtml = countries.map(c => 
        `<option value="${c.code}" data-dial="${c.dial}" data-flag="${c.flag}" ${currentCode === c.code ? 'selected' : ''}>${c.flag} ${c.name}</option>`
    ).join('');

    let modal = document.getElementById('profile-modal-container');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'profile-modal-container';
        modal.className = 'fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[10000] flex justify-center items-center p-4 transition-opacity';
        document.body.appendChild(modal);
    }

    // Дизайн четко по твоему скрину (центрированный аватар, поля, кнопка, футер)
    modal.innerHTML = `
        <div class="bg-white dark:bg-slate-800 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden relative flex flex-col animate-fade-in" onclick="event.stopPropagation()">
            <button onclick="document.getElementById('profile-modal-container').remove()" class="absolute top-4 right-4 w-8 h-8 bg-red-100 dark:bg-red-500/20 hover:bg-red-500 hover:text-white text-red-500 rounded-full flex items-center justify-center transition-colors z-50">
                <i class="fa-solid fa-xmark"></i>
            </button>

            <div class="p-8 overflow-y-auto custom-scrollbar max-h-[90vh]">
                
                <!-- Центрированный заголовок и Аватар -->
                <div class="flex flex-col items-center mb-8">
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2" data-i18n="profile">Mein Profil</h2>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-6">Complete registration / Update details</p>

                    <div class="w-28 h-28 relative cursor-pointer group mb-2" onclick="document.getElementById('attachment-input')?.click()">
                        <img src="${user.photo || 'https://ui-avatars.com/api/?name=U'}" class="w-full h-full rounded-full object-cover border-4 border-indigo-500 dark:border-[#00C4CC] shadow-lg">
                        <div class="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <i class="fa-solid fa-camera text-white text-2xl"></i>
                        </div>
                        <div class="absolute bottom-0 right-0 bg-indigo-500 dark:bg-[#00C4CC] w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center text-white">
                            <i class="fa-solid fa-pen text-xs"></i>
                        </div>
                    </div>
                </div>

                <!-- Сетка полей (Веб = 2 колонки, Телефон = 1 колонка) -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <!-- Имя -->
                    <div>
                        <label class="block text-[10px] font-bold text-indigo-500 dark:text-[#00C4CC] uppercase mb-1">Full Name</label>
                        <input type="text" id="prof-name" value="${user.name || ''}" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-indigo-500 dark:focus:border-[#00C4CC] transition-colors">
                    </div>
                    <!-- Страна (с флагами внутри) -->
                    <div>
                        <label class="block text-[10px] font-bold text-indigo-500 dark:text-[#00C4CC] uppercase mb-1">Country</label>
                        <div class="relative">
                            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-xl" id="prof-flag-display">${user.flag || '🌍'}</span>
                            <select id="prof-country" onchange="window.updatePhonePrefix(this)" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl pl-12 pr-4 py-3 text-gray-900 dark:text-white outline-none focus:border-indigo-500 dark:focus:border-[#00C4CC] transition-colors cursor-pointer appearance-none">
                                ${optionsHtml}
                            </select>
                            <i class="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
                        </div>
                    </div>

                    <!-- Телефон -->
                    <div>
                        <label class="block text-[10px] font-bold text-indigo-500 dark:text-[#00C4CC] uppercase mb-1">Phone Number</label>
                        <input type="text" id="prof-phone" value="${user.phone || ''}" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-indigo-500 dark:focus:border-[#00C4CC] font-medium transition-colors">
                    </div>
                    <!-- Языки -->
                    <div>
                        <label class="block text-[10px] font-bold text-indigo-500 dark:text-[#00C4CC] uppercase mb-1">Languages</label>
                        <input type="text" id="prof-langs" value="${user.profileLangs || ''}" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-indigo-500 dark:focus:border-[#00C4CC] transition-colors">
                    </div>

                    <!-- Email -->
                    <div>
                        <label class="block text-[10px] font-bold text-indigo-500 dark:text-[#00C4CC] uppercase mb-1">E-mail</label>
                        <input type="email" id="prof-email" value="${user.email || ''}" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-indigo-500 dark:focus:border-[#00C4CC] transition-colors">
                    </div>
                    <!-- О себе (берем из CV, если есть) -->
                    <div>
                        <label class="block text-[10px] font-bold text-indigo-500 dark:text-[#00C4CC] uppercase mb-1">About Me</label>
                        <input type="text" id="prof-about" value="${user.cv?.about || ''}" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-indigo-500 dark:focus:border-[#00C4CC] transition-colors">
                    </div>

                    <!-- Население -->
                    <div>
                        <label class="block text-[10px] font-bold text-indigo-500 dark:text-[#00C4CC] uppercase mb-1">Population</label>
                        <input type="text" id="prof-pop" value="${user.population || ''}" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-indigo-500 dark:focus:border-[#00C4CC] transition-colors">
                    </div>
                    <!-- Моря -->
                    <div>
                        <label class="block text-[10px] font-bold text-indigo-500 dark:text-[#00C4CC] uppercase mb-1">Seas</label>
                        <input type="text" id="prof-seas" value="${user.seas || ''}" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-indigo-500 dark:focus:border-[#00C4CC] transition-colors">
                    </div>
                </div>

                <!-- Кнопка сохранения -->
                <button onclick="saveProfileData(this)" class="w-full bg-indigo-600 dark:bg-[#00C4CC] hover:bg-indigo-700 dark:hover:bg-[#00b3ba] text-white dark:text-slate-900 font-bold py-4 rounded-xl shadow-[0_4px_14px_0_rgba(0,196,204,0.39)] active:scale-95 transition-all uppercase tracking-wide">
                    Save Profile
                </button>

                <!-- Футер (Creator) -->
                <div class="mt-6 flex flex-col items-center justify-center pt-4 border-t border-gray-200 dark:border-slate-700">
                    <div class="flex items-center gap-2 bg-gray-100 dark:bg-slate-900 px-4 py-2 rounded-full border border-gray-200 dark:border-slate-700">
                        <img src="https://images.unsplash.com/photo-1557862921-37829c790f19?w=100" class="w-6 h-6 rounded-full object-cover">
                        <span class="text-[10px] text-gray-500 dark:text-gray-400 font-semibold uppercase">Creator of Hello Friends</span>
                    </div>
                </div>
                
            </div>
        </div>
    `;
    if (typeof window.applySystemLanguage === 'function') window.applySystemLanguage();
};

// --- МГНОВЕННАЯ СМЕНА ПРЕФИКСА ПРИ ВЫБОРЕ СТРАНЫ ---
window.updatePhonePrefix = function(selectEl) {
    const selectedOption = selectEl.options[selectEl.selectedIndex];
    const dialCode = selectedOption.getAttribute('data-dial');
    const flagIcon = selectedOption.getAttribute('data-flag');
    
    const phoneInput = document.getElementById('prof-phone');
    if (phoneInput) { 
        // Автоматически подставляем код страны в поле ввода
        phoneInput.value = dialCode + " "; 
        phoneInput.focus(); 
    }
    
    // Меняем флажок в селекте
    const flagDisplay = document.getElementById('prof-flag-display');
    if (flagDisplay) flagDisplay.innerText = flagIcon;
};

// --- БЕЗОПАСНОЕ СОХРАНЕНИЕ ---
window.saveProfileData = function(btn) {
    if(btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...'; }
    
    const selectEl = document.getElementById('prof-country');
    const selectedOption = selectEl.options[selectEl.selectedIndex];

    const data = {
        name: document.getElementById('prof-name').value.trim(),
        email: document.getElementById('prof-email').value.trim(),
        phone: document.getElementById('prof-phone').value.trim(),
        profileLangs: document.getElementById('prof-langs').value.trim(),
        population: document.getElementById('prof-pop').value.trim(),
        seas: document.getElementById('prof-seas').value.trim(),
        // Вырезаем флажок из названия страны, чтобы в базе хранилось чистым текстом
        country: selectedOption.text.trim().replace(/^[\uD83C][\uDDE6-\uDDFF][\uD83C][\uDDE6-\uDDFF]\s*/, '').replace('🌍 ', ''), 
        flagCode: selectEl.value,
        flag: selectedOption.getAttribute('data-flag')
    };
    
    // Синхронизируем поле "About Me" с профессиональным CV
    const aboutVal = document.getElementById('prof-about').value.trim();
    if (window.myProfileInfo.cv) {
        window.myProfileInfo.cv.about = aboutVal;
        firebase.database().ref('users/' + window.myProfileInfo.id + '/cv/about').set(aboutVal);
    }
    
    if (window.firebase) {
        firebase.database().ref('users/' + window.myProfileInfo.id).update(data).then(() => {
            Object.assign(window.myProfileInfo, data);
            document.getElementById('profile-modal-container').remove();
            
            // Жестко перерисовываем аватары
            if(window.appUsers && typeof window.renderMainScreenAvatars === 'function') {
                window.renderMainScreenAvatars(window.appUsers);
            }
            // Мгновенно обновляем глобальный язык экосистемы по новому префиксу!
            if(typeof window.applySystemLanguage === 'function') window.applySystemLanguage();
            
        }).catch(e => {
            alert("Error: " + e.message);
            if (btn) { btn.disabled = false; btn.innerHTML = 'Save Profile'; }
        });
    }
};

// Отслеживание состояния входа в реальном времени
firebase.auth().onAuthStateChanged((user) => {
    const spinner = document.getElementById('auth-spinner');
    const loginBox = document.getElementById('auth-login-box');
    
    if (user) {
        if(typeof window.onUserAuthenticated === 'function') {
            window.onUserAuthenticated(user);
        }
    } else {
        // Если не авторизован — показываем окно входа
        if(spinner && loginBox) {
            spinner.classList.add('hidden'); 
            spinner.classList.remove('flex');
            loginBox.classList.remove('hidden'); 
            loginBox.classList.add('flex');
        }
        window.myProfileInfo = null;
    }
});

// --- 5. КОШЕЛЕК / ПЕРЕВОДЫ (Перекрывает старый HTML) ---
window.openBankTransferModal = function() {
    window.closeDropdown();
    
    // Удаляем старую HTML-модалку, если она есть, чтобы показать нашу крутую WEB-версию
    const oldModal = document.getElementById('transfer-modal');
    if (oldModal) oldModal.remove();

    let modal = document.getElementById('wallet-modal-container');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'wallet-modal-container';
        modal.className = 'fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[10000] flex justify-center items-center p-4';
        document.body.appendChild(modal);
    }
    modal.innerHTML = `
        <div class="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl shadow-2xl p-8 relative" onclick="event.stopPropagation()">
            <button onclick="document.getElementById('wallet-modal-container').remove()" class="absolute top-4 right-4 w-8 h-8 bg-gray-100 dark:bg-slate-700 rounded-full flex justify-center items-center text-gray-500 hover:text-red-500"><i class="fa-solid fa-xmark"></i></button>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white text-center mb-6"><i class="fa-solid fa-wallet text-green-500"></i> <span data-i18n="wallet">Wallet</span></h2>
            
            <div class="flex bg-gray-100 dark:bg-slate-900 rounded-xl p-1 mb-6">
                <button onclick="switchWalletTab('card')" id="tab-card" class="flex-1 py-2 rounded-lg text-sm font-bold bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow">Card-to-Card</button>
                <button onclick="switchWalletTab('intl')" id="tab-intl" class="flex-1 py-2 rounded-lg text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white">International</button>
            </div>
            
            <div id="wallet-content-area" class="space-y-4"></div>
            
            <div class="bg-gray-50 dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-700 mt-6 shadow-inner">
                <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1"><span>Amount:</span> <span id="w-amt">$0.00</span></div>
                <div class="flex justify-between text-xs text-red-500 mb-2"><span>Network Fee:</span> <span>$0.01</span></div>
                <div class="flex justify-between text-sm font-bold text-gray-900 dark:text-white border-t border-gray-200 dark:border-slate-700 pt-2"><span>Total:</span> <span id="w-tot" class="text-green-500">$0.00</span></div>
            </div>
            <button onclick="document.getElementById('wallet-modal-container').remove(); alert('Transaction Successful!');" class="mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg flex justify-center items-center gap-2" data-i18n="send"><i class="fa-solid fa-paper-plane"></i> Send Money</button>
        </div>
    `;
    window.switchWalletTab('card');
    window.applySystemLanguage();
};

window.switchWalletTab = function(tab) {
    const area = document.getElementById('wallet-content-area');
    if(tab === 'card') {
        document.getElementById('tab-card').className = "flex-1 py-2 rounded-lg text-sm font-bold bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow";
        document.getElementById('tab-intl').className = "flex-1 py-2 rounded-lg text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white";
        area.innerHTML = `
            <div class="bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-medium shadow-sm"><i class="fa-brands fa-cc-visa text-blue-500"></i> My Visa •••• 4242</div>
            <input type="text" placeholder="Select Recipient" class="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3 outline-none text-gray-900 dark:text-white shadow-inner">
            <input type="number" oninput="updateWalletTotal(this.value)" placeholder="Amount ($)" class="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3 outline-none text-gray-900 dark:text-white shadow-inner">
        `;
    } else {
        document.getElementById('tab-intl').className = "flex-1 py-2 rounded-lg text-sm font-bold bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow";
        document.getElementById('tab-card').className = "flex-1 py-2 rounded-lg text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white";
        area.innerHTML = `
            <select class="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3 outline-none text-gray-900 dark:text-white font-medium shadow-sm">
                <option>🟡 Western Union</option><option>👑 Zolotaya Korona (Корона)</option><option>🔴 MoneyGram</option><option>🏦 SWIFT Transfer</option>
            </select>
            <input type="text" placeholder="Recipient Country" class="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3 outline-none text-gray-900 dark:text-white shadow-inner">
            <input type="number" oninput="updateWalletTotal(this.value)" placeholder="Amount ($)" class="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3 outline-none text-gray-900 dark:text-white shadow-inner">
        `;
    }
    updateWalletTotal(0);
};
window.updateWalletTotal = function(v) {
    let a = parseFloat(v)||0; let t = a>0 ? a+0.01 : 0;
    document.getElementById('w-amt').innerText = '$'+a.toFixed(2);
    document.getElementById('w-tot').innerText = '$'+t.toFixed(2);
};

// --- 6. СТОР (Corporate Email) ---
window.openEmailStore = function() {
    window.closeDropdown();
    let modal = document.getElementById('store-modal-container');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'store-modal-container';
        modal.className = 'fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[10000] flex justify-center items-center p-4';
        document.body.appendChild(modal);
    }
    modal.innerHTML = `
        <div class="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl shadow-2xl p-8 relative" onclick="event.stopPropagation()">
            <button onclick="document.getElementById('store-modal-container').remove()" class="absolute top-4 right-4 w-8 h-8 bg-gray-100 dark:bg-slate-700 rounded-full flex justify-center items-center text-gray-500 hover:text-red-500"><i class="fa-solid fa-xmark"></i></button>
            <div class="flex flex-col items-center mb-6 text-center">
                <div class="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4"><i class="fa-solid fa-store text-3xl text-indigo-500"></i></div>
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">Corporate Email</h2>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Stand out with a professional email address.</p>
            </div>
            <div class="flex items-center bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl overflow-hidden mb-4 shadow-inner">
                <input type="text" placeholder="ceo, sales..." class="w-full bg-transparent px-4 py-3 outline-none text-gray-900 dark:text-white text-sm">
                <span class="text-gray-500 dark:text-gray-400 text-sm pr-4 pl-4 py-3 bg-gray-100 dark:bg-slate-800">@hellofriends.app</span>
            </div>
            <div class="flex justify-between items-center py-3 border-b border-gray-200 dark:border-slate-700 mb-6">
                <span class="text-sm text-gray-500 dark:text-gray-400 font-medium">Price:</span>
                <span class="text-sm font-bold text-gray-900 dark:text-white">$0.01 <span class="text-xs font-normal text-gray-500">/ lifetime</span></span>
            </div>
            <button onclick="document.getElementById('store-modal-container').remove(); alert('Purchased!');" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg flex justify-center items-center gap-2" data-i18n="purchase"><i class="fa-solid fa-cart-shopping"></i> Purchase Now</button>
        </div>
    `;
    window.applySystemLanguage();
};

// Запуск первичного перевода при загрузке
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(window.applySystemLanguage, 500);
});
// ==========================================
// ВОССТАНОВЛЕННЫЕ МОДАЛКИ: АВАТАР И CV
// ==========================================

window.openAvatarModal = function(uid) {
    if(typeof window.closeDropdown === 'function') window.closeDropdown();
    const user = window.appUsers ? window.appUsers[uid] : null;
    let uData = user;
    
    if (uid === 'ai') uData = { id: 'ai', name: 'AI Assistant', photo: './ai-avatar.jpg', flagCode: 'gb', country: 'Digital World', profileLangs: 'All', population: 'Infinite', seas: 'Data Lake', cv: { role: 'AI Bot', about: 'I am your intelligent assistant.' } };
    if (uid === 'me' && window.myProfileInfo) uData = window.myProfileInfo;
    
    if (!uData) return;
    const cv = uData.cv || {};
    
    let modalContainer = document.getElementById('combined-avatar-modal');
    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'combined-avatar-modal';
        modalContainer.className = 'fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[10000] flex justify-center items-center p-4 transition-opacity animate-fade-in';
        document.body.appendChild(modalContainer);
        modalContainer.addEventListener('click', (e) => { if(e.target === modalContainer) modalContainer.remove(); });
    }

    modalContainer.innerHTML = `
        <div class="bg-white dark:bg-[#1e293b] w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden relative flex flex-col md:flex-row" onclick="event.stopPropagation()">
            <button onclick="document.getElementById('combined-avatar-modal').remove()" class="absolute top-4 right-4 text-gray-500 hover:text-red-500 z-50 text-2xl">&times;</button>
            
            <!-- АНКЕТА -->
            <div class="w-full md:w-1/2 p-8 bg-gray-50 dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700">
                <div class="flex flex-col items-center mb-6">
                    <img src="${uData.photo || 'https://ui-avatars.com/api/?name=U'}" class="w-24 h-24 rounded-full object-cover border-4 border-indigo-500 shadow-md mb-4">
                    <h3 class="text-2xl font-bold text-gray-900 dark:text-white">${uData.name.replace(' (You)', '')}</h3>
                </div>
                <div class="space-y-4 text-sm mt-4 text-gray-800 dark:text-gray-200">
                    <p><b class="text-gray-500" data-i18n="cv_country">Country:</b> ${uData.flag || '🌍'} ${uData.country || '-'}</p>
                    <p><b class="text-gray-500" data-i18n="cv_langs">Languages:</b> ${uData.profileLangs || cv.languages || '-'}</p>
                    <p><b class="text-gray-500" data-i18n="prof_pop">Population:</b> ${uData.population || '-'}</p>
                    <p><b class="text-gray-500" data-i18n="prof_seas">Seas:</b> ${uData.seas || '-'}</p>
                </div>
            </div>
            
            <!-- 5 ФУНКЦИЙ (Сетка) -->
            <div class="w-full md:w-1/2 p-8 flex flex-col justify-center bg-[#1e293b] text-white">
                <div class="grid grid-cols-2 gap-3 w-full">
                    <button onclick="actionPrivateChatFromCV('${uid}')" class="flex flex-col items-center justify-center p-3.5 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-colors border border-slate-700">
                        <i class="fa-solid fa-message text-xl mb-2 text-indigo-500"></i>
                        <span class="text-xs font-bold" data-i18n="action_chat">Private Chat</span>
                    </button>
                    <button onclick="actionVoiceRoom('${uid}')" class="flex flex-col items-center justify-center p-3.5 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-colors border border-slate-700">
                        <i class="fa-solid fa-phone text-xl mb-2 text-green-500"></i>
                        <span class="text-xs font-bold" data-i18n="action_voice">Voice Room</span>
                    </button>
                    <button onclick="actionVideoConf('${uid}')" class="flex flex-col items-center justify-center p-3.5 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-colors border border-slate-700">
                        <i class="fa-solid fa-video text-xl mb-2 text-blue-500"></i>
                        <span class="text-xs font-bold" data-i18n="action_video">Video Conf</span>
                    </button>
                    <button onclick="actionSendEmail('${uid}')" class="flex flex-col items-center justify-center p-3.5 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-colors border border-slate-700">
                        <i class="fa-solid fa-envelope text-xl mb-2 text-red-500"></i>
                        <span class="text-xs font-bold" data-i18n="action_email">Send Email</span>
                    </button>
                    <button onclick="actionExternalCall('${uid}')" class="col-span-2 flex items-center justify-center gap-3 p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-colors shadow-md mt-1">
                        <i class="fa-solid fa-mobile-screen-button text-lg"></i>
                        <span class="text-sm font-bold tracking-wide" data-i18n="action_cellular">Cellular Call</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    if(typeof window.applySystemLanguage === 'function') window.applySystemLanguage(); 
};

// Обработчики кнопок модалки
window.actionExternalCall = function(uid) {
    let phoneToCall = null;
    if (uid === 'me' && window.myProfileInfo) phoneToCall = window.myProfileInfo.phone;
    else if (window.appUsers && window.appUsers[uid]) phoneToCall = window.appUsers[uid].phone;
    if (phoneToCall) { window.location.href = `tel:${phoneToCall}`; document.getElementById('combined-avatar-modal')?.remove(); } 
    else { alert("Номер телефона не указан."); }
};
window.actionVoiceRoom = function(uid) { document.getElementById('combined-avatar-modal')?.remove(); if(typeof window.openVoiceChat === 'function') window.openVoiceChat(); };
window.actionVideoConf = function(uid) { document.getElementById('combined-avatar-modal')?.remove(); if(typeof window.openConference === 'function') window.openConference(); };
window.actionSendEmail = function(uid) { 
    document.getElementById('combined-avatar-modal')?.remove(); 
    const u = window.appUsers ? window.appUsers[uid] : null;
    if(u && u.email) {
        if(typeof window.openEmailModal === 'function') window.openEmailModal();
        setTimeout(() => { const el = document.getElementById('email-to-input'); if(el) el.value = u.email; }, 100);
    } else {
        alert("Email не указан.");
    }
};
