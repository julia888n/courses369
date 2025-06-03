// מערך לדוגמה של קורסים של המשתמש
const userCourses = [
    {
        id: 1,
        title: "ניהול פיננסי לעסקים",
        progress: 75,
        lastAccessed: "2024-03-15",
        image: "https://via.placeholder.com/300x200"
    },
    {
        id: 2,
        title: "שיווק דיגיטלי",
        progress: 30,
        lastAccessed: "2024-03-14",
        image: "https://via.placeholder.com/300x200"
    }
];

// פונקציה להצגת הקורסים של המשתמש
function displayUserCourses() {
    const coursesGrid = document.querySelector('.courses-grid');
    coursesGrid.innerHTML = '';

    userCourses.forEach(course => {
        const courseCard = `
            <div class="course-card">
                <img src="${course.image}" alt="${course.title}" class="course-image">
                <div class="course-content">
                    <h3 class="course-title">${course.title}</h3>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${course.progress}%"></div>
                    </div>
                    <p>${course.progress}% הושלמו</p>
                    <p class="last-accessed">נגישה לאחרונה: ${course.lastAccessed}</p>
                    <a href="#" class="continue-btn" onclick="continueCourse(${course.id})">המשך לימוד</a>
                </div>
            </div>
        `;
        coursesGrid.innerHTML += courseCard;
    });
}

// פונקציה להמשך קורס
function continueCourse(courseId) {
    // כאן תהיה לוגיקה של מעבר לקורס
    console.log('המשך קורס:', courseId);
}

// פונקציה לניווט בין הסקשנים
function navigateToSection(sectionId) {
    // הסרת הקלאס active מכל הסקשנים
    document.querySelectorAll('.profile-section').forEach(section => {
        section.classList.remove('active');
    });

    // הסרת הקלאס active מכל הקישורים
    document.querySelectorAll('.profile-nav a').forEach(link => {
        link.classList.remove('active');
    });

    // הוספת הקלאס active לסקשן והקישור הנבחרים
    document.getElementById(sectionId).classList.add('active');
    document.querySelector(`[href="#${sectionId}"]`).classList.add('active');
}

// פונקציה לשמירת הגדרות
function saveSettings(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;

    // כאן תהיה לוגיקה של שמירת הגדרות
    console.log('שמירת הגדרות:', { username, email, currentPassword, newPassword });
    
    alert('ההגדרות נשמרו בהצלחה!');
}

// הוספת מאזיני אירועים
document.addEventListener('DOMContentLoaded', () => {
    // הצגת הקורסים של המשתמש
    displayUserCourses();

    // ניווט בין הסקשנים
    document.querySelectorAll('.profile-nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = e.target.getAttribute('href').substring(1);
            navigateToSection(sectionId);
        });
    });

    // שמירת הגדרות
    document.querySelector('.settings-form').addEventListener('submit', saveSettings);

    // התנתקות
    document.querySelector('.logout-btn').addEventListener('click', () => {
        if (confirm('האם אתה בטוח שברצונך להתנתק?')) {
            window.location.href = 'index.html';
        }
    });
}); 