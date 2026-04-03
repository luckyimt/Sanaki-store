let orders = JSON.parse(localStorage.getItem("orders")) || [];

const ordersGrid = document.getElementById("ordersGrid");

function renderOrders() {
  ordersGrid.innerHTML = "";

  if (orders.length === 0) {
    ordersGrid.innerHTML = `
      <div class="order-card">
        <div class="text-center">
          <h2 class="order-id">No Orders Yet</h2>
          <p class="order-date">Your placed orders will appear here.</p>
        </div>
      </div>
    `;
    return;
  }

  orders.reverse().forEach(order => {
    let statusClass = "";
    let pendingActive = "";
    let paidActive = "";
    let shippedActive = "";

    if (order.status === "Pending") {
      statusClass = "status-pending";
      pendingActive = "active";
    }

    if (order.status === "Paid") {
      statusClass = "status-paid";
      pendingActive = "active";
      paidActive = "active";
    }

    if (order.status === "Shipped") {
      statusClass = "status-shipped";
      pendingActive = "active";
      paidActive = "active";
      shippedActive = "active";
    }

    const itemsHTML = order.items.map(item => {
      return `
        <div class="order-item">
          <img src="${item.image}" alt="${item.name}">

          <div class="order-item-details">
            <div class="order-item-name">${item.name}</div>
            <div class="order-item-meta">
              Qty: ${item.qty} • $${item.price}
            </div>
          </div>
        </div>
      `;
    }).join("");

    ordersGrid.innerHTML += `
      <div class="order-card">

        <div class="order-top">
          <div>
            <h2 class="order-id">${order.orderId}</h2>
            <p class="order-date">${order.date}</p>
          </div>

          <div class="order-status ${statusClass}">
            ${order.status}
          </div>
        </div>

        <div class="order-items">
          ${itemsHTML}
        </div>

        <div class="order-footer">
          <div>
            <div class="order-total-label">Total</div>
            <div class="order-total">$${order.total}</div>
          </div>
        </div>

        <div class="order-progress">
          <div class="progress-step ${pendingActive}">
            <div class="progress-dot">✓</div>
            <div class="progress-label">Pending</div>
          </div>

          <div class="progress-step ${paidActive}">
            <div class="progress-dot">✓</div>
            <div class="progress-label">Paid</div>
          </div>

          <div class="progress-step ${shippedActive}">
            <div class="progress-dot">✓</div>
            <div class="progress-label">Shipped</div>
          </div>
        </div>

      </div>
    `;
  });
}

renderOrders();


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