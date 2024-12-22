const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function getData(query) {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(query);
    return rows;
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

module.exports = getData;