// Product Detail Page JavaScript

// Initialize product detail page
document.addEventListener('DOMContentLoaded', function() {
    initializeProductDetail();
    loadProductData();
    setupProductEventListeners();
});

// Product data (this would typically come from an API or URL params)
let currentProduct = {
    id: 1,
    title: 'Traditional Salwar Kameez Set',
    brand: 'StyleHub',
    tagline: 'Elegant Traditional Wear for Special Occasions',
    currentPrice: 250,
    originalPrice: 300,
    discount: 16,
    rating: 4.8,
    reviewCount: 1245,
    images: {
        main: 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F9915d20cfed848ec961a57e0b81de98d?format=webp&width=800',
        side: 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F5de41452e8644ee380a72e38d6a74b25?format=webp&width=800',
        back: 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F081e58fb86c541a9af4297f57d3809c0?format=webp&width=800',
        detail: 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F9915d20cfed848ec961a57e0b81de98d?format=webp&width=800'
    },
    colors: ['orange', 'blue', 'red', 'green'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    selectedColor: 'orange',
    selectedSize: 'M',
    inStock: true,
    stockCount: 3
};

function initializeProductDetail() {
    // Check if product data is passed from main page
    const urlParams = new URLSearchParams(window.location.search);
    const productData = urlParams.get('product');
    
    if (productData) {
        try {
            currentProduct = { ...currentProduct, ...JSON.parse(decodeURIComponent(productData)) };
        } catch (e) {
            console.log('Using default product data');
        }
    }
}

function loadProductData() {
    // Update product information
    document.getElementById('productTitle').textContent = currentProduct.title;
    document.getElementById('productBrand').textContent = currentProduct.brand;
    document.getElementById('productTagline').textContent = currentProduct.tagline;
    document.getElementById('currentPrice').textContent = `$${currentProduct.currentPrice}`;
    document.getElementById('originalPrice').textContent = `$${currentProduct.originalPrice}`;
    document.getElementById('bottomPrice').textContent = `$${currentProduct.currentPrice}`;
    
    // Update cart badge
    const cartBadge = document.getElementById('cartBadge');
    const cartCount = getCartItemCount();
    cartBadge.textContent = cartCount;
    
    // Load main image
    const mainImage = document.getElementById('mainProductImage');
    mainImage.src = currentProduct.images.main;
    mainImage.alt = currentProduct.title;
    
    // Load thumbnail images
    const thumbnails = document.querySelectorAll('.thumbnail img');
    const imageKeys = ['main', 'side', 'back', 'detail'];
    thumbnails.forEach((thumb, index) => {
        if (currentProduct.images[imageKeys[index]]) {
            thumb.src = currentProduct.images[imageKeys[index]];
        }
    });
    
    // Update combo item main image
    const comboMainItem = document.querySelector('.combo-item.main-item img');
    if (comboMainItem) {
        comboMainItem.src = currentProduct.images.main;
    }
    
    // Set discount percentage
    const discountEl = document.querySelector('.discount-percentage');
    discountEl.textContent = `${currentProduct.discount}% OFF`;
    
    // Set rating and review count
    document.querySelector('.rating-score').textContent = currentProduct.rating;
    document.querySelector('.review-count').textContent = `${currentProduct.reviewCount.toLocaleString()} reviews`;
    
    // Update stock info
    const stockInfo = document.querySelector('.stock-info span');
    stockInfo.textContent = `Only ${currentProduct.stockCount} left in Size ${currentProduct.selectedSize}`;
}

function setupProductEventListeners() {
    // Back button
    const backBtn = document.getElementById('backBtn');
    backBtn.addEventListener('click', () => {
        window.history.back();
    });
    
    // Header icons
    setupHeaderIcons();
    
    // Gallery functionality
    setupGallery();
    
    // Color selection
    setupColorSelection();
    
    // Size selection
    setupSizeSelection();
    
    // Size guide modal
    setupSizeGuide();
    
    // Delivery checker
    setupDeliveryChecker();
    
    // Add to cart and buy now
    setupPurchaseButtons();
    
    // Review functionality
    setupReviewFunctionality();
    
    // Recommendations
    setupRecommendations();
    
    // Apply coupon
    setupCouponFunctionality();
    
    // Image zoom
    setupImageZoom();
    
    // Video try-on
    setupVideoTryOn();
}

function setupHeaderIcons() {
    // Search button
    document.getElementById('searchBtn').addEventListener('click', () => {
        showNotification('Search functionality - Opening search...', 'info');
        // In a real app, this would open search overlay or navigate to search page
    });
    
    // Wishlist button
    document.getElementById('headerWishlistBtn').addEventListener('click', () => {
        toggleWishlist();
    });
    
    // Cart button
    document.getElementById('headerCartBtn').addEventListener('click', () => {
        showCartSummary();
    });
}

function setupGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('mainProductImage');
    
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            thumbnail.classList.add('active');
            
            // Update main image
            const imageKeys = ['main', 'side', 'back', 'detail'];
            if (thumbnail.dataset.image === 'video') {
                // Show 360° view or video
                show360View();
            } else {
                const imageKey = imageKeys[index];
                if (currentProduct.images[imageKey]) {
                    mainImage.src = currentProduct.images[imageKey];
                    mainImage.style.transform = 'scale(1)'; // Reset zoom
                }
            }
        });
    });
}

function setupColorSelection() {
    const colorSwatches = document.querySelectorAll('.color-swatch');
    
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            // Remove active class from all swatches
            colorSwatches.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked swatch
            swatch.classList.add('active');
            
            // Update selected color
            currentProduct.selectedColor = swatch.dataset.color;
            
            // Show notification
            const colorName = swatch.querySelector('.color-name').textContent;
            showNotification(`Selected color: ${colorName}`, 'success');
            
            // In a real app, this would update the product images for the selected color
        });
    });
}

function setupSizeSelection() {
    const sizeButtons = document.querySelectorAll('.size-btn');
    
    sizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            sizeButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Update selected size
            currentProduct.selectedSize = button.dataset.size;
            
            // Update stock info
            const stockInfo = document.querySelector('.stock-info span');
            const stockCount = Math.floor(Math.random() * 5) + 1; // Random stock for demo
            stockInfo.textContent = `Only ${stockCount} left in Size ${currentProduct.selectedSize}`;
            
            showNotification(`Selected size: ${currentProduct.selectedSize}`, 'success');
        });
    });
}

function setupSizeGuide() {
    const sizeGuideBtn = document.getElementById('sizeGuideBtn');
    const sizeGuideModal = document.getElementById('sizeGuideModal');
    const closeButtons = sizeGuideModal.querySelectorAll('.close-modal');
    
    sizeGuideBtn.addEventListener('click', () => {
        sizeGuideModal.classList.remove('hidden');
    });
    
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeGuideModal.classList.add('hidden');
        });
    });
    
    // Close on outside click
    sizeGuideModal.addEventListener('click', (e) => {
        if (e.target === sizeGuideModal) {
            sizeGuideModal.classList.add('hidden');
        }
    });
}

function setupDeliveryChecker() {
    const checkBtn = document.getElementById('checkDeliveryBtn');
    const pincodeInput = document.getElementById('pincodeInput');
    const deliveryInfo = document.getElementById('deliveryInfo');
    
    checkBtn.addEventListener('click', () => {
        const pincode = pincodeInput.value.trim();
        
        if (pincode.length >= 5) {
            // Simulate API call
            showNotification('Checking delivery options...', 'info');
            
            setTimeout(() => {
                deliveryInfo.style.display = 'block';
                showNotification('Delivery available in your area!', 'success');
                
                // Update delivery date
                const deliveryDate = new Date();
                deliveryDate.setDate(deliveryDate.getDate() + 3);
                const dateStr = deliveryDate.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                });
                deliveryInfo.querySelector('.delivery-item span').textContent = `Expected delivery by ${dateStr}`;
            }, 1000);
        } else {
            showNotification('Please enter a valid pincode', 'error');
        }
    });
    
    // Enter key support
    pincodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkBtn.click();
        }
    });
}

function setupPurchaseButtons() {
    // Add to cart buttons
    const addToCartButtons = [
        document.getElementById('addToCartBottom'),
        // Add other add to cart buttons if they exist
    ];
    
    addToCartButtons.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                addToCart(currentProduct);
                showNotification(`${currentProduct.title} added to cart!`, 'success');
                updateCartBadge();
                
                // Animation
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    btn.style.transform = 'scale(1)';
                }, 150);
            });
        }
    });
    
    // Buy now button
    const buyNowBtn = document.getElementById('buyNowBottom');
    buyNowBtn.addEventListener('click', () => {
        addToCart(currentProduct);
        showNotification('Proceeding to checkout...', 'success');
        // In a real app, this would navigate to checkout
        setTimeout(() => {
            showNotification('Checkout functionality coming soon!', 'info');
        }, 1000);
    });
    
    // Wishlist buttons
    const wishlistButtons = [
        document.getElementById('wishlistBottomBtn'),
        document.getElementById('headerWishlistBtn')
    ];
    
    wishlistButtons.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                toggleWishlist();
            });
        }
    });
}

function setupReviewFunctionality() {
    // Write review button
    const writeReviewBtn = document.getElementById('writeReviewBtn');
    const writeReviewModal = document.getElementById('writeReviewModal');
    const closeButtons = writeReviewModal.querySelectorAll('.close-modal');
    
    writeReviewBtn.addEventListener('click', () => {
        writeReviewModal.classList.remove('hidden');
    });
    
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            writeReviewModal.classList.add('hidden');
        });
    });
    
    // Close on outside click
    writeReviewModal.addEventListener('click', (e) => {
        if (e.target === writeReviewModal) {
            writeReviewModal.classList.add('hidden');
        }
    });
    
    // Star rating input
    setupStarRating();
    
    // Review form submission
    const reviewForm = document.querySelector('.review-form');
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submitReview();
    });
    
    // Review filters
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterType = btn.textContent;
            showNotification(`Filtering reviews: ${filterType}`, 'info');
            // In a real app, this would filter the reviews
        });
    });
    
    // Helpful buttons
    const helpfulButtons = document.querySelectorAll('.helpful-btn');
    helpfulButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentCount = parseInt(btn.textContent.match(/\d+/)[0]);
            btn.innerHTML = `👍 Helpful (${currentCount + 1})`;
            showNotification('Thank you for your feedback!', 'success');
        });
    });
    
    // Show more reviews
    const showMoreBtn = document.querySelector('.show-more-reviews');
    showMoreBtn.addEventListener('click', () => {
        showNotification('Loading more reviews...', 'info');
        // In a real app, this would load more reviews
    });
}

function setupStarRating() {
    const starInputs = document.querySelectorAll('.star-input');
    let selectedRating = 0;
    
    starInputs.forEach((star, index) => {
        star.addEventListener('click', () => {
            selectedRating = index + 1;
            updateStarDisplay(selectedRating);
        });
        
        star.addEventListener('mouseover', () => {
            updateStarDisplay(index + 1);
        });
    });
    
    const starContainer = document.querySelector('.star-rating-input');
    starContainer.addEventListener('mouseleave', () => {
        updateStarDisplay(selectedRating);
    });
    
    function updateStarDisplay(rating) {
        starInputs.forEach((star, index) => {
            if (index < rating) {
                star.textContent = '★';
                star.classList.add('active');
            } else {
                star.textContent = '☆';
                star.classList.remove('active');
            }
        });
    }
}

function submitReview() {
    const rating = document.querySelectorAll('.star-input.active').length;
    const title = document.getElementById('reviewTitle').value;
    const content = document.getElementById('reviewContent').value;
    
    if (rating === 0) {
        showNotification('Please select a rating', 'error');
        return;
    }
    
    if (!content.trim()) {
        showNotification('Please write a review', 'error');
        return;
    }
    
    // Simulate review submission
    showNotification('Submitting your review...', 'info');
    
    setTimeout(() => {
        showNotification('Thank you for your review!', 'success');
        document.getElementById('writeReviewModal').classList.add('hidden');
        
        // Reset form
        document.querySelector('.review-form').reset();
        document.querySelectorAll('.star-input').forEach(star => {
            star.textContent = '☆';
            star.classList.remove('active');
        });
    }, 1500);
}

function setupRecommendations() {
    // Add all to cart button
    const addAllBtn = document.querySelector('.add-all-btn');
    addAllBtn.addEventListener('click', () => {
        showNotification('Adding all items to cart...', 'info');
        setTimeout(() => {
            showNotification('All items added to cart!', 'success');
            updateCartBadge();
        }, 1000);
    });
    
    // Similar products
    const similarProducts = document.querySelectorAll('.similar-product');
    similarProducts.forEach(product => {
        product.addEventListener('click', () => {
            const productTitle = product.querySelector('.similar-title').textContent;
            showNotification(`Loading ${productTitle}...`, 'info');
            // In a real app, this would navigate to the product detail page
        });
    });
}

function setupCouponFunctionality() {
    const applyCouponBtn = document.querySelector('.apply-coupon');
    applyCouponBtn.addEventListener('click', () => {
        // Simulate coupon application
        showNotification('Applying coupon FESTIVE10...', 'info');
        
        setTimeout(() => {
            showNotification('Coupon applied! Extra 10% discount added.', 'success');
            
            // Update price display (simulate discount)
            const currentPriceEl = document.getElementById('currentPrice');
            const newPrice = Math.round(currentProduct.currentPrice * 0.9);
            currentPriceEl.textContent = `$${newPrice}`;
            
            // Update bottom price
            document.getElementById('bottomPrice').textContent = `$${newPrice}`;
            
            // Update button text
            applyCouponBtn.textContent = 'Applied ✓';
            applyCouponBtn.style.background = '#4CAF50';
            applyCouponBtn.disabled = true;
        }, 1500);
    });
}

function setupImageZoom() {
    const zoomBtn = document.getElementById('zoomBtn');
    const mainImage = document.getElementById('mainProductImage');
    let isZoomed = false;
    
    zoomBtn.addEventListener('click', () => {
        if (!isZoomed) {
            mainImage.style.transform = 'scale(2)';
            mainImage.style.cursor = 'move';
            zoomBtn.innerHTML = '<i class="fas fa-search-minus"></i>';
            isZoomed = true;
            
            // Enable panning
            let isDragging = false;
            let startX, startY, translateX = 0, translateY = 0;
            
            mainImage.addEventListener('mousedown', startDrag);
            mainImage.addEventListener('mousemove', drag);
            mainImage.addEventListener('mouseup', endDrag);
            mainImage.addEventListener('mouseleave', endDrag);
            
            function startDrag(e) {
                isDragging = true;
                startX = e.clientX - translateX;
                startY = e.clientY - translateY;
            }
            
            function drag(e) {
                if (!isDragging) return;
                translateX = e.clientX - startX;
                translateY = e.clientY - startY;
                
                // Limit translation
                translateX = Math.max(-200, Math.min(200, translateX));
                translateY = Math.max(-200, Math.min(200, translateY));
                
                mainImage.style.transform = `scale(2) translate(${translateX/2}px, ${translateY/2}px)`;
            }
            
            function endDrag() {
                isDragging = false;
            }
        } else {
            mainImage.style.transform = 'scale(1)';
            mainImage.style.cursor = 'default';
            zoomBtn.innerHTML = '<i class="fas fa-search-plus"></i>';
            isZoomed = false;
        }
    });
}

function setupVideoTryOn() {
    const videoTryOnBtn = document.getElementById('videoTryOnBtn');
    
    videoTryOnBtn.addEventListener('click', () => {
        showNotification('AR Try-On feature coming soon!', 'info');
        // In a real app, this would open AR camera or video try-on feature
    });
}

function show360View() {
    showNotification('360° view feature coming soon!', 'info');
    // In a real app, this would show an interactive 360° product view
}

// Utility functions
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('fashionCart') || '[]');
    
    const existingItem = cart.find(item => 
        item.title === product.title && 
        item.selectedSize === product.selectedSize && 
        item.selectedColor === product.selectedColor
    );
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: `$${product.currentPrice}`,
            image: product.images.main,
            selectedSize: product.selectedSize,
            selectedColor: product.selectedColor,
            quantity: 1
        });
    }
    
    localStorage.setItem('fashionCart', JSON.stringify(cart));
}

function toggleWishlist() {
    let wishlist = JSON.parse(localStorage.getItem('fashionWishlist') || '[]');
    const isInWishlist = wishlist.some(item => item.id === currentProduct.id);
    
    if (isInWishlist) {
        wishlist = wishlist.filter(item => item.id !== currentProduct.id);
        showNotification(`${currentProduct.title} removed from wishlist`, 'info');
        
        // Update heart icons
        document.querySelectorAll('[id*="wishlist"] i').forEach(icon => {
            icon.className = 'far fa-heart';
        });
    } else {
        wishlist.push({
            id: currentProduct.id,
            title: currentProduct.title,
            price: `$${currentProduct.currentPrice}`,
            image: currentProduct.images.main
        });
        showNotification(`${currentProduct.title} added to wishlist!`, 'success');
        
        // Update heart icons
        document.querySelectorAll('[id*="wishlist"] i').forEach(icon => {
            icon.className = 'fas fa-heart';
        });
    }
    
    localStorage.setItem('fashionWishlist', JSON.stringify(wishlist));
}

function getCartItemCount() {
    const cart = JSON.parse(localStorage.getItem('fashionCart') || '[]');
    return cart.reduce((total, item) => total + item.quantity, 0);
}

function updateCartBadge() {
    const cartBadge = document.getElementById('cartBadge');
    const count = getCartItemCount();
    cartBadge.textContent = count;
    
    // Animation
    cartBadge.style.transform = 'scale(1.3)';
    setTimeout(() => {
        cartBadge.style.transform = 'scale(1)';
    }, 200);
}

function showCartSummary() {
    const cart = JSON.parse(localStorage.getItem('fashionCart') || '[]');
    
    if (cart.length === 0) {
        showNotification('Your cart is empty. Add some items!', 'info');
        return;
    }
    
    const total = cart.reduce((sum, item) => {
        const price = parseFloat(item.price.replace('$', ''));
        return sum + (price * item.quantity);
    }, 0);
    
    const cartItems = cart.map(item => 
        `${item.title} (${item.quantity}x) - ${item.price}`
    ).join('\n');
    
    showNotification(`Cart Items:\n${cartItems}\n\nTotal: $${total.toFixed(2)}`, 'success');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10001;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
        white-space: pre-line;
        background: ${type === 'success' ? '#4CAF50' : 
                    type === 'error' ? '#f44336' : '#2196F3'};
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Initialize wishlist state on page load
function initializeWishlistState() {
    const wishlist = JSON.parse(localStorage.getItem('fashionWishlist') || '[]');
    const isInWishlist = wishlist.some(item => item.id === currentProduct.id);
    
    if (isInWishlist) {
        document.querySelectorAll('[id*="wishlist"] i').forEach(icon => {
            icon.className = 'fas fa-heart';
        });
    }
}

// Call on page load
setTimeout(initializeWishlistState, 100);
