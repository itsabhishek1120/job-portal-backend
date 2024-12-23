const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function executeQuery(query, values = []) {
  const client = await pool.connect();
  try {
    const result = await client.query(query, values);
    return result.rows;
  } 
  catch(error){
    console.log("Database Error:", error?.message);
    console.log("Stack Trace:", error?.stack);
    return null;
  } 
  finally {
    console.log("Releasing Connection.");
    client.release();
  }
}

module.exports = executeQuery;