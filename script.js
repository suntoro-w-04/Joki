// Dropdown untuk mobile
document.querySelectorAll('.dropdown > a').forEach(menu => {
    menu.addEventListener('click', function(e) {
        if (window.innerWidth <= 768px) {
            e.preventDefault();
            this.parentElement.classList.toggle('active');
        }
    });
});

// Tutup dropdown saat klik di luar (mobile)
document.addEventListener('click', function(e) {
    if (window.innerWidth <= 768px && !e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown').forEach(drop => {
            drop.classList.remove('active');
        });
    }
});

// Animasi tombol beli
document.querySelectorAll('.buy-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const productName = this.parentElement.querySelector('h3').textContent;
        const price = this.parentElement.querySelector('.price').textContent;
        
        alert(`🎮 Anda memilih:\n${productName}\n${price}\n\nTim kami akan menghubungi Anda dalam 1x24 jam!`);
    });
});
