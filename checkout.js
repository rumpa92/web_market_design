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

    // Handle UPI payment
    if (selectedPayment.value === 'upi') {
        showUpiPaymentScreen();
        return;
    }

    // Handle Digital Wallet payment
    if (selectedPayment.value === 'wallet') {
        showWalletPaymentScreen();
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

            // Handle UPI selection
            if (this.value === 'upi') {
                showUpiPaymentScreen();
            }

            // Handle Digital Wallet selection
            if (this.value === 'wallet') {
                showWalletPaymentScreen();
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

// UPI Payment Flow Functions
function showUpiPaymentScreen() {
    const checkoutContent = document.querySelector('.checkout-content');
    const originalContent = checkoutContent.innerHTML;

    // Store original content for restoration
    window.originalCheckoutContent = originalContent;

    // Get cart total for display
    const totalAmount = document.querySelector('.total-amount').textContent;

    checkoutContent.innerHTML = `
        <div class="upi-payment-container">
            <!-- UPI Payment Screen -->
            <div class="upi-payment-screen">
                <div class="upi-header">
                    <button class="upi-back-btn" onclick="returnToCheckout()">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    <h1 class="upi-title">Pay with UPI</h1>
                </div>

                <div class="upi-content">
                    <div class="upi-main-section">
                        <div class="upi-subtitle">Secure and instant payment using your UPI ID or UPI Apps.</div>

                        <!-- UPI Payment Options -->
                        <div class="upi-payment-options">
                            <!-- Enter UPI ID Option -->
                            <div class="upi-option upi-id-option">
                                <h3 class="upi-option-title">
                                    Enter UPI ID (VPA)
                                </h3>
                                <div class="upi-id-form">
                                    <input type="text" id="upiIdInput" placeholder="username@upi" class="upi-id-input">
                                    <button class="upi-verify-btn" onclick="verifyAndPayUpi()">
                                        Verify & Pay
                                    </button>
                                </div>
                            </div>

                            <!-- UPI Apps Option -->
                            <div class="upi-option upi-apps-option">
                                <h3 class="upi-option-title">
                                    <i class="fas fa-mobile-alt"></i>
                                    Pay via UPI Apps (Quick Pay)
                                </h3>
                                <div class="upi-apps-grid">
                                    <button class="upi-app-btn" onclick="payWithUpiApp('gpay')">
                                        <div class="upi-app-icon gpay-icon">
                                            <i class="fab fa-google-pay"></i>
                                        </div>
                                        <span>GPay</span>
                                    </button>
                                    <button class="upi-app-btn" onclick="payWithUpiApp('phonepe')">
                                        <div class="upi-app-icon phonepe-icon">
                                            <i class="fas fa-mobile-alt"></i>
                                        </div>
                                        <span>PhonePe</span>
                                    </button>
                                    <button class="upi-app-btn" onclick="payWithUpiApp('paytm')">
                                        <div class="upi-app-icon paytm-icon">
                                            <i class="fas fa-wallet"></i>
                                        </div>
                                        <span>Paytm</span>
                                    </button>
                                    <button class="upi-app-btn" onclick="payWithUpiApp('bhim')">
                                        <div class="upi-app-icon bhim-icon">
                                            <i class="fas fa-university"></i>
                                        </div>
                                        <span>BHIM</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Security Note -->
                        <div class="upi-security-note">
                            <i class="fas fa-shield-alt"></i>
                            <span>Your payment is 100% secure and encrypted.</span>
                        </div>

                        <!-- Action Buttons -->
                        <div class="upi-action-buttons">
                            <button class="upi-change-method-btn" onclick="returnToCheckout()">
                                Change Payment Method
                            </button>
                        </div>
                    </div>

                    <!-- Order Summary Sticky Section -->
                    <div class="upi-order-summary">
                        ${generateUpiOrderSummary()}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateUpiOrderSummary() {
    // Get the original order summary and modify it for UPI context
    const originalOrderSummary = document.querySelector('.order-summary-card');
    if (originalOrderSummary) {
        // Clone the original order summary
        let orderSummaryHtml = originalOrderSummary.outerHTML;

        // Get the total amount for the pay button
        const totalElement = originalOrderSummary.querySelector('.total-amount');
        const totalAmount = totalElement ? totalElement.textContent : '$0.00';

        // Replace "Place Order" with "Pay" in the button
        orderSummaryHtml = orderSummaryHtml.replace(
            /Place Order - \$[\d,]+\.?\d*/g,
            `Pay ${totalAmount}`
        );

        // Update the onclick function for UPI payment
        orderSummaryHtml = orderSummaryHtml.replace(
            'id="placeOrderBtn"',
            'onclick="initiateUpiPayment()"'
        );

        return orderSummaryHtml;
    }

    // Fallback: generate the same structure if original not found
    const cartData = JSON.parse(localStorage.getItem('fashionCart') || '[]');
    const totalItems = cartData.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartData.reduce((sum, item) => {
        const price = typeof item.price === 'string' ? parseFloat(item.price.replace('$', '')) : parseFloat(item.price);
        return sum + (price * item.quantity);
    }, 0);

    const shipping = subtotal > 50 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const discount = getCurrentDiscount();
    const total = subtotal + shipping + tax - discount;

    // Generate order items HTML
    let orderItemsHtml = '';
    cartData.forEach(item => {
        const price = typeof item.price === 'string' ? item.price.replace('$', '') : item.price;
        const totalPrice = (parseFloat(price) * item.quantity).toFixed(2);

        orderItemsHtml += `
            <div class="order-item">
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
            </div>
        `;
    });

    return `
        <div class="order-summary-card">
            <h3 class="summary-title">Order Summary</h3>

            <!-- Order Items -->
            <div class="order-items">
                ${orderItemsHtml}
            </div>

            <!-- Price Breakdown -->
            <div class="price-breakdown">
                <div class="price-row">
                    <span>Subtotal (${totalItems} item${totalItems !== 1 ? 's' : ''})</span>
                    <span>$${subtotal.toFixed(2)}</span>
                </div>
                <div class="price-row">
                    <span>Shipping</span>
                    <span>${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}</span>
                </div>
                <div class="price-row">
                    <span>Tax (NY)</span>
                    <span>$${tax.toFixed(2)}</span>
                </div>
                ${discount > 0 ? `
                <div class="price-row discount-row">
                    <span>Discount</span>
                    <span class="discount-amount">-$${discount.toFixed(2)}</span>
                </div>
                ` : ''}
                <div class="price-divider"></div>
                <div class="price-row total-row">
                    <span>Total</span>
                    <span class="total-amount">$${total.toFixed(2)}</span>
                </div>
            </div>

            <!-- Pay Button -->
            <button class="place-order-btn" onclick="initiateUpiPayment()">
                <i class="fas fa-lock"></i>
                Pay $${total.toFixed(2)}
            </button>

            <!-- Security Badges -->
            <div class="security-info">
                <div class="security-item">
                    <i class="fas fa-shield-alt"></i>
                    <span>256-bit SSL encryption</span>
                </div>
                <div class="security-item">
                    <i class="fas fa-undo"></i>
                    <span>30-day return policy</span>
                </div>
            </div>
        </div>
    `;
}

function verifyAndPayUpi() {
    const upiId = document.getElementById('upiIdInput').value.trim();

    if (!upiId) {
        showNotification('Please enter your UPI ID', 'error');
        return;
    }

    // Validate UPI ID format
    const upiPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
    if (!upiPattern.test(upiId)) {
        showNotification('Please enter a valid UPI ID (e.g., username@upi)', 'error');
        return;
    }

    // Simulate UPI verification and payment
    const verifyBtn = document.querySelector('.upi-verify-btn');
    verifyBtn.disabled = true;
    verifyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';

    // Simulate processing time
    setTimeout(() => {
        // Random success/failure for demo
        const isSuccess = Math.random() > 0.3; // 70% success rate

        if (isSuccess) {
            showUpiSuccessScreen();
        } else {
            showUpiFailureScreen('UPI ID verification failed');
        }
    }, 2000);
}

function payWithUpiApp(appName) {
    showNotification(`Redirecting to ${appName.toUpperCase()}...`, 'info');

    // Simulate app redirect and payment
    setTimeout(() => {
        // Random success/failure for demo
        const isSuccess = Math.random() > 0.2; // 80% success rate

        if (isSuccess) {
            showUpiSuccessScreen();
        } else {
            showUpiFailureScreen('Payment was cancelled or failed');
        }
    }, 3000);
}

function initiateUpiPayment() {
    const upiId = document.getElementById('upiIdInput').value.trim();

    if (upiId) {
        verifyAndPayUpi();
    } else {
        showNotification('Please enter UPI ID or select a UPI app', 'error');
    }
}

function showUpiSuccessScreen() {
    const upiContainer = document.querySelector('.upi-payment-container');
    const totalAmount = document.querySelector('.upi-total-amount').textContent;
    const transactionId = 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const orderNumber = 'ORD' + Math.random().toString(36).substr(2, 8).toUpperCase();

    upiContainer.innerHTML = `
        <div class="upi-result-screen upi-success-screen">
            <div class="upi-result-content">
                <div class="upi-result-icon success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>

                <h1 class="upi-result-title">Payment Successful 🎉</h1>

                <div class="upi-result-details">
                    <div class="result-detail-item">
                        <span class="detail-label">Transaction ID:</span>
                        <span class="detail-value">${transactionId}</span>
                    </div>
                    <div class="result-detail-item">
                        <span class="detail-label">Amount Paid:</span>
                        <span class="detail-value">${totalAmount}</span>
                    </div>
                    <div class="result-detail-item">
                        <span class="detail-label">Order Number:</span>
                        <span class="detail-value">${orderNumber}</span>
                    </div>
                </div>

                <div class="upi-result-actions">
                    <button class="upi-primary-btn" onclick="trackOrder('${orderNumber}')">
                        <i class="fas fa-map-marker-alt"></i>
                        Track Order
                    </button>
                    <button class="upi-secondary-btn" onclick="continueShopping()">
                        <i class="fas fa-shopping-bag"></i>
                        Continue Shopping
                    </button>
                </div>

                <div class="upi-success-message">
                    <p>Your order has been confirmed and will be delivered within 3-5 business days.</p>
                </div>
            </div>
        </div>
    `;

    // Clear cart after successful payment
    localStorage.removeItem('fashionCart');
}

function showUpiFailureScreen(reason = 'Payment failed') {
    const upiContainer = document.querySelector('.upi-payment-container');
    const totalAmount = document.querySelector('.upi-total-amount').textContent;

    upiContainer.innerHTML = `
        <div class="upi-result-screen upi-failure-screen">
            <div class="upi-result-content">
                <div class="upi-result-icon failure-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>

                <h1 class="upi-result-title">Payment Failed ⚠️</h1>

                <div class="upi-failure-reason">
                    <p>${reason}</p>
                </div>

                <div class="upi-failure-suggestions">
                    <h3>Suggestions:</h3>
                    <ul>
                        <li>Check your internet connection</li>
                        <li>Verify your UPI ID is correct</li>
                        <li>Ensure sufficient balance in your account</li>
                        <li>Try using a different UPI app</li>
                    </ul>
                </div>

                <div class="upi-result-actions">
                    <button class="upi-primary-btn" onclick="showUpiPaymentScreen()">
                        <i class="fas fa-redo"></i>
                        Retry Payment
                    </button>
                    <button class="upi-secondary-btn" onclick="returnToCheckout()">
                        <i class="fas fa-arrow-left"></i>
                        Choose Another Method
                    </button>
                </div>
            </div>
        </div>
    `;
}

function returnToCheckout() {
    const checkoutContent = document.querySelector('.checkout-content');
    checkoutContent.innerHTML = window.originalCheckoutContent;

    // Reinitialize checkout functionality
    setupCheckoutFunctionality();
    setupPaymentMethods();
    setupAddressModal();
    setupCouponSystem();

    // Reload order summary
    loadOrderSummary();
}

function trackOrder(orderNumber) {
    // Store order number for tracking page
    localStorage.setItem('currentOrderNumber', orderNumber);
    window.location.href = 'track-order.html';
}

function continueShopping() {
    window.location.href = 'index.html';
}

// Digital Wallet Payment Flow Functions
function showWalletPaymentScreen() {
    const checkoutContent = document.querySelector('.checkout-content');
    const originalContent = checkoutContent.innerHTML;

    // Store original content for restoration
    window.originalCheckoutContent = originalContent;

    // Get cart total for display
    const totalAmount = document.querySelector('.total-amount').textContent;

    checkoutContent.innerHTML = `
        <div class="wallet-payment-container">
            <!-- Digital Wallet Payment Screen -->
            <div class="wallet-payment-screen">
                <div class="wallet-header">
                    <button class="wallet-back-btn" onclick="returnToCheckout()">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    <h1 class="wallet-title">Pay with Digital Wallet</h1>
                </div>

                <div class="wallet-content">
                    <div class="wallet-main-section">
                        <div class="wallet-subtitle">Choose your preferred digital wallet for secure payment.</div>

                        <!-- Digital Wallet Options -->>
                        <div class="wallet-options-grid">
                            <button class="wallet-option-btn" onclick="payWithWallet('googlepay')" data-wallet="googlepay">
                                <div class="wallet-logo-container">
                                    <div class="wallet-logo googlepay-logo">
                                        <i class="fab fa-google-pay"></i>
                                    </div>
                                </div>
                                <span class="wallet-name">Pay with Google Pay</span>
                            </button>

                            <button class="wallet-option-btn" onclick="payWithWallet('phonepe')" data-wallet="phonepe">
                                <div class="wallet-logo-container">
                                    <div class="wallet-logo phonepe-logo">
                                        <i class="fas fa-mobile-alt"></i>
                                    </div>
                                </div>
                                <span class="wallet-name">Pay with PhonePe</span>
                            </button>

                            <button class="wallet-option-btn" onclick="payWithWallet('paytm')" data-wallet="paytm">
                                <div class="wallet-logo-container">
                                    <div class="wallet-logo paytm-logo">
                                        <i class="fas fa-wallet"></i>
                                    </div>
                                </div>
                                <span class="wallet-name">Pay with Paytm Wallet</span>
                            </button>

                            <button class="wallet-option-btn" onclick="payWithWallet('amazonpay')" data-wallet="amazonpay">
                                <div class="wallet-logo-container">
                                    <div class="wallet-logo amazonpay-logo">
                                        <i class="fab fa-amazon-pay"></i>
                                    </div>
                                </div>
                                <span class="wallet-name">Pay with Amazon Pay</span>
                            </button>

                            <button class="wallet-option-btn" onclick="payWithWallet('applepay')" data-wallet="applepay">
                                <div class="wallet-logo-container">
                                    <div class="wallet-logo applepay-logo">
                                        <i class="fab fa-apple-pay"></i>
                                    </div>
                                </div>
                                <span class="wallet-name">Pay with Apple Pay</span>
                            </button>

                            <button class="wallet-option-btn" onclick="payWithWallet('samsungpay')" data-wallet="samsungpay">
                                <div class="wallet-logo-container">
                                    <div class="wallet-logo samsungpay-logo">
                                        <i class="fas fa-mobile-alt"></i>
                                    </div>
                                </div>
                                <span class="wallet-name">Pay with Samsung Pay</span>
                            </button>
                        </div>

                        <!-- Security Note -->
                        <div class="wallet-security-note">
                            <i class="fas fa-shield-alt"></i>
                            <span>Your wallet details are secure. We never store your payment credentials.</span>
                        </div>

                        <!-- Action Buttons -->
                        <div class="wallet-action-buttons">
                            <button class="wallet-change-method-btn" onclick="returnToCheckout()">
                                Change Payment Method
                            </button>
                        </div>
                    </div>

                    <!-- Order Summary Sticky Section -->
                    <div class="wallet-order-summary">
                        ${generateWalletOrderSummary()}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateWalletOrderSummary() {
    // Get the original order summary and modify it for Wallet context
    const originalOrderSummary = document.querySelector('.order-summary-card');
    if (originalOrderSummary) {
        // Clone the original order summary
        let orderSummaryHtml = originalOrderSummary.outerHTML;

        // Get the total amount for the pay button
        const totalElement = originalOrderSummary.querySelector('.total-amount');
        const totalAmount = totalElement ? totalElement.textContent : '$0.00';

        // Replace "Place Order" with "Pay" in the button
        orderSummaryHtml = orderSummaryHtml.replace(
            /Place Order - \$[\d,]+\.?\d*/g,
            `Pay ${totalAmount}`
        );

        // Update the onclick function for Wallet payment
        orderSummaryHtml = orderSummaryHtml.replace(
            'id="placeOrderBtn"',
            'onclick="initiateWalletPayment()"'
        );

        return orderSummaryHtml;
    }

    // Fallback: generate the same structure if original not found
    const cartData = JSON.parse(localStorage.getItem('fashionCart') || '[]');
    const totalItems = cartData.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartData.reduce((sum, item) => {
        const price = typeof item.price === 'string' ? parseFloat(item.price.replace('$', '')) : parseFloat(item.price);
        return sum + (price * item.quantity);
    }, 0);

    const shipping = subtotal > 50 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const discount = getCurrentDiscount();
    const total = subtotal + shipping + tax - discount;

    // Generate order items HTML
    let orderItemsHtml = '';
    cartData.forEach(item => {
        const price = typeof item.price === 'string' ? item.price.replace('$', '') : item.price;
        const totalPrice = (parseFloat(price) * item.quantity).toFixed(2);

        orderItemsHtml += `
            <div class="order-item">
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
            </div>
        `;
    });

    return `
        <div class="order-summary-card">
            <h3 class="summary-title">Order Summary</h3>

            <!-- Order Items -->
            <div class="order-items">
                ${orderItemsHtml}
            </div>

            <!-- Price Breakdown -->
            <div class="price-breakdown">
                <div class="price-row">
                    <span>Subtotal (${totalItems} item${totalItems !== 1 ? 's' : ''})</span>
                    <span>$${subtotal.toFixed(2)}</span>
                </div>
                <div class="price-row">
                    <span>Shipping</span>
                    <span>${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}</span>
                </div>
                <div class="price-row">
                    <span>Tax (NY)</span>
                    <span>$${tax.toFixed(2)}</span>
                </div>
                ${discount > 0 ? `
                <div class="price-row discount-row">
                    <span>Discount</span>
                    <span class="discount-amount">-$${discount.toFixed(2)}</span>
                </div>
                ` : ''}
                <div class="price-divider"></div>
                <div class="price-row total-row">
                    <span>Total</span>
                    <span class="total-amount">$${total.toFixed(2)}</span>
                </div>
            </div>

            <!-- Pay Button -->
            <button class="place-order-btn" onclick="initiateWalletPayment()">
                <i class="fas fa-lock"></i>
                Pay $${total.toFixed(2)}
            </button>

            <!-- Security Badges -->
            <div class="security-info">
                <div class="security-item">
                    <i class="fas fa-shield-alt"></i>
                    <span>256-bit SSL encryption</span>
                </div>
                <div class="security-item">
                    <i class="fas fa-undo"></i>
                    <span>30-day return policy</span>
                </div>
            </div>
        </div>
    `;
}

function payWithWallet(walletName) {
    const walletDisplayNames = {
        'googlepay': 'Google Pay',
        'phonepe': 'PhonePe',
        'paytm': 'Paytm Wallet',
        'amazonpay': 'Amazon Pay',
        'applepay': 'Apple Pay',
        'samsungpay': 'Samsung Pay'
    };

    const displayName = walletDisplayNames[walletName] || walletName;
    showNotification(`Redirecting to ${displayName}...`, 'info');

    // Store selected wallet for success/failure screens
    window.selectedWallet = displayName;

    // Simulate wallet redirect and payment
    setTimeout(() => {
        // Random success/failure for demo (80% success rate)
        const isSuccess = Math.random() > 0.2;

        if (isSuccess) {
            showWalletSuccessScreen(displayName);
        } else {
            showWalletFailureScreen(displayName);
        }
    }, 3000);
}

function initiateWalletPayment() {
    if (window.selectedWallet) {
        // Use already selected wallet
        showNotification(`Processing payment with ${window.selectedWallet}...`, 'info');
        setTimeout(() => {
            const isSuccess = Math.random() > 0.2;
            if (isSuccess) {
                showWalletSuccessScreen(window.selectedWallet);
            } else {
                showWalletFailureScreen(window.selectedWallet);
            }
        }, 2000);
    } else {
        showNotification('Please select a digital wallet', 'error');
    }
}

function showWalletSuccessScreen(walletUsed) {
    const walletContainer = document.querySelector('.wallet-payment-container');
    const totalAmount = document.querySelector('.total-amount').textContent;
    const transactionId = 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const orderNumber = 'ORD' + Math.random().toString(36).substr(2, 8).toUpperCase();

    walletContainer.innerHTML = `
        <div class="wallet-result-screen wallet-success-screen">
            <div class="wallet-result-content">
                <div class="wallet-result-icon success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>

                <h1 class="wallet-result-title">Payment Successful 🎉</h1>

                <div class="wallet-result-details">
                    <div class="result-detail-item">
                        <span class="detail-label">Paid via:</span>
                        <span class="detail-value">${walletUsed}</span>
                    </div>
                    <div class="result-detail-item">
                        <span class="detail-label">Amount Paid:</span>
                        <span class="detail-value">${totalAmount}</span>
                    </div>
                    <div class="result-detail-item">
                        <span class="detail-label">Transaction ID:</span>
                        <span class="detail-value">${transactionId}</span>
                    </div>
                    <div class="result-detail-item">
                        <span class="detail-label">Order ID:</span>
                        <span class="detail-value">${orderNumber}</span>
                    </div>
                </div>

                <div class="wallet-result-actions">
                    <button class="wallet-primary-btn" onclick="trackOrder('${orderNumber}')">
                        <i class="fas fa-map-marker-alt"></i>
                        Track Order
                    </button>
                    <button class="wallet-secondary-btn" onclick="continueShopping()">
                        <i class="fas fa-shopping-bag"></i>
                        Continue Shopping
                    </button>
                </div>

                <div class="wallet-success-message">
                    <p>Your order has been confirmed and will be delivered within 3-5 business days.</p>
                </div>
            </div>
        </div>
    `;

    // Clear cart after successful payment
    localStorage.removeItem('fashionCart');
}

function showWalletFailureScreen(walletUsed, reason = 'Payment failed') {
    const walletContainer = document.querySelector('.wallet-payment-container');
    const totalAmount = document.querySelector('.total-amount').textContent;

    // Common failure reasons for wallets
    const failureReasons = [
        'Insufficient balance in wallet',
        'Transaction timeout',
        'Payment was cancelled by user',
        'Network connection issue',
        'Wallet service temporarily unavailable'
    ];

    const randomReason = failureReasons[Math.floor(Math.random() * failureReasons.length)];
    const finalReason = reason === 'Payment failed' ? randomReason : reason;

    walletContainer.innerHTML = `
        <div class="wallet-result-screen wallet-failure-screen">
            <div class="wallet-result-content">
                <div class="wallet-result-icon failure-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>

                <h1 class="wallet-result-title">Payment Failed ⚠️</h1>

                <div class="wallet-failure-reason">
                    <p><strong>Reason:</strong> ${finalReason}</p>
                    <p><strong>Wallet:</strong> ${walletUsed}</p>
                </div>

                <div class="wallet-failure-suggestions">
                    <h3>Suggestions:</h3>
                    <ul>
                        <li>Check your wallet balance</li>
                        <li>Ensure stable internet connection</li>
                        <li>Verify your wallet app is updated</li>
                        <li>Try using a different payment method</li>
                        <li>Contact your wallet provider if issue persists</li>
                    </ul>
                </div>

                <div class="wallet-result-actions">
                    <button class="wallet-primary-btn" onclick="retryWalletPayment('${walletUsed}')">
                        <i class="fas fa-redo"></i>
                        Retry with ${walletUsed}
                    </button>
                    <button class="wallet-secondary-btn" onclick="returnToCheckout()">
                        <i class="fas fa-arrow-left"></i>
                        Choose Another Method
                    </button>
                </div>
            </div>
        </div>
    `;
}

function retryWalletPayment(walletName) {
    // Store the wallet for retry
    window.selectedWallet = walletName;
    showNotification(`Retrying payment with ${walletName}...`, 'info');

    // Simulate retry payment
    setTimeout(() => {
        // Slightly better success rate on retry (85%)
        const isSuccess = Math.random() > 0.15;

        if (isSuccess) {
            showWalletSuccessScreen(walletName);
        } else {
            showWalletFailureScreen(walletName, 'Retry failed. Please try a different method.');
        }
    }, 2000);
}

// Make functions global for inline onclick
window.removeCoupon = removeCoupon;
window.returnToCheckout = returnToCheckout;
window.verifyAndPayUpi = verifyAndPayUpi;
window.payWithUpiApp = payWithUpiApp;
window.initiateUpiPayment = initiateUpiPayment;
window.trackOrder = trackOrder;
window.continueShopping = continueShopping;
window.showWalletPaymentScreen = showWalletPaymentScreen;
window.payWithWallet = payWithWallet;
window.initiateWalletPayment = initiateWalletPayment;
