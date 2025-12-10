// ==============================
// بيانات التطبيق
// ==============================
let notes = [];
let currentUser = '';

// المواد الدراسية مع ألوان وأيقونات
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
    console.log('🔧 تهيئة التطبيق...');
    loadData();
    checkLogin();
    updateSubjectSelect();
    displaySubjectButtons();
    displaySubjects();
    displayNotes();
    setupEventListeners();
    console.log('✅ التطبيق جاهز!');
}

// تحميل البيانات من localStorage
function loadData() {
    try {
        // تحميل الملاحظات
        const savedNotes = localStorage.getItem('studentNotes');
        if (savedNotes) {
            notes = JSON.parse(savedNotes);
            console.log(`📝 تم تحميل ${notes.length} ملاحظة`);
        } else {
            notes = getSampleNotes();
            saveNotes();
            console.log('🆕 تم إنشاء بيانات تجريبية');
        }
        
        // تحميل اسم المستخدم
        currentUser = localStorage.getItem('currentUser') || '';
        if (currentUser) {
            console.log(`👤 المستخدم: ${currentUser}`);
        }
        
    } catch (error) {
        console.error('❌ خطأ في تحميل البيانات:', error);
        notes = getSampleNotes();
        saveNotes();
    }
}

// حفظ البيانات في localStorage
function saveNotes() {
    try {
        localStorage.setItem('studentNotes', JSON.stringify(notes));
        console.log(`💾 تم حفظ ${notes.length} ملاحظة`);
        return true;
    } catch (error) {
        console.error('❌ خطأ في حفظ الملاحظات:', error);
        showMessage('حدث خطأ في حفظ الملاحظات', 'error');
        return false;
    }
}

// بيانات تجريبية للبدء
function getSampleNotes() {
    const today = new Date().toLocaleDateString('ar-EG');
    const time = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    
    return [
        {
            id: Date.now() - 1000,
            title: "مرحباً بك في منصة الملاحظات! 📚",
            subject: "رياضيات",
            subjectIcon: "fas fa-calculator",
            subjectColor: "#667eea",
            author: "فريق المنصة",
            content: "هذه المنصة تساعدك على تنظيم ملاحظاتك الدراسية ومشاركتها مع زملائك.\n\nيمكنك:\n• إضافة ملاحظات جديدة\n• تصنيفها حسب المادة\n• البحث والفلترة\n• مشاركة الملاحظات",
            date: today,
            time: time,
            likes: 5,
            views: 42
        },
        {
            id: Date.now() - 2000,
            title: "نصائح للدراسة الفعالة",
            subject: "تكنولوجيا",
            subjectIcon: "fas fa-laptop-code",
            subjectColor: "#6366f1",
            author: "فريق المنصة",
            content: "1. نظم وقتك بشكل جيد\n2. اكتب ملاحظات موجزة\n3. راجع المواد بانتظام\n4. استخدم الألوان والرسومات\n5. شارك مع زملائك",
            date: today,
            time: time,
            likes: 3,
            views: 28
        }
    ];
}

// ==============================
// دوال المستخدم
// ==============================
function checkLogin() {
    if (!currentUser) {
        setTimeout(() => {
            showLoginModal();
        }, 800);
    } else {
        updateNavUser();
    }
}

function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'flex';
        const usernameInput = document.getElementById('usernameInput');
        if (usernameInput) {
            usernameInput.focus();
        }
    }
}

function saveUsername() {
    const usernameInput = document.getElementById('usernameInput');
    if (!usernameInput) return;
    
    const username = usernameInput.value.trim();
    
    if (username) {
        if (username.length < 2) {
            showMessage('الاسم يجب أن يكون على الأقل حرفين', 'error');
            return;
        }
        
        if (username.length > 20) {
            showMessage('الاسم يجب أن لا يتجاوز 20 حرفاً', 'error');
            return;
        }
        
        currentUser = username;
        localStorage.setItem('currentUser', username);
        document.getElementById('loginModal').style.display = 'none';
        updateNavUser();
        showMessage(`مرحباً ${username}! 👋 يمكنك الآن إضافة ملاحظاتك`, 'success');
    } else {
        showMessage('الرجاء إدخال اسمك', 'error');
    }
}

function updateNavUser() {
    const navUser = document.getElementById('navUser');
    if (navUser) {
        navUser.innerHTML = `
            <span><i class="fas fa-user"></i> ${currentUser}</span>
            <div class="data-actions">
                <button onclick="exportNotes()" class="btn-secondary" title="تصدير جميع الملاحظات">
                    <i class="fas fa-download"></i>
                </button>
                <button onclick="importNotes()" class="btn-secondary" title="استيراد ملاحظات">
                    <i class="fas fa-upload"></i>
                </button>
                <button onclick="logout()" class="btn-logout">
                    <i class="fas fa-sign-out-alt"></i> خروج
                </button>
            </div>
        `;
    }
}

function logout() {
    if (confirm('هل تريد تسجيل الخروج؟ سيتم مسح اسمك فقط، تبقى الملاحظات محفوظة.')) {
        currentUser = '';
        localStorage.removeItem('currentUser');
        showLoginModal();
        showMessage('تم تسجيل الخروج بنجاح', 'info');
    }
}

// ==============================
// دوال المواد الدراسية
// ==============================
function updateSubjectSelect() {
    const subjectSelect = document.getElementById('noteSubject');
    const filterSelect = document.getElementById('filterSubject');
    
    if (!subjectSelect || !filterSelect) return;
    
    // مسح الخيارات الحالية
    subjectSelect.innerHTML = '<option value="">اختر المادة من القائمة</option>';
    filterSelect.innerHTML = '<option value="">كل المواد</option>';
    
    // إضافة جميع المواد
    subjects.forEach(subject => {
        // لخيار الإضافة
        const option = document.createElement('option');
        option.value = subject.name;
        option.textContent = subject.name;
        option.style.color = subject.color;
        subjectSelect.appendChild(option);
        
        // لخيار الفلترة
        const filterOption = document.createElement('option');
        filterOption.value = subject.name;
        filterOption.textContent = subject.name;
        filterSelect.appendChild(filterOption);
    });
    
    // إضافة خيار "أخرى"
    const otherOption = document.createElement('option');
    otherOption.value = 'أخرى';
    otherOption.textContent = 'أخرى';
    subjectSelect.appendChild(otherOption);
    
    const filterOtherOption = document.createElement('option');
    filterOtherOption.value = 'أخرى';
    filterOtherOption.textContent = 'أخرى';
    filterSelect.appendChild(filterOtherOption);
}

function displaySubjectButtons() {
    const container = document.getElementById('subjectOptions');
    if (!container) return;
    
    const buttonsHTML = subjects.map(subject => `
        <div class="subject-option" 
             data-subject="${subject.name}"
             onclick="selectSubject('${subject.name}')"
             style="border-color: ${subject.color}">
            <i class="${subject.icon}" style="color: ${subject.color}"></i>
            <div>${subject.name}</div>
        </div>
    `).join('');
    
    container.innerHTML = buttonsHTML;
}

function displaySubjects() {
    const container = document.getElementById('subjectsContainer');
    if (!container) return;
    
    // حساب عدد الملاحظات لكل مادة
    const subjectCounts = {};
    notes.forEach(note => {
        subjectCounts[note.subject] = (subjectCounts[note.subject] || 0) + 1;
    });
    
    const subjectsHTML = subjects.map(subject => {
        const count = subjectCounts[subject.name] || 0;
        return `
            <div class="subject-card" 
                 style="--subject-color: ${subject.color}; --subject-color-dark: ${subject.colorDark}"
                 onclick="filterBySubject('${subject.name}')"
                 data-subject="${subject.name}"
                 title="انقر لعرض ملاحظات ${subject.name}">
                <div class="subject-icon">
                    <i class="${subject.icon}"></i>
                </div>
                <div class="subject-name">${subject.name}</div>
                <div class="subject-count">${count} ملاحظة</div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = subjectsHTML;
}

function selectSubject(subjectName) {
    document.getElementById('noteSubject').value = subjectName;
    highlightSelectedSubject();
    showMessage(`تم اختيار مادة ${subjectName}`, 'info');
}

function highlightSelectedSubject() {
    const selectedSubject = document.getElementById('noteSubject').value;
    
    document.querySelectorAll('.subject-option').forEach(option => {
        if (option.dataset.subject === selectedSubject) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
}

function filterBySubject(subjectName) {
    // تحديث قيمة الفلتر
    document.getElementById('filterSubject').value = subjectName;
    
    // إبراز بطاقة المادة المحددة
    document.querySelectorAll('.subject-card').forEach(card => {
        card.classList.remove('active');
        if (card.dataset.subject === subjectName) {
            card.classList.add('active');
        }
    });
    
    displayNotes();
    showMessage(`تم عرض ملاحظات مادة ${subjectName}`, 'info');
}

function getSubjectInfo(subjectName) {
    const subject = subjects.find(s => s.name === subjectName);
    if (subject) return subject;
    
    // إذا كانت المادة غير موجودة في القائمة
    return {
        icon: 'fas fa-book',
        color: '#6b7280',
        colorDark: '#4b5563'
    };
}

function addNewSubject() {
    const subjectName = prompt('أدخل اسم المادة الجديدة:');
    if (subjectName && subjectName.trim()) {
        const trimmedName = subjectName.trim();
        
        // التحقق من عدم تكرار المادة
        if (subjects.some(s => s.name === trimmedName)) {
            showMessage('هذه المادة موجودة بالفعل!', 'error');
            return;
        }
        
        if (trimmedName.length > 30) {
            showMessage('اسم المادة طويل جداً', 'error');
            return;
        }
        
        const newSubject = {
            id: trimmedName.toLowerCase().replace(/\s+/g, '-'),
            name: trimmedName,
            icon: 'fas fa-book',
            color: '#6b7280',
            colorDark: '#4b5563'
        };
        
        subjects.push(newSubject);
        updateSubjectSelect();
        displaySubjectButtons();
        displaySubjects();
        showMessage(`تمت إضافة مادة "${trimmedName}" بنجاح! 📚`, 'success');
    }
}

// ==============================
// دوال الملاحظات
// ==============================
function addNote() {
    if (!currentUser) {
        showMessage('الرجاء تسجيل الدخول أولاً', 'error');
        showLoginModal();
        return;
    }
    
    const title = document.getElementById('noteTitle').value.trim();
    const subject = document.getElementById('noteSubject').value;
    const content = document.getElementById('noteContent').value.trim();
    
    // التحقق من الحقول
    if (!title) {
        showMessage('الرجاء إدخال عنوان للملاحظة', 'error');
        document.getElementById('noteTitle').focus();
        return;
    }
    
    if (!subject) {
        showMessage('الرجاء اختيار المادة', 'error');
        document.getElementById('noteSubject').focus();
        return;
    }
    
    if (!content) {
        showMessage('الرجاء كتابة محتوى الملاحظة', 'error');
        document.getElementById('noteContent').focus();
        return;
    }
    
    if (title.length > 100) {
        showMessage('العنوان طويل جداً (الحد الأقصى 100 حرف)', 'error');
        return;
    }
    
    if (content.length > 2000) {
        showMessage('المحتوى طويل جداً (الحد الأقصى 2000 حرف)', 'error');
        return;
    }
    
    const subjectInfo = getSubjectInfo(subject);
    
    const newNote = {
        id: Date.now(), // معرف فريد يعتمد على الوقت
        title: title,
        subject: subject,
        subjectIcon: subjectInfo.icon,
        subjectColor: subjectInfo.color,
        author: currentUser,
        content: content,
        date: new Date().toLocaleDateString('ar-EG'),
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        likes: 0,
        views: Math.floor(Math.random() * 50) + 1 // لأغراض العرض
    };
    
    // إضافة الملاحظة في البداية
    notes.unshift(newNote);
    
    // حفظ في localStorage
    if (saveNotes()) {
        displayNotes();
        displaySubjects();
        clearForm();
        showMessage('تم إضافة الملاحظة بنجاح! 🎉', 'success');
        
        // تمرير التركيز لعنوان الملاحظة التالية
        setTimeout(() => {
            document.getElementById('noteTitle').focus();
        }, 100);
    }
}

function displayNotes() {
    const searchTerm = document.getElementById('searchNotes').value.toLowerCase();
    const filterSubject = document.getElementById('filterSubject').value;
    const sortBy = document.getElementById('sortBy').value;
    
    let filteredNotes = [...notes];
    
    // تطبيق البحث
    if (searchTerm) {
        filteredNotes = filteredNotes.filter(note => 
            note.title.toLowerCase().includes(searchTerm) || 
            note.content.toLowerCase().includes(searchTerm) ||
            note.author.toLowerCase().includes(searchTerm) ||
            note.subject.toLowerCase().includes(searchTerm)
        );
    }
    
    // تطبيق الفلترة
    if (filterSubject) {
        filteredNotes = filteredNotes.filter(note => note.subject === filterSubject);
    }
    
    // تطبيق الترتيب
    if (sortBy === 'newest') {
        filteredNotes.sort((a, b) => b.id - a.id);
    } else if (sortBy === 'oldest') {
        filteredNotes.sort((a, b) => a.id - b.id);
    } else if (sortBy === 'mostLikes') {
        filteredNotes.sort((a, b) => b.likes - a.likes);
    }
    
    const notesList = document.getElementById('notesList');
    if (!notesList) return;
    
    if (filteredNotes.length === 0) {
        notesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>${searchTerm || filterSubject ? 'لم يتم العثور على ملاحظات' : 'لا توجد ملاحظات بعد'}</h3>
                <p>${searchTerm || filterSubject ? 
                    'جرب البحث بكلمات أخرى أو مسح الفلتر' : 
                    'كن أول من يضيف ملاحظة!'}</p>
                ${!searchTerm && !filterSubject ? 
                    `<button class="btn-primary" onclick="document.getElementById('noteTitle').focus()">
                        <i class="fas fa-plus"></i> أضف ملاحظتك الأولى
                    </button>` : 
                    `<button class="btn-secondary" onclick="resetFilters()">
                        <i class="fas fa-times"></i> مسح البحث والفلتر
                    </button>`}
            </div>
        `;
        return;
    }
    
    notesList.innerHTML = filteredNotes.map(note => {
        const subjectInfo = getSubjectInfo(note.subject);
        const isOwner = note.author === currentUser;
        
        return `
            <div class="note-card" style="--note-color: ${subjectInfo.color}; --note-bg: ${subjectInfo.color}20">
                <div class="note-header">
                    <h3 class="note-title">${note.title}</h3>
                    <span class="note-subject">
                        <i class="${subjectInfo.icon}"></i> ${note.subject}
                    </span>
                </div>
                
                <div class="note-author">
                    <i class="fas fa-user"></i> ${note.author}
                </div>
                
                <div class="note-content">
                    ${note.content.replace(/\n/g, '<br>')}
                </div>
                
                <div class="note-footer">
                    <div class="note-date">
                        <i class="far fa-calendar"></i> ${note.date} ${note.time ? ' - ' + note.time : ''}
                    </div>
                    
                    <div class="note-actions">
                        <button class="action-btn" onclick="likeNote(${note.id})" title="إعجاب">
                            <i class="far fa-heart"></i> <span class="like-count">${note.likes}</span>
                        </button>
                        <button class="action-btn" onclick="copyNoteContent(${note.id})" title="نسخ المحتوى">
                            <i class="far fa-copy"></i>
                        </button>
                        <button class="action-btn" onclick="shareNote(${note.id})" title="مشاركة">
                            <i class="fas fa-share"></i>
                        </button>
                        ${isOwner ? `
                            <button class="action-btn delete" onclick="deleteNote(${note.id})" title="حذف">
                                <i class="far fa-trash-alt"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function likeNote(noteId) {
    const noteIndex = notes.findIndex(n => n.id === noteId);
    if (noteIndex !== -1) {
        notes[noteIndex].likes++;
        if (saveNotes()) {
            displayNotes();
            showMessage('شكراً للإعجاب! ❤️', 'success');
        }
    }
}

function copyNoteContent(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (note) {
        const text = `📝 ${note.title}\n📚 المادة: ${note.subject}\n👤 من: ${note.author}\n📅 ${note.date}\n\n${note.content}`;
        
        navigator.clipboard.writeText(text)
            .then(() => showMessage('تم نسخ محتوى الملاحظة 📝', 'success'))
            .catch(err => {
                console.error('فشل النسخ:', err);
                showMessage('تعذر نسخ المحتوى', 'error');
            });
    }
}

function shareNote(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    
    const text = `📝 ملاحظة: ${note.title}\n📚 المادة: ${note.subject}\n👤 من: ${note.author}\n\n${note.content.substring(0, 150)}...`;
    
    if (navigator.share && navigator.canShare) {
        navigator.share({
            title: note.title,
            text: text,
            url: window.location.href
        }).catch(err => {
            console.log('المشاركة ألغيت:', err);
        });
    } else {
        // نسخ للنافذة
        navigator.clipboard.writeText(text)
            .then(() => showMessage('تم نسخ الملاحظة للمشاركة 📋', 'success'))
            .catch(err => {
                // طريقة بديلة للهواتف القديمة
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showMessage('تم نسخ الملاحظة 📋', 'success');
            });
    }
}

function deleteNote(noteId) {
    if (!confirm('⚠️ هل أنت متأكد من حذف هذه الملاحظة؟ لا يمكن التراجع عن هذا الإجراء.')) {
        return;
    }
    
    const noteIndex = notes.findIndex(n => n.id === noteId);
    if (noteIndex !== -1) {
        const deletedNote = notes[noteIndex];
        notes.splice(noteIndex, 1);
        
        if (saveNotes()) {
            displayNotes();
            displaySubjects();
            showMessage(`تم حذف ملاحظة "${deletedNote.title}"`, 'info');
        }
    }
}

function clearForm() {
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteSubject').value = '';
    document.getElementById('noteContent').value = '';
    highlightSelectedSubject();
    document.getElementById('noteTitle').focus();
}

function resetFilters() {
    document.getElementById('searchNotes').value = '';
    document.getElementById('filterSubject').value = '';
    document.querySelectorAll('.subject-card').forEach(card => {
        card.classList.remove('active');
    });
    displayNotes();
    showMessage('تم مسح جميع الفلاتر', 'info');
}

// ==============================
// دوال تصدير واستيراد
// ==============================
function exportNotes() {
    if (notes.length === 0) {
        showMessage('لا توجد ملاحظات للتصدير', 'info');
        return;
    }
    
    const exportData = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        exportedBy: currentUser || 'مستخدم',
        totalNotes: notes.length,
        notes: notes
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const dataUrl = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `ملاحظات_${currentUser || 'طالب'}_${new Date().toLocaleDateString('ar-EG').replace(/\//g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // تنظيف
    setTimeout(() => URL.revokeObjectURL(dataUrl), 100);
    
    showMessage(`تم تصدير ${notes.length} ملاحظة بنجاح 📥`, 'success');
}

function importNotes() {
    if (!confirm('⚠️ سيتم استيراد ملاحظات من ملف. قد تستبدل بعض الملاحظات الحالية. هل تريد المتابعة؟')) {
        return;
    }
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.style.display = 'none';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // التحقق من حجم الملف
        if (file.size > 5 * 1024 * 1024) { // 5MB
            showMessage('حجم الملف كبير جداً (الحد الأقصى 5MB)', 'error');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                let importedNotes = [];
                
                // التحقق من تنسيق الملف
                if (data.notes && Array.isArray(data.notes)) {
                    importedNotes = data.notes;
                } else if (Array.isArray(data)) {
                    importedNotes = data;
                } else {
                    throw new Error('تنسيق الملف غير صحيح');
                }
                
                if (importedNotes.length === 0) {
                    showMessage('الملف لا يحتوي على ملاحظات', 'info');
                    return;
                }
                
                // دمج الملاحظات مع تجنب التكرار
                let addedCount = 0;
                let skippedCount = 0;
                
                importedNotes.forEach(importedNote => {
                    // التحقق من أن الملاحظة تحتوي على البيانات الأساسية
                    if (!importedNote.title || !importedNote.content) {
                        skippedCount++;
                        return;
                    }
                    
                    // التحقق من التكرار
                    const isDuplicate = notes.some(note => 
                        note.id === importedNote.id || 
                        (note.title === importedNote.title && 
                         note.author === importedNote.author && 
                         note.date === importedNote.date)
                    );
                    
                    if (!isDuplicate) {
                        // تحديث المعرف ليكون فريداً
                        importedNote.id = Date.now() + Math.floor(Math.random() * 1000);
                        // تحديث معلومات المادة إذا كانت غير موجودة
                        if (!importedNote.subjectColor) {
                            const subjectInfo = getSubjectInfo(importedNote.subject);
                            importedNote.subjectColor = subjectInfo.color;
                            importedNote.subjectIcon = subjectInfo.icon;
                        }
                        notes.push(importedNote);
                        addedCount++;
                    } else {
                        skippedCount++;
                    }
                });
                
                if (saveNotes()) {
                    displayNotes();
                    displaySubjects();
                    
                    let message = `تم استيراد ${addedCount} ملاحظة جديدة 📤`;
                    if (skippedCount > 0) {
                        message += ` (تم تخطي ${skippedCount} ملاحظة مكررة)`;
                    }
                    showMessage(message, 'success');
                }
                
            } catch (error) {
                console.error('خطأ في استيراد الملف:', error);
                showMessage('خطأ في قراءة الملف. تأكد من أن الملف بصيغة JSON صحيحة', 'error');
            }
        };
        
        reader.onerror = function() {
            showMessage('تعذر قراءة الملف', 'error');
        };
        
        reader.readAsText(file);
    };
    
    document.body.appendChild(input);
    input.click();
    setTimeout(() => document.body.removeChild(input), 1000);
}

// ==============================
// دوال مساعدة
// ==============================
function setupEventListeners() {
    // البحث والفلترة
    const searchInput = document.getElementById('searchNotes');
    const filterSelect = document.getElementById('filterSubject');
    const sortSelect = document.getElementById('sortBy');
    
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            displayNotes();
        });
    }
    
    if (filterSelect) {
        filterSelect.addEventListener('change', () => {
            displayNotes();
        });
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            displayNotes();
        });
    }
    
    // تسجيل الدخول بالضغط على Enter
    const usernameInput = document.getElementById('usernameInput');
    if (usernameInput) {
        usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveUsername();
            }
        });
    }
    
    // إضافة ملاحظة بالضغط على Enter في العنوان
    const noteTitleInput = document.getElementById('noteTitle');
    if (noteTitleInput) {
        noteTitleInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                document.getElementById('noteContent').focus();
            }
        });
    }
    
    // إغلاق النافذة بالضغط على ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('loginModal');
            if (modal && modal.style.display === 'flex') {
                modal.style.display = 'none';
            }
        }
    });
    
    // إغلاق النافذة بالضغط خارجها
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    // تحديث عرض المواد عند تغيير حجم النافذة
    window.addEventListener('resize', () => {
        displaySubjects();
    });
}

function showMessage(message, type) {
    // إزالة الرسائل القديمة
    const oldMessages = document.querySelectorAll('.message');
    oldMessages.forEach(msg => {
        msg.classList.add('fade-out');
        setTimeout(() => msg.remove(), 300);
    });
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 
                           type === 'error' ? 'exclamation-circle' : 
                           'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(messageDiv);
    
    // إزالة الرسالة بعد 4 ثواني
    setTimeout(() => {
        messageDiv.classList.add('fade-out');
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 300);
    }, 4000);
}

// ==============================
// تشغيل التطبيق
// ==============================
document.addEventListener('DOMContentLoaded', initApp);

// إضافة معلومات مفيدة للوحدة التحكم
console.log('🚀 منصة ملاحظات الطلاب - الإصدار 1.0');
console.log('📖 المميزات:');
console.log('• 20 مادة دراسية مع ألوان وأيقونات');
console.log('• تخزين محلي للملاحظات');
console.log('• بحث وفلترة متقدمة');
console.log('• تصدير واستيراد البيانات');
console.log('• مشاركة الملاحظات');
console.log('💡 نصيحة: افتح أدوات المطور (F12) لرؤية تفاصيل التشغيل');

// دالة للمساعدة في التصحيح
window.debugNotes = function() {
    console.log('📊 معلومات التصحيح:');
    console.log('• عدد الملاحظات:', notes.length);
    console.log('• المستخدم الحالي:', currentUser || 'غير مسجل');
    console.log('• الملاحظات:', notes);
    console.log('• localStorage:', {
        notes: localStorage.getItem('studentNotes') ? 'موجود' : 'غير موجود',
        user: localStorage.getItem('currentUser') || 'غير موجود'
    });
};