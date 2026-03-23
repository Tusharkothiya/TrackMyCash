import fs from "fs";
import path from "path";

/**
 * Simple File Logger
 * Appends logs to a file in the project's root directory.
 */
const LOG_DIR = path.join(process.cwd(), "logs");
const ERROR_LOG_FILE = path.join(LOG_DIR, "error.log");

// Ensure the logs directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

export const logger = {
  /**
   * Log an error message and the error object to error.log
   */
  async error(message: string, error?: any) {
    const timestamp = new Date().toISOString();
    
    let detailsString = "";
    if (error !== undefined && error !== null) {
      const errorMessageContent = error instanceof Error ? error.stack || error.message : JSON.stringify(error, null, 2);
      if (errorMessageContent && errorMessageContent.trim() !== "" && errorMessageContent.trim() !== "{}") { // Added check for empty object string
        detailsString = `\nDetails: ${errorMessageContent}`;
      }
    }
    
    const logEntry = `[${timestamp}] ERROR: ${message}${detailsString}\n${"-".repeat(50)}\n`;
    
    try {
      fs.appendFileSync(ERROR_LOG_FILE, logEntry);
      console.error(`[Logger] Error logged to ${ERROR_LOG_FILE}`);
    } catch (fsError) {
      console.error("[Logger] Failed to write to log file:", fsError);
    }
  },

  /**
   * Log info messages (optional)
   */
  async info(message: string) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] INFO: ${message}\n`;
    const INFO_LOG_FILE = path.join(LOG_DIR, "combined.log");
    
    try {
      fs.appendFileSync(INFO_LOG_FILE, logEntry);
    } catch (fsError) {
      console.error("[Logger] Failed to write to info log:", fsError);
    }
  }
};
