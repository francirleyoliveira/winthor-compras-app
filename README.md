# WinThor Compras App

Módulo de análise de produtos e gestão de compras integrado ao ERP WinThor.

## 🚀 Funcionalidades

- **Dashboard de Produtos**: Visualização rápida de produtos com indicadores de estoque.
- **Filtros Avançados**: Pesquisa por código, EAN, descrição, fornecedor, departamento e marca.
- **Análise de Giro**: Histórico de vendas dos últimos 3 meses e média trimestral.
- **Integração WinThor**: Conexão direta com banco de dados Oracle para dados em tempo real.

## 🛠️ Tecnologias

- **Backend**: Node.js, Express
- **Frontend**: HTML5, Bootstrap 5, Vanilla JS
- **Database**: Oracle (via `oracledb`)

## 📦 Como rodar

1. Clone o repositório:
   ```bash
   git clone https://github.com/francirleyoliveira/winthor-compras-app.git
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o arquivo `.env` com as credenciais do banco Winthor:
   ```env
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_CONNECT_STRING=host:port/service_name
   ```

4. Inicie o servidor:
   ```bash
   npm start
   # ou
   node index.js
   ```

5. Acesse `http://localhost:3000` no navegador.
