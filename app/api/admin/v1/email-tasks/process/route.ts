import { utils } from "@/lib/api-response";
import { catchAsync } from "@/lib/catch-async";
import { _localize } from "@/lib/localize";
import { transactionEmailService } from "@/services/transactionEmailService";
import { logger } from "@/lib/logger";

/**
 * Email Task Processor API Route
 *
 * This endpoint processes all pending email tasks that are due to be sent.
 * It should be called by an external cron service (e.g., EasyCron, AWS EventBridge, etc.)
 * at regular intervals (e.g., every minute for near real-time sending).
 *
 * Environment Variable (REQUIRED):
 * - EMAIL_TASK_PROCESSOR_SECRET: A secret token to authenticate the cron requests
 *
 * Example cron setup with EasyCron:
 * URL: https://yourdomain.com/api/admin/v1/email-tasks/process
 * Headers:
 *   Authorization: Bearer <EMAIL_TASK_PROCESSOR_SECRET>
 * Frequency: Every 1 minute
 *
 * Response:
 * {
 *   "success": true,
 *   "message": "Email tasks processed",
 *   "data": {
 *     "processed": 5,
 *     "sent": 4,
 *     "failed": 1
 *   }
 * }
 */

const PROCESSOR_SECRET = process.env.EMAIL_TASK_PROCESSOR_SECRET;

if (!PROCESSOR_SECRET) {
  console.warn(
    "WARNING: EMAIL_TASK_PROCESSOR_SECRET is not set. Email task processing endpoint will be disabled."
  );
}

export const POST = catchAsync(async (request: Request, res: any) => {
  try {
    // Verify authentication using Bearer token
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!PROCESSOR_SECRET || token !== PROCESSOR_SECRET) {
      console.warn(
        "Unauthorized email task processor request from IP: " +
          (request.headers.get("x-forwarded-for") ||
            request.headers.get("x-real-ip") ||
            "unknown")
      );

      return utils.failureResponse(
        "Unauthorized: Invalid or missing processor secret",
        res,
        401
      );
    }

    // Process all pending email tasks
    const result = await transactionEmailService.processPendingEmailTasks();

    if (result.flag) {
      res.message = "Email tasks processed successfully";
      return utils.successResponse(result.data, res);
    }

    const errorKey = typeof result.data === 'string' ? result.data : 'email.processingFailed';
    const message = _localize(errorKey);
    return utils.failureResponse(message, res, result.status || 500);
  } catch (error) {
    await logger.error("Error in email task processor", error);
    return utils.failureResponse(
      "An error occurred while processing email tasks",
      res,
      500
    );
  }
});

/**
 * GET endpoint to check email task processor health
 * Can be used by cron service to verify endpoint is working
 */
export const GET = async (request: Request) => {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!PROCESSOR_SECRET || token !== PROCESSOR_SECRET) {
    return new Response(
      JSON.stringify({
        healthy: false,
        message: "Unauthorized",
      }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return new Response(
    JSON.stringify({
      healthy: true,
      message: "Email task processor is ready",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};
