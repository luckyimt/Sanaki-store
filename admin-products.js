let products = JSON.parse(localStorage.getItem("products")) || [];

// ADD PRODUCT
function addProduct() {
  const product = {
    id: Date.now(),
    name: document.getElementById("pName").value,
    price: Number(document.getElementById("pPrice").value),
    image: document.getElementById("pImage").value,
    stock: Number(document.getElementById("pStock").value)
  };

  products.push(product);
  localStorage.setItem("products", JSON.stringify(products));

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
        <button onclick="updateStock(${p.id}, -1)">- Stock</button>
        <p>Stock: ${p.stock}</p>
        <button onclick="updateStock(${p.id}, 1)">+ Stock</button>
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