// --------------------------------------------------
// SHOW MESSAGE BOX
// --------------------------------------------------
function showMessage(text, type = "error") {
  const box = document.getElementById("messageBox");
  box.style.display = "block";

  if (type === "error") {
    box.style.background = "#ffdddd";
    box.style.border = "2px solid red";
    box.style.color = "red";
  } else {
    box.style.background = "#ddffdd";
    box.style.border = "2px solid green";
    box.style.color = "green";
  }

  box.innerHTML = text;
}

function clearMessage() {
  document.getElementById("messageBox").style.display = "none";
}

// --------------------------------------------------
// FIREBASE INITIALIZATION
// --------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyAKk0ZMDOzjlK0y5B9vKRI4H99z8kR2m9I",
  authDomain: "smart-attendance-system-29984.firebaseapp.com",
  databaseURL: "https://smart-attendance-system-29984-default-rtdb.firebaseio.com",
  projectId: "smart-attendance-system-29984",
  storageBucket: "smart-attendance-system-29984.firebasestorage.app",
  messagingSenderId: "576562417490",
  appId: "1:576562417490:web:4a560edf0254d195e6348b",
  measurementId: "G-HK9N3D50X4"
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const db = firebase.database();

// --------------------------------------------------
// UPLOAD CROPPED FACE TO FIREBASE STORAGE
// --------------------------------------------------
async function uploadCroppedFace(studentName, fileBlob) {
  const ref = db.ref("students/" + studentName.toLowerCase());
  const snap = await ref.once("value");
  const data = snap.val();

  let count = data.photosCount || 0;
  let newCount = count + 1;

  const filePath = `${studentName}/${newCount}.png`;
  const uploadTask = await storage.ref(filePath).put(fileBlob);
  const downloadURL = await uploadTask.ref.getDownloadURL();

  await ref.update({
    photosCount: newCount,
    [`photos/${newCount}`]: downloadURL
  });

  return downloadURL;
}

// --------------------------------------------------
// LOAD AI MODELS
// --------------------------------------------------
Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromUri("models/"),
  faceapi.nets.faceLandmark68Net.loadFromUri("models/"),
  faceapi.nets.faceRecognitionNet.loadFromUri("models/")
]).then(() => console.log("✔ Models Loaded"));


// --------------------------------------------------
// IMAGE UPLOAD HANDLER
// --------------------------------------------------
document.getElementById("upload").addEventListener("change", async function () {
  clearMessage();

  const file = this.files[0];
  const img = await faceapi.bufferToImage(file);

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  const detections = await faceapi
    .detectAllFaces(img)
    .withFaceLandmarks();

  if (detections.length === 0)
    return showMessage("❌ No face detected", "error");

  if (detections.length > 1)
    return showMessage("❌ Multiple faces detected", "error");

  const box = detections[0].detection.box;

  if (box.width < img.width * 0.2)
    return showMessage("❌ Face too small", "error");

  const blur = detectBlur(canvas);
  if (blur < 80)
    return showMessage(`❌ Too blurry (Score: ${blur.toFixed(1)})`, "error");

  const bright = detectBrightness(canvas);
  if (bright < 60)
    return showMessage("❌ Too dark", "error");
  if (bright > 200)
    return showMessage("❌ Too bright", "error");

  const center = img.width / 2;
  const faceCenter = box.x + box.width / 2;
  if (Math.abs(center - faceCenter) > img.width * 0.15)
    return showMessage("❌ Face not centered", "error");

  showMessage("✅ GOOD IMAGE! Ready to save.", "success");

  const cropCanvas = document.createElement("canvas");
  cropCanvas.width = box.width;
  cropCanvas.height = box.height;

  cropCanvas.getContext("2d").drawImage(
    img,
    box.x, box.y, box.width, box.height,
    0, 0, box.width, box.height
  );

  canvas.width = box.width;
  canvas.height = box.height;
  canvas.getContext("2d").drawImage(cropCanvas, 0, 0);

  document.getElementById("downloadBtn").style.display = "block";
  downloadBtn.onclick = async () => {
    const studentName = prompt("Enter student name:");
    if (!studentName) return;

    canvas.toBlob(async (blob) => {
      const url = await uploadCroppedFace(studentName, blob);
      showMessage(`✅ UPLOADED! URL saved:<br>${url}`, "success");
    });
  };
});

// --------------------------------------------------
// BLUR DETECTION
// --------------------------------------------------
function detectBlur(canvas) {
  const ctx = canvas.getContext("2d");
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  let gray = [];
  for (let i = 0; i < imgData.data.length; i += 4)
    gray.push((imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3);

  const laplace = [];
  for (let i = 1; i < gray.length - 1; i++)
    laplace.push(Math.abs(gray[i - 1] - 2 * gray[i] + gray[i + 1]));

  const mean = laplace.reduce((a, b) => a + b, 0) / laplace.length;
  const variance = laplace.reduce((a, b) => a + (b - mean) ** 2, 0) / laplace.length;

  return variance;
}

// --------------------------------------------------
// BRIGHTNESS DETECTION
// --------------------------------------------------
function detectBrightness(canvas) {
  const ctx = canvas.getContext("2d");
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let total = 0;

  for (let i = 0; i < imgData.data.length; i += 4)
    total += imgData.data[i];

  return total / (imgData.data.length / 4);
}
