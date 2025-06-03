// מערך משתמשים לדוגמה
let users = [
    { id: 1, name: 'ישראל ישראלי', email: 'israel@example.com', type: 'admin', status: 'active' },
    { id: 2, name: 'שרה כהן', email: 'sarah@example.com', type: 'teacher', status: 'active' },
    { id: 3, name: 'דוד לוי', email: 'david@example.com', type: 'student', status: 'inactive' }
];

// מערך קורסים לדוגמה
let courses = [];
try {
    const stored = localStorage.getItem('courses');
    if (stored) {
        courses = JSON.parse(stored);
    } else {
        courses = [
            { id: 1, name: 'פיתוח ווב', category: 'development', teacher: 'שרה כהן', price: 1200, status: 'active' },
            { id: 2, name: 'שיווק דיגיטלי', category: 'marketing', teacher: 'ישראל ישראלי', price: 1500, status: 'upcoming' }
        ];
        localStorage.setItem('courses', JSON.stringify(courses));
    }
} catch(e){}

// משתנה גלובלי לזיהוי משתמש בעריכה
let currentUserId = null;

function saveCoursesToStorage() {
    localStorage.setItem('courses', JSON.stringify(courses));
}

// פונקציה להצגת משתמשים
function displayUsers() {
    const usersList = document.getElementById('users-list');
    if (!usersList) return;

    usersList.innerHTML = users.map(user => `
        <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${getUserTypeText(user.type)}</td>
            <td>${getUserStatusText(user.status)}</td>
            <td>
                <button onclick="editUser(${user.id})" class="edit-btn">עריכה</button>
                <button onclick="deleteUser(${user.id})" class="delete-btn">מחיקה</button>
            </td>
        </tr>
    `).join('');
}

// פונקציה להצגת קורסים
function displayCourses() {
    const coursesGrid = document.querySelector('.courses-grid');
    if (!coursesGrid) return;

    coursesGrid.innerHTML = courses.map(course => `
        <div class="course-card">
            <h3>${course.name}</h3>
            <p>קטגוריה: ${getCategoryText(course.category)}</p>
            <p>מורה: ${course.teacher}</p>
            <p>מחיר: ₪${course.price}</p>
            <p>סטטוס: ${getCourseStatusText(course.status)}</p>
            <div class="course-actions">
                <button onclick="editCourse(${course.id})" class="edit-btn">עריכה</button>
                <button onclick="deleteCourse(${course.id})" class="delete-btn">מחיקה</button>
            </div>
        </div>
    `).join('');
}

// פונקציות עזר
function getUserTypeText(type) {
    const types = {
        'admin': 'מנהל',
        'teacher': 'מורה',
        'student': 'תלמיד'
    };
    return types[type] || type;
}

function getUserStatusText(status) {
    const statuses = {
        'active': 'פעיל',
        'inactive': 'לא פעיל'
    };
    return statuses[status] || status;
}

function getCategoryText(category) {
    const categories = {
        'development': 'פיתוח',
        'marketing': 'שיווק',
        'management': 'ניהול',
        'design': 'עיצוב'
    };
    return categories[category] || category;
}

function getCourseStatusText(status) {
    const statuses = {
        'active': 'פעיל',
        'inactive': 'לא פעיל',
        'upcoming': 'בקרוב'
    };
    return statuses[status] || status;
}

// פונקציות לניהול משתמשים
function addNewUser() {
    const modal = document.getElementById('userModal');
    if (!modal) return;

    document.getElementById('userForm').reset();
    document.getElementById('userModalTitle').textContent = 'הוספת משתמש חדש';
    modal.classList.add('active');
    currentUserId = null; // איפוס במצב הוספה
}

function saveUser(event) {
    event.preventDefault();

    const userData = {
        id: currentUserId ? currentUserId : users.length + 1,
        name: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        type: document.getElementById('userType').value,
        status: 'active'
    };

    if (currentUserId) {
        // עדכון משתמש קיים
        const index = users.findIndex(u => u.id === currentUserId);
        if (index !== -1) users[index] = userData;
        showNotification('המשתמש עודכן בהצלחה');
    } else {
        // הוספת משתמש חדש
        users.push(userData);
        showNotification('המשתמש נוסף בהצלחה');
    }

    closeModal('userModal');
    displayUsers();
    currentUserId = null;
}

function editUser(id) {
    const user = users.find(u => u.id === id);
    if (!user) return;

    const modal = document.getElementById('userModal');
    if (!modal) return;

    document.getElementById('fullName').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('userType').value = user.type;
    document.getElementById('userModalTitle').textContent = 'עריכת משתמש';
    modal.classList.add('active');
    currentUserId = id; // שמור את מזהה המשתמש הנערך
}

function deleteUser(id) {
    if (confirm('האם אתה בטוח שברצונך למחוק משתמש זה?')) {
        users = users.filter(u => u.id !== id);
        displayUsers();
        showNotification('המשתמש נמחק בהצלחה');
    }
}

// פונקציות לניהול קורסים
function addNewCourse() {
    const modal = document.getElementById('courseModal');
    if (!modal) return;

    document.getElementById('courseForm').reset();
    document.getElementById('courseModalTitle').textContent = 'הוספת קורס חדש';
    modal.classList.add('active');
}

function saveCourse(event) {
    event.preventDefault();
    const courseData = {
        id: courses.length + 1,
        name: document.getElementById('courseName').value,
        category: document.getElementById('courseCategory').value,
        teacher: document.getElementById('courseTeacher').value,
        price: parseFloat(document.getElementById('coursePrice').value),
        status: document.getElementById('courseStatus').value
    };
    courses.push(courseData);
    saveCoursesToStorage();
    closeModal('courseModal');
    displayCourses();
    showNotification('הקורס נוסף בהצלחה');
}

function editCourse(id) {
    const course = courses.find(c => c.id === id);
    if (!course) return;
    const modal = document.getElementById('courseModal');
    if (!modal) return;
    document.getElementById('courseName').value = course.name;
    document.getElementById('courseCategory').value = course.category;
    document.getElementById('courseTeacher').value = course.teacher;
    document.getElementById('coursePrice').value = course.price;
    document.getElementById('courseStatus').value = course.status;
    document.getElementById('courseModalTitle').textContent = 'עריכת קורס';
    modal.classList.add('active');
    // שמירה לאחר עריכה תתבצע ב-saveCourse
}

function deleteCourse(id) {
    if (confirm('האם אתה בטוח שברצונך למחוק קורס זה?')) {
        courses = courses.filter(c => c.id !== id);
        saveCoursesToStorage();
        displayCourses();
        showNotification('הקורס נמחק בהצלחה');
    }
}

// פונקציות עזר כלליות
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

function showNotification(message) {
    alert(message); // ניתן להחליף בהצגת הודעה יפה יותר
}

// אתחול הדף
document.addEventListener('DOMContentLoaded', () => {
    // הצגת משתמשים וקורסים
    displayUsers();
    displayCourses();

    // הוספת מאזיני אירועים לכפתורי הוספה
    const addUserBtn = document.querySelector('#users .add-btn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', addNewUser);
    }

    const addCourseBtn = document.querySelector('#courses .add-btn');
    if (addCourseBtn) {
        addCourseBtn.addEventListener('click', addNewCourse);
    }

    // הוספת מאזיני אירועים לטופסים
    const userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', saveUser);
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

    // סגירת מודל בלחיצה מחוץ לתוכן
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}); 