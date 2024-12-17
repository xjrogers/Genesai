# Vapi Dashboard

A React-based dashboard for visualizing Vapi platform call data with date-based filtering capabilities.

## Setup Instructions

1. Clone or download this repository
2. Install dependencies:
```bash
npm install
```
3. Create a `.env` file in the root directory and add your Vapi API key:
```
REACT_APP_VAPI_API_KEY=your_api_key_here
```
4. Start the development server:
```bash
npm start
```

## Project Structure

```
src/
  ├── components/
  │   └── filters/
  │       ├── AnalyticsFilters.tsx
  │       └── DateFilterSelect.tsx
  ├── hooks/
  │   └── dashboard/
  │       └── useDashboardData.ts
  ├── store/
  │   └── useDateRangeStore.ts
  ├── types/
  │   └── filters.ts
  └── utils/
      └── filters/
          └── dateUtils.ts
```

## Features

- Date-based filtering with options:
  - Last 24 Hours
  - Last 7 Days
  - Last 30 Days
  - This Month
  - Last Month
- Real-time data updates
- Loading states and error handling
- Responsive design

## Technologies Used

- React
- TypeScript
- Zustand (State Management)
- date-fns (Date Manipulation)
- Vapi API SDK
