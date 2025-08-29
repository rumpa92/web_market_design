document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('collectionProductsGrid');
  const countEl = document.getElementById('productsCount');
  const priceSlider = document.getElementById('priceRange');
  const currentPriceValue = document.getElementById('currentPriceValue');
  const sizeFilter = document.getElementById('sizeFilter');
  const colorFilter = document.getElementById('colorFilter');
  const categoryChips = Array.from(document.querySelectorAll('.category-filter'));

  const products = [
    { id: 'sp1', name: 'Floral Maxi Dress', price: 1299, category: 'dresses', colors: ['pink','red'], sizes: ['S','M','L'], rating: '★★★★★', image: 'https://cdn.builder.io/api/v1/image/assets%2Fa91527f2fe264920accbd14578b2df55%2F72f8c53f7fb240f78689e888234308cb?format=webp&width=800' },
    { id: 'sp2', name: 'Light Cotton Blazer', price: 1799, category: 'outerwear', colors: ['blue','white'], sizes: ['M','L','XL'], rating: '★★★★☆', image: 'https://images.unsplash.com/photo-1550246140-29d31057a713?w=800&h=800&fit=crop&auto=format&q=80' },
    { id: 'sp3', name: 'Pastel Knit Cardigan', price: 999, category: 'tops', colors: ['pink','yellow'], sizes: ['XS','S','M'], rating: '★★★★☆', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&h=800&fit=crop&auto=format&q=80' },
    { id: 'sp4', name: 'Cropped Denim Jacket', price: 1499, category: 'outerwear', colors: ['blue'], sizes: ['S','M','L'], rating: '★★★★☆', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=800&fit=crop&auto=format&q=80' },
    { id: 'sp5', name: 'Pleated Midi Skirt', price: 899, category: 'bottoms', colors: ['pink','white'], sizes: ['XS','S','M','L'], rating: '★★★★★', image: 'https://images.unsplash.com/photo-1520975922284-4c36b1a1b75b?w=800&h=800&fit=crop&auto=format&q=80' },
    { id: 'sp6', name: 'Linen Wide-Leg Pants', price: 1199, category: 'bottoms', colors: ['white','yellow'], sizes: ['S','M','L','XL'], rating: '★★★★☆', image: 'https://images.unsplash.com/photo-1511381939415-c1c76c3a27b3?w=800&h=800&fit=crop&auto=format&q=80' },
    { id: 'sp7', name: 'Silk Printed Scarf', price: 699, category: 'accessories', colors: ['pink','blue','green'], sizes: ['M'], rating: '★★★★★', image: 'https://images.unsplash.com/photo-1542060748-10c28b62716d?w=800&h=800&fit=crop&auto=format&q=80' },
    { id: 'sp8', name: 'Pastel Sneakers', price: 1499, category: 'footwear', colors: ['pink','blue'], sizes: ['S','M','L'], rating: '★★★★☆', image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&h=800&fit=crop&auto=format&q=80' },
    { id: 'sp9', name: 'Eyelet Lace Blouse', price: 1099, category: 'tops', colors: ['white'], sizes: ['XS','S','M','L'], rating: '★★★★★', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&h=800&fit=crop&auto=format&q=80' },
    { id: 'sp10', name: 'Floral Wrap Dress', price: 1399, category: 'dresses', colors: ['red','pink'], sizes: ['S','M','L'], rating: '★★★★★', image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&h=800&fit=crop&auto=format&q=80' },
    { id: 'sp11', name: 'Lightweight Trench', price: 1999, category: 'outerwear', colors: ['beige','yellow'], sizes: ['M','L','XL'], rating: '★★★★☆', image: 'https://images.unsplash.com/photo-1520975922284-4c36b1a1b75b?w=800&h=800&fit=crop&auto=format&q=80' },
    { id: 'sp12', name: 'Canvas Crossbody Bag', price: 799, category: 'accessories', colors: ['green','white'], sizes: ['M'], rating: '★★★★☆', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&h=800&fit=crop&auto=format&q=80' }
  ];

  let currentList = products.slice();
  function render(list) {
    currentList = list.slice();
    grid.innerHTML = currentList.map(p => `
      <div class="collection-product-card" data-category="${p.category}" data-price="${p.price}" data-sizes="${p.sizes.join(',')}" data-colors="${p.colors.join(',')}">
        <div class="product-image-container">
          <img src="${p.image}" alt="${p.name}" class="product-image" />
          <div class="product-hover-image"><img src="${p.image}" alt="${p.name}" class="hover-image" /></div>
          <button class="product-wishlist-btn" aria-label="Add to wishlist"><i class="far fa-heart"></i></button>
        </div>
        <div class="product-info">
          <h4 class="product-name">${p.name}</h4>
          <div class="product-rating"><span class="stars">${p.rating}</span></div>
          <div class="product-price">₹${p.price.toLocaleString()}</div>
          <div class="product-actions">
            <button class="add-to-cart-btn"><i class="fas fa-shopping-bag"></i> Add to Cart</button>
            <button class="quick-view-btn"><i class="fas fa-eye"></i> Quick View</button>
          </div>
        </div>
      </div>`).join('');
    setupCardActions();
    updateCount();
  }

  function setupCardActions() {
    // Add to cart
    grid.querySelectorAll('.collection-product-card .add-to-cart-btn').forEach((btn, idx) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const p = currentList[idx];
        addToCart({ id: p.id, title: p.name, price: `₹${p.price}`, image: p.image, quantity: 1 });
        showNotification(`${p.name} added to cart!`, 'success');
      });
    });
    // Wishlist
    grid.querySelectorAll('.collection-product-card .product-wishlist-btn').forEach((btn, idx) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const icon = btn.querySelector('i');
        const p = currentList[idx];
        const items = JSON.parse(localStorage.getItem('fashionWishlist') || '[]');
        const exists = items.some(i => i.id === p.id);
        if (exists) {
          const filtered = items.filter(i => i.id !== p.id);
          localStorage.setItem('fashionWishlist', JSON.stringify(filtered));
          icon.className = 'far fa-heart';
          showNotification(`${p.name} removed from wishlist`, 'info');
        } else {
          items.push({ id: p.id, title: p.name, image: p.image, price: `₹${p.price}` });
          localStorage.setItem('fashionWishlist', JSON.stringify(items));
          icon.className = 'fas fa-heart';
          showNotification(`${p.name} added to wishlist!`, 'success');
        }
      });
    });
  }

  // Sorting
  const sortFilter = document.getElementById('sortFilter');
  if (sortFilter) {
    sortFilter.addEventListener('change', () => {
      const val = sortFilter.value;
      let sorted = products.slice();
      if (val === 'price-low') sorted.sort((a,b)=>a.price-b.price);
      else if (val === 'price-high') sorted.sort((a,b)=>b.price-a.price);
      else sorted = products.slice();
      render(sorted);
      applyFilters();
    });
  }

  function updateCount() {
    const visible = grid.querySelectorAll('.collection-product-card').length;
    countEl.textContent = `${visible} item${visible !== 1 ? 's' : ''}`;
  }

  function applyFilters() {
    const activeChip = categoryChips.find(c => c.classList.contains('active'));
    const category = activeChip ? activeChip.dataset.category : 'all';
    const maxPrice = parseInt(priceSlider.value, 10);
    const size = sizeFilter.value;
    const color = colorFilter.value;

    const cards = Array.from(grid.querySelectorAll('.collection-product-card'));
    cards.forEach(card => {
      const cardCategory = card.dataset.category;
      const cardPrice = parseInt(card.dataset.price, 10);
      const sizes = card.dataset.sizes.split(',');
      const colors = card.dataset.colors.split(',');

      let show = true;
      if (category !== 'all' && cardCategory !== category) show = false;
      if (cardPrice > maxPrice) show = false;
      if (size && !sizes.includes(size)) show = false;
      if (color && !colors.includes(color)) show = false;

      card.style.display = show ? 'block' : 'none';
    });

    const visible = cards.filter(c => c.style.display !== 'none').length;
    countEl.textContent = `${visible} item${visible !== 1 ? 's' : ''}`;
  }

  // Events
  categoryChips.forEach(chip => {
    chip.addEventListener('click', () => {
      categoryChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      applyFilters();
    });
  });

  if (priceSlider && currentPriceValue) {
    priceSlider.addEventListener('input', (e) => {
      const value = parseInt(e.target.value, 10);
      currentPriceValue.textContent = `₹${value.toLocaleString()}`;
      applyFilters();
    });
  }

  if (sizeFilter) sizeFilter.addEventListener('change', applyFilters);
  if (colorFilter) colorFilter.addEventListener('change', applyFilters);

  document.querySelectorAll('.color-swatch').forEach(s => {
    s.addEventListener('click', () => {
      document.querySelectorAll('.color-swatch').forEach(x => x.classList.remove('active'));
      s.classList.add('active');
      colorFilter.value = s.dataset.color;
      applyFilters();
    });
  });

  // Initial render
  render(products);
  applyFilters();
});
