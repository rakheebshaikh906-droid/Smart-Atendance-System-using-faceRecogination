console.log("login.js loaded");

// Switch UI tabs
function showTeacher() {
    document.getElementById("teacherForm").style.display = "block";
    document.getElementById("parentForm").style.display = "none";

    document.getElementById("teacherBtn").classList.add("active");
    document.getElementById("parentBtn").classList.remove("active");
}

function showParent() {
    document.getElementById("teacherForm").style.display = "none";
    document.getElementById("parentForm").style.display = "block";

    document.getElementById("teacherBtn").classList.remove("active");
    document.getElementById("parentBtn").classList.add("active");
}



// ----------------------------------------------------
//              TEACHER LOGIN  (uses "users")
// ----------------------------------------------------
function teacherLogin() {
    const email = document.getElementById("tEmail").value;
    const pass = document.getElementById("tPass").value;

    firebase.auth().signInWithEmailAndPassword(email, pass)
    .then(async (user) => {

        const uid = user.user.uid;

        // CHECK ROLE FROM USERS NODE
        const snap = await firebase.database().ref("users/" + uid).once("value");
        const data = snap.val();

        if (!data) {
            alert("This account is not registered as TEACHER!");
            firebase.auth().signOut();
            return;
        }

        if (data.role !== "teacher") {
            alert("❌ Parent accounts cannot login as TEACHER.");
            firebase.auth().signOut();
            return;
        }

        // SAVE ROLE LOCALLY
        localStorage.setItem("role", "teacher");

        // REDIRECT
        window.location.href = "index.html";
    })
    .catch(err => {
        alert("Login Error: " + err.message);
    });
}



// ----------------------------------------------------
//            PARENT LOGIN (uses "parents")
// ----------------------------------------------------
function parentLogin() {
    const email = document.getElementById("pEmail").value;
    const pass = document.getElementById("pPass").value;

    firebase.auth().signInWithEmailAndPassword(email, pass)
    .then(async (user) => {

        const uid = user.user.uid;

        // FETCH FROM PARENTS NODE
        const snap = await firebase.database().ref("parents/" + uid).once("value");
        const parentData = snap.val();

        if (!parentData) {
            alert("❌ This is not a parent account.");
            firebase.auth().signOut();
            return;
        }

        // PARENT MUST HAVE STUDENT NAME
        localStorage.setItem("role", "parent");
        localStorage.setItem("parentStudent", parentData.student);

        // REDIRECT TO PARENT DASHBOARD
        window.location.href = "parent-dashboard.html";
    })
    .catch(err => {
        alert("Login Error: " + err.message);
    });
}
