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
      <div class="card product-card">
        <img src="${p.image}" alt="${p.name}">
        
        <div class="mt-2">
          <h3>${p.name}</h3>
          <p class="price">$${p.price}</p>
          <p>Stock: ${p.stock}</p>
          
        </div>

        <div class="flex mt-2">
          <button onclick="updateStock(${p.id}, 1)">+ Stock</button>
          <button onclick="updateStock(${p.id}, -1)">- Stock</button>
          <button class="btn btn-danger" onclick="deleteProduct(${p.id})">Delete</button>
        </div>
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


//STOCK UPDATE
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