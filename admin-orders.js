let orders = JSON.parse(localStorage.getItem("orders")) || [];

function renderAdminOrders() {
  const container = document.getElementById("adminOrders");
  container.innerHTML = "";

  orders.forEach(order => {
    container.innerHTML += `
      <div class="card">
        <h3>${order.orderId}</h3>
        <p>Total: $${order.total}</p>

        <select onchange="updateStatus('${order.orderId}', this.value)">
          <option ${order.status==="Pending"?"selected":""}>Pending</option>
          <option ${order.status==="Paid"?"selected":""}>Paid</option>
          <option ${order.status==="Shipped"?"selected":""}>Shipped</option>
        </select>
      </div>
    `;
  });
}

function updateStatus(id, status) {
  orders = orders.map(o => {
    if (o.orderId === id) {
      o.status = status;
    }
    return o;
  });

  localStorage.setItem("orders", JSON.stringify(orders));
  renderAdminOrders();
}

renderAdminOrders();