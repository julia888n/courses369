// משתנים גלובליים
let chart = null;
let reportData = {
    income: [],
    students: [],
    courses: [],
    teachers: []
};

// פונקציות עזר
function formatDate(date) {
    return new Date(date).toLocaleDateString('he-IL');
}

function formatPrice(price) {
    return new Intl.NumberFormat('he-IL', {
        style: 'currency',
        currency: 'ILS'
    }).format(price);
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// טעינת נתונים
async function loadData() {
    try {
        // כאן יהיה קריאה לשרת
        // בינתיים נשתמש בנתונים לדוגמה
        reportData = {
            income: [
                { date: '2024-01-01', amount: 2500, count: 1 },
                { date: '2024-01-15', amount: 3000, count: 1 },
                { date: '2024-02-01', amount: 3500, count: 1 },
                { date: '2024-02-15', amount: 4000, count: 1 }
            ],
            students: [
                { date: '2024-01-01', count: 5, active: 4 },
                { date: '2024-01-15', count: 8, active: 6 },
                { date: '2024-02-01', count: 12, active: 10 },
                { date: '2024-02-15', count: 15, active: 12 }
            ],
            courses: [
                { date: '2024-01-01', count: 3, active: 2 },
                { date: '2024-01-15', count: 4, active: 3 },
                { date: '2024-02-01', count: 5, active: 4 },
                { date: '2024-02-15', count: 6, active: 5 }
            ],
            teachers: [
                { date: '2024-01-01', count: 2, active: 2 },
                { date: '2024-01-15', count: 3, active: 2 },
                { date: '2024-02-01', count: 3, active: 3 },
                { date: '2024-02-15', count: 4, active: 3 }
            ]
        };

        generateReport();
    } catch (error) {
        console.error('שגיאה בטעינת הנתונים:', error);
        showNotification('אירעה שגיאה בטעינת הנתונים', 'error');
    }
}

// יצירת דוח
function generateReport() {
    try {
        const reportType = document.getElementById('reportType').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const groupBy = document.getElementById('groupBy').value;

        // בדיקת תקינות תאריכים
        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            showNotification('תאריך ההתחלה חייב להיות לפני תאריך הסיום', 'error');
            return;
        }

        // סינון נתונים לפי טווח תאריכים
        let filteredData = reportData[reportType].filter(item => {
            if (!startDate && !endDate) return true;
            const itemDate = new Date(item.date);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;
            return (!start || itemDate >= start) && (!end || itemDate <= end);
        });

        if (filteredData.length === 0) {
            showNotification('לא נמצאו נתונים בטווח התאריכים שנבחר', 'warning');
            return;
        }

        // קיבוץ נתונים
        filteredData = groupData(filteredData, groupBy);

        // עדכון כותרת הדוח
        document.getElementById('reportTitle').textContent = getReportTitle(reportType);

        // עדכון סיכום
        updateSummary(filteredData, reportType);

        // יצירת גרף
        createChart(filteredData, reportType);

        // עדכון טבלה
        updateTable(filteredData, reportType);

        showNotification('הדוח נוצר בהצלחה');
    } catch (error) {
        console.error('שגיאה ביצירת הדוח:', error);
        showNotification('אירעה שגיאה ביצירת הדוח', 'error');
    }
}

// קיבוץ נתונים
function groupData(data, groupBy) {
    const grouped = {};
    
    data.forEach(item => {
        const date = new Date(item.date);
        let key;
        
        switch (groupBy) {
            case 'day':
                key = item.date;
                break;
            case 'week':
                const weekStart = new Date(date);
                weekStart.setDate(date.getDate() - date.getDay());
                key = weekStart.toISOString().split('T')[0];
                break;
            case 'month':
                key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                break;
            case 'year':
                key = date.getFullYear().toString();
                break;
        }

        if (!grouped[key]) {
            grouped[key] = {
                date: key,
                amount: 0,
                count: 0,
                active: 0
            };
        }

        grouped[key].amount += item.amount || 0;
        grouped[key].count += item.count || 0;
        grouped[key].active += item.active || 0;
    });

    return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));
}

// יצירת גרף
function createChart(data, reportType) {
    const ctx = document.getElementById('reportChart').getContext('2d');
    
    if (chart) {
        chart.destroy();
    }

    const labels = data.map(item => formatDate(item.date));
    const datasets = getChartDatasets(data, reportType);

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: getChartTitle(reportType)
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// קבלת נתוני גרף
function getChartDatasets(data, reportType) {
    switch (reportType) {
        case 'income':
            return [{
                label: 'הכנסות',
                data: data.map(item => item.amount),
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                fill: true
            }];
        case 'students':
            return [
                {
                    label: 'סה"כ תלמידים',
                    data: data.map(item => item.count),
                    borderColor: '#2196F3',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    fill: true
                },
                {
                    label: 'תלמידים פעילים',
                    data: data.map(item => item.active),
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    fill: true
                }
            ];
        case 'courses':
            return [
                {
                    label: 'סה"כ קורסים',
                    data: data.map(item => item.count),
                    borderColor: '#2196F3',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    fill: true
                },
                {
                    label: 'קורסים פעילים',
                    data: data.map(item => item.active),
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    fill: true
                }
            ];
        case 'teachers':
            return [
                {
                    label: 'סה"כ מורים',
                    data: data.map(item => item.count),
                    borderColor: '#2196F3',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    fill: true
                },
                {
                    label: 'מורים פעילים',
                    data: data.map(item => item.active),
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    fill: true
                }
            ];
    }
}

// עדכון סיכום
function updateSummary(data, reportType) {
    const total = data.reduce((sum, item) => sum + (item.amount || item.count), 0);
    const average = total / data.length;
    const max = Math.max(...data.map(item => item.amount || item.count));

    document.getElementById('totalAmount').textContent = reportType === 'income' ? formatPrice(total) : total;
    document.getElementById('averageAmount').textContent = reportType === 'income' ? formatPrice(average) : Math.round(average);
    document.getElementById('maxAmount').textContent = reportType === 'income' ? formatPrice(max) : max;
}

// עדכון טבלה
function updateTable(data, reportType) {
    const header = document.getElementById('reportTableHeader');
    const body = document.getElementById('reportTableBody');

    // עדכון כותרות
    header.innerHTML = `
        <th>תאריך</th>
        ${getTableHeaders(reportType)}
    `;

    // עדכון נתונים
    body.innerHTML = data.map(item => `
        <tr>
            <td>${formatDate(item.date)}</td>
            ${getTableCells(item, reportType)}
        </tr>
    `).join('');
}

// קבלת כותרות טבלה
function getTableHeaders(reportType) {
    switch (reportType) {
        case 'income':
            return `
                <th>סכום</th>
                <th>מספר תשלומים</th>
            `;
        case 'students':
        case 'courses':
        case 'teachers':
            return `
                <th>סה"כ</th>
                <th>פעילים</th>
            `;
    }
}

// קבלת תאי טבלה
function getTableCells(item, reportType) {
    switch (reportType) {
        case 'income':
            return `
                <td>${formatPrice(item.amount)}</td>
                <td>${item.count}</td>
            `;
        case 'students':
        case 'courses':
        case 'teachers':
            return `
                <td>${item.count}</td>
                <td>${item.active}</td>
            `;
    }
}

// קבלת כותרת דוח
function getReportTitle(reportType) {
    switch (reportType) {
        case 'income':
            return 'דוח הכנסות';
        case 'students':
            return 'דוח תלמידים';
        case 'courses':
            return 'דוח קורסים';
        case 'teachers':
            return 'דוח מורים';
    }
}

// קבלת כותרת גרף
function getChartTitle(reportType) {
    switch (reportType) {
        case 'income':
            return 'הכנסות לאורך זמן';
        case 'students':
            return 'מספר תלמידים לאורך זמן';
        case 'courses':
            return 'מספר קורסים לאורך זמן';
        case 'teachers':
            return 'מספר מורים לאורך זמן';
    }
}

// ייצוא דוח
function exportReport() {
    const reportType = document.getElementById('reportType').value;
    const data = reportData[reportType];
    
    // המרה ל-CSV
    const headers = ['תאריך', ...getTableHeaders(reportType).split('</th><th>').map(h => h.replace('<th>', '').replace('</th>', ''))];
    const rows = data.map(item => [
        formatDate(item.date),
        ...getTableCells(item, reportType).split('</td><td>').map(c => c.replace('<td>', '').replace('</td>', ''))
    ]);
    
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');
    
    // יצירת קובץ להורדה
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${getReportTitle(reportType)}.csv`;
    link.click();
}

// אתחול
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    
    // הוספת מאזין לכפתור יצירת דוח
    const generateReportBtn = document.getElementById('generateReportBtn');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', () => {
            generateReport();
            showNotification('הדוח נוצר בהצלחה');
        });
    }

    // הוספת מאזינים לשינויים בפילטרים
    document.getElementById('reportType').addEventListener('change', generateReport);
    document.getElementById('groupBy').addEventListener('change', generateReport);

    // אירוע ייצוא
    document.getElementById('exportReportBtn').addEventListener('click', exportReport);
}); 