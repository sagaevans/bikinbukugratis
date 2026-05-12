let chapterCount = 0;

// FUNGSI UNTUK MENAMBAH CHAPTER (BISA KOSONG ATAU BERISI)
function addChapter(title = '', content = '') {
    chapterCount++;
    const container = document.getElementById('chaptersContainer');
    const div = document.createElement('div');
    div.className = 'input-card chapter-item';
    div.id = `chap-card-${chapterCount}`;
    div.innerHTML = `
        <button class="btn-delete" onclick="this.parentElement.remove()">Remove</button>
        <h3>Chapter</h3>
        <input type="text" class="chap-title" value="${title}" placeholder="Contoh: Chapter 1: The Beginning">
        <textarea class="chap-content" placeholder="Tulis isi bab di sini...">${content}</textarea>
    `;
    container.appendChild(div);
}

// FUNGSI UNTUK MENGISI CONTOH DATA OTOMATIS (AGAR TIDAK KOSONG)
function loadExampleData() {
    document.getElementById('bookTitle').value = "THE ARCHITECT";
    document.getElementById('bookSubtitle').value = "A deep dive into why the Creator is not a biological entity (alien), but a Dimensional Reality.";
    document.getElementById('includeTOC').checked = true;
    
    document.getElementById('prologueTitle').value = "Prologue: The Shadow on the Wall";
    document.getElementById('prologueContent').value = "We are the most technologically advanced generation, yet we have never been more anxious...";
    
    document.getElementById('epilogueTitle').value = "Epilogue: Coming Home";
    document.getElementById('epilogueContent').value = "The universe is not silent. It is speaking to us through the laws of physics...";

    // Tambah satu contoh chapter
    addChapter("Chapter 1: The Dimensional Wall", "Imagine a universe that exists entirely on a flat sheet of paper...");
}

// FUNGSI IMPORT/UPLOAD (UNTUK LANJUT EDIT PROYEK LAMA)
function importProject() {
    const fileInput = document.getElementById('importFile');
    const file = fileInput.files[0];
    if (!file) return alert("Pilih file .js atau .json terlebih dahulu!");

    const reader = new FileReader();
    reader.onload = function(e) {
        let rawContent = e.target.result;
        try {
            // Bersihkan teks "const bookData =" agar menjadi JSON murni
            let jsonString = rawContent.replace(/const bookData\s*=\s*/, "").replace(/;$/, "");
            const data = JSON.parse(jsonString);

            // Masukkan data ke form
            document.getElementById('bookTitle').value = data.title || '';
            document.getElementById('bookSubtitle').value = data.subtitle || '';
            document.getElementById('includeTOC').checked = data.includeTOC;
            document.getElementById('prologueTitle').value = data.prologue.title || '';
            document.getElementById('prologueContent').value = data.prologue.content || '';
            document.getElementById('epilogueTitle').value = data.epilogue.title || '';
            document.getElementById('epilogueContent').value = data.epilogue.content || '';

            // Bersihkan kontainer chapter dan isi ulang
            document.getElementById('chaptersContainer').innerHTML = '';
            chapterCount = 0;
            if(data.chapters && data.chapters.length > 0) {
                data.chapters.forEach(c => addChapter(c.title, c.content));
            } else {
                addChapter(); // Tetap beri satu kotak kosong jika tidak ada chapter
            }

            alert("Proyek berhasil dimuat! Silakan lanjutkan mengedit.");
        } catch (err) {
            console.error(err);
            alert("Gagal membaca file. Pastikan format file benar.");
        }
    };
    reader.readAsText(file);
}

// FUNGSI DOWNLOAD
function generateJS() {
    const chapters = [];
    document.querySelectorAll('.chapter-item').forEach(card => {
        const title = card.querySelector('.chap-title').value;
        const content = card.querySelector('.chap-content').value;
        if(title || content) {
            chapters.push({ title, content });
        }
    });

    const fullData = {
        title: document.getElementById('bookTitle').value,
        subtitle: document.getElementById('bookSubtitle').value,
        includeTOC: document.getElementById('includeTOC').checked,
        prologue: {
            title: document.getElementById('prologueTitle').value,
            content: document.getElementById('prologueContent').value
        },
        chapters: chapters,
        epilogue: {
            title: document.getElementById('epilogueTitle').value,
            content: document.getElementById('epilogueContent').value
        }
    };

    const finalOutput = "const bookData = " + JSON.stringify(fullData, null, 4) + ";";
    const blob = new Blob([finalOutput], {type: "text/javascript"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = document.getElementById('saveSlot').value;
    link.click();
}

// JALANKAN CONTOH SAAT HALAMAN DIBUKA
window.onload = () => {
    loadExampleData();
};