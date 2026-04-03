
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || localStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "login.html";
}

document.getElementById("userGreeting").textContent = currentUser.fullName;
document.getElementById("userEmail").textContent = currentUser.email;
document.getElementById("shopUserAvatar").textContent = currentUser.fullName.charAt(0).toUpperCase();

const shopProductsGrid = document.getElementById("shopProductsGrid");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");
const cartCount = document.getElementById("cartCount");

let allProducts = JSON.parse(localStorage.getItem("products")) || [];
let displayedProducts = [...allProducts];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
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

function updateCartCount() {
  const userCart = cart.filter(item => {
    return item.userEmail === currentUser.email;
  });

  const totalItems = userCart.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);

  cartCount.textContent = totalItems;
}


// RENDER PRODUCTS
function renderProducts(products) {
  shopProductsGrid.innerHTML = "";

  if (products.length === 0) {
    shopProductsGrid.innerHTML = `
      <div class="empty-products">
        <h3>No Products Found</h3>
        <p>Try changing your search or category filter.</p>
      </div>
    `;
    return;
  }

  products.forEach(product => {
    shopProductsGrid.innerHTML += `
      <div class="shop-product-card">
        <img src="${product.image}" class="shop-product-image" alt="${product.name}">

        <div class="shop-product-content">
          <div class="shop-product-category">
            ${product.category}
          </div>

          <h3>${product.name}</h3>

          <p class="shop-product-description">
            ${product.description || "Premium quality product with modern design and excellent value."}
          </p>

          <div class="shop-product-footer">
            <div class="shop-product-price">$${Number(product.price).toFixed(2)}</div>

            <button class="add-cart-btn" onclick="addToCart('${product.id}')">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    `;
  });
}

// ADD TO CART
function addToCart(productId) {
  const selectedProduct = allProducts.find(product => {
    return String(product.id) === String(productId);
  });

  if (!selectedProduct) return;

  const existingItem = cart.find(item => {
    return item.id === selectedProduct.id && item.userEmail === currentUser.email;
  });

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      image: selectedProduct.image,
      quantity: 1,
      userEmail: currentUser.email
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

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


searchInput.addEventListener("input", () => {
  const searchValue = searchInput.value.toLowerCase().trim();

  displayedProducts = allProducts.filter(product => {
    const nameMatch = product.name.toLowerCase().includes(searchValue);
    const categoryMatch = product.category.toLowerCase().includes(searchValue);

    return nameMatch || categoryMatch;
  });

  renderProducts(displayedProducts);
});

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    document.querySelector(".filter-btn.active").classList.remove("active");
    button.classList.add("active");

    const category = button.dataset.category;

    if (category === "all") {
      displayedProducts = [...allProducts];
    } else {
      displayedProducts = allProducts.filter(product => {
        return product.category === category;
      });
    }

    renderProducts(displayedProducts);
  });
});

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
  window.location.href = "index.html";
}


window.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("products")) {
    const sampleProducts = [
      {
        id: "1",
        name: "Modern Chair",
        category: "Home",
        price: 129,
        image: "https://images.unsplash.com/photo-1582582429416-47c1d3f3d9db?auto=format&fit=crop&w=800&q=80",
        description: "Comfortable premium chair with modern style."
      },
      {
        id: "2",
        name: "Luxury Watch",
        category: "Fashion",
        price: 249,
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=80",
        description: "Elegant watch with premium metal finish."
      },
      {
        id: "3",
        name: "Wireless Headphones",
        category: "Electronics",
        price: 189,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
        description: "High quality sound with wireless connectivity."
      }
    ];

    localStorage.setItem("products", JSON.stringify(sampleProducts));
  }

  allProducts = JSON.parse(localStorage.getItem("products")) || [];
  displayedProducts = [...allProducts];

  renderProducts(displayedProducts);
  updateCartCount();
});
