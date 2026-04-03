<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
const orders = JSON.parse(localStorage.getItem("orders")) || [];
const products = JSON.parse(localStorage.getItem("products")) || [];

const totalRevenue = orders.reduce((sum, order) => {
  return sum + Number(order.total || 0);
}, 0);

document.getElementById("dashboardRevenue").textContent = "$" + totalRevenue;
document.getElementById("dashboardOrders").textContent = orders.length;
document.getElementById("dashboardProducts").textContent = products.length;

const lowStockProducts = products.filter(product => Number(product.stock) <= 5);
document.getElementById("dashboardLowStock").textContent = lowStockProducts.length;

const pendingOrders = orders.filter(order => order.status === "Pending").length;
const paidOrders = orders.filter(order => order.status === "Paid").length;
const shippedOrders = orders.filter(order => order.status === "Shipped").length;
const deliveredOrders = orders.filter(order => order.status === "Delivered").length;

document.getElementById("pendingCount").textContent = pendingOrders;
document.getElementById("paidCount").textContent = paidOrders;
document.getElementById("shippedCount").textContent = shippedOrders;
document.getElementById("deliveredCount").textContent = deliveredOrders;

const recentOrdersList = document.getElementById("recentOrdersList");

orders.slice().reverse().slice(0, 5).forEach(order => {
  recentOrdersList.innerHTML += `
    <div class="recent-order-item">
      <div class="recent-order-info">
        <h4>${order.orderId}</h4>
        <p>${order.customerName || "Guest Customer"}</p>
      </div>
      <div class="recent-order-total">$${order.total}</div>
    </div>
  `;
});

const lowStockList = document.getElementById("lowStockList");

if (lowStockProducts.length === 0) {
  lowStockList.innerHTML = `
    <div class="low-stock-item">
      <div class="low-stock-info">
        <h4>No Low Stock Products</h4>
        <p>All products have sufficient stock.</p>
      </div>
    </div>
  `;
} else {
  lowStockProducts.forEach(product => {
    lowStockList.innerHTML += `
      <div class="low-stock-item">
        <div class="low-stock-info">
          <h4>${product.name}</h4>
          <p>Remaining stock</p>
        </div>
        <div class="low-stock-qty">${product.stock}</div>
      </div>
    `;
  });
}

const monthlyRevenue = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

orders.forEach(order => {
  if (!order.date) return;

  const date = new Date(order.date);
  const month = date.getMonth();

  if (!isNaN(month)) {
    monthlyRevenue[month] += Number(order.total || 0);
  }
});

const ctx = document.getElementById("revenueChart").getContext("2d");

new Chart(ctx, {
  type: "line",
  data: {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    datasets: [{
      label: "Revenue",
      data: monthlyRevenue,
      borderColor: "#4f46e5",
      backgroundColor: "rgba(79,70,229,0.12)",
      fill: true,
      tension: 0.4,
      borderWidth: 3,
      pointRadius: 5,
      pointBackgroundColor: "#4f46e5"
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});
</script>

//-admin nav
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