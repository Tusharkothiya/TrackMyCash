import { NextRequest, NextResponse } from 'next/server';
import { transactionEmailService } from '@/services/transactionEmailService';
import { logger } from '@/lib/logger';

// Set maxDuration to 60 seconds for Vercel Pro (10 seconds for Hobby)
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    // Verify CRON_SECRET from request header
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      logger.error('CRON_SECRET environment variable not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Check authorization header format: Bearer <token>
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('Missing or invalid authorization header in cron request');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    if (token !== cronSecret) {
      console.warn('Invalid CRON_SECRET token provided');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Process pending email tasks
    logger.info('Processing pending email tasks via Vercel Cron');
    const result = await transactionEmailService.processPendingEmailTasks(); 

    logger.info(`Email processing completed: ${result.processed} emails sent, ${result.failed} failed`);

    return NextResponse.json(
      {
        success: true,
        message: 'Email tasks processed successfully',
        processed: result.processed,
        failed: result.failed,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error('Error processing email tasks in cron:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Health check endpoint for monitoring
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || !authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    if (token !== cronSecret) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        status: 'ok',
        message: 'Vercel Cron endpoint is healthy',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error('Error in cron health check:', error);
    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
