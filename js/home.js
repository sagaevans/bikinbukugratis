// 1. Konfigurasi Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBIcM2VZPmk8N4xV47cfJzXsIbbR3lJlcQ",
    authDomain: "ebook-architect-pro.firebaseapp.com",
    projectId: "ebook-architect-pro",
    storageBucket: "ebook-architect-pro.firebasestorage.app",
    messagingSenderId: "1008083358828",
    appId: "1:1008083358828:web:6988c434d68662c8afb449",
    measurementId: "G-L3ENZCBFJ0"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let currentBookData = null;

// 2. Ambil Daftar Buku untuk Dropdown (Update: Tampilkan Username)
window.onload = () => {
    const select = document.getElementById('project-slot');
    db.collection("books").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const option = document.createElement('option');
            option.value = doc.id; 

            // LOGIKA USERNAME PUBLIK
            let displayAuthor = "Anonim";
            if (data.authorUsername) {
                displayAuthor = data.authorUsername;
            } else if (data.authorEmail) {
                displayAuthor = data.authorEmail.split('@')[0]; // Potong email jika username kosong
            }

            option.text = `${data.title} (by: ${displayAuthor})`;
            select.appendChild(option);
        });
    }).catch(error => console.error("Gagal memuat list buku:", error));
};

// 3. Fungsi saat Dropdown Dipilih
function loadSelectedBook() {
    const slug = document.getElementById('project-slot').value;
    const container = document.getElementById('content-render');
    
    if (!slug) {
        container.style.display = 'flex';
        container.innerHTML = '<div id="placeholder-text">Please select a project slot from the dropdown menu above.</div>';
        currentBookData = null;
        return;
    }

    container.style.display = 'block';
    container.innerHTML = '<h3 style="text-align:center; color:#7f8c8d; margin-top:50px;">Memuat Data Buku...</h3>';

    db.collection("books").doc(slug).get().then((doc) => {
        if (doc.exists) {
            currentBookData = doc.data();
            renderEbook(currentBookData);
        } else {
            container.innerHTML = '<h3 style="text-align:center; color:red; margin-top:50px;">Data tidak ditemukan!</h3>';
        }
    });
}

// 4. Fungsi Render Tampilan Buku (Sesuai style.css Mas)
function renderEbook(data) {
    const container = document.getElementById('content-render');
    let html = "";

    // Cover Page
    html += `<div class="cover-page" style="text-align: ${data.style.align};">`;
    if (data.style.coverImage) {
        html += `<img src="${data.style.coverImage}" class="cover-image">`;
    }
    html += `<h1 class="main-title" style="font-size: ${data.style.titleFontSize};">${data.title}</h1>`;
    html += `<p class="subtitle" style="font-size: ${data.style.headingFontSize}; color: #7f8c8d;">${data.subtitle}</p>`;
    html += `</div><div class="page-break"></div>`;

    // Prologue
    if (data.prologue) {
        html += `<div class="chapter-section">
                    <h2 class="chapter-title" style="font-size: ${data.style.headingFontSize};">${data.prologue.title}</h2>
                    <div class="body-text" style="font-size: ${data.style.bodyFontSize};">
                        ${data.prologue.content.split('\n').map(p => `<p>${p}</p>`).join('')}
                    </div>
                 </div><div class="page-break"></div>`;
    }

    // Chapters
    if (data.chapters) {
        data.chapters.forEach((chap) => {
            html += `<div class="chapter-section">
                        <h2 class="chapter-title" style="font-size: ${data.style.headingFontSize};">${chap.title}</h2>
                        <div class="body-text" style="font-size: ${data.style.bodyFontSize};">
                            ${chap.content.split('\n').map(p => `<p>${p}</p>`).join('')}
                        </div>
                     </div><div class="page-break"></div>`;
        });
    }

    // Epilogue
    if (data.epilogue) {
        html += `<div class="chapter-section">
                    <h2 class="chapter-title" style="font-size: ${data.style.headingFontSize};">${data.epilogue.title}</h2>
                    <div class="body-text" style="font-size: ${data.style.bodyFontSize};">
                        ${data.epilogue.content.split('\n').map(p => `<p>${p}</p>`).join('')}
                    </div>
                 </div><div class="page-break"></div>`;
    }

    // Bibliography
    if (data.bibliography) {
        html += `<div class="chapter-section">
                    <h2 class="chapter-title" style="font-size: ${data.style.headingFontSize};">Daftar Pustaka</h2>
                    <div class="body-text" style="font-size: ${data.style.bodyFontSize};">
                        ${data.bibliography.content.replace(/\n/g, '<br>')}
                    </div>
                 </div>`;
    }

    container.innerHTML = html;
}

// 5. Fungsi Print PDF Preview (Sesuai format A4)
function generateProfessionalPDF() {
    if (!currentBookData) {
        alert("Pilih project slot terlebih dahulu!");
        return;
    }

    const btn = document.getElementById('btn-download');
    const originalText = btn.innerText;
    btn.innerText = "⏳ Membuat Preview...";
    btn.disabled = true;

    const element = document.getElementById('ebook-area');
    
    const opt = {
        margin:       [20, 15, 20, 15], 
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true }, 
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).toPdf().get('pdf').then(function (pdf) {
        const totalPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);
            pdf.setFontSize(10);
            pdf.setTextColor(100);
            pdf.text('Halaman ' + i + ' dari ' + totalPages, pdf.internal.pageSize.getWidth() - 35, pdf.internal.pageSize.getHeight() - 10);
        }
        
        const pdfUrl = pdf.output('bloburl');
        window.open(pdfUrl, '_blank');

    }).then(() => {
        btn.innerText = originalText;
        btn.disabled = false;
    });
}