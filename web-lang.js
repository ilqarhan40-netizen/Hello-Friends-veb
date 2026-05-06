// ==========================================
// ЛИНГВИСТИЧЕСКИЙ ЦЕНТР (WEB ВЕРСИЯ - ИДЕАЛЬНАЯ СБОРКА)
// ==========================================

// 1. ПОЛНЫЙ СЛОВАРЬ ЭКОСИСТЕМЫ (Меню + CV + Настройки + Звонки)
const i18n = { 
    en: { nav_chat: "Chat", nav_voice: "Voice Chat", nav_conf: "Conference", nav_prof: "Profession", nav_contacts: "Contacts", nav_archive: "Archive", search_ph: "Search users...", global_chat: "Global Chat", welcome_title: "Welcome to Hello Friends!", global_network: "Global Smart Network", creator_badge: "Hello Friends Creator", menu: "Settings", profile: "Profile", wallet: "Wallet", email_store: "Email Store", theme: "Change Theme", logout: "Logout", action_chat: "Private Chat", action_voice: "Voice Room", action_video: "Video Conf", action_email: "Send Email", action_cellular: "Cellular Call", cv_prof: "Profession", cv_langs: "Languages", cv_country: "Country", cv_phone: "Phone", cv_exp: "Experience", cv_edu: "Education", cv_skills: "Core Competencies", cv_about: "About Me", cv_edit_title: "Edit CV", cv_role: "Main Role", cv_save_btn: "Save CV", select_room_lang: "Room Language", cancel: "Cancel", prof_pop: "Population", prof_seas: "Seas" },
    ru: { nav_chat: "Чат", nav_voice: "Голосовой", nav_conf: "Конференция", nav_prof: "Профессии", nav_contacts: "Контакты", nav_archive: "Архив", search_ph: "Поиск...", global_chat: "Глобальный Чат", welcome_title: "Добро пожаловать в Hello Friends!", global_network: "Глобальная Смарт-Сеть", creator_badge: "Создатель Hello Friends", menu: "Настройки", profile: "Профиль", wallet: "Кошелек", email_store: "Почтовый Магазин", theme: "Сменить Тему", logout: "Выйти", action_chat: "Личный Чат", action_voice: "Голосовая Комната", action_video: "Видеоконференция", action_email: "Написать Email", action_cellular: "Сотовый Звонок", cv_prof: "Профессия", cv_langs: "Языки", cv_country: "Страна", cv_phone: "Телефон", cv_exp: "Опыт работы", cv_edu: "Образование", cv_skills: "Навыки", cv_about: "Обо мне", cv_edit_title: "Редактировать Резюме", cv_role: "Должность", cv_save_btn: "Сохранить Резюме", select_room_lang: "Язык комнаты", cancel: "Отмена", prof_pop: "Население", prof_seas: "Моря" },
    az: { nav_chat: "Çat", nav_voice: "Səsli Çat", nav_conf: "Konfrans", nav_prof: "Peşələr", nav_contacts: "Əlaqələr", nav_archive: "Arxiv", search_ph: "Axtarış...", global_chat: "Qlobal Çat", welcome_title: "Hello Friends-ə Xoş Gəldiniz!", global_network: "Qlobal Ağıllı Şəbəkə", creator_badge: "Hello Friends Yaradıcısı", menu: "Tənzimləmələr", profile: "Profil", wallet: "Pulqabı", email_store: "Email Mağazası", theme: "Mövzunu Dəyiş", logout: "Çıxış", action_chat: "Şəxsi Çat", action_voice: "Səsli Otaq", action_video: "Video Konfrans", action_email: "Email Göndər", action_cellular: "Mobil Zəng", cv_prof: "Peşə", cv_langs: "Dillər", cv_country: "Ölkə", cv_phone: "Telefon", cv_exp: "Təcrübə", cv_edu: "Təhsil", cv_skills: "Bacarıqlar", cv_about: "Haqqımda", cv_edit_title: "CV-ni Yenilə", cv_role: "Vəzifə", cv_save_btn: "CV-ni Yadda Saxla", select_room_lang: "Otaq Dili", cancel: "Ləğv et", prof_pop: "Əhali", prof_seas: "Dənizlər" },
    de: { nav_chat: "Chat", nav_voice: "Sprachchat", nav_conf: "Konferenz", nav_prof: "Berufe", nav_contacts: "Kontakte", nav_archive: "Archiv", search_ph: "Suchen...", global_chat: "Globaler Chat", welcome_title: "Willkommen bei Hello Friends!", global_network: "Globales Smart-Netzwerk", creator_badge: "Hello Friends Schöpfer", menu: "Einstellungen", profile: "Profil", wallet: "Brieftasche", email_store: "E-Mail-Shop", theme: "Thema ändern", logout: "Abmelden", action_chat: "Privater Chat", action_voice: "Sprachraum", action_video: "Videokonferenz", action_email: "E-Mail senden", action_cellular: "Handyanruf", cv_prof: "Beruf", cv_langs: "Sprachen", cv_country: "Land", cv_phone: "Telefon", cv_exp: "Erfahrung", cv_edu: "Ausbildung", cv_skills: "Kompetenzen", cv_about: "Über mich", cv_edit_title: "Lebenslauf bearbeiten", cv_role: "Hauptrolle", cv_save_btn: "Speichern", select_room_lang: "Raumsprache", cancel: "Abbrechen", prof_pop: "Bevölkerung", prof_seas: "Meere" },
    tr: { nav_chat: "Sohbet", nav_voice: "Sesli Sohbet", nav_conf: "Konferans", nav_prof: "Meslekler", nav_contacts: "Kişiler", nav_archive: "Arşiv", search_ph: "Ara...", global_chat: "Küresel Sohbet", welcome_title: "Hello Friends'e Hoş Geldiniz!", global_network: "Küresel Akıllı Ağ", creator_badge: "Hello Friends Kurucusu", menu: "Ayarlar", profile: "Profil", wallet: "Cüzdan", email_store: "E-posta Mağazası", theme: "Temayı Değiştir", logout: "Çıkış Yap", action_chat: "Özel Sohbet", action_voice: "Ses Odası", action_video: "Video Konferans", action_email: "E-posta Gönder", action_cellular: "Hücresel Arama", cv_prof: "Meslek", cv_langs: "Diller", cv_country: "Ülke", cv_phone: "Telefon", cv_exp: "Deneyim", cv_edu: "Eğitim", cv_skills: "Yetenekler", cv_about: "Hakkımda", cv_edit_title: "CV'yi Düzenle", cv_role: "Ana Rol", cv_save_btn: "CV'yi Kaydet", select_room_lang: "Oda Dili", cancel: "İptal", prof_pop: "Nüfus", prof_seas: "Denizler" },
    ar: { nav_chat: "محادثة", nav_voice: "صوت", nav_conf: "مؤتمر", nav_prof: "المهن", nav_contacts: "جهات الاتصال", nav_archive: "أرشيف", search_ph: "بحث...", global_chat: "الدردشة العالمية", welcome_title: "مرحباً بك في Hello Friends!", global_network: "الشبكة الذكية العالمية", creator_badge: "منشئ Hello Friends", menu: "الإعدادات", profile: "الملف الشخصي", wallet: "المحفظة", email_store: "متجر البريد", theme: "تغيير المظهر", logout: "تسجيل الخروج", action_chat: "دردشة خاصة", action_voice: "غرفة صوتية", action_video: "مؤتمر فيديو", action_email: "إرسال بريد", action_cellular: "مكالمة خلوية", cv_prof: "المهنة", cv_langs: "اللغات", cv_country: "البلد", cv_phone: "الهاتف", cv_exp: "الخبرة", cv_edu: "التعليم", cv_skills: "الكفاءات", cv_about: "نبذة عني", cv_edit_title: "تعديل السيرة الذاتية", cv_role: "الدور الرئيسي", cv_save_btn: "حفظ", select_room_lang: "لغة الغرفة", cancel: "إلغاء", prof_pop: "السكان", prof_seas: "البحار" },
    it: { nav_chat: "Chat", nav_voice: "Voce", nav_conf: "Conferenza", nav_prof: "Professioni", nav_contacts: "Contatti", nav_archive: "Archivio", search_ph: "Cerca...", global_chat: "Chat Globale", welcome_title: "Benvenuto in Hello Friends!", global_network: "Rete Intelligente Globale", creator_badge: "Creatore", menu: "Impostazioni", profile: "Profilo", wallet: "Portafoglio", email_store: "Negozio Email", theme: "Cambia Tema", logout: "Esci", action_chat: "Chat Privata", action_voice: "Stanza Vocale", action_video: "Videoconferenza", action_email: "Invia Email", action_cellular: "Chiamata", cv_prof: "Professione", cv_langs: "Lingue", cv_country: "Paese", cv_phone: "Telefono", cv_exp: "Esperienza", cv_edu: "Istruzione", cv_skills: "Competenze", cv_about: "Su di me", cv_edit_title: "Modifica CV", cv_role: "Ruolo", cv_save_btn: "Salva", select_room_lang: "Lingua Stanza", cancel: "Annulla", prof_pop: "Popolazione", prof_seas: "Mari" },
    es: { nav_chat: "Chat", nav_voice: "Voz", nav_conf: "Conferencia", nav_prof: "Profesiones", nav_contacts: "Contactos", nav_archive: "Archivo", search_ph: "Buscar...", global_chat: "Chat Global", welcome_title: "¡Bienvenido a Hello Friends!", global_network: "Red Inteligente", creator_badge: "Creador", menu: "Configuración", profile: "Perfil", wallet: "Billetera", email_store: "Tienda Email", theme: "Cambiar Tema", logout: "Cerrar Sesión", action_chat: "Chat Privado", action_voice: "Sala de Voz", action_video: "Videoconferencia", action_email: "Enviar Email", action_cellular: "Llamada", cv_prof: "Profesión", cv_langs: "Idiomas", cv_country: "País", cv_phone: "Teléfono", cv_exp: "Experiencia", cv_edu: "Educación", cv_skills: "Habilidades", cv_about: "Sobre mí", cv_edit_title: "Editar CV", cv_role: "Rol", cv_save_btn: "Guardar", select_room_lang: "Idioma Sala", cancel: "Cancelar", prof_pop: "Población", prof_seas: "Mares" },
    fr: { nav_chat: "Chat", nav_voice: "Voix", nav_conf: "Conférence", nav_prof: "Professions", nav_contacts: "Contacts", nav_archive: "Archives", search_ph: "Rechercher...", global_chat: "Chat Global", welcome_title: "Bienvenue sur Hello Friends!", global_network: "Réseau Intelligent", creator_badge: "Créateur", menu: "Paramètres", profile: "Profil", wallet: "Portefeuille", email_store: "Boutique Email", theme: "Changer Thème", logout: "Déconnexion", action_chat: "Chat Privé", action_voice: "Salle Vocale", action_video: "Vidéoconférence", action_email: "Envoyer Email", action_cellular: "Appel", cv_prof: "Profession", cv_langs: "Langues", cv_country: "Pays", cv_phone: "Téléphone", cv_exp: "Expérience", cv_edu: "Éducation", cv_skills: "Compétences", cv_about: "À Propos", cv_edit_title: "Modifier CV", cv_role: "Rôle", cv_save_btn: "Enregistrer", select_room_lang: "Langue Salle", cancel: "Annuler", prof_pop: "Population", prof_seas: "Mers" },
    pt: { nav_chat: "Chat", nav_voice: "Voz", nav_conf: "Conferência", nav_prof: "Profissões", nav_contacts: "Contatos", nav_archive: "Arquivo", search_ph: "Buscar...", global_chat: "Chat Global", welcome_title: "Bem-vindo ao Hello Friends!", global_network: "Rede Global", creator_badge: "Criador", menu: "Configurações", profile: "Perfil", wallet: "Carteira", email_store: "Loja Email", theme: "Mudar Tema", logout: "Sair", action_chat: "Chat Privado", action_voice: "Sala de Voz", action_video: "Videoconferência", action_email: "Enviar Email", action_cellular: "Chamada", cv_prof: "Profissão", cv_langs: "Idiomas", cv_country: "País", cv_phone: "Telefone", cv_exp: "Experiência", cv_edu: "Educação", cv_skills: "Habilidades", cv_about: "Sobre mim", cv_edit_title: "Editar CV", cv_role: "Papel", cv_save_btn: "Salvar", select_room_lang: "Idioma Sala", cancel: "Cancelar", prof_pop: "População", prof_seas: "Mares" },
    ja: { nav_chat: "チャット", nav_voice: "音声", nav_conf: "会議", nav_prof: "職業", nav_contacts: "連絡先", nav_archive: "アーカイブ", search_ph: "検索...", global_chat: "グローバル", welcome_title: "Hello Friendsへようこそ", global_network: "グローバルネットワーク", creator_badge: "クリエイター", menu: "設定", profile: "プロフィール", wallet: "ウォレット", email_store: "メールストア", theme: "テーマ変更", logout: "ログアウト", action_chat: "プライベート", action_voice: "ボイスルーム", action_video: "ビデオ会議", action_email: "メール送信", action_cellular: "通話", cv_prof: "職業", cv_langs: "言語", cv_country: "国", cv_phone: "電話", cv_exp: "経験", cv_edu: "教育", cv_skills: "スキル", cv_about: "私について", cv_edit_title: "履歴書編集", cv_role: "役割", cv_save_btn: "保存", select_room_lang: "ルーム言語", cancel: "キャンセル", prof_pop: "人口", prof_seas: "海" },
    zh: { nav_chat: "聊天", nav_voice: "语音", nav_conf: "会议", nav_prof: "职业", nav_contacts: "联系人", nav_archive: "档案", search_ph: "搜索...", global_chat: "全球聊天", welcome_title: "欢迎来到 Hello Friends", global_network: "全球智能网络", creator_badge: "创始人", menu: "设置", profile: "个人资料", wallet: "钱包", email_store: "邮箱商店", theme: "更改主题", logout: "登出", action_chat: "私人聊天", action_voice: "语音室", action_video: "视频会议", action_email: "发送邮件", action_cellular: "手机呼叫", cv_prof: "职业", cv_langs: "语言", cv_country: "国家", cv_phone: "电话", cv_exp: "经验", cv_edu: "教育", cv_skills: "技能", cv_about: "关于我", cv_edit_title: "编辑简历", cv_role: "角色", cv_save_btn: "保存", select_room_lang: "房间语言", cancel: "取消", prof_pop: "人口", prof_seas: "海洋" }
};

// 2. УМНОЕ ОПРЕДЕЛЕНИЕ ЯЗЫКА (Твоя логика!)
window.getSmartLang = function(userProfile) {
    if (!userProfile) return navigator.language ? navigator.language.slice(0, 2) : 'en'; 
    
    let phone = (userProfile.phone || "").replace(/\s+/g, '');
    let flag = userProfile.flagCode || "un";
    let langPref = userProfile.langCode;

    if (langPref && langPref !== 'auto' && langPref !== 'un') return langPref;
    
    if (phone.startsWith('+7')) return 'ru';
    if (phone.startsWith('+994')) return 'az';
    if (phone.startsWith('+39')) return 'it';
    if (phone.startsWith('+49')) return 'de';
    if (phone.startsWith('+33')) return 'fr';
    if (phone.startsWith('+81')) return 'ja';
    if (phone.startsWith('+34')) return 'es';
    if (phone.startsWith('+86')) return 'zh';
    if (phone.startsWith('+351')) return 'pt';
    if (phone.startsWith('+1') || phone.startsWith('+44')) return 'en';
    if (phone.startsWith('+971')) return 'ar';

    const flagToLang = { 'ru': 'ru', 'az': 'az', 'it': 'it', 'de': 'de', 'fr': 'fr', 'jp': 'ja', 'es': 'es', 'cn': 'zh', 'pt': 'pt', 'gb': 'en', 'us': 'en', 'ae': 'ar', 'tr': 'tr' };
    if (flagToLang[flag]) return flagToLang[flag];
    
    return navigator.language ? navigator.language.slice(0, 2) : 'en';
};

// 3. ГЛАВНАЯ ФУНКЦИЯ ПЕРЕВОДА (С ЗАЩИТОЙ ИКОНОК!)
window.applySystemLanguage = function() { 
    let savedLang = localStorage.getItem('hf_app_lang') || 'auto';
    let activeLang = savedLang;

    if (savedLang === 'auto') {
        if (window.myProfileInfo) {
            activeLang = window.getSmartLang(window.myProfileInfo);
        } else {
            let sysLang = navigator.language.slice(0, 2);
            activeLang = i18n[sysLang] ? sysLang : 'en';
        }
    }
    
    window.appLang = activeLang;
    const dict = i18n[window.appLang] || i18n['en']; 
    
    document.querySelectorAll('[data-i18n]').forEach(el => { 
        const key = el.getAttribute('data-i18n'); 
        if(dict[key]) {
            // 🔥 ЗАЩИТА ИКОНОК: Сохраняем иконку, если она есть внутри кнопки
            const icon = el.querySelector('i');
            if (icon) {
                el.innerHTML = ''; // Очищаем всё
                el.appendChild(icon); // Возвращаем иконку
                el.innerHTML += ' ' + dict[key]; // Добавляем переведенный текст
            } else {
                el.innerText = dict[key]; // Если иконки нет, просто меняем текст
            }
        } 
    }); 
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if(dict[key]) el.placeholder = dict[key];
    });

    const langSelect = document.getElementById('app-lang-select'); 
    if(langSelect) langSelect.value = savedLang; 
};

// 4. СМЕНА ЯЗЫКА ВРУЧНУЮ
window.changeAppLanguage = function(langCode) { 
    localStorage.setItem('hf_app_lang', langCode); 
    window.applySystemLanguage(); 
    if(typeof window.closeDropdown === 'function') window.closeDropdown(); // Закрываем меню
};

// Запуск при старте
document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('hf_app_lang') || 'auto';
    if(saved !== 'auto') window.applySystemLanguage();
});
