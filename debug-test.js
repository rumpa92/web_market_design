// Debug test to check what's working
setTimeout(() => {
    console.log('=== DEBUGGING PRODUCT DETAIL PAGE ===');
    
    // Test if elements exist
    const colorDots = document.querySelectorAll('.color-dot');
    const sizeButtons = document.querySelectorAll('.size-btn');
    const addToCartBtn = document.getElementById('addToCartBtn');
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');
    
    console.log('Elements found:');
    console.log('- Color dots:', colorDots.length);
    console.log('- Size buttons:', sizeButtons.length);
    console.log('- Add to cart button:', !!addToCartBtn);
    console.log('- Decrease button:', !!decreaseBtn);
    console.log('- Increase button:', !!increaseBtn);
    
    // Test if event listeners are attached
    if (colorDots.length > 0) {
        console.log('Testing color dot click...');
        try {
            colorDots[1].click(); // Try clicking the blue color
            console.log('Color dot click successful');
        } catch (error) {
            console.error('Color dot click failed:', error);
        }
    }
    
    if (sizeButtons.length > 0) {
        console.log('Testing size button click...');
        try {
            sizeButtons[1].click(); // Try clicking the S size
            console.log('Size button click successful');
        } catch (error) {
            console.error('Size button click failed:', error);
        }
    }
    
    if (addToCartBtn) {
        console.log('Testing add to cart click...');
        try {
            addToCartBtn.click();
            console.log('Add to cart click successful');
        } catch (error) {
            console.error('Add to cart click failed:', error);
        }
    }
    
    // Check if currentProduct exists
    if (typeof currentProduct !== 'undefined') {
        console.log('Current product:', currentProduct);
    } else {
        console.error('currentProduct is not defined!');
    }
    
    console.log('=== DEBUG TEST COMPLETE ===');
}, 3000);
