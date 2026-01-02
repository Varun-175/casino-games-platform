require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

/**
 * Casino seed data - 25 realistic games for pagination/filter testing
 * Covers Evolution, Pragmatic Play, NetEnt, Microgaming
 */
const games = [
  { name: "Lightning Roulette", provider: "Evolution", category: "Live Casino" },
  { name: "Crazy Time", provider: "Evolution", category: "Live Casino" },
  { name: "Monopoly Live", provider: "Evolution", category: "Live Casino" },
  { name: "Mega Ball", provider: "Evolution", category: "Live Casino" },
  { name: "Dream Catcher", provider: "Evolution", category: "Live Casino" },
  { name: "Sweet Bonanza", provider: "Pragmatic Play", category: "Slots" },
  { name: "Gates of Olympus", provider: "Pragmatic Play", category: "Slots" },
  { name: "Wolf Gold", provider: "Pragmatic Play", category: "Slots" },
  { name: "Fruit Party 2", provider: "Pragmatic Play", category: "Slots" },
  { name: "Sugar Rush", provider: "Pragmatic Play", category: "Slots" },
  { name: "Blackjack VIP", provider: "Evolution", category: "Table Games" },
  { name: "Baccarat Squeeze", provider: "Evolution", category: "Table Games" },
  { name: "Infinite Blackjack", provider: "Evolution", category: "Table Games" },
  { name: "Starburst", provider: "NetEnt", category: "Slots" },
  { name: "Gonzo's Quest", provider: "NetEnt", category: "Slots" },
  { name: "Dead or Alive 2", provider: "NetEnt", category: "Slots" },
  { name: "Immortal Romance", provider: "Microgaming", category: "Slots" },
  { name: "Book of Oz", provider: "Microgaming", category: "Slots" },
  { name: "Lightning Dice", provider: "Evolution", category: "Table Games" },
  { name: "Speed Blackjack", provider: "Evolution", category: "Table Games" },
  { name: "The Dog House", provider: "Pragmatic Play", category: "Slots" },
  { name: "Big Bass Bonanza", provider: "Pragmatic Play", category: "Slots" },
  { name: "Deal or No Deal", provider: "Evolution", category: "Live Casino" },
  { name: "Cash or Crash", provider: "Evolution", category: "Live Casino" },
  { name: "Football Studio", provider: "Evolution", category: "Table Games" },
];

async function seedGames(force = false) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Idempotency check - skip if games exist (unless --force)
    const { rowCount } = await client.query("SELECT 1 FROM games LIMIT 1");
    if (rowCount > 0 && !force) {
      console.log("⚠️  Games already exist. Use --force to reseed.");
      await client.query("ROLLBACK");
      return;
    }

    // Clear existing games if force or first run
    if (rowCount > 0 || force) {
      await client.query("TRUNCATE TABLE games RESTART IDENTITY CASCADE");
      console.log("🧹 Cleared existing games");
    }

    // Bulk insert with parameters (high performance)
    const values = [];
    const placeholders = games.map((_, index) => {
      const baseIndex = index * 3 + 1;
      values.push(games[index].name, games[index].provider, games[index].category);
      return `($${baseIndex}, $${baseIndex + 1}, $${baseIndex + 2})`;
    }).join(", ");

    const insertQuery = `
      INSERT INTO games (name, provider, category)
      VALUES ${placeholders}
    `;

    const result = await client.query(insertQuery, values);
    await client.query("COMMIT");

    console.log(`✅ Seeded ${result.rowCount} casino games successfully!`);
    console.log(`📊 Breakdown:`);
    console.log(`   • Slots: varied providers`);
    console.log(`   • Live Casino: Evolution focus`);
    console.log(`   • Table Games: 6 entries`);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Seed failed:", error.message);
    console.error("💡 Check: table schema, DB connection, env vars");
  } finally {
    client.release();
  }
}

// CLI support: node seedGames.js [--force]
const force = process.argv.includes("--force");
seedGames(force).finally(() => {
  process.exit(0);
});
