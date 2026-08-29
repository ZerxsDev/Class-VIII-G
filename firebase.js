import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCfQ_Kb4WHRSAb88pZZ880G5wYSra863LI",
  authDomain: "classviiig.firebaseapp.com",
  projectId: "classviiig",
  storageBucket: "classviiig.firebasestorage.app",
  messagingSenderId: "432040956200",
  appId: "1:432040956200:web:4e4e2c1e9db9cd8071801d",
  measurementId: "G-065FPGX6WB"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Listener untuk memantau status login
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app-screen').style.display = 'block';
        
        // Update data UI Profil
        document.getElementById('profile-name').innerText = user.displayName;
        document.getElementById('profile-email').innerText = user.email;
        document.getElementById('profile-inisial').innerText = user.displayName.charAt(0).toUpperCase();
    } else {
        document.getElementById('app-screen').style.display = 'none';
        // Pastikan splash screen sudah hilang sebelum tampilkan login
        if (document.getElementById('splash').style.display === 'none') {
            document.getElementById('login-screen').style.display = 'flex';
        }
    }
});

// --- UI EVENT LISTENER (SIMULASI / REAL) ---

const btnLogin = document.getElementById('btn-login');
const btnLogout = document.getElementById('btn-logout');
const privacyCheck = document.getElementById('privacy-checkbox');

btnLogin.addEventListener('click', () => {
    if(!privacyCheck.checked) {
        Swal.fire('Perhatian', 'Harap centang persetujuan Kebijakan Privasi terlebih dahulu.', 'warning');
        return;
    }

    // --- SIMULASI LOGIN (Hapus jika menggunakan Auth asli) ---
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app-screen').style.display = 'block';
    
    // Set dummy profil
    document.getElementById('profile-name').innerText = "Siswa Kelas";
    document.getElementById('profile-inisial').innerText = "S";
    // --------------------------------------------------------

    signInWithPopup(auth, provider).catch((error) => {
        Swal.fire('Gagal Login', error.message, 'error');
    });
});

btnLogout.addEventListener('click', () => {
    document.getElementById('app-screen').style.display = 'none';
    document.getElementById('login-screen').style.display = 'flex';
    // --------------------------------------------------------

    signOut(auth).then(() => {
        Swal.fire('Keluar', 'Anda telah berhasil keluar dari sistem.', 'success');
    }).catch((error) => {
        console.error('Logout error', error);
    });
});