// Global variables
let currentUser = null;

// Helper functions
function showNotification(message, type = 'error') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Add animation class
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Login functions
async function login(email, password) {
    try {
        // טען את רשימת המשתמשים מ-localStorage
        let users = [];
        const usersData = localStorage.getItem('users');
        if (usersData) {
            users = JSON.parse(usersData);
        }

        if (!email || !password) {
            throw new Error('נא למלא את כל השדות');
        }

        // חפש משתמש מתאים
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            throw new Error('שם משתמש או סיסמה שגויים');
        }

        if (user.status !== 'active') {
            throw new Error('המשתמש אינו פעיל');
        }

        // שמירת פרטי המשתמש
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('userRole', user.role);

        // הפניה לדף המתאים לפי סוג המשתמש
        switch (user.role) {
            case 'admin':
                window.location.href = 'index.html';
                break;
            case 'student':
                window.location.href = 'student-dashboard.html';
                break;
            case 'teacher':
            case 'instructor':
                window.location.href = 'teacher-dashboard.html';
                break;
            default:
                throw new Error('סוג משתמש לא תקין');
        }
    } catch (error) {
        showNotification(error.message);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        
        login(email, password);
    });
    
    // בדיקה אם המשתמש כבר מחובר
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        const userRole = localStorage.getItem('userRole');
        
        switch (userRole) {
            case 'admin':
                window.location.href = 'index.html';
                break;
            case 'student':
                window.location.href = 'student-dashboard.html';
                break;
            case 'teacher':
            case 'instructor':
                window.location.href = 'teacher-dashboard.html';
                break;
        }
    }
}); 