const sql = require('mssql');

let pool = null;

const config = {
    server: process.env.SQL_SERVER || 'your-azure-sql-server.database.windows.net',
    port: 1433,
    database: process.env.SQL_DATABASE || 'your-database-name',
    user: process.env.SQL_USERNAME || 'your-username',
    password: process.env.SQL_PASSWORD || 'your-password',
    options: {
        encrypt: true,
        trustServerCertificate: false,
        enableArithAbort: true,
        connectionTimeout: 30000,
        requestTimeout: 30000
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

async function getConnection() {
    // Check if we should use mock data
    if (process.env.USE_MOCK_DATA === 'true') {
        console.log('🔧 Using mock data as configured');
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

async function testConnection() {
    try {
        console.log('🔗 Attempting to connect to database...');
        const connection = await getConnection();
        
        if (!connection) {
            throw new Error('No connection returned (using mock data)');
        }
        
        // Test with a simple query
        const result = await connection.request().query('SELECT 1 as test');
        console.log('✅ Database test query successful:', result.recordset);
        return true;
    } catch (error) {
        console.error('❌ Database test failed:', error.message);
        throw error;
    }
}

module.exports = {
    getConnection,
    closeConnection,
    testConnection,
    sql
};