// ==============================
// 1. إعدادات Firebase (إضافة فقط)
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
// 2. بيانات التطبيق (نفس كودك الأصلي)
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
// 3. تهيئة التطبيق (نفس كودك مع ربط Firebase)
// ==============================
window.initApp = function() {
    console.log('🔧 تهيئة التطبيق...');
    loadUserData();
    updateSubjectSelect();
    displaySubjectButtons();
    setupEventListeners();
    
    // جلب البيانات من Firebase باستمرار
    onValue(notesRef, (snapshot) => {
        const data = snapshot.val();
        notes = [];
        if (data) {
            Object.keys(data).forEach(key => {
                notes.push({ id: key, ...data[key] });
            });
            // الحفاظ على الترتيب (الأحدث أولاً)
            notes.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        }
        displayNotes();
        displaySubjects();
    });
    console.log('✅ التطبيق جاهز ومربوط بـ Firebase!');
}

function loadUserData() {
    currentUser = localStorage.getItem('currentUser') || '';
    if (!currentUser) {
        setTimeout(() => showLoginModal(), 800);
    } else {
        updateNavUser();
    }
}

// ==============================
// 4. دوال الملاحظات (تعديل الحفظ فقط)
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

    const subjectInfo = getSubjectInfo(subject);
    
    const newNote = {
        title: title,
        subject: subject,
        subjectIcon: subjectInfo.icon,
        subjectColor: subjectInfo.color,
        author: currentUser,
        content: content,
        date: new Date().toLocaleDateString('ar-EG'),
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        likes: 0,
        views: Math.floor(Math.random() * 50) + 1,
        timestamp: Date.now() // ضروري للترتيب
    };

    // إرسال لـ Firebase
    push(notesRef, newNote).then(() => {
        clearForm();
        showMessage('تم إضافة الملاحظة بنجاح! 🎉', 'success');
    });
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
        if (confirm('⚠️ هل أنت متأكد من حذف هذه الملاحظة؟')) {
            remove(ref(db, `notes/${noteId}`)).then(() => {
                showMessage('تم حذف الملاحظة بنجاح', 'info');
            });
        }
    } else {
        showMessage('لا يمكنك حذف ملاحظات الآخرين', 'error');
    }
}

// ==============================
// 5. باقي الدوال الأصلية (نسخ ولصق 100%)
// ==============================
window.displayNotes = function() {
    const searchTerm = document.getElementById('searchNotes').value.toLowerCase();
    const filterSubject = document.getElementById('filterSubject').value;
    const sortBy = document.getElementById('sortBy').value;
    const notesList = document.getElementById('notesList');
    
    let filteredNotes = [...notes];
    
    if (searchTerm) {
        filteredNotes = filteredNotes.filter(n => 
            n.title.toLowerCase().includes(searchTerm) || 
            n.content.toLowerCase().includes(searchTerm) ||
            n.author.toLowerCase().includes(searchTerm)
        );
    }
    
    if (filterSubject) {
        filteredNotes = filteredNotes.filter(n => n.subject === filterSubject);
    }
    
    // الترتيب
    if (sortBy === 'oldest') filteredNotes.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    else if (sortBy === 'mostLikes') filteredNotes.sort((a, b) => (b.likes || 0) - (a.likes || 0));

    if (filteredNotes.length === 0) {
        notesList.innerHTML = '<div class="empty-state"><h3>لم يتم العثور على ملاحظات</h3></div>';
        return;
    }

    notesList.innerHTML = filteredNotes.map(note => {
        const isOwner = note.author === currentUser;
        return `
            <div class="note-card" style="--note-color: ${note.subjectColor}; --note-bg: ${note.subjectColor}20">
                <div class="note-header">
                    <h3 class="note-title">${note.title}</h3>
                    <span class="note-subject"><i class="${note.subjectIcon}"></i> ${note.subject}</span>
                </div>
                <div class="note-author"><i class="fas fa-user"></i> ${note.author}</div>
                <div class="note-content">${note.content.replace(/\n/g, '<br>')}</div>
                <div class="note-footer">
                    <div class="note-date"><i class="far fa-calendar"></i> ${note.date} - ${note.time}</div>
                    <div class="note-actions">
                        <button class="action-btn" onclick="likeNote('${note.id}')"><i class="far fa-heart"></i> ${note.likes}</button>
                        <button class="action-btn" onclick="copyNoteContent('${note.id}')"><i class="far fa-copy"></i></button>
                        <button class="action-btn" onclick="shareNote('${note.id}')"><i class="fas fa-share"></i></button>
                        ${isOwner ? `<button class="action-btn delete" onclick="deleteNote('${note.id}')"><i class="far fa-trash-alt"></i></button>` : ''}
                    </div>
                </div>
            </div>`;
    }).join('');
}

// دالة النسخ الأصلية
window.copyNoteContent = function(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (note) {
        const text = `📝 ${note.title}\n📚 المادة: ${note.subject}\n👤 من: ${note.author}\n\n${note.content}`;
        navigator.clipboard.writeText(text).then(() => showMessage('تم نسخ المحتوى 📝', 'success'));
    }
}

// دالة المشاركة الأصلية
window.shareNote = function(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (note && navigator.share) {
        navigator.share({ title: note.title, text: note.content, url: window.location.href });
    }
}

// دوال المستخدم الأصلية
window.saveUsername = function() {
    const name = document.getElementById('usernameInput').value.trim();
    if (name.length >= 2) {
        currentUser = name;
        localStorage.setItem('currentUser', name);
        document.getElementById('loginModal').style.display = 'none';
        updateNavUser();
        showMessage(`مرحباً ${name}! 👋`, 'success');
    }
}

window.logout = function() {
    if (confirm('هل تريد تسجيل الخروج؟')) {
        localStorage.removeItem('currentUser');
        location.reload();
    }
}

function updateNavUser() {
    const navUser = document.getElementById('navUser');
    if (navUser) {
        navUser.innerHTML = `
            <span><i class="fas fa-user"></i> ${currentUser}</span>
            <div class="data-actions">
                <button onclick="exportNotes()" class="btn-secondary"><i class="fas fa-download"></i></button>
                <button onclick="logout()" class="btn-logout"><i class="fas fa-sign-out-alt"></i> خروج</button>
            </div>`;
    }
}

// دوال المواد الأصلية
function updateSubjectSelect() {
    const s = document.getElementById('noteSubject');
    const f = document.getElementById('filterSubject');
    if (!s || !f) return;
    const options = subjects.map(sb => `<option value="${sb.name}">${sb.name}</option>`).join('');
    s.innerHTML = '<option value="">اختر المادة</option>' + options;
    f.innerHTML = '<option value="">كل المواد</option>' + options;
}

function displaySubjectButtons() {
    const container = document.getElementById('subjectOptions');
    if (container) {
        container.innerHTML = subjects.map(s => `
            <div class="subject-option" data-subject="${s.name}" onclick="selectSubject('${s.name}')" style="border-color: ${s.color}">
                <i class="${s.icon}" style="color: ${s.color}"></i><div>${s.name}</div>
            </div>`).join('');
    }
}

window.selectSubject = function(name) {
    document.getElementById('noteSubject').value = name;
    document.querySelectorAll('.subject-option').forEach(opt => {
        opt.classList.toggle('selected', opt.dataset.subject === name);
    });
}

function displaySubjects() {
    const container = document.getElementById('subjectsContainer');
    if (!container) return;
    const counts = {};
    notes.forEach(n => counts[n.subject] = (counts[n.subject] || 0) + 1);
    container.innerHTML = subjects.map(s => `
        <div class="subject-card" onclick="filterBySubject('${s.name}')" style="--subject-color: ${s.color}">
            <div class="subject-icon"><i class="${s.icon}"></i></div>
            <div class="subject-name">${s.name}</div>
            <div class="subject-count">${counts[s.name] || 0} ملاحظة</div>
        </div>`).join('');
}

window.filterBySubject = function(name) {
    document.getElementById('filterSubject').value = name;
    displayNotes();
}

function getSubjectInfo(name) {
    return subjects.find(s => s.name === name) || { icon: 'fas fa-book', color: '#6b7280' };
}

// الدوال المساعدة والـ Export
window.exportNotes = function() {
    const dataStr = JSON.stringify(notes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ملاحظات_${currentUser}.json`;
    link.click();
}

function clearForm() {
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteContent').value = '';
    document.getElementById('noteSubject').value = '';
}

function showMessage(message, type) {
    const div = document.createElement('div');
    div.className = `message ${type}`;
    div.innerHTML = `<span>${message}</span>`;
    div.style = "position:fixed; bottom:20px; left:20px; background:#333; color:#fff; padding:15px; border-radius:8px; z-index:10000; border-left: 5px solid " + (type==='success'?'#10b981':'#ef4444');
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 4000);
}

function setupEventListeners() {
    document.getElementById('searchNotes')?.addEventListener('input', displayNotes);
    document.getElementById('filterSubject')?.addEventListener('change', displayNotes);
    document.getElementById('sortBy')?.addEventListener('change', displayNotes);
}

// تشغيل التطبيق
document.addEventListener('DOMContentLoaded', initApp);
