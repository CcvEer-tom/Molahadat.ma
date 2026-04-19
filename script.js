// ==============================
// إعدادات Firebase (الربط المباشر)
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
// بيانات التطبيق
// ==============================
let notes = [];
let currentUser = localStorage.getItem('currentUser') || '';

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
// تهيئة التطبيق
// ==============================
function initApp() {
    console.log('🔧 جاري الاتصال بـ Firebase...');
    checkLogin();
    updateSubjectSelect();
    displaySubjectButtons();
    setupEventListeners();
    
    // جلب البيانات مباشرة من Firebase
    onValue(notesRef, (snapshot) => {
        const data = snapshot.val();
        notes = [];
        if (data) {
            Object.keys(data).forEach(key => {
                notes.push({ id: key, ...data[key] });
            });
            notes.sort((a, b) => b.timestamp - a.timestamp); // الأحدث أولاً
        }
        displayNotes();
        displaySubjects();
    });
}

// ==============================
// دوال الملاحظات (Firebase)
// ==============================
window.addNote = function() {
    if (!currentUser) {
        showMessage('الرجاء تسجيل الدخول أولاً', 'error');
        showLoginModal();
        return;
    }
    
    const title = document.getElementById('noteTitle').value.trim();
    const subject = document.getElementById('noteSubject').value;
    const content = document.getElementById('noteContent').value.trim();
    
    if (!title || !subject || !content) {
        showMessage('الرجاء ملء جميع الحقول', 'error');
        return;
    }

    const newNote = {
        title: title,
        subject: subject,
        author: currentUser,
        content: content,
        date: new Date().toLocaleDateString('ar-EG'),
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        likes: 0,
        timestamp: Date.now()
    };

    push(notesRef, newNote)
        .then(() => {
            clearForm();
            showMessage('تم نشر الملاحظة بنجاح! 🚀', 'success');
        })
        .catch(err => showMessage('خطأ في الإرسال: ' + err.message, 'error'));
}

window.likeNote = function(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (note) {
        const noteUpdateRef = ref(db, `notes/${noteId}`);
        update(noteUpdateRef, { likes: (note.likes || 0) + 1 });
    }
}

window.deleteNote = function(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (note && note.author === currentUser) {
        if (confirm('هل أنت متأكد من حذف الملاحظة؟')) {
            remove(ref(db, `notes/${noteId}`))
                .then(() => showMessage('تم حذف الملاحظة', 'info'));
        }
    } else {
        showMessage('لا يمكنك حذف ملاحظات الآخرين', 'error');
    }
}

// ==============================
// دوال الواجهة (UI)
// ==============================
function displayNotes() {
    const notesList = document.getElementById('notesList');
    const searchTerm = document.getElementById('searchNotes')?.value.toLowerCase() || "";
    
    let filtered = notes.filter(n => 
        n.title.toLowerCase().includes(searchTerm) || 
        n.content.toLowerCase().includes(searchTerm)
    );

    if (filtered.length === 0) {
        notesList.innerHTML = '<div class="empty-state">لا توجد ملاحظات حالياً</div>';
        return;
    }

    notesList.innerHTML = filtered.map(note => {
        const info = getSubjectInfo(note.subject);
        const isOwner = note.author === currentUser;
        return `
            <div class="note-card" style="border-right: 5px solid ${info.color}">
                <div class="note-header">
                    <h3>${note.title}</h3>
                    <span style="color: ${info.color}"><i class="${info.icon}"></i> ${note.subject}</span>
                </div>
                <div class="note-author"><i class="fas fa-user"></i> ${note.author}</div>
                <div class="note-content">${note.content.replace(/\n/g, '<br>')}</div>
                <div class="note-footer">
                    <span>${note.date} ${note.time}</span>
                    <div class="note-actions">
                        <button onclick="likeNote('${note.id}')"><i class="fas fa-heart"></i> ${note.likes || 0}</button>
                        ${isOwner ? `<button onclick="deleteNote('${note.id}')" style="color:red"><i class="fas fa-trash"></i></button>` : ''}
                    </div>
                </div>
            </div>`;
    }).join('');
}

// باقي الدوال المساعدة (دياك نيت)
function getSubjectInfo(name) {
    return subjects.find(s => s.name === name) || { icon: 'fas fa-book', color: '#ccc' };
}

function updateSubjectSelect() {
    const select = document.getElementById('noteSubject');
    if (select) {
        select.innerHTML = '<option value="">اختر المادة</option>' + 
            subjects.map(s => `<option value="${s.name}">${s.name}</option>`).join('');
    }
}

function displaySubjectButtons() {
    const container = document.getElementById('subjectOptions');
    if (container) {
        container.innerHTML = subjects.map(s => `
            <div class="subject-option" onclick="selectSubject('${s.name}')" style="color: ${s.color}">
                <i class="${s.icon}"></i><br>${s.name}
            </div>`).join('');
    }
}

window.selectSubject = function(name) {
    document.getElementById('noteSubject').value = name;
    showMessage(`تم اختيار ${name}`, 'info');
}

window.saveUsername = function() {
    const name = document.getElementById('usernameInput').value.trim();
    if (name.length >= 2) {
        currentUser = name;
        localStorage.setItem('currentUser', name);
        document.getElementById('loginModal').style.display = 'none';
        updateNavUser();
        showMessage(`مرحباً ${name}!`, 'success');
    }
}

function updateNavUser() {
    const navUser = document.getElementById('navUser');
    if (navUser) {
        navUser.innerHTML = `<span><i class="fas fa-user"></i> ${currentUser}</span>
        <button onclick="logout()" class="btn-logout">خروج</button>`;
    }
}

window.logout = function() {
    localStorage.removeItem('currentUser');
    location.reload();
}

function checkLogin() {
    if (!currentUser) showLoginModal();
    else updateNavUser();
}

function showLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
}

function clearForm() {
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteContent').value = '';
    document.getElementById('noteSubject').value = '';
}

function showMessage(msg, type) {
    const div = document.createElement('div');
    div.style = "position:fixed; bottom:20px; right:20px; background:#333; color:#fff; padding:15px; border-radius:8px; z-index:10000; border-left: 5px solid " + (type==='success'?'#10b981':'#ef4444');
    div.innerText = msg;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}

function setupEventListeners() {
    document.getElementById('searchNotes')?.addEventListener('input', displayNotes);
}

document.addEventListener('DOMContentLoaded', initApp); 
