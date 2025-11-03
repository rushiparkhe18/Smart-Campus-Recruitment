require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

async function approveAllCompanies() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MongoDB URI not found in environment variables');
    }
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');
    
    // Find all unapproved companies
    const unapprovedCompanies = await User.find({ 
      role: 'company', 
      isApproved: false 
    });
    
    console.log(`📋 Found ${unapprovedCompanies.length} unapproved companies:\n`);
    
    unapprovedCompanies.forEach((company, index) => {
      console.log(`${index + 1}. ${company.name} (${company.email})`);
      console.log(`   Company: ${company.companyProfile?.companyName || 'N/A'}`);
      console.log(`   Registered: ${company.createdAt.toLocaleString()}\n`);
    });
    
    // Approve all companies
    const result = await User.updateMany(
      { role: 'company', isApproved: false },
      { $set: { isApproved: true } }
    );
    
    console.log(`\n✅ Successfully approved ${result.modifiedCount} companies!`);
    console.log('📧 Companies can now login to the platform.\n');
    
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  approveAllCompanies();
}

module.exports = approveAllCompanies;
