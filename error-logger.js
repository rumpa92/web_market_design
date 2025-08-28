// Error logging script to catch JavaScript errors
console.log('Error logger script loaded');

// Catch all errors
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    console.error('Message:', e.message);
    console.error('File:', e.filename);
    console.error('Line:', e.lineno);
    console.error('Column:', e.colno);
});

// Catch unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
    console.error('Promise:', e.promise);
});

// Log when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Error logger active');
});

// Log all click events for debugging
document.addEventListener('click', function(e) {
    if (e.target.id === 'writeReviewBtn' || e.target.textContent.includes('Write Review')) {
        console.log('CLICK: Write review button clicked:', e.target);
        console.log('CLICK: Event details:', e);
    }
});
