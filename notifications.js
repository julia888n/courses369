// משתנים גלובליים
let notifications = [];
let currentNotification = null;
let isEditing = false;

// פונקציות עזר
function formatDate(date) {
    return new Date(date).toLocaleDateString('he-IL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getPriorityClass(priority) {
    switch (priority) {
        case 'high':
            return 'high';
        case 'medium':
            return 'medium';
        case 'low':
            return 'low';
        default:
            return '';
    }
}

function getPriorityName(priority) {
    switch (priority) {
        case 'high':
            return 'גבוהה';
        case 'medium':
            return 'בינונית';
        case 'low':
            return 'נמוכה';
        default:
            return priority;
    }
}

function getTypeIcon(type) {
    switch (type) {
        case 'system':
            return '⚙️';
        case 'payment':
            return '💰';
        case 'course':
            return '📚';
        case 'user':
            return '👤';
        default:
            return '📢';
    }
}

function showNotification(message, type = 'info') {
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

// פונקציות ניהול התראות
async function loadNotifications() {
    try {
        // כאן יהיה קוד לטעינת התראות מהשרת
        // בינתיים נשתמש בנתונים לדוגמה
        notifications = [
            {
                id: 1,
                title: 'תשלום חדש',
                message: 'התקבל תשלום חדש מקורס פיתוח ווב',
                time: new Date(),
                read: false
            },
            {
                id: 2,
                title: 'הרשמה לקורס',
                message: 'סטודנט חדש נרשם לקורס פיתוח אפליקציות',
                time: new Date(Date.now() - 3600000),
                read: true
            },
            {
                id: 3,
                title: 'עדכון מערכת',
                message: 'המערכת עודכנה לגרסה החדשה',
                time: new Date(Date.now() - 86400000),
                read: true
            }
        ];
        
        updateNotificationsList();
    } catch (error) {
        showNotification('שגיאה בטעינת ההתראות', 'error');
    }
}

function updateNotificationsList() {
    const notificationsList = document.querySelector('.notifications-list');
    if (!notificationsList) return;
    
    notificationsList.innerHTML = '';
    
    if (notifications.length === 0) {
        notificationsList.innerHTML = '<div class="notification-item">אין התראות חדשות</div>';
        return;
    }
    
    notifications.forEach(notification => {
        const notificationItem = document.createElement('div');
        notificationItem.className = `notification-item ${notification.read ? '' : 'unread'}`;
        
        notificationItem.innerHTML = `
            <div class="title">${notification.title}</div>
            <div class="message">${notification.message}</div>
            <div class="time">${formatDate(notification.time)}</div>
        `;
        
        notificationItem.addEventListener('click', () => markNotificationAsRead(notification.id));
        
        notificationsList.appendChild(notificationItem);
    });
}

function markNotificationAsRead(notificationId) {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
        notification.read = true;
        updateNotificationsList();
    }
}

function toggleNotifications() {
    const notificationsList = document.querySelector('.notifications-list');
    if (notificationsList) {
        notificationsList.classList.toggle('show');
    }
}

function filterNotifications() {
    const type = document.getElementById('type-filter').value;
    const priority = document.getElementById('priority-filter').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const search = document.getElementById('search').value.toLowerCase();
    
    const filteredNotifications = notifications.filter(notification => {
        const matchesType = type === 'all' || notification.type === type;
        const matchesPriority = priority === 'all' || notification.priority === priority;
        const matchesSearch = notification.title.toLowerCase().includes(search) || 
                            notification.message.toLowerCase().includes(search);
        
        let matchesDate = true;
        if (startDate && endDate) {
            const notificationDate = new Date(notification.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            matchesDate = notificationDate >= start && notificationDate <= end;
        }
        
        return matchesType && matchesPriority && matchesSearch && matchesDate;
    });
    
    displayFilteredNotifications(filteredNotifications);
}

function displayFilteredNotifications(filteredNotifications) {
    const notificationsList = document.querySelector('.notifications-list');
    notificationsList.innerHTML = '';
    
    if (filteredNotifications.length === 0) {
        notificationsList.innerHTML = '<p class="no-results">לא נמצאו התראות מתאימות</p>';
        return;
    }
    
    filteredNotifications.forEach(notification => {
        // אותו קוד כמו ב-displayNotifications
        const notificationElement = document.createElement('div');
        notificationElement.className = `notification-item ${notification.read ? '' : 'unread'} ${getPriorityClass(notification.priority)}`;
        
        notificationElement.innerHTML = `
            <div class="notification-icon">${getTypeIcon(notification.type)}</div>
            <div class="notification-content">
                <div class="notification-header">
                    <div>
                        <h3 class="notification-title">${notification.title}</h3>
                        <div class="notification-meta">
                            <span>${formatDate(notification.time)}</span>
                            <span>עדיפות: ${getPriorityName(notification.priority)}</span>
                        </div>
                    </div>
                    <div class="notification-actions">
                        ${!notification.read ? `
                            <button class="btn btn-icon" onclick="markAsRead(${notification.id})">
                                <i class="fas fa-check"></i>
                            </button>
                        ` : ''}
                        <button class="btn btn-icon" onclick="editNotification(${notification.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-icon btn-danger" onclick="deleteNotification(${notification.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <p class="notification-message">${notification.message}</p>
            </div>
        `;
        
        notificationsList.appendChild(notificationElement);
    });
}

// פונקציות מודל
function showModal() {
    const modal = document.getElementById('notification-modal');
    modal.style.display = 'block';
}

function hideModal() {
    const modal = document.getElementById('notification-modal');
    modal.style.display = 'none';
    resetForm();
}

function resetForm() {
    document.getElementById('notification-form').reset();
    currentNotification = null;
    isEditing = false;
}

// פונקציות פעולה
function markAsRead(id) {
    const notification = notifications.find(n => n.id === id);
    if (notification) {
        notification.read = true;
        displayNotifications();
        updateStats();
    }
}

function markAllAsRead() {
    notifications.forEach(notification => {
        notification.read = true;
    });
    displayNotifications();
    updateStats();
}

function deleteNotification(id) {
    if (confirm('האם אתה בטוח שברצונך למחוק התראה זו?')) {
        notifications = notifications.filter(n => n.id !== id);
        displayNotifications();
        updateStats();
    }
}

function deleteAllNotifications() {
    if (confirm('האם אתה בטוח שברצונך למחוק את כל ההתראות?')) {
        notifications = [];
        displayNotifications();
        updateStats();
    }
}

function editNotification(id) {
    const notification = notifications.find(n => n.id === id);
    if (notification) {
        currentNotification = notification;
        isEditing = true;
        
        document.getElementById('type').value = notification.type;
        document.getElementById('title').value = notification.title;
        document.getElementById('message').value = notification.message;
        document.getElementById('priority').value = notification.priority;
        document.getElementById('recipients').value = notification.recipients.join(',');
        
        showModal();
    }
}

// אתחול
document.addEventListener('DOMContentLoaded', () => {
    loadNotifications();
    
    // מאזיני אירועים
    document.getElementById('add-notification').addEventListener('click', () => {
        resetForm();
        showModal();
    });
    
    document.getElementById('mark-all-read').addEventListener('click', markAllAsRead);
    document.getElementById('delete-all').addEventListener('click', deleteAllNotifications);
    
    document.getElementById('notification-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const notificationData = {
            id: isEditing ? currentNotification.id : notifications.length + 1,
            type: formData.get('type'),
            title: formData.get('title'),
            message: formData.get('message'),
            priority: formData.get('priority'),
            date: new Date().toISOString(),
            read: false,
            recipients: formData.get('recipients').split(',').map(r => r.trim())
        };
        
        if (isEditing) {
            const index = notifications.findIndex(n => n.id === currentNotification.id);
            notifications[index] = notificationData;
        } else {
            notifications.unshift(notificationData);
        }
        
        displayNotifications();
        updateStats();
        hideModal();
    });
    
    // מאזיני אירועים לפילטרים
    document.getElementById('type-filter').addEventListener('change', filterNotifications);
    document.getElementById('priority-filter').addEventListener('change', filterNotifications);
    document.getElementById('start-date').addEventListener('change', filterNotifications);
    document.getElementById('end-date').addEventListener('change', filterNotifications);
    document.getElementById('search').addEventListener('input', filterNotifications);

    const notificationsButton = document.querySelector('.notifications-button');
    
    if (notificationsButton) {
        notificationsButton.addEventListener('click', toggleNotifications);
        
        // סגירת רשימת ההתראות בלחיצה מחוץ לרשימה
        document.addEventListener('click', function(event) {
            const notificationsList = document.querySelector('.notifications-list');
            if (notificationsList && !notificationsList.contains(event.target) && !notificationsButton.contains(event.target)) {
                notificationsList.classList.remove('show');
            }
        });
    }
}); 