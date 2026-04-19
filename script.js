// ==========================================
// 1. إعدادات FIREBASE (الربط السحابي)
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove, update, set } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBkh7Mp-ixAnlQbERW5f4FYDhFEDN8q2zk",
    authDomain: "molahadatma.firebaseapp.com",
    databaseURL: "https://molahadatma-default-rtdb.firebaseio.com",
    projectId: "molahadatma",
    storageBucket: "molahadatma.firebasestorage.app",
    messagingSenderId: "218152694932",
    appId: "1:218152694932:web:7b973873a194f72e8cb081",
    measurementId: "G-DHNGCLMPMF"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const notesRef = ref(db, 'notes');

// ==========================================
// 2. بيانات التطبيق (نفس القائمة الطويلة ديالك)
// ==========================================
let notes = [];
let currentUser = '';

const subjects = [
    { id: 'math', name: 'رياضيات', icon: 'fas fa-calculator', color: '#667eea', colorDark: '#764ba2' },
    { id: 'science', name: 'علوم', icon: 'fas fa-flask', color: '#10b981', colorDark: '#059669' },
    { id: 'physics', name: 'فيزياء', icon: 'fas fa-atom', color: '#3b82f6', colorDark: '#1d4ed8' },
    { id: 'chemistry', name: 'كيمياء', icon: 'fas fa-vial', color: '#8b5cf6', colorDark: '#7c3aed' },
    { id: 'biology', name: 'أحياء', icon: 'fas fa-dna', color: '#84cc16', colorDark: '#65a30d' },
    { id: 'arabic', name: 'لغة عربية', icon: 'fas fa-language', color: '#f59e0b', colorDark: '#d97706' },
    { id: 'english', name: 'لغة إنجليزية', icon: 'fas fa-globe', color: '#ef4444', colorDark: '#dc2626' },
    { id: 'french', name: 'لغة فرنسية', icon: 'fas fa-flag', color: '#ec4899', colorDark: '#db2777' },
    { id: 'history', name: 'تاريخ', icon: 'fas fa-landmark', color: '#f97316', colorDark: '#ea580c' },
    { id: 'geography', name: 'جغرافيا', icon: 'fas fa-globe-americas', color: '#06b6d4', colorDark: '#0891b2' },
    { id: 'islamic', name: 'تربية إسلامية', icon: 'fas fa-mosque', color: '#8b5cf6', colorDark: '#7c3aed' },
    { id: 'art', name: 'تربية فنية', icon: 'fas fa-palette', color: '#ec4899', colorDark: '#db2777' },
    { id: 'sport', name: 'تربية رياضية', icon: 'fas fa-running', color: '#84cc16', colorDark: '#65a30d' },
    { id: 'tech', name: 'تكنولوجيا', icon: 'fas fa-laptop-code', color: '#6366f1', colorDark: '#4f46e5' },
    { id: 'economy', name: 'اقتصاد', icon: 'fas fa-chart-line', color: '#10b981', colorDark: '#059669' },
    { id: 'philosophy', name: 'فلسفة', icon: 'fas fa-brain', color: '#8b5cf6', colorDark: '#7c3aed' },
    { id: 'psychology', name: 'علم نفس', icon: 'fas fa-user-friends', color: '#ec4899', colorDark: '#db2777' },
    { id: 'sociology', name: 'اجتماعيات', icon: 'fas fa-users', color: '#f59e0b', colorDark: '#d97706' },
    { id: 'civil', name: 'تربية مدنية', icon: 'fas fa-balance-scale', color: '#3b82f6', colorDark: '#1d4ed8' },
    { id: 'music', name: 'موسيقى', icon: 'fas fa-music', color: '#8b5cf6', colorDark: '#7c3aed' }
];

// ==========================================
// 3. تهيئة التطبيق (INIT APP)
// ==========================================
window.initApp = function() {
    console.log('🔧 جاري بدء تشغيل المنصة...');
    
    // تحميل المستخدم من LocalStorage
    currentUser = localStorage.getItem('currentUser') || '';
    
    // تحديث الواجهة
    updateSubjectSelect();
    displaySubjectButtons();
    displaySubjects();
    setupEventListeners();
    
    // فحص الدخول
    if (!currentUser) {
        setTimeout(showLoginModal, 1000);
    } else {
        updateNavUser();
    }

    // الربط المباشر مع Firebase (Data Sync)
    onValue(notesRef, (snapshot) => {
        const data = snapshot.val();
        notes = [];
        if (data) {
            Object.keys(data).forEach(key => {
                notes.push({ id: key, ...data[key] });
            });
            // ترتيب من الأحدث للأقدم
            notes.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        } else {
            console.log('📭 قاعدة البيانات فارغة');
        }
        displayNotes();
        displaySubjects();
    });
};

// ==========================================
// 4. دوال الحفظ والمسح (التعامل مع Firebase)
// ==========================================
window.addNote = function() {
    const titleInput = document.getElementById('noteTitle');
    const subjectInput = document.getElementById('noteSubject');
    const contentInput = document.getElementById('noteContent');

    const title = titleInput.value.trim();
    const subject = subjectInput.value;
    const content = contentInput.value.trim();

    // التحققات الطويلة (Validation)
    if (!currentUser) { showMessage('سجل دخولك أولاً!', 'error'); showLoginModal(); return; }
    if (!title) { showMessage('العنوان مطلوب', 'error'); titleInput.focus(); return; }
    if (!subject) { showMessage('اختر المادة', 'error'); subjectInput.focus(); return; }
    if (!content) { showMessage('المحتوى فارغ!', 'error'); contentInput.focus(); return; }
    if (title.length > 100) { showMessage('العنوان طويل بزاف', 'error'); return; }

    const subjectInfo = getSubjectInfo(subject);
    
    const noteData = {
        title: title,
        subject: subject,
        subjectIcon: subjectInfo.icon,
        subjectColor: subjectInfo.color,
        author: currentUser,
        content: content,
        date: new Date().toLocaleDateString('ar-EG'),
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        likes: 0,
        views: Math.floor(Math.random() * 100),
        timestamp: Date.now()
    };

    push(notesRef, noteData)
        .then(() => {
            clearForm();
            showMessage('تم نشر ملاحظتك بنجاح! 🚀', 'success');
        })
        .catch((err) => {
            showMessage('خطأ في الاتصال بالسيرفر', 'error');
            console.error(err);
        });
};

window.deleteNote = function(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;

    if (note.author !== currentUser) {
        showMessage('هذه ليست ملاحظتك لحذفها!', 'error');
        return;
    }

    if (confirm('⚠️ واش بصح بغيتي تمسح هاد الملاحظة؟')) {
        remove(ref(db, `notes/${noteId}`))
            .then(() => showMessage('تم الحذف بنجاح', 'info'))
            .catch(() => showMessage('تعذر الحذف', 'error'));
    }
};

window.likeNote = function(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (note) {
        const updateRef = ref(db, `notes/${noteId}`);
        update(updateRef, { likes: (note.likes || 0) + 1 });
    }
};

// ==========================================
// 5. دوال الواجهة والعرض (DOM MANIPULATION)
// ==========================================
window.displayNotes = function() {
    const notesList = document.getElementById('notesList');
    const searchTerm = document.getElementById('searchNotes').value.toLowerCase();
    const filterSubject = document.getElementById('filterSubject').value;
    const sortBy = document.getElementById('sortBy').value;

    let result = [...notes];

    // فلترة البحث
    if (searchTerm) {
        result = result.filter(n => 
            n.title.toLowerCase().includes(searchTerm) || 
            n.content.toLowerCase().includes(searchTerm) ||
            n.author.toLowerCase().includes(searchTerm)
        );
    }

    // فلترة المادة
    if (filterSubject) {
        result = result.filter(n => n.subject === filterSubject);
    }

    // الترتيب (المنطق الطويل)
    if (sortBy === 'oldest') result.sort((a, b) => a.timestamp - b.timestamp);
    else if (sortBy === 'mostLikes') result.sort((a, b) => b.likes - a.likes);

    if (result.length === 0) {
        notesList.innerHTML = `<div class="empty-state"><h3>ما كاين حتى ملاحظة هنا..</h3></div>`;
        return;
    }

    notesList.innerHTML = result.map(n => `
        <div class="note-card" style="border-right: 5px solid ${n.subjectColor}">
            <div class="note-header">
                <h3 class="note-title">${n.title}</h3>
                <span class="note-subject"><i class="${n.subjectIcon}"></i> ${n.subject}</span>
            </div>
            <div class="note-author"><i class="fas fa-user-circle"></i> ${n.author}</div>
            <div class="note-content">${n.content.replace(/\n/g, '<br>')}</div>
            <div class="note-footer">
                <span class="note-date">${n.date} - ${n.time}</span>
                <div class="note-actions">
                    <button class="action-btn" onclick="likeNote('${n.id}')">❤️ ${n.likes}</button>
                    <button class="action-btn" onclick="copyNoteContent('${n.id}')"><i class="far fa-copy"></i></button>
                    <button class="action-btn" onclick="shareNote('${n.id}')"><i class="fas fa-share-alt"></i></button>
                    ${n.author === currentUser ? `<button class="action-btn delete" onclick="deleteNote('${n.id}')">🗑️</button>` : ''}
                </div>
            </div>
        </div>
    `).join('');
};

// ==========================================
// 6. الدوال المساعدة (نفس كودك الأصلي تماماً)
// ==========================================

window.saveUsername = function() {
    const input = document.getElementById('usernameInput');
    const name = input.value.trim();
    if (name.length >= 2) {
        currentUser = name;
        localStorage.setItem('currentUser', name);
        document.getElementById('loginModal').style.display = 'none';
        updateNavUser();
        showMessage(`مرحباً ${name}! 👋`, 'success');
    }
};

window.copyNoteContent = function(id) {
    const n = notes.find(x => x.id === id);
    if (n) {
        const txt = `${n.title}\nالمادة: ${n.subject}\nبواسطة: ${n.author}\n\n${n.content}`;
        navigator.clipboard.writeText(txt).then(() => showMessage('تم النسخ!', 'success'));
    }
};

window.shareNote = function(id) {
    const n = notes.find(x => x.id === id);
    if (n && navigator.share) {
        navigator.share({ title: n.title, text: n.content, url: window.location.href });
    }
};

function updateNavUser() {
    const nav = document.getElementById('navUser');
    if (nav) {
        nav.innerHTML = `
            <span>👤 ${currentUser}</span>
            <button onclick="exportNotes()" class="btn-secondary">📥 حفظ نسخة</button>
            <button onclick="logout()" class="btn-logout">خروج</button>
        `;
    }
}

window.logout = function() {
    if (confirm('تسجيل الخروج؟')) {
        localStorage.removeItem('currentUser');
        location.reload();
    }
};

function updateSubjectSelect() {
    const s = document.getElementById('noteSubject');
    const f = document.getElementById('filterSubject');
    if (s && f) {
        const html = subjects.map(x => `<option value="${x.name}">${x.name}</option>`).join('');
        s.innerHTML = '<option value="">اختر المادة</option>' + html;
        f.innerHTML = '<option value="">كل المواد</option>' + html;
    }
}

function displaySubjectButtons() {
    const container = document.getElementById('subjectOptions');
    if (container) {
        container.innerHTML = subjects.map(s => `
            <div class="subject-option" onclick="selectSubject('${s.name}')" style="border-color:${s.color}">
                <i class="${s.icon}" style="color:${s.color}"></i>
                <span>${s.name}</span>
            </div>
        `).join('');
    }
}

window.selectSubject = function(name) {
    document.getElementById('noteSubject').value = name;
    document.querySelectorAll('.subject-option').forEach(el => {
        el.classList.toggle('selected', el.innerText.includes(name));
    });
};

function displaySubjects() {
    const container = document.getElementById('subjectsContainer');
    if (!container) return;
    const counts = {};
    notes.forEach(n => counts[n.subject] = (counts[n.subject] || 0) + 1);
    container.innerHTML = subjects.map(s => `
        <div class="subject-card" onclick="filterBySubject('${s.name}')" style="--subject-color: ${s.color}">
            <i class="${s.icon}"></i>
            <h4>${s.name}</h4>
            <small>${counts[s.name] || 0} ملاحظة</small>
        </div>
    `).join('');
}

window.filterBySubject = function(n) {
    document.getElementById('filterSubject').value = n;
    displayNotes();
};

function getSubjectInfo(name) {
    return subjects.find(s => s.name === name) || { icon: 'fas fa-book', color: '#6b7280' };
}

window.exportNotes = function() {
    const data = JSON.stringify(notes, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes_backup.json`;
    a.click();
};

function clearForm() {
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteContent').value = '';
    document.getElementById('noteSubject').value = '';
}

function showMessage(msg, type) {
    const m = document.createElement('div');
    m.className = `message ${type}`;
    m.style = "position:fixed; bottom:20px; right:20px; background:#222; color:#fff; padding:15px; border-radius:10px; z-index:9999; border-right:4px solid " + (type==='success'?'#4caf50':'#f44336');
    m.innerText = msg;
    document.body.appendChild(m);
    setTimeout(() => m.remove(), 3500);
}

function setupEventListeners() {
    document.getElementById('searchNotes')?.addEventListener('input', displayNotes);
    document.getElementById('filterSubject')?.addEventListener('change', displayNotes);
    document.getElementById('sortBy')?.addEventListener('change', displayNotes);
}

document.addEventListener('DOMContentLoaded', initApp);
