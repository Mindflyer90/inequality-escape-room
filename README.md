# Inequality Escape Room

Educational escape room web application for learning linear inequalities, fully localized in Italian.

## Project Structure

```
inequality-escape-room/
├── frontend/          # React + Vite + Tailwind CSS
├── backend/           # Express.js API
└── package.json       # Root workspace configuration
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

3. Add your Anthropic API key to `backend/.env`:
```
ANTHROPIC_API_KEY=your_api_key_here
```

**Note:** The application uses Claude Sonnet 4.5 for:
- Generating inequality puzzles with step-by-step solutions
- Providing progressive hints in Italian
- If the API key is not configured, the system falls back to algorithmic puzzle generation

## Development

Run both frontend and backend:
```bash
npm run dev
```

Or run individually:
```bash
npm run dev:frontend
npm run dev:backend
```

## Build

Build both applications:
```bash
npm run build
```

## Testing

Run the automated API test suite:
```bash
node test-flow.js
```

This will verify:
- Health check endpoint
- Puzzle generation
- Hint generation (requires API key)
- Answer validation (correct and incorrect)

For manual testing checklist, see `TESTING_CHECKLIST.md`.

## Access the Application

Once running:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

## Deployment

For complete deployment instructions, see **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

Quick overview:
- **Frontend**: Deploy to Vercel (see `frontend/vercel.json`)
- **Backend**: Deploy to Railway or Render (see `backend/railway.json` or `backend/render.yaml`)

The deployment guide includes:
- Step-by-step deployment instructions
- Environment variable configuration
- Troubleshooting tips
- Customization guide for puzzles and themes
- Cost estimates and monitoring setup
