const mongoose = require('mongoose');

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://rushikeshparkhe018_db_user:i8QmUWMmCALxoqgW@prodigy-hire.fyiu2ej.mongodb.net/prodigy-hire';

async function dropParallelArrayIndexes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get the Jobs collection
    const Job = mongoose.connection.collection('jobs');

    // Get all indexes
    const indexes = await Job.indexes();
    console.log('\n📋 Current indexes on Jobs collection:');
    indexes.forEach(idx => console.log(`  - ${idx.name}: ${JSON.stringify(idx.key)}`));

    // Drop the problematic parallel array index if it exists
    try {
      await Job.dropIndex('eligibility.departments_1_eligibility.batches_1');
      console.log('\n✅ Successfully dropped parallel array index!');
    } catch (err) {
      if (err.code === 27) {
        console.log('\n✅ Parallel array index does not exist (already removed)');
      } else {
        console.log('\n⚠️ Error dropping index:', err.message);
      }
    }

    // Show final indexes
    const finalIndexes = await Job.indexes();
    console.log('\n📋 Final indexes on Jobs collection:');
    finalIndexes.forEach(idx => console.log(`  - ${idx.name}: ${JSON.stringify(idx.key)}`));

    console.log('\n✅ All done! You can now restart your server.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

dropParallelArrayIndexes();
