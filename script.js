import {
    sendWelcomeEmail,
    sendPurchaseConfirmation,
    sendCourseCompletionEmail,
    sendCertificateEmail,
    sendReminderEmail
} from './email-service.js';

// הגבלת גישה לבק אופיס הראשי (index.html) למנהלים בלבד
if (localStorage.getItem('userRole') !== 'admin') {
    window.location.href = 'login.html';
}

// מערך לדוגמה של קורסים
const courses = [
    {
        id: 1,
        title: "ניהול פיננסי לעסקים",
        description: "למדו כיצד לנהל את הכספים של העסק שלכם בצורה יעילה",
        price: 999,
        image: "https://via.placeholder.com/300x200"
    },
    {
        id: 2,
        title: "שיווק דיגיטלי",
        description: "כלים מתקדמים לשיווק העסק שלכם באינטרנט",
        price: 1299,
        image: "https://via.placeholder.com/300x200"
    },
    {
        id: 3,
        title: "ניהול צוות",
        description: "פיתוח כישורי ניהול והנעת עובדים",
        price: 1499,
        image: "https://via.placeholder.com/300x200"
    }
];

// משתנים גלובליים
let currentUser = null;
let notifications = [];

// פונקציות עזר
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

// פונקציה להצגת הקורסים
function displayCourses() {
    const courseGrid = document.querySelector('.course-grid');
    courseGrid.innerHTML = '';

    courses.forEach(course => {
        const courseCard = `
            <div class="course-card">
                <img src="${course.image}" alt="${course.title}" class="course-image">
                <div class="course-content">
                    <h3 class="course-title">${course.title}</h3>
                    <p class="course-description">${course.description}</p>
                    <div class="course-price">₪${course.price}</div>
                    <a href="#" class="buy-btn" onclick="showCourseDetails(${course.id})">למידע נוסף</a>
                </div>
            </div>
        `;
        courseGrid.innerHTML += courseCard;
    });
}

// פונקציה להצגת פרטי קורס
function showCourseDetails(courseId) {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-btn">&times;</span>
            <h2>${course.title}</h2>
            <p>${course.description}</p>
            <div class="course-price">₪${course.price}</div>
            <button class="buy-btn" onclick="purchaseCourse(${course.id})">רכוש קורס</button>
        </div>
    `;

    document.body.appendChild(modal);

    // סגירת המודל
    modal.querySelector('.close-btn').onclick = () => {
        modal.remove();
    };
}

// פונקציה לרישום משתמש חדש
async function registerUser(userData) {
    try {
        // כאן תהיה לוגיקה להרשמת המשתמש
        console.log('משתמש נרשם:', userData);
        
        // שליחת מייל ברוכים הבאים
        await sendWelcomeEmail(userData);
        
        return true;
    } catch (error) {
        console.error('שגיאה בהרשמת משתמש:', error);
        return false;
    }
}

// פונקציה לרכישת קורס
async function purchaseCourse(courseId) {
    try {
        // כאן תהיה לוגיקה לרכישת קורס
        const course = {
            id: courseId,
            title: 'קורס לדוגמה',
            price: 999
        };
        
        const user = {
            name: 'ישראל ישראלי',
            email: 'israel@example.com'
        };
        
        // שליחת מייל אישור רכישה
        await sendPurchaseConfirmation(user, course);
        
        return true;
    } catch (error) {
        console.error('שגיאה ברכישת קורס:', error);
        return false;
    }
}

// פונקציה לסיום קורס
async function completeCourse(courseId) {
    try {
        // כאן תהיה לוגיקה לסיום קורס
        const course = {
            id: courseId,
            title: 'קורס לדוגמה'
        };
        
        const user = {
            name: 'ישראל ישראלי',
            email: 'israel@example.com'
        };
        
        // שליחת מייל סיום קורס
        await sendCourseCompletionEmail(user, course);
        
        // יצירת תעודה
        const certificate = {
            courseTitle: course.title,
            certificateNumber: `CERT-${Date.now()}`,
            issueDate: new Date()
        };
        
        // שליחת מייל תעודה
        await sendCertificateEmail(user, certificate);
        
        return true;
    } catch (error) {
        console.error('שגיאה בסיום קורס:', error);
        return false;
    }
}

// פונקציה לבדיקת התקדמות משתמש
async function checkUserProgress() {
    try {
        // כאן תהיה לוגיקה לבדיקת התקדמות
        const user = {
            name: 'ישראל ישראלי',
            email: 'israel@example.com'
        };
        
        const course = {
            title: 'קורס לדוגמה',
            progress: 30
        };
        
        // שליחת מייל תזכורת אם המשתמש לא התקדם
        if (course.progress < 50) {
            await sendReminderEmail(user, course);
        }
        
        return true;
    } catch (error) {
        console.error('שגיאה בבדיקת התקדמות:', error);
        return false;
    }
}

// פונקציה להתחברות
function login() {
    const email = prompt('הכנס את כתובת המייל שלך:');
    const password = prompt('הכנס את הסיסמה שלך:');
    
    // כאן תהיה בדיקת התחברות מול שרת
    console.log('ניסיון התחברות:', email);
}

// פונקציה להרשמה
function register() {
    const email = prompt('הכנס את כתובת המייל שלך:');
    const password = prompt('בחר סיסמה:');
    
    // כאן תהיה הרשמה מול שרת
    console.log('ניסיון הרשמה:', email);
}

// טעינת נתונים
async function loadData() {
    try {
        // כאן יהיה קריאה לשרת
        // בינתיים נשתמש בנתונים לדוגמה
        currentUser = {
            id: 1,
            fullName: 'ישראל ישראלי',
            email: 'israel@example.com',
            role: 'admin',
            avatar: 'https://via.placeholder.com/40'
        };

        notifications = [
            {
                id: 1,
                title: 'הרשמה חדשה',
                message: 'תלמיד חדש נרשם לקורס פיתוח אתרים',
                date: '2024-02-20',
                read: false
            },
            {
                id: 2,
                title: 'תשלום חדש',
                message: 'התקבל תשלום עבור קורס שיווק דיגיטלי',
                date: '2024-02-19',
                read: false
            },
            {
                id: 3,
                title: 'עדכון קורס',
                message: 'הקורס ניהול פרויקטים עודכן',
                date: '2024-02-18',
                read: false
            }
        ];

        updateUserProfile();
        updateNotifications();

        // ודא שההרשאה נשמרת תמיד
        const currentUserLS = localStorage.getItem('currentUser');
        if (currentUserLS) {
            const currentUserObj = JSON.parse(currentUserLS);
            if (currentUserObj && currentUserObj.role) {
                localStorage.setItem('userRole', currentUserObj.role);
            }
        }
    } catch (error) {
        console.error('שגיאה בטעינת הנתונים:', error);
        showNotification('אירעה שגיאה בטעינת הנתונים', 'error');
    }
}

// עדכון פרופיל משתמש
function updateUserProfile() {
    if (!currentUser) return;

    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
        userProfile.innerHTML = `
            <img src="${currentUser.avatar}" alt="${currentUser.fullName}">
            <span>${currentUser.fullName}</span>
        `;
    }
}

// עדכון התראות
function updateNotifications() {
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        const unreadCount = notifications.filter(n => !n.read).length;
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'block' : 'none';
    }
}

// ניהול התראות
function toggleNotifications() {
    const notificationsList = document.createElement('div');
    notificationsList.className = 'notifications-list';
    
    notifications.forEach(notification => {
        const notificationItem = document.createElement('div');
        notificationItem.className = `notification-item ${notification.read ? 'read' : ''}`;
        notificationItem.innerHTML = `
            <div class="notification-header">
                <h4>${notification.title}</h4>
                <span class="notification-date">${formatDate(notification.date)}</span>
            </div>
            <p>${notification.message}</p>
        `;
        notificationsList.appendChild(notificationItem);
    });

    // הסרת רשימת התראות קודמת אם קיימת
    const existingList = document.querySelector('.notifications-list');
    if (existingList) {
        existingList.remove();
    } else {
        document.body.appendChild(notificationsList);
    }
}

// ניהול התחברות/התנתקות
function logout() {
    if (confirm('האם אתה בטוח שברצונך להתנתק?')) {
        currentUser = null;
        window.location.href = 'login.html';
    }
}

// הוספת מאזיני אירועים
document.addEventListener('DOMContentLoaded', () => {
    displayCourses();
    
    // הוספת מאזיני אירועים לכפתורי התחברות והרשמה
    document.querySelector('.login-btn').addEventListener('click', login);
    document.querySelector('.register-btn').addEventListener('click', register);

    loadData();

    // אירועי התראות
    const notificationsBtn = document.querySelector('.notifications');
    if (notificationsBtn) {
        notificationsBtn.addEventListener('click', toggleNotifications);
    }

    // סגירת רשימת התראות בלחיצה מחוץ לרשימה
    document.addEventListener('click', (event) => {
        const notificationsList = document.querySelector('.notifications-list');
        const notificationsBtn = document.querySelector('.notifications');
        
        if (notificationsList && 
            !notificationsList.contains(event.target) && 
            !notificationsBtn.contains(event.target)) {
            notificationsList.remove();
        }
    });

    // אירועי פרופיל משתמש
    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
        userProfile.addEventListener('click', () => {
            // כאן יהיה קוד לפתיחת תפריט פרופיל
            console.log('פתיחת תפריט פרופיל');
        });
    }
}); 