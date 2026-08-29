// --- UI & FRONTEND LOGIC ---

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. ANIMASI SPLASH SCREEN
    setTimeout(() => {
        const splash = document.getElementById('splash');
        splash.style.opacity = '0';
        setTimeout(() => {
            splash.style.display = 'none';
            // Tampilkan login screen setelah splash hilang
            document.getElementById('login-screen').style.display = 'flex';
        }, 500);
    }, 1500);

    // 2. NAVIGASI SIDEBAR & MENU
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const menuItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('.section');

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            // Hapus class active
            menuItems.forEach(m => m.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Tambah class active ke target
            item.classList.add('active');
            const target = item.getAttribute('data-target');
            document.getElementById(target).classList.add('active');
            
            // Tutup sidebar di mobile
            if(window.innerWidth < 768) { 
                sidebar.classList.remove('open'); 
            }
            
            // Scroll ke atas
            window.scrollTo(0, 0);
        });
    });

    // 3. ANIMASI TEKS KETIK (BERANDA)
    const textArray = [
        "Ini adalah website buatan sendiri.",
        "Informasi kelas yang terpadu.",
        "Portal presensi siswa modern.",
        "Galeri kenangan tak terlupakan.",
        "Keluarga besar VIII.G yang solid."
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeWriterElement = document.getElementById('typewriter-text');

    function typeEffect() {
        const currentText = textArray[textIndex];
        if(isDeleting) {
            typeWriterElement.innerText = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typeWriterElement.innerText = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;
        if(!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % textArray.length;
            typeSpeed = 500;
        }
        setTimeout(typeEffect, typeSpeed);
    }
    typeEffect();

    // 4. BUTTONS & SWEETALERT (Beranda)
    document.getElementById('btn-umpan-balik').addEventListener('click', () => {
        Swal.fire('Umpan Balik', 'Kirimkan pesan dan saranmu melalui grup WA kelas!', 'info');
    });

    document.getElementById('btn-visi-misi').addEventListener('click', () => {
        Swal.fire('Visi & Misi', 'Visi: Menjadi kelas berprestasi.<br>Misi: Belajar tekun dan saling membantu.', 'success');
    });

    // 5. GENERATE DATA DUMMY (Anggota Kelas & Album)
    const anggotaContainer = document.getElementById('anggota-container');
    if (anggotaContainer) {
        for(let i=1; i<=8; i++){
            anggotaContainer.innerHTML += `
            <div class="card anggota-card">
                <img src="https://ui-avatars.com/api/?name=Siswa+${i}&background=random" alt="Siswa">
                <h3>Siswa Ke-${i}</h3>
                <p class="struktur-jabatan" style="font-size:0.9rem;">Siswa / Anggota</p>
                <hr class="garis-putus">
                <p class="info-teks"><i class="fa-solid fa-gamepad"></i> Membaca & Game</p>
                <p class="info-teks"><i class="fa-regular fa-calendar"></i> 01 Jan 2011</p>
                <a href="#" class="btn-wa"><i class="fa-brands fa-whatsapp"></i> Chat WA</a>
            </div>`;
        }
    }

    const albumContainer = document.getElementById('album-container');
    if (albumContainer) {
        for(let i=1; i<=8; i++){
            albumContainer.innerHTML += `
            <div class="card album-card">
                <img src="https://picsum.photos/400/200?random=${i}" alt="Kenangan">
                <div class="album-info">
                    <div class="info-teks" style="margin:0;"><i class="fa-regular fa-calendar"></i> 24 Agustus 2026</div>
                    <div class="btn-dl" onclick="Swal.fire('Unduh', 'Gambar akan diunduh', 'success')"><i class="fa-solid fa-download"></i></div>
                </div>
            </div>`;
        }
    }

    // 6. TABS JADWAL PIKET
    const tabBtns = document.querySelectorAll('.tab-btn');
    const piketLists = document.querySelectorAll('.piket-list');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            piketLists.forEach(l => l.classList.remove('active'));
            
            btn.classList.add('active');
            const hari = btn.getAttribute('data-hari');
            document.getElementById(`piket-${hari}`).classList.add('active');
        });
    });

    // 7. QR CODE SCANNER LOGIC
    const btnStartScan = document.getElementById('btn-start-scan');
    const scanStatus = document.getElementById('scan-status');
    let html5QrcodeScanner;
    let hasScannedToday = false; 

    function checkTimeValid() {
        const now = new Date();
        const hour = now.getHours();
        const min = now.getMinutes();
        const timeInMins = hour * 60 + min;
        
        const startTime = 7 * 60 + 30; // 07.30
        const endTime = 20 * 60;        // 08.00
        
        return timeInMins >= startTime && timeInMins <= endTime;
    }

    btnStartScan.addEventListener('click', () => {
        if(!checkTimeValid()) {
            Swal.fire('Gagal', 'Presensi hanya aktif pada pukul 07.30 hingga 08.00 pagi.', 'error');
            return;
        }
        
        if(hasScannedToday) {
            Swal.fire('Info', 'Anda sudah melakukan scan presensi hari ini.', 'info');
            return;
        }

        html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: {width: 250, height: 250} }, false);
        html5QrcodeScanner.render(onScanSuccess, onScanFailure);
        scanStatus.innerText = "Kamera aktif, arahkan ke QR Code siswa...";
        btnStartScan.style.display = 'none';
    });

    function onScanSuccess(decodedText, decodedResult) {
        html5QrcodeScanner.clear(); // Matikan kamera
        hasScannedToday = true;
        btnStartScan.style.display = 'inline-block';
        scanStatus.innerText = "";
        
        // Memanggil fungsi dari backend.js
        if(window.kirimDataKeSpreadsheet) {
            window.kirimDataKeSpreadsheet(decodedText);
        }
        
        Swal.fire('Berhasil', `Presensi untuk kode: ${decodedText} berhasil dicatat!`, 'success');
    }

    function onScanFailure(error) { 
        // Mengabaikan error render frame kosong
    }

});