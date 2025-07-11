import mysql from "mysql2/promise";

// Get database connection parameters from environment variables
// with fallback to default values for local development
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "ShelfX",
  enableKeepAlive: true,
  keepAliveInitialDelay: 5000,
  connectionLimit: 3 // Adjust this value to control max connections
};

// Create and export the database connection pool
const db = mysql.createPool(dbConfig);

// Add error handling for the pool
db.on('error', (err) => {
  console.error('Database pool error:', err);
});

db.on('acquire', (connection) => {
  console.debug('Connection acquired from pool');
});

db.on('release', (connection) => {
  console.debug('Connection released back to pool');
});

export default db;