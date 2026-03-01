// ===============================
// 🔥 FIREBASE IMPORTS
// ===============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
    getFirestore,
    collection,
    addDoc,
    query,
    where,
    getDocs,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// ===============================
// 🔥 FIREBASE CONFIG (PUT REAL KEYS)
// ===============================
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    appId: "YOUR_APP_ID"
};

// ===============================
// 🔥 FIREBASE INITIALIZATION (FAIL-SAFE)
// ===============================
let app, auth, db;

try {
    // Only initialize if keys are provided (not "YOUR_API_KEY")
    if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY") {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        console.log("Firebase initialized successfully.");
    } else {
        console.warn("Firebase: Placeholder keys detected. Backend features will be disabled.");
    }
} catch (error) {
    console.error("Firebase Initialization Error:", error);
}


// ===============================
// 🔐 AUTH FUNCTIONS
// ===============================

window.signupUser = async function (email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        alert("Signup successful!");
        console.log("User UID:", userCredential.user.uid);
    } catch (error) {
        alert(error.message);
    }
};

window.loginUser = async function (email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        alert("Login successful!");
        console.log("User UID:", userCredential.user.uid);
    } catch (error) {
        alert(error.message);
    }
};

window.logoutUser = async function () {
    await signOut(auth);
    alert("Logged out");
};

if (auth) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("Logged in as:", user.email);
        } else {
            console.log("No user logged in");
        }
    });
}


// ===============================
// 📤 FILE ANALYSIS FUNCTION
// ===============================

async function analyzeFile(file) {
    try {
        if (!auth.currentUser) {
            alert("Please login first.");
            return;
        }

        if (!file) {
            alert("Please select a file.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        // 🔥 Replace with deployed backend URL in production
        const response = await fetch("http://127.0.0.1:8000/analyze", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error("Backend error");
        }

        const data = await response.json();
        console.log("Backend result:", data);

        await saveAnalysisToFirestore(file, data);

        alert("Analysis completed & saved!");

    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong.");
    }
}


// ===============================
// 📊 SAVE TO FIRESTORE
// ===============================

async function handleUploadLog(fileName, fileType, resultData) {
    try {
        if (!auth || !db) {
            console.warn("Firestore: Service not available. Logging skipped.");
            alert("Simulation: Analysis would be stored here if Firebase was configured.");
            return;
        }

        const user = auth.currentUser;

        if (!user) {
            alert("Please login first.");
            return;
        }

        const docRef = await addDoc(collection(db, "analyses"), {
            userId: user.uid,
            email: user.email,
            fileName: fileName,
            fileType: fileType,
            result: resultData.result,
            confidence: resultData.confidence,
            riskLevel: resultData.risk,
            timestamp: new Date()
        });

        console.log("Stored with ID:", docRef.id);
        alert("Analysis stored successfully!");
    } catch (e) {
        console.error("Firestore error:", e);
    }
}


// ===============================
// 📜 LOAD USER HISTORY
// ===============================

window.loadUserHistory = async function () {
    try {
        const user = auth.currentUser;

        if (!user) {
            alert("Login first.");
            return;
        }

        const q = query(
            collection(db, "analyses"),
            where("userId", "==", user.uid)
        );

        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            console.log(doc.data());
        });

    } catch (error) {
        console.error(error);
    }
};


// ===============================
// 🎯 CONNECT TO BUTTON
// ===============================

const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("initUploadBtn");

if (uploadBtn) {
    uploadBtn.addEventListener("click", async () => {
        uploadBtn.textContent = "Processing...";
        uploadBtn.disabled = true;

        const file = fileInput.files[0];

        await analyzeFile(file);

        uploadBtn.textContent = "Initialize Upload";
        uploadBtn.disabled = false;
    });
}