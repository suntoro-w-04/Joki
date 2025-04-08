class Router {
    constructor() {
      this.routes = {};
      this.init();
    }
  
    init() {
      // Load sidebar first
      this.loadSidebar()
        .then(() => {
          this.setupNavigation();
          this.loadInitialPage();
        })
        .catch(error => {
          console.error('Failed to initialize router:', error);
          this.showError('Failed to load navigation');
        });
    }
  
    async loadSidebar() {
      try {
        const response = await fetch('partials/sidebar.html');
        if (!response.ok) throw new Error('Sidebar not found');
        
        const html = await response.text();
        document.getElementById('sidebar').innerHTML = html;
        
        // Debug log
        console.log('Sidebar loaded successfully');
      } catch (error) {
        console.error('Error loading sidebar:', error);
        throw error;
      }
    }
  
    setupNavigation() {
      // Handle all clicks on navigation links
      document.addEventListener('click', (e) => {
        const link = e.target.closest('[data-page]');
        if (link) {
          e.preventDefault();
          const page = link.getAttribute('data-page');
          this.navigateTo(page);
        }
      });
  
      // Handle browser back/forward
      window.addEventListener('popstate', () => {
        this.loadPage(this.getCurrentPage());
      });
    }
  
    navigateTo(page) {
      // Update URL without reload
      window.history.pushState({}, '', `#${page}`);
      this.loadPage(page);
    }
  
    loadInitialPage() {
      const page = this.getCurrentPage() || 'beranda';
      this.loadPage(page);
    }
  
    getCurrentPage() {
      return window.location.hash.substring(1);
    }
  
    async loadPage(page) {
      try {
        // Show loading state
        document.getElementById('main-content').innerHTML = `
          <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Memuat...</p>
          </div>
        `;
  
        // Load page content
        const response = await fetch(`pages/${page}.html`);
        if (!response.ok) throw new Error('Page not found');
        
        const html = await response.text();
        
        // Update DOM
        document.getElementById('main-content').innerHTML = `
          <div class="page-content">
            ${html}
          </div>
        `;
        
        // Update active menu
        this.updateActiveMenu(page);
        
        console.log(`Loaded page: ${page}`);
      } catch (error) {
        console.error(`Error loading page ${page}:`, error);
        this.showErrorPage(error);
      }
    }
  
    updateActiveMenu(currentPage) {
      document.querySelectorAll('[data-page]').forEach(link => {
        const linkPage = link.getAttribute('data-page');
        const isActive = currentPage.startsWith(linkPage);
        link.classList.toggle('active', isActive);
        
        // Handle dropdown parent active state
        if (isActive && link.closest('.dropdown-menu')) {
          link.closest('.dropdown').classList.add('active');
        }
      });
    }
  
    showErrorPage(error) {
      document.getElementById('main-content').innerHTML = `
        <div class="error">
          <h2>Terjadi Kesalahan</h2>
          <p>${error.message}</p>
          <a href="#" data-page="beranda" class="btn">Kembali ke Beranda</a>
        </div>
      `;
    }
  }
  
  // Initialize router when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    const router = new Router();
    
    // Debugging helper
    window.router = router;
  });
  