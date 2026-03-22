
const { neon } = require('@neondatabase/serverless');
const fs = require('fs');

async function updateOrder() {
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
  const targetName = 'Keluarga Marga Siauw Sak Po';

  try {
    console.log(`Updating created_at for "${targetName}" to current time...`);
    const result = await sql\`
      UPDATE families 
      SET created_at = NOW() 
      WHERE name = \${targetName}
    \`;
    console.log("✅ Success! Family tree moved to top (by timestamp).");
  } catch (error) {
    console.error('❌ Error updating order:', error);
    process.exit(1);
  }
}

updateOrder();
