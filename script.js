/**
 * KELAS UTAMA UNTUK MEMUAT KONTEN
 * Menangani semua logika pemuatan konten dan navigasi
 */
class ContentLoader {
    constructor() {
        this.contentArea = document.getElementById('main-content');
        this.init();
    }

    // Inisialisasi event listener
    init() {
        this.loadInitialContent();
        this.setupMenuListeners();
        this.setupHistoryHandler();
    }

    // Memuat konten awal
    loadInitialContent() {
        const initialContent = window.location.hash 
            ? `${window.location.hash.substring(1)}.html`
            : 'beranda.html';
        this.loadContent(initialContent);
    }

    // Setup listener untuk menu navigasi
    setupMenuListeners() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const contentFile = e.target.closest('a').dataset.content;
                this.setActiveMenu(e.target.closest('a'));
                this.loadContent(contentFile);
            });
        });
    }

    // Handle browser history
    setupHistoryHandler() {
        window.addEventListener('popstate', () => {
            const contentFile = window.location.hash.replace('#', '');
            this.loadContent(contentFile || 'beranda.html');
        });
    }

    // Fungsi utama untuk memuat konten
    async loadContent(fileName) {
        try {
            this.showLoading();
            const content = await this.fetchContent(fileName);
            this.updateContentArea(content);
            this.updateHistory(fileName);
        } catch (error) {
            this.showError(error);
        }
    }

    // Fetch konten dari server
    async fetchContent(fileName) {
        const response = await fetch(`content/${fileName}`);
        if (!response.ok) throw new Error('Konten tidak ditemukan');
        return await response.text();
    }

    // Update tampilan loading
    showLoading() {
        this.contentArea.innerHTML = '<div class="loading-indicator">Memuat konten...</div>';
    }

    // Update area konten
    updateContentArea(content) {
        this.contentArea.innerHTML = `<div class="content-card">${content}</div>`;
    }

    // Update browser history
    updateHistory(fileName) {
        history.pushState(null, null, `#${fileName.split('.')[0]}`);
    }

    // Set menu aktif
    setActiveMenu(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    // Tampilkan pesan error
    showError(error) {
        this.contentArea.innerHTML = `
            <div class="error-message">
                <h3>Gagal Memuat Konten</h3>
                <p>${error.message}</p>
                <button onclick="location.reload()">Coba Lagi</button>
            </div>
        `;
    }
}

// Inisialisasi saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
    new ContentLoader();
});