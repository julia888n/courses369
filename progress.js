// נתונים לדוגמה
const userProgress = {
    activeCourses: [
        {
            id: 1,
            title: 'ניהול פיננסי לעסקים',
            image: 'https://via.placeholder.com/300x200',
            progress: 60,
            completedLessons: 6,
            totalLessons: 10
        },
        {
            id: 2,
            title: 'שיווק דיגיטלי',
            image: 'https://via.placeholder.com/300x200',
            progress: 30,
            completedLessons: 3,
            totalLessons: 10
        }
    ],
    completedCourses: [
        {
            id: 3,
            title: 'ניהול משאבי אנוש',
            image: 'https://via.placeholder.com/300x200',
            completionDate: '2024-02-15'
        },
        {
            id: 4,
            title: 'אסטרטגיה עסקית',
            image: 'https://via.placeholder.com/300x200',
            completionDate: '2024-01-30'
        }
    ],
    certificates: [
        {
            id: 1,
            courseTitle: 'ניהול משאבי אנוש',
            issueDate: '2024-02-15',
            certificateNumber: 'HR-2024-001'
        },
        {
            id: 2,
            courseTitle: 'אסטרטגיה עסקית',
            issueDate: '2024-01-30',
            certificateNumber: 'BS-2024-001'
        }
    ]
};

// פונקציות להצגת נתונים
function displayActiveCourses() {
    const container = document.getElementById('active-courses-grid');
    container.innerHTML = '';
    
    userProgress.activeCourses.forEach(course => {
        const card = document.createElement('div');
        card.className = 'course-card';
        card.innerHTML = `
            <img src="${course.image}" alt="${course.title}" class="course-image">
            <div class="course-info">
                <h3 class="course-title">${course.title}</h3>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${course.progress}%"></div>
                </div>
                <div class="course-stats">
                    <span>${course.completedLessons}/${course.totalLessons} שיעורים</span>
                    <span>${course.progress}% הושלמו</span>
                </div>
                <button onclick="continueCourse(${course.id})" class="continue-btn">המשך לימוד</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function displayCompletedCourses() {
    const container = document.getElementById('completed-courses-grid');
    container.innerHTML = '';
    
    userProgress.completedCourses.forEach(course => {
        const card = document.createElement('div');
        card.className = 'course-card';
        card.innerHTML = `
            <img src="${course.image}" alt="${course.title}" class="course-image">
            <div class="course-info">
                <h3 class="course-title">${course.title}</h3>
                <p class="completion-date">הושלם בתאריך: ${formatDate(course.completionDate)}</p>
                <button onclick="reviewCourse(${course.id})" class="review-btn">סקירת הקורס</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function displayCertificates() {
    const container = document.getElementById('certificates-grid');
    container.innerHTML = '';
    
    userProgress.certificates.forEach(certificate => {
        const card = document.createElement('div');
        card.className = 'certificate-card';
        card.innerHTML = `
            <h3>${certificate.courseTitle}</h3>
            <p>מספר תעודה: ${certificate.certificateNumber}</p>
            <p>ניתנה בתאריך: ${formatDate(certificate.issueDate)}</p>
            <a href="#" onclick="downloadCertificate(${certificate.id})" class="download-certificate">הורד תעודה</a>
        `;
        container.appendChild(card);
    });
}

function updateStats() {
    document.getElementById('active-courses-count').textContent = userProgress.activeCourses.length;
    document.getElementById('completed-courses-count').textContent = userProgress.completedCourses.length;
    
    const totalCompletedLessons = userProgress.activeCourses.reduce((sum, course) => 
        sum + course.completedLessons, 0);
    document.getElementById('completed-lessons-count').textContent = totalCompletedLessons;
}

// פונקציות עזר
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('he-IL', options);
}

function continueCourse(courseId) {
    // כאן תהיה ניווט לדף הקורס
    console.log('המשך לימוד בקורס:', courseId);
}

function reviewCourse(courseId) {
    // כאן תהיה ניווט לדף סקירת הקורס
    console.log('סקירת קורס:', courseId);
}

function downloadCertificate(certificateId) {
    // כאן תהיה לוגיקה להורדת התעודה
    console.log('הורדת תעודה:', certificateId);
}

// טעינת הדף
document.addEventListener('DOMContentLoaded', () => {
    displayActiveCourses();
    displayCompletedCourses();
    displayCertificates();
    updateStats();
}); 