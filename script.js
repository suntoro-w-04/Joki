class Router {
  constructor() {
    this.routes = {};
    this.cache = new Map();
    this.init();
  }

  async init() {
    try {
      await this.loadSidebar();
      this.setupEventListeners();
      this.loadInitialPage();
      this.initMobileMenu();
    } catch (error) {
      this.showError('Gagal memuat aplikasi: ' + error.message);
    }
  }

  async loadSidebar() {
    try {
      const cached = this.cache.get('sidebar');
      if (cached) return;

      const response = await fetch('partials/sidebar.html');
      if (!response.ok) throw new Error('Sidebar tidak ditemukan');
      
      const html = await response.text();
      const sidebar = document.getElementById('sidebar');
      sidebar.innerHTML = html;
      this.cache.set('sidebar', html);
      
      this.initDropdowns();
      this.initScrollSpy();
    } catch (error) {
      console.error('Error loading sidebar:', error);
      throw error;
    }
  }

  setupEventListeners() {
    // Delegasi event untuk seluruh dokumen
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-page]');
      const dropdownToggle = e.target.closest('.dropdown-toggle');
      const mobileToggle = e.target.closest('.sidebar-toggle');

      if (link) this.handleNavigationClick(e, link);
      if (dropdownToggle) this.handleDropdownToggle(e, dropdownToggle);
      if (mobileToggle) this.toggleMobileMenu();
    });

    window.addEventListener('popstate', () => this.handlePopState());
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  handleNavigationClick(e, link) {
    e.preventDefault();
    const page = link.dataset.page;
    this.navigateTo(page);
    this.toggleMobileMenu(false);
  }

  handleDropdownToggle(e, toggle) {
    e.preventDefault();
    const dropdown = toggle.closest('.dropdown');
    const menu = dropdown.querySelector('.dropdown-menu');
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

    toggle.setAttribute('aria-expanded', !isExpanded);
    menu.style.maxHeight = isExpanded ? '0' : `${menu.scrollHeight}px`;
  }

  initMobileMenu() {
    this.sidebar = document.querySelector('.sidebar');
    this.toggleButton = document.querySelector('.sidebar-toggle');
  }

  toggleMobileMenu(forceClose) {
    const isActive = this.sidebar.classList.contains('active');
    const shouldClose = forceClose || isActive;
    
    this.sidebar.classList.toggle('active', !shouldClose);
    this.toggleButton.setAttribute('aria-expanded', !shouldClose);
    document.body.style.overflow = shouldClose ? '' : 'hidden';
  }

  async navigateTo(page) {
    if (this.currentPage === page) return;
    
    window.history.pushState({ page }, '', `#${page}`);
    await this.loadPage(page);
    this.currentPage = page;
  }

  async loadPage(page) {
    try {
      this.showLoadingState();
      
      const cachedHTML = this.cache.get(page);
      if (cachedHTML) {
        this.updateContent(cachedHTML);
      } else {
        const html = await this.fetchPageContent(page);
        this.cache.set(page, html);
        this.updateContent(html);
      }

      this.initPageSpecificFeatures(page);
      this.updateActiveMenu(page);
      this.handleDocumentTitle(page);
    } catch (error) {
      this.showErrorPage(error);
    }
  }

  async fetchPageContent(page) {
    const response = await fetch(`pages/${page}.html`);
    if (!response.ok) throw new Error(`Halaman ${page} tidak ditemukan`);
    return await response.text();
  }

  updateContent(html) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
      <div class="page-content fade-in">
        ${html}
      </div>
    `;
  }

  initPageSpecificFeatures(page) {
    if (page === 'rawat-akun') {
      this.initFAQAccordion();
      this.initPackageSelectors();
    }
    
    if (page === 'beranda') {
      this.initProductCarousels();
    }
  }

  initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      item.addEventListener('toggle', (e) => {
        const icon = item.querySelector('.fa-chevron-down');
        icon.style.transform = item.open ? 'rotate(180deg)' : 'rotate(0)';
      });
    });
  }

  initPackageSelectors() {
    const packageCards = document.querySelectorAll('.package-card');
    packageCards.forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.package-cta')) return;
        this.handlePackageSelection(card.dataset.packageType);
      });
    });
  }

  handlePackageSelection(packageType) {
    // Implementasi logika pemilihan paket
    console.log('Paket dipilih:', packageType);
  }

  updateActiveMenu(currentPage) {
    document.querySelectorAll('[data-page]').forEach(link => {
      const linkPage = link.dataset.page;
      const isActive = currentPage.startsWith(linkPage);
      
      link.classList.toggle('active', isActive);
      link.setAttribute('aria-current', isActive ? 'page' : 'false');

      if (isActive && link.closest('.dropdown-menu')) {
        const dropdown = link.closest('.dropdown');
        dropdown.classList.add('active');
        dropdown.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'true');
      }
    });
  }

  handleResize() {
    if (window.innerWidth > 768) {
      this.toggleMobileMenu(false);
    }
  }

  showLoadingState() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
      <div class="loading-spinner" role="alert" aria-busy="true">
        <i class="fas fa-spinner fa-spin" aria-hidden="true"></i>
        <p>Memuat konten...</p>
      </div>
    `;
  }

  showErrorPage(error) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
      <div class="error fade-in" role="alert">
        <h2>⚠️ Gagal Memuat Halaman</h2>
        <p>${error.message}</p>
        <button class="cta-btn" onclick="window.location.reload()">
          <i class="fas fa-sync-alt"></i>
          Coba Lagi
        </button>
      </div>
    `;
  }
}

// Dalam class Router tambahkan/timpa method berikut:
initDropdowns() {
  document.querySelectorAll('.dropdown').forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    const menu = dropdown.querySelector('.dropdown-menu');
    
    // Inisialisasi state awal
    toggle.setAttribute('aria-expanded', 'false');
    menu.style.maxHeight = '0';
    
    // Handle keyboard navigation
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleDropdown(dropdown);
      }
    });
  });
}

toggleDropdown(dropdown, forceClose = false) {
  const isActive = dropdown.classList.contains('active');
  const toggle = dropdown.querySelector('.dropdown-toggle');
  const menu = dropdown.querySelector('.dropdown-menu');
  
  // Tutup dropdown lainnya
  if (!forceClose) {
    document.querySelectorAll('.dropdown.active').forEach(other => {
      if (other !== dropdown) this.toggleDropdown(other, true);
    });
  }
  
  // Toggle state
  const shouldOpen = forceClose ? false : !isActive;
  dropdown.classList.toggle('active', shouldOpen);
  toggle.setAttribute('aria-expanded', shouldOpen);
  menu.style.maxHeight = shouldOpen ? `${menu.scrollHeight}px` : '0';
  
  // Animasi chevron
  const chevron = toggle.querySelector('.dropdown-indicator');
  if (chevron) {
    chevron.style.transform = shouldOpen ? 'rotate(180deg)' : 'rotate(0)';
  }
}

// Perbaiki event handler di setupEventListeners:
handleDropdownToggle(e, toggle) {
  e.preventDefault();
  const dropdown = toggle.closest('.dropdown');
  this.toggleDropdown(dropdown);
}

// Inisialisasi Router
document.addEventListener('DOMContentLoaded', () => {
  const router = new Router();
  
  // Ekspos router untuk debugging
  window.appRouter = router;
});