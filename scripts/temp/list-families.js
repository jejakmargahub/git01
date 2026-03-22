
const { neon } = require('@neondatabase/serverless');
const fs = require('fs');

async function listFamilies() {
  let dbUrl = '';
  try {
    const envFile = fs.readFileSync('.env.local', 'utf8');
    const match = envFile.match(/DATABASE_URL=(.+)/);
    if (match) dbUrl = match[1].trim();
  } catch (err) {
    console.error('Failed to read .env.local');
    process.exit(1);
  }

  const sql = neon(dbUrl);
  try {
    const results = await sql`
      SELECT f.id, f.name, f.created_at, u.email, u.phone_number 
      FROM families f
      JOIN users u ON f.created_by = u.id
      WHERE u.phone_number = '081908304540' OR u.email = 'christian.kontak@gmail.com'
      ORDER BY f.created_at DESC;
    `;
    console.log(JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('Error listing families:', error);
  }
}

listFamilies();
