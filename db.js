// db.js
const oracledb = require('oracledb');
require('dotenv').config();

// IMPORTANTE: Aponte para onde você descompactou o Instant Client
// Se estiver no Linux ou se o PATH já estiver configurado, pode remover esta linha.
// No Windows, costuma ser necessário:
try {
    oracledb.initOracleClient({ libDir: 'C:\instantclient_11_2' });
} catch (err) {
    console.error('Opa, erro ao iniciar o Client Oracle. Verifique o caminho!', err);
    process.exit(1);
}

async function executarQuery(sql, params = []) {
    let connection;

    try {
        // Abre a conexão
        connection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_STRING,
        });

        // Executa o SQL
        const result = await connection.execute(sql, params, {
            outFormat: oracledb.OUT_FORMAT_OBJECT, // Retorna dados como JSON { CAMPO: valor }
        });

        return result.rows;

    } catch (err) {
        console.error('Erro na execução do SQL:', err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close(); // Sempre feche a conexão!
            } catch (err) {
                console.error(err);
            }
        }
    }
}

module.exports = { executarQuery };