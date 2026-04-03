let products = JSON.parse(localStorage.getItem("products")) || [];
let selectedImage = "";

// IMAGE PREVIEW + CONVERT TO BASE64
document.getElementById("pImage").addEventListener("change", function(e) {
  const file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function(event) {
    selectedImage = event.target.result;

    const preview = document.getElementById("previewImage");
    preview.src = selectedImage;
    preview.style.display = "block";
  };

  reader.readAsDataURL(file);
});

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



// ADD PRODUCT
function addProduct() {
  const product = {
    id: Date.now(),
    name: document.getElementById("pName").value.trim(),
    price: Number(document.getElementById("pPrice").value),
    stock: Number(document.getElementById("pStock").value),
    image: selectedImage
  };

  if (!product.name || !product.price || !product.stock || !product.image) {
    alert("Please fill all product fields");
    return;
  }

  products.push(product);
  localStorage.setItem("products", JSON.stringify(products));

  document.getElementById("pName").value = "";
  document.getElementById("pPrice").value = "";
  document.getElementById("pStock").value = "";
  document.getElementById("pImage").value = "";
  document.getElementById("previewImage").style.display = "none";

  selectedImage = "";

  renderProducts();
}

// DISPLAY PRODUCTS
function renderProducts() {
  const container = document.getElementById("productList");
  container.innerHTML = "";

  products.forEach(p => {
    container.innerHTML += `
      <div class="card">
        <img src="${p.image}" width="100%">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>
        <p>Stock: ${p.stock}</p>

        <button onclick="deleteProduct(${p.id})">Delete</button>
      </div>
    `;
  });
}

// DELETE
function deleteProduct(id) {
  products = products.filter(p => p.id !== id);
  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();
}

renderProducts();



//--stock mng

function updateStock(id, amount) {
  let products = JSON.parse(localStorage.getItem("products")) || [];

  products = products.map(p => {
    if (p.id === id) {
      p.stock += amount;
    }
    return p;
  });

  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();
}