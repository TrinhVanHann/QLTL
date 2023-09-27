const sql = require('mssql/msnodesqlv8');

const config = {
  server: 'ADMIN\SQLEXPRESS',
  database: 'DMS_db',
  drive: 'msnodesqlv8',
  options: {
    trustedConnection: true
  }
};


sql.connect(config)
  .then((pool) => {
    console.log('Connected to SQL Server');

    sql.close();
  })
  .catch((err) => {
    console.error('Error connecting to SQL Server:', err);
  });
