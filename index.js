// index.js
const express = require('express');
const cors = require('cors');
const { executarQuery } = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Rota de Teste
app.get('/', (req, res) => {
    res.send('API Winthor Compras rodando!');
});

// --- MÓDULO: PRODUTOS ---
// Objetivo: Listar produtos para o comprador analisar
app.get('/api/produtos', async (req, res) => {
    try {
        // 1. Captura os parâmetros enviados pelo App/Frontend
        const {
            busca,          // O texto da "Pesquisa Inteligente"
            fornecedor,     // ID do fornecedor
            depto,          // ID do departamento
            secao,          // ID da seção
            marca,          // ID da marca
            apenas_revenda, // 'S' ou 'N' (ou vazio)
            incluir_excluidos, // 'S' para mostrar excluídos
            incluir_foralinha  // 'S' para mostrar Fora de Linha (FL)
        } = req.query;

        const binds = {}; // Objeto para guardar os valores com segurança (evita SQL Injection)

        // 2. A Base da Query (Sua nova seleção de colunas)
        let sql = `
      SELECT 
        P.CODPROD, 
        P.DESCRICAO, 
        P.EMBALAGEM,
        P.CODAUXILIAR,
        P.UNIDADE,
        P.QTUNIT,
        P.CODAUXILIAR2,
        P.EMBALAGEMMASTER,
        P.QTUNITCX,
        P.CODEPTO, 
        D.DESCRICAO AS DEPARTAMENTO,
        P.CODSEC,
        S.DESCRICAO AS SECAO,
        P.CODMARCA,
        M.MARCA,
        F.CODFORNEC,
        F.FORNECEDOR,
        P.OBS2,
        P.DTEXCLUSAO,
        P.DIRFOTOPROD
      FROM PCPRODUT P
      LEFT JOIN PCFORNEC F ON P.CODFORNEC = F.CODFORNEC
      LEFT JOIN PCDEPTO D ON P.CODEPTO = D.CODEPTO
      LEFT JOIN PCSECAO S ON P.CODSEC = S.CODSEC
      LEFT JOIN PCMARCA M ON P.CODMARCA = M.CODMARCA
      
      WHERE 1=1 
    `;
        // Nota: "WHERE 1=1" é um truque para facilitar adicionar "ANDs" depois

        // 3. Aplicação dos Filtros Dinâmicos

        // Filtro: Excluídos (Padrão: Não mostrar)
        if (incluir_excluidos !== 'S') {
            sql += ` AND P.DTEXCLUSAO IS NULL `;
        }

        // Filtro: Fora de Linha (OBS2 = 'FL')
        if (incluir_foralinha !== 'S') {
            sql += ` AND (P.OBS2 IS NULL OR P.OBS2 <> 'FL') `;
        }

        // Filtro: Revenda
        if (apenas_revenda === 'S') {
            sql += ` AND P.REVENDA = 'S' `;
        }

        // Filtros Específicos (Combos)
        if (fornecedor) {
            sql += ` AND P.CODFORNEC = :fornecedor `;
            binds.fornecedor = fornecedor;
        }
        if (depto) {
            sql += ` AND P.CODEPTO = :depto `;
            binds.depto = depto;
        }
        if (secao) {
            sql += ` AND P.CODSEC = :secao `;
            binds.secao = secao;
        }
        if (marca) {
            sql += ` AND P.CODMARCA = :marca `;
            binds.marca = marca;
        }

        // 4. Pesquisa Inteligente (Código, EAN ou Descrição)
        if (busca) {
            // Verifica se é numero (para buscar por ID)
            if (!isNaN(busca)) {
                sql += ` AND (P.CODPROD = :buscaNum OR P.CODAUXILIAR = :buscaStr) `;
                binds.buscaNum = busca;
                binds.buscaStr = busca;
            } else {
                // É texto -> Busca na descrição (Case Insensitive)
                sql += ` AND UPPER(P.DESCRICAO) LIKE UPPER(:buscaTexto) `;
                binds.buscaTexto = `%${busca}%`; // % serve para buscar em qualquer parte do texto
            }
        }

        // 5. Ordenação e Limite (Finalização)
        // Importante: O ROWNUM deve ser a última condição no WHERE para o Oracle 11g otimizar bem
        sql += ` AND ROWNUM <= 50 ORDER BY P.DESCRICAO `;

        // 6. Execução
        const produtos = await executarQuery(sql, binds);

        res.json({
            filtros_aplicados: req.query,
            total: produtos.length,
            dados: produtos
        });

    } catch (error) {
        console.error('Erro na rota de produtos:', error);
        res.status(500).json({ erro: 'Erro ao filtrar produtos.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});