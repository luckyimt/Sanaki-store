// shop.js

let products = JSON.parse(localStorage.getItem("products")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// RENDER SHOP PRODUCTS
function renderShop() {
  const shop = document.getElementById("shop");
  shop.innerHTML = "";

  if (products.length === 0) {
    shop.innerHTML = `
      <div class="card text-center">
        <h3>No products available</h3>
        <p class="mt-1">Add products from admin panel first.</p>
      </div>
    `;
    return;
  }

  products.forEach(product => {
    const outOfStock = product.stock <= 0;

    shop.innerHTML += `
      <div class="card product-card">
        
        <div class="product-image-wrap">
          <img src="${product.image}" alt="${product.name}">
          ${
            outOfStock
              ? `<span class="badge badge-danger">Out of Stock</span>`
              : `<span class="badge badge-success">In Stock</span>`
          }
        </div>

        <div class="product-content">
          <h3>${product.name}</h3>
          <p class="price">$${product.price}</p>
          <p class="stock-text">Available: ${product.stock}</p>

          <button 
            class="btn btn-primary w-full"
            onclick="addToCart(${product.id})"
            ${outOfStock ? "disabled" : ""}
          >
            ${outOfStock ? "Unavailable" : "Add to Cart"}
          </button>
        </div>
      </div>
    `;
  });
}

// ADD TO CART
function addToCart(id) {
  const product = products.find(p => p.id === id);

  if (!product || product.stock <= 0) {
    alert("This product is out of stock");
    return;
  }

  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    if (existingItem.qty >= product.stock) {
      alert("You cannot add more than available stock");
      return;
    }

    existingItem.qty++;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// UPDATE CART COUNT
function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("cartCount").innerText = totalItems;
}

// OPEN CART
function openCart() {
  document.getElementById("cartModal").style.display = "flex";
  renderCart();
}

// CLOSE CART
function closeCart() {
  document.getElementById("cartModal").style.display = "none";
}

// RENDER CART
function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const totalText = document.getElementById("total");

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <p>Your cart is empty</p>
      </div>
    `;
    totalText.innerText = "0";
    return;
  }

  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;

    cartItems.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">

        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>$${item.price}</p>

          <div class="qty-controls">
            <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
            <span>${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
          </div>
        </div>

        <div class="cart-item-total">
          $${item.price * item.qty}
        </div>
      </div>
    `;
  });

  totalText.innerText = total.toFixed(2);
}

// CHANGE QTY
function changeQty(id, delta) {
  const product = products.find(p => p.id === id);
  const item = cart.find(i => i.id === id);

  if (!item || !product) return;

  item.qty += delta;

  if (item.qty > product.stock) {
    item.qty = product.stock;
    alert("Maximum stock reached");
  }

  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  renderCart();
  updateCartCount();
}

// CHECKOUT
function checkout() {
  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  alert("Proceed to checkout flow");

  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));

  renderCart();
  updateCartCount();
}

// INITIALIZE
renderShop();
updateCartCount();