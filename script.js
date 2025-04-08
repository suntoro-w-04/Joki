// Global Variables
const BASE_URL = window.location.href.split('#')[0];
const DEFAULT_PAGE = 'beranda';

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadComponents();
    setupRouting();
    setupServiceWorker();
});

// Load Components
function loadComponents() {
    loadSidebar();
}

function loadSidebar() {
    fetch('partials/sidebar.html')
        .then(response => {
            if (!response.ok) throw new Error('Sidebar not found');
            return response.text();
        })
        .then(html => {
            document.getElementById('sidebar').innerHTML = html;
            initDropdown();
            setActiveMenu();
        })
        .catch(error => {
            console.error('Error loading sidebar:', error);
            document.getElementById('sidebar').innerHTML = `
                <aside class="sidebar">
                    <div class="error">Gagal memuat menu</div>
                </aside>
            `;
        });
}

// Routing System
function setupRouting() {
    // Handle initial load
    const initialPage = window.location.hash.substring(1) || DEFAULT_PAGE;
    loadPage(initialPage);

    // Handle back/forward navigation
    window.addEventListener('hashchange', () => {
        const page = window.location.hash.substring(1) || DEFAULT_PAGE;
        loadPage(page);
    });
}

function loadPage(page) {
    const pagePath = `pages/${page}.html`;
    
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
            setActiveMenu();
            window.scrollTo(0, 0);
        })
        .catch(error => {
            console.error('Error loading page:', error);
            showErrorPage();
        });
}

function showErrorPage() {
    document.getElementById('main-content').innerHTML = `
        <div class="error-page">
            <h1>404</h1>
            <p>Halaman tidak ditemukan</p>
            <a href="#${DEFAULT_PAGE}" class="btn">Kembali ke Beranda</a>
        </div>
    `;
}

// Dropdown Menu
function initDropdown() {
    const dropdownToggles = document.querySelectorAll('.dropdown > a');
    
    dropdownToggles.forEach(toggle => {
        // Desktop hover
        toggle.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) {
                this.parentElement.classList.add('hover');
            }
        });
        
        // Mobile click
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                this.parentElement.classList.toggle('active');
                
                // Close other dropdowns
                document.querySelectorAll('.dropdown').forEach(dropdown => {
                    if (dropdown !== this.parentElement) {
                        dropdown.classList.remove('active');
                    }
                });
            }
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown') && window.innerWidth <= 768) {
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
}

// Set Active Menu
function setActiveMenu() {
    const currentPage = window.location.hash.substring(1) || DEFAULT_PAGE;
    const menuLinks = document.querySelectorAll('[data-page]');
    
    menuLinks.forEach(link => {
        const linkPage = link.getAttribute('data-page');
        link.classList.toggle('active', linkPage === currentPage);
    });
}

// Service Worker (PWA)
function setupServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('ServiceWorker registered:', registration.scope);
                })
                .catch(error => {
                    console.log('ServiceWorker registration failed:', error);
                });
        });
    }
}