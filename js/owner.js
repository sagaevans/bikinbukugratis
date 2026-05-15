// =========================
// =========================

function filterBooks(){

    const keyword = document
        .getElementById('searchInput')
        .value
        .toLowerCase();

    const filtered = allBooks.filter(book => {

        const title = (book.title || '').toLowerCase();

        const author = (
            book.authorUsername ||
            book.authorEmail ||
            ''
        ).toLowerCase();

        return title.includes(keyword)
            || author.includes(keyword);
    });

    renderBooks(filtered);
}


// =========================
// PREVIEW
// =========================

function previewBook(id){

    window.open(`index.html?book=${id}`, '_blank');
}


// =========================
// DELETE BOOK
// =========================

async function deleteBook(id){

    const confirmDelete = confirm(
        'Yakin ingin menghapus ebook ini?'
    );

    if(!confirmDelete) return;

    try {

        await db.collection('books').doc(id).delete();

        alert('Ebook berhasil dihapus');

        loadAllBooks();

    } catch (error) {

        alert('Gagal hapus ebook');
        console.error(error);
    }
}


// =========================
// LOGOUT
// =========================

function logoutOwner(){

    localStorage.removeItem('owner_github_token');
    localStorage.removeItem('owner_github_username');

    location.reload();
}
