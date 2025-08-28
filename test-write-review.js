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
            
            // Add a test click handler with priority
            writeReviewBtn.addEventListener('click', function(e) {
                console.log('TEST: Write review button clicked!');
                console.log('TEST: Event:', e);

                // Check if there are other click handlers preventing this
                console.log('TEST: Default prevented:', e.defaultPrevented);

                // Test if page exists by trying to fetch it
                fetch('write-review.html')
                    .then(response => {
                        console.log('TEST: write-review.html response:', response.status);
                        if (response.ok) {
                            console.log('TEST: Page exists, attempting navigation...');
                            // Try direct navigation
                            window.location.href = 'write-review.html';
                        } else {
                            console.error('TEST: write-review.html not found');
                        }
                    })
                    .catch(error => {
                        console.error('TEST: Error checking write-review.html:', error);
                    });
            }, true); // Use capture phase to run before other handlers
            
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
