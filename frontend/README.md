# AI-Enhanced Real-Time Occupancy Planning System - Frontend

This is the frontend application for the AI-Enhanced Real-Time Occupancy Planning System. It provides a modern, responsive user interface for managing workspace occupancy, desk assignments, and user preferences.

## Features

- Real-time occupancy monitoring
- Dynamic desk assignment
- Natural language query interface
- User preference management
- Responsive design for all devices

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   REACT_APP_API_BASE_URL=http://localhost:3001/api
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── pages/         # Page components
  ├── services/      # API and other services
  ├── store/         # Redux store and slices
  ├── theme.ts       # Material-UI theme configuration
  ├── App.tsx        # Main application component
  └── index.tsx      # Application entry point
```

## Dependencies

- React 18
- TypeScript
- Material-UI
- Redux Toolkit
- React Router
- Axios
- Socket.IO Client

## Development

The application uses TypeScript for type safety and better development experience. Key features include:

- Type-safe Redux store with TypeScript
- Material-UI components with custom theme
- Responsive layout with mobile-first design
- Real-time updates using Socket.IO
- RESTful API integration

## License

This project is licensed under the MIT License - see the LICENSE file for details. 