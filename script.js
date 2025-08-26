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
    setupProfileDropdown();
    setupFashionStories();
    setupRecommendations();
    checkUserLocation();
    setupSeasonalCollections();
    setupTrendingSection();
    setupAdvancedSearch();
    setupVoiceSearch();
    setupFiltersAndSort();
    setupEnhancedNavigation();
    enableGuestBrowsing();
    setupHeroSlider();
}

// Event Listeners Setup
function setupEventListeners() {
    // Add to cart buttons (all types)
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn, .modern-add-to-cart, .colorful-add-to-cart');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', handleAddToCart);
    });

    // Wishlist buttons (all types)
    const wishlistBtns = document.querySelectorAll('.wishlist-btn, .modern-wishlist-btn, .colorful-wishlist-btn');
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

    // Product cards navigation
    setupProductNavigation();

    // Hero CTA button
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            showNotification('Welcome to StyleHub! Explore our collections below.', 'success');
            document.querySelector('.trending-popular-section').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    // Cart icon functionality
    const cartIcon = document.querySelector('.cart-icon-container');
    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification('Your cart is empty. Add some items!', 'info');
            } else {
                showCartSummary();
            }
        });
    }

    // Wishlist icon functionality
    const wishlistIcon = document.querySelector('.wishlist-icon');
    if (wishlistIcon) {
        wishlistIcon.addEventListener('click', () => {
            if (wishlist.length === 0) {
                showNotification('Your wishlist is empty. Add some favorites!', 'info');
            } else {
                showWishlistSummary();
            }
        });
    }

    // Mobile menu toggle (if needed)
    setupMobileMenu();
}

// Add to Cart Functionality
function handleAddToCart(event) {
    event.preventDefault();
    event.stopPropagation();

    const productCard = event.target.closest('.product-card, .modern-product-card, .colorful-product-card');
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
    let title, price, image;

    // Handle different card types
    if (productCard.classList.contains('colorful-product-card')) {
        title = productCard.querySelector('.colorful-product-title').textContent;
        price = productCard.querySelector('.current-price').textContent;
        image = productCard.querySelector('.colorful-product-img').src;
    } else if (productCard.classList.contains('modern-product-card')) {
        title = productCard.querySelector('.modern-product-title').textContent;
        price = productCard.querySelector('.modern-product-price').textContent;
        image = productCard.querySelector('.modern-product-img').src;
    } else {
        title = productCard.querySelector('.product-title').textContent;
        price = productCard.querySelector('.current-price').textContent;
        image = productCard.querySelector('.product-image').src;
    }

    return {
        id: Date.now() + Math.random(), // Simple ID generation
        title: title,
        price: price,
        image: image,
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
        if (cartCount > 0) {
            cartCountElement.style.transform = 'scale(1.2)';
            cartCountElement.style.backgroundColor = '#4CAF50';
            setTimeout(() => {
                cartCountElement.style.transform = 'scale(1)';
                cartCountElement.style.backgroundColor = '#000';
            }, 200);
        }
    }
}

// Wishlist Functionality
function handleWishlist(event) {
    event.preventDefault();
    event.stopPropagation();

    const productCard = event.target.closest('.product-card, .modern-product-card, .colorful-product-card');
    const product = extractProductData(productCard);
    const wishlistBtn = event.target.closest('.wishlist-btn, .modern-wishlist-btn, .colorful-wishlist-btn');
    const heartIcon = wishlistBtn.querySelector('i');

    const isInWishlist = wishlist.some(item => item.title === product.title);

    if (isInWishlist) {
        removeFromWishlist(product.title);
        heartIcon.className = 'far fa-heart';
        // Reset button styling for colorful cards
        if (wishlistBtn.classList.contains('colorful-wishlist-btn')) {
            wishlistBtn.style.background = 'rgba(255,255,255,0.9)';
            wishlistBtn.style.color = '#666';
        }
        showNotification(`${product.title} removed from wishlist`, 'info');
    } else {
        addToWishlist(product);
        heartIcon.className = 'fas fa-heart';
        // Apply active styling for colorful cards
        if (wishlistBtn.classList.contains('colorful-wishlist-btn')) {
            wishlistBtn.style.background = '#ff6b6b';
            wishlistBtn.style.color = 'white';
        }
        showNotification(`${product.title} added to wishlist!`, 'success');
    }

    // Add animation
    wishlistBtn.style.transform = 'scale(1.2)';
    setTimeout(() => {
        wishlistBtn.style.transform = 'scale(1)';
    }, 200);
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

// Newsletter Form - functionality handled in enhanced version below

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
    const productCards = document.querySelectorAll('.product-card, .modern-product-card, .colorful-product-card');

    productCards.forEach(card => {
        let title = '';

        // Handle different card types
        if (card.classList.contains('colorful-product-card')) {
            title = card.querySelector('.colorful-product-title').textContent.toLowerCase();
        } else if (card.classList.contains('modern-product-card')) {
            title = card.querySelector('.modern-product-title').textContent.toLowerCase();
        } else {
            title = card.querySelector('.product-title').textContent.toLowerCase();
        }

        const matches = title.includes(searchTerm);
        card.style.display = matches ? 'block' : 'none';
    });

    if (searchTerm) {
        showNotification(`Searching for: "${searchTerm}"`, 'info');
    }
}

// Category Click Handler
function handleCategoryClick(event) {
    const categoryTitle = event.currentTarget.querySelector('.category-title, .category-circle-title');
    const title = categoryTitle ? categoryTitle.textContent : 'Unknown';
    showNotification(`Browsing ${title} category`, 'info');

    // Add category filtering logic here
    filterByCategory(title.toLowerCase());

    // Add visual feedback
    event.currentTarget.style.transform = 'scale(0.95)';
    setTimeout(() => {
        event.currentTarget.style.transform = '';
    }, 150);
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
    const locationTrigger = document.getElementById('locationTrigger');
    const closeLocation = document.querySelector('.close-location');
    const detectLocationBtn = document.querySelector('.detect-location-btn');
    const cityBtns = document.querySelectorAll('.city-btn');

    // Show modal when location trigger is clicked
    locationTrigger.addEventListener('click', () => {
        locationModal.classList.remove('hidden');
    });

    // Close modal
    closeLocation.addEventListener('click', () => {
        locationModal.classList.add('hidden');
    });

    // Close on outside click
    locationModal.addEventListener('click', (e) => {
        if (e.target === locationModal) {
            locationModal.classList.add('hidden');
        }
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
    if (savedLocation) {
        updateUIWithLocation(savedLocation);
    }
    // No automatic popup - user must click location trigger to open modal
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
    // Update the location trigger text
    const locationText = document.querySelector('.location-text');
    if (locationText) {
        locationText.textContent = city;
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

            // Add visual feedback
            tab.style.transform = 'scale(0.98)';
            setTimeout(() => {
                tab.style.transform = '';
            }, 150);

            // Filter recommendations with animation
            filterRecommendations(category);

            showNotification(`Loading ${category} recommendations...`, 'info');
        });
    });

    // Add wishlist functionality to modern cards
    setupWishlistButtons();
    setupAddToCartButtons();
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

// Seasonal Collections
function setupSeasonalCollections() {
    const seasonalCards = document.querySelectorAll('.seasonal-card');
    const seasonalButtons = document.querySelectorAll('.seasonal-card-button');

    seasonalCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('.seasonal-card-title').textContent;
            showNotification(`Browsing ${title}`, 'info');

            // Add click animation
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.transform = '';
            }, 150);
        });
    });

    // Handle seasonal collection buttons
    seasonalButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const title = button.closest('.seasonal-card').querySelector('.seasonal-card-title').textContent;
            showNotification(`Shopping ${title} - Coming Soon!`, 'success');
        });
    });
}

// Trending Section
function setupTrendingSection() {
    const trendingTabs = document.querySelectorAll('.trending-tab');

    trendingTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const trend = tab.dataset.trend;

            // Update active tab
            trendingTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Add visual feedback
            tab.style.transform = 'scale(0.95)';
            setTimeout(() => {
                tab.style.transform = '';
            }, 150);

            showNotification(`Showing ${tab.textContent}`, 'success');
        });
    });

    // Add enhanced interaction for product cards
    const productCards = document.querySelectorAll('.modern-product-card');
    productCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.modern-wishlist-btn') && !e.target.closest('.modern-add-to-cart')) {
                // Product card click for quick view
                const productName = card.querySelector('.modern-product-title').textContent;
                showNotification(`Viewing ${productName}`, 'info');
            }
        });
    });
}

function filterTrendingItems(trend) {
    const trendingItems = document.querySelectorAll('.trending-item');

    trendingItems.forEach(item => {
        const badge = item.querySelector('.trending-badge');
        let shouldShow = true;

        if (trend === 'hot') {
            shouldShow = badge.classList.contains('hot');
        } else if (trend === 'viewed') {
            shouldShow = badge.classList.contains('viewed');
        } else if (trend === 'sellers') {
            shouldShow = badge.classList.contains('seller');
        }

        item.style.display = shouldShow ? 'block' : 'none';
    });
}

function updateTrendingStats() {
    const trendingItems = document.querySelectorAll('.trending-item');

    trendingItems.forEach(item => {
        const viewsElement = item.querySelector('.views');
        const salesElement = item.querySelector('.sales');

        if (viewsElement && salesElement) {
            // Simulate real-time updates
            const currentViews = parseInt(viewsElement.textContent.match(/\d+/)[0]);
            const currentSales = parseInt(salesElement.textContent.match(/\d+/)[0]);

            const newViews = currentViews + Math.floor(Math.random() * 10);
            const newSales = currentSales + Math.floor(Math.random() * 3);

            viewsElement.textContent = `👁️ ${newViews.toLocaleString()} views`;
            salesElement.textContent = `��� ${newSales} sold today`;
        }
    });
}

// Advanced Search with Predictions
function setupAdvancedSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchSuggestions = document.getElementById('searchSuggestions');

    const suggestions = [
        'Women\'s Dresses', 'Men\'s Jackets', 'Nike Sneakers', 'Zara Tops',
        'Designer Handbags', 'Summer Collection', 'Winter Coats', 'Formal Shoes',
        'Casual Wear', 'Party Dresses', 'Workout Clothes', 'Vintage Style'
    ];

    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();

        if (query.length > 0) {
            const filteredSuggestions = suggestions.filter(item =>
                item.toLowerCase().includes(query)
            );

            if (filteredSuggestions.length > 0) {
                showSearchSuggestions(filteredSuggestions);
            } else {
                hideSearchSuggestions();
            }
        } else {
            hideSearchSuggestions();
        }
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
            hideSearchSuggestions();
        }
    });
}

function showSearchSuggestions(suggestions) {
    const searchSuggestions = document.getElementById('searchSuggestions');

    searchSuggestions.innerHTML = suggestions.map(suggestion =>
        `<div class="suggestion-item" onclick="selectSuggestion('${suggestion}')">${suggestion}</div>`
    ).join('');

    searchSuggestions.classList.add('visible');
}

function hideSearchSuggestions() {
    const searchSuggestions = document.getElementById('searchSuggestions');
    searchSuggestions.classList.remove('visible');
}

function selectSuggestion(suggestion) {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = suggestion;
    hideSearchSuggestions();
    showNotification(`Searching for: ${suggestion}`, 'info');
}

// Voice Search
function setupVoiceSearch() {
    const voiceSearchBtn = document.getElementById('voiceSearchBtn');
    const searchInput = document.getElementById('searchInput');

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        voiceSearchBtn.addEventListener('click', () => {
            startVoiceSearch(recognition, voiceSearchBtn, searchInput);
        });

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            searchInput.value = transcript;
            showNotification(`Voice search: ${transcript}`, 'success');
            voiceSearchBtn.classList.remove('listening');
        };

        recognition.onerror = () => {
            showNotification('Voice search error. Please try again.', 'error');
            voiceSearchBtn.classList.remove('listening');
        };

        recognition.onend = () => {
            voiceSearchBtn.classList.remove('listening');
        };
    } else {
        voiceSearchBtn.style.display = 'none';
    }
}

function startVoiceSearch(recognition, button, input) {
    button.classList.add('listening');
    showNotification('Listening... Speak now!', 'info');
    recognition.start();
}

// Filters and Sort
function setupFiltersAndSort() {
    const filtersToggle = document.getElementById('filtersToggle');
    const filtersPanel = document.getElementById('filtersPanel');
    const sortSelect = document.getElementById('sortSelect');
    const priceRange = document.getElementById('priceRange');
    const currentPrice = document.getElementById('currentPrice');

    // Toggle filters panel
    filtersToggle.addEventListener('click', () => {
        filtersPanel.classList.toggle('open');
    });

    // Sort functionality
    sortSelect.addEventListener('change', (e) => {
        const sortBy = e.target.value;
        sortProducts(sortBy);
        showNotification(`Sorted by: ${e.target.options[e.target.selectedIndex].text}`, 'info');
    });

    // Price range
    if (priceRange && currentPrice) {
        priceRange.addEventListener('input', (e) => {
            currentPrice.textContent = `$${e.target.value}`;
        });
    }

    // Filter options
    setupFilterOptions();
}

function setupFilterOptions() {
    // Size filters
    const sizeOptions = document.querySelectorAll('.size-options .filter-option');
    sizeOptions.forEach(option => {
        option.addEventListener('click', () => {
            option.classList.toggle('active');
            updateActiveFilters();
        });
    });

    // Color filters
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            option.classList.toggle('active');
            updateActiveFilters();
        });
    });

    // Brand filters
    const brandCheckboxes = document.querySelectorAll('.brand-options input');
    brandCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateActiveFilters);
    });

    // Clear and apply filters
    const clearBtn = document.querySelector('.clear-filters-btn');
    const applyBtn = document.querySelector('.apply-filters-btn');

    if (clearBtn) {
        clearBtn.addEventListener('click', clearAllFilters);
    }

    if (applyBtn) {
        applyBtn.addEventListener('click', applyFilters);
    }
}

function updateActiveFilters() {
    const activeFiltersContainer = document.getElementById('activeFilters');
    const activeFilters = [];

    // Get active size filters
    document.querySelectorAll('.size-options .filter-option.active').forEach(option => {
        activeFilters.push({type: 'size', value: option.textContent});
    });

    // Get active color filters
    document.querySelectorAll('.color-option.active').forEach(option => {
        activeFilters.push({type: 'color', value: option.dataset.color});
    });

    // Get active brand filters
    document.querySelectorAll('.brand-options input:checked').forEach(checkbox => {
        activeFilters.push({type: 'brand', value: checkbox.value});
    });

    // Display active filters
    activeFiltersContainer.innerHTML = activeFilters.map(filter =>
        `<span class="active-filter">${filter.value} <span class="remove" onclick="removeFilter('${filter.type}', '${filter.value}')">×</span></span>`
    ).join('');
}

function removeFilter(type, value) {
    // Remove specific filter based on type and value
    if (type === 'size') {
        document.querySelectorAll('.size-options .filter-option').forEach(option => {
            if (option.textContent === value) {
                option.classList.remove('active');
            }
        });
    } else if (type === 'color') {
        document.querySelectorAll('.color-option').forEach(option => {
            if (option.dataset.color === value) {
                option.classList.remove('active');
            }
        });
    } else if (type === 'brand') {
        document.querySelectorAll('.brand-options input').forEach(checkbox => {
            if (checkbox.value === value) {
                checkbox.checked = false;
            }
        });
    }

    updateActiveFilters();
    showNotification(`Removed ${value} filter`, 'info');
}

function clearAllFilters() {
    // Clear all active filters
    document.querySelectorAll('.filter-option.active').forEach(option => {
        option.classList.remove('active');
    });
    document.querySelectorAll('.color-option.active').forEach(option => {
        option.classList.remove('active');
    });
    document.querySelectorAll('.brand-options input:checked').forEach(checkbox => {
        checkbox.checked = false;
    });

    updateActiveFilters();
    showNotification('All filters cleared', 'info');
}

function applyFilters() {
    // Apply current filters to product display
    showNotification('Filters applied successfully!', 'success');
    document.getElementById('filtersPanel').classList.remove('open');
}

function sortProducts(sortBy) {
    // Implement product sorting logic
    const productCards = document.querySelectorAll('.product-card');
    const productsArray = Array.from(productCards);

    productsArray.sort((a, b) => {
        switch(sortBy) {
            case 'price-low':
                return getPrice(a) - getPrice(b);
            case 'price-high':
                return getPrice(b) - getPrice(a);
            case 'rating':
                return getRating(b) - getRating(a);
            default:
                return 0;
        }
    });

    // Re-append sorted products
    const container = document.querySelector('.products-grid');
    productsArray.forEach(card => container.appendChild(card));
}

function getPrice(productCard) {
    const priceText = productCard.querySelector('.current-price').textContent;
    return parseInt(priceText.replace(/[^0-9]/g, ''));
}

function getRating(productCard) {
    const stars = productCard.querySelectorAll('.stars .fas').length;
    return stars;
}

// Enhanced Navigation
function setupEnhancedNavigation() {
    // Mobile menu handling and dropdown functionality is already handled by CSS
    // Additional JavaScript for mobile responsiveness if needed
}

// Guest Browsing
function enableGuestBrowsing() {
    // Allow all browsing functionality without login requirement
    // Override any login checks for browsing features
    window.guestMode = true;
    showNotification('Browse as guest - Full access enabled!', 'success');
}

// Enhanced Wishlist Functionality for Modern Cards
function setupWishlistButtons() {
    const wishlistBtns = document.querySelectorAll('.modern-wishlist-btn');

    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = e.target.closest('.modern-product-card');
            const productName = card.querySelector('.modern-product-title').textContent;
            const icon = btn.querySelector('i');

            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                btn.style.background = 'linear-gradient(135deg, #ff6b6b, #ff8a80)';
                btn.style.color = 'white';
                showNotification(`${productName} added to wishlist!`, 'success');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                btn.style.background = 'white';
                btn.style.color = '#666';
                showNotification(`${productName} removed from wishlist`, 'info');
            }

            // Add animation
            btn.style.transform = 'scale(1.2)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 200);
        });
    });
}

// Enhanced Add to Cart Functionality for Modern Cards
function setupAddToCartButtons() {
    const addToCartBtns = document.querySelectorAll('.modern-add-to-cart');

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = e.target.closest('.modern-product-card');
            const productName = card.querySelector('.modern-product-title').textContent;
            const productPrice = card.querySelector('.modern-product-price').textContent;

            // Add to cart logic
            const product = {
                id: Date.now() + Math.random(),
                title: productName,
                price: productPrice,
                quantity: 1
            };

            addToCart(product);

            // Button animation
            const originalText = btn.textContent;
            btn.textContent = 'Added!';
            btn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = 'linear-gradient(135deg, #ff6b6b, #4ecdc4)';
            }, 1500);

            showNotification(`${productName} added to cart!`, 'success');
        });
    });
}

// Enhanced Filter Functionality
function setupEnhancedFilters() {
    const filterToggleBtn = document.getElementById('filterToggleBtn');
    const sortDropdown = document.getElementById('sortDropdown');

    if (filterToggleBtn) {
        filterToggleBtn.addEventListener('click', () => {
            showNotification('Filter options: Price, Size, Color, Brand - Coming Soon!', 'info');

            // Add visual feedback
            filterToggleBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                filterToggleBtn.style.transform = 'scale(1)';
            }, 150);
        });
    }

    if (sortDropdown) {
        sortDropdown.addEventListener('change', (e) => {
            const sortValue = e.target.value;
            showNotification(`Products sorted by: ${e.target.options[e.target.selectedIndex].text}`, 'success');
            // Add visual feedback to dropdown
            sortDropdown.style.borderColor = '#4CAF50';
            setTimeout(() => {
                sortDropdown.style.borderColor = '';
            }, 1000);
        });
    }
}

// Profile Dropdown Functionality
function setupProfileDropdown() {
    const profileTrigger = document.getElementById('profileTrigger');
    const profileDropdown = document.getElementById('profileDropdown');
    const profileArrow = document.getElementById('profileArrow');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const statusIndicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    const onlineStatus = document.getElementById('onlineStatus');

    // Exit early if required elements don't exist
    if (!profileTrigger || !profileDropdown) {
        console.log('Profile dropdown elements not found, skipping setup');
        return;
    }

    // Initialize user status
    updateUserStatus('online');

    // Toggle dropdown on click
    profileTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleProfileDropdown();
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!profileTrigger.contains(e.target) && !profileDropdown.contains(e.target)) {
            closeProfileDropdown();
        }
    });

    // Handle dropdown menu items
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            handleDropdownItemClick(item);
        });
    });

    // Simulate status changes every 30 seconds for demo
    setInterval(() => {
        const statuses = ['online', 'away', 'busy'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        updateUserStatus(randomStatus);
    }, 30000);
}

function toggleProfileDropdown() {
    const profileTrigger = document.getElementById('profileTrigger');
    const profileDropdown = document.getElementById('profileDropdown');
    const profileArrow = document.getElementById('profileArrow');

    const isOpen = profileDropdown.classList.contains('show');

    if (isOpen) {
        closeProfileDropdown();
    } else {
        openProfileDropdown();
    }
}

function openProfileDropdown() {
    const profileTrigger = document.getElementById('profileTrigger');
    const profileDropdown = document.getElementById('profileDropdown');
    const profileArrow = document.getElementById('profileArrow');

    profileTrigger.classList.add('active');
    profileDropdown.classList.add('show');
    profileArrow.style.transform = 'rotate(180deg)';

    // Add animation delay for menu items
    const menuItems = document.querySelectorAll('.dropdown-item');
    menuItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
            item.style.transition = 'all 0.3s ease';
        }, index * 50);
    });
}

function closeProfileDropdown() {
    const profileTrigger = document.getElementById('profileTrigger');
    const profileDropdown = document.getElementById('profileDropdown');
    const profileArrow = document.getElementById('profileArrow');

    profileTrigger.classList.remove('active');
    profileDropdown.classList.remove('show');
    profileArrow.style.transform = 'rotate(0deg)';

    // Reset menu items animation
    const menuItems = document.querySelectorAll('.dropdown-item');
    menuItems.forEach(item => {
        item.style.opacity = '';
        item.style.transform = '';
        item.style.transition = '';
    });
}

function updateUserStatus(status) {
    const statusIndicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    const onlineStatus = document.getElementById('onlineStatus');

    // Remove all status classes
    statusIndicator.className = 'status-indicator';
    onlineStatus.className = 'online-status';

    // Add new status class
    if (status !== 'online') {
        statusIndicator.classList.add(status);
        onlineStatus.classList.add(status);
    }

    // Update status text
    const statusTexts = {
        'online': 'Online',
        'away': 'Away',
        'busy': 'Busy',
        'offline': 'Offline'
    };

    statusText.textContent = statusTexts[status] || 'Online';
    onlineStatus.title = statusTexts[status] || 'Online';

    // Show notification when status changes
    if (status !== 'online') {
        showNotification(`Status changed to ${statusTexts[status]}`, 'info');
    }
}

function handleDropdownItemClick(item) {
    const itemId = item.id;
    const itemText = item.querySelector('span').textContent;

    switch(itemId) {
        case 'myProfile':
            showNotification('Opening My Profile...', 'info');
            // Navigate to profile page or show profile modal
            showProfileModal();
            break;

        case 'myOrders':
            showNotification('Opening My Orders...', 'info');
            // Navigate to orders page
            showOrdersModal();
            break;

        case 'myWishlist':
            showNotification('Opening My Wishlist...', 'info');
            showWishlistSummary();
            break;

        case 'accountSettings':
            showNotification('Opening Account Settings...', 'info');
            showAccountSettingsModal();
            break;

        case 'helpSupport':
            showNotification('Opening Help & Support...', 'info');
            showHelpModal();
            break;

        case 'signInOut':
            const signInOutText = document.getElementById('signInOutText');
            if (signInOutText.textContent === 'Sign Out') {
                handleSignOut();
            } else {
                showNotification('Please sign in to access your account', 'info');
                // Show auth modal
                document.getElementById('authModal').classList.remove('hidden');
            }
            break;

        default:
            showNotification(`${itemText} clicked`, 'info');
            break;
    }

    // Close dropdown after item click
    closeProfileDropdown();

    // Add click feedback animation
    item.style.transform = 'scale(0.95)';
    setTimeout(() => {
        item.style.transform = '';
    }, 150);
}

function showProfileModal() {
    const modal = document.createElement('div');
    modal.className = 'profile-modal';
    modal.innerHTML = `
        <div class="profile-modal-content">
            <span class="close-profile-modal">&times;</span>
            <div class="profile-modal-header">
                <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face" alt="Profile" class="profile-modal-avatar">
                <h2>Sarah Johnson</h2>
                <p>sarah.johnson@stylehub.com</p>
                <div class="profile-status-selector">
                    <label>Status:</label>
                    <select id="statusSelector">
                        <option value="online">Online</option>
                        <option value="away">Away</option>
                        <option value="busy">Busy</option>
                        <option value="offline">Offline</option>
                    </select>
                </div>
            </div>
            <div class="profile-modal-body">
                <div class="profile-stats">
                    <div class="stat-item">
                        <span class="stat-number">23</span>
                        <span class="stat-label">Orders</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">45</span>
                        <span class="stat-label">Wishlist Items</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">₹25,680</span>
                        <span class="stat-label">Total Spent</span>
                    </div>
                </div>
                <div class="profile-actions">
                    <button class="profile-action-btn">Edit Profile</button>
                    <button class="profile-action-btn">Change Password</button>
                    <button class="profile-action-btn">Privacy Settings</button>
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
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '10000'
    });

    document.body.appendChild(modal);

    // Close functionality
    const closeBtn = modal.querySelector('.close-profile-modal');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });

    // Status selector functionality
    const statusSelector = modal.querySelector('#statusSelector');
    statusSelector.addEventListener('change', (e) => {
        updateUserStatus(e.target.value);
        showNotification(`Status updated to ${e.target.options[e.target.selectedIndex].text}`, 'success');
    });

    // Profile action buttons
    const actionBtns = modal.querySelectorAll('.profile-action-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            showNotification(`${btn.textContent} - Coming Soon!`, 'info');
        });
    });
}

function showOrdersModal() {
    const modal = document.createElement('div');
    modal.className = 'orders-modal';
    modal.innerHTML = `
        <div class="orders-modal-content">
            <span class="close-orders-modal">&times;</span>
            <h2>My Orders</h2>
            <div class="orders-list">
                <div class="order-item">
                    <div class="order-image">
                        <img src="https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F9915d20cfed848ec961a57e0b81de98d?format=webp&width=200" alt="Order">
                    </div>
                    <div class="order-details">
                        <h3>Traditional Salwar Kameez Set</h3>
                        <p>Order #12345 • Delivered on Dec 15, 2024</p>
                        <p class="order-price">₹2,499</p>
                    </div>
                    <div class="order-actions">
                        <button class="order-action-btn">Track Order</button>
                        <button class="order-action-btn">Reorder</button>
                    </div>
                </div>
                <div class="order-item">
                    <div class="order-image">
                        <img src="https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F5de41452e8644ee380a72e38d6a74b25?format=webp&width=200" alt="Order">
                    </div>
                    <div class="order-details">
                        <h3>Designer Anarkali Gown</h3>
                        <p>Order #12344 • In Transit</p>
                        <p class="order-price">₹3,999</p>
                    </div>
                    <div class="order-actions">
                        <button class="order-action-btn primary">Track Order</button>
                        <button class="order-action-btn">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    showModal(modal);
}

function showAccountSettingsModal() {
    const modal = document.createElement('div');
    modal.className = 'settings-modal';
    modal.innerHTML = `
        <div class="settings-modal-content">
            <span class="close-settings-modal">&times;</span>
            <h2>Account Settings</h2>
            <div class="settings-sections">
                <div class="settings-section">
                    <h3>Personal Information</h3>
                    <div class="settings-item">
                        <label>Full Name</label>
                        <input type="text" value="Sarah Johnson" />
                    </div>
                    <div class="settings-item">
                        <label>Email</label>
                        <input type="email" value="sarah.johnson@stylehub.com" />
                    </div>
                    <div class="settings-item">
                        <label>Phone</label>
                        <input type="tel" value="+1 (555) 123-4567" />
                    </div>
                </div>
                <div class="settings-section">
                    <h3>Preferences</h3>
                    <div class="settings-item">
                        <label>Email Notifications</label>
                        <input type="checkbox" checked />
                    </div>
                    <div class="settings-item">
                        <label>SMS Notifications</label>
                        <input type="checkbox" />
                    </div>
                    <div class="settings-item">
                        <label>Marketing Emails</label>
                        <input type="checkbox" checked />
                    </div>
                </div>
            </div>
            <div class="settings-actions">
                <button class="settings-action-btn primary">Save Changes</button>
                <button class="settings-action-btn">Cancel</button>
            </div>
        </div>
    `;

    showModal(modal);
}

function showHelpModal() {
    const modal = document.createElement('div');
    modal.className = 'help-modal';
    modal.innerHTML = `
        <div class="help-modal-content">
            <span class="close-help-modal">&times;</span>
            <h2>Help & Support</h2>
            <div class="help-sections">
                <div class="help-section">
                    <h3>Frequently Asked Questions</h3>
                    <div class="faq-item">
                        <button class="faq-question">How do I track my order?</button>
                        <div class="faq-answer">You can track your order in the "My Orders" section or using the tracking link sent to your email.</div>
                    </div>
                    <div class="faq-item">
                        <button class="faq-question">What is your return policy?</button>
                        <div class="faq-answer">We offer 30-day returns for unworn items with original tags.</div>
                    </div>
                    <div class="faq-item">
                        <button class="faq-question">How do I change my password?</button>
                        <div class="faq-answer">Go to Account Settings and click on "Change Password".</div>
                    </div>
                </div>
                <div class="help-section">
                    <h3>Contact Support</h3>
                    <div class="contact-options">
                        <button class="contact-btn">
                            <i class="fas fa-phone"></i>
                            Call Us: 1-800-STYLE-HUB
                        </button>
                        <button class="contact-btn">
                            <i class="fas fa-envelope"></i>
                            Email: support@stylehub.com
                        </button>
                        <button class="contact-btn">
                            <i class="fas fa-comments"></i>
                            Live Chat
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    showModal(modal);

    // FAQ functionality
    const faqQuestions = modal.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
        });
    });
}

function showModal(modal) {
    // Style the modal
    Object.assign(modal.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '10000',
        opacity: '0',
        transition: 'opacity 0.3s ease'
    });

    document.body.appendChild(modal);

    // Animate in
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);

    // Close functionality
    const closeBtn = modal.querySelector('[class*="close-"]');
    closeBtn.addEventListener('click', () => {
        modal.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        }
    });
}

function handleSignOut() {
    showNotification('Signing out...', 'info');

    setTimeout(() => {
        // Reset user data
        document.getElementById('userName').textContent = 'Guest User';
        document.getElementById('userEmail').textContent = 'guest@stylehub.com';
        document.getElementById('signInOutText').textContent = 'Sign In';
        updateUserStatus('offline');

        showNotification('Successfully signed out!', 'success');
        closeProfileDropdown();
    }, 1000);
}

// Enhanced Category Circle Functionality
function setupEnhancedCategories() {
    const categoryCards = document.querySelectorAll('.category-circle-card');

    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const categoryTitle = card.querySelector('.category-circle-title').textContent;

            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255,255,255,0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;

            const rect = card.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            ripple.style.transform = 'translate(-50%, -50%) scale(0)';

            card.style.position = 'relative';
            card.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);

            showNotification(`Browsing ${categoryTitle} category`, 'info');
        });
    });
}

// Initialize all enhanced features
function initializeEnhancedFeatures() {
    setupWishlistButtons();
    setupAddToCartButtons();
    setupEnhancedFilters();
    setupEnhancedCategories();

    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: translate(-50%, -50%) scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Call enhanced features after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializeEnhancedFeatures, 100);
});

// Cart Summary Function
function showCartSummary() {
    const total = cart.reduce((sum, item) => {
        const price = parseFloat(item.price.replace('$', ''));
        return sum + (price * item.quantity);
    }, 0);

    const cartItems = cart.map(item =>
        `${item.title} (${item.quantity}x) - ${item.price}`
    ).join('\n');

    showNotification(`Cart Items:\n${cartItems}\n\nTotal: $${total.toFixed(2)}`, 'success');
}

// Wishlist Summary Function
function showWishlistSummary() {
    const wishlistItems = wishlist.map(item => item.title).join('\n');
    showNotification(`Wishlist Items:\n${wishlistItems}\n\n${wishlist.length} items saved`, 'success');
}

// Newsletter functionality enhancement
function setupNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    const newsletterInput = document.querySelector('.newsletter-input');
    const newsletterBtn = document.querySelector('.newsletter-button');

    if (newsletterBtn) {
        newsletterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const email = newsletterInput.value.trim();

            if (validateEmail(email)) {
                showNotification('Thank you for subscribing to StyleHub newsletter!', 'success');
                newsletterInput.value = '';

                // Add visual feedback
                newsletterBtn.textContent = 'Subscribed!';
                newsletterBtn.style.background = '#4CAF50';
                setTimeout(() => {
                    newsletterBtn.textContent = 'Subscribe';
                    newsletterBtn.style.background = '';
                }, 2000);
            } else {
                showNotification('Please enter a valid email address', 'error');
            }
        });

        // Enter key support
        newsletterInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                newsletterBtn.click();
            }
        });
    }
}

// Product Navigation Setup
function setupProductNavigation() {
    const productCards = document.querySelectorAll('.product-card, .modern-product-card, .colorful-product-card');

    productCards.forEach(card => {
        // Make entire card clickable except for buttons
        card.addEventListener('click', (e) => {
            // Don't navigate if clicking on buttons
            if (e.target.closest('button')) {
                return;
            }

            const productData = extractProductDataForNavigation(card);
            navigateToProductDetail(productData);
        });

        // Add hover effect to indicate clickability
        card.style.cursor = 'pointer';
    });
}

function extractProductDataForNavigation(productCard) {
    let title, price, image, brand = 'StyleHub';

    // Handle different card types
    if (productCard.classList.contains('colorful-product-card')) {
        title = productCard.querySelector('.colorful-product-title').textContent;
        const currentPriceEl = productCard.querySelector('.current-price');
        const originalPriceEl = productCard.querySelector('.original-price');

        price = currentPriceEl ? parseInt(currentPriceEl.textContent.replace('$', '')) : 250;
        const originalPrice = originalPriceEl ? parseInt(originalPriceEl.textContent.replace('$', '')) : price + 50;

        image = productCard.querySelector('.colorful-product-img').src;

        return {
            title,
            currentPrice: price,
            originalPrice: originalPrice,
            image,
            brand,
            tagline: getTaglineForProduct(title),
            discount: Math.round(((originalPrice - price) / originalPrice) * 100)
        };
    } else if (productCard.classList.contains('modern-product-card')) {
        title = productCard.querySelector('.modern-product-title').textContent;
        price = parseInt(productCard.querySelector('.modern-product-price').textContent.replace('$', ''));
        image = productCard.querySelector('.modern-product-img').src;

        return {
            title,
            currentPrice: price,
            originalPrice: price + 50,
            image,
            brand,
            tagline: getTaglineForProduct(title),
            discount: Math.round((50 / (price + 50)) * 100)
        };
    } else {
        // Regular product card
        title = productCard.querySelector('.product-title')?.textContent || 'Fashion Item';
        const currentPriceEl = productCard.querySelector('.current-price');
        price = currentPriceEl ? parseInt(currentPriceEl.textContent.replace('$', '')) : 200;
        image = productCard.querySelector('.product-image, img')?.src || '';

        return {
            title,
            currentPrice: price,
            originalPrice: price + 40,
            image,
            brand,
            tagline: getTaglineForProduct(title),
            discount: Math.round((40 / (price + 40)) * 100)
        };
    }
}

function getTaglineForProduct(title) {
    const taglines = {
        'Traditional Salwar Kameez Set': 'Elegant Traditional Wear for Special Occasions',
        'Designer Anarkali Gown': 'Flowing Grace with Exquisite Embroidery',
        'Embroidered Kurta Set': 'Contemporary Style with Traditional Touch',
        'Navy Embroidered Anarkali Gown': 'Royal Elegance in Rich Navy Blue',
        'Golden Yellow Lehenga Set': 'Radiant Beauty for Festive Celebrations',
        'Premium Navy Formal Shirt': 'Professional Style for Modern Men',
        'Teal Cotton Casual Shirt': 'Comfortable Casual Wear for Every Day',
        'Mustard Yellow Anarkali Dress': 'Vibrant Colors for Joyful Occasions',
        'Traditional Red Silk Saree': 'Timeless Grace in Pure Silk',
        'Silk Blend Maxi Dress': 'Luxurious Comfort for Special Events',
        'Traditional Anarkali Set': 'Classic Design with Modern Fit',
        'Designer Footwear Collection': 'Step in Style with Premium Comfort'
    };

    return taglines[title] || 'Premium Fashion for Every Occasion';
}

function navigateToProductDetail(productData) {
    // Show loading notification
    showNotification(`Loading ${productData.title}...`, 'info');

    // Create URL with product data
    const productParam = encodeURIComponent(JSON.stringify(productData));
    const url = `product-detail.html?product=${productParam}`;

    // Navigate to product detail page
    setTimeout(() => {
        window.location.href = url;
    }, 500);
}

// Export functions for potential external use
window.FashionMarketplace = {
    addToCart,
    addToWishlist,
    showNotification,
    filterProducts,
    handleSignIn,
    handleSignUp,
    setUserLocation,
    selectSuggestion,
    removeFilter,
    clearAllFilters,
    applyFilters,
    setupWishlistButtons,
    setupAddToCartButtons,
    showCartSummary,
    showWishlistSummary,
    navigateToProductDetail
};

// Hero Slider Functionality
let currentSlideIndex = 0;
let slideInterval;

function setupHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');

    if (slides.length === 0) return;

    // Start auto-slide
    startAutoSlide();

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            changeSlide(-1);
        } else if (e.key === 'ArrowRight') {
            changeSlide(1);
        }
    });

    // Pause auto-slide on hover
    const sliderContainer = document.querySelector('.hero-slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopAutoSlide);
        sliderContainer.addEventListener('mouseleave', startAutoSlide);
    }

    // Touch/swipe support for mobile
    setupTouchControls();
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');

    if (slides.length === 0) return;

    // Remove active class from current slide and dot
    slides[currentSlideIndex].classList.remove('active');
    dots[currentSlideIndex].classList.remove('active');

    // Calculate new slide index
    currentSlideIndex += direction;

    if (currentSlideIndex >= slides.length) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = slides.length - 1;
    }

    // Add active class to new slide and dot
    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');

    // Restart auto-slide timer
    restartAutoSlide();
}

function currentSlide(slideIndex) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');

    if (slides.length === 0) return;

    // Remove active class from all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Update current slide index
    currentSlideIndex = slideIndex - 1;

    // Add active class to selected slide and dot
    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');

    // Restart auto-slide timer
    restartAutoSlide();
}

function startAutoSlide() {
    slideInterval = setInterval(() => {
        changeSlide(1);
    }, 5000); // Change slide every 5 seconds
}

function stopAutoSlide() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
}

function restartAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
}

function setupTouchControls() {
    const sliderContainer = document.querySelector('.hero-slider-container');
    if (!sliderContainer) return;

    let startX = 0;
    let startY = 0;
    let isDragging = false;

    sliderContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
        stopAutoSlide();
    });

    sliderContainer.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
    });

    sliderContainer.addEventListener('touchend', (e) => {
        if (!isDragging) return;

        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;

        // Check if horizontal swipe is more significant than vertical
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // Swipe left - next slide
                changeSlide(1);
            } else {
                // Swipe right - previous slide
                changeSlide(-1);
            }
        }

        isDragging = false;
        startAutoSlide();
    });

    // Prevent context menu on long press
    sliderContainer.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
}

// Make functions global for onclick handlers
window.changeSlide = changeSlide;
window.currentSlide = currentSlide;

// Newsletter functionality
function setupNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    const newsletterInput = document.querySelector('.newsletter-input');
    const newsletterButton = document.querySelector('.newsletter-button');

    if (newsletterButton && newsletterInput) {
        newsletterButton.addEventListener('click', (e) => {
            e.preventDefault();
            const email = newsletterInput.value.trim();

            if (validateEmail(email)) {
                showNotification('Successfully subscribed to newsletter!', 'success');
                newsletterInput.value = '';

                // Add animation
                newsletterButton.style.background = '#4CAF50';
                newsletterButton.textContent = 'Subscribed!';

                setTimeout(() => {
                    newsletterButton.style.background = '';
                    newsletterButton.textContent = 'Subscribe';
                }, 2000);
            } else {
                showNotification('Please enter a valid email address', 'error');
            }
        });

        // Allow enter key submission
        newsletterInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                newsletterButton.click();
            }
        });
    }
}

// Cart modal functionality
function showCartSummary() {
    const cartModal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');

    if (!cartModal) return;

    if (cart.length === 0) {
        cartItems.style.display = 'none';
        cartEmpty.classList.remove('hidden');
    } else {
        cartEmpty.classList.add('hidden');
        cartItems.style.display = 'block';
        updateCartModalItems();
    }

    cartModal.classList.remove('hidden');
}

function updateCartModalItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="cart-item-details">
                <h3 class="item-title">${item.title}</h3>
                <p class="item-brand">StyleHub</p>
                <div class="item-options">
                    <span class="item-size">Size: M</span>
                    <span class="item-color">Color: Black</span>
                </div>
                <div class="item-controls">
                    <div class="quantity-controls">
                        <button class="qty-btn decrease" onclick="updateCartQuantity('${item.id}', -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="qty-btn increase" onclick="updateCartQuantity('${item.id}', 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button class="remove-item" onclick="removeFromCart('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="cart-item-price">
                <span class="item-price">${item.price}</span>
            </div>
        </div>
    `).join('');

    updateCartSummary();
}

function updateCartQuantity(itemId, change) {
    const item = cart.find(item => item.id.toString() === itemId.toString());
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            updateCartModalItems();
            updateCartCount();
            saveCartToStorage();
        }
    }
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id.toString() !== itemId.toString());
    updateCartModalItems();
    updateCartCount();
    saveCartToStorage();
    showNotification('Item removed from cart', 'info');
}

function updateCartSummary() {
    const subtotal = cart.reduce((total, item) => {
        const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
        return total + (price * item.quantity);
    }, 0);

    const shipping = subtotal > 50 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const summaryElements = {
        subtotal: document.querySelector('.summary-row .summary-value'),
        shipping: document.querySelector('.shipping-value'),
        tax: document.querySelector('.tax-value'),
        total: document.querySelector('.total-value'),
        itemCount: document.querySelector('.item-count')
    };

    if (summaryElements.subtotal) summaryElements.subtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (summaryElements.shipping) summaryElements.shipping.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
    if (summaryElements.tax) summaryElements.tax.textContent = `$${tax.toFixed(2)}`;
    if (summaryElements.total) summaryElements.total.textContent = `$${total.toFixed(2)}`;
    if (summaryElements.itemCount) summaryElements.itemCount.textContent = `(${cart.reduce((sum, item) => sum + item.quantity, 0)} items)`;
}

// Setup cart modal event listeners
function setupCartModal() {
    const cartIcon = document.querySelector('.cart-icon-container');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.getElementById('closeCart');
    const continueShopping = document.getElementById('continueShopping');
    const proceedCheckout = document.getElementById('proceedCheckout');

    if (cartIcon) {
        cartIcon.addEventListener('click', showCartSummary);
    }

    if (closeCart) {
        closeCart.addEventListener('click', () => {
            cartModal.classList.add('hidden');
        });
    }

    if (continueShopping) {
        continueShopping.addEventListener('click', () => {
            cartModal.classList.add('hidden');
        });
    }

    if (proceedCheckout) {
        proceedCheckout.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification('Your cart is empty!', 'error');
                return;
            }
            window.location.href = 'checkout.html';
        });
    }

    // Close modal when clicking outside
    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal || e.target.classList.contains('cart-modal-overlay')) {
                cartModal.classList.add('hidden');
            }
        });
    }
}

// Hero slider functionality
function setupHeroSlider() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const totalSlides = slides.length;

    if (totalSlides === 0) return;

    // Auto-advance slides
    setInterval(() => {
        changeSlide(1);
    }, 5000);

    // Initialize first slide
    showSlide(0);
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    let currentSlide = Array.from(slides).findIndex(slide => slide.classList.contains('active'));

    // Remove active class from current slide and dot
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    // Calculate next slide
    currentSlide += direction;
    if (currentSlide >= slides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slides.length - 1;

    // Add active class to new slide and dot
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function currentSlide(n) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');

    // Remove active from all
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Add active to selected
    slides[n - 1].classList.add('active');
    dots[n - 1].classList.add('active');
}

function showSlide(n) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');

    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    if (slides[n]) slides[n].classList.add('active');
    if (dots[n]) dots[n].classList.add('active');
}

// Initialize cart modal when page loads
document.addEventListener('DOMContentLoaded', function() {
    setupCartModal();
    setupEnhancedFilters();
});

// Product navigation
function setupProductNavigation() {
    const productCards = document.querySelectorAll('.product-card, .modern-product-card, .colorful-product-card');

    productCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Only navigate if not clicking on action buttons
            if (!e.target.closest('.add-to-cart-btn, .wishlist-btn, .quick-view-btn, .modern-add-to-cart, .modern-wishlist-btn, .colorful-add-to-cart, .colorful-wishlist-btn')) {
                const productData = extractProductData(card);
                navigateToProductDetail(productData);
            }
        });
    });
}

function navigateToProductDetail(product) {
    const productParam = encodeURIComponent(JSON.stringify({
        title: product.title,
        price: product.price,
        image: product.image
    }));
    window.location.href = `product-detail.html?product=${productParam}`;
}

function showWishlistSummary() {
    if (wishlist.length === 0) {
        showNotification('Your wishlist is empty. Add some favorites!', 'info');
        return;
    }

    const wishlistItems = wishlist.map(item => `
        <div style="padding: 10px; border-bottom: 1px solid #eee;">
            <strong>${item.title}</strong><br>
            <span>${item.price}</span>
        </div>
    `).join('');

    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.5); display: flex; align-items: center;
        justify-content: center; z-index: 10000;
    `;

    modal.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 10px; max-width: 400px; width: 90%;">
            <h3>Your Wishlist (${wishlist.length} items)</h3>
            <div style="max-height: 300px; overflow-y: auto;">
                ${wishlistItems}
            </div>
            <button onclick="this.closest('.modal').remove()"
                    style="margin-top: 1rem; padding: 0.5rem 1rem; background: #333; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Close
            </button>
        </div>
    `;

    modal.className = 'modal';
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}
