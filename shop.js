let products = JSON.parse(localStorage.getItem("products")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const userGreeting = document.getElementById("userGreeting");
const userEmail = document.getElementById("userEmail");
userGreeting.textContent = `Welcome, ${currentUser.fullName}`;
userEmail.textContent = currentUser.email;
const cartCount = document.getElementById("cartCount");
const productGrid = document.getElementById("productGrid");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const searchInput = document.getElementById("searchInput");

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || localStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "index.html";
}

renderProducts();
renderCart();


function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);

  cartCount.textContent = totalItems;
}

function loadUserCart() {
  const allCartItems = JSON.parse(localStorage.getItem("cart")) || [];

  cart = allCartItems.filter(item => {
    return item.userEmail === currentUser.email;
  });

  updateCartCount();
  renderCartItems();
}

function renderCartItems() {
  const cartItemsContainer = document.getElementById("cartItems");
  const cartSubtotal = document.getElementById("cartSubtotal");

  if (!cartItemsContainer) return;

  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <p>Your cart is empty.</p>
      </div>
    `;

    cartSubtotal.textContent = "$0.00";
    return;
  }

  let subtotal = 0;

  cart.forEach((item, index) => {
    subtotal += item.price * item.quantity;

    cartItemsContainer.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">

        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>$${item.price}</p>

          <div class="cart-quantity-controls">
            <button onclick="decreaseQuantity(${index})">-</button>
            <span>${item.quantity}</span>
            <button onclick="increaseQuantity(${index})">+</button>
          </div>
        </div>

        <button class="remove-cart-item" onclick="removeCartItem(${index})">
          Remove
        </button>
      </div>
    `;
  });

  cartSubtotal.textContent = "$" + subtotal.toFixed(2);
}


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
function addToCart(product) {
  const existingProduct = cart.find(item => {
    return item.id === product.id;
  });

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      userEmail: currentUser.email
    });
  }

  saveCart();
  renderCartItems();
}

// RENDER CART

// CHANGE QUANTITY
function increaseQuantity(index) {
  cart[index].quantity += 1;
  syncUserCart();
}

function decreaseQuantity(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  } else {
    cart.splice(index, 1);
  }

  syncUserCart();
}

function removeCartItem(index) {
  cart.splice(index, 1);
  syncUserCart();
}

function syncUserCart() {
  const allCartItems = JSON.parse(localStorage.getItem("cart")) || [];

  const otherUsersCart = allCartItems.filter(item => {
    return item.userEmail !== currentUser.email;
  });

  const updatedCart = [...otherUsersCart, ...cart];

  localStorage.setItem("cart", JSON.stringify(updatedCart));

  updateCartCount();
  renderCartItems();
}

window.addEventListener("DOMContentLoaded", () => {
  loadUserCart();
});

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
    alert("Your cart is empty");
    return;
  }

  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  const order = {
    id: Date.now(),
    orderId: "ORD-" + Date.now(),
    items: [...cart],
    total: cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    status: "Pending",
    date: new Date().toLocaleString()
  };

  cart.forEach(cartItem => {
    const product = products.find(p => p.id === cartItem.id);

    if (product) {
      product.stock -= cartItem.qty;
    }
  });

  orders.push(order);

  localStorage.setItem("orders", JSON.stringify(orders));
  localStorage.setItem("products", JSON.stringify(products));

  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));

  renderProducts();
  renderCart();
  toggleCart();

  alert("Order placed successfully");
}

//--nav

function setActiveSidebarLink() {
  const links = document.querySelectorAll(".sidebar-link");
  const currentPage = window.location.pathname.split("/").pop();

  links.forEach(link => {
    const href = link.getAttribute("href");

    if (href === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  setActiveSidebarLink();
});

function logoutUser() {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("adminLoggedIn");

  window.location.href = "index.html";
}
