// הגבלת גישה למנהלים בלבד
if (localStorage.getItem('userRole') !== 'admin') {
    window.location.href = 'login.html';
}

// משתנים גלובליים
let users = [];
let currentUser = null;
let isEditing = false;

// פונקציות עזר
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('he-IL', options);
}

function getStatusClass(status) {
    switch (status) {
        case 'active':
            return 'status-active';
        case 'inactive':
            return 'status-inactive';
        case 'blocked':
            return 'status-blocked';
        default:
            return '';
    }
}

function getRoleName(role) {
    switch (role) {
        case 'student':
            return 'תלמיד';
        case 'instructor':
            return 'מרצה';
        case 'admin':
            return 'מנהל';
        default:
            return role;
    }
}

// פונקציות ניהול משתמשים
function loadUsers() {
    const usersData = localStorage.getItem('users');
    if (usersData) {
        users = JSON.parse(usersData);
    } else {
        users = [
            {
                id: 1,
                fullName: 'ישראל ישראלי',
                email: 'israel@example.com',
                password: 'student123',
                role: 'student',
                status: 'active',
                joinDate: '2024-01-01'
            },
            {
                id: 2,
                fullName: 'שרה כהן',
                email: 'sarah@example.com',
                password: 'instructor123',
                role: 'instructor',
                status: 'active',
                joinDate: '2024-01-15'
            },
            {
                id: 3,
                fullName: 'דוד לוי',
                email: 'david@example.com',
                password: 'admin123',
                role: 'admin',
                status: 'active',
                joinDate: '2024-02-01'
            }
        ];
        localStorage.setItem('users', JSON.stringify(users));
    }
    displayUsers();
}

function saveUsersToStorage() {
    localStorage.setItem('users', JSON.stringify(users));
}

function displayUsers(filteredUsers = null) {
    const tableBody = document.getElementById('usersTableBody');
    const usersToDisplay = filteredUsers || users;

    tableBody.innerHTML = '';

    usersToDisplay.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.fullName}</td>
            <td>${user.email}</td>
            <td>${getRoleName(user.role)}</td>
            <td><span class="status-badge ${getStatusClass(user.status)}">${user.status}</span></td>
            <td>${formatDate(user.joinDate)}</td>
            <td>
                <button class="btn btn-secondary edit-user" data-id="${user.id}">עריכה</button>
                <button class="btn btn-danger delete-user" data-id="${user.id}">מחיקה</button>
            </td>
        `;

        // הוספת מאזיני אירועים
        row.querySelector('.edit-user').addEventListener('click', () => editUser(user.id));
        row.querySelector('.delete-user').addEventListener('click', () => deleteUser(user.id));

        tableBody.appendChild(row);
    });
}

function filterUsers() {
    const roleFilter = document.getElementById('roleFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const searchInput = document.getElementById('searchInput').value.toLowerCase();

    const filteredUsers = users.filter(user => {
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        const matchesSearch = !searchInput || 
            user.fullName.toLowerCase().includes(searchInput) ||
            user.email.toLowerCase().includes(searchInput);

        return matchesRole && matchesStatus && matchesSearch;
    });

    displayUsers(filteredUsers);
}

// פונקציות מודל
function showModal(title) {
    const modal = document.getElementById('userModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('userForm');

    modalTitle.textContent = title;
    form.reset();
    modal.style.display = 'block';
    // אם עריכה, מלא את שדה הסיסמה
    if (isEditing && currentUser) {
        document.getElementById('password').value = currentUser.password || '';
    } else {
        document.getElementById('password').value = '';
    }
}

function hideModal() {
    const modal = document.getElementById('userModal');
    modal.style.display = 'none';
    currentUser = null;
    isEditing = false;
}

function editUser(userId) {
    currentUser = users.find(u => u.id === userId);
    if (!currentUser) return;

    isEditing = true;
    showModal('עריכת משתמש');

    // מילוי הטופס
    document.getElementById('fullName').value = currentUser.fullName;
    document.getElementById('email').value = currentUser.email;
    document.getElementById('role').value = currentUser.role;
    document.getElementById('status').value = currentUser.status;
    document.getElementById('password').value = currentUser.password || '';
}

function deleteUser(userId) {
    if (!confirm('האם אתה בטוח שברצונך למחוק משתמש זה?')) return;

    users = users.filter(u => u.id !== userId);
    saveUsersToStorage();
    displayUsers();
}

// פונקציות ייצוא וייבוא
function exportToExcel() {
    alert('ייצוא ל-Excel יושק בקרוב');
}

function importFromExcel() {
    alert('ייבוא מ-Excel יושק בקרוב');
}

// אתחול
// הוספת שדה סיסמה למודל
function addPasswordFieldToModal() {
    const passwordGroup = document.createElement('div');
    passwordGroup.className = 'form-group';
    passwordGroup.innerHTML = `
        <label for="password">סיסמה</label>
        <input type="password" id="password" required>
    `;
    const form = document.getElementById('userForm');
    const statusGroup = document.getElementById('status').parentElement;
    form.insertBefore(passwordGroup, statusGroup);
}

document.addEventListener('DOMContentLoaded', () => {
    // הוספת שדה סיסמה אם לא קיים
    if (!document.getElementById('password')) {
        addPasswordFieldToModal();
    }
    loadUsers();

    document.getElementById('addUserBtn').addEventListener('click', () => {
        isEditing = false;
        showModal('הוספת משתמש חדש');
    });

    document.getElementById('exportBtn').addEventListener('click', exportToExcel);
    document.getElementById('importBtn').addEventListener('click', importFromExcel);

    document.getElementById('roleFilter').addEventListener('change', filterUsers);
    document.getElementById('statusFilter').addEventListener('change', filterUsers);
    document.getElementById('searchInput').addEventListener('input', filterUsers);

    document.getElementById('userForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const userType = document.getElementById('userTypeSelect').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const status = document.getElementById('userStatusSelect').value;

        if (password !== confirmPassword) {
            alert('הסיסמאות אינן תואמות');
            return;
        }

        const userData = {
            id: isEditing && currentUser ? currentUser.id : Date.now(),
            fullName,
            email,
            phone,
            role: userType,
            password,
            status,
            joinDate: isEditing && currentUser ? currentUser.joinDate : new Date().toISOString().split('T')[0]
        };

        if (isEditing && currentUser) {
            const index = users.findIndex(u => u.id === currentUser.id);
            users[index] = userData;
        } else {
            users.push(userData);
        }

        saveUsersToStorage();
        displayUsers();
        hideModal();
    });

    document.getElementById('cancelBtn').addEventListener('click', hideModal);
    document.querySelector('.close-btn').addEventListener('click', hideModal);
}); 