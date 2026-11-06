/**
 * Autonomous Rollback & Failure Recovery Engine
 * 
 * Protects repository integrity by:
 * - Restoring pre-flight backups if tests or builds fail
 * - Logging failure diagnostics to `content/growth/execution-log.json`
 * - Cleaning up temporary artifacts
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "../..");
const LOG_FILE = path.join(ROOT, "content/growth/execution-log.json");

export class RollbackManager {
  constructor() {
    this.logFile = LOG_FILE;
  }

  logExecution(entry) {
    let logs = [];
    if (fs.existsSync(this.logFile)) {
      try {
        logs = JSON.parse(fs.readFileSync(this.logFile, "utf-8"));
      } catch {
        logs = [];
      }
    }

    logs.unshift({
      timestamp: new Date().toISOString(),
      ...entry
    });

    if (logs.length > 100) logs = logs.slice(0, 100);

    const dir = path.dirname(this.logFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(this.logFile, JSON.stringify(logs, null, 2), "utf-8");
  }

  restoreBackup(backupPath, targetRelativePath) {
    if (!fs.existsSync(backupPath)) {
      console.error(`[Rollback] Backup file not found: ${backupPath}`);
      return false;
    }

    const targetFullPath = path.join(ROOT, targetRelativePath);
    try {
      fs.copyFileSync(backupPath, targetFullPath);
      console.log(`[Rollback] Successfully restored ${targetRelativePath} from backup ${backupPath}`);
      return true;
    } catch (err) {
      console.error(`[Rollback] Failed to restore file: ${err.message}`);
      return false;
    }
  }

  rollbackCreatedFile(targetRelativePath) {
    const targetFullPath = path.join(ROOT, targetRelativePath);
    if (fs.existsSync(targetFullPath)) {
      try {
        fs.unlinkSync(targetFullPath);
        console.log(`[Rollback] Cleaned up failed newly created file: ${targetRelativePath}`);
        return true;
      } catch (err) {
        console.error(`[Rollback] Failed to delete file: ${err.message}`);
        return false;
      }
    }
    return true;
  }
}
