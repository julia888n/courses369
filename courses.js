// משתנים גלובליים
let courses = [];
let teachers = [];
let students = [];
let currentCourse = null;
let isEditing = false;

// בדיקת טעינת Font Awesome
function checkFontAwesome() {
    const testIcon = document.createElement('i');
    testIcon.className = 'fas fa-check';
    document.body.appendChild(testIcon);
    
    const computedStyle = window.getComputedStyle(testIcon);
    const fontFamily = computedStyle.getPropertyValue('font-family');
    
    document.body.removeChild(testIcon);
    
    if (!fontFamily.includes('Font Awesome')) {
        console.error('Font Awesome לא נטען כראוי');
        showNotification('יש בעיה בטעינת האייקונים. אנא רענן את הדף או בדוק את חיבור האינטרנט', 'error');
    }
}

// פונקציות עזר
function formatPrice(amount) {
    return `₪${amount.toLocaleString('he-IL')}`;
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('he-IL');
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function getStatusClass(status) {
    switch (status) {
        case 'active':
            return 'status-active';
        case 'inactive':
            return 'status-inactive';
        case 'upcoming':
            return 'status-upcoming';
        default:
            return '';
    }
}

function getStatusText(status) {
    switch (status) {
        case 'active':
            return 'פעיל';
        case 'inactive':
            return 'לא פעיל';
        case 'upcoming':
            return 'בקרוב';
        default:
            return status;
    }
}

function getCategoryName(category) {
    switch (category) {
        case 'development':
            return 'פיתוח';
        case 'marketing':
            return 'שיווק';
        case 'management':
            return 'ניהול';
        case 'design':
            return 'עיצוב';
        default:
            return category;
    }
}

// פונקציות טעינת נתונים
async function loadData() {
    try {
        // כאן יהיה קריאה לשרת
        // בינתיים נשתמש בנתונים לדוגמה
        teachers = [
            { id: 1, fullName: 'דן כהן', email: 'dan@example.com', specialization: 'פיתוח' },
            { id: 2, fullName: 'מיכל לוי', email: 'michal@example.com', specialization: 'שיווק' },
            { id: 3, fullName: 'רון ישראלי', email: 'ron@example.com', specialization: 'ניהול' }
        ];

        students = [
            { id: 1, fullName: 'ישראל ישראלי', email: 'israel@example.com', avatar: 'https://via.placeholder.com/40' },
            { id: 2, fullName: 'שרה כהן', email: 'sarah@example.com', avatar: 'https://via.placeholder.com/40' },
            { id: 3, fullName: 'דוד לוי', email: 'david@example.com', avatar: 'https://via.placeholder.com/40' }
        ];

        courses = [
            {
                id: 1,
                name: 'קורס פיתוח אתרים',
                category: 'development',
                teacherId: 1,
                price: 2500,
                duration: 60,
                startDate: '2024-03-01',
                status: 'upcoming',
                description: 'קורס מקיף ללימוד פיתוח אתרים מודרניים',
                image: 'https://via.placeholder.com/300x200',
                students: [1, 2]
            },
            {
                id: 2,
                name: 'קורס שיווק דיגיטלי',
                category: 'marketing',
                teacherId: 2,
                price: 3000,
                duration: 45,
                startDate: '2024-02-15',
                status: 'active',
                description: 'לימוד שיווק דיגיטלי וניהול קמפיינים',
                image: 'https://via.placeholder.com/300x200',
                students: [1, 3]
            },
            {
                id: 3,
                name: 'קורס ניהול פרויקטים',
                category: 'management',
                teacherId: 3,
                price: 2800,
                duration: 50,
                startDate: '2024-01-15',
                status: 'active',
                description: 'שיטות וכלים לניהול פרויקטים',
                image: 'https://via.placeholder.com/300x200',
                students: [2, 3]
            }
        ];

        populateTeacherSelect();
        displayCourses();
        updateStats();
    } catch (error) {
        console.error('שגיאה בטעינת הנתונים:', error);
        showNotification('אירעה שגיאה בטעינת הנתונים', 'error');
    }
}

function populateTeacherSelect() {
    const teacherSelect = document.getElementById('courseTeacher');
    teacherSelect.innerHTML = '<option value="">בחר מורה</option>' +
        teachers.map(teacher => `<option value="${teacher.id}">${teacher.fullName}</option>`).join('');
}

function displayCourses(filteredCourses = courses) {
    const grid = document.getElementById('coursesGrid');
    grid.innerHTML = `
        <ul class="courses-list">
            ${filteredCourses.map(course => {
                const teacher = teachers.find(t => t.id === course.teacherId);
                return `
                    <li class="course-list-item">
                        <span class="course-title">${course.name}</span>
                        <span class="course-category">(${getCategoryName(course.category)})</span>
                        <span class="course-teacher">${teacher ? teacher.fullName : ''}</span>
                        <span class="course-price">${formatPrice(course.price)}</span>
                        <span class="course-status ${getStatusClass(course.status)}">${getStatusText(course.status)}</span>
                        <span class="course-actions">
                            <button class="action-btn view-btn" onclick="viewCourse(${course.id})" title="צפה"><i class="fas fa-eye"></i></button>
                            <button class="action-btn edit-btn" onclick="editCourse(${course.id})" title="ערוך קורס"><i class="fas fa-edit"></i></button>
                            <button class="action-btn edit-lessons-btn" onclick="editCourseLessons(${course.id})" title="ערוך שיעורים"><i class="fas fa-list"></i></button>
                            <button class="action-btn delete-btn" onclick="deleteCourse(${course.id})" title="מחק"><i class="fas fa-trash"></i></button>
                        </span>
                    </li>
                `;
            }).join('')}
        </ul>
    `;
}

function updateStats() {
    const totalCourses = courses.length;
    const activeStudents = new Set(courses.flatMap(course => course.students)).size;
    const activeTeachers = new Set(courses.map(course => course.teacherId)).size;
    const averageRating = 4.5; // לדוגמה

    document.getElementById('totalCourses').textContent = totalCourses;
    document.getElementById('activeStudents').textContent = activeStudents;
    document.getElementById('activeTeachers').textContent = activeTeachers;
    document.getElementById('averageRating').textContent = averageRating.toFixed(1);
}

function filterCourses() {
    const category = document.getElementById('categoryFilter').value;
    const status = document.getElementById('statusFilter').value;
    const search = document.getElementById('searchCourse').value.toLowerCase();

    const filteredCourses = courses.filter(course => {
        const teacher = teachers.find(t => t.id === course.teacherId);
        const matchesCategory = category === 'all' || course.category === category;
        const matchesStatus = status === 'all' || course.status === status;
        const matchesSearch = course.name.toLowerCase().includes(search) ||
                            (teacher && teacher.fullName.toLowerCase().includes(search));

        return matchesCategory && matchesStatus && matchesSearch;
    });

    displayCourses(filteredCourses);
}

function viewCourse(id) {
    const course = courses.find(c => c.id === id);
    if (!course) return;

    const teacher = teachers.find(t => t.id === course.teacherId);
    const enrolledStudents = course.students.map(studentId => 
        students.find(s => s.id === studentId)
    ).filter(Boolean);

    document.getElementById('detailCourseImage').src = course.image;
    document.getElementById('detailCourseName').textContent = course.name;
    document.getElementById('detailCategory').textContent = getCategoryName(course.category);
    document.getElementById('detailTeacher').textContent = teacher ? teacher.fullName : '';
    document.getElementById('detailPrice').textContent = formatPrice(course.price);
    document.getElementById('detailDuration').textContent = `${course.duration} שעות`;
    document.getElementById('detailStartDate').textContent = formatDate(course.startDate);
    document.getElementById('detailStatus').textContent = getStatusText(course.status);
    document.getElementById('detailDescription').textContent = course.description;

    const studentsList = document.getElementById('studentsList');
    studentsList.innerHTML = enrolledStudents.map(student => `
        <div class="student-card">
            <div class="student-info">
                <div class="student-name">${student.fullName}</div>
                <div class="student-email">${student.email}</div>
            </div>
        </div>
    `).join('');

    openModal('courseDetailsModal');
}

function editCourse(id) {
    const course = courses.find(c => c.id === id);
    if (!course) return;

    currentCourse = course;
    document.getElementById('modalTitle').textContent = 'עריכת קורס';
    document.getElementById('courseName').value = course.name;
    document.getElementById('courseCategory').value = course.category;
    document.getElementById('courseTeacher').value = course.teacherId;
    document.getElementById('coursePrice').value = course.price;
    document.getElementById('courseDuration').value = course.duration;
    document.getElementById('courseStartDate').value = course.startDate;
    document.getElementById('courseStatus').value = course.status;
    document.getElementById('courseDescription').value = course.description;

    openModal('courseModal');
}

function deleteCourse(id) {
    if (!confirm('האם אתה בטוח שברצונך למחוק קורס זה?')) return;

    const index = courses.findIndex(c => c.id === id);
    if (index === -1) return;

    courses.splice(index, 1);
    displayCourses();
    updateStats();
    showNotification('הקורס נמחק בהצלחה');
}

// פונקציה להוספת קורס חדש
function addNewCourse() {
    const modal = document.getElementById('courseModal');
    if (!modal) {
        console.error('Modal not found');
        return;
    }
    
    // איפוס הטופס
    document.getElementById('courseForm').reset();
    document.getElementById('modalTitle').textContent = 'הוספת קורס חדש';
    
    // הצגת המודל
    modal.classList.add('active');
}

// פונקציה לשמירת קורס
function saveCourse(event) {
    event.preventDefault();

    const courseData = {
        name: document.getElementById('courseName').value,
        category: document.getElementById('courseCategory').value,
        teacherId: parseInt(document.getElementById('courseTeacher').value),
        price: parseFloat(document.getElementById('coursePrice').value),
        duration: parseInt(document.getElementById('courseDuration').value),
        startDate: document.getElementById('courseStartDate').value,
        status: document.getElementById('courseStatus').value,
        description: document.getElementById('courseDescription').value,
        image: 'https://via.placeholder.com/300x200' // לדוגמה
    };

    if (currentCourse) {
        // עדכון קורס קיים
        const index = courses.findIndex(c => c.id === currentCourse.id);
        if (index === -1) return;

        courses[index] = {
            ...courses[index],
            ...courseData
        };

        showNotification('הקורס עודכן בהצלחה');
    } else {
        // הוספת קורס חדש
        const newCourse = {
            id: courses.length + 1,
            ...courseData,
            students: []
        };

        courses.push(newCourse);
        showNotification('הקורס נוסף בהצלחה');
    }

    // סגירת המודל
    document.getElementById('courseModal').classList.remove('active');
    
    // רענון הרשימה
    displayCourses();
    updateStats();
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
}

// פונקציה לפתיחת מודל עריכת שיעורים (שלד בסיסי)
function editCourseLessons(courseId) {
    window.location.href = `course-editor.html?id=${courseId}`;
}

// הוספת מאזיני אירועים
document.addEventListener('DOMContentLoaded', () => {
    checkFontAwesome();
    loadData();
    
    // הצגת הקורסים
    displayCourses();
    
    // עדכון הסטטיסטיקות
    updateStats();
    
    // הוספת מאזיני אירועים לכפתורים
    const addCourseBtn = document.getElementById('addCourseBtn');
    if (addCourseBtn) {
        addCourseBtn.addEventListener('click', addNewCourse);
    }
    
    const courseForm = document.getElementById('courseForm');
    if (courseForm) {
        courseForm.addEventListener('submit', saveCourse);
    }
    
    // סגירת מודלים
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // סגירת מודל בלחיצה על כפתור ביטול
    document.querySelectorAll('.btn-secondary').forEach(btn => {
        if (btn.textContent.includes('ביטול')) {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal');
                if (modal) {
                    modal.classList.remove('active');
                }
            });
        }
    });
    
    // הוספת מאזיני אירועים לפילטרים
    document.getElementById('categoryFilter').addEventListener('change', filterCourses);
    document.getElementById('statusFilter').addEventListener('change', filterCourses);
    document.getElementById('searchCourse').addEventListener('input', filterCourses);
}); 