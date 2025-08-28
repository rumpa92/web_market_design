// Checkout Page JavaScript

// Initialize checkout page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Checkout page initialized');
    
    loadOrderSummary();
    setupCheckoutFunctionality();
    setupPaymentMethods();
    setupAddressModal();
    setupCouponSystem();
});

// Load actual cart data into order summary
function loadOrderSummary() {
    console.log('Loading order summary from cart data...');
    
    // Get cart data from localStorage
    const cartData = JSON.parse(localStorage.getItem('fashionCart') || '[]');
    console.log('Cart data loaded:', cartData);
    
    if (cartData.length === 0) {
        // If no cart data, redirect to cart or show empty state
        showEmptyCartMessage();
        return;
    }
    
    // Update order items section
    updateOrderItems(cartData);
    
    // Update price breakdown
    updatePriceBreakdown(cartData);
}

function updateOrderItems(cartData) {
    const orderItemsContainer = document.querySelector('.order-items');
    if (!orderItemsContainer) return;
    
    // Clear existing static content
    orderItemsContainer.innerHTML = '';
    
    // Add each cart item to order summary
    cartData.forEach((item, index) => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        
        // Extract price number from string (remove $ symbol)
        const price = typeof item.price === 'string' ? item.price.replace('$', '') : item.price;
        const totalPrice = (parseFloat(price) * item.quantity).toFixed(2);
        
        orderItem.innerHTML = `
            <div class="item-image">
                <img src="${item.image || 'https://via.placeholder.com/200x200'}" alt="${item.title}">
            </div>
            <div class="item-details">
                <h4>${item.title}</h4>
                <p>StyleHub</p>
                <div class="item-options">
                    ${item.selectedSize ? `<span>Size: ${item.selectedSize}</span>` : ''}
                    ${item.selectedColor ? `<span>Color: ${item.selectedColor}</span>` : ''}
                </div>
                <div class="item-quantity">Qty: ${item.quantity}</div>
            </div>
            <div class="item-price">$${totalPrice}</div>
        `;
        
        orderItemsContainer.appendChild(orderItem);
    });
}

function updatePriceBreakdown(cartData) {
    // Calculate totals
    const subtotal = cartData.reduce((sum, item) => {
        const price = typeof item.price === 'string' ? parseFloat(item.price.replace('$', '')) : parseFloat(item.price);
        return sum + (price * item.quantity);
    }, 0);
    
    const totalItems = cartData.reduce((sum, item) => sum + item.quantity, 0);
    const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
    const taxRate = 0.08; // 8% tax
    const tax = subtotal * taxRate;
    const discount = getCurrentDiscount();
    const total = subtotal + shipping + tax - discount;
    
    // Update price breakdown display
    const priceBreakdown = document.querySelector('.price-breakdown');
    if (!priceBreakdown) return;
    
    // Update subtotal
    const subtotalRow = priceBreakdown.querySelector('.price-row:first-child span:last-child');
    const subtotalLabel = priceBreakdown.querySelector('.price-row:first-child span:first-child');
    if (subtotalRow && subtotalLabel) {
        subtotalLabel.textContent = `Subtotal (${totalItems} item${totalItems !== 1 ? 's' : ''})`;
        subtotalRow.textContent = `$${subtotal.toFixed(2)}`;
    }
    
    // Update shipping
    const shippingRow = priceBreakdown.querySelector('.price-row:nth-child(2) span:last-child');
    if (shippingRow) {
        shippingRow.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    }
    
    // Update tax
    const taxRow = priceBreakdown.querySelector('.price-row:nth-child(3) span:last-child');
    if (taxRow) {
        taxRow.textContent = `$${tax.toFixed(2)}`;
    }
    
    // Update discount if applicable
    const discountRow = document.getElementById('discountRow');
    if (discount > 0 && discountRow) {
        discountRow.classList.remove('hidden');
        const discountAmount = discountRow.querySelector('.discount-amount');
        if (discountAmount) {
            discountAmount.textContent = `-$${discount.toFixed(2)}`;
        }
    } else if (discountRow) {
        discountRow.classList.add('hidden');
    }
    
    // Update total
    const totalRow = priceBreakdown.querySelector('.total-row span:last-child');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    
    if (totalRow) {
        totalRow.textContent = `$${total.toFixed(2)}`;
    }
    
    if (placeOrderBtn) {
        placeOrderBtn.innerHTML = `
            <i class="fas fa-lock"></i>
            Place Order - $${total.toFixed(2)}
        `;
    }
    
    console.log('Price breakdown updated:', {
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        tax: tax.toFixed(2),
        discount: discount.toFixed(2),
        total: total.toFixed(2)
    });
}

function showEmptyCartMessage() {
    const orderSummaryCard = document.querySelector('.order-summary-card');
    if (!orderSummaryCard) return;
    
    orderSummaryCard.innerHTML = `
        <div class="empty-cart-checkout">
            <div class="empty-cart-icon">
                <i class="fas fa-shopping-bag"></i>
            </div>
            <h3>Your Cart is Empty</h3>
            <p>Add items to your cart to proceed with checkout</p>
            <button class="continue-shopping-btn" onclick="window.location.href='index.html'">
                <i class="fas fa-arrow-left"></i>
                Continue Shopping
            </button>
        </div>
    `;
}

function getCurrentDiscount() {
    // Get applied discount from coupon system
    const appliedCoupons = document.getElementById('appliedCoupons');
    if (!appliedCoupons) return 0;
    
    const discountElements = appliedCoupons.querySelectorAll('.coupon-discount');
    let totalDiscount = 0;
    
    discountElements.forEach(element => {
        const discountText = element.textContent;
        const discountMatch = discountText.match(/\$(\d+\.?\d*)/);
        if (discountMatch) {
            totalDiscount += parseFloat(discountMatch[1]);
        }
    });
    
    return totalDiscount;
}

// Setup checkout functionality
function setupCheckoutFunctionality() {
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', handlePlaceOrder);
    }
}

function handlePlaceOrder() {
    // Validate payment method
    const selectedPayment = document.querySelector('input[name="payment"]:checked');
    if (!selectedPayment) {
        showNotification('Please select a payment method', 'error');
        return;
    }
    
    // Validate card details if card is selected
    if (selectedPayment.value === 'card') {
        if (!validateCardDetails()) {
            return;
        }
    }
    
    // Show loading state
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    placeOrderBtn.disabled = true;
    placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    // Simulate order processing
    setTimeout(() => {
        // Clear cart after successful order
        localStorage.removeItem('fashionCart');
        
        // Redirect to order confirmation
        window.location.href = 'order-confirmation.html';
    }, 2000);
}

function validateCardDetails() {
    const cardNumber = document.getElementById('cardNumber').value;
    const cardName = document.getElementById('cardName').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
        showNotification('Please fill in all card details', 'error');
        return false;
    }
    
    // Basic card number validation (just check length)
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
        showNotification('Please enter a valid card number', 'error');
        return false;
    }
    
    // Basic expiry date validation
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        showNotification('Please enter expiry date in MM/YY format', 'error');
        return false;
    }
    
    // Basic CVV validation
    if (!/^\d{3,4}$/.test(cvv)) {
        showNotification('Please enter a valid CVV', 'error');
        return false;
    }
    
    return true;
}

// Setup payment methods
function setupPaymentMethods() {
    const paymentMethods = document.querySelectorAll('input[name="payment"]');
    const cardDetailsForm = document.getElementById('cardDetailsForm');
    
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            if (this.value === 'card') {
                cardDetailsForm.style.display = 'block';
            } else {
                cardDetailsForm.style.display = 'none';
            }
        });
    });
    
    // Format card number input
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function() {
            let value = this.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            this.value = formattedValue;
        });
    }
    
    // Format expiry date input
    const expiryInput = document.getElementById('expiryDate');
    if (expiryInput) {
        expiryInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            this.value = value;
        });
    }
}

// Setup address modal
function setupAddressModal() {
    const changeAddressBtn = document.getElementById('changeAddressBtn');
    const addressModal = document.getElementById('addressModal');
    const closeAddressModal = document.getElementById('closeAddressModal');
    const cancelAddressBtn = document.getElementById('cancelAddressBtn');
    const confirmAddressBtn = document.getElementById('confirmAddressBtn');
    
    if (changeAddressBtn && addressModal) {
        changeAddressBtn.addEventListener('click', () => {
            addressModal.classList.remove('hidden');
        });
    }
    
    [closeAddressModal, cancelAddressBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                addressModal.classList.add('hidden');
            });
        }
    });
    
    if (confirmAddressBtn) {
        confirmAddressBtn.addEventListener('click', () => {
            const selectedAddress = document.querySelector('input[name="address"]:checked');
            if (selectedAddress) {
                updateShippingAddress(selectedAddress.value);
                addressModal.classList.add('hidden');
            }
        });
    }
    
    // Close modal on overlay click
    if (addressModal) {
        addressModal.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                addressModal.classList.add('hidden');
            }
        });
    }
}

function updateShippingAddress(addressId) {
    // Update the displayed shipping address based on selection
    const addressInfo = document.querySelector('.address-info');
    
    if (addressId === 'addr2') {
        addressInfo.innerHTML = `
            <div class="address-name">John Doe (Office)</div>
            <div class="address-details">
                <p>456 Business Ave, Floor 10</p>
                <p>New York, NY 10002</p>
                <p>Phone: +1 (555) 987-6543</p>
            </div>
        `;
    } else {
        addressInfo.innerHTML = `
            <div class="address-name">John Doe</div>
            <div class="address-details">
                <p>123 Fashion Street, Suite 456</p>
                <p>New York, NY 10001</p>
                <p>Phone: +1 (555) 123-4567</p>
            </div>
        `;
    }
    
    showNotification('Shipping address updated', 'success');
}

// Setup coupon system
function setupCouponSystem() {
    const applyCouponBtn = document.getElementById('applyCouponBtn');
    const couponInput = document.getElementById('couponInput');
    
    if (applyCouponBtn && couponInput) {
        applyCouponBtn.addEventListener('click', applyCoupon);
        couponInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                applyCoupon();
            }
        });
    }
}

function applyCoupon() {
    const couponInput = document.getElementById('couponInput');
    const couponCode = couponInput.value.trim().toUpperCase();
    
    if (!couponCode) {
        showNotification('Please enter a coupon code', 'error');
        return;
    }
    
    // Define available coupons
    const coupons = {
        'WELCOME10': { discount: 10, type: 'percentage' },
        'SAVE15': { discount: 15, type: 'fixed' },
        'FREESHIP': { discount: 9.99, type: 'shipping' },
        'FASHION20': { discount: 20, type: 'percentage' }
    };
    
    const coupon = coupons[couponCode];
    
    if (!coupon) {
        showNotification('Invalid coupon code', 'error');
        return;
    }
    
    // Check if coupon already applied
    const appliedCoupons = document.getElementById('appliedCoupons');
    const existingCoupon = appliedCoupons.querySelector(`[data-coupon="${couponCode}"]`);
    
    if (existingCoupon) {
        showNotification('Coupon already applied', 'info');
        return;
    }
    
    // Apply coupon
    addAppliedCoupon(couponCode, coupon);
    couponInput.value = '';
    
    // Reload cart data to recalculate totals
    const cartData = JSON.parse(localStorage.getItem('fashionCart') || '[]');
    updatePriceBreakdown(cartData);
    
    showNotification(`Coupon ${couponCode} applied successfully!`, 'success');
}

function addAppliedCoupon(code, coupon) {
    const appliedCoupons = document.getElementById('appliedCoupons');
    
    const couponElement = document.createElement('div');
    couponElement.className = 'applied-coupon';
    couponElement.setAttribute('data-coupon', code);
    
    let discountText = '';
    if (coupon.type === 'percentage') {
        discountText = `${coupon.discount}% off`;
    } else if (coupon.type === 'fixed') {
        discountText = `$${coupon.discount} off`;
    } else if (coupon.type === 'shipping') {
        discountText = 'Free shipping';
    }
    
    couponElement.innerHTML = `
        <div class="coupon-info">
            <span class="coupon-code">${code}</span>
            <span class="coupon-discount">${discountText}</span>
        </div>
        <button class="remove-coupon-btn" onclick="removeCoupon('${code}')">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    appliedCoupons.appendChild(couponElement);
}

function removeCoupon(code) {
    const appliedCoupons = document.getElementById('appliedCoupons');
    const couponElement = appliedCoupons.querySelector(`[data-coupon="${code}"]`);
    
    if (couponElement) {
        couponElement.remove();
        
        // Reload cart data to recalculate totals
        const cartData = JSON.parse(localStorage.getItem('fashionCart') || '[]');
        updatePriceBreakdown(cartData);
        
        showNotification(`Coupon ${code} removed`, 'info');
    }
}

// Go back function
function goBack() {
    window.history.back();
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
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

// Make removeCoupon function global for inline onclick
window.removeCoupon = removeCoupon;
