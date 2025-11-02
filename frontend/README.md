# Expense Tracker - Frontend

This is the frontend application for the Expense Tracker, built with React 18, TypeScript, and Vite.

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Running the Application

```bash
# Start development server
npm run dev
```

The frontend will be available at: http://localhost:3000

### Building for Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Features

- **Authentication**: Login, registration, and logout functionality
- **Protected Routes**: Automatic redirection based on authentication state
- **State Management**: Zustand for global state management
- **Form Validation**: React Hook Form with Zod schema validation
- **API Integration**: Axios with interceptors for token management
- **Modern UI**: Clean, responsive design with gradient backgrounds

## Project Structure

```
frontend/
├── src/
│   ├── api/          # API client and auth endpoints
│   ├── pages/        # Page components (Login, Register, Dashboard)
│   ├── store/        # Zustand state management
│   ├── App.tsx       # Main application component with routing
│   ├── App.css       # Application styles
│   └── main.tsx      # Application entry point
├── index.html        # HTML template
├── package.json      # Dependencies and scripts
├── tsconfig.json     # TypeScript configuration
└── vite.config.ts    # Vite configuration
```

## Environment Setup

The frontend is configured to proxy API requests to `http://localhost:8080` in development mode.

Make sure the backend server is running before starting the frontend.

## Technology Stack

- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **React Router**: Client-side routing
- **Zustand**: Lightweight state management
- **React Hook Form**: Performant form validation
- **Zod**: TypeScript-first schema validation
- **Axios**: HTTP client with interceptors
- **TanStack Query**: Data fetching and caching (configured)

