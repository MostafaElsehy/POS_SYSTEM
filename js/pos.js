import { initialProducts, DEFAULT_IMG } from "./data.js";
import { addToCartLogic, removeFromCartLogic, calculateTotal } from "./cart.js";
import { formatMoney, showToast, getTodayDate } from "./utils.js";
import { saveToLocal, getFromLocal } from "./storage.js";

function getCurrentUserSafe() {
  try {
    const raw = sessionStorage.getItem("currentUser");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error("Failed to parse currentUser from sessionStorage", e);
    return null;
  }
}

const user = getCurrentUserSafe();

if (!user) {
  window.location.href = "index.html";
} else if (user.role === "admin") {
  window.location.href = "dashboard.html";
} else {
  const userNameEl = document.getElementById("user-name");
  if (userNameEl) {
    userNameEl.textContent = user.username;
  }
}

// Load Data
let products = getFromLocal("products_db");
// Seed with initial products + any existing stored products (no duplicates by id)
if (!Array.isArray(products)) {
  products = [];
}
{
  const byId = new Map();
  // 1) initial products
  for (const p of initialProducts) {
    if (!p || typeof p !== "object") continue;
    byId.set(p.id, { ...p });
  }
  // 2) stored products (admin-added override defaults)
  for (const p of products) {
    if (!p || typeof p !== "object") continue;
    byId.set(p.id, { ...p });
  }
  products = Array.from(byId.values());
  saveToLocal("products_db", products);
}

let cart = [];

function renderProducts(filterTerm = "") {
  const grid = document.getElementById("grid-products");

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(filterTerm.toLowerCase()) ||
      (p.barcode && p.barcode.includes(filterTerm)),
  );

  if (filtered.length === 0) {
    grid.innerHTML =
      '<p style="text-align:center; width:100%; grid-column:1/-1;">No products found.</p>';
    return;
  }

  grid.innerHTML = filtered
    .map(
      (p) => `
        <div class="product-card ${p.stock <= 0 ? "out-of-stock" : ""}" onclick="window.addItem(${p.id})">
            <img src="${p.image || DEFAULT_IMG}" alt="prod">
            <h3>${p.name}</h3>
            <div class="price">${formatMoney(p.price)}</div>
            <div class="stock">${p.stock} In Stock</div>
        </div>
    `,
    )
    .join("");
}

window.addItem = (id) => {
  const product = products.find((p) => p.id === id);
  if (!product) {
    return showToast("Product not found", "error");
  }
  const cartItem = cart.find((c) => c.id === id);
  const currentQty = cartItem ? cartItem.qty : 0;

  if (currentQty >= product.stock) {
    return showToast("Out of Stock!", "error");
  }

  cart = addToCartLogic(cart, product);
  updateCartUI();
};

window.removeItem = (id) => {
  cart = removeFromCartLogic(cart, id);
  updateCartUI();
};

function updateCartUI() {
  const container = document.getElementById("cart-items");
  container.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
            <div class="cart-item-details">
                <b>${item.name}</b>
                <span>${formatMoney(item.price)} x ${item.qty}</span>
            </div>
            <div class="qty-controls">
                <button class="qty-btn" onclick="window.removeItem(${item.id})">-</button>
                <span style="font-weight:bold">${item.qty}</span>
                <button class="qty-btn" onclick="window.addItem(${item.id})">+</button>
            </div>
        </div>
    `,
    )
    .join("");

  document.getElementById("total-price").textContent = formatMoney(
    calculateTotal(cart),
  );
  container.scrollTop = container.scrollHeight;
}

let barcodeBuffer = "";
document.addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT") return;

  if (e.key === "Enter") {
    if (barcodeBuffer.length > 0) {
      const product = products.find((p) => p.barcode === barcodeBuffer);
      if (product) {
        window.addItem(product.id);
        showToast(`Scanned: ${product.name}`);
      } else {
        showToast("Product Not Found!", "error");
      }
      barcodeBuffer = "";
    }
  } else if (e.key.length === 1) {
    barcodeBuffer += e.key;
  }
});

document.getElementById("checkout-btn").addEventListener("click", () => {
  if (cart.length === 0) return showToast("Cart is Empty!", "error");

  // 1. خصم المخزون
  products = products.map((p) => {
    const item = cart.find((c) => c.id === p.id);
    if (!item) return p;
    const newStock = p.stock - item.qty;
    return { ...p, stock: newStock < 0 ? 0 : newStock };
  });
  saveToLocal("products_db", products);

  // 2. حفظ البيعة
  const sale = {
    id: Date.now(),
    date: getTodayDate(),
    cashier: user.username,
    total: calculateTotal(cart),
    items: [...cart],
  };

  // هات المبيعات القديمة وضيف الجديدة
  let sales = getFromLocal("sales_db");
  if (!Array.isArray(sales)) {
    sales = sales && typeof sales === "object" ? Object.values(sales) : [];
  }
  sales.push(sale);
  saveToLocal("sales_db", sales);

  showReceipt(sale);
  cart = [];
  renderProducts();
  updateCartUI();
});

function showReceipt(sale) {
  const modal = document.getElementById("receipt-modal");
  const content = document.getElementById("receipt-content");

  const itemsHTML = sale.items
    .map(
      (i) => `
        <div class="receipt-row"><span>${i.qty} x ${i.name}</span><span>${formatMoney(i.price * i.qty)}</span></div>
    `,
    )
    .join("");

  content.innerHTML = `
        <center><h3>GENERAL STORE</h3></center>
        <p>Date: ${sale.date}<br>Cashier: ${sale.cashier}</p>
        <hr style="border-top: 1px dashed #000">
        ${itemsHTML}
        <div class="receipt-total"><div class="receipt-row"><span>TOTAL</span><span>${formatMoney(sale.total)}</span></div></div>
        <center><p>Thank You!</p></center>
    `;
  modal.classList.remove("hidden");
}

document.getElementById("close-modal").addEventListener("click", () => {
  document.getElementById("receipt-modal").classList.add("hidden");
});
document
  .getElementById("print-btn")
  .addEventListener("click", () => window.print());

document.getElementById("logout-btn").addEventListener("click", () => {
  sessionStorage.clear();
  window.location.href = "index.html";
});

document.getElementById("search-input").addEventListener("input", (e) => {
  renderProducts(e.target.value);
});

renderProducts();
