import { utils } from "./api-response";
import { logger } from "./logger";
import connectDB from "./mongodb";

export const catchAsync = (fn: Function, schema?: any) => {
  return async (request: Request, ...args: any[]) => {
    // Create a mock 'res' object to store messages, similar to the Express pattern
    const res: any = { message: "" };
    try {
      // Ensure database is connected before running any logic
      await connectDB();

      // OPTIONAL: Standard Request Body Validation
      let body = {};
      if (schema && request.method !== "GET" && request.method !== "DELETE") {
        body = await request.json();
        const { error, value } = schema.validate(body);
        if (error) {
          return utils.failureResponse(error.details[0].message, res);
        }
        // Replace body with validated value (important for Joi defaults/transforms)
        body = value;
      }

      // Pass the (validated) body to the handler as the first argument
      return await fn(request, res, body, ...args);
    } catch (error: any) {

      await logger.error("API Route Error", error);
      return utils.failureResponse(error.message || "Internal Server Error", res, 500);
    }
  };
};


