import { logger } from '../logger';

export function formatNumber(value: number): string {
  try {
    return new Intl.NumberFormat().format(value);
  } catch (error) {
    logger.error('Error formatting number:', { error, value });
    return '0';
  }
}