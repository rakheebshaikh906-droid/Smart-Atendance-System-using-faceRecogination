console.log("script.js loaded");

// Firebase
const db = firebase.database();
const auth = firebase.auth();

// Logout Function
function logout() {
    auth.signOut().then(() => {
        localStorage.clear();
        window.location.href = "login.html";
    });
}

// DOM Elements
const photoInput = document.getElementById("photoInput");
const previewImg = document.getElementById("previewImg");
const overlayCanvas = document.getElementById("overlayCanvas");
const statusMsg = document.getElementById("statusMsg");
const presentList = document.getElementById("presentList");

// Prevent duplicate entries
let added = new Set();

// Load Face API Models
Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri("models/"),
    faceapi.nets.faceLandmark68Net.loadFromUri("models/"),
    faceapi.nets.faceRecognitionNet.loadFromUri("models/")
]).then(() => {
    console.log("Face API Loaded");
});

// Load Dataset from Firebase
async function loadDataset() {
    const snap = await db.ref("students").once("value");
    const data = snap.val();

    if (!data) {
        statusMsg.innerHTML = "❌ No registered students!";
        return [];
    }

    let final = [];

    for (let id in data) {
        const student = data[id];

        if (!student.images || student.images.length === 0) continue;

        let descriptors = [];

        for (let base64 of student.images) {
            const img = await faceapi.fetchImage(base64);

            const det = await faceapi
                .detectSingleFace(img)
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (det) descriptors.push(det.descriptor);
        }

        if (descriptors.length > 0) {
            final.push(new faceapi.LabeledFaceDescriptors(id, descriptors));
        }
    }

    return final;
}

// ==============================
//    PHOTO UPLOAD HANDLER
// ==============================

photoInput.addEventListener("change", async () => {
    const file = photoInput.files[0];
    if (!file) return;

    added.clear(); // Reset duplicate prevention
    presentList.innerHTML = "";
    statusMsg.innerHTML = "Analyzing image…";

    previewImg.src = URL.createObjectURL(file);
    previewImg.style.display = "block";

    previewImg.onload = async () => {
        const dataset = await loadDataset();
        if (dataset.length === 0) return;

        const matcher = new faceapi.FaceMatcher(dataset, 0.6);

        overlayCanvas.width = previewImg.width;
        overlayCanvas.height = previewImg.height;

        const detections = await faceapi
            .detectAllFaces(previewImg)
            .withFaceLandmarks()
            .withFaceDescriptors();

        const ctx = overlayCanvas.getContext("2d");
        ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

        // ⭐ FIX: INDIA TIME (Asia/Kolkata)
        const today = new Date().toLocaleDateString("en-CA", {
            timeZone: "Asia/Kolkata"
        });

        console.log("Saving attendance for:", today);

        for (let det of detections) {
            const best = matcher.findBestMatch(det.descriptor);
            const box = det.detection.box;

            // Draw box
            ctx.strokeStyle = "lime";
            ctx.lineWidth = 2;
            ctx.strokeRect(box.x, box.y, box.width, box.height);

            ctx.fillStyle = "yellow";
            ctx.font = "18px Arial";
            ctx.fillText(best.toString(), box.x, box.y - 5);

            if (best.label !== "unknown") {
                // Fetch student details (name, roll)
                const snap = await db.ref(`students/${best.label}`).once("value");
                const student = snap.val();

                // Prevent duplicates
                if (!added.has(student.roll)) {
                    added.add(student.roll);

                    // Add to UI list
                    const li = document.createElement("li");
                    li.textContent = `${student.name} — Roll No: ${student.roll}`;
                    presentList.appendChild(li);

                    // Save attendance in database
                    await db.ref(`attendance/${today}/${best.label}`).set(true);
                }
            }
        }

        statusMsg.innerHTML = "✅ Attendance Updated Successfully!";
    };
});
