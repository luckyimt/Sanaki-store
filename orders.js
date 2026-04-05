let orders = JSON.parse(localStorage.getItem("orders")) || [];

function renderOrders() {
  const container = document.getElementById("ordersList");
  container.innerHTML = "";

  orders.forEach(order => {
    container.innerHTML += `
      <div class="card order-card">
        
        <div class="order-header">
          <div>
            <h3>${order.orderId}</h3>
            <p class="order-date">${order.date}</p>
          </div>

          <span class="status status-${order.status.toLowerCase()}">
            ${order.status}
          </span>
        </div>

        <div class="order-summary">
          <p>Total: <strong>$${order.total}</strong></p>
          <p>${order.items.length} Item(s)</p>
        </div>

        <div class="order-items">
          ${order.items.map(item => `
            <div class="order-item">
              
              <div class="order-image">
                <img src="${item.image}" alt="${item.name}">
              </div>

              <div class="order-info">
                <h4>${item.name}</h4>
                <p>$${item.price}</p>
                <p>Quantity: ${item.qty}</p>
              </div>

            </div>
          `).join("")}
        </div>

      </div>
    `;
  });
}

renderOrders();