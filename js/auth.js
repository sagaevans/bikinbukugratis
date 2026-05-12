// 1. Masukkan Config Firebase Asli Anda
const firebaseConfig = {
    apiKey: "AIzaSyBIcM2VZPmk8N4xV47cfJzXsIbbR3lJlcQ",
    authDomain: "ebook-architect-pro.firebaseapp.com",
    projectId: "ebook-architect-pro",
    storageBucket: "ebook-architect-pro.firebasestorage.app",
    messagingSenderId: "1008083358828",
    appId: "1:1008083358828:web:6988c434d68662c8afb449",
    measurementId: "G-L3ENZCBFJ0"
};

// 2. Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// 3. Elemen UI
let isLogin = true;
const authForm = document.getElementById('auth-form');
const btnSubmit = document.getElementById('btn-submit');
const toggleText = document.getElementById('toggle-text');

// 4. Fungsi Ganti Mode (Login / Daftar Email)
function toggleMode() {
    isLogin = !isLogin;
    btnSubmit.innerText = isLogin ? "Login dengan Email" : "Daftar Akun Baru";
    toggleText.innerText = isLogin ? "Belum punya akun?" : "Sudah punya akun?";
    document.querySelector('.footer-text a').innerText = isLogin ? "Daftar di sini" : "Login di sini";
}

// 5. Fungsi Login Google (Sangat Cepat)
function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            console.log("Berhasil login dengan Google:", result.user.displayName);
            window.location.href = "editor.html"; // Arahkan ke dashboard
        })
        .catch((error) => {
            alert("Gagal login Google: " + error.message);
        });
}

// 6. Fungsi Submit Email & Password
authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (isLogin) {
        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                window.location.href = "editor.html";
            })
            .catch(err => alert("Error: " + err.message));
    } else {
        auth.createUserWithEmailAndPassword(email, password)
            .then(() => {
                alert("Akun berhasil dibuat! Silakan login.");
                toggleMode(); // Balik ke tampilan login
            })
            .catch(err => alert("Error: " + err.message));
    }
});

// 7. Pengunci Halaman (Kalau sudah login, langsung lempar ke Editor)
auth.onAuthStateChanged((user) => {
    if (user && window.location.pathname.includes('admin.html')) {
        window.location.href = "editor.html";
    }
});