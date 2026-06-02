console.log("attendance.js loaded");

const db = firebase.database();
const auth = firebase.auth();

function logout() {
    auth.signOut().then(() => window.location = "login.html");
}

const tableBody = document.getElementById("attendanceTable");
const dateSelect = document.getElementById("dateSelect");

// STEP 1 — Load all dates into dropdown
db.ref("attendance").once("value").then(snapshot => {
    if (!snapshot.exists()) return;

    snapshot.forEach(dateSnap => {
        let date = dateSnap.key;
        let option = document.createElement("option");
        option.value = date;
        option.textContent = date;
        dateSelect.appendChild(option);
    });
});

// STEP 2 — When user selects a date, load attendance
function loadAttendanceByDate() {
    const selectedDate = dateSelect.value;

    tableBody.innerHTML = "";

    if (!selectedDate) return;

    db.ref("attendance/" + selectedDate).once("value").then(snapshot => {
        if (!snapshot.exists()) return;

        const dayData = snapshot.val();

        Object.keys(dayData).forEach(studentName => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${studentName}</td>
                <td>${dayData[studentName] ? "Present" : "Absent"}</td>
            `;

            tableBody.appendChild(tr);
        });
    });
}
