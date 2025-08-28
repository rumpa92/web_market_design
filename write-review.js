// Write Review Page JavaScript

// Product data for the review
let currentProduct = {
    id: 1,
    title: 'Churidar',
    brand: 'Fashion Hub',
    currentPrice: 299,
    images: {
        main: 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F9915d20cfed848ec961a57e0b81de98d?format=webp&width=800'
    },
    selectedColor: 'black',
    selectedSize: 'M'
};

// Review form state
let selectedRating = 0;
let selectedFit = 'true-to-size';
let uploadedFiles = [];

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Write Review page loaded');
    
    try {
        initializePageData();
        setupEventListeners();
        setupStarRating();
        setupCharacterCounter();
        setupFitFeedback();
        setupFileUpload();
        setupFormValidation();
        
        console.log('Write Review page initialized successfully');
    } catch (error) {
        console.error('Error initializing Write Review page:', error);
        showNotification('Error loading page. Please try again.', 'error');
    }
});

// Initialize page data from URL parameters or localStorage
function initializePageData() {
    // Get product data from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const productData = urlParams.get('product');
    
    if (productData) {
        try {
            const decodedData = JSON.parse(decodeURIComponent(productData));
            currentProduct = { ...currentProduct, ...decodedData };
        } catch (e) {
            console.log('Using default product data');
        }
    } else {
        // Try to get product data from localStorage (fallback)
        const storedProduct = localStorage.getItem('reviewProduct');
        if (storedProduct) {
            try {
                currentProduct = { ...currentProduct, ...JSON.parse(storedProduct) };
            } catch (e) {
                console.log('Using default product data');
            }
        }
    }
    
    // Update page with product data
    updateProductDisplay();
}

// Update the product display with current product data
function updateProductDisplay() {
    const productThumbnail = document.getElementById('productThumbnail');
    const productTitle = document.getElementById('productTitle');
    const selectedColor = document.getElementById('selectedColor');
    const selectedSize = document.getElementById('selectedSize');
    
    if (productThumbnail) {
        productThumbnail.src = currentProduct.images.main;
        productThumbnail.alt = currentProduct.title;
    }
    
    if (productTitle) {
        productTitle.textContent = currentProduct.title;
    }
    
    if (selectedColor) {
        selectedColor.textContent = currentProduct.selectedColor;
    }
    
    if (selectedSize) {
        selectedSize.textContent = currentProduct.selectedSize;
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Back button
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', handleBackNavigation);
    }
    
    // Cancel button
    const cancelButton = document.getElementById('cancelButton');
    if (cancelButton) {
        cancelButton.addEventListener('click', handleCancelReview);
    }
    
    // Form submission
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', handleFormSubmission);
    }
    
    // Header cart button
    const headerCartBtn = document.getElementById('headerCartBtn');
    if (headerCartBtn) {
        headerCartBtn.addEventListener('click', () => {
            showNotification('Cart functionality', 'info');
        });
    }
    
    // Profile functionality
    setupProfileDropdown();
}

// Setup star rating functionality
function setupStarRating() {
    const stars = document.querySelectorAll('.interactive-star');
    const ratingText = document.getElementById('ratingText');
    
    if (stars.length === 0) {
        console.warn('No rating stars found');
        return;
    }
    
    stars.forEach((star, index) => {
        // Make stars focusable and accessible
        star.setAttribute('tabindex', '0');
        star.setAttribute('role', 'button');
        star.setAttribute('aria-label', `Rate ${parseInt(star.dataset.rating)} star${parseInt(star.dataset.rating) > 1 ? 's' : ''}`);
        
        // Click event
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.rating);
            updateStarDisplay(stars, selectedRating);
            updateRatingText(ratingText, selectedRating);
        });
        
        // Hover events
        star.addEventListener('mouseover', () => {
            const hoverRating = parseInt(star.dataset.rating);
            updateStarDisplay(stars, hoverRating);
        });
        
        star.addEventListener('mouseleave', () => {
            updateStarDisplay(stars, selectedRating);
        });
        
        // Keyboard navigation
        star.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                star.click();
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                e.preventDefault();
                const nextStar = stars[Math.min(index + 1, stars.length - 1)];
                nextStar.focus();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                e.preventDefault();
                const prevStar = stars[Math.max(index - 1, 0)];
                prevStar.focus();
            }
        });
    });
}

// Update star display
function updateStarDisplay(stars, rating) {
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// Update rating text
function updateRatingText(ratingText, rating) {
    if (!ratingText) return;
    
    const ratingTexts = {
        0: 'Select a rating',
        1: 'Poor - 1 star',
        2: 'Fair - 2 stars',
        3: 'Good - 3 stars',
        4: 'Very Good - 4 stars',
        5: 'Excellent - 5 stars'
    };
    
    ratingText.textContent = ratingTexts[rating] || 'Select a rating';
}

// Setup character counter for review description
function setupCharacterCounter() {
    const reviewDescription = document.getElementById('reviewDescription');
    const charCount = document.getElementById('charCount');
    
    if (!reviewDescription || !charCount) {
        console.warn('Character counter elements not found');
        return;
    }
    
    reviewDescription.addEventListener('input', () => {
        const count = reviewDescription.value.length;
        charCount.textContent = count;
        
        // Update counter styling based on character count
        charCount.className = '';
        if (count > 400) {
            charCount.classList.add('danger');
        } else if (count > 300) {
            charCount.classList.add('warning');
        }
    });
}

// Setup fit feedback buttons
function setupFitFeedback() {
    const fitButtons = document.querySelectorAll('.fit-button');
    
    if (fitButtons.length === 0) {
        console.warn('No fit feedback buttons found');
        return;
    }
    
    fitButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            fitButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Update selected fit
            selectedFit = button.dataset.fit;
            
            // Show feedback
            const fitTexts = {
                'too-small': 'Too Small',
                'true-to-size': 'True to Size',
                'too-large': 'Too Large'
            };
            
            showNotification(`Fit feedback: ${fitTexts[selectedFit]}`, 'info');
        });
    });
}

// Setup file upload functionality
function setupFileUpload() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    const uploadedFilesList = document.getElementById('uploadedFilesList');
    
    if (!uploadZone || !fileInput || !uploadedFilesList) {
        console.warn('File upload elements not found');
        return;
    }
    
    // Click to upload
    uploadZone.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Drag and drop
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });
    
    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragover');
    });
    
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        handleFileUpload(e.dataTransfer.files, uploadedFilesList);
    });
    
    // File input change
    fileInput.addEventListener('change', (e) => {
        handleFileUpload(e.target.files, uploadedFilesList);
    });
}

// Handle file upload
function handleFileUpload(files, container) {
    Array.from(files).forEach(file => {
        // Validate file
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            showNotification('File size must be less than 10MB', 'error');
            return;
        }
        
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
            showNotification('Only image and video files are allowed', 'error');
            return;
        }
        
        // Add to uploaded files
        uploadedFiles.push(file);
        
        // Create file display
        createFileDisplay(file, container);
    });
    
    showNotification(`${files.length} file(s) added`, 'success');
}

// Create file display element
function createFileDisplay(file, container) {
    const fileItem = document.createElement('div');
    fileItem.className = 'uploaded-file-item';
    
    const fileName = file.name.length > 30 ? file.name.substring(0, 30) + '...' : file.name;
    
    fileItem.innerHTML = `
        <div class="file-info">
            <i class="fas ${file.type.startsWith('image/') ? 'fa-image' : 'fa-video'}"></i>
            <span class="file-name">${fileName}</span>
        </div>
        <button type="button" class="remove-file-button" onclick="removeFile('${file.name}', this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(fileItem);
}

// Remove uploaded file
window.removeFile = function(fileName, buttonElement) {
    // Remove from uploaded files array
    uploadedFiles = uploadedFiles.filter(file => file.name !== fileName);
    
    // Remove from display
    buttonElement.parentElement.remove();
    
    showNotification('File removed', 'info');
};

// Setup form validation
function setupFormValidation() {
    const form = document.getElementById('reviewForm');
    const submitButton = document.getElementById('submitButton');
    
    if (!form || !submitButton) return;
    
    // Real-time validation
    form.addEventListener('input', () => {
        const isValid = validateForm(false);
        submitButton.disabled = !isValid;
    });
}

// Validate form
function validateForm(showErrors = true) {
    const reviewDescription = document.getElementById('reviewDescription');
    let isValid = true;
    
    // Check rating
    if (selectedRating === 0) {
        if (showErrors) {
            showNotification('Please select a rating', 'error');
        }
        isValid = false;
    }
    
    // Check description
    if (!reviewDescription || reviewDescription.value.trim().length === 0) {
        if (showErrors) {
            showNotification('Please write a review description', 'error');
        }
        isValid = false;
    }
    
    return isValid;
}

// Handle form submission
function handleFormSubmission(e) {
    e.preventDefault();
    
    if (!validateForm(true)) {
        return;
    }
    
    const reviewTitle = document.getElementById('reviewTitle').value.trim();
    const reviewDescription = document.getElementById('reviewDescription').value.trim();
    
    // Disable form while submitting
    const form = document.getElementById('reviewForm');
    const submitButton = document.getElementById('submitButton');
    
    form.classList.add('loading');
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    
    // Simulate submission delay
    setTimeout(() => {
        // Create review data
        const reviewData = {
            id: Date.now(),
            productId: currentProduct.id,
            productTitle: currentProduct.title,
            productColor: currentProduct.selectedColor,
            productSize: currentProduct.selectedSize,
            rating: selectedRating,
            title: reviewTitle || 'Customer Review',
            description: reviewDescription,
            fit: selectedFit,
            files: uploadedFiles.map(f => f.name), // In real app, would upload files
            date: new Date().toLocaleDateString(),
            verified: true,
            approved: false
        };
        
        // Store review (in real app, would send to server)
        submitReview(reviewData);
        
        // Show success and redirect
        showNotification('Review submitted successfully!', 'success');
        
        setTimeout(() => {
            // Redirect back to product page
            window.location.href = `product-detail.html?product=${encodeURIComponent(JSON.stringify(currentProduct))}`;
        }, 2000);
        
    }, 1500);
}

// Submit review (store locally for demo)
function submitReview(reviewData) {
    try {
        let reviews = JSON.parse(localStorage.getItem('productReviews') || '[]');
        reviews.push(reviewData);
        localStorage.setItem('productReviews', JSON.stringify(reviews));
        
        console.log('Review submitted:', reviewData);
    } catch (error) {
        console.error('Error submitting review:', error);
        showNotification('Error submitting review. Please try again.', 'error');
    }
}

// Handle back navigation
function handleBackNavigation() {
    // Ask for confirmation if form has data
    const hasData = selectedRating > 0 || 
                   document.getElementById('reviewTitle').value.trim() ||
                   document.getElementById('reviewDescription').value.trim() ||
                   uploadedFiles.length > 0;
    
    if (hasData) {
        if (confirm('Are you sure you want to go back? Your review will be lost.')) {
            navigateBack();
        }
    } else {
        navigateBack();
    }
}

// Handle cancel review
function handleCancelReview() {
    handleBackNavigation();
}

// Navigate back to product page
function navigateBack() {
    // Try to go back in history first
    if (document.referrer && document.referrer.includes('product-detail')) {
        window.history.back();
    } else {
        // Fallback to product detail page
        window.location.href = 'product-detail.html';
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10001;
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

// Profile dropdown functionality
function setupProfileDropdown() {
    const profileTrigger = document.getElementById('profileTrigger');
    const profileDropdown = document.getElementById('profileDropdown');
    
    if (!profileTrigger || !profileDropdown) return;
    
    profileTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('show');
    });
    
    document.addEventListener('click', (e) => {
        if (!profileTrigger.contains(e.target) && !profileDropdown.contains(e.target)) {
            profileDropdown.classList.remove('show');
        }
    });
    
    // Handle dropdown items
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', () => {
            const itemId = item.id;
            
            switch(itemId) {
                case 'myProfile':
                    showNotification('Opening My Profile...', 'info');
                    break;
                case 'myOrders':
                    showNotification('Opening My Orders...', 'info');
                    break;
                case 'accountSettings':
                    showNotification('Opening Account Settings...', 'info');
                    break;
                case 'signInOut':
                    showNotification('Sign out clicked', 'info');
                    break;
                default:
                    break;
            }
            
            profileDropdown.classList.remove('show');
        });
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape key to cancel
    if (e.key === 'Escape') {
        handleCancelReview();
    }
    
    // Ctrl/Cmd + Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        const form = document.getElementById('reviewForm');
        if (form && validateForm(false)) {
            form.dispatchEvent(new Event('submit'));
        }
    }
});

// Initialize cart count
function updateCartCount() {
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
        const cart = JSON.parse(localStorage.getItem('fashionCart') || '[]');
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        cartBadge.textContent = count;
    }
}

// Update cart count on page load
setTimeout(updateCartCount, 100);
