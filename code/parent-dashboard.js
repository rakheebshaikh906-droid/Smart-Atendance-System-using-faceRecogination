console.log("parent-dashboard.js loaded");

const db = firebase.database();

// Get student saved during login
let student = localStorage.getItem("parentStudent");

// Show child name
document.getElementById("childName").innerText = student;


// Load full attendance + table
function loadAttendance() {

    db.ref("attendance").once("value").then(snapshot => {

        let present = 0;
        let absent = 0;
        let total = 0;

        let table = document.getElementById("attendanceTable");
        table.innerHTML = ""; // Clear previous rows

        snapshot.forEach(day => {
            let date = day.key;
            let attendance = day.val();

            total++;

            let isPresent = attendance[student] ? true : false;

            if (isPresent) present++;
            else absent++;

            // Add row to table
            let tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${date}</td>
                <td style="color:${isPresent ? 'green' : 'red'}; font-weight:bold;">
                    ${isPresent ? 'Present' : 'Absent'}
                </td>
            `;
            table.appendChild(tr);
        });

        // Update counters
        document.getElementById("presentCount").innerText = present;
        document.getElementById("absentCount").innerText = absent;

        let percent = total > 0 ? ((present / total) * 100).toFixed(2) : 0;
        document.getElementById("percent").innerText = percent + "%";
    });
}
