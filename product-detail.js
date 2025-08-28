// Fashion Product Detail Page JavaScript

// Initialize product detail page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Product detail page DOMContentLoaded');

    try {
        initializeProductDetail();
        loadProductData();
        setupProductEventListeners();
        setupRelatedProductsInteraction();
        setupProfileDropdown();
        initializeCartModal();

        console.log('Product detail page initialized successfully');
    } catch (error) {
        console.error('Error initializing product detail page:', error);
    }
});

// Default product data (fallback)
let defaultProduct = {
    id: 1,
    title: 'Churidar',
    brand: 'Fashion Hub',
    currentPrice: 299,
    originalPrice: 399,
    discount: 25,
    rating: 4.8,
    reviewCount: 384,
    image: 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F9915d20cfed848ec961a57e0b81de98d?format=webp&width=800',
    colors: ['black', 'blue', 'red', 'green'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
};

// Current product data (will be populated from navigation)
let currentProduct = {
    selectedColor: 'black',
    selectedSize: 'M',
    quantity: 1,
    inStock: true,
    stockCount: 15
};

function initializeProductDetail() {
    console.log('=== INITIALIZING PRODUCT DETAIL ===');
    console.log('defaultProduct:', defaultProduct);

    // Check if product data is passed from main page via sessionStorage
    const selectedProduct = sessionStorage.getItem('selectedProduct');
    console.log('selectedProduct from sessionStorage:', selectedProduct);

    if (selectedProduct) {
        try {
            const productData = JSON.parse(selectedProduct);
            console.log('Parsed productData:', productData);

            // Merge with default structure
            currentProduct = {
                ...defaultProduct,
                ...productData,
                selectedColor: 'black',
                selectedSize: 'M',
                quantity: 1,
                inStock: true,
                stockCount: 15,
                images: generateProductImages(productData.image || defaultProduct.image)
            };
            console.log('Loaded product from navigation:', currentProduct.title);
            console.log('Final currentProduct after merge:', currentProduct);
        } catch (e) {
            console.log('Error parsing product data, using default:', e);
            currentProduct = { ...defaultProduct, selectedColor: 'black', selectedSize: 'M', quantity: 1, inStock: true, stockCount: 15, images: generateProductImages(defaultProduct.image) };
            console.log('Set currentProduct to default after error:', currentProduct);
        }
    } else {
        // Fallback to default product
        currentProduct = { ...defaultProduct, selectedColor: 'black', selectedSize: 'M', quantity: 1, inStock: true, stockCount: 15, images: generateProductImages(defaultProduct.image) };
        console.log('No product data found, using default product:', currentProduct);
    }

    // Final safety check - ensure all essential properties exist
    if (!currentProduct.title) {
        currentProduct.title = 'Designer Anarkali Gown';
    }
    if (!currentProduct.currentPrice) {
        currentProduct.currentPrice = 198;
    }
    if (!currentProduct.id) {
        currentProduct.id = Date.now();
    }
    if (!currentProduct.images) {
        currentProduct.images = generateProductImages(defaultProduct.image);
    }

    console.log('Final currentProduct after safety checks:', currentProduct);
}

function generateProductImages(mainImage) {
    // Generate multiple views for the product gallery
    // In a real app, these would be different actual images
    return {
        main: mainImage,
        side: mainImage,
        back: mainImage,
        detail: mainImage,
        fabric: mainImage
    };
}

function loadProductData() {
    // Debug current product data
    console.log('=== LOADING PRODUCT DATA ===');
    console.log('currentProduct:', currentProduct);
    console.log('currentProduct.title:', currentProduct.title);
    console.log('currentProduct complete object:', JSON.stringify(currentProduct, null, 2));

    // Safety check - ensure currentProduct has all required properties
    if (!currentProduct.title) {
        console.warn('currentProduct.title is missing, fixing...');
        currentProduct.title = defaultProduct.title || 'Designer Anarkali Gown';
    }
    if (!currentProduct.currentPrice) {
        console.warn('currentProduct.currentPrice is missing, fixing...');
        currentProduct.currentPrice = defaultProduct.currentPrice || 198;
    }

    // Update page title
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        pageTitle.textContent = `${currentProduct.title} - StyleHub`;
    }

    // Update product information
    const productTitleEl = document.getElementById('productTitle');
    const currentPriceEl = document.getElementById('currentPrice');
    
    if (productTitleEl) {
        productTitleEl.textContent = currentProduct.title;
    }
    if (currentPriceEl) {
        currentPriceEl.textContent = `$${currentProduct.currentPrice}`;
    }

    // Update rating and review count
    const ratingText = document.querySelector('.rating-text');
    if (ratingText) {
        ratingText.textContent = `${currentProduct.rating} (${currentProduct.reviewCount} Reviews)`;
    }

    // Update cart badge - should be 0 after clearing cart
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
        const cartCount = getCartItemCount();
        cartBadge.textContent = cartCount;
        console.log('Cart badge initialized with count:', cartCount);
    }

    // Load main image
    const mainImage = document.getElementById('mainProductImage');
    if (mainImage) {
        mainImage.src = currentProduct.images.main;
        mainImage.alt = currentProduct.title;
    }

    // Load thumbnail images
    const thumbnails = document.querySelectorAll('.thumbnail-item img');
    const imageKeys = ['main', 'side', 'back', 'detail', 'fabric'];
    thumbnails.forEach((thumb, index) => {
        if (currentProduct.images[imageKeys[index]]) {
            thumb.src = currentProduct.images[imageKeys[index]];
        }
    });

    // Update quantity display
    const quantityDisplay = document.getElementById('quantityDisplay');
    if (quantityDisplay) {
        quantityDisplay.textContent = currentProduct.quantity;
    }

    console.log('Product data loaded:', currentProduct.title, `$${currentProduct.currentPrice}`);
}

function setupProductEventListeners() {
    console.log('Setting up product event listeners...');

    try {
        // Product back button (above image)
        const productBackBtn = document.getElementById('productBackBtn');
        if (productBackBtn) {
            productBackBtn.addEventListener('click', () => {
                // Navigate to home page
                window.location.href = 'index.html';
            });
            console.log('Product back button listener added');
        }

        // Header icons
        setupHeaderIcons();

        // Gallery functionality
        setupGallery();

        // Color selection
        console.log('Setting up color selection...');
        setupColorSelection();

        // Size selection
        console.log('Setting up size selection...');
        setupSizeSelection();

        // Quantity controls
        console.log('Setting up quantity controls...');
        setupQuantityControls();

        // Add to cart
        console.log('Setting up add to cart...');
        setupAddToCart();

        // Write review
        setupWriteReview();

        // Tab navigation
        setupTabNavigation();

        // Wishlist functionality
        setupWishlist();

        console.log('All product event listeners set up successfully');

    } catch (error) {
        console.error('Error setting up product event listeners:', error);
    }
}

function setupHeaderIcons() {
    // Search button
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            showNotification('Search functionality - Opening search...', 'info');
        });
    }
    
    // Header cart button
    const headerCartBtn = document.getElementById('headerCartBtn');
    if (headerCartBtn) {
        headerCartBtn.addEventListener('click', () => {
            showCartSummary();
        });
    }
}

function setupGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail-item');
    const mainImage = document.getElementById('mainProductImage');
    
    if (!mainImage) {
        console.warn('Main product image not found');
        return;
    }
    
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            thumbnail.classList.add('active');
            
            // Update main image
            const imageKeys = ['main', 'side', 'back', 'detail', 'fabric'];
            const imageKey = imageKeys[index];
            if (currentProduct.images && currentProduct.images[imageKey]) {
                mainImage.src = currentProduct.images[imageKey];
            }
        });
    });
}

function setupColorSelection() {
    const colorDots = document.querySelectorAll('.color-dot');
    console.log('Color dots found:', colorDots.length);

    if (colorDots.length === 0) {
        console.warn('No color dots found! Check selector: .color-dot');
        return;
    }

    colorDots.forEach((dot, index) => {
        console.log(`Setting up color dot ${index}:`, dot);
        
        // Remove any existing listeners
        const newDot = dot.cloneNode(true);
        dot.parentNode.replaceChild(newDot, dot);
        
        newDot.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Color dot clicked:', newDot.dataset.color);

            // Add click animation
            newDot.style.transform = 'scale(0.9)';
            setTimeout(() => {
                newDot.style.transform = '';
            }, 150);

            // Remove active class from all dots
            const allDots = document.querySelectorAll('.color-dot');
            allDots.forEach(d => d.classList.remove('active'));

            // Add active class to clicked dot
            newDot.classList.add('active');

            // Update selected color
            currentProduct.selectedColor = newDot.dataset.color;

            showNotification(`Selected color: ${currentProduct.selectedColor}`, 'success');
        });

        // Add keyboard support
        newDot.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                newDot.click();
            }
        });

        // Make focusable
        newDot.setAttribute('tabindex', '0');
    });
}

function setupSizeSelection() {
    const sizeButtons = document.querySelectorAll('.size-btn');
    console.log('Size buttons found:', sizeButtons.length);

    if (sizeButtons.length === 0) {
        console.warn('No size buttons found! Check selector: .size-btn');
        return;
    }

    sizeButtons.forEach((button, index) => {
        console.log(`Setting up size button ${index}:`, button);
        
        // Remove any existing listeners
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        newButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Size button clicked:', newButton.dataset.size);

            // Add click animation
            newButton.style.transform = 'scale(0.95)';
            setTimeout(() => {
                newButton.style.transform = '';
            }, 150);

            // Remove active class from all buttons
            const allButtons = document.querySelectorAll('.size-btn');
            allButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            newButton.classList.add('active');

            // Update selected size
            currentProduct.selectedSize = newButton.dataset.size;

            showNotification(`Selected size: ${currentProduct.selectedSize}`, 'success');
        });
        
        // Make focusable
        newButton.setAttribute('tabindex', '0');
    });
}

function setupQuantityControls() {
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');
    const quantityDisplay = document.getElementById('quantityDisplay');

    console.log('Quantity controls found:', {
        decreaseBtn: !!decreaseBtn,
        increaseBtn: !!increaseBtn,
        quantityDisplay: !!quantityDisplay
    });

    if (!decreaseBtn || !increaseBtn || !quantityDisplay) {
        console.warn('Some quantity controls not found!');
        return;
    }

    // Remove existing listeners by cloning
    const newDecreaseBtn = decreaseBtn.cloneNode(true);
    const newIncreaseBtn = increaseBtn.cloneNode(true);
    
    decreaseBtn.parentNode.replaceChild(newDecreaseBtn, decreaseBtn);
    increaseBtn.parentNode.replaceChild(newIncreaseBtn, increaseBtn);

    newDecreaseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Decrease quantity clicked');

        // Add click animation
        newDecreaseBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            newDecreaseBtn.style.transform = '';
        }, 150);

        if (currentProduct.quantity > 1) {
            currentProduct.quantity--;
            quantityDisplay.textContent = currentProduct.quantity;
            quantityDisplay.style.transform = 'scale(1.1)';
            setTimeout(() => {
                quantityDisplay.style.transform = '';
            }, 200);
        } else {
            showNotification('Minimum quantity is 1', 'info');
        }
    });

    newIncreaseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Increase quantity clicked');

        // Add click animation
        newIncreaseBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            newIncreaseBtn.style.transform = '';
        }, 150);

        if (currentProduct.quantity < 10) { // Max quantity limit
            currentProduct.quantity++;
            quantityDisplay.textContent = currentProduct.quantity;
            quantityDisplay.style.transform = 'scale(1.1)';
            setTimeout(() => {
                quantityDisplay.style.transform = '';
            }, 200);
        } else {
            showNotification('Maximum quantity is 10', 'info');
        }
    });
}

function setupAddToCart() {
    const addToCartBtn = document.getElementById('addToCartBtn');
    console.log('Add to cart button found:', !!addToCartBtn);

    if (!addToCartBtn) {
        console.warn('Add to cart button not found! Check ID: addToCartBtn');
        return;
    }

    // Remove existing listeners by cloning
    const newAddToCartBtn = addToCartBtn.cloneNode(true);
    addToCartBtn.parentNode.replaceChild(newAddToCartBtn, addToCartBtn);

    let isAdding = false; // Prevent multiple rapid clicks

    newAddToCartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Add to cart button clicked');
        
        if (isAdding) {
            console.log('Add to cart already in progress, ignoring click');
            return;
        }

        isAdding = true;
        // Disable button to prevent double clicks
        newAddToCartBtn.disabled = true;

        // Animation effect
        newAddToCartBtn.style.transform = 'scale(0.95)';
        newAddToCartBtn.textContent = 'Adding...';
        newAddToCartBtn.style.opacity = '0.8';

        setTimeout(() => {
            console.log('=== ABOUT TO ADD TO CART ===');
            console.log('currentProduct before addToCart:', currentProduct);
            console.log('currentProduct.title:', currentProduct.title);

            // Safety check - ensure title exists
            if (!currentProduct.title) {
                console.warn('currentProduct.title is undefined, setting to default');
                currentProduct.title = defaultProduct.title || 'Designer Anarkali Gown';
            }

            addToCart(currentProduct);
            updateCartBadge();
            showNotification(`${currentProduct.title} (${currentProduct.selectedColor}, ${currentProduct.selectedSize}) added to cart!`, 'success');

            // Success animation
            newAddToCartBtn.textContent = 'Added!';
            newAddToCartBtn.style.backgroundColor = '#4CAF50';
            newAddToCartBtn.style.transform = 'scale(1)';

            setTimeout(() => {
                // Reset button
                newAddToCartBtn.style.transform = '';
                newAddToCartBtn.style.opacity = '';
                newAddToCartBtn.style.backgroundColor = '';
                newAddToCartBtn.textContent = 'Add to Cart';
                newAddToCartBtn.disabled = false;
                isAdding = false; // Reset the flag
            }, 1000);
        }, 500);
    });
}

function setupWriteReview() {
    // Remove the inline onclick from HTML and use only event listener
    const writeReviewBtn = document.getElementById('writeReviewBtn');

    if (!writeReviewBtn) {
        console.warn('Write review button not found! Check ID: writeReviewBtn');
        return;
    }

    console.log('Write review button found and event listener being added');

    // Remove existing listeners by cloning
    const newWriteReviewBtn = writeReviewBtn.cloneNode(true);
    writeReviewBtn.parentNode.replaceChild(newWriteReviewBtn, writeReviewBtn);

    newWriteReviewBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Write review button clicked!');

        try {
            // Animation effect
            newWriteReviewBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                newWriteReviewBtn.style.transform = '';
            }, 150);

            // Check if currentProduct exists
            if (typeof currentProduct === 'undefined' || !currentProduct) {
                console.error('currentProduct is not defined!');
                showNotification('Error: Product data not available. Please refresh the page.', 'error');
                return;
            }

            console.log('Current product data:', currentProduct);

            // Store current product data for the review page
            const productDataForReview = {
                id: currentProduct.id || Date.now(),
                title: currentProduct.title || 'Unknown Product',
                brand: currentProduct.brand || 'StyleHub',
                currentPrice: currentProduct.currentPrice || 0,
                images: currentProduct.images || { main: 'https://via.placeholder.com/300x300' },
                selectedColor: currentProduct.selectedColor || 'default',
                selectedSize: currentProduct.selectedSize || 'M'
            };

            console.log('Product data for review:', productDataForReview);

            // Store in localStorage as backup
            localStorage.setItem('reviewProduct', JSON.stringify(productDataForReview));
            console.log('Product data saved to localStorage');

            // Navigate to write review page with product data
            const productParam = encodeURIComponent(JSON.stringify(productDataForReview));
            const reviewUrl = `write-review.html?product=${productParam}`;

            console.log('Navigating to:', reviewUrl);
            showNotification('Opening write review page...', 'info');

            // Add small delay to show notification
            setTimeout(() => {
                window.location.href = reviewUrl;
            }, 500);

        } catch (error) {
            console.error('Error in write review functionality:', error);
            showNotification('Error opening write review page. Please try again.', 'error');
        }
    });

    console.log('Write review event listener added successfully');
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
            const targetPanel = document.getElementById(targetTab);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
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
    try {
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
                image: product.images ? product.images.main : product.image,
                selectedSize: product.selectedSize,
                selectedColor: product.selectedColor,
                quantity: product.quantity
            });
        }

        localStorage.setItem('fashionCart', JSON.stringify(cart));

        // Update cart count in header if present
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalCount;
        }

        console.log('Product added to cart successfully. New cart count:', cart.reduce((total, item) => total + item.quantity, 0));
        console.log('Cart contents:', cart);
        console.log('localStorage cart:', localStorage.getItem('fashionCart'));
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('Error adding to cart. Please try again.', 'error');
    }
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
            image: currentProduct.images ? currentProduct.images.main : 'https://via.placeholder.com/300x300'
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
    if (cartBadge) {
        const count = getCartItemCount();
        cartBadge.textContent = count;
        
        // Animation
        cartBadge.style.transform = 'scale(1.3)';
        setTimeout(() => {
            cartBadge.style.transform = 'scale(1)';
        }, 200);
    }
}

function showCartSummary() {
    openCartModal();
}

function openCartModal() {
    const cartModal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartSummary = document.getElementById('cartSummary');

    if (!cartModal) {
        console.warn('Cart modal not found');
        return;
    }

    cartModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Load cart data
    const cart = JSON.parse(localStorage.getItem('fashionCart') || '[]');

    if (cart.length === 0) {
        if (cartItems) cartItems.style.display = 'none';
        if (cartEmpty) cartEmpty.classList.remove('hidden');
        if (cartSummary) cartSummary.style.display = 'none';
        const cartActions = document.querySelector('.cart-actions');
        if (cartActions) cartActions.style.display = 'none';
    } else {
        if (cartItems) cartItems.style.display = 'block';
        if (cartEmpty) cartEmpty.classList.add('hidden');
        if (cartSummary) cartSummary.style.display = 'block';
        const cartActions = document.querySelector('.cart-actions');
        if (cartActions) cartActions.style.display = 'block';

        // Display cart items
        displayCartItems(cart);
        updateCartSummary(cart);
    }

    // Setup cart modal event listeners
    setupCartModalListeners();
}

function closeCartModal() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

function displayCartItems(cart) {
    const cartItems = document.getElementById('cartItems');
    if (!cartItems) return;
    
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

    const itemCount = document.getElementById('itemCount');
    const subtotalValue = document.getElementById('subtotalValue');
    const taxValue = document.getElementById('taxValue');
    const totalValue = document.getElementById('totalValue');

    if (itemCount) itemCount.textContent = `(${totalItems} items)`;
    if (subtotalValue) subtotalValue.textContent = `$${subtotal.toFixed(2)}`;
    if (taxValue) taxValue.textContent = `$${tax.toFixed(2)}`;
    if (totalValue) totalValue.textContent = `$${total.toFixed(2)}`;

    // Update shipping
    const shippingElement = document.querySelector('.shipping-value');
    if (shippingElement) {
        shippingElement.textContent = cart.length > 0 ? '$9.99' : '$0.00';
    }
}

function setupCartModalListeners() {
    const closeCart = document.getElementById('closeCart');
    const continueShopping = document.getElementById('continueShopping');
    const proceedCheckout = document.getElementById('proceedCheckout');
    const cartModal = document.getElementById('cartModal');

    if (!closeCart || !continueShopping || !proceedCheckout || !cartModal) {
        return;
    }

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

// Make updateCartItemQuantity global for inline onclick
window.updateCartItemQuantity = function(index, change) {
    console.log('Updating cart item quantity:', index, change);
    let cart = JSON.parse(localStorage.getItem('fashionCart') || '[]');

    if (cart[index]) {
        cart[index].quantity += change;

        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }

        localStorage.setItem('fashionCart', JSON.stringify(cart));

        // Refresh cart display
        if (cart.length === 0) {
            const cartItems = document.getElementById('cartItems');
            const cartEmpty = document.getElementById('cartEmpty');
            const cartSummary = document.getElementById('cartSummary');
            const cartActions = document.querySelector('.cart-actions');

            if (cartItems) cartItems.style.display = 'none';
            if (cartEmpty) cartEmpty.classList.remove('hidden');
            if (cartSummary) cartSummary.style.display = 'none';
            if (cartActions) cartActions.style.display = 'none';
        } else {
            displayCartItems(cart);
            updateCartSummary(cart);
        }

        updateCartBadge();
    }
}

// Make removeCartItem global for inline onclick
window.removeCartItem = function(index) {
    console.log('Removing cart item at index:', index);
    let cart = JSON.parse(localStorage.getItem('fashionCart') || '[]');

    if (cart[index]) {
        const itemName = cart[index].title;
        cart.splice(index, 1);
        localStorage.setItem('fashionCart', JSON.stringify(cart));

        // Refresh cart display
        if (cart.length === 0) {
            const cartItems = document.getElementById('cartItems');
            const cartEmpty = document.getElementById('cartEmpty');
            const cartSummary = document.getElementById('cartSummary');
            const cartActions = document.querySelector('.cart-actions');

            if (cartItems) cartItems.style.display = 'none';
            if (cartEmpty) cartEmpty.classList.remove('hidden');
            if (cartSummary) cartSummary.style.display = 'none';
            if (cartActions) cartActions.style.display = 'none';
        } else {
            displayCartItems(cart);
            updateCartSummary(cart);
        }

        updateCartBadge();
        showNotification(`${itemName} removed from cart`, 'success');
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

// Global function for remove icon - accessible from inline onclick
window.removeAndGoHome = function() {
    console.log('Remove and go home function called!');

    // Get current product from global scope
    if (typeof currentProduct !== 'undefined') {
        // Remove from cart if it exists
        let cart = JSON.parse(localStorage.getItem('fashionCart') || '[]');
        const existingItemIndex = cart.findIndex(item =>
            item.title === currentProduct.title &&
            item.selectedSize === currentProduct.selectedSize &&
            item.selectedColor === currentProduct.selectedColor
        );

        if (existingItemIndex !== -1) {
            const itemName = cart[existingItemIndex].title;
            cart.splice(existingItemIndex, 1);
            localStorage.setItem('fashionCart', JSON.stringify(cart));

            // Update cart badge if available
            const cartBadge = document.getElementById('cartBadge');
            if (cartBadge) {
                const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
                cartBadge.textContent = totalItems;
            }
        }
    }

    // Show notification and navigate to home
    showNotification('Item removed! Redirecting to home page...', 'success');

    // Navigate to home page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
};

// Global function for write review - accessible from inline onclick
window.openWriteReview = function() {
    console.log('Write review function called!');

    // Fallback data if currentProduct is not available
    const fallbackProduct = {
        id: Date.now(),
        title: 'Churidar',
        brand: 'Fashion Hub',
        currentPrice: 299,
        images: { main: 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F9915d20cfed848ec961a57e0b81de98d?format=webp&width=800' },
        selectedColor: 'black',
        selectedSize: 'M'
    };

    const productToUse = (typeof currentProduct !== 'undefined' && currentProduct) ? currentProduct : fallbackProduct;

    localStorage.setItem('reviewProduct', JSON.stringify(productToUse));
    const productParam = encodeURIComponent(JSON.stringify(productToUse));
    const reviewUrl = `write-review.html?product=${productParam}`;

    console.log('Opening write review page with product:', productToUse.title);
    showNotification('Opening write review page...', 'info');
    
    setTimeout(() => {
        window.location.href = reviewUrl;
    }, 500);
};

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
    // Handle related product cards
    const relatedCards = document.querySelectorAll('.related-products .product-card');
    relatedCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // If clicking on the card (not a button), navigate to product detail
            if (!e.target.closest('button')) {
                const productTitle = card.querySelector('h3').textContent;
                const productImage = card.querySelector('img').src;
                const productPrice = card.querySelector('.current-price').textContent.replace('$', '');
                
                // Store product data for navigation
                const productData = {
                    title: productTitle,
                    currentPrice: parseInt(productPrice),
                    image: productImage
                };
                
                sessionStorage.setItem('selectedProduct', JSON.stringify(productData));
                
                // Reload current page to show new product
                window.location.reload();
            }
        });
    });
}

// Setup Profile Dropdown
function setupProfileDropdown() {
    const profileTrigger = document.getElementById('profileTrigger');
    const profileDropdown = document.getElementById('profileDropdown');
    
    if (!profileTrigger || !profileDropdown) {
        return;
    }
    
    profileTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        profileDropdown.classList.remove('show');
    });
    
    // Prevent dropdown from closing when clicking inside
    profileDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // Handle dropdown menu items
    const myProfile = document.getElementById('myProfile');
    const myOrders = document.getElementById('myOrders');
    const accountSettings = document.getElementById('accountSettings');
    const signInOut = document.getElementById('signInOut');
    
    if (myProfile) {
        myProfile.addEventListener('click', () => {
            window.location.href = 'profile.html';
        });
    }
    
    if (myOrders) {
        myOrders.addEventListener('click', () => {
            window.location.href = 'my-orders.html';
        });
    }
    
    if (accountSettings) {
        accountSettings.addEventListener('click', () => {
            window.location.href = 'account-settings.html';
        });
    }
    
    if (signInOut) {
        signInOut.addEventListener('click', () => {
            // Handle sign out
            showNotification('Signed out successfully', 'success');
            // Reset UI to guest state
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
    }
}

// Initialize on load
setTimeout(initializeWishlistState, 100);
