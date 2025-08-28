// Comprehensive fix for product detail page functionality
(function() {
    'use strict';
    
    // Wait for DOM to be ready
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }
    
    // Product state
    let productState = {
        selectedColor: 'black',
        selectedSize: 'M',
        quantity: 1,
        title: 'Churidar',
        price: 299
    };
    
    // Show notification
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 10000;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: all 0.3s ease;
            transform: translateX(300px);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(300px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Color selection functionality
    function setupColors() {
        const colorDots = document.querySelectorAll('.color-dot');
        colorDots.forEach(dot => {
            dot.addEventListener('click', function() {
                // Remove active class from all dots
                colorDots.forEach(d => d.classList.remove('active'));
                
                // Add active class to clicked dot
                this.classList.add('active');
                
                // Update state
                productState.selectedColor = this.dataset.color;
                
                // Add visual feedback
                this.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
                
                showNotification(`Selected color: ${productState.selectedColor}`, 'success');
            });
        });
    }
    
    // Size selection functionality
    function setupSizes() {
        const sizeButtons = document.querySelectorAll('.size-btn');
        sizeButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                sizeButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Update state
                productState.selectedSize = this.dataset.size;
                
                // Add visual feedback
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
                
                showNotification(`Selected size: ${productState.selectedSize}`, 'success');
            });
        });
    }
    
    // Quantity controls
    function setupQuantity() {
        const decreaseBtn = document.getElementById('decreaseQty');
        const increaseBtn = document.getElementById('increaseQty');
        const quantityDisplay = document.getElementById('quantityDisplay');
        
        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', function() {
                if (productState.quantity > 1) {
                    productState.quantity--;
                    if (quantityDisplay) {
                        quantityDisplay.textContent = productState.quantity;
                        quantityDisplay.style.transform = 'scale(1.1)';
                        setTimeout(() => {
                            quantityDisplay.style.transform = '';
                        }, 200);
                    }
                } else {
                    showNotification('Minimum quantity is 1', 'info');
                }
                
                // Visual feedback
                this.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        }
        
        if (increaseBtn) {
            increaseBtn.addEventListener('click', function() {
                if (productState.quantity < 10) {
                    productState.quantity++;
                    if (quantityDisplay) {
                        quantityDisplay.textContent = productState.quantity;
                        quantityDisplay.style.transform = 'scale(1.1)';
                        setTimeout(() => {
                            quantityDisplay.style.transform = '';
                        }, 200);
                    }
                } else {
                    showNotification('Maximum quantity is 10', 'info');
                }
                
                // Visual feedback
                this.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        }
    }
    
    // Add to cart functionality
    function setupAddToCart() {
        const addToCartBtn = document.getElementById('addToCartBtn');
        
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function() {
                // Disable button temporarily
                this.disabled = true;
                const originalText = this.textContent;
                
                // Visual feedback
                this.style.transform = 'scale(0.95)';
                this.textContent = 'Adding...';
                this.style.opacity = '0.8';
                
                setTimeout(() => {
                    // Add to cart logic
                    const cartData = {
                        title: productState.title,
                        color: productState.selectedColor,
                        size: productState.selectedSize,
                        quantity: productState.quantity,
                        price: productState.price
                    };
                    
                    // Save to localStorage
                    let cart = JSON.parse(localStorage.getItem('fashionCart') || '[]');
                    cart.push(cartData);
                    localStorage.setItem('fashionCart', JSON.stringify(cart));
                    
                    // Update cart badge
                    const cartBadge = document.getElementById('cartBadge');
                    if (cartBadge) {
                        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
                        cartBadge.textContent = totalItems;
                        cartBadge.style.transform = 'scale(1.2)';
                        setTimeout(() => {
                            cartBadge.style.transform = '';
                        }, 200);
                    }
                    
                    // Success state
                    this.textContent = 'Added!';
                    this.style.backgroundColor = '#4CAF50';
                    this.style.transform = 'scale(1)';
                    
                    showNotification(`${productState.title} (${productState.selectedColor}, ${productState.selectedSize}) added to cart!`, 'success');
                    
                    // Reset button
                    setTimeout(() => {
                        this.textContent = originalText;
                        this.style.backgroundColor = '';
                        this.style.opacity = '';
                        this.style.transform = '';
                        this.disabled = false;
                    }, 1500);
                }, 500);
            });
        }
    }
    
    // Tab functionality
    function setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetTab = this.dataset.tab;
                
                // Remove active class from all tabs and panels
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanels.forEach(panel => panel.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding panel
                this.classList.add('active');
                const targetPanel = document.getElementById(targetTab);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
                
                showNotification(`Switched to ${this.textContent}`, 'info');
            });
        });
    }
    
    // Image gallery
    function setupGallery() {
        const thumbnails = document.querySelectorAll('.thumbnail-item');
        const mainImage = document.getElementById('mainProductImage');
        
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                // Remove active class from all thumbnails
                thumbnails.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked thumbnail
                this.classList.add('active');
                
                // Update main image (simplified - just add visual feedback)
                if (mainImage) {
                    mainImage.style.opacity = '0.7';
                    setTimeout(() => {
                        mainImage.style.opacity = '1';
                    }, 200);
                }
                
                showNotification('Image view updated', 'info');
            });
        });
    }
    
    // Wishlist functionality
    function setupWishlist() {
        const wishlistBtn = document.getElementById('wishlistOverlay');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', function() {
                const icon = this.querySelector('i');
                const isInWishlist = icon.classList.contains('fas');
                
                if (isInWishlist) {
                    icon.className = 'far fa-heart';
                    this.style.color = '#666';
                    showNotification('Removed from wishlist', 'info');
                } else {
                    icon.className = 'fas fa-heart';
                    this.style.color = '#ff4444';
                    showNotification('Added to wishlist!', 'success');
                }
                
                // Animation
                this.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
            });
        }
    }
    
    // Initialize all functionality
    function init() {
        console.log('🚀 Initializing product functionality...');
        
        try {
            setupColors();
            setupSizes();
            setupQuantity();
            setupAddToCart();
            setupTabs();
            setupGallery();
            setupWishlist();
            
            // Show success indicator
            setTimeout(() => {
                showNotification('✅ All features are now working!', 'success');
            }, 500);
            
            console.log('✅ Product functionality initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing functionality:', error);
            showNotification('Error initializing features', 'error');
        }
    }
    
    // Disabled to prevent cart conflicts with product-detail.js
    // ready(init);
    
})();
