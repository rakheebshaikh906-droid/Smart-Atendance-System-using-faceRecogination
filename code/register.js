console.log("register.js loaded");

const db = firebase.database();

function registerStudent() {
    const name = document.getElementById("studentName").value.trim();
    const roll = document.getElementById("studentRoll").value.trim();
    const year = document.getElementById("studentYear").value;
    const branch = document.getElementById("studentBranch").value;
    const photoInput = document.getElementById("photoInput");
    const previewImg = document.getElementById("previewImg");

    if (!name) return alert("Please enter student name");
    if (!roll) return alert("Please enter roll number");
    if (!photoInput.files[0]) return alert("Please upload a photo");

    const file = photoInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const base64 = e.target.result; // Base64 photo

        const studentId = name.replace(/\s+/g, "_").toLowerCase();

        db.ref("students/" + studentId).set({
            name: name,
            roll: roll,
            year: year,
            branch: branch,
            images: [base64]
        }).then(() => {
            alert("Student Registered Successfully!");
            window.location.href = "index.html";
        });
    };

    reader.readAsDataURL(file);
}

// Preview image
document.getElementById("photoInput").addEventListener("change", function() {
    const file = this.files[0];
    if (!file) return;

    const img = document.getElementById("previewImg");
    img.src = URL.createObjectURL(file);
    img.style.display = "block";
});
