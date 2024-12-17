import type { Call } from '../../types';
import { logger } from '../logger';

export function matchesSearchTerm(call: Call, search: string): boolean {
  try {
    const searchableFields = [
      call.id,
      call.name,
      call.customer?.number,
      call.customer?.name,
      call.status,
      call.analysis?.summary
    ];

    return searchableFields.some(field => 
      field?.toString().toLowerCase().includes(search)
    );
  } catch (error) {
    logger.error('Error matching search term:', { error });
    return false;
  }
}