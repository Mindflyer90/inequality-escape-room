# Deployment Guide - Inequality Escape Room

This guide provides step-by-step instructions for deploying the Inequality Escape Room application to production.

## Overview

The application consists of two parts:
- **Frontend**: React + Vite application (deploy to Vercel)
- **Backend**: Express.js API (deploy to Railway or Render)

## Prerequisites

Before deploying, ensure you have:
- An Anthropic API key (get one at https://console.anthropic.com/)
- A Vercel account (for frontend)
- A Railway or Render account (for backend)
- Git repository with your code

## Backend Deployment

### Option 1: Deploy to Railway

1. **Create a new project on Railway**
   - Go to https://railway.app/
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect the Node.js backend

2. **Configure the service**
   - Set the root directory to `backend`
   - Railway will automatically use the `railway.json` configuration

3. **Set environment variables**
   - Go to your service settings → Variables
   - Add the following variables:
     ```
     ANTHROPIC_API_KEY=your_actual_api_key_here
     NODE_ENV=production
     PORT=3000
     ```

4. **Deploy**
   - Railway will automatically deploy your backend
   - Note the public URL (e.g., `https://your-app.railway.app`)

5. **Verify deployment**
   - Visit `https://your-app.railway.app/health`
   - You should see: `{"status":"ok"}`

### Option 2: Deploy to Render

1. **Create a new Web Service**
   - Go to https://render.com/
   - Click "New" → "Web Service"
   - Connect your GitHub repository

2. **Configure the service**
   - Name: `inequality-escape-room-api`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Set environment variables**
   - In the Environment section, add:
     ```
     ANTHROPIC_API_KEY=your_actual_api_key_here
     NODE_ENV=production
     PORT=3000
     ```

4. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy your backend
   - Note the public URL (e.g., `https://your-app.onrender.com`)

5. **Verify deployment**
   - Visit `https://your-app.onrender.com/health`
   - You should see: `{"status":"ok"}`

## Frontend Deployment

### Deploy to Vercel

1. **Create a new project on Vercel**
   - Go to https://vercel.com/
   - Click "Add New" → "Project"
   - Import your Git repository

2. **Configure the project**
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Set environment variables**
   - In the Environment Variables section, add:
     ```
     VITE_API_URL=https://your-backend-url.railway.app
     ```
   - Replace with your actual backend URL from Railway or Render
   - **Important**: Do NOT include a trailing slash

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your frontend
   - Your app will be available at `https://your-app.vercel.app`

5. **Verify deployment**
   - Visit your Vercel URL
   - The escape room should load
   - Try generating a puzzle to verify backend connectivity

## Environment Variables Reference

### Backend Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key for Claude | `sk-ant-api03-...` |
| `NODE_ENV` | No | Environment mode | `production` |
| `PORT` | No | Server port (default: 3000) | `3000` |

### Frontend Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_URL` | Yes | Backend API URL | `https://api.example.com` |

## Post-Deployment Checklist

After deploying both frontend and backend:

- [ ] Backend health check returns `{"status":"ok"}`
- [ ] Frontend loads without errors
- [ ] Can generate a new puzzle (easy, medium, hard)
- [ ] Can request hints (verify Claude integration)
- [ ] Can submit correct answers and see success message
- [ ] Can submit incorrect answers and see error message
- [ ] All text is displayed in Italian
- [ ] Animations work correctly
- [ ] Mobile responsive design works

## Troubleshooting

### Backend Issues

**Problem**: Health check fails
- **Solution**: Check that the backend is running and PORT is configured correctly

**Problem**: Hints return errors
- **Solution**: Verify ANTHROPIC_API_KEY is set correctly and has sufficient credits

**Problem**: CORS errors
- **Solution**: Ensure backend CORS is configured to allow your frontend domain

### Frontend Issues

**Problem**: "Network Error" when generating puzzles
- **Solution**: Check that VITE_API_URL is set correctly and points to your backend

**Problem**: Blank page after deployment
- **Solution**: Check browser console for errors, verify build completed successfully

**Problem**: Environment variables not working
- **Solution**: Ensure variables start with `VITE_` prefix and redeploy after changes

## Customization Guide

### Customizing Puzzle Difficulty

Edit `backend/config/puzzle-config.json`:

```json
{
  "difficulty": {
    "easy": { "minCoeff": 1, "maxCoeff": 5 },
    "medium": { "minCoeff": 1, "maxCoeff": 10 },
    "hard": { "minCoeff": -10, "maxCoeff": 10 }
  },
  "maxHints": 3,
  "operators": [">", "<", "≥", "≤"]
}
```

**Parameters**:
- `minCoeff` / `maxCoeff`: Range for inequality coefficients
- `maxHints`: Maximum number of hints per puzzle (default: 3)
- `operators`: Available inequality operators

After changes, redeploy the backend.

### Customizing UI Theme

The application uses Tailwind CSS with custom colors. To customize:

1. Edit `frontend/tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      'escape-dark': '#1a1a2e',
      'escape-accent': '#16213e',
      // Add your custom colors
    }
  }
}
```

2. Edit `frontend/src/index.css` for global styles

3. Redeploy the frontend

### Customizing Italian Text

All Italian text is centralized in `frontend/src/locales/it.json`:

```json
{
  "game": {
    "title": "Escape Room delle Disequazioni",
    "start": "Inizia il Gioco",
    // Modify text here
  }
}
```

After changes, redeploy the frontend.

### Adding New Puzzle Types

To add new puzzle types or modify generation logic:

1. Edit `backend/src/services/PuzzleGenerator.js`
2. Modify the `generate()` method
3. Update Claude prompts in `backend/src/services/ClaudeService.js` if needed
4. Redeploy the backend

## Monitoring and Maintenance

### Monitoring Backend Health

Set up monitoring for your backend:
- Railway: Built-in metrics and logs
- Render: Built-in metrics and logs
- External: Use UptimeRobot or similar to ping `/health` endpoint

### Checking API Usage

Monitor your Anthropic API usage:
- Visit https://console.anthropic.com/
- Check usage dashboard
- Set up billing alerts

### Updating Dependencies

Regularly update dependencies for security:

```bash
# Update frontend dependencies
cd frontend
npm update

# Update backend dependencies
cd backend
npm update
```

Test thoroughly after updates and redeploy.

## Cost Estimates

### Free Tier Limits

- **Vercel**: 100 GB bandwidth, unlimited deployments
- **Railway**: $5 free credit per month (≈500 hours)
- **Render**: 750 hours free per month
- **Anthropic API**: Pay-as-you-go (≈$0.003 per hint)

### Estimated Monthly Costs

For a classroom of 30 students:
- **Hosting**: Free (within free tier limits)
- **API Costs**: ~$5-10/month (assuming 10 puzzles per student)

## Support

For issues or questions:
- Check the troubleshooting section above
- Review logs in your deployment platform
- Verify environment variables are set correctly
- Test locally first with `npm run dev`

## Security Best Practices

1. **Never commit API keys** to Git
2. **Use environment variables** for all secrets
3. **Enable HTTPS** (automatic on Vercel/Railway/Render)
4. **Regularly update dependencies** for security patches
5. **Monitor API usage** to detect unusual activity
6. **Set up rate limiting** if needed (see backend code)

## Backup and Recovery

### Backing Up Configuration

Regularly backup:
- `backend/config/puzzle-config.json`
- `frontend/src/locales/it.json`
- Environment variable values (store securely)

### Rolling Back Deployments

- **Vercel**: Use the Deployments tab to rollback
- **Railway**: Use the Deployments tab to rollback
- **Render**: Use the Deploys tab to rollback

## Next Steps

After successful deployment:
1. Share the Vercel URL with students
2. Monitor usage and performance
3. Gather feedback for improvements
4. Customize puzzles based on curriculum needs
5. Consider adding analytics (Google Analytics, Plausible, etc.)
