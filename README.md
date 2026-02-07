# 📦 CRUD de Gerenciamento de Produtos

Sistema Full Stack completo para gerenciamento de inventário, com interface responsiva, dashboard interativo e persistência de dados em MySQL.

!

## 🚀 Funcionalidades

* **CRUD Completo**: Adicionar, listar, editar e excluir produtos.
* **Dashboard**: Métricas em tempo real (Total de produtos, estoque e valor total).
* **Gráficos**: Visualização por categoria usando Chart.js.
* **Pesquisa e Filtros**: Busca dinâmica e ordenação por nome, preço ou categoria.
* **Paginação**: Controle de itens exibidos por página.
* **Exportação/Importação**: Suporte para backup em JSON e relatórios em Excel.
* **Dark Mode**: Interface adaptável ao tema claro ou escuro.

## 🛠️ Tecnologias Utilizadas

**Frontend:**
* HTML5 & CSS3 (Variáveis CSS para Dark Mode)
* JavaScript (ES6+, Fetch API)
* [Chart.js](https://www.chartjs.org/) (Gráficos)
* [SheetJS](https://sheetjs.com/) (Exportação Excel)

**Backend:**
* Node.js & Express
* MySQL (Banco de dados relacional)
* Dotenv (Gerenciamento de variáveis de ambiente)
* CORS (Segurança de acesso)

## 📋 Pré-requisitos

Antes de começar, você vai precisar ter instalado:
* [Node.js](https://nodejs.org/)
* [MySQL Server](https://dev.mysql.com/downloads/installer/)

## 🔧 Configuração e Instalação

### 1. Banco de Dados
No MySQL Workbench ou terminal, execute o script para criar o banco de dados e a tabela:
```sql
CREATE DATABASE crudd_produtoss;
USE crudd_produtoss;

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(80) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

2. Backend
Navegue até a pasta do servidor e instale as dependências:

Bash

npm install

Crie um arquivo .env na raiz da pasta backend com as seguintes variáveis:

Snippet de código

PORT=3000
DB_HOST=127.0.0.1
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=crudd_produtoss
DB_PORT=3306
Inicie o servidor:

Bash
npm run dev

3. Frontend
Basta abrir o arquivo Index.html no seu navegador de preferência. Dica: Use a extensão Live Server do VS Code para uma melhor experiência.

📂 Estrutura do Projeto
Plaintext

├── backend/
│   ├── db.js          # Conexão com MySQL
│   ├── server.js      # Rotas da API Express
│   ├── .env           # Variáveis sensíveis
│   └── package.json   # Dependências Node
├── frontend/
│   ├── Index.html     # Estrutura principal
│   ├── css.css        # Estilização e Dark Mode
│   └── script.js      # Lógica, Fetch e Dashboard
└── crudBD.sql         # Script SQL de criação
✒️ Autor
Thales Barbosa - 
