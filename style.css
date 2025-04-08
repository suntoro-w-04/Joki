/* ... (kode sebelumnya tetap) ... */

/* Style Dropdown Menu */
.dropdown {
    position: relative;
}

.dropdown-icon {
    margin-left: auto;
    transition: transform 0.3s;
}

.dropdown-menu {
    list-style: none;
    background: #16213e;
    position: absolute;
    left: 0;
    top: 100%;
    width: 100%;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s;
    z-index: 10;
}

.dropdown:hover .dropdown-menu {
    opacity: 1;
    visibility: visible;
}

.dropdown:hover .dropdown-icon {
    transform: rotate(180deg);
}

.dropdown-menu li a {
    padding-left: 40px !important;
    font-size: 0.9rem;
}

/* Responsif Dropdown */
@media (max-width: 768px) {
    .dropdown {
        position: static;
    }
    
    .dropdown-menu {
        position: static;
        display: none;
        background: #1a1a2e;
    }
    
    .dropdown.active .dropdown-menu {
        display: block;
        opacity: 1;
        visibility: visible;
    }
    
    .dropdown-icon {
        display: none;
    }
}
