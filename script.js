// ==========================================
// 1. إعدادات Firebase (الربط السحابي)
// ==========================================
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

// ==========================================
// 2. بيانات التطبيق (قائمة المواد)
// ==========================================
let notes = [];
let currentUser = '';

const subjects = [
    { id: 'math', name: 'رياضيات', icon: 'fas fa-calculator', color: '#667eea' },
    { id: 'physics', name: 'فيزياء', icon: 'fas fa-atom', color: '#3b82f6' },
    { id: 'arabic', name: 'لغة عربية', icon: 'fas fa-language', color: '#f59e0b' },
    { id: 'islamic', name: 'تربية إسلامية', icon: 'fas fa-mosque', color: '#8b5cf6' },
    { id: 'history', name: 'تاريخ', icon: 'fas fa-landmark', color: '#f97316' }
];

// ==========================================
// 3. ربط الدوال بـ Window (ليعمل HTML onclick)
// ==========================================

window.initApp = function() {
    currentUser = localStorage.getItem('currentUser') || '';
    
    // تحديث الواجهات
    window.updateSubjectSelect();
    window.displaySubjectButtons();
    
    if (!currentUser) {
        window.showLoginModal();
    } else {
        window.updateNavUser();
    }

    // مزامنة البيانات من Firebase
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
        window.displaySubjects();
    });
};

window.showLoginModal = function() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.style.display = 'flex';
};

window.saveUsername = function() {
    const input = document.getElementById('usernameInput');
    const name = input.value.trim();
    if (name.length >= 2) {
        currentUser = name;
        localStorage.setItem('currentUser', name);
        document.getElementById('loginModal').style.display = 'none';
        window.updateNavUser();
        window.showMessage(`مرحباً ${name}! 👋`, 'success');
    }
};

window.addNewSubject = function() {
    const name = prompt('أدخل اسم المادة الجديدة:');
    if (name && name.trim()) {
        const newSub = {
            id: Date.now().toString(),
            name: name.trim(),
            icon: 'fas fa-book',
            color: '#6b7280'
        };
        subjects.push(newSub);
        window.updateSubjectSelect();
        window.displaySubjectButtons();
        window.displaySubjects();
        window.showMessage('تمت إضافة المادة', 'success');
    }
};

window.addNote = function() {
    const title = document.getElementById('noteTitle').value.trim();
    const subject = document.getElementById('noteSubject').value;
    const content = document.getElementById('noteContent').value.trim();

    if (!title || !subject || !content) {
        window.showMessage('عمر كاع الخانات!', 'error');
        return;
    }

    const subInfo = subjects.find(s => s.name === subject) || { icon: 'fas fa-book', color: '#6b7280' };

    const newNote = {
        title, subject, content,
        author: currentUser,
        subjectIcon: subInfo.icon,
        subjectColor: subInfo.color,
        date: new Date().toLocaleDateString('ar-EG'),
        timestamp: Date.now(),
        likes: 0
    };

    push(notesRef, newNote).then(() => {
        window.clearForm();
        window.showMessage('نشرتي الملاحظة بنجاح! 🎉', 'success');
    });
};

window.displayNotes = function() {
    const notesList = document.getElementById('notesList');
    const searchTerm = document.getElementById('searchNotes').value.toLowerCase();
    const filterSub = document.getElementById('filterSubject').value;

    let filtered = notes.filter(n => {
        const matchesSearch = n.title.toLowerCase().includes(searchTerm) || n.content.toLowerCase().includes(searchTerm);
        const matchesSub = !filterSub || n.subject === filterSub;
        return matchesSearch && matchesSub;
    });

    notesList.innerHTML = filtered.map(n => `
        <div class="note-card" style="border-right: 5px solid ${n.subjectColor}">
            <div class="note-header">
                <h3>${n.title}</h3>
                <span class="note-subject"><i class="${n.subjectIcon}"></i> ${n.subject}</span>
            </div>
            <div class="note-author">👤 ${n.author}</div>
            <p class="note-content">${n.content.replace(/\n/g, '<br>')}</p>
            <div class="note-footer">
                <small>${n.date}</small>
                <div class="note-actions">
                    <button class="action-btn" onclick="window.likeNote('${n.id}')">❤️ ${n.likes || 0}</button>
                    ${n.author === currentUser ? `<button class="action-btn delete" onclick="window.deleteNote('${n.id}')">🗑️</button>` : ''}
                </div>
            </div>
        </div>
    `).join('');
};

window.likeNote = function(id) {
    const note = notes.find(n => n.id === id);
    if (note) update(ref(db, `notes/${id}`), { likes: (note.likes || 0) + 1 });
};

window.deleteNote = function(id) {
    if (confirm('واش بغيتي تمسحها؟')) remove(ref(db, `notes/${id}`));
};

window.updateNavUser = function() {
    const nav = document.getElementById('navUser');
    if (nav) nav.innerHTML = `<span>👤 ${currentUser}</span> <button onclick="window.logout()" class="btn-logout">خروج</button>`;
};

window.logout = function() {
    localStorage.removeItem('currentUser');
    location.reload();
};

window.updateSubjectSelect = function() {
    const s = document.getElementById('noteSubject');
    const f = document.getElementById('filterSubject');
    const options = subjects.map(x => `<option value="${x.name}">${x.name}</option>`).join('');
    if (s) s.innerHTML = '<option value="">اختر المادة</option>' + options;
    if (f) f.innerHTML = '<option value="">كل المواد</option>' + options;
};

window.displaySubjectButtons = function() {
    const container = document.getElementById('subjectOptions');
    if (container) container.innerHTML = subjects.map(s => `
        <div class="subject-option" onclick="window.selectSubject('${s.name}')">
            <i class="${s.icon}" style="color:${s.color}"></i>
            <span>${s.name}</span>
        </div>
    `).join('');
};

window.selectSubject = function(name) {
    document.getElementById('noteSubject').value = name;
    document.querySelectorAll('.subject-option').forEach(el => {
        el.classList.toggle('selected', el.innerText.includes(name));
    });
};

window.displaySubjects = function() {
    const container = document.getElementById('subjectsContainer');
    if (!container) return;
    const counts = {};
    notes.forEach(n => counts[n.subject] = (counts[n.subject] || 0) + 1);
    container.innerHTML = subjects.map(s => `
        <div class="subject-card" onclick="window.filterBySubject('${s.name}')" style="--subject-color: ${s.color}">
            <i class="${s.icon}"></i>
            <h4>${s.name}</h4>
            <small>${counts[s.name] || 0} ملاحظة</small>
        </div>
    `).join('');
};

window.filterBySubject = function(name) {
    document.getElementById('filterSubject').value = name;
    window.displayNotes();
};

window.clearForm = function() {
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteContent').value = '';
};

window.resetFilters = function() {
    document.getElementById('filterSubject').value = '';
    document.getElementById('searchNotes').value = '';
    window.displayNotes();
};

window.showMessage = function(msg, type) {
    const m = document.createElement('div');
    m.className = `message ${type}`;
    m.style = "position:fixed; bottom:20px; left:20px; background:#333; color:#fff; padding:12px 20px; border-radius:8px; z-index:10000; border-right:5px solid " + (type==='success'?'#4caf50':'#f44336');
    m.innerText = msg;
    document.body.appendChild(m);
    setTimeout(() => m.remove(), 3000);
};

function setupEventListeners() {
    document.getElementById('searchNotes')?.addEventListener('input', window.displayNotes);
    document.getElementById('filterSubject')?.addEventListener('change', window.displayNotes);
}

// تشغيل التطبيق عند التحميل
document.addEventListener('DOMContentLoaded', window.initApp);
