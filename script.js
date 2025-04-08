class App {
    constructor() {
        this.baseUrl = window.location.origin;
        this.pagesPath = 'pages/';
        this.defaultPage = 'beranda';
        
        this.init();
    }
    
    init() {
        this.loadComponents();
        this.setupRouter();
        this.setupEventListeners();
    }
    
    loadComponents() {
        this.loadSidebar();
    }
    
    loadSidebar() {
        fetch('partials/sidebar.html')
            .then(response => {
                if (!response.ok) throw new Error('Sidebar not found');
                return response.text();
            })
            .then(html => {
                document.getElementById('sidebar').innerHTML = html;
                this.initDropdown();
                this.setActiveMenu();
            })
            .catch(error => {
                console.error('Error loading sidebar:', error);
                this.showError('Gagal memuat menu navigasi');
            });
    }
    
    setupRouter() {
        // Handle initial load
        const initialPage = this.getCurrentPage();
        this.loadPage(initialPage);
        
        // Handle hash changes
        window.addEventListener('hashchange', () => {
            const page = this.getCurrentPage();
            this.loadPage(page);
        });
    }
    
    getCurrentPage() {
        return window.location.hash.substring(1) || this.defaultPage;
    }
    
    loadPage(page) {
        const pagePath = `${this.pagesPath}${page}.html`;
        
        fetch(pagePath)
            .then(response => {
                if (!response.ok) throw new Error('Page not found');
                return response.text();
            })
            .then(html => {
                document.getElementById('main-content').innerHTML = `
                    <div class="page-content">
                        ${html}
                    </div>
                `;
                this.setActiveMenu();
                window.scrollTo(0, 0);
            })
            .catch(error => {
                console.error('Error loading page:', error);
                this.showErrorPage();
            });
    }
    
    showErrorPage() {
        document.getElementById('main-content').innerHTML = `
            <div class="error-container">
                <h1 class="error-code">404</h1>
                <p class="error-message">Halaman tidak ditemukan</p>
                <a href="#${this.defaultPage}" class="btn">Kembali ke Beranda</a>
            </div>
        `;
    }
    
    initDropdown() {
        const dropdownToggles = document.querySelectorAll('.dropdown > a');
        
        dropdownToggles.forEach(toggle => {
            // Desktop hover
            toggle.addEventListener('mouseenter', () => {
                if (window.innerWidth > 768) {
                    toggle.parentElement.classList.add('hover');
                }
            });
            
            // Mobile click
            toggle.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    toggle.parentElement.classList.toggle('active');
                }
            });
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown') && window.innerWidth <= 768) {
                document.querySelectorAll('.dropdown').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
    }
    
    setActiveMenu() {
        const currentPage = this.getCurrentPage();
        const menuLinks = document.querySelectorAll('[data-page]');
        
        menuLinks.forEach(link => {
            const linkPage = link.getAttribute('data-page');
            if (linkPage === currentPage || currentPage.startsWith(linkPage + '/')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    setupEventListeners() {
        // Delegasi event untuk tombol dinamis
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn') || e.target.closest('.btn')) {
                this.handleButtonClick(e);
            }
        });
    }
    
    handleButtonClick(e) {
        e.preventDefault();
        const productName = e.target.closest('.service-card')?.querySelector('.card-title')?.textContent;
        if (productName) {
            alert(`Anda memilih: ${productName}\n\nFitur checkout akan dikembangkan lebih lanjut.`);
        }
    }
    
    showError(message) {
        const errorEl = document.createElement('div');
        errorEl.className = 'error-message';
        errorEl.textContent = message;
        document.getElementById('main-content').appendChild(errorEl);
    }
}

// Jalankan aplikasi saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
