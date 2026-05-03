// ==========================================
// DATA CENTER & ARCHIVE (WEB ВЕРСИЯ)
// ==========================================

window.mailArchiveDB = window.mailArchiveDB || [];
window.currentArchiveTab = 'mail';

window.switchArchiveTab = function(tab) {
    window.currentArchiveTab = tab;
    const listView = document.getElementById('archive-list');
    if (!listView) return;

    if (tab === 'mail') {
        window.renderArchiveList('email', window.mailArchiveDB);
    } else {
        listView.innerHTML = '<p class="text-center text-gray-500 mt-10">Хранилище пусто.</p>';
    }
};

window.renderArchiveList = function(type, dbArray) {
    const list = document.getElementById('archive-list');
    if (!list) return;
    
    if (!dbArray || dbArray.length === 0) {
        list.innerHTML = '<p class="text-center text-gray-500 mt-10">Архив пуст.</p>';
        return;
    }
    
    list.innerHTML = '';
    
    dbArray.forEach(item => {
        let icon = type === 'email' ? '<i class="fa-solid fa-envelope text-indigo-500"></i>' : '<i class="fa-solid fa-file-lines text-green-500"></i>';
        let safeTitle = (item.title || item.subject || 'Файл').replace(/'/g, "\\'").replace(/"/g, '&quot;');
        let sender = item.sender || item.from || 'System';

        let domItem = document.createElement('div');
        domItem.className = `flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 mb-3 hover:shadow-md cursor-pointer transition`;
        
        domItem.innerHTML = `
            <div class="flex items-center gap-4 w-full">
                <div class="w-12 h-12 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-xl shrink-0">
                    ${icon}
                </div>
                <div class="flex flex-col flex-1 overflow-hidden">
                    <div class="flex justify-between items-center w-full mb-1">
                        <span class="text-xs text-indigo-500 dark:text-[#00faad] font-bold uppercase truncate">${sender}</span>
                        <span class="text-xs text-gray-400 font-mono">${item.date || 'Saved'}</span>
                    </div>
                    <span class="text-gray-900 dark:text-white font-bold text-sm truncate">${safeTitle}</span>
                </div>
            </div>
            <button class="text-gray-400 hover:text-indigo-500 transition ml-4 p-2 text-xl shrink-0"><i class="fa-solid fa-download"></i></button>
        `;
        list.appendChild(domItem);
    });
};
