console.log("role-check.js loaded");

// DO NOT declare auth again (it already exists in script.js)

firebase.auth().onAuthStateChanged(user => {

    if (!user) {
        console.log("No user logged in, skipping role check.");
        return;
    }

    let role = localStorage.getItem("role");

    if (!role) {
        console.log("Role not found in localStorage.");
        return;
    }

    const page = window.location.pathname;

    // Parent-only page
    if (page.includes("parent-dashboard")) {
        if (role !== "parent") {
            window.location.href = "login.html";
        }
    }

    // Teacher-only pages
    if (page.includes("index") || 
        page.includes("dashboard") || 
        page.includes("attendance") || 
        page.includes("register") ||
        page.includes("parent-register")) 
    {
        if (role !== "teacher") {
            window.location.href = "login.html";
        }
    }

});
