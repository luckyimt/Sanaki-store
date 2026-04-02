const adminOrdersList = document.getElementById("adminOrdersList");
const orderSearch = document.getElementById("orderSearch");
const statusFilter = document.getElementById("statusFilter");

let orders = JSON.parse(localStorage.getItem("orders")) || [];

function updateDashboardStats(filteredOrders) {
  const totalOrders = filteredOrders.length;
  const pendingOrders = filteredOrders.filter(order => order.status === "Pending").length;

  const totalRevenue = filteredOrders.reduce((sum, order) => {
    return sum + Number(order.total);
  }, 0);

  document.getElementById("totalOrders").textContent = totalOrders;
  document.getElementById("pendingOrders").textContent = pendingOrders;
  document.getElementById("totalRevenue").textContent = `$${totalRevenue}`;
}

function getStatusClass(status) {
  if (status === "Pending") return "status-pending";
  if (status === "Paid") return "status-paid";
  if (status === "Shipped") return "status-shipped";
  if (status === "Delivered") return "status-delivered";
  return "";
}

function renderOrders(filteredOrders = orders) {
  adminOrdersList.innerHTML = "";

  if (filteredOrders.length === 0) {
    adminOrdersList.innerHTML = `
      <div class="empty-orders">
        <h2>No Orders Found</h2>
        <p>No orders match your current filters.</p>
      </div>
    `;
    updateDashboardStats([]);
    return;
  }

  filteredOrders.slice().reverse().forEach((order, index) => {
    const itemsHTML = order.items.map(item => `
      <div class="admin-order-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="admin-order-item-details">
          <div class="admin-order-item-name">${item.name}</div>
          <div class="admin-order-item-info">
            Qty: ${item.qty} • $${item.price}
          </div>
        </div>
      </div>
    `).join("");

    adminOrdersList.innerHTML += `
      <div class="admin-order-card">
        <div class="admin-order-top">
          <div>
            <div class="admin-order-id">${order.orderId}</div>
            <div class="admin-order-meta">Customer: ${order.customerName || "Guest Customer"}</div>
            <div class="admin-order-meta">Date: ${order.date}</div>
            <div class="admin-order-meta">Items: ${order.items.length}</div>
          </div>

          <div class="admin-order-status ${getStatusClass(order.status)}">
            ${order.status}
          </div>
        </div>

        <div class="admin-order-items">
          ${itemsHTML}
        </div>

        <div class="admin-order-footer">
          <div>
            <div class="admin-order-total-label">Order Total</div>
            <div class="admin-order-total">$${order.total}</div>
          </div>

          <div class="admin-order-actions">
            <button class="view-btn" onclick="viewOrderDetails(${index})">
              View Details
            </button>

            <select class="status-select" onchange="changeOrderStatus(${index}, this.value)">
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

  updateDashboardStats(filteredOrders);
}

function changeOrderStatus(index, newStatus) {
  if (!newStatus) return;

  const reversedOrders = [...orders].reverse();
  const selectedOrder = reversedOrders[index];
  const originalIndex = orders.findIndex(order => order.orderId === selectedOrder.orderId);

  if (originalIndex !== -1) {
    orders[originalIndex].status = newStatus;
    localStorage.setItem("orders", JSON.stringify(orders));
    renderOrders(getFilteredOrders());
  }
}

function viewOrderDetails(index) {
  const reversedOrders = [...orders].reverse();
  const order = reversedOrders[index];

  alert(`
Order ID: ${order.orderId}
Customer: ${order.customerName || "Guest Customer"}
Date: ${order.date}
Status: ${order.status}
Items: ${order.items.length}
Total: $${order.total}
  `);
}

function getFilteredOrders() {
  const searchValue = orderSearch.value.toLowerCase();
  const selectedStatus = statusFilter.value;

  return orders.filter(order => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchValue) ||
      (order.customerName || "").toLowerCase().includes(searchValue);

    const matchesStatus =
      selectedStatus === "" || order.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });
}

orderSearch.addEventListener("input", () => {
  renderOrders(getFilteredOrders());
});

statusFilter.addEventListener("change", () => {
  renderOrders(getFilteredOrders());
});

renderOrders();