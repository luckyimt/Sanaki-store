let products = JSON.parse(localStorage.getItem("products")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// RENDER PRODUCTS
function renderShop() {
  const shop = document.getElementById("shop");
  shop.innerHTML = "";

  products.forEach(p => {
    shop.innerHTML += `
      <div class="card">
        <img src="${p.image}" width="100%">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>

        <button onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    `;
  });
}

// ADD TO CART
function addToCart(id) {
  const product = products.find(p => p.id === id);

  const item = cart.find(c => c.id === id);

  if (item) {
    item.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

// UPDATE CART UI
function updateCart() {
  document.getElementById("cartCount").innerText =
    cart.reduce((sum, i) => sum + i.qty, 0);
}

// OPEN CART
function openCart() {
  document.getElementById("cartModal").style.display = "block";
  renderCart();
}

// RENDER CART
function renderCart() {
  const container = document.getElementById("cartItems");
  container.innerHTML = "";

  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;

    container.innerHTML += `
      <div>
        ${item.name} - $${item.price} x ${item.qty}
        <button onclick="changeQty(${item.id}, 1)">+</button>
        <button onclick="changeQty(${item.id}, -1)">-</button>
      </div>
    `;
  });

  document.getElementById("total").innerText = total;
}

// CHANGE QTY
function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);

  item.qty += delta;

  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCart();
}

// CHECKOUT (SIMULATION)
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
renderShop();
updateCart();