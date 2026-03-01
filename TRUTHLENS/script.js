import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// TODO: Replace with your actual Firebase config object
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Simulated Upload Function to trigger Firebase
async function handleMockUploadLog() {
    try {
        console.log("Simulating upload and logging to Firebase...");

        // Mock data for the analytics log
        const mockUserId = "anonymous_user_" + Math.floor(Math.random() * 1000);
        const mockFile = { name: "evidence_video_01.mp4", type: "video/mp4" };
        const mockResponse = { result: "DEEPFAKE_DETECTED", confidence: 98.4, risk: "HIGH" };

        const docRef = await addDoc(collection(db, "analyses"), {
            userId: mockUserId,
            fileName: mockFile.name,
            fileType: mockFile.type,
            result: mockResponse.result,
            confidence: mockResponse.confidence,
            riskLevel: mockResponse.risk,
            timestamp: new Date()
        });

        console.log("Document written with ID: ", docRef.id);
        alert("Simulated backend log successful! (Check console)");
    } catch (e) {
        console.error("Error adding document: ", e);
        if (e.message.includes('API key')) {
            console.warn("Please add your actual Firebase Config to script.js!");
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {

    // 1. Navigation Scroll Effect
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Scroll Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 3. Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navHeight = navbar.getBoundingClientRect().height;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Modal Interactions (Simulated UI Workflow)
    const modal = document.getElementById('uploadModal');
    const closeBtn = document.getElementById('closeModal');

    // Elements that trigger the modal
    const triggerBtns = [
        document.getElementById('navVerifyBtn'),
        document.getElementById('heroUploadBtn'),
        document.getElementById('heroVerifyBtn'),
        document.getElementById('footerUploadBtn')
    ];

    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    triggerBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                // Add a small ripple or click effect before opening
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    btn.style.transform = '';
                    openModal();
                }, 150);
            });
        }
    });

    closeBtn.addEventListener('click', closeModal);

    // Close when clicking outside the modal content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Pressing Escape closes the modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // 5. Interactive Mock Data Updates (Dashboard Simulation)
    // 6. Bind Firebase Upload Simulation to the Modal Button
    const initUploadBtn = document.getElementById('initUploadBtn');
    if (initUploadBtn) {
        initUploadBtn.addEventListener('click', () => {
            initUploadBtn.textContent = "Processing...";
            initUploadBtn.style.opacity = "0.7";

            // Simulate processing delay before logging to Firebase
            setTimeout(async () => {
                await handleMockUploadLog();
                initUploadBtn.textContent = "Upload Complete";
                initUploadBtn.classList.remove('btn-primary');
                initUploadBtn.classList.add('btn-secondary');

                setTimeout(() => {
                    closeModal();
                    // Reset button
                    initUploadBtn.textContent = "Initialize Upload";
                    initUploadBtn.classList.remove('btn-secondary');
                    initUploadBtn.classList.add('btn-primary');
                    initUploadBtn.style.opacity = "1";
                }, 2000);
            }, 1500);
        });
    }

});
