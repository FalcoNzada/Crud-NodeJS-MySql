require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// ==========================
// ROTA TESTE
// ==========================
app.get("/", (req, res) => {
  res.send("🚀 API CRUD Produtos rodando!");
});

// ==========================
// GET ALL PRODUCTS
// ==========================
app.get("/products", (req, res) => {
  const sql = "SELECT * FROM products ORDER BY id DESC";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar produtos" });
    }

    res.json(result);
  });
});

// ==========================
// GET PRODUCT BY ID
// ==========================
app.get("/products/:id", (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM products WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar produto" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json(result[0]);
  });
});

// ==========================
// CREATE PRODUCT
// ==========================
app.post("/products", (req, res) => {
  const { name, category, price, stock } = req.body;

  if (!name || !category || price == null || stock == null) {
    return res.status(400).json({ error: "Preencha todos os campos" });
  }

  const sql =
    "INSERT INTO products (name, category, price, stock) VALUES (?, ?, ?, ?)";

  db.query(sql, [name, category, price, stock], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao cadastrar produto" });
    }

    res.status(201).json({
      message: "Produto criado com sucesso",
      id: result.insertId,
    });
  });
});

// ==========================
// UPDATE PRODUCT
// ==========================
app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const { name, category, price, stock } = req.body;

  if (!name || !category || price == null || stock == null) {
    return res.status(400).json({ error: "Preencha todos os campos" });
  }

  const sql =
    "UPDATE products SET name = ?, category = ?, price = ?, stock = ? WHERE id = ?";

  db.query(sql, [name, category, price, stock, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao atualizar produto" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json({ message: "Produto atualizado com sucesso" });
  });
});

// ==========================
// DELETE PRODUCT
// ==========================
app.delete("/products/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM products WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao deletar produto" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json({ message: "Produto deletado com sucesso" });
  });
});

// ==========================
// START SERVER
// ==========================
app.listen(process.env.PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${process.env.PORT}`);
});