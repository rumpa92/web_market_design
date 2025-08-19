// Fashion Product Detail Page JavaScript

// Initialize product detail page
document.addEventListener('DOMContentLoaded', function() {
    initializeProductDetail();
    loadProductData();
    setupProductEventListeners();
});

// Product data for fashion item
let currentProduct = {
    id: 1,
    title: 'Churidar',
    brand: 'Fashion Hub',
    currentPrice: 299,
    originalPrice: 399,
    discount: 25,
    rating: 4.8,
    reviewCount: 384,
    images: {
        main: 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F9915d20cfed848ec961a57e0b81de98d?format=webp&width=800',
        side: 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F5de41452e8644ee380a72e38d6a74b25?format=webp&width=800',
        back: 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F081e58fb86c541a9af4297f57d3809c0?format=webp&width=800',
        detail: 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F9915d20cfed848ec961a57e0b81de98d?format=webp&width=800',
        fabric: 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F5de41452e8644ee380a72e38d6a74b25?format=webp&width=800'
    },
    colors: ['black', 'blue', 'red', 'green'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    selectedColor: 'black',
    selectedSize: 'M',
    quantity: 1,
    inStock: true,
    stockCount: 15
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
    document.getElementById('productNavTitle').textContent = currentProduct.title;
    document.getElementById('currentPrice').textContent = `$${currentProduct.currentPrice}`;
    
    // Update cart badge
    const cartBadge = document.getElementById('cartBadge');
    const cartCount = getCartItemCount();
    cartBadge.textContent = cartCount;
    
    // Load main image
    const mainImage = document.getElementById('mainProductImage');
    mainImage.src = currentProduct.images.main;
    mainImage.alt = currentProduct.title;
    
    // Load thumbnail images
    const thumbnails = document.querySelectorAll('.thumbnail-item img');
    const imageKeys = ['main', 'side', 'back', 'detail', 'fabric'];
    thumbnails.forEach((thumb, index) => {
        if (currentProduct.images[imageKeys[index]]) {
            thumb.src = currentProduct.images[imageKeys[index]];
        }
    });
    
    // Update quantity display
    document.getElementById('quantityDisplay').textContent = currentProduct.quantity;
}

function setupProductEventListeners() {
    // Product back button (above image)
    const productBackBtn = document.getElementById('productBackBtn');
    productBackBtn.addEventListener('click', () => {
        // Navigate to home page
        window.location.href = 'index.html';
    });
    
    // Header icons
    setupHeaderIcons();
    
    // Gallery functionality
    setupGallery();
    
    // Color selection
    setupColorSelection();
    
    // Size selection
    setupSizeSelection();
    
    // Quantity controls
    setupQuantityControls();
    
    // Add to cart
    setupAddToCart();
    
    // Tab navigation
    setupTabNavigation();
    
    // Wishlist functionality
    setupWishlist();
}

function setupHeaderIcons() {
    // Search button
    document.getElementById('searchBtn').addEventListener('click', () => {
        showNotification('Search functionality - Opening search...', 'info');
    });
    
    // Header cart button
    document.getElementById('headerCartBtn').addEventListener('click', () => {
        showCartSummary();
    });
}

function setupGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail-item');
    const mainImage = document.getElementById('mainProductImage');
    
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            thumbnail.classList.add('active');
            
            // Update main image
            const imageKeys = ['main', 'side', 'back', 'detail', 'fabric'];
            const imageKey = imageKeys[index];
            if (currentProduct.images[imageKey]) {
                mainImage.src = currentProduct.images[imageKey];
            }
        });
    });
}

function setupColorSelection() {
    const colorDots = document.querySelectorAll('.color-dot');
    
    colorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            // Remove active class from all dots
            colorDots.forEach(d => d.classList.remove('active'));
            
            // Add active class to clicked dot
            dot.classList.add('active');
            
            // Update selected color
            currentProduct.selectedColor = dot.dataset.color;
            
            showNotification(`Selected color: ${currentProduct.selectedColor}`, 'success');
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
            
            showNotification(`Selected size: ${currentProduct.selectedSize}`, 'success');
        });
    });
}

function setupQuantityControls() {
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');
    const quantityDisplay = document.getElementById('quantityDisplay');
    
    decreaseBtn.addEventListener('click', () => {
        if (currentProduct.quantity > 1) {
            currentProduct.quantity--;
            quantityDisplay.textContent = currentProduct.quantity;
        }
    });
    
    increaseBtn.addEventListener('click', () => {
        if (currentProduct.quantity < 10) { // Max quantity limit
            currentProduct.quantity++;
            quantityDisplay.textContent = currentProduct.quantity;
        }
    });
}

function setupAddToCart() {
    const addToCartBtn = document.getElementById('addToCartBtn');
    
    addToCartBtn.addEventListener('click', () => {
        // Animation effect
        addToCartBtn.style.transform = 'scale(0.95)';
        addToCartBtn.textContent = 'Adding...';
        
        setTimeout(() => {
            addToCart(currentProduct);
            updateCartBadge();
            showNotification(`${currentProduct.title} added to cart!`, 'success');
            
            // Reset button
            addToCartBtn.style.transform = 'scale(1)';
            addToCartBtn.textContent = 'Add to Cart';
        }, 500);
    });
}

function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked button and corresponding panel
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

function setupWishlist() {
    const wishlistBtn = document.getElementById('wishlistOverlay');
    const headerWishlistBtn = document.getElementById('headerWishlistBtn');
    
    [wishlistBtn, headerWishlistBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                toggleWishlist();
            });
        }
    });
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
        existingItem.quantity += product.quantity;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: `$${product.currentPrice}`,
            image: product.images.main,
            selectedSize: product.selectedSize,
            selectedColor: product.selectedColor,
            quantity: product.quantity
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
    ).join('\\n');
    
    showNotification(`Cart Items:\\n${cartItems}\\n\\nTotal: $${total.toFixed(2)}`, 'success');
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

// Initialize on load
setTimeout(initializeWishlistState, 100);

// Handle product card clicks in related products
document.addEventListener('click', function(e) {
    const productCard = e.target.closest('.product-card');
    if (productCard) {
        const productTitle = productCard.querySelector('h3').textContent;
        showNotification(`Loading ${productTitle}...`, 'info');
        // In a real app, this would navigate to the product detail page
    }
});
