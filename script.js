const API_URL = "http://localhost:3000/products";

let products = [];
let filteredProducts = [];
let editId = null;

// Paginação
let currentPage = 1;
let itemsPerPage = 10;

// Elementos do DOM
const productForm = document.getElementById("productForm");
const nameInput = document.getElementById("name");
const categoryInput = document.getElementById("category");
const priceInput = document.getElementById("price");
const stockInput = document.getElementById("stock");
const tableBody = document.getElementById("productList");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const itemsPerPageSelect = document.getElementById("itemsPerPage");

// Dashboard
const totalProdutos = document.getElementById("totalProdutos");
const totalEstoque = document.getElementById("totalEstoque");
const valorTotal = document.getElementById("valorTotal");

// Modal e Tema
const modalOverlay = document.getElementById("modalOverlay");
const themeToggle = document.getElementById("themeToggle");
const btnCancel = document.getElementById("btnCancel");

let confirmCallback = null;
let chartCategorias = null;

// ===============================
// INICIALIZAÇÃO E EVENTOS
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();

  // Escutadores de Filtro e Ordenação
  searchInput.addEventListener("input", handleFilters);
  sortSelect.addEventListener("change", handleFilters);

  // Escutadores de Paginação
  itemsPerPageSelect.addEventListener("change", (e) => {
    itemsPerPage = parseInt(e.target.value);
    currentPage = 1;
    renderTable();
  });

  document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
    }
  });

  document.getElementById("nextPage").addEventListener("click", () => {
    const maxPage = Math.ceil(filteredProducts.length / itemsPerPage);
    if (currentPage < maxPage) {
      currentPage++;
      renderTable();
    }
  });

  // Alternar Tema (Dark Mode)
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    themeToggle.innerText = isDark ? "☀️ Tema Claro" : "🌙 Alternar Tema";
  });

  // Exportações
  document.getElementById("exportJson").addEventListener("click", exportToJSON);
  document.getElementById("exportExcel").addEventListener("click", exportToExcel);
});

// ===============================
// LÓGICA DE FILTROS E RENDERIZAÇÃO
// ===============================
function handleFilters() {
  const term = searchInput.value.toLowerCase();
  const sortBy = sortSelect.value;

  // 1. Filtragem
  filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(term) || 
    p.category.toLowerCase().includes(term)
  );

  // 2. Ordenação
  if (sortBy) {
    filteredProducts.sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      return a[sortBy].toString().localeCompare(b[sortBy].toString());
    });
  }

  currentPage = 1;
  renderTable();
}

function renderTable() {
  tableBody.innerHTML = "";
  
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedItems = filteredProducts.slice(start, end);

  if (paginatedItems.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Nenhum produto encontrado</td></tr>`;
    return;
  }

  paginatedItems.forEach(product => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${product.name}</td>
      <td>R$ ${Number(product.price).toFixed(2)}</td>
      <td>${product.category}</td>
      <td>${product.stock}</td>
      <td>
        <button class="btn-edit" onclick="editProduct(${product.id})">Editar</button>
        <button class="btn-delete" onclick="deleteProduct(${product.id})">Excluir</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });

  updatePaginationInfo();
}

function updatePaginationInfo() {
  const maxPage = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  document.getElementById("pageInfo").innerText = `Página ${currentPage} de ${maxPage}`;
}

// ===============================
// DASHBOARD & CHART
// ===============================
function updateDashboard() {
  totalProdutos.innerText = products.length;
  totalEstoque.innerText = products.reduce((acc, p) => acc + Number(p.stock), 0);
  const total = products.reduce((acc, p) => acc + (Number(p.price) * Number(p.stock)), 0);
  valorTotal.innerText = `R$ ${total.toFixed(2)}`;
  updateChart();
}

function updateChart() {
  const categorias = {};
  products.forEach(p => {
    categorias[p.category] = (categorias[p.category] || 0) + Number(p.stock);
  });

  const ctx = document.getElementById("chartCategorias");
  if (chartCategorias) chartCategorias.destroy();

  chartCategorias = new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(categorias),
      datasets: [{
        label: "Estoque por Categoria",
        data: Object.values(categorias),
        backgroundColor: "#007bff"
      }]
    },
    options: { responsive: true }
  });
}

// ===============================
// OPERAÇÕES CRUD (API)
// ===============================
async function loadProducts() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Erro na API");
    products = await response.json();
    handleFilters();
    updateDashboard();
  } catch (error) {
    console.error(error);
  }
}

productForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const productData = {
    name: nameInput.value.trim(),
    category: categoryInput.value.trim(),
    price: parseFloat(priceInput.value),
    stock: parseInt(stockInput.value)
  };

  try {
    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API_URL}/${editId}` : API_URL;

    const response = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });

    if (response.ok) {
      cancelEdit();
      loadProducts();
    }
  } catch (error) {
    alert("Erro ao salvar produto");
  }
});

function editProduct(id) {
  const product = products.find(p => p.id === id);
  if (product) {
    editId = id;
    nameInput.value = product.name;
    categoryInput.value = product.category;
    priceInput.value = product.price;
    stockInput.value = product.stock;
    document.getElementById("btnSubmit").innerText = "Atualizar Produto";
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function deleteProduct(id) {
  openModal("Excluir", "Deseja realmente excluir este produto?", async () => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadProducts();
  });
}

function cancelEdit() {
  editId = null;
  productForm.reset();
  document.getElementById("btnSubmit").innerText = "Adicionar Produto";
}

btnCancel.addEventListener("click", cancelEdit);

// ===============================
// MODAL & EXPORTAÇÃO
// ===============================
function openModal(title, message, callback) {
  document.getElementById("modalTitle").innerText = title;
  document.getElementById("modalMessage").innerText = message;
  confirmCallback = callback;
  modalOverlay.classList.add("active");
}

document.getElementById("modalConfirm").addEventListener("click", () => {
  if (confirmCallback) confirmCallback();
  modalOverlay.classList.remove("active");
});

document.getElementById("modalCancel").addEventListener("click", () => modalOverlay.classList.remove("active"));

function exportToJSON() {
  const blob = new Blob([JSON.stringify(products, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "produtos.json";
  a.click();
}

function exportToExcel() {
  if (typeof XLSX === 'undefined') {
    alert("Por favor, adicione a biblioteca SheetJS no Index.html para exportar para Excel.");
    return;
  }
  const worksheet = XLSX.utils.json_to_sheet(products);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Produtos");
  XLSX.writeFile(workbook, "produtos.xlsx");
}

document.getElementById("importJson").addEventListener("change", function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async function(event) {
    try {
      const importedData = JSON.parse(event.target.result);
      // Envia cada produto importado para a sua API
      for (const item of importedData) {
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: item.name,
            category: item.category,
            price: item.price,
            stock: item.stock
          })
        });
      }
      alert("Importação concluída!");
      loadProducts();
    } catch (err) {
      alert("Erro ao ler o arquivo JSON.");
    }
  };
  reader.readAsText(file);
});