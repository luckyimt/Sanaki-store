let orders = JSON.parse(localStorage.getItem("orders")) || [];

function renderAdminOrders() {
  const container = document.getElementById("adminOrders");
  container.innerHTML = "";

  updateOrderStats();

  if (orders.length === 0) {
    container.innerHTML = `
      <div class="card empty-orders">
        <h3>No Orders Found</h3>
        <p>Customer orders will appear here.</p>
      </div>
    `;
    return;
  }

  orders.slice().reverse().forEach(order => {
    let statusClass = "status-pending";

    if (order.status === "Paid") {
      statusClass = "status-paid";
    }

    if (order.status === "Shipped") {
      statusClass = "status-shipped";
    }

    container.innerHTML += `
      <div class="card admin-order-card">

        <div class="order-top">
          <div>
            <h3>${order.orderId}</h3>
            <p class="order-date">${order.date}</p>
          </div>

          <div class="order-top-right">
            <span class="status ${statusClass}">
              ${order.status}
            </span>

            <select class="status-select" onchange="updateStatus('${order.orderId}', this.value)">
              <option value="Pending" ${order.status === "Pending" ? "selected" : ""}>Pending</option>
              <option value="Paid" ${order.status === "Paid" ? "selected" : ""}>Paid</option>
              <option value="Shipped" ${order.status === "Shipped" ? "selected" : ""}>Shipped</option>
            </select>
          </div>
        </div>

        <div class="order-summary">
          <div class="summary-box">
            <span>Total Items</span>
            <strong>${order.items.reduce((sum, item) => sum + item.qty, 0)}</strong>
          </div>

          <div class="summary-box">
            <span>Order Total</span>
            <strong>$${order.total.toFixed(2)}</strong>
          </div>
        </div>

        <div class="order-items">
          ${order.items.map(item => `
            <div class="order-item">
              <img src="${item.image}" alt="${item.name}" class="order-item-image">

              <div class="order-item-info">
                <h4>${item.name}</h4>
                <p>$${item.price}</p>
              </div>

              <div class="order-item-qty">
                Qty: ${item.qty}
              </div>

              <div class="order-item-total">
                $${(item.price * item.qty).toFixed(2)}
              </div>
            </div>
          `).join("")}
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
  renderAdminOrders();
}

function updateOrderStats() {
  document.getElementById("totalOrders").innerText = orders.length;

  document.getElementById("pendingOrders").innerText =
    orders.filter(order => order.status === "Pending").length;

  document.getElementById("shippedOrders").innerText =
    orders.filter(order => order.status === "Shipped").length;
}

renderAdminOrders();