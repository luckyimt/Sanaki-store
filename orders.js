let orders = JSON.parse(localStorage.getItem("orders")) || [];

const ordersGrid = document.getElementById("ordersGrid");

function renderOrders(orders) {
  customerOrdersGrid.innerHTML = "";

  if (orders.length === 0) {
    customerOrdersGrid.innerHTML = `
      <div class="order-empty-state">
        <h3>No Orders Found</h3>
        <p>You have not placed any orders yet.</p>
      </div>
    `;
    return;
  }

  orders.forEach(order => {
    const orderDate = new Date(order.createdAt || order.date).toLocaleDateString();

    const productsHTML = (order.items || []).map(item => `
      <div class="order-product-item">
        <img src="${item.image}" alt="${item.name}">

        <div class="order-product-info">
          <h4>${item.name}</h4>
          <p>Quantity: ${item.quantity}</p>
        </div>

        <div class="order-product-price">
          $${(item.price * item.quantity).toFixed(2)}
        </div>
      </div>
    `).join("");

    customerOrdersGrid.innerHTML += `
      <div class="customer-order-card">

        <div class="customer-order-top">
          <div class="customer-order-id">
            <h3>Order #${order.orderNumber || order.id}</h3>
            <p>Placed on ${orderDate}</p>
          </div>

          <div class="order-status-badge ${(order.status || "Pending").toLowerCase()}">
            ${order.status || "Pending"}
          </div>
        </div>

        <div class="customer-order-body">

          <div class="customer-order-products">
            ${productsHTML}
          </div>

          <div class="customer-order-footer">

            <div class="order-footer-info">
              <div class="order-footer-box">
                <span>Payment Method</span>
                <strong>${order.paymentMethod || "PayPal"}</strong>
              </div>

              <div class="order-footer-box">
                <span>Shipping Address</span>
                <strong>${order.shippingAddress || "No address available"}</strong>
              </div>
            </div>

            <div class="order-footer-box">
              <span>Total Amount</span>
              <strong>$${Number(order.total || 0).toFixed(2)}</strong>
            </div>

          </div>

        </div>

      </div>
    `;
  });
}

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

const customerOrdersGrid = document.getElementById("customerOrdersGrid");
const orderSearchInput = document.getElementById("orderSearchInput");

const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const allOrders = JSON.parse(localStorage.getItem("orders")) || [];

let customerOrders = [];

function loadCustomerOrders() {
  customerOrdersGrid.innerHTML = "<p>Loading orders...</p>";

  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  customerOrders = allOrders.filter(order => {
    return order.customerEmail === currentUser.email;
  });

  customerOrders.sort((a, b) => {
    return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
  });

  updateOrderSummary(customerOrders);
  renderOrders(customerOrders);
}

function updateOrderSummary(orders) {
  const totalOrders = orders.length;

  const pendingOrders = orders.filter(order => {
    return order.status === "Pending";
  }).length;

  const deliveredOrders = orders.filter(order => {
    return order.status === "Delivered";
  }).length;

  const totalSpent = orders.reduce((sum, order) => {
    return sum + Number(order.total || 0);
  }, 0);

  document.getElementById("totalOrdersCount").textContent = totalOrders;
  document.getElementById("pendingOrdersCount").textContent = pendingOrders;
  document.getElementById("deliveredOrdersCount").textContent = deliveredOrders;
  document.getElementById("totalSpentAmount").textContent = "$" + totalSpent.toFixed(2);
}


orderSearchInput.addEventListener("input", () => {
  const searchValue = orderSearchInput.value.toLowerCase().trim();

  const filteredOrders = customerOrders.filter(order => {
    const orderId = String(order.orderNumber || order.id || "").toLowerCase();

    const productMatch = (order.items || []).some(item => {
      return item.name.toLowerCase().includes(searchValue);
    });

    return orderId.includes(searchValue) || productMatch;
  });

  renderOrders(filteredOrders);
});

window.addEventListener("DOMContentLoaded", () => {
  loadCustomerOrders();
});

