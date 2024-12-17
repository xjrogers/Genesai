// src/types/stats.ts
import { ReactNode } from 'react';

export interface StatItem {
  name: string;
  value: string;
  iconName: 'phone' | 'trending-up' | 'clock' | 'users';
  color: string;
}
