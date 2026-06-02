console.log("dashboard.js loaded");

const db = firebase.database();
let chart = null;

// Load students into dropdown
window.onload = function () {
    const dropdown = document.getElementById("studentSelect");

    db.ref("students").once("value").then(snapshot => {
        snapshot.forEach(stu => {
            let name = stu.key;

            let opt = document.createElement("option");
            opt.value = name;
            opt.textContent = name;
            dropdown.appendChild(opt);
        });
    });
};

// Load attendance for selected date range
function loadRangeAttendance() {
    const start = document.getElementById("startDate").value;
    const end = document.getElementById("endDate").value;
    const selectedStudent = document.getElementById("studentSelect").value;

    if (!start || !end) {
        alert("Please select both start and end dates");
        return;
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    db.ref("attendance").once("value").then(snapshot => {
        if (!snapshot.exists()) return;

        let present = 0;
        let absent = 0;
        let labels = [];
        let values = [];

        snapshot.forEach(entry => {
            const dateKey = entry.key;
            const dayData = entry.val();
            const entryDate = new Date(dateKey);

            // only include dates inside range
            if (entryDate >= startDate && entryDate <= endDate) {

                if (selectedStudent) {
                    labels.push(dateKey);

                    let isPresent = dayData[selectedStudent] ? 1 : 0;
                    values.push(isPresent);

                    if (isPresent) present++;
                    else absent++;
                } 
                else {
                    // All students
                    db.ref("students").once("value").then(stSnap => {
                        stSnap.forEach(stu => {
                            let name = stu.key;

                            labels.push(dateKey + " - " + name);
                            let isPresent = dayData[name] ? 1 : 0;
                            values.push(isPresent);

                            if (isPresent) present++;
                            else absent++;
                        });

                        updateStats(present, absent);
                        drawLineGraph(labels, values);
                    });
                }
            }
        });

        // If only one student is chosen
        if (selectedStudent) {
            updateStats(present, absent);
            drawLineGraph(labels, values);
        }
    });
}

function updateStats(present, absent) {
    document.getElementById("presentCount").innerText = present;
    document.getElementById("absentCount").innerText = absent;

    let percent = ((present / (present + absent)) * 100).toFixed(2);
    document.getElementById("percentage").innerText = percent + "%";
}

// LINE GRAPH FUNCTION
function drawLineGraph(labels, data) {
    if (chart) chart.destroy();

    let ctx = document.getElementById("studentChart").getContext("2d");

    chart = new Chart(ctx, {
        type: "line",   // LINE GRAPH HERE
        data: {
            labels: labels,
            datasets: [{
                label: "1 = Present, 0 = Absent",
                data: data,
                borderWidth: 3,
                fill: false,
                tension: 0.3   // Smooth line
            }]
        }
    });
}

function logout() {
    firebase.auth().signOut().then(() => window.location = "login.html");
}
