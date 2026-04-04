let orders = JSON.parse(localStorage.getItem("orders")) || [];

function renderOrders() {
  const container = document.getElementById("ordersList");
  container.innerHTML = "";

  orders.forEach(order => {

    container.innerHTML += `
      <div class="card">
        <h3>${order.orderId}</h3>
        <p>Status: ${order.status}</p>
        <p>Date: ${order.date}</p>
        <p>Total: $${order.total}</p>

        <details>
          <summary>Items</summary>
          ${order.items.map(i => `
            <p>${i.name} x ${i.qty}</p>
          `).join("")}
        </details>
      </div>
    `;
  });
}

renderOrders();