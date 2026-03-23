import { logger } from "./logger";

export type ApiResponse<T = any> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any;
};

export const utils = {
  successResponse(data: any, res: any) {
    return Response.json(
      {
        success: true,
        message: res.message || "Success",
        data,
      },
      { status: 200 }
    );
  },

  failureResponse(message: string, res: any, status: number = 400) {
    // Log the failure message to the file as well
    logger.error(`Failure Response: ${message}`, res?.errors);

    
    return Response.json(
      {
        success: false,
        message,
      },
      { status }
    );
  },
};

