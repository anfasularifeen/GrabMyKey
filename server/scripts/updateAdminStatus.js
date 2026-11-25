import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/grabmykey';

async function run() {
  try {
    try {
      await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 });
      console.log('Connected to MongoDB via URI');
    } catch {
      if (fs.existsSync('/tmp/mongodb-27017.sock')) {
        await mongoose.connect('mongodb://%2Ftmp%2Fmongodb-27017.sock/grabmykey', { serverSelectionTimeoutMS: 2000 });
        console.log('Connected to MongoDB via Unix domain socket');
      } else {
        throw new Error('Unable to reach MongoDB via URI or socket');
      }
    }

    const collection = mongoose.connection.collection('admins');
    
    // Fetch all current admin documents
    const currentAdmins = await collection.find({}).toArray();
    console.log(`\n[Current Database Admins: ${currentAdmins.length}]`);
    for (const a of currentAdmins) {
      console.log(`  - ID: ${a._id} | Email: ${a.email} | Name: ${a.name} | Role: ${a.role || 'none'} | Status: ${a.status || 'none'}`);
    }

    // Execute update for documents where status doesn't exist or email is contact@grabmykey.in
    const updateResult = await collection.updateMany(
      {
        $or: [
          { status: { $exists: false } },
          { status: null },
          { email: 'contact@grabmykey.in' }
        ]
      },
      {
        $set: {
          status: 'approved',
          role: 'superadmin'
        }
      }
    );

    console.log(`\n[Update Result] Matched: ${updateResult.matchedCount}, Modified: ${updateResult.modifiedCount}`);

    // Verify state after update
    const finalAdmins = await collection.find({}).toArray();
    console.log(`\n[Final Database Admins: ${finalAdmins.length}]`);
    for (const a of finalAdmins) {
      console.log(`  ✓ ID: ${a._id} | Email: ${a.email} | Name: ${a.name} | Role: ${a.role} | Status: ${a.status}`);
    }

    await mongoose.disconnect();
    console.log('\nMigration complete.');
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

run();

