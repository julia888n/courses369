// משתנים גלובליים
let users = [];
let currentUser = null;
let isEditing = false;

// פונקציות עזר
function formatDate(date) {
    return new Date(date).toLocaleDateString('he-IL');
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function getUserTypeName(type) {
    switch (type) {
        case 'admin': return 'מנהל';
        case 'teacher': return 'מורה';
        case 'student': return 'תלמיד';
        default: return type;
    }
}

function getStatusClass(status) {
    return status === 'active' ? 'status-active' : 'status-inactive';
}

function getStatusText(status) {
    return status === 'active' ? 'פעיל' : 'לא פעיל';
}

function getRoleClass(role) {
    switch (role) {
        case 'admin': return 'role-admin';
        case 'teacher': return 'role-teacher';
        case 'student': return 'role-student';
        default: return '';
    }
}

function saveUsersToStorage() {
    localStorage.setItem('users', JSON.stringify(users));
}

function loadUsersFromStorage() {
    const data = localStorage.getItem('users');
    if (data) {
        users = JSON.parse(data);
    } else {
        users = [];
    }
}

function displayUsers(filteredUsers = users) {
    const tbody = document.querySelector('.users-table tbody');
    tbody.innerHTML = '';
    filteredUsers.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.fullName}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td><span class="role-badge ${getRoleClass(user.type)}">${getUserTypeName(user.type)}</span></td>
            <td><span class="status-badge ${getStatusClass(user.status)}">${getStatusText(user.status)}</span></td>
            <td>${formatDate(user.joinDate)}</td>
            <td>
                <button class="action-btn view-btn" data-id="${user.id}"><i class="fas fa-eye"></i></button>
                <button class="action-btn edit-btn" data-id="${user.id}"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete-btn" data-id="${user.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => viewUser(btn.dataset.id));
    });
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => editUser(btn.dataset.id));
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteUser(btn.dataset.id));
    });
}

function updateStats() {
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('totalTeachers').textContent = users.filter(u => u.type === 'teacher').length;
    document.getElementById('totalStudents').textContent = users.filter(u => u.type === 'student').length;
    document.getElementById('totalAdmins').textContent = users.filter(u => u.type === 'admin').length;
}

function filterUsers() {
    const typeFilter = document.getElementById('userType').value;
    const statusFilter = document.getElementById('userStatus').value;
    const searchQuery = document.getElementById('searchUser').value.toLowerCase();
    const filteredUsers = users.filter(user => {
        const matchesType = typeFilter === 'all' || user.type === typeFilter;
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        const matchesSearch = user.fullName.toLowerCase().includes(searchQuery) ||
            user.email.toLowerCase().includes(searchQuery) ||
            user.phone.includes(searchQuery);
        return matchesType && matchesStatus && matchesSearch;
    });
    displayUsers(filteredUsers);
}

function viewUser(userId) {
    const user = users.find(u => u.id === parseInt(userId));
    if (!user) return;
    document.getElementById('detailFullName').textContent = user.fullName;
    document.getElementById('detailEmail').textContent = user.email;
    document.getElementById('detailPhone').textContent = user.phone;
    document.getElementById('detailUserType').textContent = getUserTypeName(user.type);
    document.getElementById('detailStatus').textContent = getStatusText(user.status);
    document.getElementById('detailJoinDate').textContent = formatDate(user.joinDate);
    showModal('user-details-modal');
}

function editUser(userId) {
    const user = users.find(u => u.id === parseInt(userId));
    if (!user) return;
    currentUser = user;
    isEditing = true;
    document.getElementById('fullName').value = user.fullName;
    document.getElementById('email').value = user.email;
    document.getElementById('phone').value = user.phone;
    document.getElementById('userTypeSelect').value = user.type;
    document.getElementById('userStatusSelect').value = user.status;
    document.getElementById('password').value = '';
    document.getElementById('confirmPassword').value = '';
    document.getElementById('modalTitle').textContent = 'עריכת משתמש';
    showModal('userModal');
}

function deleteUser(userId) {
    if (!confirm('האם אתה בטוח שברצונך למחוק משתמש זה?')) return;
    users = users.filter(u => u.id !== parseInt(userId));
    saveUsersToStorage();
    displayUsers();
    updateStats();
    showNotification('המשתמש נמחק בהצלחה');
}

function saveUser(event) {
    event.preventDefault();
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const type = document.getElementById('userTypeSelect').value;
    const status = document.getElementById('userStatusSelect').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    if (!isEditing && password !== confirmPassword) {
        showNotification('הסיסמאות אינן תואמות', 'error');
        return;
    }
    let userData = {
        id: isEditing && currentUser ? currentUser.id : Date.now(),
        fullName,
        email,
        phone,
        type,
        status,
        joinDate: isEditing && currentUser ? currentUser.joinDate : new Date().toISOString().split('T')[0],
        password
    };
    if (isEditing && currentUser) {
        const index = users.findIndex(u => u.id === currentUser.id);
        users[index] = userData;
        showNotification('המשתמש עודכן בהצלחה');
    } else {
        users.push(userData);
        showNotification('המשתמש נוסף בהצלחה');
    }
    saveUsersToStorage();
    displayUsers();
    updateStats();
    hideModal('userModal');
    document.getElementById('userForm').reset();
    currentUser = null;
    isEditing = false;
}

function showModal(modalId) {
    const modal = typeof modalId === 'string' ? document.getElementById(modalId) : modalId;
    if (modal) modal.style.display = 'block';
}

function hideModal(modalId) {
    const modal = typeof modalId === 'string' ? document.getElementById(modalId) : modalId;
    if (modal) modal.style.display = 'none';
}

// אתחול

document.addEventListener('DOMContentLoaded', () => {
    loadUsersFromStorage();
    displayUsers();
    updateStats();
    // אירועי סינון
    document.getElementById('userType').addEventListener('change', filterUsers);
    document.getElementById('userStatus').addEventListener('change', filterUsers);
    document.getElementById('searchUser').addEventListener('input', filterUsers);
    // אירועי מודל משתמש
    document.getElementById('addUserBtn').addEventListener('click', () => {
        isEditing = false;
        document.getElementById('modalTitle').textContent = 'הוספת משתמש';
        document.getElementById('userForm').reset();
        showModal('userModal');
    });
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            hideModal(btn.closest('.modal'));
        });
    });
    document.getElementById('userForm').addEventListener('submit', saveUser);
    document.querySelectorAll('.btn.btn-secondary').forEach(btn => {
        if (btn.textContent.includes('ביטול')) {
            btn.addEventListener('click', () => hideModal('userModal'));
        }
    });
}); 