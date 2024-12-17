import { logger } from '../logger';

export function formatDuration(minutes: number): string {
  try {
    return `${minutes.toFixed(1)}m`;
  } catch (error) {
    logger.error('Error formatting duration:', { error });
    return '0.0m';
  }
}

export function calculateDuration(startDate: string, endDate: string): number {
  try {
    return new Date(endDate).getTime() - new Date(startDate).getTime();
  } catch (error) {
    logger.error('Error calculating duration:', { error });
    return 0;
  }
}