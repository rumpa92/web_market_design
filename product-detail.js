// Fashion Product Detail Page JavaScript

// Initialize product detail page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Product detail page DOMContentLoaded');

    try {
        initializeProductDetail();
        loadProductData();
        setupProductEventListeners();
        setupRelatedProductsInteraction();
        setupProfileDropdown();
        initializeCartModal();

        console.log('Product detail page initialized successfully');
    } catch (error) {
        console.error('Error initializing product detail page:', error);
    }
});

// Default product data (fallback)
let defaultProduct = {
    id: 1,
    title: 'Churidar',
    brand: 'Fashion Hub',
    currentPrice: 299,
    originalPrice: 399,
    discount: 25,
    rating: 4.8,
    reviewCount: 384,
    image: 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F9915d20cfed848ec961a57e0b81de98d?format=webp&width=800',
    colors: ['black', 'blue', 'red', 'green'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
};

// Current product data (will be populated from navigation)
let currentProduct = {
    selectedColor: 'black',
    selectedSize: 'M',
    quantity: 1,
    inStock: true,
    stockCount: 15
};

function initializeProductDetail() {
    // Check if product data is passed from main page via sessionStorage
    const selectedProduct = sessionStorage.getItem('selectedProduct');

    if (selectedProduct) {
        try {
            const productData = JSON.parse(selectedProduct);
            // Merge with default structure
            currentProduct = {
                ...defaultProduct,
                ...productData,
                selectedColor: 'black',
                selectedSize: 'M',
                quantity: 1,
                inStock: true,
                stockCount: 15,
                images: generateProductImages(productData.image || defaultProduct.image)
            };
            console.log('Loaded product from navigation:', currentProduct.title);
        } catch (e) {
            console.log('Error parsing product data, using default:', e);
            currentProduct = { ...defaultProduct, selectedColor: 'black', selectedSize: 'M', quantity: 1, inStock: true, stockCount: 15, images: generateProductImages(defaultProduct.image) };
        }
    } else {
        // Fallback to default product
        currentProduct = { ...defaultProduct, selectedColor: 'black', selectedSize: 'M', quantity: 1, inStock: true, stockCount: 15, images: generateProductImages(defaultProduct.image) };
        console.log('No product data found, using default product');
    }
}

function generateProductImages(mainImage) {
    // Generate multiple views for the product gallery
    // In a real app, these would be different actual images
    return {
        main: mainImage,
        side: mainImage,
        back: mainImage,
        detail: mainImage,
        fabric: mainImage
    };
}

function generateProductDescription(productTitle) {
    const title = productTitle.toLowerCase();

    if (title.includes('anarkali')) {
        return 'Experience the grace of traditional Indian fashion with this stunning Anarkali gown. Featuring intricate embroidery and flowing silhouette, this outfit is perfect for weddings, festivals, and special celebrations. Crafted with premium fabrics for comfort and elegance.';
    } else if (title.includes('churidar')) {
        return 'Experience the elegance of traditional Indian fashion with this beautiful Churidar set. Crafted with premium quality fabrics and intricate embroidery work, this outfit is perfect for special occasions and festive celebrations.';
    } else if (title.includes('shirt') || title.includes('top')) {
        return 'Elevate your everyday style with this versatile and comfortable piece. Made from high-quality materials with attention to detail, this top offers both style and comfort for any occasion.';
    } else if (title.includes('dress')) {
        return 'Make a statement with this elegant dress that combines modern style with timeless appeal. Perfect for both casual and formal occasions, featuring quality craftsmanship and comfortable fit.';
    } else if (title.includes('lehenga')) {
        return 'Embrace the magnificence of traditional Indian wear with this exquisite Lehenga set. Featuring rich fabrics, detailed embellishments, and classic silhouette, perfect for weddings and grand celebrations.';
    } else if (title.includes('saree')) {
        return 'Celebrate the timeless beauty of the traditional saree. This elegant piece showcases rich fabric and classic draping style, perfect for cultural events and special occasions.';
    } else {
        return 'Experience exceptional quality and style with this carefully crafted piece. Made with premium materials and attention to detail, this item combines comfort, durability, and fashion-forward design for the modern wardrobe.';
    }
}

function loadProductData() {
    // Update page title
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        pageTitle.textContent = `${currentProduct.title} - StyleHub`;
    }

    // Update product information
    document.getElementById('productTitle').textContent = currentProduct.title;
    document.getElementById('currentPrice').textContent = `$${currentProduct.currentPrice}`;

    // Update rating and review count
    const ratingText = document.querySelector('.rating-text');
    if (ratingText) {
        ratingText.textContent = `${currentProduct.rating} (${currentProduct.reviewCount} Reviews)`;
    }

    // Update cart badge
    const cartBadge = document.getElementById('cartBadge');
    const cartCount = getCartItemCount();
    cartBadge.textContent = cartCount;

    // Load main image
    const mainImage = document.getElementById('mainProductImage');
    mainImage.src = currentProduct.images.main;
    mainImage.alt = currentProduct.title;

    // Load thumbnail images
    const thumbnails = document.querySelectorAll('.thumbnail-item img');
    const imageKeys = ['main', 'side', 'back', 'detail', 'fabric'];
    thumbnails.forEach((thumb, index) => {
        if (currentProduct.images[imageKeys[index]]) {
            thumb.src = currentProduct.images[imageKeys[index]];
        }
    });

    // Update quantity display
    document.getElementById('quantityDisplay').textContent = currentProduct.quantity;

    // Update product description dynamically
    const productDescription = document.getElementById('productDescription');
    if (productDescription) {
        productDescription.textContent = generateProductDescription(currentProduct.title);
    }

    console.log('Product data loaded:', currentProduct.title, `$${currentProduct.currentPrice}`);
}

function setupProductEventListeners() {
    console.log('Setting up product event listeners...');

    try {
        // Product back button (above image)
        const productBackBtn = document.getElementById('productBackBtn');
        if (productBackBtn) {
            productBackBtn.addEventListener('click', () => {
                // Navigate to home page
                window.location.href = 'index.html';
            });
            console.log('Product back button listener added');
        }

        // Header icons
        setupHeaderIcons();

        // Gallery functionality
        setupGallery();

        // Color selection
        console.log('Setting up color selection...');
        setupColorSelection();

        // Size selection
        console.log('Setting up size selection...');
        setupSizeSelection();

        // Quantity controls
        console.log('Setting up quantity controls...');
        setupQuantityControls();

        // Add to cart
        console.log('Setting up add to cart...');
        setupAddToCart();

        // Write review
        setupWriteReview();

        // Tab navigation
        setupTabNavigation();

        // Wishlist functionality
        setupWishlist();

        console.log('All product event listeners set up successfully');

        // Remove icon now handled by inline onclick for reliability

    } catch (error) {
        console.error('Error setting up product event listeners:', error);
    }
}

function setupHeaderIcons() {
    // Search button
    document.getElementById('searchBtn').addEventListener('click', () => {
        showNotification('Search functionality - Opening search...', 'info');
    });
    
    // Header cart button
    document.getElementById('headerCartBtn').addEventListener('click', () => {
        showCartSummary();
    });
}

function setupGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail-item');
    const mainImage = document.getElementById('mainProductImage');
    
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            thumbnail.classList.add('active');
            
            // Update main image
            const imageKeys = ['main', 'side', 'back', 'detail', 'fabric'];
            const imageKey = imageKeys[index];
            if (currentProduct.images[imageKey]) {
                mainImage.src = currentProduct.images[imageKey];
            }
        });
    });
}

function setupColorSelection() {
    const colorDots = document.querySelectorAll('.color-dot');
    console.log('Color dots found:', colorDots.length);

    if (colorDots.length === 0) {
        console.warn('No color dots found! Check selector: .color-dot');
        return;
    }

    colorDots.forEach((dot, index) => {
        console.log(`Setting up color dot ${index}:`, dot);
        dot.addEventListener('click', () => {
            // Add click animation
            dot.style.transform = 'scale(0.9)';
            setTimeout(() => {
                dot.style.transform = '';
            }, 150);

            // Remove active class from all dots
            colorDots.forEach(d => d.classList.remove('active'));

            // Add active class to clicked dot
            dot.classList.add('active');

            // Update selected color
            currentProduct.selectedColor = dot.dataset.color;

            showNotification(`Selected color: ${currentProduct.selectedColor}`, 'success');
        });

        // Add keyboard support
        dot.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                dot.click();
            }
        });
    });
}

function setupSizeSelection() {
    const sizeButtons = document.querySelectorAll('.size-btn');
    console.log('Size buttons found:', sizeButtons.length);

    if (sizeButtons.length === 0) {
        console.warn('No size buttons found! Check selector: .size-btn');
        return;
    }

    sizeButtons.forEach((button, index) => {
        console.log(`Setting up size button ${index}:`, button);
        button.addEventListener('click', () => {
            // Add click animation
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);

            // Remove active class from all buttons
            sizeButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Update selected size
            currentProduct.selectedSize = button.dataset.size;

            showNotification(`Selected size: ${currentProduct.selectedSize}`, 'success');
        });
    });
}

function setupQuantityControls() {
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');
    const quantityDisplay = document.getElementById('quantityDisplay');
    const removeIcon = document.getElementById('removeIcon');

    console.log('Quantity controls found:', {
        decreaseBtn: !!decreaseBtn,
        increaseBtn: !!increaseBtn,
        quantityDisplay: !!quantityDisplay,
        removeIcon: !!removeIcon
    });

    // Debug: Check if element exists in DOM
    console.log('All elements with removeIcon:', document.querySelectorAll('#removeIcon'));
    console.log('All elements with remove-icon class:', document.querySelectorAll('.remove-icon'));

    if (!decreaseBtn || !increaseBtn || !quantityDisplay) {
        console.warn('Some quantity controls not found!');
        return;
    }

    decreaseBtn.addEventListener('click', () => {
        // Add click animation
        decreaseBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            decreaseBtn.style.transform = '';
        }, 150);

        if (currentProduct.quantity > 1) {
            currentProduct.quantity--;
            quantityDisplay.textContent = currentProduct.quantity;
            quantityDisplay.style.transform = 'scale(1.1)';
            setTimeout(() => {
                quantityDisplay.style.transform = '';
            }, 200);
        } else {
            showNotification('Minimum quantity is 1', 'info');
        }
    });

    increaseBtn.addEventListener('click', () => {
        // Add click animation
        increaseBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            increaseBtn.style.transform = '';
        }, 150);

        if (currentProduct.quantity < 10) { // Max quantity limit
            currentProduct.quantity++;
            quantityDisplay.textContent = currentProduct.quantity;
            quantityDisplay.style.transform = 'scale(1.1)';
            setTimeout(() => {
                quantityDisplay.style.transform = '';
            }, 200);
        } else {
            showNotification('Maximum quantity is 10', 'info');
        }
    });

    // Remove icon functionality - now handled by inline onclick
}

function setupAddToCart() {
    const addToCartBtn = document.getElementById('addToCartBtn');
    console.log('Add to cart button found:', !!addToCartBtn);

    if (!addToCartBtn) {
        console.warn('Add to cart button not found! Check ID: addToCartBtn');
        return;
    }

    addToCartBtn.addEventListener('click', () => {
        // Disable button to prevent double clicks
        addToCartBtn.disabled = true;

        // Animation effect
        addToCartBtn.style.transform = 'scale(0.95)';
        addToCartBtn.textContent = 'Adding...';
        addToCartBtn.style.opacity = '0.8';

        setTimeout(() => {
            addToCart(currentProduct);
            updateCartBadge();
            showNotification(`${currentProduct.title} (${currentProduct.selectedColor}, ${currentProduct.selectedSize}) added to cart!`, 'success');

            // Success animation
            addToCartBtn.textContent = 'Added!';
            addToCartBtn.style.backgroundColor = '#4CAF50';
            addToCartBtn.style.transform = 'scale(1)';

            setTimeout(() => {
                // Reset button
                addToCartBtn.style.transform = '';
                addToCartBtn.style.opacity = '';
                addToCartBtn.style.backgroundColor = '';
                addToCartBtn.textContent = 'Add to Cart';
                addToCartBtn.disabled = false;
            }, 1000);
        }, 500);
    });
}

function setupWriteReview() {
    const writeReviewBtn = document.getElementById('writeReviewBtn');

    if (!writeReviewBtn) {
        console.warn('Write review button not found! Check ID: writeReviewBtn');
        return;
    }

    console.log('Write review button found and event listener being added');

    writeReviewBtn.addEventListener('click', (e) => {
        console.log('Write review button clicked!');

        try {
            // Animation effect
            writeReviewBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                writeReviewBtn.style.transform = '';
            }, 150);

            // Check if currentProduct exists
            if (typeof currentProduct === 'undefined' || !currentProduct) {
                console.error('currentProduct is not defined!');
                showNotification('Error: Product data not available. Please refresh the page.', 'error');
                return;
            }

            console.log('Current product data:', currentProduct);

            // Store current product data for the review page
            const productDataForReview = {
                id: currentProduct.id || Date.now(),
                title: currentProduct.title || 'Unknown Product',
                brand: currentProduct.brand || 'StyleHub',
                currentPrice: currentProduct.currentPrice || 0,
                images: currentProduct.images || { main: 'https://via.placeholder.com/300x300' },
                selectedColor: currentProduct.selectedColor || 'default',
                selectedSize: currentProduct.selectedSize || 'M'
            };

            console.log('Product data for review:', productDataForReview);

            // Store in localStorage as backup
            localStorage.setItem('reviewProduct', JSON.stringify(productDataForReview));
            console.log('Product data saved to localStorage');

            // Navigate to write review page with product data
            const productParam = encodeURIComponent(JSON.stringify(productDataForReview));
            const reviewUrl = `write-review.html?product=${productParam}`;

            console.log('Navigating to:', reviewUrl);
            showNotification('Opening write review page...', 'info');

            // Add small delay to show notification
            setTimeout(() => {
                window.location.href = reviewUrl;
            }, 500);

        } catch (error) {
            console.error('Error in write review functionality:', error);
            showNotification('Error opening write review page. Please try again.', 'error');
        }
    });

    console.log('Write review event listener added successfully');
}

function showReviewModal() {
    // Create review modal
    const modal = document.createElement('div');
    modal.className = 'review-modal';
    modal.innerHTML = `
        <div class="review-modal-content">
            <div class="review-modal-header">
                <h2>Write a Review</h2>
                <button class="close-review-modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="review-modal-body">
                <!-- Product Info Section -->
                <div class="review-product-info">
                    <img src="${currentProduct.images.main}" alt="${currentProduct.title}" class="review-product-thumbnail">
                    <div class="review-product-details">
                        <h3 class="review-product-title">${currentProduct.title}</h3>
                        <div class="review-product-options">
                            <span class="review-selected-color">Color: <span class="color-value">${currentProduct.selectedColor}</span></span>
                            <span class="review-selected-size">Size: <span class="size-value">${currentProduct.selectedSize}</span></span>
                        </div>
                    </div>
                </div>

                <form class="review-form" id="reviewForm">
                    <!-- Rating Section -->
                    <div class="review-input-group">
                        <label class="review-label">Your Rating <span class="required">*</span></label>
                        <div class="star-rating-input">
                            <span class="star interactive-star" data-rating="1">⭐</span>
                            <span class="star interactive-star" data-rating="2">⭐</span>
                            <span class="star interactive-star" data-rating="3">⭐</span>
                            <span class="star interactive-star" data-rating="4">⭐</span>
                            <span class="star interactive-star" data-rating="5">⭐</span>
                        </div>
                    </div>

                    <!-- Review Title -->
                    <div class="review-input-group">
                        <label for="reviewTitle" class="review-label">Review Title <span class="optional">(optional)</span></label>
                        <input type="text" id="reviewTitle" class="review-input" placeholder="Perfect fit and stylish" maxlength="100">
                    </div>

                    <!-- Review Description -->
                    <div class="review-input-group">
                        <label for="reviewText" class="review-label">Review Description <span class="required">*</span></label>
                        <textarea id="reviewText" class="review-textarea" rows="4" placeholder="Share your thoughts about fit, quality, comfort, and style…" maxlength="500"></textarea>
                        <div class="character-count">
                            <span id="charCount">0</span>/500 characters
                        </div>
                    </div>

                    <!-- Fit Feedback -->
                    <div class="review-input-group">
                        <label class="review-label">Fit Feedback <span class="optional">(optional)</span></label>
                        <div class="fit-feedback-buttons">
                            <button type="button" class="fit-btn" data-fit="too-small">Too Small</button>
                            <button type="button" class="fit-btn active" data-fit="true-to-size">True to Size</button>
                            <button type="button" class="fit-btn" data-fit="too-large">Too Large</button>
                        </div>
                    </div>

                    <!-- Photo/Video Upload -->
                    <div class="review-input-group">
                        <label class="review-label">Add Photos/Videos <span class="optional">(optional)</span></label>
                        <div class="upload-section">
                            <div class="upload-dropzone" id="uploadDropzone">
                                <i class="fas fa-cloud-upload-alt upload-icon"></i>
                                <p class="upload-text">Drop files here or click to upload</p>
                                <p class="upload-subtext">Supports: JPG, PNG, MP4 (Max 10MB)</p>
                                <input type="file" id="fileInput" class="file-input" multiple accept="image/*,video/*">
                            </div>
                            <div class="uploaded-files" id="uploadedFiles"></div>
                        </div>
                    </div>

                    <!-- Review Actions -->
                    <div class="review-actions">
                        <button type="button" class="cancel-review-btn">Cancel</button>
                        <button type="submit" class="submit-review-btn">Submit Review</button>
                    </div>

                    <!-- Approval Note -->
                    <div class="review-note">
                        <i class="fas fa-info-circle"></i>
                        <span>Your review will be visible after approval.</span>
                    </div>
                </form>
            </div>
        </div>
    `;

    // Style the modal
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
        overflow-y: auto;
        padding: 20px;
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Animate in
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);

    // Setup modal interactions
    setupReviewModalListeners(modal);

    showNotification('Write your review', 'info');
}

function setupReviewModalListeners(modal) {
    const closeBtn = modal.querySelector('.close-review-modal');
    const cancelBtn = modal.querySelector('.cancel-review-btn');
    const submitBtn = modal.querySelector('.submit-review-btn');
    const stars = modal.querySelectorAll('.interactive-star');
    const form = modal.querySelector('#reviewForm');
    const fitButtons = modal.querySelectorAll('.fit-btn');
    const uploadDropzone = modal.querySelector('#uploadDropzone');
    const fileInput = modal.querySelector('#fileInput');
    const reviewText = modal.querySelector('#reviewText');
    const charCount = modal.querySelector('#charCount');

    let selectedRating = 0;
    let selectedFit = 'true-to-size';
    let uploadedFiles = [];

    // Close modal events
    closeBtn.addEventListener('click', () => closeReviewModal(modal));
    cancelBtn.addEventListener('click', () => closeReviewModal(modal));

    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeReviewModal(modal);
        }
    });

    // Prevent modal content click from closing modal
    modal.querySelector('.review-modal-content').addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Keyboard support
    document.addEventListener('keydown', function handleEscape(e) {
        if (e.key === 'Escape') {
            closeReviewModal(modal);
            document.removeEventListener('keydown', handleEscape);
        }
    });

    // Focus management
    setTimeout(() => {
        const firstStar = modal.querySelector('.interactive-star');
        if (firstStar) {
            firstStar.focus();
        }
    }, 100);

    // Star rating
    stars.forEach((star, index) => {
        // Make stars focusable
        star.setAttribute('tabindex', '0');
        star.setAttribute('role', 'button');
        star.setAttribute('aria-label', `Rate ${parseInt(star.dataset.rating)} star${parseInt(star.dataset.rating) > 1 ? 's' : ''}`);

        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.rating);
            updateStarRating(stars, selectedRating);
            showNotification(`Rated ${selectedRating} star${selectedRating > 1 ? 's' : ''}`, 'info');
        });

        star.addEventListener('mouseover', () => {
            const hoverRating = parseInt(star.dataset.rating);
            updateStarRating(stars, hoverRating);
        });

        star.addEventListener('mouseleave', () => {
            updateStarRating(stars, selectedRating);
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

    // Character count for review text
    reviewText.addEventListener('input', () => {
        const count = reviewText.value.length;
        charCount.textContent = count;

        if (count > 400) {
            charCount.style.color = '#f44336';
        } else if (count > 300) {
            charCount.style.color = '#ff9800';
        } else {
            charCount.style.color = '#666';
        }
    });

    // Fit feedback buttons
    fitButtons.forEach(button => {
        button.addEventListener('click', () => {
            fitButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            selectedFit = button.dataset.fit;
        });
    });

    // File upload functionality
    uploadDropzone.addEventListener('click', () => {
        fileInput.click();
    });

    uploadDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadDropzone.classList.add('dragover');
    });

    uploadDropzone.addEventListener('dragleave', () => {
        uploadDropzone.classList.remove('dragover');
    });

    uploadDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadDropzone.classList.remove('dragover');
        handleFileUpload(e.dataTransfer.files, modal);
    });

    fileInput.addEventListener('change', (e) => {
        handleFileUpload(e.target.files, modal);
    });

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = modal.querySelector('#reviewTitle').value.trim();
        const text = modal.querySelector('#reviewText').value.trim();

        if (!selectedRating) {
            showNotification('Please select a rating', 'error');
            return;
        }

        if (!text) {
            showNotification('Please write a review description', 'error');
            return;
        }

        // Submit review
        submitReview({
            rating: selectedRating,
            title: title || 'Customer Review',
            text: text,
            product: currentProduct.title,
            color: currentProduct.selectedColor,
            size: currentProduct.selectedSize,
            fit: selectedFit,
            files: uploadedFiles
        });

        closeReviewModal(modal);
    });

    // Helper function to handle file uploads
    function handleFileUpload(files, modal) {
        const uploadedFilesContainer = modal.querySelector('#uploadedFiles');

        Array.from(files).forEach(file => {
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                showNotification('File size must be less than 10MB', 'error');
                return;
            }

            if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
                showNotification('Only image and video files are allowed', 'error');
                return;
            }

            uploadedFiles.push(file);

            // Create file preview
            const fileItem = document.createElement('div');
            fileItem.className = 'uploaded-file-item';

            const fileName = file.name.length > 20 ? file.name.substring(0, 20) + '...' : file.name;

            fileItem.innerHTML = `
                <div class="file-info">
                    <i class="fas ${file.type.startsWith('image/') ? 'fa-image' : 'fa-video'}"></i>
                    <span class="file-name">${fileName}</span>
                </div>
                <button type="button" class="remove-file-btn" onclick="removeUploadedFile(this, '${file.name}')">
                    <i class="fas fa-times"></i>
                </button>
            `;

            uploadedFilesContainer.appendChild(fileItem);
        });

        showNotification(`${files.length} file(s) added`, 'success');
    }

    // Make removeUploadedFile function available globally
    window.removeUploadedFile = function(button, fileName) {
        uploadedFiles = uploadedFiles.filter(file => file.name !== fileName);
        button.parentElement.remove();
        showNotification('File removed', 'info');
    };
}

function updateStarRating(stars, rating) {
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function submitReview(reviewData) {
    // In a real app, this would submit to a server
    showNotification('Thank you for your review! It will be visible after approval.', 'success');

    // Store review locally for demo
    let reviews = JSON.parse(localStorage.getItem('productReviews') || '[]');
    reviews.push({
        ...reviewData,
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        verified: true,
        approved: false, // Reviews need approval
        helpful: 0,
        userName: 'You'
    });
    localStorage.setItem('productReviews', JSON.stringify(reviews));

    // Show detailed success message
    setTimeout(() => {
        showNotification(`Review submitted for ${reviewData.product}!\n- Rating: ${reviewData.rating} stars\n- Fit: ${formatFitFeedback(reviewData.fit)}`, 'success');
    }, 1000);
}

function formatFitFeedback(fit) {
    const fitMap = {
        'too-small': 'Too Small',
        'true-to-size': 'True to Size',
        'too-large': 'Too Large'
    };
    return fitMap[fit] || 'True to Size';
}

function closeReviewModal(modal) {
    modal.style.opacity = '0';
    document.body.style.overflow = '';
    setTimeout(() => {
        if (document.body.contains(modal)) {
            document.body.removeChild(modal);
        }
    }, 300);
}

function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked button and corresponding panel
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

function setupWishlist() {
    const wishlistBtn = document.getElementById('wishlistOverlay');
    const headerWishlistBtn = document.getElementById('headerWishlistBtn');
    
    [wishlistBtn, headerWishlistBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                toggleWishlist();
            });
        }
    });
}

// Utility functions
function addToCart(product) {
    try {
        let cart = JSON.parse(localStorage.getItem('fashionCart') || '[]');

        const existingItem = cart.find(item =>
            item.title === product.title &&
            item.selectedSize === product.selectedSize &&
            item.selectedColor === product.selectedColor
        );

        if (existingItem) {
            existingItem.quantity += product.quantity;
        } else {
            cart.push({
                id: product.id,
                title: product.title,
                price: `$${product.currentPrice}`,
                image: product.images.main,
                selectedSize: product.selectedSize,
                selectedColor: product.selectedColor,
                quantity: product.quantity
            });
        }

        localStorage.setItem('fashionCart', JSON.stringify(cart));

        // Update cart count in header if present
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalCount;
        }

        console.log('Product added to cart successfully:', product);
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('Error adding to cart. Please try again.', 'error');
    }
}

function toggleWishlist() {
    let wishlist = JSON.parse(localStorage.getItem('fashionWishlist') || '[]');
    const isInWishlist = wishlist.some(item => item.id === currentProduct.id);
    
    if (isInWishlist) {
        wishlist = wishlist.filter(item => item.id !== currentProduct.id);
        showNotification(`${currentProduct.title} removed from wishlist`, 'info');
        
        // Update heart icons
        document.querySelectorAll('[id*="wishlist"] i').forEach(icon => {
            icon.className = 'far fa-heart';
        });
    } else {
        wishlist.push({
            id: currentProduct.id,
            title: currentProduct.title,
            price: `$${currentProduct.currentPrice}`,
            image: currentProduct.images.main
        });
        showNotification(`${currentProduct.title} added to wishlist!`, 'success');
        
        // Update heart icons
        document.querySelectorAll('[id*="wishlist"] i').forEach(icon => {
            icon.className = 'fas fa-heart';
        });
    }
    
    localStorage.setItem('fashionWishlist', JSON.stringify(wishlist));
}

function getCartItemCount() {
    const cart = JSON.parse(localStorage.getItem('fashionCart') || '[]');
    return cart.reduce((total, item) => total + item.quantity, 0);
}

function updateCartBadge() {
    const cartBadge = document.getElementById('cartBadge');
    const count = getCartItemCount();
    cartBadge.textContent = count;
    
    // Animation
    cartBadge.style.transform = 'scale(1.3)';
    setTimeout(() => {
        cartBadge.style.transform = 'scale(1)';
    }, 200);
}

function showCartSummary() {
    openCartModal();
}

function openCartModal() {
    const cartModal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartSummary = document.getElementById('cartSummary');

    cartModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Load cart data
    const cart = JSON.parse(localStorage.getItem('fashionCart') || '[]');

    if (cart.length === 0) {
        cartItems.style.display = 'none';
        cartEmpty.classList.add('hidden');
        cartSummary.style.display = 'none';
    } else {
        cartItems.style.display = 'block';
        cartEmpty.classList.add('hidden');
        cartSummary.style.display = 'block';

        // Display cart items
        displayCartItems(cart);
        updateCartSummary(cart);
    }

    // Setup cart modal event listeners
    setupCartModalListeners();
}

function closeCartModal() {
    const cartModal = document.getElementById('cartModal');
    cartModal.classList.add('hidden');
    document.body.style.overflow = '';
}

function displayCartItems(cart) {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="cart-item-details">
                <h3 class="item-title">${item.title}</h3>
                <div class="item-options">
                    <span class="item-size">Size: ${item.selectedSize}</span>
                    <span class="item-color">Color: ${item.selectedColor}</span>
                </div>
                <div class="item-controls">
                    <div class="quantity-controls">
                        <button class="qty-btn decrease" onclick="updateCartItemQuantity(${index}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="qty-btn increase" onclick="updateCartItemQuantity(${index}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button class="remove-item" onclick="removeCartItem(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="cart-item-price">
                <span class="item-price">${item.price}</span>
                <span class="item-original-price">${item.price} each</span>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
}

function updateCartSummary(cart) {
    const subtotal = cart.reduce((sum, item) => {
        const price = parseFloat(item.price.replace('$', ''));
        return sum + (price * item.quantity);
    }, 0);

    const shipping = cart.length > 0 ? 9.99 : 0;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    document.getElementById('itemCount').textContent = `(${totalItems} items)`;
    document.getElementById('subtotalValue').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('taxValue').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('totalValue').textContent = `$${total.toFixed(2)}`;

    // Update shipping
    const shippingElement = document.querySelector('.shipping-value');
    shippingElement.textContent = cart.length > 0 ? '$9.99' : '$0.00';
}

function setupCartModalListeners() {
    const closeCart = document.getElementById('closeCart');
    const continueShopping = document.getElementById('continueShopping');
    const proceedCheckout = document.getElementById('proceedCheckout');
    const cartModal = document.getElementById('cartModal');

    // Remove existing listeners to avoid duplicates
    const newCloseCart = closeCart.cloneNode(true);
    const newContinueShopping = continueShopping.cloneNode(true);
    const newProceedCheckout = proceedCheckout.cloneNode(true);

    closeCart.parentNode.replaceChild(newCloseCart, closeCart);
    continueShopping.parentNode.replaceChild(newContinueShopping, continueShopping);
    proceedCheckout.parentNode.replaceChild(newProceedCheckout, proceedCheckout);

    // Close modal events
    newCloseCart.addEventListener('click', closeCartModal);
    newContinueShopping.addEventListener('click', closeCartModal);

    // Close on overlay click
    cartModal.onclick = (e) => {
        if (e.target.classList.contains('cart-modal-overlay')) {
            closeCartModal();
        }
    };

    // Proceed to checkout
    newProceedCheckout.addEventListener('click', () => {
        const cart = JSON.parse(localStorage.getItem('fashionCart') || '[]');
        if (cart.length === 0) {
            showNotification('Your cart is empty!', 'info');
            return;
        }

        showNotification('Redirecting to checkout...', 'info');
        setTimeout(() => {
            window.location.href = 'checkout.html';
        }, 1000);
    });
}

// Debug function to test write review functionality
window.testWriteReview = function() {
    console.log('=== Testing Write Review Functionality ===');

    const writeReviewBtn = document.getElementById('writeReviewBtn');
    console.log('Write review button found:', !!writeReviewBtn);

    if (writeReviewBtn) {
        console.log('Button text:', writeReviewBtn.textContent);
        console.log('Button visible:', writeReviewBtn.offsetParent !== null);
    }

    console.log('currentProduct defined:', typeof currentProduct !== 'undefined');
    if (typeof currentProduct !== 'undefined') {
        console.log('currentProduct:', currentProduct);
    }

    // Try to navigate directly
    if (typeof currentProduct !== 'undefined' && currentProduct) {
        const productDataForReview = {
            id: currentProduct.id || Date.now(),
            title: currentProduct.title || 'Test Product',
            brand: currentProduct.brand || 'StyleHub',
            currentPrice: currentProduct.currentPrice || 99,
            images: currentProduct.images || { main: 'https://via.placeholder.com/300x300' },
            selectedColor: currentProduct.selectedColor || 'black',
            selectedSize: currentProduct.selectedSize || 'M'
        };

        localStorage.setItem('reviewProduct', JSON.stringify(productDataForReview));
        const productParam = encodeURIComponent(JSON.stringify(productDataForReview));
        const reviewUrl = `write-review.html?product=${productParam}`;

        console.log('Generated review URL:', reviewUrl);
        console.log('Attempting navigation...');

        window.location.href = reviewUrl;
    } else {
        console.error('Cannot test - currentProduct not available');
    }
};

// Alternative direct navigation function
window.openWriteReview = function() {
    // Fallback data if currentProduct is not available
    const fallbackProduct = {
        id: Date.now(),
        title: 'Churidar',
        brand: 'Fashion Hub',
        currentPrice: 299,
        images: { main: 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F9915d20cfed848ec961a57e0b81de98d?format=webp&width=800' },
        selectedColor: 'black',
        selectedSize: 'M'
    };

    const productToUse = (typeof currentProduct !== 'undefined' && currentProduct) ? currentProduct : fallbackProduct;

    localStorage.setItem('reviewProduct', JSON.stringify(productToUse));
    const productParam = encodeURIComponent(JSON.stringify(productToUse));
    const reviewUrl = `write-review.html?product=${productParam}`;

    console.log('Opening write review page with product:', productToUse.title);
    window.location.href = reviewUrl;
};

// Make updateCartItemQuantity global for inline onclick
window.updateCartItemQuantity = function(index, change) {
    console.log('Updating cart item quantity:', index, change);
    let cart = JSON.parse(localStorage.getItem('fashionCart') || '[]');

    if (cart[index]) {
        cart[index].quantity += change;

        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }

        localStorage.setItem('fashionCart', JSON.stringify(cart));

        // Refresh cart display
        if (cart.length === 0) {
            const cartItems = document.getElementById('cartItems');
            const cartEmpty = document.getElementById('cartEmpty');
            const cartSummary = document.getElementById('cartSummary');

            if (cartItems) cartItems.style.display = 'none';
            if (cartEmpty) cartEmpty.classList.add('hidden');
            if (cartSummary) cartSummary.style.display = 'none';
        } else {
            displayCartItems(cart);
            updateCartSummary(cart);
        }

        updateCartBadge();
    }
}

// Make removeCartItem global for inline onclick
window.removeCartItem = function(index) {
    console.log('Removing cart item at index:', index);
    let cart = JSON.parse(localStorage.getItem('fashionCart') || '[]');

    if (cart[index]) {
        const itemName = cart[index].title;
        cart.splice(index, 1);
        localStorage.setItem('fashionCart', JSON.stringify(cart));

        // Refresh cart display
        if (cart.length === 0) {
            closeCartModal();
            openCartModal();
        } else {
            displayCartItems(cart);
            updateCartSummary(cart);
        }

        updateCartBadge();
        showNotification(`${itemName} removed from cart`, 'success');
    }
}

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
        white-space: pre-line;
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

// Initialize wishlist state on page load
function initializeWishlistState() {
    const wishlist = JSON.parse(localStorage.getItem('fashionWishlist') || '[]');
    const isInWishlist = wishlist.some(item => item.id === currentProduct.id);
    
    if (isInWishlist) {
        document.querySelectorAll('[id*="wishlist"] i').forEach(icon => {
            icon.className = 'fas fa-heart';
        });
    }
}

// Initialize on load
setTimeout(initializeWishlistState, 100);

// Global function for remove icon - accessible from inline onclick
window.removeAndGoHome = function() {
    console.log('Remove and go home function called!');

    // Get current product from global scope
    if (typeof currentProduct !== 'undefined') {
        // Remove from cart if it exists
        let cart = JSON.parse(localStorage.getItem('fashionCart') || '[]');
        const existingItemIndex = cart.findIndex(item =>
            item.title === currentProduct.title &&
            item.selectedSize === currentProduct.selectedSize &&
            item.selectedColor === currentProduct.selectedColor
        );

        if (existingItemIndex !== -1) {
            const itemName = cart[existingItemIndex].title;
            cart.splice(existingItemIndex, 1);
            localStorage.setItem('fashionCart', JSON.stringify(cart));

            // Update cart badge if available
            const cartBadge = document.getElementById('cartBadge');
            if (cartBadge) {
                const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
                cartBadge.textContent = totalItems;
            }
        }
    }

    // Show notification and navigate to home
    showNotification('Item removed! Redirecting to home page...', 'success');

    // Navigate to home page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
};

// Initialize Cart Modal
function initializeCartModal() {
    // Add event listeners for cart modal
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !cartModal.classList.contains('hidden')) {
                closeCartModal();
            }
        });

        // Prevent modal content click from closing modal
        const cartModalContent = cartModal.querySelector('.cart-modal-content');
        if (cartModalContent) {
            cartModalContent.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }
}

// Setup Related Products Interaction
function setupRelatedProductsInteraction() {
    // Handle Wishlist buttons in related products
    const wishlistBtns = document.querySelectorAll('.wishlist-btn-overlay');
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productCard = e.target.closest('.product-card');
            const productTitle = productCard.querySelector('h3').textContent;
            const heartIcon = btn.querySelector('i');

            // Toggle wishlist state
            if (heartIcon.classList.contains('far')) {
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas');
                btn.style.background = '#ff6b6b';
                btn.style.color = 'white';
                showNotification(`${productTitle} added to wishlist!`, 'success');
            } else {
                heartIcon.classList.remove('fas');
                heartIcon.classList.add('far');
                btn.style.background = 'rgba(255,255,255,0.9)';
                btn.style.color = '#666';
                showNotification(`${productTitle} removed from wishlist`, 'info');
            }
        });
    });

    // Handle product card clicks (for navigation)
    const productCards = document.querySelectorAll('.related-products .product-card');
    productCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't navigate if clicking on buttons
            if (e.target.closest('.wishlist-btn-overlay')) {
                return;
            }

            const productTitle = card.querySelector('h3').textContent;
            showNotification(`Loading ${productTitle}...`, 'info');

            // Add loading animation
            card.style.opacity = '0.7';
            setTimeout(() => {
                card.style.opacity = '1';
                // In a real app, this would navigate to the product detail page
                console.log(`Navigate to ${productTitle} detail page`);
            }, 1000);
        });
    });
}

// Quick View functionality removed

// Handle product card clicks in related products (updated version)
document.addEventListener('click', function(e) {
    const productCard = e.target.closest('.product-card');
    if (productCard && productCard.closest('.related-products')) {
        // This is handled by setupRelatedProductsInteraction now
        return;
    }
});

// Profile Dropdown Functionality
function setupProfileDropdown() {
    const profileTrigger = document.getElementById('profileTrigger');
    const profileDropdown = document.getElementById('profileDropdown');
    const profileArrow = document.getElementById('profileArrow');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const statusIndicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    const onlineStatus = document.getElementById('onlineStatus');

    if (!profileTrigger || !profileDropdown) return;

    // Initialize user status to always stay online
    updateUserStatus('online');

    // Ensure status stays online every 5 seconds
    setInterval(() => {
        updateUserStatus('online');
    }, 5000);

    // Toggle dropdown on click
    profileTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleProfileDropdown();
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!profileTrigger.contains(e.target) && !profileDropdown.contains(e.target)) {
            closeProfileDropdown();
        }
    });

    // Handle dropdown menu items
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            handleDropdownItemClick(item);
        });
    });

    // Keep status always online - commented out random status changes
    // setInterval(() => {
    //     const statuses = ['online', 'away', 'busy'];
    //     const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    //     updateUserStatus(randomStatus);
    // }, 30000);
}

function toggleProfileDropdown() {
    const profileTrigger = document.getElementById('profileTrigger');
    const profileDropdown = document.getElementById('profileDropdown');
    const profileArrow = document.getElementById('profileArrow');

    const isOpen = profileDropdown.classList.contains('show');

    if (isOpen) {
        closeProfileDropdown();
    } else {
        openProfileDropdown();
    }
}

function openProfileDropdown() {
    const profileTrigger = document.getElementById('profileTrigger');
    const profileDropdown = document.getElementById('profileDropdown');
    const profileArrow = document.getElementById('profileArrow');

    profileTrigger.classList.add('active');
    profileDropdown.classList.add('show');
    if (profileArrow) {
        profileArrow.style.transform = 'rotate(180deg)';
    }

    // Add animation delay for menu items
    const menuItems = document.querySelectorAll('.dropdown-item');
    menuItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
            item.style.transition = 'all 0.3s ease';
        }, index * 50);
    });
}

function closeProfileDropdown() {
    const profileTrigger = document.getElementById('profileTrigger');
    const profileDropdown = document.getElementById('profileDropdown');
    const profileArrow = document.getElementById('profileArrow');

    profileTrigger.classList.remove('active');
    profileDropdown.classList.remove('show');
    if (profileArrow) {
        profileArrow.style.transform = 'rotate(0deg)';
    }

    // Reset menu items animation
    const menuItems = document.querySelectorAll('.dropdown-item');
    menuItems.forEach(item => {
        item.style.opacity = '';
        item.style.transform = '';
        item.style.transition = '';
    });
}

function updateUserStatus(status) {
    const statusIndicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    const onlineStatus = document.getElementById('onlineStatus');

    if (!statusIndicator || !statusText || !onlineStatus) return;

    // Remove all status classes
    statusIndicator.className = 'status-indicator';
    onlineStatus.className = 'online-status';

    // Add new status class
    if (status !== 'online') {
        statusIndicator.classList.add(status);
        onlineStatus.classList.add(status);
    }

    // Update status text
    const statusTexts = {
        'online': 'Online',
        'away': 'Away',
        'busy': 'Busy',
        'offline': 'Offline'
    };

    statusText.textContent = statusTexts[status] || 'Online';
    onlineStatus.title = statusTexts[status] || 'Online';

    // Show notification when status changes
    if (status !== 'online') {
        showNotification(`Status changed to ${statusTexts[status]}`, 'info');
    }
}

function handleDropdownItemClick(item) {
    const itemId = item.id;
    const itemText = item.querySelector('span').textContent;

    switch(itemId) {
        case 'myProfile':
            showNotification('Opening My Profile...', 'info');
            // Navigate to profile page
            window.location.href = 'profile.html';
            break;

        case 'myOrders':
            showNotification('Opening My Orders...', 'info');
            break;

        case 'myWishlist':
            showNotification('Opening My Wishlist...', 'info');
            showWishlistSummary();
            break;

        case 'accountSettings':
            showNotification('Opening Account Settings...', 'info');
            break;

        case 'helpSupport':
            showNotification('Opening Help & Support...', 'info');
            break;

        case 'signInOut':
            const signInOutText = document.getElementById('signInOutText');
            if (signInOutText && signInOutText.textContent === 'Sign Out') {
                handleSignOut();
            } else {
                showNotification('Please sign in to access your account', 'info');
            }
            break;

        default:
            showNotification(`${itemText} clicked`, 'info');
            break;
    }

    // Close dropdown after item click
    closeProfileDropdown();

    // Add click feedback animation
    item.style.transform = 'scale(0.95)';
    setTimeout(() => {
        item.style.transform = '';
    }, 150);
}

function handleSignOut() {
    showNotification('Signing out...', 'info');

    setTimeout(() => {
        // Reset user data
        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');
        const signInOutText = document.getElementById('signInOutText');

        if (userName) userName.textContent = 'Guest User';
        if (userEmail) userEmail.textContent = 'guest@stylehub.com';
        if (signInOutText) signInOutText.textContent = 'Sign In';
        updateUserStatus('offline');

        showNotification('Successfully signed out!', 'success');
        closeProfileDropdown();
    }, 1000);
}
