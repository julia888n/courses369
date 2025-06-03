// אתחול EmailJS
emailjs.init("YOUR_PUBLIC_KEY");

// תבניות מיילים
const emailTemplates = {
    welcome: {
        templateId: "welcome_email",
        subject: "ברוכים הבאים לקורסים לעסקים!"
    },
    purchaseConfirmation: {
        templateId: "purchase_confirmation",
        subject: "אישור רכישת קורס"
    },
    courseCompletion: {
        templateId: "course_completion",
        subject: "ברכות! השלמת קורס"
    },
    certificate: {
        templateId: "certificate_issued",
        subject: "תעודת סיום קורס"
    },
    reminder: {
        templateId: "course_reminder",
        subject: "תזכורת: המשך לימוד"
    }
};

// פונקציות שליחת מיילים
async function sendWelcomeEmail(user) {
    try {
        const templateParams = {
            to_name: user.name,
            to_email: user.email,
            company_name: "קורסים לעסקים"
        };

        await emailjs.send(
            "YOUR_SERVICE_ID",
            emailTemplates.welcome.templateId,
            templateParams
        );

        console.log("מייל ברוכים הבאים נשלח בהצלחה");
    } catch (error) {
        console.error("שגיאה בשליחת מייל ברוכים הבאים:", error);
        throw error;
    }
}

async function sendPurchaseConfirmation(user, course) {
    try {
        const templateParams = {
            to_name: user.name,
            to_email: user.email,
            course_name: course.title,
            course_price: course.price,
            purchase_date: new Date().toLocaleDateString('he-IL'),
            company_name: "קורסים לעסקים"
        };

        await emailjs.send(
            "YOUR_SERVICE_ID",
            emailTemplates.purchaseConfirmation.templateId,
            templateParams
        );

        console.log("מייל אישור רכישה נשלח בהצלחה");
    } catch (error) {
        console.error("שגיאה בשליחת מייל אישור רכישה:", error);
        throw error;
    }
}

async function sendCourseCompletionEmail(user, course) {
    try {
        const templateParams = {
            to_name: user.name,
            to_email: user.email,
            course_name: course.title,
            completion_date: new Date().toLocaleDateString('he-IL'),
            company_name: "קורסים לעסקים"
        };

        await emailjs.send(
            "YOUR_SERVICE_ID",
            emailTemplates.courseCompletion.templateId,
            templateParams
        );

        console.log("מייל השלמת קורס נשלח בהצלחה");
    } catch (error) {
        console.error("שגיאה בשליחת מייל השלמת קורס:", error);
        throw error;
    }
}

async function sendCertificateEmail(user, certificate) {
    try {
        const templateParams = {
            to_name: user.name,
            to_email: user.email,
            course_name: certificate.courseTitle,
            certificate_number: certificate.certificateNumber,
            issue_date: new Date(certificate.issueDate).toLocaleDateString('he-IL'),
            company_name: "קורסים לעסקים"
        };

        await emailjs.send(
            "YOUR_SERVICE_ID",
            emailTemplates.certificate.templateId,
            templateParams
        );

        console.log("מייל תעודה נשלח בהצלחה");
    } catch (error) {
        console.error("שגיאה בשליחת מייל תעודה:", error);
        throw error;
    }
}

async function sendReminderEmail(user, course) {
    try {
        const templateParams = {
            to_name: user.name,
            to_email: user.email,
            course_name: course.title,
            progress: course.progress,
            company_name: "קורסים לעסקים"
        };

        await emailjs.send(
            "YOUR_SERVICE_ID",
            emailTemplates.reminder.templateId,
            templateParams
        );

        console.log("מייל תזכורת נשלח בהצלחה");
    } catch (error) {
        console.error("שגיאה בשליחת מייל תזכורת:", error);
        throw error;
    }
}

// ייצוא הפונקציות
export {
    sendWelcomeEmail,
    sendPurchaseConfirmation,
    sendCourseCompletionEmail,
    sendCertificateEmail,
    sendReminderEmail
}; 