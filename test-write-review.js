// Test script to debug write review functionality
console.log('Test write review script loaded');

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, testing write review button...');
    
    setTimeout(() => {
        // Find the write review button
        const writeReviewBtn = document.getElementById('writeReviewBtn');
        console.log('Write review button found:', !!writeReviewBtn);
        
        if (writeReviewBtn) {
            console.log('Button element:', writeReviewBtn);
            console.log('Button click listeners:', getEventListeners(writeReviewBtn));
            
            // Add a test click handler to see if button is clickable
            writeReviewBtn.addEventListener('click', function(e) {
                console.log('Write review button clicked!');
                console.log('Event:', e);
                
                // Check if there are other click handlers preventing this
                console.log('Default prevented:', e.defaultPrevented);
                
                // Try direct navigation
                window.location.href = 'write-review.html';
            });
            
            // Also test if the button is visible and interactive
            const rect = writeReviewBtn.getBoundingClientRect();
            console.log('Button position:', rect);
            console.log('Button computed style:', window.getComputedStyle(writeReviewBtn));
        } else {
            console.error('Write review button not found!');
            console.log('All buttons on page:', document.querySelectorAll('button'));
        }
    }, 2000);
});

// Helper function to check event listeners (if available)
function getEventListeners(element) {
    try {
        return typeof getEventListeners !== 'undefined' ? getEventListeners(element) : 'Not available';
    } catch (e) {
        return 'Error getting listeners: ' + e.message;
    }
}
