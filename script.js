// Script untuk semua halaman
document.addEventListener('DOMContentLoaded', function() {
    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Dropdown Behavior
    document.querySelectorAll('.dropdown').forEach(item => {
        item.addEventListener('mouseenter', function() {
            if(window.innerWidth > 768) {
                this.querySelector('.dropdown-menu').style.display = 'block';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if(window.innerWidth > 768) {
                this.querySelector('.dropdown-menu').style.display = 'none';
            }
        });
    });

    // Mobile Menu Toggle
    const menuToggle = document.createElement('div');
    menuToggle.className = 'mobile-menu-toggle';
    document.body.appendChild(menuToggle);
    
    menuToggle.addEventListener('click', function() {
        document.querySelector('.sidebar').classList.toggle('active');
    });
});