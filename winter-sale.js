document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('saleProductsGrid');
  const countEl = document.getElementById('productsCount');
  const shopNowBtn = document.getElementById('shopNowBtn');

  const saleItems = [
    { id: 'ws1', name: 'Wool Blend Overcoat', original: 6499, price: 3999, image: 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F302ea9cbe68a4e86aa894e18fdddf869?format=webp&width=600', stockLeft: 2 },
    { id: 'ws2', name: 'Cashmere Turtleneck Sweater', original: 3499, price: 2899, image: 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2Fcd41764914f3435db0789865df8be918?format=webp&width=600', stockLeft: 5 },
    { id: 'ws3', name: 'Quilted Puffer Jacket', original: 4599, price: 3499, image: 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F849f7f09fb5840d7b25e7cdc865cdaa9?format=webp&width=600', stockLeft: 1 },
    { id: 'ws4', name: 'Designer Wool Scarf', original: 1699, price: 1299, image: 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F5eccc65dc3744b36bfe1a6bc749e0af5?format=webp&width=600', stockLeft: 7 },
    { id: 'ws5', name: 'Merino Wool Cardigan', original: 2999, price: 2499, image: 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F341ff6d502c545c4b3ada70308c85526?format=webp&width=600', stockLeft: 3 },
    { id: 'ws6', name: 'Leather Winter Gloves', original: 1299, price: 899, image: 'https://cdn.builder.io/api/v1/image/assets%2F4797038dfeab418e80d0045aa34c21d8%2F081e58fb86c541a9af4297f57d3809c0?format=webp&width=600', stockLeft: 9 }
  ];

  function formatINR(n) { return `₹${n.toLocaleString()}`; }
  function discountPercent(item) { return Math.round((1 - item.price / item.original) * 100); }
  function savings(item) { return item.original - item.price; }

  function render() {
    grid.innerHTML = saleItems.map(item => `
      <div class="collection-product-card" data-price="${item.price}">
        <div class="product-image-container">
          <img src="${item.image}" alt="${item.name}" class="product-image" />
          <div class="product-hover-image"><img src="${item.image}" alt="${item.name}" class="hover-image" /></div>
          <div class="urgency-badge ${item.stockLeft <= 2 ? 'critical' : ''}">
            ${item.stockLeft <= 2 ? `Only ${item.stockLeft} left` : 'Sale Ends Soon'}
          </div>
        </div>
        <div class="product-info">
          <h4 class="product-name">${item.name}</h4>
          <div class="product-price-row">
            <span class="current-price">${formatINR(item.price)}</span>
            <span class="original-price">${formatINR(item.original)}</span>
            <span class="discount-badge">${discountPercent(item)}% OFF</span>
          </div>
          <div class="savings-text">You save ${formatINR(savings(item))}</div>
          <div class="product-actions">
            <button class="add-to-cart-btn"><i class="fas fa-shopping-bag"></i> Add to Cart</button>
          </div>
        </div>
      </div>`).join('');

    // Bind actions
    grid.querySelectorAll('.add-to-cart-btn').forEach((btn, i) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const p = saleItems[i];
        addToCart({ id: p.id, title: p.name, price: formatINR(p.price), image: p.image, quantity: 1 });
        showNotification(`${p.name} added to cart!`, 'success');
      });
    });

    // Count
    countEl.textContent = `${saleItems.length} items`;
  }

  if (shopNowBtn) {
    shopNowBtn.addEventListener('click', () => {
      document.querySelector('.collection-products').scrollIntoView({ behavior: 'smooth' });
    });
  }

  render();
});
