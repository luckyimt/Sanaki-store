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