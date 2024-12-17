// src/utils/pagination/cursorUtils.ts
export function getNextCursor(batch: any[]): string | undefined {
  if (!batch.length) return undefined;
  
  const lastItem = batch[batch.length - 1];
  return lastItem?.id;
}

export function shouldContinueFetching(
  batch: any[],
  batchSize: number,
  totalFetched: number,
  maxItems: number = Infinity
): boolean {
  return batch.length === batchSize && totalFetched < maxItems;
}
