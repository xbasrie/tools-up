document.addEventListener("DOMContentLoaded", () => {
    // Menyimpan HTML sidebar di dalam variabel JS agar tidak terkena error CORS saat dibuka via file lokal (klik dua kali)
    const sidebarHTML = `
<aside class="sidebar glass-panel">
    <div class="logo">
        <span class="material-symbols-outlined logo-icon">auto_awesome_mosaic</span>
        <h2>Tools Kepegawaian</h2>
    </div>
    
    <nav class="menu">
        <a href="index.html" class="menu-item">
            <span class="material-symbols-outlined icon">calculate</span>
            <span class="text">Kalkulasi Masa Kerja</span>
        </a>
        <a href="kalkulator-tanggal.html" class="menu-item">
            <span class="material-symbols-outlined icon">event_note</span>
            <span class="text">Kalkulator Tanggal</span>
        </a>
        <a href="duk-generator.html" class="menu-item">
            <span class="material-symbols-outlined icon">receipt_long</span>
            <span class="text">DUK Generator</span>
        </a>
        <a href="peta-jabatan.html" class="menu-item" style="display: none;">
            <span class="material-symbols-outlined icon">account_tree</span>
            <span class="text">Peta Jabatan</span>
        </a>
        <div class="menu-group">
            <div class="menu-item parent-menu" onclick="this.parentElement.classList.toggle('open')">
                <div style="display: flex; align-items: center; gap: 1.2rem;">
                    <span class="material-symbols-outlined icon">picture_as_pdf</span>
                    <span class="text">Alat PDF</span>
                </div>
                <span class="material-symbols-outlined expand-icon" style="font-size: 1.2rem; transition: transform 0.3s;">expand_more</span>
            </div>
            <div class="sub-menu">
                <a href="compress-pdf.html" class="menu-item">
                    <span class="material-symbols-outlined icon">compress</span>
                    <span class="text">Kompres PDF</span>
                </a>
                <a href="merge-pdf.html" class="menu-item">
                    <span class="material-symbols-outlined icon">library_add</span>
                    <span class="text">Merge PDF</span>
                </a>
                <a href="split-pdf.html" class="menu-item">
                    <span class="material-symbols-outlined icon">vertical_split</span>
                    <span class="text">Split PDF</span>
                </a>
            </div>
        </div>
    </nav>
</aside>
    `;

    const container = document.getElementById('sidebar-container');
    if (container) {
        container.innerHTML = sidebarHTML;
        
        // Set active class based on current URL
        let currentPath = window.location.pathname;
        const menuItems = document.querySelectorAll('.menu-item[href]');
        let isActiveSet = false;
        
        menuItems.forEach(item => {
            // Remove active class from all items first
            item.classList.remove('active');
            
            const href = item.getAttribute('href');
            const cleanHref = href.replace('.html', '');
            
            // Check if current path matches the href exactly, or if it matches the clean URL version
            if (currentPath.endsWith(href) || currentPath.endsWith(cleanHref) || (currentPath.endsWith('/') && href === 'index.html')) {
                item.classList.add('active');
                isActiveSet = true;
                
                // If it's inside a sub-menu, open the parent group
                const parentGroup = item.closest('.menu-group');
                if (parentGroup) {
                    parentGroup.classList.add('open');
                }
            }
        });
        
        // Fallback untuk index jika URL lokal tidak terdeteksi dengan baik
        if (!isActiveSet && (currentPath.endsWith('tools-up/') || currentPath.endsWith('tools-up'))) {
             const indexItem = document.querySelector('.menu-item[href="index.html"]');
             if(indexItem) indexItem.classList.add('active');
        }
    }
});
