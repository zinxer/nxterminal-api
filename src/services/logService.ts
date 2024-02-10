import Log from '../models/action_logs'; // Adjust the import path to where your Log model is defined

/**
 * Inserts a new log entry into the logs table.
 * 
 * @param userId - The ID of the user associated with the log.
 * @param action - The action being logged (e.g., "Reset Password").
 * @param details - Additional details about the action.
 * @param ipAddress - The IP address from which the action was performed.
 * @returns The created log entry.
 */
export async function insertLog(userId: string, action: string, details: string | null, ipAddress: string | null): Promise<Log> {
  try {
    const logEntry = await Log.create({
      userId,
      action,
      details,
      ipAddress, // Ensure your Log model has an 'ipAddress' field if you're tracking IPs
    });
    return logEntry;
  } catch (error) {
    console.error('-E- Error inserting log entry:', error);
    throw error; // Rethrow or handle as appropriate for your application
  }
}