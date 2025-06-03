// Global variables
let messages = [];
let currentFolder = 'inbox';
let selectedMessage = null;

// Helper functions
function formatDate(date) {
    return new Date(date).toLocaleDateString('he-IL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
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

// Message functions
async function loadMessages() {
    try {
        // כאן יהיה קוד לטעינת הודעות מהשרת
        // בינתיים נשתמש בנתונים לדוגמה
        messages = [
            {
                id: 1,
                sender: 'מנהל מערכת',
                recipient: 'כל המשתמשים',
                subject: 'עדכון מערכת',
                content: 'המערכת עודכנה לגרסה החדשה. אנא רענן את הדף.',
                date: new Date(),
                read: false,
                folder: 'inbox'
            },
            {
                id: 2,
                sender: 'מנהל קורס',
                recipient: 'סטודנטים בקורס JavaScript',
                subject: 'תזכורת - שיעור הבא',
                content: 'שיעור הבא יתקיים ביום שני בשעה 18:00.',
                date: new Date(Date.now() - 3600000),
                read: true,
                folder: 'inbox'
            },
            {
                id: 3,
                sender: 'מנהל מערכת',
                recipient: 'כל המשתמשים',
                subject: 'תשלום חדש',
                content: 'התקבל תשלום חדש עבור קורס פיתוח ווב.',
                date: new Date(Date.now() - 86400000),
                read: true,
                folder: 'sent'
            }
        ];
        
        updateMessagesList();
    } catch (error) {
        showNotification('שגיאה בטעינת ההודעות', 'error');
    }
}

function updateMessagesList() {
    const messagesList = document.querySelector('.messages-list');
    if (!messagesList) return;
    
    messagesList.innerHTML = '';
    
    const filteredMessages = messages.filter(message => message.folder === currentFolder);
    
    if (filteredMessages.length === 0) {
        messagesList.innerHTML = '<div class="message-item">אין הודעות</div>';
        return;
    }
    
    filteredMessages.forEach(message => {
        const messageItem = document.createElement('div');
        messageItem.className = `message-item ${message.read ? '' : 'unread'} ${message.id === selectedMessage?.id ? 'active' : ''}`;
        
        messageItem.innerHTML = `
            <div class="header">
                <span class="sender">${message.sender}</span>
                <span class="date">${formatDate(message.date)}</span>
            </div>
            <div class="subject">${message.subject}</div>
            <div class="preview">${message.content}</div>
        `;
        
        messageItem.addEventListener('click', () => selectMessage(message));
        
        messagesList.appendChild(messageItem);
    });
}

function selectMessage(message) {
    selectedMessage = message;
    updateMessagesList();
    displayMessage(message);
}

function displayMessage(message) {
    const messageContent = document.querySelector('.message-content');
    if (!messageContent) return;
    
    messageContent.innerHTML = `
        <div class="message-details">
            <div class="header">
                <h2 class="subject">${message.subject}</h2>
                <div class="meta">
                    <div>
                        <strong>מאת:</strong> ${message.sender}
                        <br>
                        <strong>אל:</strong> ${message.recipient}
                    </div>
                    <div>${formatDate(message.date)}</div>
                </div>
            </div>
            <div class="content">${message.content}</div>
        </div>
    `;
    
    if (!message.read) {
        message.read = true;
        updateMessagesList();
    }
}

function composeMessage() {
    const modal = document.getElementById('composeModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function closeComposeModal() {
    const modal = document.getElementById('composeModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function saveDraft() {
    const recipient = document.getElementById('recipient').value;
    const subject = document.getElementById('subject').value;
    const content = document.getElementById('message').value;
    
    if (!subject || !content) {
        showNotification('נא למלא את כל השדות', 'error');
        return;
    }
    
    const draft = {
        id: Date.now(),
        sender: 'מנהל מערכת',
        recipient: recipient || 'טיוטה',
        subject,
        content,
        date: new Date(),
        read: true,
        folder: 'draft'
    };
    
    messages.push(draft);
    updateMessagesList();
    closeComposeModal();
    showNotification('הטיוטה נשמרה בהצלחה', 'success');
}

// פונקציה לטעינת רשימת נמענים
async function loadRecipients() {
    try {
        // כאן יהיה קוד לטעינת נמענים מהשרת
        // בינתיים נשתמש בנתונים לדוגמה
        const recipients = [
            { id: 'all', name: 'כל המשתמשים' },
            { id: 'students', name: 'כל התלמידים' },
            { id: 'teachers', name: 'כל המורים' },
            { id: 'course1', name: 'תלמידי קורס JavaScript' },
            { id: 'course2', name: 'תלמידי קורס Python' },
            { id: 'course3', name: 'תלמידי קורס Web Development' }
        ];

        const recipientSelect = document.getElementById('recipient');
        if (recipientSelect) {
            recipientSelect.innerHTML = '<option value="">בחר נמען</option>';
            recipients.forEach(recipient => {
                const option = document.createElement('option');
                option.value = recipient.id;
                option.textContent = recipient.name;
                recipientSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('שגיאה בטעינת רשימת הנמענים:', error);
        showNotification('שגיאה בטעינת רשימת הנמענים', 'error');
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    const folderSelect = document.getElementById('folder');
    const searchInput = document.getElementById('search');
    const startDate = document.getElementById('start-date');
    const endDate = document.getElementById('end-date');
    const composeForm = document.getElementById('composeForm');
    const composeBtn = document.getElementById('composeBtn');
    
    if (folderSelect) {
        folderSelect.addEventListener('change', function() {
            currentFolder = this.value;
            updateMessagesList();
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            // כאן יהיה קוד לחיפוש הודעות
        });
    }
    
    if (startDate && endDate) {
        startDate.addEventListener('change', function() {
            // כאן יהיה קוד לסינון לפי תאריך
        });
        
        endDate.addEventListener('change', function() {
            // כאן יהיה קוד לסינון לפי תאריך
        });
    }
    
    if (composeForm) {
        composeForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const recipient = document.getElementById('recipient').value;
            const subject = document.getElementById('subject').value;
            const content = document.getElementById('message').value;
            
            if (!recipient || !subject || !content) {
                showNotification('נא למלא את כל השדות', 'error');
                return;
            }
            
            const message = {
                id: Date.now(),
                sender: 'מנהל מערכת',
                recipient,
                subject,
                content,
                date: new Date(),
                read: false,
                folder: 'sent'
            };
            
            messages.push(message);
            updateMessagesList();
            closeComposeModal();
            showNotification('ההודעה נשלחה בהצלחה', 'success');
        });
    }
    
    if (composeBtn) {
        composeBtn.addEventListener('click', () => {
            composeMessage();
            loadRecipients(); // טעינה מחדש של רשימת הנמענים בכל פתיחה של חלון הכתיבה
        });
    }
    
    // טעינת הודעות ונמענים
    loadMessages();
    loadRecipients();
}); 