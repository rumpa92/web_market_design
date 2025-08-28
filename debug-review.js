// Debug script for Write Review functionality
console.log('🔍 Debug script loaded for Write Review');

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 DOM loaded, starting debug...');
    
    setTimeout(() => {
        debugWriteReview();
    }, 2000); // Wait 2 seconds for all scripts to load
});

function debugWriteReview() {
    console.log('🔍 Starting Write Review debug...');
    
    // 1. Check if button exists
    const writeReviewBtn = document.getElementById('writeReviewBtn');
    console.log('🔍 Write Review button found:', !!writeReviewBtn);
    
    if (!writeReviewBtn) {
        console.error('❌ Write Review button not found!');
        
        // Check for button with class instead
        const btnByClass = document.querySelector('.write-review-btn');
        console.log('🔍 Button found by class:', !!btnByClass);
        
        // List all buttons
        const allButtons = document.querySelectorAll('button');
        console.log('🔍 All buttons on page:', allButtons.length);
        allButtons.forEach((btn, index) => {
            console.log(`🔍 Button ${index}:`, btn.id || 'no-id', btn.className, btn.textContent?.trim());
        });
        
        return;
    }
    
    // 2. Check if event listeners are attached
    console.log('🔍 Button element:', writeReviewBtn);
    console.log('🔍 Button onclick:', writeReviewBtn.onclick);
    
    // 3. Test manual click
    console.log('🔍 Testing manual click...');
    writeReviewBtn.addEventListener('click', function() {
        console.log('✅ Manual click event fired!');
    });
    
    // 4. Check if showReviewModal function exists
    console.log('🔍 showReviewModal function exists:', typeof showReviewModal);
    
    // 5. Test showReviewModal directly
    if (typeof showReviewModal === 'function') {
        console.log('🔍 Testing showReviewModal directly...');
        try {
            // Add a test button to trigger modal
            const testBtn = document.createElement('button');
            testBtn.textContent = 'TEST REVIEW MODAL';
            testBtn.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                z-index: 10000;
                background: red;
                color: white;
                padding: 10px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            `;
            testBtn.onclick = () => {
                console.log('🔍 Test button clicked, calling showReviewModal...');
                showReviewModal();
            };
            document.body.appendChild(testBtn);
            console.log('✅ Test button added to page');
        } catch (e) {
            console.error('❌ Error testing showReviewModal:', e);
        }
    }
    
    // 6. Check currentProduct data
    console.log('🔍 currentProduct data:', typeof currentProduct !== 'undefined' ? currentProduct : 'undefined');
    
    // 7. Force click test
    console.log('🔍 Force clicking Write Review button in 3 seconds...');
    setTimeout(() => {
        console.log('🔍 Force clicking now...');
        writeReviewBtn.click();
    }, 3000);
}

// Global function to test from console
window.debugReview = debugWriteReview;
window.testReviewModal = function() {
    if (typeof showReviewModal === 'function') {
        console.log('🔍 Manual test: calling showReviewModal...');
        showReviewModal();
    } else {
        console.error('❌ showReviewModal function not available');
    }
};

console.log('🔍 Debug functions available: debugReview(), testReviewModal()');
