// Visual test that shows results on the page
setTimeout(() => {
    // Create a test results panel
    const testPanel = document.createElement('div');
    testPanel.id = 'test-panel';
    testPanel.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        background: white;
        border: 2px solid #333;
        padding: 15px;
        border-radius: 8px;
        z-index: 10000;
        max-width: 300px;
        font-family: monospace;
        font-size: 12px;
        line-height: 1.4;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(testPanel);

    let results = [];
    
    // Test elements existence
    const colorDots = document.querySelectorAll('.color-dot');
    const sizeButtons = document.querySelectorAll('.size-btn');
    const addToCartBtn = document.getElementById('addToCartBtn');
    const increaseBtn = document.getElementById('increaseQty');
    const decreaseBtn = document.getElementById('decreaseQty');
    const quantityDisplay = document.getElementById('quantityDisplay');
    
    results.push(`🎨 Color dots: ${colorDots.length} found`);
    results.push(`📏 Size buttons: ${sizeButtons.length} found`);
    results.push(`🛒 Add to cart: ${addToCartBtn ? '✅' : '❌'}`);
    results.push(`➕ Increase btn: ${increaseBtn ? '✅' : '❌'}`);
    results.push(`➖ Decrease btn: ${decreaseBtn ? '✅' : '❌'}`);
    results.push(`🔢 Quantity display: ${quantityDisplay ? '✅' : '❌'}`);
    
    // Test if currentProduct exists
    results.push(`📦 currentProduct: ${typeof currentProduct !== 'undefined' ? '✅' : '❌'}`);
    
    // Test function clicks
    let clickResults = [];
    
    // Test color dot click
    if (colorDots.length > 1) {
        try {
            const originalClass = colorDots[1].className;
            colorDots[1].click();
            const newClass = colorDots[1].className;
            clickResults.push(`🎨 Color click: ${originalClass !== newClass ? '✅' : '❌'}`);
        } catch (e) {
            clickResults.push(`🎨 Color click: ❌ (${e.message})`);
        }
    }
    
    // Test size button click
    if (sizeButtons.length > 1) {
        try {
            const originalClass = sizeButtons[1].className;
            sizeButtons[1].click();
            const newClass = sizeButtons[1].className;
            clickResults.push(`📏 Size click: ${originalClass !== newClass ? '✅' : '❌'}`);
        } catch (e) {
            clickResults.push(`📏 Size click: ❌ (${e.message})`);
        }
    }
    
    // Test quantity increase
    if (increaseBtn && quantityDisplay) {
        try {
            const originalQty = quantityDisplay.textContent;
            increaseBtn.click();
            const newQty = quantityDisplay.textContent;
            clickResults.push(`➕ Qty increase: ${originalQty !== newQty ? '✅' : '❌'}`);
        } catch (e) {
            clickResults.push(`➕ Qty increase: ❌ (${e.message})`);
        }
    }
    
    // Test add to cart
    if (addToCartBtn) {
        try {
            const originalText = addToCartBtn.textContent;
            addToCartBtn.click();
            setTimeout(() => {
                const newText = addToCartBtn.textContent;
                const cartBadge = document.getElementById('cartBadge');
                const cartCount = cartBadge ? cartBadge.textContent : '0';
                clickResults.push(`🛒 Add to cart: ${originalText !== newText || cartCount > '1' ? '✅' : '❌'}`);
                
                // Update test panel
                testPanel.innerHTML = `
                    <h4 style="margin:0 0 10px 0; color:#333;">🧪 Functionality Test</h4>
                    <div style="color:#666;">${results.concat(clickResults).join('<br>')}</div>
                    <button onclick="this.parentElement.remove()" style="margin-top:10px; padding:5px 10px; cursor:pointer;">Close</button>
                `;
            }, 1000);
        } catch (e) {
            clickResults.push(`🛒 Add to cart: ❌ (${e.message})`);
        }
    }
    
    // Initial display
    testPanel.innerHTML = `
        <h4 style="margin:0 0 10px 0; color:#333;">🧪 Functionality Test</h4>
        <div style="color:#666;">${results.join('<br>')}</div>
        <div style="margin-top:10px; color:#999;">Testing interactions...</div>
    `;
    
}, 2000);
