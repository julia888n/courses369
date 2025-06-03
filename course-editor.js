// קבלת מזהה הקורס מה-URL
const urlParams = new URLSearchParams(window.location.search);
const courseId = urlParams.get('courseId');

// מבנה נתונים לדוגמה של קורס
let course = {
    id: courseId || Date.now(),
    title: '',
    description: '',
    price: 0,
    image: '',
    lessons: []
};

let currentLesson = null;

// משתנים גלובליים
let currentCourse = {
    title: '',
    description: '',
    price: 0,
    image: null,
    lessons: []
};

// פונקציות עזר
function createElementFromTemplate(templateId, data = {}) {
    const template = document.getElementById(templateId);
    const element = template.content.cloneNode(true);
    
    // מילוי נתונים בתבנית
    Object.keys(data).forEach(key => {
        const elements = element.querySelectorAll(`[data-${key}]`);
        elements.forEach(el => {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.value = data[key];
            } else {
                el.textContent = data[key];
            }
        });
    });
    
    return element;
}

function getFormData() {
    return {
        title: document.getElementById('courseTitle').value,
        description: document.getElementById('courseDescription').value,
        price: parseFloat(document.getElementById('coursePrice').value),
        image: document.getElementById('courseImage').files[0]
    };
}

// פונקציות ניהול קורס
function saveCourse() {
    const formData = getFormData();
    const lessons = [];

    // איסוף נתוני שיעורים
    document.querySelectorAll('.lesson-item').forEach(lessonItem => {
        const lesson = {
            title: lessonItem.querySelector('.lesson-title').value,
            sections: []
        };

        // איסוף נתוני תוכן
        lessonItem.querySelectorAll('.lesson-section').forEach(section => {
            const sectionData = {
                type: section.querySelector('.section-type').value,
                content: getSectionContent(section)
            };
            lesson.sections.push(sectionData);
        });

        lessons.push(lesson);
    });

    // שמירת הנתונים
    currentCourse = {
        ...formData,
        lessons
    };

    // כאן תהיה שליחה לשרת
    console.log('קורס נשמר:', currentCourse);
    alert('הקורס נשמר בהצלחה!');
}

function loadCourse(courseId) {
    // כאן תהיה קריאה לשרת לטעינת הקורס
    // כרגע משתמשים בנתונים לדוגמה
    if (courseId) {
        course = {
            id: courseId,
            title: 'ניהול פיננסי לעסקים',
            description: 'קורס מקיף בניהול פיננסי לעסקים קטנים ובינוניים',
            price: 999,
            image: 'https://via.placeholder.com/300x200',
            lessons: [
                {
                    id: 1,
                    title: 'מבוא לניהול פיננסי',
                    sections: [
                        {
                            type: 'text',
                            content: 'ברוכים הבאים לקורס...'
                        }
                    ]
                }
            ]
        };
    }
    
    // מילוי הטופס
    document.getElementById('course-title').value = course.title;
    document.getElementById('course-description').value = course.description;
    document.getElementById('course-price').value = course.price;

    // הצגת רשימת השיעורים
    displayLessons();
}

// פונקציות ניהול שיעורים
function addLesson() {
    const lessonTemplate = createElementFromTemplate('lessonTemplate');
    const lessonsList = document.getElementById('lessonsList');
    lessonsList.appendChild(lessonTemplate);

    // הוספת מאזיני אירועים לשיעור החדש
    const lessonItem = lessonsList.lastElementChild;
    setupLessonEventListeners(lessonItem);
}

function setupLessonEventListeners(lessonItem) {
    // כפתור עריכה
    const editBtn = lessonItem.querySelector('.edit-btn');
    editBtn.addEventListener('click', () => {
        const titleInput = lessonItem.querySelector('.lesson-title');
        titleInput.disabled = !titleInput.disabled;
    });

    // כפתור מחיקה
    const deleteBtn = lessonItem.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        if (confirm('האם אתה בטוח שברצונך למחוק שיעור זה?')) {
            lessonItem.remove();
        }
    });

    // כפתור הוספת תוכן
    const addSectionBtn = lessonItem.querySelector('.add-section-btn');
    addSectionBtn.addEventListener('click', () => {
        addSection(lessonItem);
    });
}

function deleteLesson(lessonId) {
    if (!confirm('האם אתה בטוח שברצונך למחוק שיעור זה?')) return;
    
    course.lessons = course.lessons.filter(l => l.id !== lessonId);
    displayLessons();
    
    if (currentLesson && currentLesson.id === lessonId) {
        currentLesson = null;
        document.getElementById('lesson-title').value = '';
        document.getElementById('lesson-description').value = '';
        document.querySelector('.sections-list').innerHTML = '';
    }
}

function displayLessons() {
    const container = document.querySelector('.lessons-container');
    container.innerHTML = '';
    
    course.lessons.forEach(lesson => {
        const element = createElementFromTemplate('lesson-template', {
            title: lesson.title
        });
        
        // הוספת מאזיני אירועים
        element.querySelector('.edit-lesson-btn').onclick = () => editLesson(lesson.id);
        element.querySelector('.delete-lesson-btn').onclick = () => deleteLesson(lesson.id);
        
        container.appendChild(element);
    });
}

// פונקציות ניהול תוכן שיעור
function addSection(lessonItem) {
    const sectionTemplate = createElementFromTemplate('sectionTemplate');
    const sectionsList = lessonItem.querySelector('.sections-list');
    sectionsList.appendChild(sectionTemplate);

    // הוספת מאזיני אירועים לקטע החדש
    const section = sectionsList.lastElementChild;
    setupSectionEventListeners(section);
}

function setupSectionEventListeners(section) {
    // בחירת סוג תוכן
    const typeSelect = section.querySelector('.section-type');
    typeSelect.addEventListener('change', () => {
        updateSectionContent(section, typeSelect.value);
    });

    // כפתור מחיקה
    const deleteBtn = section.querySelector('.delete-section-btn');
    deleteBtn.addEventListener('click', () => {
        if (confirm('האם אתה בטוח שברצונך למחוק תוכן זה?')) {
            section.remove();
        }
    });

    // יצירת תוכן התחלתי
    updateSectionContent(section, typeSelect.value);
}

function updateSectionContent(section, type) {
    const contentDiv = section.querySelector('.section-content');
    contentDiv.innerHTML = '';

    switch (type) {
        case 'text':
            contentDiv.innerHTML = `
                <textarea class="section-text" placeholder="הכנס טקסט כאן..." rows="4"></textarea>
            `;
            break;
        case 'video':
            contentDiv.innerHTML = `
                <input type="url" class="section-video" placeholder="הכנס קישור לוידאו">
            `;
            break;
        case 'quiz':
            contentDiv.innerHTML = `
                <div class="quiz-container">
                    <input type="text" class="quiz-question" placeholder="הכנס שאלה">
                    <div class="quiz-answers">
                        <input type="text" class="quiz-answer" placeholder="תשובה 1">
                        <input type="text" class="quiz-answer" placeholder="תשובה 2">
                        <input type="text" class="quiz-answer" placeholder="תשובה 3">
                        <input type="text" class="quiz-answer" placeholder="תשובה 4">
                    </div>
                    <select class="quiz-correct">
                        <option value="0">תשובה נכונה 1</option>
                        <option value="1">תשובה נכונה 2</option>
                        <option value="2">תשובה נכונה 3</option>
                        <option value="3">תשובה נכונה 4</option>
                    </select>
                </div>
            `;
            break;
        case 'file':
            contentDiv.innerHTML = `
                <input type="file" class="section-file">
            `;
            break;
    }
}

function getSectionContent(section) {
    const type = section.querySelector('.section-type').value;
    const contentDiv = section.querySelector('.section-content');

    switch (type) {
        case 'text':
            return contentDiv.querySelector('.section-text').value;
        case 'video':
            return contentDiv.querySelector('.section-video').value;
        case 'quiz':
            return {
                question: contentDiv.querySelector('.quiz-question').value,
                answers: Array.from(contentDiv.querySelectorAll('.quiz-answer')).map(input => input.value),
                correctAnswer: parseInt(contentDiv.querySelector('.quiz-correct').value)
            };
        case 'file':
            return contentDiv.querySelector('.section-file').files[0];
        default:
            return null;
    }
}

// אתחול
document.addEventListener('DOMContentLoaded', () => {
    // מאזיני אירועים לכפתורים ראשיים
    document.getElementById('addLessonBtn').addEventListener('click', addLesson);
    document.getElementById('saveBtn').addEventListener('click', saveCourse);
    document.getElementById('previewBtn').addEventListener('click', () => {
        // כאן תהיה לוגיקה לתצוגה מקדימה
        alert('תצוגה מקדימה תהיה זמינה בקרוב');
    });
    
    // טעינת קורס לדוגמה
    loadCourse(courseId);
}); 