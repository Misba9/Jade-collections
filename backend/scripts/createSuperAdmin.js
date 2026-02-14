/**
 * Create Super Admin script
 * Creates an admin user in the database if one does not already exist.
 * Uses SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD from backend/.env
 *
 * Run: node scripts/createSuperAdmin.js (from backend directory)
 * Or:  npm run create-super-admin
 */
import '../loadEnv.js';
import connectDB, { disconnectDB } from '../config/db.js';
import Admin from '../models/Admin.js';

const run = async () => {
  const email = process.env.SUPER_ADMIN_EMAIL?.trim();
  const password = process.env.SUPER_ADMIN_PASSWORD?.trim();

  if (!email || !password) {
    console.error('❌ Missing SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD in backend/.env');
    console.error('   Add both variables to backend/.env and run again.');
    process.exit(1);
  }

  try {
    await connectDB();

    const existing = await Admin.findOne({ email: email.toLowerCase() });
    if (existing) {
      console.log(`✓ Super Admin already exists: ${email}`);
      await disconnectDB();
      process.exit(0);
      return;
    }

    await Admin.create({
      email: email.toLowerCase(),
      password,
    });

    console.log(`✓ Super Admin created successfully: ${email}`);
  } catch (err) {
    console.error('❌ Failed to create Super Admin:', err.message);
    process.exit(1);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
};

run();
