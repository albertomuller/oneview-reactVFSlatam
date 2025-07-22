const sql = require('mssql');

let pool = null;

const config = {
    server: 'sqlsrv-datastaging-prd.database.windows.net',
    database: 'oneviewvfslatam',
    authentication: {
        type: 'azure-active-directory-default'
    },
    options: {
        encrypt: true,
        trustServerCertificate: false,
        enableArithAbort: true,
        connectionTimeout: 30000,
        requestTimeout: 30000
    }
};

async function getConnection() {
    // Para desenvolvimento local, usar mock data
    if (process.env.NODE_ENV !== 'production' && !process.env.FORCE_SQL_CONNECTION) {
        console.log('🔧 Development mode: Using mock data instead of SQL');
        return null;
    }
    
    if (pool && pool.connected) {
        return pool;
    }
    
    try {
        console.log('🔗 Attempting to connect to Azure SQL Database...');
        console.log('   Server:', config.server);
        console.log('   Database:', config.database);
        
        pool = await sql.connect(config);
        console.log('✅ Connected to Azure SQL Database successfully');
        return pool;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.log('🔄 Falling back to mock data mode...');
        return null; // Return null to use mock data
    }
}

async function closeConnection() {
    try {
        if (pool) {
            await pool.close();
            pool = null;
            console.log('Database connection closed');
        }
    } catch (error) {
        console.error('Error closing connection:', error);
    }
}

module.exports = {
    getConnection,
    closeConnection,
    sql
};