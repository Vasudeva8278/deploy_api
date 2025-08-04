const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './.env' });

// Import all models
const User = require('../src/models/userModel');
const Organization = require('../src/models/organizationModel');
const Profile = require('../src/models/profileModel');
const Project = require('../src/models/Project');
const Client = require('../src/models/ClientModel');
const Payment = require('../src/models/paymentModel');
const Document = require('../src/models/Document');
const Role = require('../src/models/Role');
const Template = require('../src/models/Template');
const ActivityLog = require('../src/models/activityLogModel');
const Highlight = require('../src/models/Highlight');

class DatabaseMigrator {
  constructor(oldDbUrl, newDbUrl) {
    this.oldDbUrl = oldDbUrl;
    this.newDbUrl = newDbUrl;
    this.oldConnection = null;
    this.newConnection = null;
  }

  async connectToOldDatabase() {
    console.log('Connecting to old database...');
    this.oldConnection = await mongoose.createConnection(this.oldDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ Connected to old database');
  }

  async connectToNewDatabase() {
    console.log('Connecting to new database...');
    this.newConnection = await mongoose.createConnection(this.newDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ Connected to new database');
  }

  async migrateCollection(ModelClass, collectionName) {
    console.log(`\n📦 Migrating ${collectionName}...`);
    
    try {
      // Get model from old connection
      const OldModel = this.oldConnection.model(ModelClass.modelName, ModelClass.schema);
      
      // Get model from new connection
      const NewModel = this.newConnection.model(ModelClass.modelName, ModelClass.schema);

      // Get all documents from old database
      const documents = await OldModel.find({}).lean();
      console.log(`   Found ${documents.length} documents`);

      if (documents.length === 0) {
        console.log(`   ✓ No documents to migrate for ${collectionName}`);
        return;
      }

      // Clear existing data in new database (optional - remove if you want to keep existing data)
      await NewModel.deleteMany({});
      console.log(`   Cleared existing data in new database`);

      // Insert documents into new database in batches
      const batchSize = 100;
      for (let i = 0; i < documents.length; i += batchSize) {
        const batch = documents.slice(i, i + batchSize);
        await NewModel.insertMany(batch, { ordered: false });
        console.log(`   Migrated ${Math.min(i + batchSize, documents.length)}/${documents.length} documents`);
      }

      console.log(`   ✓ Successfully migrated ${documents.length} documents for ${collectionName}`);
    } catch (error) {
      console.error(`   ❌ Error migrating ${collectionName}:`, error.message);
      throw error;
    }
  }

  async migrate() {
    try {
      await this.connectToOldDatabase();
      await this.connectToNewDatabase();

      // Define migration order (dependencies first)
      const migrationOrder = [
        { model: Role, name: 'Roles' },
        { model: Organization, name: 'Organizations' },
        { model: User, name: 'Users' },
        { model: Profile, name: 'Profiles' },
        { model: Template, name: 'Templates' },
        { model: Project, name: 'Projects' },
        { model: Document, name: 'Documents' },
        { model: Client, name: 'Clients' },
        { model: Payment, name: 'Payments' },
        { model: ActivityLog, name: 'Activity Logs' },
        { model: Highlight, name: 'Highlights' },
      ];

      console.log('🚀 Starting database migration...\n');

      for (const { model, name } of migrationOrder) {
        await this.migrateCollection(model, name);
      }

      console.log('\n🎉 Migration completed successfully!');
      
      // Verify migration
      await this.verifyMigration();

    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    } finally {
      // Close connections
      if (this.oldConnection) {
        await this.oldConnection.close();
        console.log('✓ Closed old database connection');
      }
      if (this.newConnection) {
        await this.newConnection.close();
        console.log('✓ Closed new database connection');
      }
    }
  }

  async verifyMigration() {
    console.log('\n🔍 Verifying migration...');
    
    const models = [
      { model: Role, name: 'Roles' },
      { model: Organization, name: 'Organizations' },
      { model: User, name: 'Users' },
      { model: Profile, name: 'Profiles' },
      { model: Template, name: 'Templates' },
      { model: Project, name: 'Projects' },
      { model: Document, name: 'Documents' },
      { model: Client, name: 'Clients' },
      { model: Payment, name: 'Payments' },
      { model: ActivityLog, name: 'Activity Logs' },
      { model: Highlight, name: 'Highlights' },
    ];

    for (const { model, name } of models) {
      const OldModel = this.oldConnection.model(model.modelName, model.schema);
      const NewModel = this.newConnection.model(model.modelName, model.schema);

      const oldCount = await OldModel.countDocuments();
      const newCount = await NewModel.countDocuments();

      console.log(`   ${name}: ${oldCount} → ${newCount} ${oldCount === newCount ? '✓' : '❌'}`);
    }
  }
}

// Main execution
async function main() {
  const oldDbUrl = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/neodb-dev';
  const newDbUrl = process.env.MONGODB_URL_NEW || 'mongodb://127.0.0.1:27017/neodb-new';

  console.log(`Old Database: ${oldDbUrl}`);
  console.log(`New Database: ${newDbUrl}`);

  const migrator = new DatabaseMigrator(oldDbUrl, newDbUrl);
  await migrator.migrate();
}

// Run migration
if (require.main === module) {
  main()
    .then(() => {
      console.log('Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = DatabaseMigrator; 