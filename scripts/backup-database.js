const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './.env' });

class DatabaseBackup {
  constructor() {
    this.backupDir = path.join(__dirname, '..', 'backups');
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  }

  async createBackupDirectory() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  async backupMongoDB(databaseUrl, outputName) {
    return new Promise((resolve, reject) => {
      const backupPath = path.join(this.backupDir, `${outputName}-${this.timestamp}`);
      const command = `mongodump --uri="${databaseUrl}" --out="${backupPath}"`;

      console.log(`Creating backup: ${outputName}`);
      console.log(`Command: ${command}`);

      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Backup error: ${error.message}`);
          reject(error);
          return;
        }

        if (stderr) {
          console.log(`Backup stderr: ${stderr}`);
        }

        console.log(`✓ Backup completed: ${backupPath}`);
        resolve(backupPath);
      });
    });
  }

  async restoreFromBackup(backupPath, targetDatabaseUrl) {
    return new Promise((resolve, reject) => {
      const command = `mongorestore --uri="${targetDatabaseUrl}" --drop "${backupPath}"`;

      console.log(`Restoring from backup: ${backupPath}`);
      console.log(`Command: ${command}`);

      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Restore error: ${error.message}`);
          reject(error);
          return;
        }

        if (stderr) {
          console.log(`Restore stderr: ${stderr}`);
        }

        console.log(`✓ Restore completed`);
        resolve();
      });
    });
  }

  async createBackup() {
    try {
      await this.createBackupDirectory();

      const oldDbUrl = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/neodb-dev';
      
      console.log('🚀 Starting database backup...');
      console.log(`Source: ${oldDbUrl}`);

      const backupPath = await this.backupMongoDB(oldDbUrl, 'neodb-backup');
      
      console.log('🎉 Backup completed successfully!');
      console.log(`Backup location: ${backupPath}`);

      return backupPath;
    } catch (error) {
      console.error('❌ Backup failed:', error);
      throw error;
    }
  }

  async restore(backupPath, targetDbUrl) {
    try {
      console.log('🚀 Starting database restore...');
      console.log(`Source: ${backupPath}`);
      console.log(`Target: ${targetDbUrl}`);

      await this.restoreFromBackup(backupPath, targetDbUrl);
      
      console.log('🎉 Restore completed successfully!');
    } catch (error) {
      console.error('❌ Restore failed:', error);
      throw error;
    }
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const backup = new DatabaseBackup();

  switch (command) {
    case 'backup':
      await backup.createBackup();
      break;
    
    case 'restore':
      const backupPath = args[1];
      const targetUrl = args[2] || process.env.MONGODB_URL_NEW;
      
      if (!backupPath) {
        console.error('Usage: node backup-database.js restore <backup-path> [target-db-url]');
        process.exit(1);
      }
      
      await backup.restore(backupPath, targetUrl);
      break;
    
    default:
      console.log('Usage:');
      console.log('  node backup-database.js backup');
      console.log('  node backup-database.js restore <backup-path> [target-db-url]');
      process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main()
    .then(() => {
      console.log('Script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Script failed:', error);
      process.exit(1);
    });
}

module.exports = DatabaseBackup; 