let orders = JSON.parse(localStorage.getItem("orders")) || [];

function renderOrders() {
  const container = document.getElementById("ordersList");
  container.innerHTML = "";

  if (orders.length === 0) {
    container.innerHTML = `
      <div class="card empty-orders">
        <h3>No Orders Yet</h3>
        <p>Your completed purchases will appear here.</p>
      </div>
    `;
    return;
  }

  orders.reverse().forEach(order => {
    let statusClass = "status-pending";

    if (order.status === "Paid") {
      statusClass = "status-paid";
    }

    if (order.status === "Shipped") {
      statusClass = "status-shipped";
    }

    container.innerHTML += `
      <div class="card order-card">
        
        <div class="order-top">
          <div>
            <h3>${order.orderId}</h3>
            <p class="order-date">${order.date}</p>
          </div>

          <span class="status ${statusClass}">
            ${order.status}
          </span>
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

renderOrders();