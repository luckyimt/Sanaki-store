let products = JSON.parse(localStorage.getItem("products")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productGrid = document.getElementById("productGrid");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const searchInput = document.getElementById("searchInput");

// RENDER PRODUCTS
function renderProducts(filter = "") {
  productGrid.innerHTML = "";

  const filtered = products.filter(product =>
    product.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (filtered.length === 0) {
    productGrid.innerHTML = `<p>No products found.</p>`;
    return;
  }

  filtered.forEach(product => {
    productGrid.innerHTML += `
      <div class="card product-card">
        <img src="${product.image}" class="product-image" alt="${product.name}">

        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-price">$${product.price}</p>
          <p class="product-stock">Stock: ${product.stock}</p>

          <button 
            class="btn btn-primary"
            onclick="addToCart(${product.id})"
            ${product.stock <= 0 ? "disabled" : ""}
          >
            ${product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    `;
  });
}

// ADD TO CART
function addToCart(id) {
  const product = products.find(p => p.id === id);

  if (!product || product.stock <= 0) return;

  const existing = cart.find(item => item.id === id);

  if (existing) {
    if (existing.qty < product.stock) {
      existing.qty++;
    }
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
  renderCart();
}

// RENDER CART
function renderCart() {
  cartItems.innerHTML = "";

  let total = 0;
  let count = 0;

  cart.forEach(item => {
    total += item.price * item.qty;
    count += item.qty;

    cartItems.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">

        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>$${item.price}</p>

          <div class="qty-controls">
            <button onclick="changeQty(${item.id}, -1)">−</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${item.id}, 1)">+</button>
          </div>
        </div>
      </div>
    `;
  });

  cartTotal.innerText = total.toFixed(2);
  cartCount.innerText = count;

  localStorage.setItem("cart", JSON.stringify(cart));
}

// CHANGE QUANTITY
function changeQty(id, change) {
  const product = products.find(p => p.id === id);
  const item = cart.find(i => i.id === id);

  if (!item) return;

  item.qty += change;

  if (item.qty > product.stock) {
    item.qty = product.stock;
  }

  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }

  renderCart();
}

// TOGGLE CART
function toggleCart() {
  document.getElementById("cartSidebar").classList.toggle("active");
  document.getElementById("overlay").classList.toggle("active");
}

// SEARCH
searchInput.addEventListener("input", e => {
  renderProducts(e.target.value);
});

// CHECKOUT
function checkout() {

  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  let products = JSON.parse(localStorage.getItem("products")) || [];
  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  // 🔻 Deduct stock
  cart.forEach(cartItem => {
    const product = products.find(p => p.id === cartItem.id);

    if (product) {
      product.stock -= cartItem.qty;

      if (product.stock < 0) {
        alert("Not enough stock for " + product.name);
        return;
      }
    }
  });

  // 💾 Save updated products
  localStorage.setItem("products", JSON.stringify(products));

  // 📦 Create order
  const order = {
    orderId: "ORD-" + Date.now(),
    items: cart,
    total: cart.reduce((sum, i) => sum + i.price * i.qty, 0),
    status: "Pending",
    date: new Date().toLocaleString()
  };

  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  alert("Order placed!");

  // 🧹 Clear cart
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));

  renderCart();
  updateCart();
}
// INIT
renderProducts();
renderCart();