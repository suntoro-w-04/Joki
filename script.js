// Dropdown untuk mobile
document.querySelectorAll('.dropdown > a').forEach(menu => {
    menu.addEventListener('click', function(e) {
        if (window.innerWidth <= 768px) {
            e.preventDefault();
            this.parentElement.classList.toggle('active');
        }
    });
});

// Tutup dropdown saat klik di luar
document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown') && window.innerWidth <= 768px) {
        document.querySelectorAll('.dropdown').forEach(drop => {
            drop.classList.remove('active');
        });
    }
// Animasi hover card
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 10px 20px rgba(233, 69, 96, 0.3)';
    });
    card.addEventListener('mouseleave', function() {
        this.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    });
});

// Popup detail layanan
document.querySelectorAll('.buy-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const service = this.parentElement.querySelector('h3').textContent;
        const price = this.parentElement.querySelector('.price').textContent;
        
        alert(`🚀 Anda memilih:\n${service}\n${price}\n\nTim kami akan segera menghubungi Anda!`);
    });
});
});
