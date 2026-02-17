//1//

function getCurrentUserSafe() {
  const user = sessionStorage.getItem("currentUser");
  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch (err) {
    console.error("Invalid user JSON", err);
    return null;
  }
}


//2//

function toList(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === "object") return Object.values(data);
  return [];
}

//-//
function getList(key) {
  const data = localStorage.getItem(key);
  if (!data) return [];

  try {
    return toList(JSON.parse(data));
  } catch {
    return [];
  }
}


//3//

const currentUser = getCurrentUserSafe();

if (!currentUser || currentUser.role !== "admin") {
  window.location.href = "login.html";
}
 //4//

 let sales = JSON.parse(localStorage.getItem("sales_db")) || [];
let products = JSON.parse(localStorage.getItem("products_db")) || [];
let users = JSON.parse(localStorage.getItem("users_db")) || [];

//5//

function updateStats() {
  const sales = getList("sales_db");
  const products = getList("products_db");

  const totalRevenue = sales.reduce((sum, sale) => {
    return sum + Number(sale.total || 0);
  }, 0);

  document.getElementById("totalRevenue").innerText =
    formatCurrency(totalRevenue);

  document.getElementById("ordersCount").innerText = sales.length;
  document.getElementById("productsCount").innerText = products.length;
}

//6//

document.getElementById("logoutBtn").addEventListener("click", () => {
  sessionStorage.clear();
  window.location.href = "login.html";
});

//7//

document.getElementById("addProductForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = productName.value.trim();
  const price = Number(productPrice.value);
  const stock = Number(productStock.value);
  const barcode = productBarcode.value || Date.now();
  const category = productCategory.value;
  const imageFile = productImage.files[0];

  if (!name) return showToast("اسم المنتج مطلوب");
  if (price < 0 || isNaN(price)) return showToast("سعر غير صالح");
  if (stock < 0 || isNaN(stock)) return showToast("كمية غير صالحة");

  const saveProduct = (imageBase64) => {
    const products = getList("products_db");

    products.push({
      id: Date.now(),
      barcode,
      name,
      price,
      stock,
      category,
      image: imageBase64,
    });

    localStorage.setItem("products_db", JSON.stringify(products));
    showToast("تمت إضافة المنتج بنجاح ✅");
    this.reset();
    renderProducts();
    updateStats();
  };

  if (imageFile) {
    const reader = new FileReader();
    reader.onload = () => saveProduct(reader.result);
    reader.readAsDataURL(imageFile);
  } else {
    saveProduct("default.png");
  }
});

 //8//

 function toggleModal(id, show) {
  const modal = document.getElementById(id);
  if (!modal) return;

  if (show) {
    modal.classList.remove("hidden");
  } else {
    modal.classList.add("hidden");
  }
}



//9//

function printInvoice() {
  if (!selectedSale) {
    return showToast("لا توجد فاتورة للطباعة");
  }
  window.print();
}
  

