// Fashion Marketplace JavaScript

// Shopping Cart Functionality
let cart = [];
let wishlist = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    showFlashScreen();
});

// Flash Screen Functionality
function showFlashScreen() {
    const flashScreen = document.getElementById('flashScreen');

    // Hide flash screen after 3 seconds
    setTimeout(() => {
        flashScreen.classList.add('hidden');
        setTimeout(() => {
            flashScreen.style.display = 'none';
            initializeApp();
        }, 500);
    }, 3000);
}

function initializeApp() {
    setupEventListeners();
    updateCartCount();
    setupFilterTabs();
    setupProductCards();
    setupNewsletterForm();
    setupSearch();
    setupAuthentication();
    setupLocationServices();
    setupFashionStories();
    setupRecommendations();
    checkUserLocation();
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

    // Category cards (both old and new circular)
    const categoryCards = document.querySelectorAll('.category-card, .category-circle-card');
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

// Authentication Functionality
function setupAuthentication() {
    const profileIcon = document.getElementById('profileIcon');
    const authModal = document.getElementById('authModal');
    const closeAuth = document.querySelector('.close-auth');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');

    // Show auth modal when profile icon is clicked
    profileIcon.addEventListener('click', () => {
        authModal.classList.remove('hidden');
    });

    // Close modal
    closeAuth.addEventListener('click', () => {
        authModal.classList.add('hidden');
    });

    // Close on outside click
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.classList.add('hidden');
        }
    });

    // Tab switching
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;

            // Update active tab
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Show corresponding form
            authForms.forEach(form => {
                if (form.id === targetTab + 'Form') {
                    form.classList.add('active');
                } else {
                    form.classList.remove('active');
                }
            });
        });
    });

    // Form submissions
    const signinForm = document.getElementById('signinForm');
    const signupForm = document.getElementById('signupForm');

    signinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSignIn();
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSignUp();
    });

    // Social auth buttons
    const socialBtns = document.querySelectorAll('.social-btn');
    socialBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const provider = btn.classList.contains('google-btn') ? 'Google' : 'Apple';
            handleSocialAuth(provider);
        });
    });
}

function handleSignIn() {
    showNotification('Signing you in...', 'info');
    // Simulate API call
    setTimeout(() => {
        showNotification('Welcome back!', 'success');
        document.getElementById('authModal').classList.add('hidden');
        updateUIForLoggedInUser();
    }, 1500);
}

function handleSignUp() {
    showNotification('Creating your account...', 'info');
    // Simulate API call
    setTimeout(() => {
        showNotification('Account created successfully!', 'success');
        document.getElementById('authModal').classList.add('hidden');
        updateUIForLoggedInUser();
    }, 1500);
}

function handleSocialAuth(provider) {
    showNotification(`Connecting with ${provider}...`, 'info');
    setTimeout(() => {
        showNotification(`Successfully signed in with ${provider}!`, 'success');
        document.getElementById('authModal').classList.add('hidden');
        updateUIForLoggedInUser();
    }, 1500);
}

function updateUIForLoggedInUser() {
    const profileIcon = document.getElementById('profileIcon');
    profileIcon.className = 'fas fa-user profile-icon';
    profileIcon.style.color = '#4CAF50';
}

// Location Services
function setupLocationServices() {
    const locationModal = document.getElementById('locationModal');
    const closeLocation = document.querySelector('.close-location');
    const detectLocationBtn = document.querySelector('.detect-location-btn');
    const cityBtns = document.querySelectorAll('.city-btn');

    // Close modal
    closeLocation.addEventListener('click', () => {
        locationModal.classList.add('hidden');
    });

    // Detect location
    detectLocationBtn.addEventListener('click', () => {
        detectUserLocation();
    });

    // City selection
    cityBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const city = btn.textContent;
            setUserLocation(city);
            locationModal.classList.add('hidden');
        });
    });
}

function checkUserLocation() {
    const savedLocation = localStorage.getItem('userLocation');
    if (!savedLocation) {
        setTimeout(() => {
            document.getElementById('locationModal').classList.remove('hidden');
        }, 4000); // Show after flash screen
    }
}

function detectUserLocation() {
    if (navigator.geolocation) {
        showNotification('Detecting your location...', 'info');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Simulate reverse geocoding
                setTimeout(() => {
                    const city = 'New York'; // Simulated result
                    setUserLocation(city);
                    document.getElementById('locationModal').classList.add('hidden');
                }, 1500);
            },
            (error) => {
                showNotification('Unable to detect location. Please select manually.', 'error');
            }
        );
    }
}

function setUserLocation(city) {
    localStorage.setItem('userLocation', city);
    showNotification(`Location set to ${city}`, 'success');
    updateUIWithLocation(city);
}

function updateUIWithLocation(city) {
    // Update header or add location indicator
    const locationIndicator = document.createElement('span');
    locationIndicator.textContent = `📍 ${city}`;
    locationIndicator.className = 'location-indicator';
    locationIndicator.style.cssText = 'margin-left: 1rem; color: #666; font-size: 0.9rem;';

    const logo = document.querySelector('.logo');
    if (!document.querySelector('.location-indicator')) {
        logo.appendChild(locationIndicator);
    }
}

// Fashion Stories
function setupFashionStories() {
    const storyCards = document.querySelectorAll('.story-card');
    const storiesContainer = document.querySelector('.stories-container');

    // Add click handlers to story cards
    storyCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            handleStoryClick(card, index);
        });

        // Add story read indicator
        const storyTitle = card.querySelector('.story-title').textContent;
        if (localStorage.getItem(`story_read_${index}`)) {
            card.classList.add('story-read');
        }
    });

    // Add horizontal scroll with mouse wheel
    if (storiesContainer) {
        storiesContainer.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault();
                storiesContainer.scrollLeft += e.deltaY;
            }
        });
    }

    // Add scroll indicators
    addScrollIndicators();
}

function handleStoryClick(card, index) {
    const storyTitle = card.querySelector('.story-title').textContent;
    const storyDescription = card.querySelector('.story-description').textContent;

    // Mark story as read
    localStorage.setItem(`story_read_${index}`, 'true');
    card.classList.add('story-read');

    // Show story modal or navigate
    showStoryModal(storyTitle, storyDescription, index);

    showNotification(`Opening: ${storyTitle}`, 'info');
}

function showStoryModal(title, description, index) {
    const modal = document.createElement('div');
    modal.className = 'story-modal';
    modal.innerHTML = `
        <div class="story-modal-content">
            <span class="close-story-modal">&times;</span>
            <div class="story-modal-header">
                <h2>${title}</h2>
                <div class="story-progress">
                    <div class="story-progress-bar" style="width: 0%"></div>
                </div>
            </div>
            <div class="story-modal-body">
                <p>${description}</p>
                <div class="story-images">
                    <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&h=800&fit=crop"
                         alt="Fashion Story" class="story-modal-image">
                </div>
                <div class="story-actions">
                    <button class="story-action-btn like-btn">
                        <i class="far fa-heart"></i> Like
                    </button>
                    <button class="story-action-btn share-btn">
                        <i class="fas fa-share"></i> Share
                    </button>
                    <button class="story-action-btn save-btn">
                        <i class="far fa-bookmark"></i> Save
                    </button>
                </div>
            </div>
        </div>
    `;

    // Style the modal
    Object.assign(modal.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '10000'
    });

    document.body.appendChild(modal);

    // Progress bar animation
    const progressBar = modal.querySelector('.story-progress-bar');
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 2;
        progressBar.style.width = progress + '%';
        if (progress >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
                if (document.body.contains(modal)) {
                    document.body.removeChild(modal);
                }
            }, 500);
        }
    }, 100);

    // Close functionality
    const closeBtn = modal.querySelector('.close-story-modal');
    closeBtn.addEventListener('click', () => {
        clearInterval(progressInterval);
        document.body.removeChild(modal);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            clearInterval(progressInterval);
            document.body.removeChild(modal);
        }
    });

    // Action buttons
    const actionBtns = modal.querySelectorAll('.story-action-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = btn.classList.contains('like-btn') ? 'liked' :
                          btn.classList.contains('share-btn') ? 'shared' : 'saved';
            showNotification(`Story ${action}!`, 'success');
        });
    });
}

function addScrollIndicators() {
    const storiesContainer = document.querySelector('.stories-container');
    if (!storiesContainer) return;

    const leftIndicator = document.createElement('div');
    const rightIndicator = document.createElement('div');

    leftIndicator.className = 'scroll-indicator left';
    rightIndicator.className = 'scroll-indicator right';

    leftIndicator.innerHTML = '<i class="fas fa-chevron-left"></i>';
    rightIndicator.innerHTML = '<i class="fas fa-chevron-right"></i>';

    // Style indicators
    [leftIndicator, rightIndicator].forEach(indicator => {
        Object.assign(indicator.style, {
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '40px',
            height: '40px',
            background: 'rgba(0,0,0,0.5)',
            color: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: '10',
            transition: 'all 0.3s ease'
        });
    });

    leftIndicator.style.left = '10px';
    rightIndicator.style.right = '10px';

    const storiesSection = document.querySelector('.fashion-stories-section');
    storiesSection.style.position = 'relative';
    storiesSection.appendChild(leftIndicator);
    storiesSection.appendChild(rightIndicator);

    // Scroll functionality
    leftIndicator.addEventListener('click', () => {
        storiesContainer.scrollBy({ left: -300, behavior: 'smooth' });
    });

    rightIndicator.addEventListener('click', () => {
        storiesContainer.scrollBy({ left: 300, behavior: 'smooth' });
    });
}

// Recommendations
function setupRecommendations() {
    const recTabs = document.querySelectorAll('.rec-tab');

    recTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.dataset.category;

            // Update active tab
            recTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Filter recommendations
            filterRecommendations(category);
        });
    });
}

function filterRecommendations(category) {
    showNotification(`Loading ${category} recommendations...`, 'info');

    // Simulate API call and update recommendations
    setTimeout(() => {
        showNotification(`Updated recommendations for ${category}`, 'success');
    }, 1000);
}

// Enhanced filter tabs for New Arrivals
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
            filterNewArrivals(filter);
        });
    });
}

function filterNewArrivals(filter) {
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        let shouldShow = filter === 'all';

        if (!shouldShow) {
            // Show products based on time filter
            shouldShow = true; // For demo, show all products
        }

        card.style.display = shouldShow ? 'block' : 'none';
    });

    showNotification(`Showing ${filter} arrivals`, 'info');
}

// Export functions for potential external use
window.FashionMarketplace = {
    addToCart,
    addToWishlist,
    showNotification,
    filterProducts,
    handleSignIn,
    handleSignUp,
    setUserLocation
};
