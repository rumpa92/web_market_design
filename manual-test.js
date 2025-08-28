// Manual test - run this in browser console
console.log('=== MANUAL FUNCTIONALITY TEST ===');

// Test 1: Try clicking color dots directly
setTimeout(() => {
    console.log('Testing color dots...');
    const colorDots = document.querySelectorAll('.color-dot');
    console.log('Found color dots:', colorDots.length);
    
    if (colorDots.length > 1) {
        colorDots[1].click(); // Click blue
        console.log('Clicked blue color dot');
    }
}, 1000);

// Test 2: Try clicking size buttons
setTimeout(() => {
    console.log('Testing size buttons...');
    const sizeButtons = document.querySelectorAll('.size-btn');
    console.log('Found size buttons:', sizeButtons.length);
    
    if (sizeButtons.length > 1) {
        sizeButtons[1].click(); // Click S
        console.log('Clicked S size button');
    }
}, 2000);

// Test 3: Try clicking quantity buttons
setTimeout(() => {
    console.log('Testing quantity controls...');
    const increaseBtn = document.getElementById('increaseQty');
    const decreaseBtn = document.getElementById('decreaseQty');
    
    if (increaseBtn) {
        increaseBtn.click();
        console.log('Clicked increase quantity');
    }
    
    if (decreaseBtn) {
        decreaseBtn.click();
        console.log('Clicked decrease quantity');
    }
}, 3000);

// Test 4: Try clicking add to cart
setTimeout(() => {
    console.log('Testing add to cart...');
    const addToCartBtn = document.getElementById('addToCartBtn');
    
    if (addToCartBtn) {
        addToCartBtn.click();
        console.log('Clicked add to cart button');
    }
}, 4000);

// Test 5: Check if functions exist
setTimeout(() => {
    console.log('Checking function availability...');
    console.log('setupColorSelection exists:', typeof setupColorSelection);
    console.log('setupSizeSelection exists:', typeof setupSizeSelection);
    console.log('setupQuantityControls exists:', typeof setupQuantityControls);
    console.log('setupAddToCart exists:', typeof setupAddToCart);
    console.log('currentProduct exists:', typeof currentProduct);
}, 5000);

console.log('Manual test scheduled - watch for results...');
