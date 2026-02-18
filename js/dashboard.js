import { saveToLocal, getFromLocal } from "./storage.js";
import { formatMoney, convertImageToBase64, showToast } from "./utils.js";
import { DEFAULT_IMG } from "./data.js";

function getCurrentUserSafe() {
  try {
    const raw = sessionStorage.getItem("currentUser");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error("Failed to parse currentUser from sessionStorage", e);
    return null;
  }
}

const toList = (data) => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") return Object.values(data);
  return [];
};

const getList = (key) => toList(getFromLocal(key));

// 1. Security Check
const currentUser = getCurrentUserSafe();
if (!currentUser || currentUser.role !== "admin") {
  window.location.href = "index.html";
}

// 2. Load Data (قراءة مباشرة من المخزن بدون أي تعديل)
let sales = getList("sales_db");
let products = getList("products_db");
let users = getList("users_db");

function updateStats() {
  sales = getList("sales_db");
  products = getList("products_db");
  document.getElementById("total-revenue").textContent = formatMoney(
    sales.reduce((sum, s) => sum + (Number(s?.total) || 0), 0),
  );
  document.getElementById("total-orders").textContent = sales.length;
  document.getElementById("total-products").textContent = products.length;
}

// 3. Update Statistics
updateStats();

// === EVENT LISTENERS ===
document.getElementById("logout-btn").addEventListener("click", () => {
  sessionStorage.clear();
  window.location.href = "index.html";
});

document.getElementById("add-product-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("p-name").value.trim();
  const price = parseFloat(document.getElementById("p-price").value);
  const stock = parseInt(document.getElementById("p-stock").value);
  const barcode = document.getElementById("p-barcode").value;
  const category = document.getElementById("p-category").value;
  const fileInput = document.getElementById("p-image");

  if (
    !name ||
    Number.isNaN(price) ||
    Number.isNaN(stock) ||
    price < 0 ||
    stock < 0
  ) {
    return showToast(
      "Please enter valid product name, price and stock (non-negative numbers).",
      "error",
    );
  }

  const saveProduct = (imgBase64) => {
    // تحديث القائمة المحلية
    products = toList(getFromLocal("products_db"));
    products.push({
      id: Date.now(),
      barcode: barcode || Date.now().toString(),
      name,
      price,
      stock,
      category,
      image: imgBase64,
    });
    saveToLocal("products_db", products);

    showToast("Product Added", "success");
    e.target.reset();
    renderInventory();
    document.getElementById("total-products").textContent = products.length;
  };

  if (fileInput.files.length > 0) {
    convertImageToBase64(fileInput.files[0], saveProduct);
  } else {
    saveProduct(DEFAULT_IMG);
  }
});

// Modal Actions
const toggleModal = (id, show) => {
  const el = document.getElementById(id);
  if (show) el.classList.remove("hidden");
  else el.classList.add("hidden");
};

document
  .getElementById("cancel-delete-btn")
  .addEventListener("click", () => toggleModal("delete-modal", false));
document
  .getElementById("cancel-edit-btn")
  .addEventListener("click", () => toggleModal("edit-modal", false));
document
  .getElementById("close-sale-modal-btn")
  .addEventListener("click", () => toggleModal("sale-modal", false));
document.getElementById("sale-print-btn").addEventListener("click", () => {
  if (!currentSaleForModal) return;
  printSaleReceipt(currentSaleForModal);
});

document
  .getElementById("confirm-delete-btn")
  .addEventListener("click", executeDelete);
document
  .getElementById("save-stock-btn")
  .addEventListener("click", executeStockUpdate);

// === RENDER FUNCTIONS ===

function renderInventory() {
  const tbody = document.getElementById("inventory-body");
  // إعادة قراءة البيانات للتأكد
  products = getList("products_db");

  if (products.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="6" style="text-align:center">No Products Found</td></tr>';
    return;
  }

  tbody.innerHTML = products
    .map((p) => {
      let statusClass =
        p.stock === 0
          ? "status-out"
          : p.stock < 10
            ? "status-low"
            : "status-ok";
      let statusText =
        p.stock === 0 ? "Out" : p.stock < 10 ? "Low" : "In Stock";

      return `
            <tr>
                <td><img src="${p.image || DEFAULT_IMG}" alt="img"></td>
                <td><b>${p.name}</b><br><span style="font-size:0.8rem; color:#666">BC: ${p.barcode}</span></td>
                <td>${formatMoney(p.price)}</td>
                <td style="font-weight:bold">${p.stock}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>
                    <button onclick="window.prepareEditStock(${p.id})" class="btn btn-warning btn-sm">Edit</button>
                    <button onclick="window.prepareDelete('product', ${p.id})" class="btn btn-danger btn-sm">Delete</button>
                </td>
            </tr>`;
    })
    .join("");
}

function clearTbody(tbody) {
  while (tbody.firstChild) tbody.removeChild(tbody.firstChild);
}

let currentSaleForModal = null;

function buildReceiptHtml(sale) {
  const items = Array.isArray(sale?.items) ? sale.items : [];
  const itemsHTML = items
    .map(
      (i) => `
        <div class="receipt-row"><span>${Number(i?.qty) || 0} x ${i?.name ?? ""}</span><span>${formatMoney((Number(i?.price) || 0) * (Number(i?.qty) || 0))}</span></div>
    `,
    )
    .join("");

  return `
        <center><h3>GENERAL STORE</h3></center>
        <p>Date: ${sale?.date ?? ""}<br>Cashier: ${sale?.cashier ?? ""}</p>
        <hr style="border-top: 1px dashed #000">
        ${itemsHTML}
        <div class="receipt-total"><div class="receipt-row"><span>TOTAL</span><span>${formatMoney(Number(sale?.total) || 0)}</span></div></div>
        <center><p>Thank You!</p></center>
    `;
}

function renderSalesNew() {
  const tbody = document.getElementById("sales-table-body");
  if (!tbody) return;
  clearTbody(tbody);

  sales = getList("sales_db");
  const reversedSales = [...sales].reverse();

  if (reversedSales.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 5;
    td.style.textAlign = "center";
    td.textContent = "No Sales Yet";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  for (const sale of reversedSales) {
    const tr = document.createElement("tr");

    const tdDate = document.createElement("td");
    tdDate.style.fontSize = "0.9rem";
    tdDate.textContent = sale?.date ?? "";

    const tdCashier = document.createElement("td");
    tdCashier.style.fontWeight = "bold";
    tdCashier.textContent = sale?.cashier ?? "";

    const tdTotal = document.createElement("td");
    tdTotal.style.color = "var(--success)";
    tdTotal.style.fontWeight = "bold";
    tdTotal.textContent = formatMoney(Number(sale?.total) || 0);

    const tdCount = document.createElement("td");
    const itemsCount = Array.isArray(sale?.items) ? sale.items.length : 0;
    tdCount.textContent = `${itemsCount} Items`;

    const tdActions = document.createElement("td");

    const viewBtn = document.createElement("button");
    viewBtn.className = "btn btn-primary btn-sm";
    viewBtn.textContent = "View";
    viewBtn.addEventListener("click", () => openSaleModal(sale));
    tdActions.appendChild(viewBtn);

    const reprintBtn = document.createElement("button");
    reprintBtn.className = "btn btn-secondary btn-sm";
    reprintBtn.style.marginLeft = "6px";
    reprintBtn.textContent = "Reprint";
    reprintBtn.addEventListener("click", () => {
      printSaleReceipt(sale);
    });
    tdActions.appendChild(reprintBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-danger btn-sm";
    deleteBtn.style.marginLeft = "6px";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteSale(sale.id));
    tdActions.appendChild(deleteBtn);

    tr.appendChild(tdDate);
    tr.appendChild(tdCashier);
    tr.appendChild(tdTotal);
    tr.appendChild(tdCount);
    tr.appendChild(tdActions);
    tbody.appendChild(tr);
  }
}

function renderUsersNew() {
  const tbody = document.getElementById("users-table-body");
  if (!tbody) return;
  clearTbody(tbody);

  users = getList("users_db");

  if (users.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 4;
    td.style.textAlign = "center";
    td.textContent = "No Users Found";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  for (const u of users) {
    const tr = document.createElement("tr");

    const tdName = document.createElement("td");
    tdName.style.fontWeight = "bold";
    tdName.textContent = `${u?.username ?? ""}${u?.username === currentUser.username ? " (You)" : ""}`;

    const tdRole = document.createElement("td");
    const roleBadge = document.createElement("span");
    const role = (u?.role ?? "").toString();
    roleBadge.className = `status-badge ${role === "admin" ? "status-out" : "status-ok"}`;
    roleBadge.textContent = role ? role.toUpperCase() : "";
    tdRole.appendChild(roleBadge);

    const tdPass = document.createElement("td");
    tdPass.style.fontFamily = "monospace";
    const passwordSpan = document.createElement("span");
    passwordSpan.textContent = "••••••";
    passwordSpan.dataset.masked = "true";

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "btn btn-secondary btn-sm";
    toggleBtn.style.marginLeft = "6px";
    toggleBtn.textContent = "Show";
    toggleBtn.addEventListener("click", () => {
      const isMasked = passwordSpan.dataset.masked === "true";
      if (isMasked) {
        passwordSpan.textContent = u?.password ?? "";
        passwordSpan.dataset.masked = "false";
        toggleBtn.textContent = "Hide";
      } else {
        passwordSpan.textContent = "••••••";
        passwordSpan.dataset.masked = "true";
        toggleBtn.textContent = "Show";
      }
    });

    tdPass.appendChild(passwordSpan);
    tdPass.appendChild(toggleBtn);

    const tdActions = document.createElement("td");
    if (u?.username === currentUser.username) {
      const span = document.createElement("span");
      span.style.color = "#aaa";
      span.textContent = "Cannot Delete";
      tdActions.appendChild(span);
    } else {
      const btn = document.createElement("button");
      btn.className = "btn btn-danger btn-sm";
      btn.textContent = "Delete";
      btn.addEventListener("click", () =>
        window.prepareDelete("user", u?.username),
      );
      tdActions.appendChild(btn);
    }

    tr.appendChild(tdName);
    tr.appendChild(tdRole);
    tr.appendChild(tdPass);
    tr.appendChild(tdActions);
    tbody.appendChild(tr);
  }
}

// === Global Handlers ===
let deleteTarget = { type: null, id: null };
let editTargetId = null;

window.prepareDelete = (type, id) => {
  deleteTarget = { type, id };
  let msg = "Are you sure?";
  if (type === "product") msg = "Delete product?";
  else if (type === "user") msg = `Delete user "${id}"?`;
  else if (type === "sale") msg = "Delete this sale?";
  document.getElementById("delete-msg").textContent = msg;
  toggleModal("delete-modal", true);
};

function deleteSale(id) {
  window.prepareDelete("sale", id);
}

window.prepareEditStock = (id) => {
  editTargetId = id;
  const p = products.find((p) => p.id === id);
  if (!p) {
    showToast("Product not found", "error");
    return;
  }
  document.getElementById("edit-product-name").textContent = p.name;
  document.getElementById("new-stock-input").value = p.stock;
  toggleModal("edit-modal", true);
};

function openSaleModal(sale) {
  if (!sale) return;
  currentSaleForModal = sale;
  const content = document.getElementById("sale-receipt-content");
  if (content) content.innerHTML = buildReceiptHtml(sale);

  toggleModal("sale-modal", true);
}

function printSaleReceipt(sale) {
  // Print via dedicated window to avoid dashboard @media print hiding content
  const popup = window.open("", "_blank", "width=380,height=600");
  if (!popup) {
    showToast("Popup blocked. Please allow popups to print.", "error");
    return;
  }

  const html = buildReceiptHtml(sale);
  popup.document.open();
  popup.document.write(`
        <!doctype html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Receipt</title>
            <style>
                body { font-family: "Courier New", monospace; margin: 0; padding: 0; }
                .receipt-paper { padding: 12px; }
                .receipt-row { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 12px; }
                .receipt-total { border-top: 2px dashed #000; margin-top: 10px; padding-top: 10px; font-weight: bold; font-size: 14px; }
                h3 { margin: 0 0 8px 0; }
                p { margin: 6px 0; font-size: 12px; }
                @page { margin: 0; }
            </style>
        </head>
        <body>
            <div class="receipt-paper">
                ${html}
            </div>
        </body>
        </html>
    `);
  popup.document.close();

  // Ensure render before printing
  popup.focus();
  popup.onload = () => {
    popup.print();
    popup.close();
  };
}

function executeDelete() {
  if (deleteTarget.type === "product") {
    products = products.filter((p) => p.id !== deleteTarget.id);
    saveToLocal("products_db", products);
    renderInventory();
    document.getElementById("total-products").textContent = products.length;
  } else if (deleteTarget.type === "user") {
    users = users.filter((u) => u.username !== deleteTarget.id);
    saveToLocal("users_db", users);
    renderUsersNew();
  } else if (deleteTarget.type === "sale") {
    sales = sales.filter((s) => s.id !== deleteTarget.id);
    saveToLocal("sales_db", sales);
    renderSalesNew();
    updateStats();
  }
  showToast("Deleted Successfully");
  toggleModal("delete-modal", false);
}

function executeStockUpdate() {
  const val = parseInt(document.getElementById("new-stock-input").value);
  const p = products.find((p) => p.id === editTargetId);
  if (!p) {
    showToast("Product not found", "error");
  } else if (Number.isNaN(val) || val < 0) {
    showToast("Please enter a valid non-negative stock value.", "error");
  } else {
    p.stock = val;
    saveToLocal("products_db", products);
    renderInventory();
    showToast("Stock Updated");
  }
  toggleModal("edit-modal", false);
}

// Initial Calls
renderInventory();
renderSalesNew();
renderUsersNew();
