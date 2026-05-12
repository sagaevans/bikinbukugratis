// 1. Config Firebase
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
const auth = firebase.auth();
const db = firebase.firestore();

// 2. Auth & UI Init
auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById('user-email').innerText = user.email;
        // Tarik daftar buku milik user ini untuk dropdown load
        fetchMyBooks(user.email);
    } else {
        window.location.href = "admin.html";
    }
});

function logout() {
    auth.signOut().then(() => window.location.href = "admin.html");
}

// 3. Konversi Cover Base64
let base64Cover = "";
document.getElementById('coverImage').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        if(file.size > 1048576) {
            alert("Gambar terlalu besar! Maksimal 1MB.");
            this.value = "";
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => base64Cover = reader.result;
        reader.readAsDataURL(file);
    }
});

// 4. Dynamic Chapter
let chapterCount = 0;
function addChapter(title = "", content = "") {
    chapterCount++;
    const container = document.getElementById('chaptersContainer');
    const div = document.createElement('div');
    div.className = 'input-card chapter-box';
    div.innerHTML = `
        <button class="btn-remove" onclick="this.parentElement.remove()">Delete</button>
        <h3>Chapter ${chapterCount}</h3>
        <label>Title</label>
        <input type="text" class="chap-title" placeholder="e.g. Chapter 1: Origins" value="${title}">
        <label>Content</label>
        <textarea class="chap-content" placeholder="Content...">${content}</textarea>
    `;
    container.appendChild(div);
}

// Tambah satu chapter kosong saat pertama kali buka
window.onload = () => {
    if(chapterCount === 0) addChapter();
};

// 5. FITUR: LOAD MY BOOKS
function fetchMyBooks(email) {
    const select = document.getElementById('load-my-books');
    select.innerHTML = '<option value="">-- Pilih Buku --</option>';
    
    db.collection("books").where("authorEmail", "==", email).get().then(qs => {
        qs.forEach(doc => {
            const opt = document.createElement('option');
            opt.value = doc.id;
            opt.text = doc.data().title;
            select.appendChild(opt);
        });
    });
}

function loadMyBook() {
    const id = document.getElementById('load-my-books').value;
    if(!id) return alert("Pilih buku yang ingin dimuat!");

    const btnLoad = document.querySelector('.btn-load');
    btnLoad.innerText = "⏳ Loading...";

    db.collection("books").doc(id).get().then(doc => {
        const d = doc.data();
        
        // Load Data Dasar
        document.getElementById('bookTitle').value = d.title;
        document.getElementById('bookSubtitle').value = d.subtitle || "";
        document.getElementById('authorUsername').value = d.authorUsername || "";
        document.getElementById('titleAlign').value = d.style.align || "center";
        document.getElementById('titleFontSize').value = parseInt(d.style.titleFontSize);
        document.getElementById('headingFontSize').value = parseInt(d.style.headingFontSize);
        document.getElementById('bodyFontSize').value = parseInt(d.style.bodyFontSize);
        document.getElementById('includeTOC').checked = d.includeTOC;
        
        // Simpan Base64 Cover jika ada
        if(d.style.coverImage) base64Cover = d.style.coverImage;

        // Load Prologue
        if(d.prologue) {
            document.getElementById('includePrologue').checked = true;
            document.getElementById('prologueTitle').value = d.prologue.title;
            document.getElementById('prologueContent').value = d.prologue.content;
        } else {
            document.getElementById('includePrologue').checked = false;
        }

        // Load Epilogue
        if(d.epilogue) {
            document.getElementById('includeEpilogue').checked = true;
            document.getElementById('epilogueTitle').value = d.epilogue.title;
            document.getElementById('epilogueContent').value = d.epilogue.content;
        } else {
            document.getElementById('includeEpilogue').checked = false;
        }

        // Load Bibliography
        if(d.bibliography) {
            document.getElementById('includeBiblio').checked = true;
            document.getElementById('biblioContent').value = d.bibliography.content;
        } else {
            document.getElementById('includeBiblio').checked = false;
        }

        // Load Chapters
        const container = document.getElementById('chaptersContainer');
        container.innerHTML = ""; 
        chapterCount = 0;
        if(d.chapters) {
            d.chapters.forEach(c => {
                addChapter(c.title, c.content);
            });
        }

        alert("Berhasil memuat data: " + d.title);
        btnLoad.innerText = "Load Data";
    }).catch(err => alert("Gagal memuat: " + err.message));
}

// 6. Validasi & Save ke Firestore
function saveToDatabase() {
    const title = document.getElementById('bookTitle').value;
    const authorUsername = document.getElementById('authorUsername').value;
    const titleFontSize = parseInt(document.getElementById('titleFontSize').value);
    const headingFontSize = parseInt(document.getElementById('headingFontSize').value);
    const bodyFontSize = parseInt(document.getElementById('bodyFontSize').value);

    if (!title) return alert("Peringatan: Judul buku tidak boleh kosong!");
    if (titleFontSize > 80 || headingFontSize > 50 || bodyFontSize > 30) {
        return alert("Peringatan: Ukuran font melebihi batas maksimal!");
    }

    const btnPublish = document.getElementById('btn-publish');
    btnPublish.innerText = "⏳ Menyimpan...";
    btnPublish.disabled = true;

    const chapters = [];
    document.querySelectorAll('.chapter-box').forEach(card => {
        chapters.push({
            title: card.querySelector('.chap-title').value,
            content: card.querySelector('.chap-content').value
        });
    });

    let coverMode = "background";
    const selectedMode = document.querySelector('input[name="coverMode"]:checked');
    if (selectedMode) coverMode = selectedMode.value;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const bookData = {
        title: title,
        subtitle: document.getElementById('bookSubtitle').value,
        authorUsername: authorUsername, // MENYIMPAN USERNAME
        includeTOC: document.getElementById('includeTOC').checked,
        style: {
            align: document.getElementById('titleAlign').value,
            titleFontSize: titleFontSize + "px",
            headingFontSize: headingFontSize + "px",
            bodyFontSize: bodyFontSize + "px",
            coverImage: base64Cover,
            coverMode: coverMode
        },
        prologue: document.getElementById('includePrologue').checked ? {
            title: document.getElementById('prologueTitle').value,
            content: document.getElementById('prologueContent').value
        } : null,
        epilogue: document.getElementById('includeEpilogue').checked ? {
            title: document.getElementById('epilogueTitle').value,
            content: document.getElementById('epilogueContent').value
        } : null,
        bibliography: document.getElementById('includeBiblio').checked ? {
            content: document.getElementById('biblioContent').value
        } : null,
        chapters: chapters,
        authorEmail: auth.currentUser.email,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    db.collection("books").doc(slug).set(bookData)
        .then(() => {
            alert("Berhasil! Buku telah diperbarui di Server.");
            btnPublish.innerText = "🚀 Publish to Database";
            btnPublish.disabled = false;
            fetchMyBooks(auth.currentUser.email); // Refresh dropdown list
        })
        .catch(error => {
            alert("Gagal menyimpan: " + error.message);
            btnPublish.innerText = "🚀 Publish to Database";
            btnPublish.disabled = false;
        });
}