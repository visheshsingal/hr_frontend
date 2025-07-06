# Frontend Deployment Guide

## Environment Variables Setup

### For Development
Create a `.env.development` file in the frontend directory:
```
REACT_APP_API_URL=https://hr-backend-pamu.onrender.com
REACT_APP_ENV=development
```

### For Production (Vercel)
Set these environment variables in your Vercel dashboard:

1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add the following variables:

```
REACT_APP_API_URL=https://hr-backend-pamu.onrender.com
REACT_APP_ENV=production
```

**Replace `your-backend-url.onrender.com` with your actual backend URL**

## Deployment Steps

### 1. Deploy Backend First
- Deploy your backend to Render or Railway
- Note down the production URL (e.g., `https://your-app-name.onrender.com`)

### 2. Update Frontend Environment
- Update the `REACT_APP_API_URL` in Vercel with your backend URL
- Make sure to include the full URL with `https://`

### 3. Deploy Frontend
- Connect your GitHub repository to Vercel
- Vercel will automatically detect it's a React app
- Deploy and your app will be live

## Important Notes

- **No proxy needed**: We removed the proxy configuration from package.json
- **CORS is configured**: Backend is set up to accept requests from Vercel domains
- **Environment variables**: Make sure to set them in Vercel dashboard, not in code
- **HTTPS required**: Production backend must use HTTPS

## Troubleshooting

1. **CORS errors**: Make sure your backend URL is correct and includes `https://`
2. **API not found**: Verify the backend is deployed and accessible
3. **Environment variables not working**: Check Vercel dashboard settings 