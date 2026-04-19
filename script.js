/* * ==========================================
 * Developed by Ibrahim Anouer
 * Platform: Molahadatna (Firebase Edition)
 * Version: 2.0.1
 * ==========================================
 */

// استيراد مكتبات Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove, update, set } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

// إعدادات الاتصال بقاعدة البيانات
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

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const notesRef = ref(db, 'notes');

// متغيرات النظام الأساسية
let notes = [];
let currentUser = '';

// قائمة المواد الدراسية الكاملة (كما كانت في كودك)
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
// وظائف التحكم في النافذة (Window Functions)
// لضمان عمل onclick في HTML
// ==========================================

window.initApp = function() {
    console.log("System Initializing...");
    currentUser = localStorage.getItem('currentUser') || '';
    
    // تحديث القوائم والواجهات
    window.updateSubjectSelect();
    window.displaySubjectButtons();
    window.displaySubjects();
    window.setupEventListeners();
    
    if (!currentUser) {
        setTimeout(window.showLoginModal, 500);
    } else {
        window.updateNavUser();
    }

    // الاستماع لقاعدة البيانات (بث حي)
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
        window.showMessage(`مرحباً بك ${name}`, 'success');
    } else {
        window.showMessage('الاسم قصير جداً', 'error');
    }
};

window.addNewSubject = function() {
    const newName = prompt("أدخل اسم المادة الجديدة:");
    if (newName && newName.trim()) {
        const check = subjects.find(s => s.name === newName.trim());
        if (check) {
            window.showMessage("المادة موجودة أصلاً", "error");
            return;
        }
        const newSub = {
            id: 'custom_' + Date.now(),
            name: newName.trim(),
            icon: 'fas fa-book-open',
            color: '#4a5568'
        };
        subjects.push(newSub);
        window.updateSubjectSelect();
        window.displaySubjectButtons();
        window.displaySubjects();
        window.showMessage("تمت إضافة " + newName, "success");
    }
};

window.addNote = function() {
    const titleObj = document.getElementById('noteTitle');
    const subjectObj = document.getElementById('noteSubject');
    const contentObj = document.getElementById('noteContent');

    const title = titleObj.value.trim();
    const subject = subjectObj.value;
    const content = contentObj.value.trim();

    if (!currentUser) { window.showLoginModal(); return; }
    if (!title || !subject || !content) {
        window.showMessage("عمر كاع المعلومات أ صاحبي!", "error");
        return;
    }

    const subData = subjects.find(s => s.name === subject) || { icon: 'fas fa-file', color: '#ccc' };

    const newNote = {
        title: title,
        subject: subject,
        content: content,
        author: currentUser,
        subjectIcon: subData.icon,
        subjectColor: subData.color,
        date: new Date().toLocaleDateString('ar-MA'),
        time: new Date().toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' }),
        likes: 0,
        timestamp: Date.now()
    };

    push(notesRef, newNote).then(() => {
        titleObj.value = '';
        contentObj.value = '';
        window.showMessage("تم النشر بنجاح!", "success");
    });
};

window.displayNotes = function() {
    const list = document.getElementById('notesList');
    const search = document.getElementById('searchNotes').value.toLowerCase();
    const filter = document.getElementById('filterSubject').value;
    const sort = document.getElementById('sortBy').value;

    let filtered = notes.filter(n => {
        return (n.title.toLowerCase().includes(search) || n.content.toLowerCase().includes(search)) &&
               (!filter || n.subject === filter);
    });

    if (sort === 'oldest') filtered.sort((a,b) => a.timestamp - b.timestamp);
    if (sort === 'mostLikes') filtered.sort((a,b) => b.likes - a.likes);

    list.innerHTML = filtered.map(n => `
        <div class="note-card" style="border-right: 6px solid ${n.subjectColor}">
            <div class="note-header">
                <h3>${n.title}</h3>
                <span class="badge" style="background:${n.subjectColor}22; color:${n.subjectColor}">
                    <i class="${n.subjectIcon}"></i> ${n.subject}
                </span>
            </div>
            <div class="note-meta">بواسطة: <b>${n.author}</b> | ${n.date}</div>
            <p class="note-text">${n.content.replace(/\n/g, '<br>')}</p>
            <div class="note-footer">
                <button onclick="window.likeNote('${n.id}')" class="btn-like">❤️ ${n.likes || 0}</button>
                ${n.author === currentUser ? `<button onclick="window.deleteNote('${n.id}')" class="btn-del">🗑️ حذف</button>` : ''}
            </div>
        </div>
    `).join('');
};

window.likeNote = function(id) {
    const note = notes.find(n => n.id === id);
    if (note) {
        update(ref(db, `notes/${id}`), { likes: (note.likes || 0) + 1 });
    }
};

window.deleteNote = function(id) {
    if (confirm("واش متأكد بغيتي تمسح هاد الملاحظة؟")) {
        remove(ref(db, `notes/${id}`));
    }
};

window.updateSubjectSelect = function() {
    const selects = [document.getElementById('noteSubject'), document.getElementById('filterSubject')];
    const options = subjects.map(s => `<option value="${s.name}">${s.name}</option>`).join('');
    
    if (selects[0]) selects[0].innerHTML = '<option value="">-- اختر المادة --</option>' + options;
    if (selects[1]) selects[1].innerHTML = '<option value="">كل المواد</option>' + options;
};

window.displaySubjectButtons = function() {
    const container = document.getElementById('subjectOptions');
    if (container) {
        container.innerHTML = subjects.map(s => `
            <div class="subject-option" onclick="window.selectSubject('${s.name}')" style="border-color:${s.color}">
                <i class="${s.icon}" style="color:${s.color}"></i>
                <span>${s.name}</span>
            </div>
        `).join('');
    }
};

window.selectSubject = function(name) {
    document.getElementById('noteSubject').value = name;
    document.querySelectorAll('.subject-option').forEach(el => {
        el.classList.toggle('active', el.innerText.includes(name));
    });
};

window.displaySubjects = function() {
    const container = document.getElementById('subjectsContainer');
    if (!container) return;
    const counts = {};
    notes.forEach(n => counts[n.subject] = (counts[n.subject] || 0) + 1);

    container.innerHTML = subjects.map(s => `
        <div class="subject-card" onclick="window.filterBySubject('${s.name}')" style="--clr:${s.color}">
            <i class="${s.icon}"></i>
            <h4>${s.name}</h4>
            <span>${counts[s.name] || 0} ملاحظة</span>
        </div>
    `).join('');
};

window.filterBySubject = function(name) {
    const filterEl = document.getElementById('filterSubject');
    if (filterEl) {
        filterEl.value = name;
        window.displayNotes();
    }
};

window.updateNavUser = function() {
    const nav = document.getElementById('navUser');
    if (nav) {
        nav.innerHTML = `
            <div class="user-pill">
                <span>👤 ${currentUser}</span>
                <button onclick="window.logout()">خروج</button>
            </div>
        `;
    }
};

window.logout = function() {
    localStorage.removeItem('currentUser');
    location.reload();
};

window.showMessage = function(msg, type) {
    const box = document.getElementById('messageContainer');
    const m = document.createElement('div');
    m.className = `toast ${type}`;
    m.innerText = msg;
    box.appendChild(m);
    setTimeout(() => m.remove(), 4000);
};

window.setupEventListeners = function() {
    document.getElementById('searchNotes')?.addEventListener('input', window.displayNotes);
    document.getElementById('filterSubject')?.addEventListener('change', window.displayNotes);
    document.getElementById('sortBy')?.addEventListener('change', window.displayNotes);
};

// انطلاق التطبيق
document.addEventListener('DOMContentLoaded', window.initApp);
