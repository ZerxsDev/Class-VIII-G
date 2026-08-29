// --- BACKEND LOGIC: GOOGLE SPREADSHEETS ---
function kirimDataKeSpreadsheet(kodeQR) {
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw87bfOweGC-9Kesb5Dr3KnEouMNw1BwW2dkgCENRJR-BpMh9TLlwhs48-ocYzHb6C6/exec";
    
    // Siapkan data
    const data = { 
        kode: kodeQR, 
        waktu: new Date().toISOString() 
    };
    
    console.log("Mencoba kirim ke spreadsheet:", data);

    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(() => {
        console.log('Data sukses terkirim ke spreadsheet background.');
    })
    .catch((error) => {
        console.error('Gagal mengirim data:', error);
    });
}

window.kirimDataKeSpreadsheet = kirimDataKeSpreadsheet;