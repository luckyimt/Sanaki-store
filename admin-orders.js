const adminOrdersGrid = document.querySelector(".admin-orders-grid");
const searchInput = document.querySelector(".admin-order-search");
const statusFilter = document.querySelector(".admin-order-filter");

let orders = JSON.parse(localStorage.getItem("orders")) || [];

function updateStats(filteredOrders) {
  const totalOrders = filteredOrders.length;
  const pendingOrders = filteredOrders.filter(order => order.status === "Pending").length;
  const shippedOrders = filteredOrders.filter(order => order.status === "Shipped").length;

  document.querySelectorAll(".admin-stat-value")[0].textContent = totalOrders;
  document.querySelectorAll(".admin-stat-value")[1].textContent = pendingOrders;
  document.querySelectorAll(".admin-stat-value")[2].textContent = shippedOrders;
}

function renderAdminOrders(filteredOrders = orders) {
  adminOrdersGrid.innerHTML = "";

  if (filteredOrders.length === 0) {
    adminOrdersGrid.innerHTML = `
      <div class="admin-order-card">
        <h2 class="admin-order-id">No Orders Found</h2>
        <p class="admin-order-date">There are no matching orders available.</p>
      </div>
    `;
    updateStats([]);
    return;
  }

  filteredOrders.reverse().forEach((order, index) => {
    let statusClass = "";

    if (order.status === "Pending") {
      statusClass = "status-pending";
    }

    if (order.status === "Paid") {
      statusClass = "status-paid";
    }

    if (order.status === "Shipped") {
      statusClass = "status-shipped";
    }

    if (order.status === "Delivered") {
      statusClass = "status-delivered";
    }

    const itemsHTML = order.items.map(item => `
      <div class="admin-order-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="admin-order-item-info">
          <h4>${item.name}</h4>
          <p>Qty: ${item.qty} • $${item.price}</p>
        </div>
      </div>
    `).join("");

    adminOrdersGrid.innerHTML += `
      <div class="admin-order-card">
        <div class="admin-order-top">
          <div>
            <h2 class="admin-order-id">${order.orderId}</h2>
            <p class="admin-order-customer">${order.customerName || "Guest Customer"}</p>
            <p class="admin-order-date">${order.date}</p>
          </div>

          <div class="admin-order-status ${statusClass}">
            ${order.status}
          </div>
        </div>

        <div class="admin-order-items">
          ${itemsHTML}
        </div>

        <div class="admin-order-footer">
          <div>
            <span class="admin-order-total-label">Order Total</span>
            <h3 class="admin-order-total">$${order.total}</h3>
          </div>

          <div class="admin-order-actions">
            <button class="admin-btn admin-btn-view" onclick="viewOrder(${index})">
              View
            </button>

            <select class="admin-btn admin-btn-update" onchange="updateOrderStatus(${index}, this.value)">
              <option value="">Update Status</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>
    `;
  });

  updateStats(filteredOrders);
}

function updateOrderStatus(index, newStatus) {
  if (!newStatus) return;

  orders[index].status = newStatus;

  localStorage.setItem("orders", JSON.stringify(orders));
  renderAdminOrders(getFilteredOrders());
}

function viewOrder(index) {
  const order = orders[index];

  alert(`
Order ID: ${order.orderId}
Customer: ${order.customerName || "Guest Customer"}
Date: ${order.date}
Status: ${order.status}
Total: $${order.total}
Items: ${order.items.length}
  `);
}

function getFilteredOrders() {
  const searchValue = searchInput.value.toLowerCase();
  const statusValue = statusFilter.value;

  return orders.filter(order => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchValue) ||
      (order.customerName || "").toLowerCase().includes(searchValue);

    const matchesStatus =
      statusValue === "" || order.status === statusValue;

    return matchesSearch && matchesStatus;
  });
}

searchInput.addEventListener("input", () => {
  renderAdminOrders(getFilteredOrders());
});

statusFilter.addEventListener("change", () => {
  renderAdminOrders(getFilteredOrders());
});

renderAdminOrders();