function loadSelectedBook() {
    const selector = document.getElementById('bookDropdown');
    const fileUrl = selector.value;
    const container = document.getElementById('book-content');
    
    if (!fileUrl) {
        container.innerHTML = `<h2 style="text-align:center; color:#7f8c8d; margin-top:50px;">Please select a project slot from the dropdown menu above.</h2>`;
        return;
    }

    container.innerHTML = `<h2 style="text-align:center; color:#7f8c8d; margin-top:50px;">Loading book data...</h2>`;
    
    const oldScript = document.getElementById('dynamic-book-data');
    if (oldScript) {
        oldScript.remove();
    }

    const script = document.createElement('script');
    script.src = fileUrl;
    script.id = 'dynamic-book-data';
    
    script.onload = function() {
        renderBook();
    };
    
    script.onerror = function() {
        container.innerHTML = `<h2 style="text-align:center; color:#e74c3c; margin-top:50px;">Slot Empty! File ${fileUrl} not found in the content folder.</h2>`;
    };

    document.body.appendChild(script);
}

function renderBook() {
    const container = document.getElementById('book-content');
    if (typeof bookData === 'undefined') {
        container.innerHTML = "<h2 style='text-align:center; color:#e74c3c; margin-top:50px;'>No data found.</h2>";
        return;
    }

    // KODE SAKTI PEMISAH HALAMAN (Berfungsi mutlak di PDF dan MS Word)
    const pageBreakHTML = `<div class="page-break" style="mso-break-type: page-break;"></div>`;

    let html = `
        <div class="title-page">
            <h1 class="main-title">${bookData.title}</h1>
            <p class="subtitle">${bookData.subtitle}</p>
        </div>
        ${pageBreakHTML}
    `;

    if (bookData.includeTOC) {
        html += `
            <section class="toc-section">
                <h2 class="chapter-title" style="margin-bottom: 40px; border:none;">Table of Contents</h2>
                <ul class="toc-list">
        `;
        
        if (bookData.prologue && bookData.prologue.content.trim() !== "") {
            html += `<li><strong>${bookData.prologue.title}</strong></li>`;
        }
        
        if(bookData.chapters) {
            bookData.chapters.forEach(chap => {
                html += `<li>${chap.title}</li>`;
            });
        }
        
        if (bookData.epilogue && bookData.epilogue.content.trim() !== "") {
            html += `<li><strong>${bookData.epilogue.title}</strong></li>`;
        }
        
        html += `</ul></section>${pageBreakHTML}`;
    }

    if (bookData.prologue && bookData.prologue.content.trim() !== "") {
        html += `
            <section>
                <h2 class="chapter-title">${bookData.prologue.title}</h2>
                <div class="body-text">${bookData.prologue.content}</div>
            </section>
            ${pageBreakHTML}
        `;
    }

    if(bookData.chapters) {
        bookData.chapters.forEach(chap => {
            html += `
                <section>
                    <h2 class="chapter-title">${chap.title}</h2>
                    <div class="body-text">${chap.content}</div>
                </section>
                ${pageBreakHTML}
            `;
        });
    }

    if (bookData.epilogue && bookData.epilogue.content.trim() !== "") {
        html += `
            <section>
                <h2 class="chapter-title">${bookData.epilogue.title}</h2>
                <div class="body-text">${bookData.epilogue.content}</div>
            </section>
        `;
    }

    container.innerHTML = html;
}

function exportToWord() {
    const content = document.getElementById('book-content').innerHTML;
    
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><style>
        body { font-family: 'Georgia', serif; line-height: 1.6; }
        h1, h2 { text-align: center; }
        p { text-align: justify; }
        ul.toc-list { list-style-type: none; padding-left: 0; }
        ul.toc-list li { margin-bottom: 10px; font-size: 1.2em; border-bottom: 1px dotted #ccc; padding-bottom: 5px; }
        .page-break::after { display: none !important; }
    </style></head><body>`;
    
    const footer = "</body></html>";
    const blob = new Blob(['\ufeff', header + content + footer], { type: 'application/msword' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    
    const fileName = bookData ? bookData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'Exported_Book';
    link.download = fileName + '.doc';
    link.click();
}

window.onload = loadSelectedBook;