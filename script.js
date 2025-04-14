// Tambahkan efek klik untuk menu
document.querySelectorAll('.sidenav a').forEach(link => {
    link.addEventListener('click', function(e) {
        // Hapus active class dari semua menu
        document.querySelectorAll('.sidenav a').forEach(l => l.classList.remove('active'));
        
        // Tambahkan active class ke menu yang diklik
        this.classList.add('active');
        
        // Untuk demo saja, biasanya di sini ada logika navigasi
        e.preventDefault();
    });
});

// Optional: Tutup sidenav saat klik di luar (untuk versi mobile)
document.addEventListener('click', function(e) {
    const sidenav = document.querySelector('.sidenav');
    if (!sidenav.contains(e.target) && window.innerWidth <= 768) {
        sidenav.style.width = '60px';
    }
});