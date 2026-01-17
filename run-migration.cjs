const { Client } = require('pg');
const fs = require('fs');

const connectionString = process.argv[2];
const schemaFile = process.argv[3];

async function runMigration() {
  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log('✅ Connected to database successfully!');

    const schema = fs.readFileSync(schemaFile, 'utf8');
    await client.query(schema);

    console.log('✅ Migration completed successfully!');
    console.log('✅ Created tables: players, games, game_results');
    console.log('✅ Created views: player_stats, yearly_stats');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
