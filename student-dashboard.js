// דמו של קורסים
const allCourses = [
    {
        id: 1,
        title: 'שיווק דיגיטלי',
        description: 'למדו כיצד לשווק עסקים באינטרנט, ברשתות החברתיות ובגוגל.',
        price: 350,
        video: 'https://www.w3schools.com/html/mov_bbb.mp4'
    },
    {
        id: 2,
        title: 'פיתוח אפליקציות',
        description: 'קורס מעשי לפיתוח אפליקציות מובייל ואינטרנט.',
        price: 420,
        video: 'https://www.w3schools.com/html/movie.mp4'
    },
    {
        id: 3,
        title: 'ניהול פיננסי',
        description: 'הבינו את עקרונות הניהול הפיננסי לעסקים קטנים ובינוניים.',
        price: 300,
        video: 'https://www.w3schools.com/html/mov_bbb.mp4'
    },
    {
        id: 4,
        title: 'עיצוב גרפי',
        description: 'יסודות העיצוב הגרפי, עבודה עם פוטושופ ואילוסטרייטור.',
        price: 280,
        video: 'https://www.w3schools.com/html/movie.mp4'
    }
];

// נטען קורסים שנרכשו (לצורך הדמו - localStorage)
function getPurchasedCourses() {
    const data = localStorage.getItem('studentPurchasedCourses');
    if (data) return JSON.parse(data);
    // ברירת מחדל: קורס אחד נרכש
    return [1];
}

function setPurchasedCourses(ids) {
    localStorage.setItem('studentPurchasedCourses', JSON.stringify(ids));
}

function renderCourses() {
    const purchasedIds = getPurchasedCourses();
    // הקורסים שלי
    const myCourses = allCourses.filter(c => purchasedIds.includes(c.id));
    const myCoursesList = document.getElementById('myCoursesList');
    myCoursesList.innerHTML = myCourses.length ? '' : '<div>לא נרכשו קורסים עדיין.</div>';
    myCourses.forEach(course => {
        myCoursesList.innerHTML += `
            <div class="course-card">
                <div class="course-title">${course.title}</div>
                <div class="course-description">${course.description}</div>
                <div class="course-price">${course.price} ₪</div>
                <div class="course-actions">
                    <button class="btn btn-secondary" onclick="goToCourse(${course.id})">כניסה לקורס</button>
                </div>
            </div>
        `;
    });
    // כל הקורסים
    const allCoursesList = document.getElementById('allCoursesList');
    allCoursesList.innerHTML = '';
    allCourses.forEach(course => {
        const purchased = purchasedIds.includes(course.id);
        allCoursesList.innerHTML += `
            <div class="course-card">
                <div class="course-title">${course.title}</div>
                <div class="course-description">${course.description}</div>
                <div class="course-price">${course.price} ₪</div>
                <div class="course-actions">
                    ${purchased ? `<button class='btn btn-secondary' onclick='goToCourse(${course.id})'>כניסה לקורס</button>` : `<button class='btn btn-primary' onclick='previewCourse(${course.id})'>לפרטים ורכישה</button>`}
                </div>
            </div>
        `;
    });
}

// מעבר לקורס (בדמו - רק alert)
function goToCourse(courseId) {
    alert('מעבר לדף קורס: ' + courseId + ' (כאן תופיע מערכת הלמידה בפועל)');
}

// תצוגה ורכישה של קורס
function previewCourse(courseId) {
    const course = allCourses.find(c => c.id === courseId);
    if (!course) return;
    document.getElementById('previewCourseTitle').textContent = course.title;
    document.getElementById('previewCourseDescription').textContent = course.description;
    document.getElementById('previewCoursePrice').textContent = course.price + ' ₪';
    document.getElementById('previewCourseVideo').src = course.video;
    document.getElementById('purchaseCourseBtn').onclick = function() { purchaseCourse(courseId); };
    document.getElementById('coursePreviewModal').style.display = 'block';
}

document.getElementById('closePreviewModal').onclick = function() {
    document.getElementById('coursePreviewModal').style.display = 'none';
    document.getElementById('previewCourseVideo').pause();
};

// רכישת קורס (דמו)
function purchaseCourse(courseId) {
    let purchased = getPurchasedCourses();
    if (!purchased.includes(courseId)) {
        purchased.push(courseId);
        setPurchasedCourses(purchased);
        renderCourses();
        document.getElementById('coursePreviewModal').style.display = 'none';
        alert('הרכישה בוצעה בהצלחה!');
    }
}

// אתחול
window.onload = renderCourses; 