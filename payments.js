// משתנים גלובליים
let payments = [];
let students = [];
let courses = [];
let currentPayment = null;
let isEditing = false;

// פונקציות עזר
function formatDate(date) {
    return new Date(date).toLocaleDateString('he-IL');
}

function formatPrice(amount) {
    return `₪${amount.toLocaleString('he-IL')}`;
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function getStatusClass(status) {
    switch (status) {
        case 'paid':
            return 'status-paid';
        case 'pending':
            return 'status-pending';
        case 'overdue':
            return 'status-overdue';
        default:
            return '';
    }
}

function getStatusText(status) {
    switch (status) {
        case 'paid':
            return 'שולם';
        case 'pending':
            return 'ממתין';
        case 'overdue':
            return 'פג תוקף';
        default:
            return status;
    }
}

function getPaymentMethodName(method) {
    switch (method) {
        case 'cash':
            return 'מזומן';
        case 'credit':
            return 'כרטיס אשראי';
        case 'transfer':
            return 'העברה בנקאית';
        default:
            return method;
    }
}

// פונקציות טעינת נתונים
async function loadData() {
    try {
        // נסה לטעון נתונים מ-localStorage
        const storedStudents = localStorage.getItem('students');
        const storedCourses = localStorage.getItem('courses');
        const storedPayments = localStorage.getItem('payments');

        // טעינת תלמידים
        if (storedStudents) {
            students = JSON.parse(storedStudents);
        } else {
            // נתונים לדוגמה אם אין נתונים ב-localStorage
            students = [
                { id: 1, name: 'ישראל ישראלי', email: 'israel@example.com' },
                { id: 2, name: 'שרה כהן', email: 'sarah@example.com' },
                { id: 3, name: 'דוד לוי', email: 'david@example.com' }
            ];
            localStorage.setItem('students', JSON.stringify(students));
        }

        // טעינת קורסים
        if (storedCourses) {
            courses = JSON.parse(storedCourses);
        } else {
            // נתונים לדוגמה אם אין נתונים ב-localStorage
            courses = [
                { id: 1, name: 'קורס פיתוח אתרים', price: 2500 },
                { id: 2, name: 'קורס תכנות מובייל', price: 3000 },
                { id: 3, name: 'קורס ניהול פרויקטים', price: 2800 }
            ];
            localStorage.setItem('courses', JSON.stringify(courses));
        }

        // טעינת תשלומים
        if (storedPayments) {
            payments = JSON.parse(storedPayments);
        } else {
            // נתונים לדוגמה אם אין נתונים ב-localStorage
            payments = [
                {
                    id: 1,
                    studentId: 1,
                    courseId: 1,
                    amount: 2500,
                    date: '2024-02-01',
                    status: 'paid',
                    paymentMethod: 'credit',
                    notes: 'תשלום מלא'
                },
                {
                    id: 2,
                    studentId: 2,
                    courseId: 2,
                    amount: 1500,
                    date: '2024-02-15',
                    status: 'pending',
                    paymentMethod: 'transfer',
                    notes: 'תשלום ראשון'
                },
                {
                    id: 3,
                    studentId: 3,
                    courseId: 3,
                    amount: 2800,
                    date: '2024-01-15',
                    status: 'overdue',
                    paymentMethod: 'cash',
                    notes: 'תשלום מלא'
                }
            ];
            localStorage.setItem('payments', JSON.stringify(payments));
        }

        // מילוי הרשימות הנפתחות
        populateSelects();
        
        // הצגת הנתונים
        displayPayments();
        updateStats();
    } catch (error) {
        console.error('שגיאה בטעינת הנתונים:', error);
        showNotification('אירעה שגיאה בטעינת הנתונים', 'error');
    }
}

function getCoursesFromStorage() {
    // נסה לקרוא קורסים מ-localStorage
    try {
        const stored = localStorage.getItem('courses');
        if (stored) return JSON.parse(stored);
    } catch (e) {}
    // אם אין, חזור למערך הקיים
    return typeof courses !== 'undefined' ? courses : [];
}

function getStudentsFromStorage() {
    try {
        const stored = localStorage.getItem('students');
        if (stored) return JSON.parse(stored);
    } catch (e) {}
    return typeof students !== 'undefined' ? students : [];
}

// מילוי רשימות בחירה
function populateSelects() {
    // מילוי רשימת תלמידים
    const studentSelect = document.getElementById('studentSelect');
    const studentFilter = document.getElementById('studentFilter');
    
    if (studentSelect && studentFilter) {
        const studentOptions = '<option value="">בחר תלמיד</option>' +
            students.map(student => `<option value="${student.id}">${student.name}</option>`).join('');
        
        studentSelect.innerHTML = studentOptions;
        studentFilter.innerHTML = '<option value="all">הכל</option>' + studentOptions;
    }

    // מילוי רשימת קורסים
    const courseSelect = document.getElementById('courseSelect');
    const courseFilter = document.getElementById('courseFilter');
    
    if (courseSelect && courseFilter) {
        const courseOptions = '<option value="">בחר קורס</option>' +
            courses.map(course => `<option value="${course.id}">${course.name}</option>`).join('');
        
        courseSelect.innerHTML = courseOptions;
        courseFilter.innerHTML = '<option value="all">הכל</option>' + courseOptions;
    }
}

// הצגת תשלומים
function displayPayments(filteredPayments = payments) {
    const tbody = document.getElementById('paymentsTableBody');
    if (!tbody) return;

    // טעינה מחדש של הנתונים מ-localStorage
    const storedPayments = localStorage.getItem('payments');
    if (storedPayments) {
        payments = JSON.parse(storedPayments);
        filteredPayments = payments;
    }

    tbody.innerHTML = filteredPayments.map(payment => {
        const student = students.find(s => s.id === payment.studentId);
        let courseNames = '';
        if (Array.isArray(payment.courseIds)) {
            courseNames = payment.courseIds.map(cid => {
                const c = courses.find(c => c.id === cid);
                return c ? c.name : '';
            }).filter(Boolean).join(', ');
        } else if (payment.courseId) {
            const c = courses.find(c => c.id === payment.courseId);
            courseNames = c ? c.name : '';
        }

        // וידוא שהסטטוס מוצג נכון
        const statusText = getStatusText(payment.status || 'pending');
        const statusClass = getStatusClass(payment.status || 'pending');

        return `
            <tr>
                <td>#${payment.id}</td>
                <td>${student ? student.name : (payment.studentName || '')}</td>
                <td>${courseNames}</td>
                <td>${formatPrice(payment.amount)}</td>
                <td>${formatDate(payment.date)}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>
                    <button class="action-btn view-btn" onclick="viewPayment(${payment.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit-btn" onclick="editPayment(${payment.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deletePayment(${payment.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// עדכון סטטיסטיקות
function updateStats() {
    const totalIncome = payments.reduce((sum, payment) => 
        payment.status === 'paid' ? sum + payment.amount : sum, 0);
    
    const pendingAmount = payments.reduce((sum, payment) => 
        payment.status === 'pending' ? sum + payment.amount : sum, 0);
    
    const overdueAmount = payments.reduce((sum, payment) => 
        payment.status === 'overdue' ? sum + payment.amount : sum, 0);
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyIncome = payments.reduce((sum, payment) => {
        const paymentDate = new Date(payment.date);
        return payment.status === 'paid' && 
               paymentDate.getMonth() === currentMonth && 
               paymentDate.getFullYear() === currentYear ? 
               sum + payment.amount : sum;
    }, 0);

    document.getElementById('totalIncome').textContent = formatPrice(totalIncome);
    document.getElementById('pendingAmount').textContent = formatPrice(pendingAmount);
    document.getElementById('overdueAmount').textContent = formatPrice(overdueAmount);
    document.getElementById('monthlyIncome').textContent = formatPrice(monthlyIncome);
}

// סינון תשלומים
function filterPayments() {
    const status = document.getElementById('statusFilter').value;
    const student = document.getElementById('studentFilter').value;
    const course = document.getElementById('courseFilter').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const search = document.getElementById('searchPayment').value.toLowerCase();

    const filteredPayments = payments.filter(payment => {
        const paymentStudent = students.find(s => s.id === payment.studentId);
        const paymentCourse = courses.find(c => c.id === payment.courseId);
        const paymentDate = new Date(payment.date);

        const matchesStatus = status === 'all' || payment.status === status;
        const matchesStudent = student === 'all' || payment.studentId === parseInt(student);
        const matchesCourse = course === 'all' || payment.courseId === parseInt(course);
        const matchesDate = (!startDate || paymentDate >= new Date(startDate)) &&
                          (!endDate || paymentDate <= new Date(endDate));
        const matchesSearch = payment.id.toString().includes(search) ||
                            (paymentStudent && paymentStudent.name.toLowerCase().includes(search));

        return matchesStatus && matchesStudent && matchesCourse && matchesDate && matchesSearch;
    });

    displayPayments(filteredPayments);
}

// צפייה בתשלום
function viewPayment(id) {
    const payment = payments.find(p => p.id === id);
    if (!payment) return;

    const student = students.find(s => s.id === payment.studentId);
    const course = courses.find(c => c.id === payment.courseId);

    document.getElementById('detailPaymentNumber').textContent = `#${payment.id}`;
    document.getElementById('detailStudent').textContent = student ? student.name : '';
    document.getElementById('detailCourse').textContent = course ? course.name : '';
    document.getElementById('detailAmount').textContent = formatPrice(payment.amount);
    document.getElementById('detailDate').textContent = formatDate(payment.date);
    document.getElementById('detailStatus').textContent = getStatusText(payment.status);
    document.getElementById('detailPaymentMethod').textContent = getPaymentMethodName(payment.paymentMethod);
    document.getElementById('detailNotes').textContent = payment.notes || '-';

    openModal('paymentDetailsModal');
}

// עריכת תשלום
function editPayment(id) {
    const payment = payments.find(p => p.id === id);
    if (!payment) return;

    currentPayment = payment;
    isEditing = true;
    document.getElementById('modalTitle').textContent = 'עריכת תשלום';
    
    // מילוי הטופס עם נתוני התשלום הקיים
    document.getElementById('studentSelect').value = payment.studentId || '';
    document.getElementById('studentName').value = payment.studentName || '';
    
    // טיפול בבחירת קורסים
    const courseSelect = document.getElementById('courseSelect');
    if (Array.isArray(payment.courseIds)) {
        payment.courseIds.forEach(courseId => {
            const option = courseSelect.querySelector(`option[value="${courseId}"]`);
            if (option) option.selected = true;
        });
    } else if (payment.courseId) {
        courseSelect.value = payment.courseId;
    }
    
    document.getElementById('amount').value = payment.amount;
    document.getElementById('paymentDate').value = payment.date;
    
    // וידוא שהסטטוס נטען נכון
    const statusSelect = document.getElementById('paymentStatusSelect');
    if (statusSelect) {
        statusSelect.value = payment.status || 'pending';
    }
    
    document.getElementById('paymentMethod').value = payment.paymentMethod;
    document.getElementById('notes').value = payment.notes || '';

    openModal('paymentModal');
}

// מחיקת תשלום
function deletePayment(id) {
    if (!confirm('האם אתה בטוח שברצונך למחוק תשלום זה?')) return;

    const index = payments.findIndex(p => p.id === id);
    if (index === -1) return;

    payments.splice(index, 1);
    displayPayments();
    updateStats();
    showNotification('התשלום נמחק בהצלחה');
}

// פונקציה לשמירת נתונים
function saveData() {
    try {
        localStorage.setItem('students', JSON.stringify(students));
        localStorage.setItem('courses', JSON.stringify(courses));
        localStorage.setItem('payments', JSON.stringify(payments));
    } catch (error) {
        console.error('שגיאה בשמירת הנתונים:', error);
        showNotification('אירעה שגיאה בשמירת הנתונים', 'error');
    }
}

// עדכון פונקציית savePayment
function savePayment(event) {
    event.preventDefault();
    
    const studentId = document.getElementById('studentSelect').value;
    const studentName = document.getElementById('studentName').value;
    const courseSelect = document.getElementById('courseSelect');
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('paymentDate').value;
    const status = document.getElementById('paymentStatusSelect').value;
    const paymentMethod = document.getElementById('paymentMethod').value;
    const notes = document.getElementById('notes').value;

    // בדיקת תקינות
    if (!studentId && !studentName) {
        showNotification('יש לבחור תלמיד או להזין שם תלמיד', 'error');
        return;
    }

    if (!courseSelect.value) {
        showNotification('יש לבחור לפחות קורס אחד', 'error');
        return;
    }

    if (!amount || amount <= 0) {
        showNotification('יש להזין סכום תקין', 'error');
        return;
    }

    if (!date) {
        showNotification('יש לבחור תאריך תשלום', 'error');
        return;
    }

    const selectedCourseIds = Array.from(courseSelect.selectedOptions).map(option => parseInt(option.value));

    try {
        if (isEditing && currentPayment) {
            // עדכון תשלום קיים
            const index = payments.findIndex(p => p.id === currentPayment.id);
            if (index !== -1) {
                // יצירת אובייקט תשלום מעודכן
                const updatedPayment = {
                    ...payments[index],
                    studentId: studentId ? parseInt(studentId) : null,
                    studentName: studentName || null,
                    courseIds: selectedCourseIds,
                    amount,
                    date,
                    status: status,
                    paymentMethod,
                    notes
                };
                
                // עדכון המערך
                payments[index] = updatedPayment;
                
                // שמירה מיידית ב-localStorage
                localStorage.setItem('payments', JSON.stringify(payments));
                
                // טעינה מחדש של הנתונים
                const storedPayments = localStorage.getItem('payments');
                if (storedPayments) {
                    payments = JSON.parse(storedPayments);
                }
            }
        } else {
            // הוספת תשלום חדש
            const newPayment = {
                id: payments.length > 0 ? Math.max(...payments.map(p => p.id)) + 1 : 1,
                studentId: studentId ? parseInt(studentId) : null,
                studentName: studentName || null,
                courseIds: selectedCourseIds,
                amount,
                date,
                status: status,
                paymentMethod,
                notes
            };
            payments.push(newPayment);
            localStorage.setItem('payments', JSON.stringify(payments));
        }

        // עדכון התצוגה
        displayPayments();
        updateStats();
        closeModal('paymentModal');
        showNotification(isEditing ? 'התשלום עודכן בהצלחה' : 'התשלום נוצר בהצלחה');
        
        // איפוס משתני העריכה
        isEditing = false;
        currentPayment = null;
    } catch (error) {
        console.error('שגיאה בשמירת התשלום:', error);
        showNotification('אירעה שגיאה בשמירת התשלום', 'error');
    }
}

// ניהול מודלים
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    if (modalId === 'paymentModal') {
        currentPayment = null;
        isEditing = false;
        document.getElementById('paymentForm').reset();
    }
}

// אתחול
document.addEventListener('DOMContentLoaded', () => {
    loadData();

    // אירועי סינון
    document.getElementById('statusFilter').addEventListener('change', filterPayments);
    document.getElementById('studentFilter').addEventListener('change', filterPayments);
    document.getElementById('courseFilter').addEventListener('change', filterPayments);
    document.getElementById('startDate').addEventListener('change', filterPayments);
    document.getElementById('endDate').addEventListener('change', filterPayments);
    document.getElementById('searchPayment').addEventListener('input', filterPayments);

    // אירועי מודלים
    document.getElementById('addPaymentBtn').addEventListener('click', () => {
        currentPayment = null;
        document.getElementById('modalTitle').textContent = 'הוספת תשלום';
        document.getElementById('paymentForm').reset();
        openModal('paymentModal');
    });

    document.getElementById('paymentForm').addEventListener('submit', savePayment);

    // סגירת מודלים
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            closeModal(modal.id);
        });
    });

    // סגירת מודל בלחיצה מחוץ לתוכן
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal(modal.id);
            }
        });
    });
}); 