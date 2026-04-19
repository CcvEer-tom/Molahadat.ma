// ==============================
// 1. إعدادات Firebase
// ==============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

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

// ==============================
// 2. بيانات التطبيق
// ==============================
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

// ==============================
// 3. الدوال الأساسية (ربط بـ window)
// ==============================

window.initApp = function() {
    currentUser = localStorage.getItem('currentUser') || '';
    updateSubjectSelect();
    displaySubjectButtons();
    displaySubjects();
    setupEventListeners();
    
    if (!currentUser) {
        setTimeout(window.showLoginModal, 800);
    } else {
        updateNavUser();
    }

    onValue(notesRef, (snapshot) => {
        const data = snapshot.val();
        notes = [];
        if (data) {
            Object.keys(data).forEach(key => {
                notes.push({ id: key, ...data[key] });
            });
            notes.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        }
        window.displayNotes();
        displaySubjects();
    });
};

window.showLoginModal = function() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'flex';
        document.getElementById('usernameInput')?.focus();
    }
};

window.saveUsername = function() {
    const usernameInput = document.getElementById('usernameInput');
    const username = usernameInput.value.trim();
    if (username.length >= 2 && username.length <= 20) {
        currentUser = username;
        localStorage.setItem('currentUser', username);
        document.getElementById('loginModal').style.display = 'none';
        updateNavUser();
        showMessage(`مرحباً ${username}! 👋`, 'success');
    } else {
        showMessage('الاسم يجب أن يكون بين 2 و 20 حرفاً', 'error');
    }
};

// --- دالة إضافة مادة جديدة ---
window.addNewSubject = function() {
    const subjectName = prompt('أدخل اسم المادة الجديدة:');
    if (subjectName && subjectName.trim()) {
        const trimmedName = subjectName.trim();
        if (subjects.some(s => s.name === trimmedName)) {
            showMessage('هذه المادة موجودة بالفعل!', 'error');
            return;
        }
        const newSub = {
            id: Date.now().toString(),
            name: trimmedName,
            icon: 'fas fa-book',
            color: '#6b7280',
            colorDark: '#4b5563'
        };
        subjects.push(newSub);
        updateSubjectSelect();
        displaySubjectButtons();
        displaySubjects();
        showMessage(`تمت إضافة ${trimmedName} بنجاح`, 'success');
    }
};

window.addNote = function() {
    if (!currentUser) { window.showLoginModal(); return; }
    
    const title = document.getElementById('noteTitle').value.trim();
    const subject = document.getElementById('noteSubject').value;
    const content = document.getElementById('noteContent').value.trim();

    if (!title || !subject || !content) {
        showMessage('المرجو ملء جميع الخانات', 'error');
        return;
    }

    const subjectInfo = getSubjectInfo(subject);
    const newNote = {
        title, subject, content,
        author: currentUser,
        subjectIcon: subjectInfo.icon,
        subjectColor: subjectInfo.color,
        date: new Date().toLocaleDateString('ar-EG'),
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        likes: 0,
        timestamp: Date.now()
    };

    push(notesRef, newNote).then(() => {
        clearForm();
        showMessage('تمت الإضافة بنجاح!', 'success');
    });
};

window.displayNotes = function() {
    const searchTerm = document.getElementById('searchNotes').value.toLowerCase();
    const filterSubject = document.getElementById('filterSubject').value;
    const notesList = document.getElementById('notesList');
    if (!notesList) return;

    let filtered = notes.filter(n => {
        const matchesSearch = n.title.toLowerCase().includes(searchTerm) || n.content.toLowerCase().includes(searchTerm);
        const matchesSubject = !filterSubject || n.subject === filterSubject;
        return matchesSearch && matchesSubject;
    });

    notesList.innerHTML = filtered.map(n => `
        <div class="note-card" style="border-right: 5px solid ${n.subjectColor}">
            <div class="note-header">
                <h3 class="note-title">${n.title}</h3>
                <span class="note-subject"><i class="${n.subjectIcon}"></i> ${n.subject}</span>
            </div>
            <div class="note-author">👤 ${n.author}</div>
            <p class="note-content">${n.content.replace(/\n/g, '<br>')}</p>
            <div class="note-footer">
                <small>${n.date} ${n.time || ''}</small>
                <div class="note-actions">
                    <button class="action-btn" onclick="window.likeNote('${n.id}')">❤️ ${n.likes || 0}</button>
                    <button class="action-btn" onclick="window.copyNoteContent('${n.id}')">📋</button>
                    ${n.author === currentUser ? `<button class="action-btn delete" onclick="window.deleteNote('${n.id}')">🗑️</button>` : ''}
                </div>
            </div>
        </div>
    `).join('');
};

// ==============================
// 4. الدوال المساعدة وتحديث الواجهة
// ==============================

window.likeNote = function(id) {
    const note = notes.find(n => n.id === id);
    if (note) update(ref(db, `notes/${id}`), { likes: (note.likes || 0) + 1 });
};

window.deleteNote = function(id) {
    if (confirm('هل تريد حذف هذه الملاحظة؟')) remove(ref(db, `notes/${id}`));
};

window.copyNoteContent = function(id) {
    const n = notes.find(x => x.id === id);
    if (n) navigator.clipboard.writeText(n.content).then(() => showMessage('تم النسخ', 'success'));
};

window.logout = function() {
    localStorage.removeItem('currentUser');
    location.reload();
};

function updateNavUser() {
    const nav = document.getElementById('navUser');
    if (nav) nav.innerHTML = `<span>👤 ${currentUser}</span> <button onclick="window.logout()" class="btn-logout">خروج</button>`;
}

function updateSubjectSelect() {
    const s = document.getElementById('noteSubject'), f = document.getElementById('filterSubject');
    if (!s) return;
    const opts = subjects.map(x => `<option value="${x.name}">${x.name}</option>`).join('');
    s.innerHTML = '<option value="">اختر المادة</option>' + opts + '<option value="أخرى">أخرى</option>';
    if (f) f.innerHTML = '<option value="">كل المواد</option>' + opts;
}

function displaySubjectButtons() {
    const container = document.getElementById('subjectOptions');
    if (container) container.innerHTML = subjects.map(s => `
        <div class="subject-option" onclick="window.selectSubject('${s.name}')" style="border-color:${s.color}">
            <i class="${s.icon}" style="color:${s.color}"></i><span>${s.name}</span>
        </div>`).join('');
}

window.selectSubject = function(name) {
    document.getElementById('noteSubject').value = name;
    document.querySelectorAll('.subject-option').forEach(el => el.classList.toggle('selected', el.innerText.includes(name)));
};

function displaySubjects() {
    const container = document.getElementById('subjectsContainer');
    if (!container) return;
    const counts = {};
    notes.forEach(n => counts[n.subject] = (counts[n.subject] || 0) + 1);
    container.innerHTML = subjects.map(s => `
        <div class="subject-card" onclick="window.filterBySubject('${s.name}')" style="--subject-color: ${s.color}">
            <i class="${s.icon}"></i><h4>${s.name}</h4><small>${counts[s.name] || 0} ملاحظة</small>
        </div>`).join('');
}

window.filterBySubject = function(n) {
    document.getElementById('filterSubject').value = n;
    window.displayNotes();
};

function getSubjectInfo(name) {
    return subjects.find(s => s.name === name) || { icon: 'fas fa-book', color: '#6b7280' };
}

function clearForm() {
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteContent').value = '';
}

function showMessage(msg, type) {
    const m = document.createElement('div');
    m.className = `message ${type}`;
    m.style = "position:fixed; bottom:20px; right:20px; background:#222; color:#fff; padding:15px; border-radius:10px; z-index:9999;";
    m.innerText = msg;
    document.body.appendChild(m);
    setTimeout(() => m.remove(), 3000);
}

function setupEventListeners() {
    document.getElementById('searchNotes')?.addEventListener('input', window.displayNotes);
    document.getElementById('filterSubject')?.addEventListener('change', window.displayNotes);
}

// تشغيل التطبيق
document.addEventListener('DOMContentLoaded', window.initApp);
