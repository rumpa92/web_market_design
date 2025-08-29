// Fashion Marketplace JavaScript

// Shopping Cart Functionality
let cart = [];
let wishlist = [];

// Debug utility function
function debugCartFunctionality() {
    console.log('=== Cart Functionality Debug ===');

    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn, .modern-add-to-cart, .colorful-add-to-cart');
    console.log(`Found ${addToCartButtons.length} add to cart buttons`);

    addToCartButtons.forEach((btn, index) => {
        const productCard = btn.closest('.product-card, .modern-product-card, .colorful-product-card, .look-product-card');
        console.log(`Button ${index + 1}: ${btn.className} - Has container: ${!!productCard} - Container type: ${productCard?.className || 'none'}`);
    });

    const productCards = document.querySelectorAll('.product-card, .modern-product-card, .colorful-product-card, .look-product-card');
    console.log(`Found ${productCards.length} product cards`);

    console.log('Cart array:', cart);
    console.log('Current cart count:', cart.length);

    return {
        buttons: addToCartButtons.length,
        cards: productCards.length,
        cart: cart.length
    };
}

// Make debug function available globally
window.debugCartFunctionality = debugCartFunctionality;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    showFlashScreen();
});

// Flash Screen Functionality
function showFlashScreen() {
    const flashScreen = document.getElementById('flashScreen');

    // Only proceed if flash screen element exists
    if (!flashScreen) {
        initializeApp();
        return;
    }

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
    // Load existing cart data from localStorage
    loadCartFromStorage();

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
    setupCollectionPage();
    setupCollectionNavigation();
    setupCartModal();
    setupVideoShowcase();

    // Set default header title and hide header on homepage
    setPageHeaderTitle('Home');
    const homeHeader = document.getElementById('homePageHeader');
    if (homeHeader) homeHeader.style.display = 'none';

    // Debug cart functionality
    console.log('Cart initialized with items:', cart);
    console.log('Cart functions available:', {
        updateCartQuantity: typeof window.updateCartQuantity,
        removeFromCart: typeof window.removeFromCart
    });
}

// Event Listeners Setup
function setupEventListeners() {
    // Add to cart buttons (all types)
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn, .modern-add-to-cart, .colorful-add-to-cart');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', handleAddToCart);
    });

    // Wishlist buttons (all types)
    const wishlistBtns = document.querySelectorAll('.wishlist-btn, .modern-wishlist-btn, .colorful-wishlist-btn, .add-to-wishlist-btn');
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', handleWishlist);
    });

    // Quick view buttons removed

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
            showCartSummary();
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

    // Home back button
    const homeBackButton = document.getElementById('homeBackButton');
    if (homeBackButton) {
        homeBackButton.addEventListener('click', () => {
            const articlePage = document.getElementById('articlePage');
            const isArticleVisible = articlePage && window.getComputedStyle(articlePage).display !== 'none';
            if (isArticleVisible && typeof hideArticlePage === 'function') {
                hideArticlePage();
                setPageHeaderTitle('Home');
                return;
            }
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.href = 'index.html';
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

    try {
        const productCard = event.target.closest('.product-card, .modern-product-card, .colorful-product-card, .look-product-card');

        if (!productCard) {
            console.warn('Product card not found. Trying alternative selectors...');
            // Try to find any parent container that might contain product info
            const alternativeCard = event.target.closest('[class*="product"], [class*="card"], .story-card, .seasonal-card');
            if (alternativeCard) {
                console.log('Found alternative product container:', alternativeCard.className);
            }
        }

        const product = extractProductData(productCard);

        addToCart(product);
        showNotification(`${product.title} added to cart!`, 'success');

        // Add animation effect
        const btn = event.target;
        if (btn && btn.style) {
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 150);
        }
    } catch (error) {
        console.error('Error in handleAddToCart:', error);
        showNotification('Error adding item to cart. Please try again.', 'error');
    }
}

function extractProductData(productCard) {
    // Check if productCard is null or undefined
    if (!productCard) {
        console.error('Product card not found. Button may not be inside a valid product container.');
        return {
            id: Date.now() + Math.random(),
            title: 'Unknown Product',
            price: '₹0',
            image: 'https://via.placeholder.com/300x300?text=No+Image',
            quantity: 1
        };
    }

    let title, price, image;

    try {
        // Handle different card types
        if (productCard.classList.contains('colorful-product-card')) {
            title = productCard.querySelector('.colorful-product-title')?.textContent || 'Colorful Product';
            price = productCard.querySelector('.current-price')?.textContent || '₹0';
            const imgElement = productCard.querySelector('.colorful-product-img');
            image = (imgElement && imgElement.src && imgElement.src !== window.location.href)
                ? imgElement.src
                : 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F9915d20cfed848ec961a57e0b81de98d?format=webp&width=400';
        } else if (productCard.classList.contains('modern-product-card')) {
            title = productCard.querySelector('.modern-product-title')?.textContent || 'Modern Product';
            price = productCard.querySelector('.modern-product-price')?.textContent || '₹0';
            const imgElement = productCard.querySelector('.modern-product-img');
            image = (imgElement && imgElement.src && imgElement.src !== window.location.href)
                ? imgElement.src
                : 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2Fcd41764914f3435db0789865df8be918?format=webp&width=400';
        } else if (productCard.classList.contains('look-product-card')) {
            title = productCard.querySelector('.product-name')?.textContent || 'Look Product';
            price = productCard.querySelector('.product-price')?.textContent || '₹0';
            const imgElement = productCard.querySelector('.product-image');
            image = (imgElement && imgElement.src && imgElement.src !== window.location.href)
                ? imgElement.src
                : 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F302ea9cbe68a4e86aa894e18fdddf869?format=webp&width=400';
        } else if (productCard.classList.contains('collection-product-card')) {
            title = productCard.querySelector('.product-name')?.textContent || 'Collection Product';
            price = productCard.querySelector('.product-price')?.textContent || '₹0';
            const imgElement = productCard.querySelector('.product-image');
            image = (imgElement && imgElement.src && imgElement.src !== window.location.href)
                ? imgElement.src
                : 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F9915d20cfed848ec961a57e0b81de98d?format=webp&width=400';
        } else {
            // Fallback for regular product cards
            title = productCard.querySelector('.product-title')?.textContent ||
                   productCard.querySelector('.colorful-product-title')?.textContent ||
                   'Product';
            price = productCard.querySelector('.current-price')?.textContent ||
                   productCard.querySelector('.colorful-product-price .current-price')?.textContent ||
                   '₹0';
            const imgElement = productCard.querySelector('.product-image') || productCard.querySelector('.colorful-product-img') || productCard.querySelector('img');
            image = (imgElement && imgElement.src && imgElement.src !== window.location.href)
                ? imgElement.src
                : 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F9915d20cfed848ec961a57e0b81de98d?format=webp&width=400';
        }
    } catch (error) {
        console.error('Error extracting product data:', error);
        return {
            id: Date.now() + Math.random(),
            title: 'Error Loading Product',
            price: '₹0',
            image: 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F9915d20cfed848ec961a57e0b81de98d?format=webp&width=400',
            quantity: 1
        };
    }

    return {
        id: Date.now() + Math.random(), // Simple ID generation
        title: title || 'Unknown Product',
        price: price || '₹0',
        image: image || 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F9915d20cfed848ec961a57e0b81de98d?format=webp&width=400',
        quantity: 1
    };
}

function addToCart(product) {
    const existingItem = cart.find(item => item.title === product.title);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        // Ensure all required fields are present and valid
        const normalizedProduct = {
            ...product,
            id: product.id || Date.now() + Math.random(), // Ensure ID exists
            price: typeof product.price === 'string' ? product.price : `₹${product.price}`,
            quantity: product.quantity || 1, // Ensure quantity exists
            image: product.image && product.image !== 'undefined' && product.image !== ''
                ? product.image
                : 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F9915d20cfed848ec961a57e0b81de98d?format=webp&width=400'
        };
        cart.push(normalizedProduct);
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

    const productCard = event.target.closest('.product-card, .modern-product-card, .colorful-product-card, .look-product-card');
    const product = extractProductData(productCard);
    const wishlistBtn = event.target.closest('.wishlist-btn, .modern-wishlist-btn, .colorful-wishlist-btn, .add-to-wishlist-btn');
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

// Quick View functionality removed

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

    // Navigate to category page with category parameter
    navigateToCategory(title);

    // Add visual feedback
    if (event && event.currentTarget) {
        event.currentTarget.style.transform = 'scale(0.95)';
        setTimeout(() => {
            if (event.currentTarget) {
                event.currentTarget.style.transform = '';
            }
        }, 150);
    }
}

function navigateToCategory(categoryName) {
    // Store the selected category in sessionStorage for the category page
    sessionStorage.setItem('selectedCategory', categoryName);

    // Navigate to category page
    window.location.href = `category.html?category=${encodeURIComponent(categoryName)}`;
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
    const authModal = document.getElementById('authModal');
    const closeAuth = document.querySelector('.close-auth');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');

    // Only setup if auth modal exists
    if (!authModal) {
        console.log('Auth modal not found, skipping authentication setup');
        return;
    }

    // Close modal
    if (closeAuth) {
        closeAuth.addEventListener('click', () => {
            authModal.classList.add('hidden');
        });
    }

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

    if (signinForm) {
        signinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleSignIn();
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleSignUp();
        });
    }

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
        const authModal = document.getElementById('authModal');
        if (authModal) {
            authModal.classList.add('hidden');
        }
        updateUIForLoggedInUser();
    }, 1500);
}

function handleSignUp() {
    showNotification('Creating your account...', 'info');
    // Simulate API call
    setTimeout(() => {
        showNotification('Account created successfully!', 'success');
        const authModal = document.getElementById('authModal');
        if (authModal) {
            authModal.classList.add('hidden');
        }
        updateUIForLoggedInUser();
    }, 1500);
}

function handleSocialAuth(provider) {
    showNotification(`Connecting with ${provider}...`, 'info');
    setTimeout(() => {
        showNotification(`Successfully signed in with ${provider}!`, 'success');
        const authModal = document.getElementById('authModal');
        if (authModal) {
            authModal.classList.add('hidden');
        }
        updateUIForLoggedInUser();
    }, 1500);
}

function updateUIForLoggedInUser() {
    const profileIcon = document.getElementById('profileIcon');

    // Only update if the old profile icon exists (for backward compatibility)
    if (profileIcon) {
        profileIcon.className = 'fas fa-user profile-icon';
        profileIcon.style.color = '#4CAF50';
    }

    // Update the new profile dropdown if it exists
    const profileSection = document.getElementById('profileSection');
    if (profileSection) {
        profileSection.classList.add('logged-in');
        profileSection.classList.remove('guest');

        // Update user name and email in dropdown
        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');
        const signInOutText = document.getElementById('signInOutText');

        if (userName) userName.textContent = 'John Doe';
        if (userEmail) userEmail.textContent = 'john.doe@stylehub.com';
        if (signInOutText) signInOutText.textContent = 'Sign Out';
    }
}

// Location Services
function setupLocationServices() {
    const locationModal = document.getElementById('locationModal');
    const locationTrigger = document.getElementById('locationTrigger');
    const closeLocation = document.querySelector('.close-location');
    const detectLocationBtn = document.querySelector('.detect-location-btn');
    const cityBtns = document.querySelectorAll('.city-btn');

    // Only setup if location modal exists
    if (!locationModal) {
        console.log('Location modal not found, skipping location services setup');
        return;
    }

    // Show modal when location trigger is clicked
    if (locationTrigger) {
        locationTrigger.addEventListener('click', () => {
            locationModal.classList.remove('hidden');
        });
    }

    // Close modal
    if (closeLocation) {
        closeLocation.addEventListener('click', () => {
            locationModal.classList.add('hidden');
        });
    }

    // Close on outside click
    locationModal.addEventListener('click', (e) => {
        if (e.target === locationModal) {
            locationModal.classList.add('hidden');
        }
    });

    // Detect location
    if (detectLocationBtn) {
        detectLocationBtn.addEventListener('click', () => {
            detectUserLocation();
        });
    }

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

    // Add click handlers to Read More buttons specifically
    storyCards.forEach((card, index) => {
        const readMoreBtn = card.querySelector('.story-cta');
        if (readMoreBtn) {
            readMoreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                handleStoryClick(card, index);
            });
        }

        // Also allow clicking the entire card as fallback
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

    // Show article page
    showArticlePage(storyTitle, storyDescription, index);

    showNotification(`Opening: ${storyTitle}`, 'info');
}

function showArticlePage(title, description, index) {
    setPageHeaderTitle(title || 'Article');
    const homeHeader = document.getElementById('homePageHeader');
    if (homeHeader) homeHeader.style.display = 'block';
    // Hide the fashion stories section
    const fashionStoriesSection = document.querySelector('.fashion-stories-section');
    const seasonalSection = document.querySelector('.seasonal-collections-section');
    const trendingSection = document.querySelector('.trending-popular-section');
    const recommendationsSection = document.querySelector('.recommendations-section');
    const categoriesSection = document.querySelector('.categories-section');
    const arrivalsSection = document.querySelector('.new-arrivals-section');
    const newsletterSection = document.querySelector('.newsletter-section');

    // Hide all other sections
    [fashionStoriesSection, seasonalSection, trendingSection, recommendationsSection,
     categoriesSection, arrivalsSection, newsletterSection].forEach(section => {
        if (section) section.style.display = 'none';
    });

    // Show the article page
    const articlePage = document.getElementById('articlePage');
    articlePage.style.display = 'block';

    // Scroll to top
    window.scrollTo(0, 0);

    // Populate article content based on the story clicked
    populateArticleContent(title, description, index);

    // Setup article page event listeners
    setupArticlePageListeners();
}

function populateArticleContent(title, description, index) {
    const storyData = {
        'Street Style Guide': {
            category: 'STYLE GUIDE',
            author: 'Sarah Mitchell',
            heroImage: 'https://cdn.builder.io/api/v1/image/assets%2F83fcd0ffeb504b4897e3b397a63b44f0%2F40eeea5a7f914b45b268a8230a55fc0b?format=webp&width=1200',
            intro: 'Discover the art of street style and how to master effortless urban fashion that turns heads and expresses your unique personality.',
            quote: 'Street style is about confidence and authenticity. It\'s not about following trends, but creating your own.',
            body: 'Street style has evolved from a subcultural expression to a mainstream fashion phenomenon that influences runways and retail stores worldwide. It\'s about more than just clothing—it\'s a form of self-expression that tells your story without words.'
        },
        'Seasonal Must-Haves': {
            category: 'SEASONAL GUIDE',
            author: 'Emma Chen',
            heroImage: 'https://cdn.builder.io/api/v1/image/assets%2F83fcd0ffeb504b4897e3b397a63b44f0%2Ffdbe61570c5f4b12b6c0e12f37d73582?format=webp&width=1200',
            intro: 'Essential pieces for your wardrobe this season that will keep you stylish and comfortable through every weather change.',
            quote: 'A well-curated seasonal wardrobe is like a reliable friend - always there when you need it most.',
            body: 'Building a seasonal wardrobe isn\'t about having the most clothes, it\'s about having the right pieces that work together seamlessly. Focus on versatile items that can be layered and mixed to create multiple looks.'
        },
        'Designer Spotlight': {
            category: 'DESIGNER FOCUS',
            author: 'Michael Rodriguez',
            heroImage: 'https://cdn.builder.io/api/v1/image/assets%2F83fcd0ffeb504b4897e3b397a63b44f0%2Fe06e940245694220b458c160d5d39072?format=webp&width=1200',
            intro: 'Featured collections from top designers who are reshaping the fashion landscape with innovative designs and sustainable practices.',
            quote: 'Design is not just what it looks like and feels like. Design is how it works in people\'s lives.',
            body: 'Today\'s fashion designers are more than just creators of beautiful garments - they\'re storytellers, innovators, and advocates for positive change in the industry. Their collections reflect not just aesthetic vision, but also values and purpose.'
        }
    };

    const data = storyData[title] || storyData['Street Style Guide'];

    // Update article content
    const categoryEl = document.getElementById('articleCategory');
    if (categoryEl) categoryEl.textContent = data.category;
    const titleEl = document.getElementById('articleTitle');
    if (titleEl) titleEl.textContent = title;
    const authorEl = document.getElementById('authorName');
    if (authorEl) authorEl.textContent = data.author;
    const heroEl = document.getElementById('articleHeroImage');
    if (heroEl) heroEl.src = data.heroImage;
    const introEl = document.getElementById('articleIntro');
    if (introEl) introEl.textContent = data.intro;
    const quoteEl = document.getElementById('articleQuote');
    if (quoteEl) quoteEl.textContent = data.quote;

    // Update article body with more detailed content
    const articleBody = document.getElementById('articleBody');
    articleBody.innerHTML = `
        <p>${data.body}</p>

        <h3>The Fundamentals</h3>
        <p>Understanding the core principles behind ${title.toLowerCase()} starts with recognizing that fashion is deeply personal. Each choice you make - from color palette to silhouette - communicates something about who you are and how you want to be perceived.</p>

        <div class="article-quote">
            <blockquote id="articleQuote">${data.quote}</blockquote>
            <cite>- ${data.author}, Fashion Expert</cite>
        </div>

        <div class="article-image">
            <img src="${data.heroImage}" alt="${title}" class="content-image">
            <figcaption>Exploring the essence of ${title.toLowerCase()}</figcaption>
        </div>

        <h3>Building Your Style</h3>
        <p>The key to mastering any fashion approach is understanding your personal style DNA. Start with pieces that make you feel confident and authentic, then build from there. Quality over quantity should always be your guiding principle.</p>

        <h3>Expert Tips</h3>
        <ul>
            <li>Invest in versatile basics that work across seasons</li>
            <li>Don't be afraid to mix high and low-end pieces</li>
            <li>Pay attention to fit - it can make or break any outfit</li>
            <li>Develop a signature style element that's uniquely you</li>
            <li>Stay inspired but don't feel pressured to follow every trend</li>
        </ul>
    `;

    // Update the date to current date
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('articleDate').textContent = today.toLocaleDateString('en-US', options);
}

function setupArticlePageListeners() {
    // Back to stories buttons
    const backButtons = document.querySelectorAll('.back-to-stories-btn, .back-to-stories-btn-bottom');
    backButtons.forEach(btn => {
        btn.addEventListener('click', hideArticlePage);
    });

    // Continue shopping button
    const continueShoppingBtn = document.querySelector('.continue-shopping-btn');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', () => {
            hideArticlePage();
            // Scroll to trending section
            const trendingSection = document.querySelector('.trending-popular-section');
            if (trendingSection) {
                trendingSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Share buttons
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const platform = btn.classList.contains('facebook') ? 'Facebook' :
                           btn.classList.contains('instagram') ? 'Instagram' :
                           btn.classList.contains('twitter') ? 'Twitter' : 'Link';

            if (platform === 'Link') {
                navigator.clipboard.writeText(window.location.href);
                showNotification('Link copied to clipboard!', 'success');
            } else {
                showNotification(`Shared on ${platform}!`, 'success');
            }
        });
    });

    // Add to cart buttons in Shop This Look section
    const addToCartBtns = document.querySelectorAll('.look-product-card .add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productCard = btn.closest('.look-product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            addToCart({ name: productName, price: 129.99, image: 'product-image.jpg' });
        });
    });

    // Wishlist buttons in Shop This Look section
    const wishlistBtns = document.querySelectorAll('.look-product-card .add-to-wishlist-btn');
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productCard = btn.closest('.look-product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            addToWishlist({ name: productName, price: 129.99, image: 'product-image.jpg' });
            btn.innerHTML = '<i class="fas fa-heart"></i>';
            btn.style.color = '#ff4444';
        });
    });

    // Comment submission
    const submitCommentBtn = document.querySelector('.submit-comment-btn');
    const commentInput = document.querySelector('.comment-input');

    if (submitCommentBtn && commentInput) {
        submitCommentBtn.addEventListener('click', () => {
            const commentText = commentInput.value.trim();
            if (commentText) {
                addComment(commentText);
                commentInput.value = '';
                showNotification('Comment posted!', 'success');
            }
        });
    }
}

function hideArticlePage() {
    setPageHeaderTitle('Home');
    const homeHeader = document.getElementById('homePageHeader');
    if (homeHeader) homeHeader.style.display = 'none';
    // Hide article page
    const articlePage = document.getElementById('articlePage');
    articlePage.style.display = 'none';

    // Show all other sections
    const fashionStoriesSection = document.querySelector('.fashion-stories-section');
    const seasonalSection = document.querySelector('.seasonal-collections-section');
    const trendingSection = document.querySelector('.trending-popular-section');
    const recommendationsSection = document.querySelector('.recommendations-section');
    const categoriesSection = document.querySelector('.categories-section');
    const arrivalsSection = document.querySelector('.new-arrivals-section');
    const newsletterSection = document.querySelector('.newsletter-section');

    [fashionStoriesSection, seasonalSection, trendingSection, recommendationsSection,
     categoriesSection, arrivalsSection, newsletterSection].forEach(section => {
        if (section) section.style.display = 'block';
    });

    // Scroll back to fashion stories section
    if (fashionStoriesSection) {
        fashionStoriesSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function addComment(commentText) {
    const commentsList = document.querySelector('.comments-list');
    const newComment = document.createElement('div');
    newComment.className = 'comment';

    const currentUser = document.getElementById('userName').textContent || 'Anonymous User';
    const userAvatar = document.getElementById('profileImage').src || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face';

    newComment.innerHTML = `
        <div class="comment-avatar">
            <img src="${userAvatar}" alt="User" class="commenter-avatar">
        </div>
        <div class="comment-content">
            <div class="comment-header">
                <span class="commenter-name">${currentUser}</span>
                <span class="comment-date">Just now</span>
            </div>
            <p class="comment-text">${commentText}</p>
        </div>
    `;

    commentsList.insertBefore(newComment, commentsList.firstChild);
}

function addScrollIndicators() {
    // Scroll indicators disabled as requested - no icons needed
    return;
}

// Page header title utility
function setPageHeaderTitle(text) {
    const el = document.getElementById('pageHeaderTitle');
    if (el) el.textContent = text;
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

    // Exit early if elements don't exist
    if (!searchInput || !searchSuggestions) {
        return;
    }

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

    // Exit early if elements don't exist
    if (!voiceSearchBtn || !searchInput) {
        return;
    }

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

    // Only setup if elements exist
    if (!filtersToggle || !filtersPanel || !sortSelect) {
        return;
    }

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

    // Exit early if container doesn't exist
    if (!activeFiltersContainer) {
        return;
    }

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

    // Initialize user status to always stay online
    updateUserStatus('online');

    // Ensure status stays online every 5 seconds
    setInterval(() => {
        updateUserStatus('online');
    }, 5000);

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

    // Keep status always online - commented out random status changes
    // setInterval(() => {
    //     const statuses = ['online', 'away', 'busy'];
    //     const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    //     updateUserStatus(randomStatus);
    // }, 30000);
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

    // Remove all status classes (only if elements exist)
    if (statusIndicator) {
        statusIndicator.className = 'status-indicator';
    }
    if (onlineStatus) {
        onlineStatus.className = 'online-status';
    }

    // Add new status class
    if (status !== 'online') {
        if (statusIndicator) {
            statusIndicator.classList.add(status);
        }
        if (onlineStatus) {
            onlineStatus.classList.add(status);
        }
    }

    // Update status text
    const statusTexts = {
        'online': 'Online',
        'away': 'Away',
        'busy': 'Busy',
        'offline': 'Offline'
    };

    if (statusText) {
        statusText.textContent = statusTexts[status] || 'Online';
    }
    if (onlineStatus) {
        onlineStatus.title = statusTexts[status] || 'Online';
    }

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
            // Navigate to profile page
            window.location.href = 'profile.html';
            break;

        case 'myOrders':
            // Navigate to orders page
            window.location.href = 'my-orders.html';
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
                        <p>Order #12345 �� Delivered on Dec 15, 2024</p>
                        <p class="order-price">���2,499</p>
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

            // Navigate to category page
            navigateToCategory(categoryTitle);
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
    const items = JSON.parse(localStorage.getItem('fashionWishlist') || '[]');
    if (!items.length) {
        showNotification('Your wishlist is empty. Add some favorites!', 'info');
        return;
    }

    const overlay = document.createElement('div');
    overlay.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,.55);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:10000;`;

    const card = document.createElement('div');
    card.style.cssText = `width:min(560px,92vw);max-height:80vh;overflow:hidden;border-radius:16px;background:#fff;box-shadow:0 20px 60px rgba(0,0,0,.25);display:flex;flex-direction:column;`;

    const header = document.createElement('div');
    header.style.cssText = `padding:1rem 1.25rem;border-bottom:1px solid #eee;display:flex;align-items:center;justify-content:space-between;gap:.5rem;`;
    header.innerHTML = `<div style="font-weight:800;font-size:1.1rem;">Your Wishlist (${items.length} item${items.length!==1?'s':''})</div>
    <button class="wm-close" style="border:none;background:transparent;font-size:1.1rem;cursor:pointer;color:#718096"><i class="fas fa-times"></i></button>`;

    const listWrap = document.createElement('div');
    listWrap.style.cssText = `overflow:auto;max-height:56vh;`;
    listWrap.innerHTML = items.map(i => `
      <div class="wm-row" data-title="${(i.title||'').replace(/"/g,'&quot;')}">
        <div style="display:flex;gap:.75rem;align-items:center;padding:.9rem 1.25rem;border-bottom:1px solid #f1f1f1;">
          <img src="${i.image||''}" alt="${i.title||''}" style="width:56px;height:56px;object-fit:cover;border-radius:10px;border:1px solid #eee;"/>
          <div style="flex:1;min-width:0;">
            <div style="font-weight:700;color:#2d3748;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${i.title||''}</div>
            <div style="font-weight:800;">${typeof i.price==='number'?`₹${i.price}`:(i.price||'₹0')}</div>
          </div>
          <div style="display:flex;gap:.4rem;">
            <button class="wm-add" style="padding:.5rem .8rem;border:none;border-radius:10px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;font-weight:700;cursor:pointer;"><i class="fas fa-shopping-bag"></i></button>
            <button class="wm-remove" style="padding:.5rem .7rem;border:1px solid #eee;border-radius:10px;background:#fff;color:#e53e3e;cursor:pointer;"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </div>`).join('');

    const footer = document.createElement('div');
    footer.style.cssText = `padding:1rem 1.25rem;border-top:1px solid #eee;display:flex;gap:.5rem;flex-wrap:wrap;justify-content:flex-end;`;
    footer.innerHTML = `
      <button class="wm-view" style="padding:.65rem 1rem;border-radius:10px;border:1px solid #ddd;background:#fff;font-weight:700;cursor:pointer;">View Wishlist</button>
      <button class="wm-move-all" style="padding:.65rem 1rem;border-radius:10px;border:none;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;font-weight:800;cursor:pointer;">Move All to Cart</button>
    `;

    card.appendChild(header); card.appendChild(listWrap); card.appendChild(footer); overlay.appendChild(card); document.body.appendChild(overlay);

    function close() { if (document.body.contains(overlay)) document.body.removeChild(overlay); }
    overlay.addEventListener('click', (e)=>{ if(e.target===overlay) close(); });
    header.querySelector('.wm-close').addEventListener('click', close);

    // Delegated actions
    listWrap.addEventListener('click', (e)=>{
        const row = e.target.closest('.wm-row'); if(!row) return;
        const title = row.dataset.title;
        if (e.target.closest('.wm-add')) {
            const item = items.find(x => x.title === title) || {};
            addToCart({ title: item.title, price: item.price || '₹0', image: item.image, quantity: 1, id: item.id || Date.now()+Math.random() });
            showNotification(`${item.title} added to cart!`, 'success');
        } else if (e.target.closest('.wm-remove')) {
            removeFromWishlist(title);
            row.remove();
            showNotification('Removed from wishlist', 'info');
            if (listWrap.querySelectorAll('.wm-row').length === 0) { close(); }
        }
    });

    footer.querySelector('.wm-move-all').addEventListener('click', ()=>{
        items.forEach(i=>addToCart({ title:i.title, price:i.price||'₹0', image:i.image, quantity:1, id:i.id||Date.now()+Math.random() }));
        showNotification('All wishlist items moved to cart!', 'success');
    });
    footer.querySelector('.wm-view').addEventListener('click', ()=>{ window.location.href = 'wishlist.html'; });
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
window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;
window.addToCartFromCategory = addToCartFromCategory;
window.addToWishlistFromCategory = addToWishlistFromCategory;

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
    const cartSummary = document.getElementById('cartSummary');
    const cartActions = document.querySelector('.cart-actions');

    if (!cartModal) return;

    if (cart.length === 0) {
        cartItems.style.display = 'none';
        cartEmpty.classList.remove('hidden');
        if (cartSummary) cartSummary.style.display = 'none';
        if (cartActions) cartActions.style.display = 'none';
    } else {
        cartEmpty.classList.add('hidden');
        cartItems.style.display = 'block';
        if (cartSummary) cartSummary.style.display = 'block';
        if (cartActions) cartActions.style.display = 'block';
        updateCartModalItems();
    }

    cartModal.classList.remove('hidden');
}

function updateCartModalItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartSummary = document.getElementById('cartSummary');
    const cartActions = document.querySelector('.cart-actions');

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        // Cart is empty - hide items container, summary, and actions
        cartItemsContainer.style.display = 'none';
        if (cartEmpty) cartEmpty.classList.remove('hidden');
        if (cartSummary) cartSummary.style.display = 'none';
        if (cartActions) cartActions.style.display = 'none';
        return;
    }

    // Cart has items - show containers
    cartItemsContainer.style.display = 'block';
    if (cartEmpty) cartEmpty.classList.add('hidden');
    if (cartSummary) cartSummary.style.display = 'block';
    if (cartActions) cartActions.style.display = 'block';

    // Filter out items without IDs and fix items with missing IDs
    cart = cart.map(item => {
        if (!item.id) {
            return {
                ...item,
                id: Date.now() + Math.random() // Generate new ID for items without one
            };
        }
        return item;
    });

    cartItemsContainer.innerHTML = cart.map(item => {
        // Double-check that item has an ID before rendering
        const itemId = item.id || 'temp-' + Date.now();

        // Ensure image has a proper URL or use placeholder
        const imageUrl = item.image && item.image !== 'undefined' && item.image !== ''
            ? item.image
            : 'https://via.placeholder.com/300x300?text=No+Image';

        return `
            <div class="cart-item" data-id="${itemId}">
                <div class="cart-item-image">
                    <img src="${imageUrl}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/300x300?text=No+Image'">
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
                            <button class="qty-btn decrease" onclick="updateCartQuantity('${itemId}', -1)">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="qty-btn increase" onclick="updateCartQuantity('${itemId}', 1)">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <button class="remove-item" onclick="removeFromCart('${itemId}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="cart-item-price">
                    <span class="item-price">${item.price}</span>
                </div>
            </div>
        `;
    }).join('');

    updateCartSummary();
}

function updateCartQuantity(itemId, change) {
    // Safety check for undefined itemId
    if (!itemId || itemId === 'undefined') {
        console.error('Invalid itemId provided to updateCartQuantity:', itemId);
        return;
    }

    console.log('Updating cart quantity for item:', itemId, 'change:', change);

    const item = cart.find(cartItem => {
        // Safety check for undefined item.id
        if (!cartItem || !cartItem.id) {
            return false;
        }
        return cartItem.id.toString() === itemId.toString();
    });

    if (item) {
        item.quantity += change;
        console.log('Updated quantity for', item.title, 'to', item.quantity);

        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            updateCartModalItems();
            updateCartCount();
            saveCartToStorage();
            showNotification(`Quantity updated for ${item.title}`, 'info');
        }
    } else {
        console.warn('Item not found in cart for ID:', itemId);
        console.log('Available cart items:', cart.map(item => ({id: item.id, title: item.title})));
    }
}

function removeFromCart(itemId) {
    // Safety check for undefined itemId
    if (!itemId || itemId === 'undefined') {
        console.error('Invalid itemId provided to removeFromCart:', itemId);
        return;
    }

    console.log('Removing item from cart:', itemId);

    const itemToRemove = cart.find(item => item && item.id && item.id.toString() === itemId.toString());
    const itemTitle = itemToRemove ? itemToRemove.title : 'Unknown item';

    cart = cart.filter(item => {
        // Safety check for undefined item.id
        if (!item || !item.id) {
            return true; // Keep items without IDs for now (shouldn't happen)
        }
        return item.id.toString() !== itemId.toString();
    });

    console.log('Item removed. Cart now has', cart.length, 'items');

    updateCartModalItems();
    updateCartCount();
    saveCartToStorage();
    showNotification(`${itemTitle} removed from cart`, 'info');
}

function updateCartSummary() {
    const subtotal = cart.reduce((total, item) => {
        // Ensure price is a string and handle both string and number formats
        const priceStr = typeof item.price === 'string' ? item.price : String(item.price);
        const price = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
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
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.getElementById('closeCart');
    const continueShopping = document.getElementById('continueShopping');
    const proceedCheckout = document.getElementById('proceedCheckout');

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
    // Convert price to number if it's a string
    const currentPrice = typeof product.price === 'string' ?
        parseFloat(product.price.replace('$', '')) :
        product.price;

    const productData = {
        id: Date.now() + Math.random(),
        title: product.title,
        currentPrice: currentPrice,
        originalPrice: currentPrice * 1.25, // Add some markup for original price
        rating: 4.8,
        reviewCount: Math.floor(Math.random() * 500) + 100,
        image: product.image,
        colors: ['black', 'blue', 'red', 'green'],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    };

    // Store in sessionStorage for the product detail page
    sessionStorage.setItem('selectedProduct', JSON.stringify(productData));

    // Navigate to product detail page
    window.location.href = 'product-detail.html';

    showNotification(`Loading ${product.title}...`, 'info');
}

function showWishlistSummary() {
    const items = JSON.parse(localStorage.getItem('fashionWishlist') || '[]');
    if (!items.length) {
        showNotification('Your wishlist is empty. Add some favorites!', 'info');
        return;
    }

    const overlay = document.createElement('div');
    overlay.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,.55);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:10000;`;

    const card = document.createElement('div');
    card.style.cssText = `width:min(560px,92vw);max-height:80vh;overflow:hidden;border-radius:16px;background:#fff;box-shadow:0 20px 60px rgba(0,0,0,.25);display:flex;flex-direction:column;`;

    const header = document.createElement('div');
    header.style.cssText = `padding:1rem 1.25rem;border-bottom:1px solid #eee;display:flex;align-items:center;justify-content:space-between;gap:.5rem;`;
    header.innerHTML = `<div style="font-weight:800;font-size:1.1rem;">Your Wishlist (${items.length} item${items.length!==1?'s':''})</div>
    <button class="wm-close" style="border:none;background:transparent;font-size:1.1rem;cursor:pointer;color:#718096"><i class="fas fa-times"></i></button>`;

    const listWrap = document.createElement('div');
    listWrap.style.cssText = `overflow:auto;max-height:56vh;`;
    listWrap.innerHTML = items.map(i => `
      <div class="wm-row" data-title="${(i.title||'').replace(/"/g,'&quot;')}">
        <div style="display:flex;gap:.75rem;align-items:center;padding:.9rem 1.25rem;border-bottom:1px solid #f1f1f1;">
          <img src="${i.image||''}" alt="${i.title||''}" style="width:56px;height:56px;object-fit:cover;border-radius:10px;border:1px solid #eee;"/>
          <div style="flex:1;min-width:0;">
            <div style="font-weight:700;color:#2d3748;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${i.title||''}</div>
            <div style="font-weight:800;">${typeof i.price==='number'?`₹${i.price}`:(i.price||'₹0')}</div>
          </div>
          <div style="display:flex;gap:.4rem;">
            <button class="wm-add" style="padding:.5rem .8rem;border:none;border-radius:10px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;font-weight:700;cursor:pointer;"><i class="fas fa-shopping-bag"></i></button>
            <button class="wm-remove" style="padding:.5rem .7rem;border:1px solid #eee;border-radius:10px;background:#fff;color:#e53e3e;cursor:pointer;"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </div>`).join('');

    const footer = document.createElement('div');
    footer.style.cssText = `padding:1rem 1.25rem;border-top:1px solid #eee;display:flex;gap:.5rem;flex-wrap:wrap;justify-content:flex-end;`;
    footer.innerHTML = `
      <button class="wm-view" style="padding:.65rem 1rem;border-radius:10px;border:1px solid #ddd;background:#fff;font-weight:700;cursor:pointer;">View Wishlist</button>
      <button class="wm-move-all" style="padding:.65rem 1rem;border-radius:10px;border:none;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;font-weight:800;cursor:pointer;">Move All to Cart</button>
    `;

    card.appendChild(header); card.appendChild(listWrap); card.appendChild(footer); overlay.appendChild(card); document.body.appendChild(overlay);

    function close() { if (document.body.contains(overlay)) document.body.removeChild(overlay); }
    overlay.addEventListener('click', (e)=>{ if(e.target===overlay) close(); });
    header.querySelector('.wm-close').addEventListener('click', close);

    listWrap.addEventListener('click', (e)=>{
        const row = e.target.closest('.wm-row'); if(!row) return;
        const title = row.dataset.title;
        if (e.target.closest('.wm-add')) {
            const item = items.find(x => x.title === title) || {};
            addToCart({ title: item.title, price: item.price || '₹0', image: item.image, quantity: 1, id: item.id || Date.now()+Math.random() });
            showNotification(`${item.title} added to cart!`, 'success');
        } else if (e.target.closest('.wm-remove')) {
            removeFromWishlist(title);
            row.remove();
            showNotification('Removed from wishlist', 'info');
            if (listWrap.querySelectorAll('.wm-row').length === 0) { close(); }
        }
    });

    footer.querySelector('.wm-move-all').addEventListener('click', ()=>{
        items.forEach(i=>addToCart({ title:i.title, price:i.price||'₹0', image:i.image, quantity:1, id:i.id||Date.now()+Math.random() }));
        showNotification('All wishlist items moved to cart!', 'success');
    });
    footer.querySelector('.wm-view').addEventListener('click', ()=>{ window.location.href = 'wishlist.html'; });
}

// Category Page Data and Functionality
const categoryData = {
    'Women': {
        banner: {
            title: 'Women Fashion',
            subtitle: 'Discover elegant and modern styles for every occasion',
            image: 'https://cdn.builder.io/api/v1/image/assets%2Fa91527f2fe264920accbd14578b2df55%2F05be5c3bd0814bc2aa6e4c5a61d7cfe1?format=webp&width=800'
        },
        subcategories: [
            { name: 'Dresses', icon: 'fas fa-tshirt', count: 125 },
            { name: 'Tops & Blouses', icon: 'fas fa-vest', count: 89 },
            { name: 'Bottoms', icon: 'fas fa-user-tie', count: 67 },
            { name: 'Outerwear', icon: 'fas fa-jacket', count: 45 },
            { name: 'Lingerie', icon: 'fas fa-heart', count: 34 },
            { name: 'Activewear', icon: 'fas fa-running', count: 28 }
        ]
    },
    'Men': {
        banner: {
            title: 'Men Fashion',
            subtitle: 'Sharp and stylish clothing for the modern gentleman',
            image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=400&h=400&fit=crop&auto=format&q=90'
        },
        subcategories: [
            { name: 'Shirts', icon: 'fas fa-tshirt', count: 98 },
            { name: 'Pants & Jeans', icon: 'fas fa-user-tie', count: 76 },
            { name: 'Suits & Blazers', icon: 'fas fa-user-suit', count: 54 },
            { name: 'Casual Wear', icon: 'fas fa-vest', count: 43 },
            { name: 'Outerwear', icon: 'fas fa-jacket', count: 32 },
            { name: 'Activewear', icon: 'fas fa-running', count: 29 }
        ]
    },
    'Accessories': {
        banner: {
            title: 'Accessories Fashion',
            subtitle: 'Complete your look with our stunning accessory collection',
            image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop&auto=format&q=90'
        },
        subcategories: [
            { name: 'Jewelry', icon: 'fas fa-gem', count: 156 },
            { name: 'Watches', icon: 'fas fa-clock', count: 87 },
            { name: 'Belts', icon: 'fas fa-circle', count: 45 },
            { name: 'Scarves', icon: 'fas fa-wind', count: 38 },
            { name: 'Sunglasses', icon: 'fas fa-glasses', count: 67 },
            { name: 'Hats', icon: 'fas fa-hat-cowboy', count: 23 }
        ]
    },
    'Shoes': {
        banner: {
            title: 'Shoes Fashion',
            subtitle: 'Step in style with our premium footwear collection',
            image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop&auto=format&q=90'
        },
        subcategories: [
            { name: 'Sneakers', icon: 'fas fa-shoe-prints', count: 134 },
            { name: 'Heels', icon: 'fas fa-high-heel', count: 89 },
            { name: 'Boots', icon: 'fas fa-hiking', count: 76 },
            { name: 'Flats', icon: 'fas fa-shoe-prints', count: 54 },
            { name: 'Sandals', icon: 'fas fa-flip-flops', count: 43 },
            { name: 'Athletic', icon: 'fas fa-running', count: 65 }
        ]
    },
    'Bags': {
        banner: {
            title: 'Bags Fashion',
            subtitle: 'Luxury and functional bags for every lifestyle',
            image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&auto=format&q=90'
        },
        subcategories: [
            { name: 'Handbags', icon: 'fas fa-shopping-bag', count: 98 },
            { name: 'Backpacks', icon: 'fas fa-backpack', count: 67 },
            { name: 'Clutches', icon: 'fas fa-wallet', count: 45 },
            { name: 'Totes', icon: 'fas fa-shopping-basket', count: 54 },
            { name: 'Crossbody', icon: 'fas fa-suitcase', count: 43 },
            { name: 'Travel Bags', icon: 'fas fa-luggage-cart', count: 32 }
        ]
    },
    'Jewelry': {
        banner: {
            title: 'Jewelry Fashion',
            subtitle: 'Sparkle and shine with our exquisite jewelry pieces',
            image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&auto=format&q=90'
        },
        subcategories: [
            { name: 'Necklaces', icon: 'fas fa-circle-notch', count: 89 },
            { name: 'Earrings', icon: 'fas fa-dot-circle', count: 76 },
            { name: 'Rings', icon: 'fas fa-ring', count: 65 },
            { name: 'Bracelets', icon: 'fas fa-circle', count: 54 },
            { name: 'Brooches', icon: 'fas fa-star', count: 23 },
            { name: 'Sets', icon: 'fas fa-gem', count: 34 }
        ]
    }
};

// Sample items data for subcategories
const subcategoryItems = {
    'Dresses': [
        {
            id: 'dress1',
            title: 'Elegant Evening Dress',
            price: '$189',
            originalPrice: '$250',
            image: 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F9915d20cfed848ec961a57e0b81de98d?format=webp&width=800',
            category: 'WOMEN FASHION',
            rating: '★★★★★'
        },
        {
            id: 'dress2',
            title: 'Casual Summer Dress',
            price: '$89',
            originalPrice: '$120',
            image: 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F5de41452e8644ee380a72e38d6a74b25?format=webp&width=800',
            category: 'WOMEN FASHION',
            rating: '★★★★☆'
        },
        {
            id: 'dress3',
            title: 'Floral Maxi Dress',
            price: '$129',
            originalPrice: '$180',
            image: 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F081e58fb86c541a9af4297f57d3809c0?format=webp&width=800',
            category: 'WOMEN FASHION',
            rating: '★★★★★'
        }
    ],
    'Shirts': [
        {
            id: 'shirt1',
            title: 'Premium Cotton Shirt',
            price: '$75',
            originalPrice: '$95',
            image: 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F849f7f09fb5840d7b25e7cdc865cdaa9?format=webp&width=800',
            category: 'MEN FASHION',
            rating: '★★★★☆'
        },
        {
            id: 'shirt2',
            title: 'Casual Linen Shirt',
            price: '$65',
            originalPrice: '$85',
            image: 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F341ff6d502c545c4b3ada70308c85526?format=webp&width=800',
            category: 'MEN FASHION',
            rating: '★★★★★'
        },
        {
            id: 'shirt3',
            title: 'Formal Business Shirt',
            price: '$89',
            originalPrice: '$120',
            image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=400&h=400&fit=crop&auto=format&q=90',
            category: 'MEN FASHION',
            rating: '★★★★★'
        }
    ],
    'Pants & Jeans': [
        {
            id: 'pants1',
            title: 'Classic Denim Jeans',
            price: '$89',
            originalPrice: '$120',
            image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&auto=format&q=90',
            category: 'MEN FASHION',
            rating: '★★★★☆'
        },
        {
            id: 'pants2',
            title: 'Formal Dress Pants',
            price: '$95',
            originalPrice: '$130',
            image: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=400&h=400&fit=crop&auto=format&q=90',
            category: 'MEN FASHION',
            rating: '��★★★★'
        },
        {
            id: 'pants3',
            title: 'Chino Pants',
            price: '$79',
            originalPrice: '$100',
            image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop&auto=format&q=90',
            category: 'MEN FASHION',
            rating: '★★★★☆'
        }
    ],
    'Suits & Blazers': [
        {
            id: 'suit1',
            title: 'Premium Business Suit',
            price: '$299',
            originalPrice: '$399',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format&q=90',
            category: 'MEN FASHION',
            rating: '★★★★★'
        },
        {
            id: 'suit2',
            title: 'Navy Blue Blazer',
            price: '$189',
            originalPrice: '$249',
            image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop&auto=format&q=90',
            category: 'MEN FASHION',
            rating: '★��★★☆'
        },
        {
            id: 'suit3',
            title: 'Formal Tuxedo',
            price: '$459',
            originalPrice: '$599',
            image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400&h=400&fit=crop&auto=format&q=90',
            category: 'MEN FASHION',
            rating: '★★★★★'
        }
    ],
    'Jewelry': [
        {
            id: 'jewelry1',
            title: 'Diamond Necklace',
            price: '$599',
            originalPrice: '$799',
            image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&auto=format&q=90',
            category: 'JEWELRY',
            rating: '★��★★★'
        },
        {
            id: 'jewelry2',
            title: 'Gold Bracelet',
            price: '$299',
            originalPrice: '$399',
            image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&fit=crop&auto=format&q=90',
            category: 'JEWELRY',
            rating: '★★★★☆'
        },
        {
            id: 'jewelry3',
            title: 'Silver Earrings',
            price: '$149',
            originalPrice: '$199',
            image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop&auto=format&q=90',
            category: 'JEWELRY',
            rating: '★★★★★'
        }
    ],
    'Sneakers': [
        {
            id: 'sneaker1',
            title: 'Athletic Running Shoes',
            price: '$120',
            originalPrice: '$150',
            image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop&auto=format&q=90',
            category: 'SHOES',
            rating: '�������★★☆'
        }
    ],
    'Handbags': [
        {
            id: 'bag1',
            title: 'Designer Leather Handbag',
            price: '$299',
            originalPrice: '$399',
            image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&auto=format&q=90',
            category: 'BAGS',
            rating: '★★★★★'
        }
    ],
    'Tops & Blouses': [
        {
            id: 'top1',
            title: 'Silk Blouse',
            price: '$89',
            originalPrice: '$129',
            image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&auto=format&q=90',
            category: 'WOMEN FASHION',
            rating: '★★★★★'
        },
        {
            id: 'top2',
            title: 'Cotton Tank Top',
            price: '$45',
            originalPrice: '$65',
            image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format&q=90',
            category: 'WOMEN FASHION',
            rating: '★★★★☆'
        },
        {
            id: 'top3',
            title: 'Elegant Button-Up',
            price: '$75',
            originalPrice: '$99',
            image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&auto=format&q=90',
            category: 'WOMEN FASHION',
            rating: '★★★★★'
        }
    ],
    'Bottoms': [
        {
            id: 'bottom1',
            title: 'High-Waist Jeans',
            price: '$95',
            originalPrice: '$129',
            image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&auto=format&q=90',
            category: 'WOMEN FASHION',
            rating: '★★★★★'
        },
        {
            id: 'bottom2',
            title: 'A-Line Skirt',
            price: '$65',
            originalPrice: '$89',
            image: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=400&h=400&fit=crop&auto=format&q=90',
            category: 'WOMEN FASHION',
            rating: '★★��★☆'
        },
        {
            id: 'bottom3',
            title: 'Wide-Leg Trousers',
            price: '$85',
            originalPrice: '$119',
            image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop&auto=format&q=90',
            category: 'WOMEN FASHION',
            rating: '★★★★★'
        }
    ],
    'Lingerie': [
        {
            id: 'lingerie1',
            title: 'Lace Bralette Set',
            price: '$59',
            originalPrice: '$79',
            image: 'https://images.unsplash.com/photo-1559582927-47885dc4fc02?w=400&h=400&fit=crop&auto=format&q=90',
            category: 'WOMEN FASHION',
            rating: '★★★★★'
        },
        {
            id: 'lingerie2',
            title: 'Satin Sleepwear',
            price: '$89',
            originalPrice: '$119',
            image: 'https://images.unsplash.com/photo-1582639590011-f1973d2a4497?w=400&h=400&fit=crop&auto=format&q=90',
            category: 'WOMEN FASHION',
            rating: '★★★★☆'
        },
        {
            id: 'lingerie3',
            title: 'Comfort Lounge Set',
            price: '$45',
            originalPrice: '$69',
            image: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=400&h=400&fit=crop&auto=format&q=90',
            category: 'WOMEN FASHION',
            rating: '★★★★★'
        }
    ],
    'Casual Wear': [
        {
            id: 'casual1',
            title: 'Cotton T-Shirt',
            price: '$29',
            originalPrice: '$39',
            image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&auto=format&q=90',
            category: 'CASUAL',
            rating: '★★★★☆'
        },
        {
            id: 'casual2',
            title: 'Casual Hoodie',
            price: '$79',
            originalPrice: '$99',
            image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&auto=format&q=90',
            category: 'CASUAL',
            rating: '★★★★★'
        },
        {
            id: 'casual3',
            title: 'Casual Shorts',
            price: '$49',
            originalPrice: '$65',
            image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop&auto=format&q=90',
            category: 'CASUAL',
            rating: '★★��★☆'
        }
    ],
    'Outerwear': [
        {
            id: 'outer1',
            title: 'Leather Jacket',
            price: '$249',
            originalPrice: '$319',
            image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&auto=format&q=90',
            category: 'OUTERWEAR',
            rating: '★★★��★'
        },
        {
            id: 'outer2',
            title: 'Wool Coat',
            price: '$199',
            originalPrice: '$259',
            image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=400&h=400&fit=crop&auto=format&q=90',
            category: 'OUTERWEAR',
            rating: '★★★★☆'
        },
        {
            id: 'outer3',
            title: 'Winter Parka',
            price: '$179',
            originalPrice: '$229',
            image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=400&h=400&fit=crop&auto=format&q=90',
            category: 'OUTERWEAR',
            rating: '★★★★★'
        }
    ],
    'Activewear': [
        {
            id: 'active1',
            title: 'Athletic Joggers',
            price: '$69',
            originalPrice: '$89',
            image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=400&h=400&fit=crop&auto=format&q=90',
            category: 'ACTIVEWEAR',
            rating: '★★★�����☆'
        },
        {
            id: 'active2',
            title: 'Performance T-Shirt',
            price: '$39',
            originalPrice: '$49',
            image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format&q=90',
            category: 'ACTIVEWEAR',
            rating: '★★���★★'
        },
        {
            id: 'active3',
            title: 'Athletic Shorts',
            price: '$45',
            originalPrice: '$59',
            image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&auto=format&q=90',
            category: 'ACTIVEWEAR',
            rating: '★���★★☆'
        }
    ]
};

// Initialize category page
function initializeCategoryPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    const currentCategory = categoryParam || sessionStorage.getItem('selectedCategory') || 'Women';

    updatePageTitle(currentCategory);
    updateBreadcrumb(currentCategory);
    updateCategoryBanner(currentCategory);
    updateBackButton(currentCategory);
    loadSubcategories(currentCategory);
    setupProfileDropdown();
    setupCartModal();
}

// Update page title and header
function updatePageTitle(category) {
    const pageTitle = document.getElementById('categoryPageTitle');
    if (pageTitle) {
        pageTitle.textContent = category;
    }
    document.title = `${category} - StyleHub`;
}

// Update breadcrumb navigation
function updateBreadcrumb(category) {
    const breadcrumbCurrent = document.getElementById('breadcrumbCurrent');
    if (breadcrumbCurrent) {
        breadcrumbCurrent.textContent = category;
    }
}

// Update category banner
function updateCategoryBanner(category) {
    const bannerTitle = document.getElementById('bannerTitle');
    const bannerSubtitle = document.getElementById('bannerSubtitle');
    const bannerImage = document.getElementById('bannerImage');
    const categoryBanner = document.getElementById('categoryBanner');

    const categoryInfo = categoryData[category];
    if (categoryInfo && categoryInfo.banner) {
        if (bannerTitle) bannerTitle.textContent = categoryInfo.banner.title;
        if (bannerSubtitle) bannerSubtitle.textContent = categoryInfo.banner.subtitle;
        if (bannerImage) {
            bannerImage.src = categoryInfo.banner.image;
            bannerImage.alt = `${category} Fashion`;
        }
        if (categoryBanner) categoryBanner.style.display = 'flex';
    } else {
        // Hide banner if no category info
        if (categoryBanner) categoryBanner.style.display = 'none';
    }
}

// Update back button text
function updateBackButton(category) {
    const backBtn = document.getElementById('backBtn');
    const backBtnSpan = backBtn ? backBtn.querySelector('span') : null;

    if (backBtnSpan) {
        backBtnSpan.textContent = category;
    }
}

// Load subcategories for the selected category
function loadSubcategories(category) {
    const subcategoriesGrid = document.getElementById('subcategoriesGrid');
    const subcategoriesSection = document.getElementById('subcategoriesSection');
    const categoryItemsSection = document.getElementById('categoryItemsSection');

    if (!subcategoriesGrid) return;

    // Show subcategories section, hide items section
    if (subcategoriesSection) subcategoriesSection.classList.remove('hidden');
    if (categoryItemsSection) categoryItemsSection.classList.add('hidden');

    const categoryInfo = categoryData[category];
    if (!categoryInfo) {
        subcategoriesGrid.innerHTML = '<p>No subcategories found for this category.</p>';
        return;
    }

    subcategoriesGrid.innerHTML = categoryInfo.subcategories.map(subcategory => `
        <div class="subcategory-card" onclick="loadCategoryItems('${subcategory.name}')">
            <div class="subcategory-icon">
                <i class="${subcategory.icon}"></i>
            </div>
            <h3 class="subcategory-title">${subcategory.name}</h3>
            <p class="subcategory-count">${subcategory.count} items</p>
        </div>
    `).join('');
}

// Load items for a specific subcategory
function loadCategoryItems(subcategory) {
    const subcategoriesSection = document.getElementById('subcategoriesSection');
    const categoryItemsSection = document.getElementById('categoryItemsSection');
    const itemsSectionTitle = document.getElementById('itemsSectionTitle');
    const categoryItemsGrid = document.getElementById('categoryItemsGrid');
    const breadcrumbCurrent = document.getElementById('breadcrumbCurrent');

    // Update breadcrumb to show subcategory
    if (breadcrumbCurrent) {
        breadcrumbCurrent.textContent = subcategory;
    }

    // Update section title
    if (itemsSectionTitle) {
        itemsSectionTitle.textContent = subcategory;
    }

    // Hide subcategories, show items
    if (subcategoriesSection) subcategoriesSection.classList.add('hidden');
    if (categoryItemsSection) categoryItemsSection.classList.remove('hidden');

    // Load items for this subcategory
    const items = subcategoryItems[subcategory] || [];

    if (items.length === 0) {
        categoryItemsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <h3>Coming Soon</h3>
                <p>Items for ${subcategory} will be available soon.</p>
                <button class="back-btn" onclick="goBackToSubcategories()">
                    <i class="fas fa-arrow-left"></i>
                    <span>Back to Categories</span>
                </button>
            </div>
        `;
        return;
    }

    categoryItemsGrid.innerHTML = items.map(item => `
        <div class="colorful-product-card purple-bg">
            <div class="product-category-tag">${item.category}</div>
            <div class="colorful-product-image">
                <img src="${item.image}" alt="${item.title}" class="colorful-product-img">
                <button class="colorful-wishlist-btn" onclick="addToWishlistFromCategory('${item.id}')">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            <div class="colorful-product-info">
                <h3 class="colorful-product-title">${item.title}</h3>
                <div class="product-rating">
                    <span class="stars">${item.rating}</span>
                </div>
                <div class="colorful-product-price">
                    <span class="current-price">${item.price}</span>
                    ${item.originalPrice ? `<span class="original-price">${item.originalPrice}</span>` : ''}
                </div>
                <button class="colorful-add-to-cart" onclick="addToCartFromCategory('${item.id}')">Add to cart</button>
            </div>
        </div>
    `).join('');

    // Store current subcategory for back navigation
    sessionStorage.setItem('currentSubcategory', subcategory);
}

// Go back to subcategories view
function goBackToSubcategories() {
    const urlParams = new URLSearchParams(window.location.search);
    const currentCategory = urlParams.get('category') || sessionStorage.getItem('selectedCategory') || 'Categories';

    updateBreadcrumb(currentCategory);
    loadSubcategories(currentCategory);
}

// Back button functionality
function goBack() {
    const categoryItemsSection = document.getElementById('categoryItemsSection');

    // If we're viewing items, go back to subcategories
    if (categoryItemsSection && !categoryItemsSection.classList.contains('hidden')) {
        goBackToSubcategories();
        return;
    }

    // Otherwise, go back to home page
    window.location.href = 'index.html';
}

// Add to cart functionality for category items
function addToCartFromCategory(itemId) {
    // Find the item data
    let item = null;
    for (const subcategory in subcategoryItems) {
        const found = subcategoryItems[subcategory].find(i => i.id === itemId);
        if (found) {
            item = found;
            break;
        }
    }

    if (item) {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            // Ensure image has a proper URL
            const imageUrl = item.image && item.image !== 'undefined' && item.image !== ''
                ? item.image
                : 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F9915d20cfed848ec961a57e0b81de98d?format=webp&width=400';

            cart.push({
                id: item.id,
                title: item.title,
                price: typeof item.price === 'string' ? item.price : `₹${item.price}`,
                image: imageUrl,
                quantity: 1
            });
        }
        updateCartCount();
        saveCartToStorage();
        showNotification(`${item.title} added to cart!`, 'success');
    }
}

// Add to wishlist functionality for category items
function addToWishlistFromCategory(itemId) {
    // Find the item data
    let item = null;
    for (const subcategory in subcategoryItems) {
        const found = subcategoryItems[subcategory].find(i => i.id === itemId);
        if (found) {
            item = found;
            break;
        }
    }

    if (item) {
        const existingItem = wishlist.find(wishItem => wishItem.id === item.id);
        if (!existingItem) {
            wishlist.push({
                id: item.id,
                title: item.title,
                price: item.price,
                image: item.image
            });
            showNotification(`${item.title} added to wishlist!`, 'success');
        } else {
            showNotification(`${item.title} is already in your wishlist!`, 'info');
        }
    }
}

// Collection Page Navigation and Setup
function setupCollectionNavigation() {
    // Handle hero slider CTA buttons navigation to collection page
    const heroCtaBtns = document.querySelectorAll('.slide-cta-btn');

    heroCtaBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const slideContent = btn.closest('.slide-content');
            const slideTitle = slideContent.querySelector('.title-main').textContent;
            const collectionType = determineCollectionType(btn.textContent, slideTitle);

            navigateToCollectionPage(collectionType);
        });
    });

    // Handle seasonal collection buttons
    const seasonalBtns = document.querySelectorAll('.seasonal-card-button');
    seasonalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const seasonTitle = btn.closest('.seasonal-card').querySelector('.seasonal-card-title').textContent;
            const collectionType = seasonTitle.toLowerCase().replace(' collection', '');

            navigateToCollectionPage(collectionType);
        });
    });
}

function determineCollectionType(btnText, slideTitle) {
    if (btnText.includes('Winter') || slideTitle.includes('WINTER')) {
        return 'winter';
    } else if (btnText.includes('Spring') || slideTitle.includes('SPRING')) {
        return 'spring';
    } else if (btnText.includes('Summer') || slideTitle.includes('SUMMER')) {
        return 'summer';
    } else if (btnText.includes('Exclusive') || slideTitle.includes('DESIGNER')) {
        return 'exclusive';
    } else {
        return 'winter'; // Default to winter
    }
}

function navigateToCollectionPage(collectionType) {
    // Hide all main page sections
    const sectionsToHide = [
        '.hero-slider-section',
        '.fashion-stories-section',
        '.seasonal-collections-section',
        '.trending-popular-section',
        '.recommendations-section',
        '.categories-section',
        '.new-arrivals-section',
        '.newsletter-section'
    ];

    sectionsToHide.forEach(selector => {
        const section = document.querySelector(selector);
        if (section) section.style.display = 'none';
    });

    // Show collection page
    const collectionPage = document.getElementById('collectionPage');
    if (collectionPage) {
        collectionPage.style.display = 'block';
        loadCollectionContent(collectionType);
        window.scrollTo(0, 0);

        showNotification(`Welcome to ${collectionType.charAt(0).toUpperCase() + collectionType.slice(1)} Collection!`, 'success');
    }
}

function loadCollectionContent(collectionType) {
    const collectionData = getCollectionData(collectionType);

    // Update collection header
    const collectionTitle = document.getElementById('collectionTitle');
    const collectionTagline = document.getElementById('collectionTagline');
    const collectionHeroImage = document.querySelector('#collectionHeroImage img');

    if (collectionTitle) collectionTitle.textContent = collectionData.title;
    if (collectionTagline) collectionTagline.textContent = collectionData.tagline;
    if (collectionHeroImage) collectionHeroImage.src = collectionData.heroImage;

    // Update active collection tab
    const collectionTabs = document.querySelectorAll('.collection-tab');
    collectionTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.collection === collectionType) {
            tab.classList.add('active');
        }
    });

    // Load products for this collection
    loadCollectionProducts(collectionType);

    // Update styling and content based on collection
    updateCollectionStyling(collectionType);
}

function getCollectionData(collectionType) {
    const collections = {
        winter: {
            title: 'Winter Collection ❄️',
            tagline: 'Explore cozy coats, chic sweaters, and stylish accessories designed to keep you warm and elegant this season.',
            heroImage: 'https://cdn.builder.io/api/v1/image/assets%2Fa91527f2fe264920accbd14578b2df55%2F15723a5439104d63b98f8303a1efcea3?format=webp&width=1200',
            theme: 'winter'
        },
        spring: {
            title: 'Spring Collection 2025',
            tagline: 'Fresh styles for the new season ahead',
            heroImage: 'https://cdn.builder.io/api/v1/image/assets%2Fa91527f2fe264920accbd14578b2df55%2F72f8c53f7fb240f78689e888234308cb?format=webp&width=1200',
            theme: 'spring'
        },
        summer: {
            title: 'Summer Collection 2025',
            tagline: 'Light, breezy styles for sunny days',
            heroImage: 'https://cdn.builder.io/api/v1/image/assets%2Fa91527f2fe264920accbd14578b2df55%2Fb0bd47d0cef64e398781bc1c01fbde2e?format=webp&width=1200',
            theme: 'summer'
        },
        exclusive: {
            title: 'Exclusive Designer Collection',
            tagline: 'Luxury pieces for the discerning fashionista',
            heroImage: 'https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f?w=1200&h=600&fit=crop&auto=format&q=80',
            theme: 'exclusive'
        }
    };

    return collections[collectionType] || collections.winter;
}

function loadCollectionProducts(collectionType) {
    const productsGrid = document.getElementById('collectionProductsGrid');
    const productsCount = document.getElementById('productsCount');

    if (!productsGrid) return;

    const products = generateCollectionProducts(collectionType);

    if (productsCount) productsCount.textContent = `${products.length} items`;

    // Render products
    productsGrid.innerHTML = products.map(p => `
        <div class="collection-product-card" data-category="${p.category || 'all'}" data-price="${p.price || 0}">
            <div class="product-image-container">
                <img src="${p.image || 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&h=600&fit=crop'}" alt="${p.name}" class="product-image">
                <div class="product-hover-image">
                    <img src="${p.image || 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&h=600&fit=crop'}" alt="${p.name}" class="hover-image">
                </div>
                <button class="product-wishlist-btn"><i class="far fa-heart"></i></button>
            </div>
            <div class="product-info">
                <h4 class="product-name">${p.name}</h4>
                <div class="product-rating">
                    <span class="stars">${p.rating || '★★★★☆'}</span>
                    <span class="rating-count">(120)</span>
                </div>
                <div class="product-price">₹${(p.price || 0).toLocaleString()}</div>
                <div class="product-actions">
                    <button class="add-to-cart-btn"><i class="fas fa-shopping-bag"></i> Add to Cart</button>
                    <button class="quick-view-btn"><i class="fas fa-eye"></i> Quick View</button>
                </div>
            </div>
        </div>
    `).join('');

    // Re-bind action listeners for newly rendered cards
    setupQuickActions();

    // Apply current active category filter if any
    const activeFilter = document.querySelector('.category-filter.active');
    if (activeFilter) {
        filterProductsByCategory(activeFilter.dataset.category);
    } else {
        updateProductsCount();
    }
}

function generateCollectionProducts(collectionType) {
    // This would typically come from an API, but for demo purposes we'll use the existing products
    const baseProducts = [
        { name: 'Wool Blend Overcoat', price: 4999, category: 'coats', rating: '★★★★★', image: 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F302ea9cbe68a4e86aa894e18fdddf869?format=webp&width=400' },
        { name: 'Cashmere Turtleneck Sweater', price: 2899, category: 'sweaters', rating: '★★★★☆', image: 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2Fcd41764914f3435db0789865df8be918?format=webp&width=400' },
        { name: 'Quilted Puffer Jacket', price: 3499, category: 'jackets', rating: '★��★★★', image: 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F849f7f09fb5840d7b25e7cdc865cdaa9?format=webp&width=400' },
        { name: 'Knit Winter Dress', price: 2199, category: 'dresses', rating: '★★★★☆', image: 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F9915d20cfed848ec961a57e0b81de98d?format=webp&width=400' },
        { name: 'Leather Winter Gloves', price: 899, category: 'accessories', rating: '★★���★★', image: 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F081e58fb86c541a9af4297f57d3809c0?format=webp&width=400' },
        { name: 'Designer Wool Scarf', price: 1299, category: 'accessories', rating: '★���★★☆', image: 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F5eccc65dc3744b36bfe1a6bc749e0af5?format=webp&width=400' },
        { name: 'Premium Bomber Jacket', price: 3899, category: 'jackets', rating: '★��★★★', image: 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F8c2b221fa19b42968096df5cef83e949?format=webp&width=400' },
        { name: 'Merino Wool Cardigan', price: 2499, category: 'sweaters', rating: '★★★★☆', image: 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F341ff6d502c545c4b3ada70308c85526?format=webp&width=400' }
    ];

    // Adjust products based on collection type
    if (collectionType === 'spring') {
        return [
            { name: 'Spring Floral Dress', price: 139, category: 'dresses' },
            { name: 'Light Cotton Blazer', price: 169, category: 'outerwear' },
            { name: 'Pastel Cardigan', price: 99, category: 'tops' },
            { name: 'Spring Ankle Boots', price: 179, category: 'footwear' },
            { name: 'Silk Scarf', price: 69, category: 'accessories' },
            { name: 'Cropped Denim Jacket', price: 119, category: 'outerwear' }
        ];
    } else if (collectionType === 'summer') {
        return [
            { name: 'Maxi Summer Dress', price: 119, category: 'dresses' },
            { name: 'Linen Blouse', price: 89, category: 'tops' },
            { name: 'Wide-Leg Pants', price: 109, category: 'bottoms' },
            { name: 'Summer Sandals', price: 159, category: 'footwear' },
            { name: 'Beach Tote Bag', price: 79, category: 'accessories' },
            { name: 'Lightweight Kimono', price: 99, category: 'outerwear' }
        ];
    } else if (collectionType === 'exclusive') {
        return [
            { name: 'Designer Evening Gown', price: 599, category: 'dresses' },
            { name: 'Luxury Silk Blouse', price: 399, category: 'tops' },
            { name: 'Italian Leather Jacket', price: 899, category: 'outerwear' },
            { name: 'Designer Handbag', price: 1299, category: 'accessories' },
            { name: 'Premium Wool Coat', price: 799, category: 'outerwear' },
            { name: 'Couture Cocktail Dress', price: 1099, category: 'dresses' }
        ];
    }

    return baseProducts;
}

function updateCollectionStyling(collectionType) {
    const collectionPage = document.getElementById('collectionPage');
    if (!collectionPage) return;

    // Remove existing theme classes
    collectionPage.classList.remove('winter-theme', 'spring-theme', 'summer-theme', 'exclusive-theme');

    // Add theme class
    collectionPage.classList.add(`${collectionType}-theme`);
}

// Enhanced Collection Page Setup
function setupCollectionPage() {
    setupCollectionTabs();
    setupCollectionFilters();
    setupCollectionSort();
    setupBackNavigation();
    setupFloatingButton();
    setupQuickActions();
}

function setupCollectionTabs() {
    const collectionTabs = document.querySelectorAll('.collection-tab');

    collectionTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const collectionType = tab.dataset.collection;

            // Update active tab
            collectionTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Load new collection content
            loadCollectionContent(collectionType);

            showNotification(`Switched to ${collectionType.charAt(0).toUpperCase() + collectionType.slice(1)} Collection`, 'info');
        });
    });
}

function setupCollectionFilters() {
    // Category filters
    const categoryFilters = document.querySelectorAll('.category-filter');
    categoryFilters.forEach(filter => {
        filter.addEventListener('click', async () => {
            // Remove active from all filters
            categoryFilters.forEach(f => f.classList.remove('active'));
            // Add active to clicked filter
            filter.classList.add('active');

            const category = filter.dataset.category;
            await fetchAndRenderCategory(category);

            showNotification(`Filtering by: ${filter.textContent}`, 'info');
        });
    });

    // Color swatches
    const colorSwatches = document.querySelectorAll('.color-swatch');
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            // Toggle active state
            const isActive = swatch.classList.contains('active');

            // Remove active from all swatches
            colorSwatches.forEach(s => s.classList.remove('active'));

            // Add active to clicked swatch if it wasn't active
            if (!isActive) {
                swatch.classList.add('active');
                const color = swatch.dataset.color;
                filterProductsByColor(color);
                showNotification(`Filtering by color: ${color}`, 'info');
            } else {
                // If clicking an active swatch, show all colors
                showAllProducts();
                showNotification('Showing all colors', 'info');
            }
        });
    });

    // Price range slider
    const priceSlider = document.getElementById('priceRange');
    const currentPriceValue = document.getElementById('currentPriceValue');

    if (priceSlider && currentPriceValue) {
        priceSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            currentPriceValue.textContent = `₹${value.toLocaleString()}`;
            filterProductsByPrice(value);
        });
    }

    // Size filter
    const sizeFilter = document.getElementById('sizeFilter');
    if (sizeFilter) {
        sizeFilter.addEventListener('change', () => {
            applyAdvancedFilters();
        });
    }

    // Sort filter
    const sortFilter = document.getElementById('sortFilter') || document.getElementById('modernSortFilter');
    if (sortFilter) {
        sortFilter.addEventListener('change', () => {
            const val = sortFilter.value;
            if (val === 'price-low' || val === 'price-high' || val === 'bestsellers' || val === 'newest' || val === 'rating') {
                sortProducts(val);
            } else {
                applyAdvancedFilters();
            }
        });
    }
}

function getActiveCollectionType() {
    const activeTab = document.querySelector('.collection-tab.active');
    return activeTab ? activeTab.dataset.collection : 'winter';
}

async function fetchProductsByCategory(category) {
    const type = getActiveCollectionType();
    const all = generateCollectionProducts(type);
    const filtered = category === 'all' ? all : all.filter(p => (p.category || '').toLowerCase() === category.toLowerCase());
    // Simulate network latency for loading animation
    await new Promise(r => setTimeout(r, 400));
    return filtered;
}

function renderSkeletonCards(count = 8) {
    const productsGrid = document.getElementById('collectionProductsGrid');
    if (!productsGrid) return;
    const skeleton = Array.from({ length: count }).map(() => `
        <div class="collection-product-card skeleton">
            <div class="product-image-container">
                <div class="skeleton-box img"></div>
            </div>
            <div class="product-info">
                <div class="skeleton-box line"></div>
                <div class="skeleton-box line short"></div>
                <div class="skeleton-box btn"></div>
            </div>
        </div>`).join('');
    productsGrid.innerHTML = skeleton;
}

function renderProductsList(products) {
    const productsGrid = document.getElementById('collectionProductsGrid');
    if (!productsGrid) return;

    if (!products || products.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state">
                <p>No items found in this category. Try another one.</p>
                <button id="backToAllItems" class="empty-cta">Back to All Items</button>
            </div>`;
        const btn = document.getElementById('backToAllItems');
        if (btn) btn.addEventListener('click', () => {
            const allBtn = document.querySelector('.category-filter[data-category="all"]');
            if (allBtn) allBtn.click();
        });
        updateProductsCount();
        return;
    }

    productsGrid.innerHTML = products.map(p => `
        <div class="collection-product-card fade-in" data-category="${p.category || 'all'}" data-price="${p.price || 0}">
            <div class="product-image-container">
                <img src="${p.image || 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&h=600&fit=crop'}" alt="${p.name}" class="product-image">
                <div class="product-hover-image">
                    <img src="${p.image || 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&h=600&fit=crop'}" alt="${p.name}" class="hover-image">
                </div>
                <button class="product-wishlist-btn"><i class="far fa-heart"></i></button>
            </div>
            <div class="product-info">
                <h4 class="product-name">${p.name}</h4>
                <div class="product-rating">
                    <span class="stars">${p.rating || '★★★★☆'}</span>
                    <span class="rating-count">(120)</span>
                </div>
                <div class="product-price">₹${(p.price || 0).toLocaleString()}</div>
                <div class="product-actions">
                    <button class="add-to-cart-btn"><i class="fas fa-shopping-bag"></i> Add to Cart</button>
                    <button class="quick-view-btn"><i class="fas fa-eye"></i> Quick View</button>
                </div>
            </div>
        </div>`).join('');

    setupQuickActions();
    updateProductsCount();
}

async function fetchAndRenderCategory(category) {
    renderSkeletonCards();
    const products = await fetchProductsByCategory(category);
    renderProductsList(products);
}

function filterProductsByCategory(category) {
    // Backward compatibility: use async fetch + render
    fetchAndRenderCategory(category);
}

function applyAdvancedFilters() {
    const sizeFilter = document.getElementById('sizeFilter').value;
    const colorFilter = document.getElementById('colorFilter').value;
    const priceFilter = document.getElementById('priceFilter').value;
    const materialFilter = document.getElementById('materialFilter').value;

    const productCards = document.querySelectorAll('.collection-product-card');

    productCards.forEach(card => {
        let shouldShow = true;

        // Apply price filter
        if (priceFilter) {
            const price = parseInt(card.dataset.price);
            const [min, max] = priceFilter.includes('-') ?
                priceFilter.split('-').map(p => parseInt(p)) :
                [parseInt(priceFilter.replace('+', '')), Infinity];

            if (price < min || price > max) {
                shouldShow = false;
            }
        }

        // Apply other filters (simplified for demo)
        if (sizeFilter && !shouldShow) shouldShow = false;
        if (colorFilter && !shouldShow) shouldShow = false;
        if (materialFilter && !shouldShow) shouldShow = false;

        card.style.display = shouldShow ? 'block' : 'none';
    });

    updateProductsCount();
    showNotification('Filters applied', 'success');
}

function setupCollectionSort() {
    const sortFilter = document.getElementById('sortFilter');

    if (sortFilter) {
        sortFilter.addEventListener('change', (e) => {
            const sortBy = e.target.value;
            sortProducts(sortBy);
            showNotification(`Sorted by: ${e.target.options[e.target.selectedIndex].text}`, 'info');
        });
    }
}

function sortProducts(sortBy) {
    const productsGrid = document.getElementById('collectionProductsGrid');
    const productCards = Array.from(productsGrid.querySelectorAll('.collection-product-card'));

    productCards.sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return parseInt(a.dataset.price) - parseInt(b.dataset.price);
            case 'price-high':
                return parseInt(b.dataset.price) - parseInt(a.dataset.price);
            case 'newest':
                return Math.random() - 0.5; // Random for demo
            case 'bestsellers':
                return Math.random() - 0.5; // Random for demo
            case 'rating':
                return Math.random() - 0.5; // Random for demo
            default:
                return 0;
        }
    });

    // Reorder in DOM
    productCards.forEach(card => {
        productsGrid.appendChild(card);
    });
}

function setupBackNavigation() {
    const backToHomeBtn = document.getElementById('backToHome');

    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', () => {
            hideCollectionPage();
        });
    }
}

function hideCollectionPage() {
    // Hide collection page
    const collectionPage = document.getElementById('collectionPage');
    if (collectionPage) {
        collectionPage.style.display = 'none';
    }

    // Show all main page sections
    const sectionsToShow = [
        '.hero-slider-section',
        '.fashion-stories-section',
        '.seasonal-collections-section',
        '.trending-popular-section',
        '.recommendations-section',
        '.categories-section',
        '.new-arrivals-section',
        '.newsletter-section'
    ];

    sectionsToShow.forEach(selector => {
        const section = document.querySelector(selector);
        if (section) section.style.display = 'block';
    });

    // Scroll to top
    window.scrollTo(0, 0);

    showNotification('Back to homepage', 'info');
}

function setupFloatingButton() {
    // Create floating "Shop Bestsellers" button
    const floatingButton = document.createElement('div');
    floatingButton.className = 'floating-shop-btn';
    floatingButton.innerHTML = `
        <button class="shop-bestsellers-btn">
            <i class="fas fa-star"></i>
            Shop Bestsellers
        </button>
    `;

    // Add to collection page
    const collectionPage = document.getElementById('collectionPage');
    if (collectionPage) {
        collectionPage.appendChild(floatingButton);

        // Add click handler
        const btn = floatingButton.querySelector('.shop-bestsellers-btn');
        btn.addEventListener('click', () => {
            // Filter to show bestsellers
            const sortFilter = document.getElementById('sortFilter');
            if (sortFilter) {
                sortFilter.value = 'bestsellers';
                sortProducts('bestsellers');
            }

            // Scroll to products
            const productsSection = document.querySelector('.collection-products');
            if (productsSection) {
                productsSection.scrollIntoView({ behavior: 'smooth' });
            }

            showNotification('Showing bestsellers!', 'success');
        });
    }
}

function setupQuickActions() {
    // Add to cart buttons
    const addToCartBtns = document.querySelectorAll('.collection-product-card .add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAddToCart(e);
        });
    });

    // Wishlist buttons
    const wishlistBtns = document.querySelectorAll('.collection-product-card .product-wishlist-btn');
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleWishlist(e);
        });
    });

    // Quick view buttons
    const quickViewBtns = document.querySelectorAll('.collection-product-card .quick-view-btn');
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleQuickView(e);
        });
    });
}

function updateProductsCount() {
    const visibleProducts = document.querySelectorAll('.collection-product-card[style*="block"], .collection-product-card:not([style*="none"])');
    const productsCount = document.getElementById('productsCount');

    if (productsCount) {
        const count = visibleProducts.length;
        productsCount.textContent = `${count} item${count !== 1 ? 's' : ''}`;
    }
}

// Additional filtering functions
function filterProductsByColor(color) {
    const productCards = document.querySelectorAll('.collection-product-card');

    productCards.forEach(card => {
        // For demo purposes, we'll show/hide products randomly
        // In a real app, this would filter by actual product color data
        const shouldShow = Math.random() > 0.3; // Show 70% of products
        card.style.display = shouldShow ? 'block' : 'none';
    });

    updateProductsCount();
}

function filterProductsByPrice(maxPrice) {
    const productCards = document.querySelectorAll('.collection-product-card');

    productCards.forEach(card => {
        const price = parseInt(card.dataset.price);
        card.style.display = price <= maxPrice ? 'block' : 'none';
    });

    updateProductsCount();
}

function showAllProducts() {
    const productCards = document.querySelectorAll('.collection-product-card');

    productCards.forEach(card => {
        card.style.display = 'block';
    });

    updateProductsCount();
}

// Carousel functionality
function setupCarousels() {
    setupTopPicksCarousel();
}

function setupTopPicksCarousel() {
    const track = document.getElementById('topPicksTrack');
    const prevBtn = document.getElementById('topPicksPrev');
    const nextBtn = document.getElementById('topPicksNext');

    if (!track || !prevBtn || !nextBtn) return;

    let currentPosition = 0;
    const cardWidth = 280 + 24; // card width + gap
    const visibleCards = Math.floor(track.parentElement.offsetWidth / cardWidth);
    const totalCards = track.children.length;
    const maxPosition = Math.max(0, totalCards - visibleCards);

    prevBtn.addEventListener('click', () => {
        if (currentPosition > 0) {
            currentPosition--;
            updateCarouselPosition();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentPosition < maxPosition) {
            currentPosition++;
            updateCarouselPosition();
        }
    });

    function updateCarouselPosition() {
        const translateX = -currentPosition * cardWidth;
        track.style.transform = `translateX(${translateX}px)`;

        // Update button states
        prevBtn.style.opacity = currentPosition === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentPosition === maxPosition ? '0.5' : '1';
    }

    // Initialize button states
    updateCarouselPosition();

    // Handle window resize
    window.addEventListener('resize', () => {
        const newVisibleCards = Math.floor(track.parentElement.offsetWidth / cardWidth);
        const newMaxPosition = Math.max(0, totalCards - newVisibleCards);

        if (currentPosition > newMaxPosition) {
            currentPosition = newMaxPosition;
            updateCarouselPosition();
        }
    });
}

// Enhanced collection page setup
function setupCollectionPage() {
    setupCollectionTabs();
    setupCollectionFilters();
    setupCollectionSort();
    setupBackNavigation();
    setupFloatingButton();
    setupQuickActions();
    setupCarousels();
    setupWinterFeatures();
}

function setupWinterFeatures() {
    // Top picks carousel interactions
    const pickCards = document.querySelectorAll('.top-pick-card');
    pickCards.forEach(card => {
        const wishlistBtn = card.querySelector('.pick-wishlist-btn');
        const cartBtn = card.querySelector('.pick-cart-btn');
        const viewBtn = card.querySelector('.pick-view-btn');

        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const icon = wishlistBtn.querySelector('i');
                const isLiked = icon.classList.contains('fas');

                if (isLiked) {
                    icon.className = 'far fa-heart';
                    showNotification('Removed from wishlist', 'info');
                } else {
                    icon.className = 'fas fa-heart';
                    showNotification('Added to wishlist!', 'success');
                }
            });
        }

        if (cartBtn) {
            cartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productName = card.querySelector('.pick-title').textContent;
                showNotification(`${productName} added to cart!`, 'success');

                // Add cart animation
                cartBtn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    cartBtn.style.transform = 'scale(1)';
                }, 150);
            });
        }

        if (viewBtn) {
            viewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productName = card.querySelector('.pick-title').textContent;
                showNotification(`Quick view: ${productName}`, 'info');
            });
        }
    });

    // Complete your look suggestions
    const suggestionCards = document.querySelectorAll('.suggestion-card');
    suggestionCards.forEach(card => {
        const addBtn = card.querySelector('.suggestion-add-btn');

        if (addBtn) {
            addBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productName = card.querySelector('h5').textContent;
                showNotification(`${productName} added to cart!`, 'success');

                // Change button text temporarily
                const originalText = addBtn.textContent;
                addBtn.textContent = '✓ Added';
                addBtn.style.background = '#28a745';

                setTimeout(() => {
                    addBtn.textContent = originalText;
                    addBtn.style.background = '';
                }, 1500);
            });
        }
    });

    // Cross-season recommendations
    const recBtns = document.querySelectorAll('.recommendation-btn');
    recBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const title = btn.closest('.recommendation-card').querySelector('.recommendation-title').textContent;
            showNotification(`Exploring: ${title}`, 'info');
        });
    });

    // Shop Best Deals CTA
    const bestDealsBtn = document.querySelector('.shop-best-deals-btn');
    if (bestDealsBtn) {
        bestDealsBtn.addEventListener('click', () => {
            // Scroll to products and show sale items
            const productsSection = document.querySelector('.collection-products');
            if (productsSection) {
                productsSection.scrollIntoView({ behavior: 'smooth' });
            }

            showNotification('Showing best deals! 🔥', 'success');

            // Add special highlighting to products
            const productCards = document.querySelectorAll('.collection-product-card');
            productCards.forEach((card, index) => {
                if (index < 3) { // Highlight first 3 as "deals"
                    card.style.borderColor = '#ff6b6b';
                    card.style.borderWidth = '2px';
                    card.style.borderStyle = 'solid';

                    setTimeout(() => {
                        card.style.border = '';
                    }, 3000);
                }
            });
        });
    }
}
