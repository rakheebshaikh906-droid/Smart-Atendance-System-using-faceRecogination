console.log("parent-register.js loaded");

const db = firebase.database();
const auth = firebase.auth();

// Load students into dropdown from /students
window.onload = function () {
    const studentSelect = document.getElementById("studentSelect");

    db.ref("students").once("value").then(snapshot => {
        if (!snapshot.exists()) return;

        snapshot.forEach(stu => {
            // Key is student name in your DB
            let studentKey = stu.key;

            let opt = document.createElement("option");
            opt.value = studentKey;
            opt.textContent = studentKey;
            studentSelect.appendChild(opt);
        });
    });
};

function registerParent() {
    const studentName = document.getElementById("studentSelect").value;
    const parentName = document.getElementById("parentName").value.trim();
    const parentEmail = document.getElementById("parentEmail").value.trim();
    const parentPhone = document.getElementById("parentPhone").value.trim();
    const parentPassword = document.getElementById("parentPassword").value.trim();

    if (!studentName || !parentName || !parentEmail || !parentPassword) {
        alert("Please fill all required fields and select a student.");
        return;
    }

    // Create Auth account for parent
    auth.createUserWithEmailAndPassword(parentEmail, parentPassword)
        .then(cred => {
            const parentUID = cred.user.uid;

            // Save mapping in /parents
            return db.ref("parents/" + parentUID).set({
                student: studentName,
                parent: parentName,
                email: parentEmail,
                phone: parentPhone
            });
        })
        .then(() => {
            alert("Parent registered successfully! Share email & password with parent.");
        })
        .catch(err => {
            alert("Error: " + err.message);
        });
}

