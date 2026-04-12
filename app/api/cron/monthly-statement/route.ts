import { NextRequest, NextResponse } from 'next/server';
import { monthlyStatementService } from '@/services/monthlyStatementService';
import { logger } from '@/lib/logger';

// Set maxDuration to 60 seconds for Vercel Pro (10 seconds for Hobby)
export const maxDuration = 60;

/**
 * Monthly Statement Cron Job
 * Runs on the 1st of every month at 00:00 UTC
 * Sends monthly transaction statements to all users
 */
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
      console.warn('Missing or invalid authorization header in monthly statement cron request');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    if (token !== cronSecret) {
      console.warn('Invalid CRON_SECRET token provided for monthly statement');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Send monthly statements
    logger.info('Starting monthly statement cron job');
    const result = await monthlyStatementService.sendMonthlyStatementsToAllUsers();

    logger.info(`Monthly statement cron completed: ${result.sent} sent, ${result.failed} failed`);

    return NextResponse.json(
      {
        success: result.success,
        message: 'Monthly statements processed',
        sent: result.sent,
        failed: result.failed,
        total: result.total,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error('Error processing monthly statements in cron:', error);
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
        message: 'Monthly statement cron endpoint is healthy',
        schedule: 'Every 1st of the month at 00:00 UTC',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error('Error in monthly statement cron health check:', error);
    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
