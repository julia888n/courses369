// משתנים גלובליים
let settings = {
    general: {
        siteName: '',
        siteDescription: '',
        contactEmail: '',
        contactPhone: '',
        timezone: 'Asia/Jerusalem'
    },
    notifications: {
        email: {
            newStudent: false,
            paymentReceived: false,
            courseStart: false,
            courseEnd: false
        },
        system: {
            lowBalance: false,
            failedPayment: false,
            systemUpdate: false
        }
    },
    payments: {
        currency: 'ILS',
        paymentMethods: {
            credit: false,
            transfer: false,
            cash: false
        },
        taxRate: 17,
        paymentTerms: ''
    },
    appearance: {
        primaryColor: '#4CAF50',
        secondaryColor: '#2196F3',
        fontFamily: 'Segoe UI',
        logo: null,
        favicon: null
    },
    security: {
        sessionTimeout: 30,
        passwordRestrictions: {
            uppercase: true,
            numbers: true,
            special: true
        },
        minPasswordLength: 8,
        maxLoginAttempts: 5
    }
};

// פונקציות עזר
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function formatPhoneNumber(phone) {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
}

// פונקציות טעינת נתונים
async function loadSettings() {
    try {
        // כאן יהיה קוד לטעינת ההגדרות מהשרת
        // כרגע נשתמש בהגדרות ברירת המחדל
        displaySettings();
    } catch (error) {
        showNotification('שגיאה בטעינת ההגדרות', 'error');
    }
}

function displaySettings() {
    // הגדרות כלליות
    document.getElementById('siteName').value = settings.general.siteName;
    document.getElementById('siteDescription').value = settings.general.siteDescription;
    document.getElementById('contactEmail').value = settings.general.contactEmail;
    document.getElementById('contactPhone').value = settings.general.contactPhone;
    document.getElementById('timezone').value = settings.general.timezone;

    // הגדרות התראות
    Object.entries(settings.notifications.email).forEach(([key, value]) => {
        const checkbox = document.querySelector(`input[name="emailNotifications"][value="${key}"]`);
        if (checkbox) checkbox.checked = value;
    });

    Object.entries(settings.notifications.system).forEach(([key, value]) => {
        const checkbox = document.querySelector(`input[name="systemNotifications"][value="${key}"]`);
        if (checkbox) checkbox.checked = value;
    });

    // הגדרות תשלומים
    document.getElementById('currency').value = settings.payments.currency;
    Object.entries(settings.payments.paymentMethods).forEach(([key, value]) => {
        const checkbox = document.querySelector(`input[name="paymentMethods"][value="${key}"]`);
        if (checkbox) checkbox.checked = value;
    });
    document.getElementById('taxRate').value = settings.payments.taxRate;
    document.getElementById('paymentTerms').value = settings.payments.paymentTerms;

    // הגדרות עיצוב
    document.getElementById('primaryColor').value = settings.appearance.primaryColor;
    document.getElementById('secondaryColor').value = settings.appearance.secondaryColor;
    document.getElementById('fontFamily').value = settings.appearance.fontFamily;

    // הגדרות אבטחה
    document.getElementById('sessionTimeout').value = settings.security.sessionTimeout;
    Object.entries(settings.security.passwordRestrictions).forEach(([key, value]) => {
        const checkbox = document.querySelector(`input[name="passwordRestrictions"][value="${key}"]`);
        if (checkbox) checkbox.checked = value;
    });
    document.getElementById('minPasswordLength').value = settings.security.minPasswordLength;
    document.getElementById('maxLoginAttempts').value = settings.security.maxLoginAttempts;
}

// פונקציות שמירת הגדרות
async function saveSettings() {
    try {
        // איסוף הגדרות כלליות
        settings.general = {
            siteName: document.getElementById('siteName').value,
            siteDescription: document.getElementById('siteDescription').value,
            contactEmail: document.getElementById('contactEmail').value,
            contactPhone: document.getElementById('contactPhone').value,
            timezone: document.getElementById('timezone').value
        };

        // איסוף הגדרות התראות
        settings.notifications.email = {
            newStudent: document.querySelector('input[name="emailNotifications"][value="newStudent"]').checked,
            paymentReceived: document.querySelector('input[name="emailNotifications"][value="paymentReceived"]').checked,
            courseStart: document.querySelector('input[name="emailNotifications"][value="courseStart"]').checked,
            courseEnd: document.querySelector('input[name="emailNotifications"][value="courseEnd"]').checked
        };

        settings.notifications.system = {
            lowBalance: document.querySelector('input[name="systemNotifications"][value="lowBalance"]').checked,
            failedPayment: document.querySelector('input[name="systemNotifications"][value="failedPayment"]').checked,
            systemUpdate: document.querySelector('input[name="systemNotifications"][value="systemUpdate"]').checked
        };

        // איסוף הגדרות תשלומים
        settings.payments = {
            currency: document.getElementById('currency').value,
            paymentMethods: {
                credit: document.querySelector('input[name="paymentMethods"][value="credit"]').checked,
                transfer: document.querySelector('input[name="paymentMethods"][value="transfer"]').checked,
                cash: document.querySelector('input[name="paymentMethods"][value="cash"]').checked
            },
            taxRate: parseFloat(document.getElementById('taxRate').value),
            paymentTerms: document.getElementById('paymentTerms').value
        };

        // איסוף הגדרות עיצוב
        settings.appearance = {
            primaryColor: document.getElementById('primaryColor').value,
            secondaryColor: document.getElementById('secondaryColor').value,
            fontFamily: document.getElementById('fontFamily').value,
            logo: settings.appearance.logo,
            favicon: settings.appearance.favicon
        };

        // איסוף הגדרות אבטחה
        settings.security = {
            sessionTimeout: parseInt(document.getElementById('sessionTimeout').value),
            passwordRestrictions: {
                uppercase: document.querySelector('input[name="passwordRestrictions"][value="uppercase"]').checked,
                numbers: document.querySelector('input[name="passwordRestrictions"][value="numbers"]').checked,
                special: document.querySelector('input[name="passwordRestrictions"][value="special"]').checked
            },
            minPasswordLength: parseInt(document.getElementById('minPasswordLength').value),
            maxLoginAttempts: parseInt(document.getElementById('maxLoginAttempts').value)
        };

        // כאן יהיה קוד לשמירת ההגדרות בשרת
        showNotification('ההגדרות נשמרו בהצלחה');
    } catch (error) {
        showNotification('שגיאה בשמירת ההגדרות', 'error');
    }
}

// פונקציות ניהול קבצים
function handleFileUpload(event, type) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        if (type === 'logo') {
            settings.appearance.logo = e.target.result;
        } else if (type === 'favicon') {
            settings.appearance.favicon = e.target.result;
        }
    };
    reader.readAsDataURL(file);
}

// פונקציות ניווט
function switchSection(sectionId) {
    // הסרת המחלקה active מכל הסקציות
    document.querySelectorAll('.settings-section').forEach(section => {
        section.classList.remove('active');
    });

    // הסרת המחלקה active מכל כפתורי הניווט
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // הוספת המחלקה active לסקציה הנבחרת
    document.getElementById(sectionId).classList.add('active');

    // הוספת המחלקה active לכפתור הניווט המתאים
    document.querySelector(`.nav-item[data-section="${sectionId}"]`).classList.add('active');
}

// מאזיני אירועים
document.addEventListener('DOMContentLoaded', () => {
    // טעינת הגדרות
    loadSettings();

    // מאזין לכפתור שמירת הגדרות
    document.getElementById('saveSettingsBtn').addEventListener('click', saveSettings);

    // מאזינים לכפתורי ניווט
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            switchSection(item.dataset.section);
        });
    });

    // מאזינים להעלאת קבצים
    document.getElementById('logo').addEventListener('change', (e) => handleFileUpload(e, 'logo'));
    document.getElementById('favicon').addEventListener('change', (e) => handleFileUpload(e, 'favicon'));

    // מאזין לפורמט מספר טלפון
    document.getElementById('contactPhone').addEventListener('input', (e) => {
        e.target.value = formatPhoneNumber(e.target.value.replace(/\D/g, ''));
    });
}); 