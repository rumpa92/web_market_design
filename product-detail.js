// Fashion Product Detail Page JavaScript

// Initialize product detail page
document.addEventListener('DOMContentLoaded', function() {
    initializeProductDetail();
    loadProductData();
    setupProductEventListeners();
    setupRelatedProductsInteraction();
    setupProfileDropdown();
    initializeCartModal();
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
            // Add click animation
            dot.style.transform = 'scale(0.9)';
            setTimeout(() => {
                dot.style.transform = '';
            }, 150);

            // Remove active class from all dots
            colorDots.forEach(d => d.classList.remove('active'));

            // Add active class to clicked dot
            dot.classList.add('active');

            // Update selected color
            currentProduct.selectedColor = dot.dataset.color;

            showNotification(`Selected color: ${currentProduct.selectedColor}`, 'success');
        });

        // Add keyboard support
        dot.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                dot.click();
            }
        });
    });
}

function setupSizeSelection() {
    const sizeButtons = document.querySelectorAll('.size-btn');

    sizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Add click animation
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);

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
    openCartModal();
}

function openCartModal() {
    const cartModal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartSummary = document.getElementById('cartSummary');

    cartModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Load cart data
    const cart = JSON.parse(localStorage.getItem('fashionCart') || '[]');

    if (cart.length === 0) {
        cartItems.style.display = 'none';
        cartEmpty.classList.remove('hidden');
        cartSummary.style.display = 'none';
    } else {
        cartItems.style.display = 'block';
        cartEmpty.classList.add('hidden');
        cartSummary.style.display = 'block';

        // Display cart items
        displayCartItems(cart);
        updateCartSummary(cart);
    }

    // Setup cart modal event listeners
    setupCartModalListeners();
}

function closeCartModal() {
    const cartModal = document.getElementById('cartModal');
    cartModal.classList.add('hidden');
    document.body.style.overflow = '';
}

function displayCartItems(cart) {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="cart-item-details">
                <h3 class="item-title">${item.title}</h3>
                <div class="item-options">
                    <span class="item-size">Size: ${item.selectedSize}</span>
                    <span class="item-color">Color: ${item.selectedColor}</span>
                </div>
                <div class="item-controls">
                    <div class="quantity-controls">
                        <button class="qty-btn decrease" onclick="updateCartItemQuantity(${index}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="qty-btn increase" onclick="updateCartItemQuantity(${index}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button class="remove-item" onclick="removeCartItem(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="cart-item-price">
                <span class="item-price">${item.price}</span>
                <span class="item-original-price">${item.price} each</span>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
}

function updateCartSummary(cart) {
    const subtotal = cart.reduce((sum, item) => {
        const price = parseFloat(item.price.replace('$', ''));
        return sum + (price * item.quantity);
    }, 0);

    const shipping = cart.length > 0 ? 9.99 : 0;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    document.getElementById('itemCount').textContent = `(${totalItems} items)`;
    document.getElementById('subtotalValue').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('taxValue').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('totalValue').textContent = `$${total.toFixed(2)}`;

    // Update shipping
    const shippingElement = document.querySelector('.shipping-value');
    shippingElement.textContent = cart.length > 0 ? '$9.99' : '$0.00';
}

function setupCartModalListeners() {
    const closeCart = document.getElementById('closeCart');
    const continueShopping = document.getElementById('continueShopping');
    const proceedCheckout = document.getElementById('proceedCheckout');
    const cartModal = document.getElementById('cartModal');

    // Remove existing listeners to avoid duplicates
    const newCloseCart = closeCart.cloneNode(true);
    const newContinueShopping = continueShopping.cloneNode(true);
    const newProceedCheckout = proceedCheckout.cloneNode(true);

    closeCart.parentNode.replaceChild(newCloseCart, closeCart);
    continueShopping.parentNode.replaceChild(newContinueShopping, continueShopping);
    proceedCheckout.parentNode.replaceChild(newProceedCheckout, proceedCheckout);

    // Close modal events
    newCloseCart.addEventListener('click', closeCartModal);
    newContinueShopping.addEventListener('click', closeCartModal);

    // Close on overlay click
    cartModal.onclick = (e) => {
        if (e.target.classList.contains('cart-modal-overlay')) {
            closeCartModal();
        }
    };

    // Proceed to checkout
    newProceedCheckout.addEventListener('click', () => {
        const cart = JSON.parse(localStorage.getItem('fashionCart') || '[]');
        if (cart.length === 0) {
            showNotification('Your cart is empty!', 'info');
            return;
        }

        showNotification('Redirecting to checkout...', 'info');
        setTimeout(() => {
            window.location.href = 'checkout.html';
        }, 1000);
    });
}

function updateCartItemQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('fashionCart') || '[]');

    if (cart[index]) {
        cart[index].quantity += change;

        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }

        localStorage.setItem('fashionCart', JSON.stringify(cart));

        // Refresh cart display
        if (cart.length === 0) {
            closeCartModal();
            openCartModal();
        } else {
            displayCartItems(cart);
            updateCartSummary(cart);
        }

        updateCartBadge();
    }
}

function removeCartItem(index) {
    let cart = JSON.parse(localStorage.getItem('fashionCart') || '[]');

    if (cart[index]) {
        const itemName = cart[index].title;
        cart.splice(index, 1);
        localStorage.setItem('fashionCart', JSON.stringify(cart));

        // Refresh cart display
        if (cart.length === 0) {
            closeCartModal();
            openCartModal();
        } else {
            displayCartItems(cart);
            updateCartSummary(cart);
        }

        updateCartBadge();
        showNotification(`${itemName} removed from cart`, 'info');
    }
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

// Initialize Cart Modal
function initializeCartModal() {
    // Add event listeners for cart modal
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !cartModal.classList.contains('hidden')) {
                closeCartModal();
            }
        });

        // Prevent modal content click from closing modal
        const cartModalContent = cartModal.querySelector('.cart-modal-content');
        if (cartModalContent) {
            cartModalContent.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }
}

// Setup Related Products Interaction
function setupRelatedProductsInteraction() {
    // Handle Quick View buttons
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productCard = e.target.closest('.product-card');
            const productTitle = productCard.querySelector('h3').textContent;
            showQuickViewModal(productCard);
        });
    });

    // Handle Wishlist buttons in related products
    const wishlistBtns = document.querySelectorAll('.wishlist-btn-overlay');
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productCard = e.target.closest('.product-card');
            const productTitle = productCard.querySelector('h3').textContent;
            const heartIcon = btn.querySelector('i');

            // Toggle wishlist state
            if (heartIcon.classList.contains('far')) {
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas');
                btn.style.background = '#ff6b6b';
                btn.style.color = 'white';
                showNotification(`${productTitle} added to wishlist!`, 'success');
            } else {
                heartIcon.classList.remove('fas');
                heartIcon.classList.add('far');
                btn.style.background = 'rgba(255,255,255,0.9)';
                btn.style.color = '#666';
                showNotification(`${productTitle} removed from wishlist`, 'info');
            }
        });
    });

    // Handle product card clicks (for navigation)
    const productCards = document.querySelectorAll('.related-products .product-card');
    productCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't navigate if clicking on buttons
            if (e.target.closest('.quick-view-btn') || e.target.closest('.wishlist-btn-overlay')) {
                return;
            }

            const productTitle = card.querySelector('h3').textContent;
            showNotification(`Loading ${productTitle}...`, 'info');

            // Add loading animation
            card.style.opacity = '0.7';
            setTimeout(() => {
                card.style.opacity = '1';
                // In a real app, this would navigate to the product detail page
                console.log(`Navigate to ${productTitle} detail page`);
            }, 1000);
        });
    });
}

function showQuickViewModal(productCard) {
    const productTitle = productCard.querySelector('h3').textContent;
    const productImage = productCard.querySelector('img').src;
    const currentPrice = productCard.querySelector('.current-price').textContent;
    const originalPrice = productCard.querySelector('.original-price')?.textContent || '';
    const rating = productCard.querySelector('.stars').textContent;

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
        <div class="quick-view-content">
            <button class="close-quick-view">
                <i class="fas fa-times"></i>
            </button>
            <div class="quick-view-body">
                <div class="quick-view-image">
                    <img src="${productImage}" alt="${productTitle}">
                </div>
                <div class="quick-view-info">
                    <h2>${productTitle}</h2>
                    <div class="quick-view-rating">
                        <span class="stars">${rating}</span>
                    </div>
                    <div class="quick-view-pricing">
                        <span class="current-price">${currentPrice}</span>
                        ${originalPrice ? `<span class="original-price">${originalPrice}</span>` : ''}
                    </div>
                    <div class="quick-view-description">
                        <p>Experience premium quality and elegant design with this stunning piece. Perfect for special occasions and everyday elegance.</p>
                    </div>
                    <div class="quick-view-actions">
                        <button class="quick-add-to-cart">Add to Cart</button>
                        <button class="quick-view-details">View Details</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Style the modal
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    document.body.appendChild(modal);

    // Animate in
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);

    // Add event listeners
    const closeBtn = modal.querySelector('.close-quick-view');
    const quickAddBtn = modal.querySelector('.quick-add-to-cart');
    const viewDetailsBtn = modal.querySelector('.quick-view-details');

    closeBtn.addEventListener('click', () => {
        closeQuickViewModal(modal);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeQuickViewModal(modal);
        }
    });

    quickAddBtn.addEventListener('click', () => {
        showNotification(`${productTitle} added to cart!`, 'success');
        closeQuickViewModal(modal);
    });

    viewDetailsBtn.addEventListener('click', () => {
        showNotification(`Loading ${productTitle} details...`, 'info');
        closeQuickViewModal(modal);
    });

    showNotification(`Quick view: ${productTitle}`, 'info');
}

function closeQuickViewModal(modal) {
    modal.style.opacity = '0';
    setTimeout(() => {
        if (document.body.contains(modal)) {
            document.body.removeChild(modal);
        }
    }, 300);
}

// Handle product card clicks in related products (updated version)
document.addEventListener('click', function(e) {
    const productCard = e.target.closest('.product-card');
    if (productCard && productCard.closest('.related-products')) {
        // This is handled by setupRelatedProductsInteraction now
        return;
    }
});

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

    if (!profileTrigger || !profileDropdown) return;

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
    if (profileArrow) {
        profileArrow.style.transform = 'rotate(180deg)';
    }

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
    if (profileArrow) {
        profileArrow.style.transform = 'rotate(0deg)';
    }

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

    if (!statusIndicator || !statusText || !onlineStatus) return;

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
            // Navigate to profile page
            window.location.href = 'profile.html';
            break;

        case 'myOrders':
            showNotification('Opening My Orders...', 'info');
            break;

        case 'myWishlist':
            showNotification('Opening My Wishlist...', 'info');
            showWishlistSummary();
            break;

        case 'accountSettings':
            showNotification('Opening Account Settings...', 'info');
            break;

        case 'helpSupport':
            showNotification('Opening Help & Support...', 'info');
            break;

        case 'signInOut':
            const signInOutText = document.getElementById('signInOutText');
            if (signInOutText && signInOutText.textContent === 'Sign Out') {
                handleSignOut();
            } else {
                showNotification('Please sign in to access your account', 'info');
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

function handleSignOut() {
    showNotification('Signing out...', 'info');

    setTimeout(() => {
        // Reset user data
        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');
        const signInOutText = document.getElementById('signInOutText');

        if (userName) userName.textContent = 'Guest User';
        if (userEmail) userEmail.textContent = 'guest@stylehub.com';
        if (signInOutText) signInOutText.textContent = 'Sign In';
        updateUserStatus('offline');

        showNotification('Successfully signed out!', 'success');
        closeProfileDropdown();
    }, 1000);
}
