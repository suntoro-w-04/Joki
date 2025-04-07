// Efek klik menu sidebar
document.querySelectorAll('nav ul li a').forEach(menu => {
    menu.addEventListener('click', function() {
        document.querySelector('nav ul li a.active').classList.remove('active');
        this.classList.add('active');
    });
});

// Alert saat tombol beli diklik
document.querySelectorAll('.buy-btn').forEach(button => {
    button.addEventListener('click', function() {
        const productName = this.parentElement.querySelector('h3').textContent;
        alert(`Anda membeli: ${productName}`);
    });
});
