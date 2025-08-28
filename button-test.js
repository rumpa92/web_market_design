// Button functionality test script

// Test all button functionality on the product detail page
function testButtonFunctionality() {
    console.log('=== TESTING BUTTON FUNCTIONALITY ===');
    
    // Test Color Selection
    console.log('1. Testing Color Selection...');
    const colorDots = document.querySelectorAll('.color-dot');
    console.log(`Found ${colorDots.length} color dots`);
    
    colorDots.forEach((dot, index) => {
        console.log(`Color dot ${index}: ${dot.dataset.color} - Has click listener: ${!!dot.onclick || !!dot.addEventListener}`);
        
        // Test click programmatically
        try {
            dot.click();
            console.log(`✓ Color dot ${index} (${dot.dataset.color}) clicked successfully`);
        } catch (error) {
            console.log(`✗ Color dot ${index} click failed:`, error);
        }
    });
    
    // Test Size Selection
    console.log('\n2. Testing Size Selection...');
    const sizeButtons = document.querySelectorAll('.size-btn');
    console.log(`Found ${sizeButtons.length} size buttons`);
    
    sizeButtons.forEach((btn, index) => {
        console.log(`Size button ${index}: ${btn.dataset.size} - Has click listener: ${!!btn.onclick || !!btn.addEventListener}`);
        
        try {
            btn.click();
            console.log(`✓ Size button ${index} (${btn.dataset.size}) clicked successfully`);
        } catch (error) {
            console.log(`✗ Size button ${index} click failed:`, error);
        }
    });
    
    // Test Quantity Controls
    console.log('\n3. Testing Quantity Controls...');
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');
    const quantityDisplay = document.getElementById('quantityDisplay');
    
    console.log(`Decrease button found: ${!!decreaseBtn}`);
    console.log(`Increase button found: ${!!increaseBtn}`);
    console.log(`Quantity display found: ${!!quantityDisplay}`);
    
    if (decreaseBtn) {
        try {
            decreaseBtn.click();
            console.log('✓ Decrease button clicked successfully');
        } catch (error) {
            console.log('✗ Decrease button click failed:', error);
        }
    }
    
    if (increaseBtn) {
        try {
            increaseBtn.click();
            console.log('✓ Increase button clicked successfully');
        } catch (error) {
            console.log('✗ Increase button click failed:', error);
        }
    }
    
    // Test Add to Cart
    console.log('\n4. Testing Add to Cart...');
    const addToCartBtn = document.getElementById('addToCartBtn');
    console.log(`Add to cart button found: ${!!addToCartBtn}`);
    
    if (addToCartBtn) {
        try {
            addToCartBtn.click();
            console.log('✓ Add to cart button clicked successfully');
        } catch (error) {
            console.log('✗ Add to cart button click failed:', error);
        }
    }
    
    // Test Write Review
    console.log('\n5. Testing Write Review...');
    const writeReviewBtn = document.getElementById('writeReviewBtn');
    console.log(`Write review button found: ${!!writeReviewBtn}`);
    
    if (writeReviewBtn) {
        try {
            writeReviewBtn.click();
            console.log('✓ Write review button clicked successfully');
        } catch (error) {
            console.log('✗ Write review button click failed:', error);
        }
    }
    
    // Test Remove Icon
    console.log('\n6. Testing Remove Icon...');
    const removeIcon = document.querySelector('.remove-icon');
    console.log(`Remove icon found: ${!!removeIcon}`);
    
    if (removeIcon) {
        console.log(`Remove icon has onclick: ${!!removeIcon.onclick}`);
        console.log(`Remove icon onclick function: ${removeIcon.onclick}`);
    }
    
    console.log('\n=== BUTTON FUNCTIONALITY TEST COMPLETE ===');
}

// Test DOM readiness
function testDOMReady() {
    console.log('=== DOM READINESS TEST ===');
    console.log('Document ready state:', document.readyState);
    console.log('DOM content loaded:', document.readyState !== 'loading');
    
    // Count all interactive elements
    const buttons = document.querySelectorAll('button');
    const clickableElements = document.querySelectorAll('[onclick], .color-dot, .size-btn, .qty-btn');
    
    console.log(`Total buttons found: ${buttons.length}`);
    console.log(`Total clickable elements found: ${clickableElements.length}`);
    
    // Test if event listeners are attached
    console.log('\nEvent listener test:');
    const testBtn = document.getElementById('addToCartBtn');
    if (testBtn) {
        console.log('Add to cart button has event listeners:', testBtn.getEventListeners ? testBtn.getEventListeners() : 'getEventListeners not available');
    }
}

// Auto-run test when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            testDOMReady();
            testButtonFunctionality();
        }, 1000); // Wait 1 second after DOM loaded to ensure all scripts have run
    });
} else {
    setTimeout(() => {
        testDOMReady();
        testButtonFunctionality();
    }, 1000);
}

// Manual test functions available in console
window.testButtons = testButtonFunctionality;
window.testDOM = testDOMReady;

// Quick test individual elements
window.testColorDots = function() {
    const dots = document.querySelectorAll('.color-dot');
    console.log('Color dots test:');
    dots.forEach((dot, i) => {
        console.log(`Dot ${i}: color=${dot.dataset.color}, active=${dot.classList.contains('active')}`);
        dot.click();
    });
};

window.testSizeBtns = function() {
    const btns = document.querySelectorAll('.size-btn');
    console.log('Size buttons test:');
    btns.forEach((btn, i) => {
        console.log(`Button ${i}: size=${btn.dataset.size}, active=${btn.classList.contains('active')}`);
        btn.click();
    });
};

console.log('Button test script loaded. Available functions:');
console.log('- testButtons() - Test all button functionality');
console.log('- testDOM() - Test DOM readiness');
console.log('- testColorDots() - Test color selection');
console.log('- testSizeBtns() - Test size selection');
