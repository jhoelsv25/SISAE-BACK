/**
 * One-off script: alter sessions.session_token from varchar(255) to text
 * so JWTs (longer than 255 chars) can be stored.
 * Run: npx ts-node -r tsconfig-paths/register scripts/fix-session-token-column.ts
 */
import { AppDataSource } from '../src/database/data-source';

async function run() {
  await AppDataSource.initialize();
  await AppDataSource.query(`
    ALTER TABLE "sessions"
    ALTER COLUMN "session_token" TYPE text
  `);
  console.log('Done: sessions.session_token is now type text');
  await AppDataSource.destroy();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
