// Fashion Marketplace JavaScript

// Shopping Cart Functionality
let cart = [];
let wishlist = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    showFlashScreen();
});

function initializeApp() {
    setupEventListeners();
    updateCartCount();
    setupFilterTabs();
    setupProductCards();
    setupNewsletterForm();
    setupSearch();
}

// Event Listeners Setup
function setupEventListeners() {
    // Add to cart buttons
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', handleAddToCart);
    });

    // Wishlist buttons
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', handleWishlist);
    });

    // Quick view buttons
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', handleQuickView);
    });

    // Category cards
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', handleCategoryClick);
    });

    // Mobile menu toggle (if needed)
    setupMobileMenu();
}

// Add to Cart Functionality
function handleAddToCart(event) {
    event.preventDefault();
    const productCard = event.target.closest('.product-card');
    const product = extractProductData(productCard);
    
    addToCart(product);
    showNotification(`${product.title} added to cart!`, 'success');
    
    // Add animation effect
    const btn = event.target;
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
    }, 150);
}

function extractProductData(productCard) {
    return {
        id: Date.now() + Math.random(), // Simple ID generation
        title: productCard.querySelector('.product-title').textContent,
        brand: productCard.querySelector('.product-brand').textContent,
        price: productCard.querySelector('.current-price').textContent,
        image: productCard.querySelector('.product-image').src,
        quantity: 1
    };
}

function addToCart(product) {
    const existingItem = cart.find(item => item.title === product.title);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(product);
    }
    
    updateCartCount();
    saveCartToStorage();
}

function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
        
        // Add animation when count changes
        cartCountElement.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartCountElement.style.transform = 'scale(1)';
        }, 200);
    }
}

// Wishlist Functionality
function handleWishlist(event) {
    event.preventDefault();
    const productCard = event.target.closest('.product-card');
    const product = extractProductData(productCard);
    const heartIcon = event.target.closest('.wishlist-btn').querySelector('i');
    
    const isInWishlist = wishlist.some(item => item.title === product.title);
    
    if (isInWishlist) {
        removeFromWishlist(product.title);
        heartIcon.className = 'far fa-heart';
        showNotification(`${product.title} removed from wishlist`, 'info');
    } else {
        addToWishlist(product);
        heartIcon.className = 'fas fa-heart';
        showNotification(`${product.title} added to wishlist!`, 'success');
    }
}

function addToWishlist(product) {
    wishlist.push(product);
    saveWishlistToStorage();
}

function removeFromWishlist(productTitle) {
    wishlist = wishlist.filter(item => item.title !== productTitle);
    saveWishlistToStorage();
}

// Quick View Functionality
function handleQuickView(event) {
    event.preventDefault();
    const productCard = event.target.closest('.product-card');
    const product = extractProductData(productCard);
    
    showQuickViewModal(product);
}

function showQuickViewModal(product) {
    // Create and show a modal (simplified version)
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-body">
                <img src="${product.image}" alt="${product.title}" class="modal-image">
                <div class="modal-info">
                    <h3>${product.title}</h3>
                    <p class="modal-brand">${product.brand}</p>
                    <p class="modal-price">${product.price}</p>
                    <button class="modal-add-to-cart">Add to Cart</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Filter Tabs Functionality
function setupFilterTabs() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            filterTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Filter products based on tab
            const filter = this.textContent.toLowerCase();
            filterProducts(filter);
        });
    });
}

function filterProducts(filter) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const badges = card.querySelectorAll('.product-badges span');
        let shouldShow = filter === 'all';
        
        if (!shouldShow) {
            badges.forEach(badge => {
                const badgeText = badge.textContent.toLowerCase();
                if (filter === 'new arrivals' && badgeText.includes('new')) {
                    shouldShow = true;
                }
                if (filter === 'best sellers' && badgeText.includes('best')) {
                    shouldShow = true;
                }
                if (filter === 'sale' && badge.classList.contains('badge-sale')) {
                    shouldShow = true;
                }
            });
        }
        
        card.style.display = shouldShow ? 'block' : 'none';
    });
}

// Product Cards Animation
function setupProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    productCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Newsletter Form
function setupNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    const newsletterInput = document.querySelector('.newsletter-input');
    const newsletterBtn = document.querySelector('.newsletter-button');
    
    if (newsletterBtn) {
        newsletterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const email = newsletterInput.value.trim();
            
            if (validateEmail(email)) {
                showNotification('Thank you for subscribing!', 'success');
                newsletterInput.value = '';
            } else {
                showNotification('Please enter a valid email address', 'error');
            }
        });
    }
}

// Search Functionality
function setupSearch() {
    const searchInput = document.querySelector('.search-input');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            searchProducts(searchTerm);
        });
    }
}

function searchProducts(searchTerm) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const title = card.querySelector('.product-title').textContent.toLowerCase();
        const brand = card.querySelector('.product-brand').textContent.toLowerCase();
        
        const matches = title.includes(searchTerm) || brand.includes(searchTerm);
        card.style.display = matches ? 'block' : 'none';
    });
}

// Category Click Handler
function handleCategoryClick(event) {
    const categoryTitle = event.currentTarget.querySelector('.category-title').textContent;
    showNotification(`Browsing ${categoryTitle} category`, 'info');
    
    // Add category filtering logic here
    filterByCategory(categoryTitle.toLowerCase());
}

function filterByCategory(category) {
    // This would typically navigate to a category page or filter products
    console.log(`Filtering by category: ${category}`);
}

// Mobile Menu Setup
function setupMobileMenu() {
    // Add mobile menu toggle if needed
    const header = document.querySelector('.main-header');
    
    if (window.innerWidth <= 768) {
        // Mobile-specific functionality
        setupMobileNavigation();
    }
}

function setupMobileNavigation() {
    // Mobile navigation enhancements
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Close mobile menu after click (if applicable)
            console.log('Navigation clicked:', this.textContent);
        });
    });
}

// Utility Functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '600',
        zIndex: '10000',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease',
        backgroundColor: type === 'success' ? '#4CAF50' : 
                         type === 'error' ? '#f44336' : '#2196F3'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Local Storage Functions
function saveCartToStorage() {
    localStorage.setItem('fashionCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('fashionCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

function saveWishlistToStorage() {
    localStorage.setItem('fashionWishlist', JSON.stringify(wishlist));
}

function loadWishlistFromStorage() {
    const savedWishlist = localStorage.getItem('fashionWishlist');
    if (savedWishlist) {
        wishlist = JSON.parse(savedWishlist);
        updateWishlistUI();
    }
}

function updateWishlistUI() {
    // Update wishlist heart icons based on saved wishlist
    wishlist.forEach(item => {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            const title = card.querySelector('.product-title').textContent;
            if (title === item.title) {
                const heartIcon = card.querySelector('.wishlist-btn i');
                if (heartIcon) {
                    heartIcon.className = 'fas fa-heart';
                }
            }
        });
    });
}

// Smooth Scrolling for Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Load saved data on page load
window.addEventListener('load', function() {
    loadCartFromStorage();
    loadWishlistFromStorage();
});

// Responsive navigation enhancements
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        // Desktop view adjustments
    } else {
        // Mobile view adjustments
        setupMobileNavigation();
    }
});

// Export functions for potential external use
window.FashionMarketplace = {
    addToCart,
    addToWishlist,
    showNotification,
    filterProducts
};
