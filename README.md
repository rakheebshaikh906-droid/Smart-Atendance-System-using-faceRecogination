# attandance-cam# Smart Attendance System Using Face Recognition

## Overview

The Smart Attendance System Using Face Recognition is a web-based application that automates attendance marking by identifying students from a classroom group photograph. The system uses Face Recognition technology to detect and recognize registered students and automatically stores attendance records in Firebase Realtime Database.

The project also includes a Parent Monitoring Module that allows parents to view attendance records and monitor student attendance performance.

---

## Features

### Student Management

* Student Registration
* Roll Number Management
* Branch and Academic Information
* Student Face Data Storage

### Face Recognition Attendance

* Upload Classroom Group Photo
* Automatic Face Detection
* Student Face Recognition
* Automatic Attendance Marking
* Present Student Identification

### Attendance Management

* Date-wise Attendance Records
* Attendance Tracking
* Attendance History
* Automatic Database Updates

### Parent Module

* Parent Registration
* Parent Login
* Attendance Monitoring
* Attendance Percentage Tracking

### Dashboard

* Student Information Display
* Attendance Statistics
* Attendance Summary

---

## Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript

### Face Recognition

* Face API.js

### Database & Authentication

* Firebase Realtime Database
* Firebase Authentication

---

## Project Structure

```text
Smart-Attendance-System/
│
├── index.html
├── attendance.html
├── dashboard.html
├── register.html
├── login.html
├── parent-register.html
├── parent-login.html
├── parent-dashboard.html
│
├── script.js
├── attendance.js
├── dashboard.js
├── register.js
├── login.js
├── role-check.js
│
├── models/
│
└── README.md
```

---

## Working Procedure

### Step 1: Student Registration

Students are registered by entering:

* Name
* Roll Number
* Branch
* Academic Year
* Student Photograph

### Step 2: Group Photo Upload

The teacher uploads a classroom group photograph containing registered students.

### Step 3: Face Detection and Recognition

The system:

* Detects faces from the uploaded image
* Compares detected faces with registered student faces
* Identifies matching students

### Step 4: Attendance Marking

Attendance is automatically recorded and stored in Firebase Realtime Database.

### Step 5: Attendance Monitoring

Teachers and parents can view attendance information through the dashboard.

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/smart-attendance-system.git
```

### 2. Open the Project

Open the project folder using Visual Studio Code.

### 3. Configure Firebase

* Create a Firebase Project
* Enable Firebase Authentication
* Enable Realtime Database
* Add Firebase Configuration
* Configure Database Rules

### 4. Run the Project

Use VS Code Live Server to run the application.

---

## Advantages

* Eliminates Manual Attendance
* Saves Time
* Improves Attendance Accuracy
* Cloud-Based Storage
* Easy to Use
* Parent Monitoring Facility

---

## Future Enhancements

* Excel Report Generation
* Attendance Analytics
* Email Notifications
* Mobile Application Support
* Multi-Class Management
* Enhanced Recognition Accuracy

---

## Author

**Rakheeb Shaikh**

B.Tech Student
Electronics and Computer Engineering

---

## License

This project is developed for educational and academic purposes.
