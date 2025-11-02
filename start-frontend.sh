#!/bin/bash

echo "🚀 Starting Expense Tracker Frontend..."
echo ""
echo "Backend API: http://localhost:8080/api"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop"
echo ""

cd "$(dirname "$0")/frontend"
npm run dev

