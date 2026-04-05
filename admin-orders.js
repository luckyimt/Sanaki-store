let orders = JSON.parse(localStorage.getItem("orders")) || [];

function renderAdminOrders(filter = "") {
  const container = document.getElementById("adminOrders");
  container.innerHTML = "";

  const filteredOrders = orders.filter(order => {
    return (
      order.orderId.toLowerCase().includes(filter.toLowerCase()) ||
      order.status.toLowerCase().includes(filter.toLowerCase())
    );
  });

  if (filteredOrders.length === 0) {
    container.innerHTML = `
      <div class="empty-orders">
        No orders found
      </div>
    `;
    return;
  }

  filteredOrders.forEach(order => {
    let statusClass = "";

    if (order.status === "Pending") statusClass = "status-pending";
    if (order.status === "Paid") statusClass = "status-paid";
    if (order.status === "Shipped") statusClass = "status-shipped";

    const itemsHTML = order.items.map(item => `
      <div class="order-item">
        <span>${item.name} x ${item.qty}</span>
        <span>$${item.price * item.qty}</span>
      </div>
    `).join("");

    container.innerHTML += `
      <div class="order-card">
        
        <div class="order-header">
          <div>
            <div class="order-id">${order.orderId}</div>
            <div class="order-date">${order.date}</div>
          </div>

          <span class="status ${statusClass}">
            ${order.status}
          </span>
        </div>

        <div class="order-items">
          ${itemsHTML}
        </div>

        <div class="order-footer">
          <div class="order-total">
            Total: $${order.total}
          </div>

          <select
            class="status-select"
            onchange="updateStatus('${order.orderId}', this.value)"
          >
            <option value="Pending" ${order.status === "Pending" ? "selected" : ""}>Pending</option>
            <option value="Paid" ${order.status === "Paid" ? "selected" : ""}>Paid</option>
            <option value="Shipped" ${order.status === "Shipped" ? "selected" : ""}>Shipped</option>
          </select>
        </div>

      </div>
    `;
  });
}

function updateStatus(orderId, newStatus) {
  orders = orders.map(order => {
    if (order.orderId === orderId) {
      order.status = newStatus;
    }
    return order;
  });

  localStorage.setItem("orders", JSON.stringify(orders));
  renderAdminOrders(document.getElementById("orderSearch").value);
}

document.getElementById("orderSearch").addEventListener("input", function(e) {
  renderAdminOrders(e.target.value);
});

renderAdminOrders();